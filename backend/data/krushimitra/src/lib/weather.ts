// ─────────────────────────────────────────────────────────────
// Weather engine — REAL 7-day forecasts via Open-Meteo (free, no
// key), cached in PostgreSQL, with a deterministic offline
// fallback. Includes crop-impact risk analysis (bilingual).
// ─────────────────────────────────────────────────────────────
import { db } from "@/db";
import { weatherCache } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { DISTRICTS } from "@/lib/constants";
import { rainIndex, todayIST, addDays } from "./engine";
import { clamp } from "./format";

export interface DayForecast {
  date: string;
  tMax: number;
  tMin: number;
  rainMm: number;
  rainProb: number;
  humidity: number;
  windKmh: number;
}

export interface CropRisk {
  cropCode: string;
  level: "LOW" | "MEDIUM" | "HIGH";
  score: number; // 0-100
  reasonEn: string;
  reasonKn: string;
}

export interface DistrictWeather {
  districtCode: string;
  nameEn: string;
  nameKn: string;
  days: DayForecast[];
  totalRain: number;
  avgHumidity: number;
  maxTemp: number;
  risks: CropRisk[];
  advisories: { en: string; kn: string; level: "info" | "warning" | "critical" }[];
  source: "open-meteo" | "cache" | "fallback";
  fetchedAt: string;
}

async function fetchOpenMeteo(lat: number, lng: number): Promise<DayForecast[]> {
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,relative_humidity_2m_mean,wind_speed_10m_max` +
    `&timezone=Asia%2FKolkata&forecast_days=7`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6500);
  try {
    const res = await fetch(url, { signal: controller.signal, next: { revalidate: 1800 } });
    if (!res.ok) throw new Error(`open-meteo ${res.status}`);
    const j = await res.json();
    const d = j.daily;
    const out: DayForecast[] = [];
    for (let i = 0; i < 7; i++) {
      out.push({
        date: d.time[i],
        tMax: Math.round(d.temperature_2m_max[i] * 10) / 10,
        tMin: Math.round(d.temperature_2m_min[i] * 10) / 10,
        rainMm: Math.round((d.precipitation_sum[i] ?? 0) * 10) / 10,
        rainProb: d.precipitation_probability_max?.[i] ?? 0,
        humidity: Math.round(d.relative_humidity_2m_mean?.[i] ?? 60),
        windKmh: Math.round((d.wind_speed_10m_max?.[i] ?? 8) * 10) / 10,
      });
    }
    return out;
  } finally {
    clearTimeout(timer);
  }
}

/** Deterministic climatology fallback keyed to district+date. */
function fallbackForecast(districtCode: string): DayForecast[] {
  const today = todayIST();
  const out: DayForecast[] = [];
  const seedShift = districtCode.charCodeAt(0) + districtCode.charCodeAt(1);
  for (let i = 0; i < 7; i++) {
    const date = addDays(today, i);
    const ri = rainIndex(`${districtCode}-daily`, date);
    const doy = Number(date.slice(5, 7)) * 30;
    const tMax = clamp(31 + Math.sin((doy + seedShift) / 58) * 4 - ri / 120, 24, 39);
    out.push({
      date,
      tMax: Math.round(tMax * 10) / 10,
      tMin: Math.round((tMax - 9.5) * 10) / 10,
      rainMm: Math.round(clamp((ri - 120) / 14, 0, 68) * 10) / 10,
      rainProb: Math.round(clamp((ri - 90) / 2, 3, 96)),
      humidity: Math.round(clamp(52 + ri / 6, 40, 95)),
      windKmh: Math.round((7 + (seedShift % 5) + i * 1.3) * 10) / 10,
    });
  }
  return out;
}

export async function getDistrictWeather(districtCode: string): Promise<DistrictWeather> {
  const district = DISTRICTS.find((d) => d.code === districtCode) ?? DISTRICTS[0];
  let days: DayForecast[] | null = null;
  let source: DistrictWeather["source"] = "open-meteo";

  // 1) live fetch
  try {
    days = await fetchOpenMeteo(district.lat, district.lng);
    // persist cache (fire & forget)
    db.insert(weatherCache)
      .values({ districtCode, payload: { days }, source: "open-meteo" })
      .catch(() => {});
  } catch {
    // 2) DB cache (up to 8h old)
    try {
      const rows = await db
        .select()
        .from(weatherCache)
        .where(eq(weatherCache.districtCode, districtCode))
        .orderBy(desc(weatherCache.fetchedAt))
        .limit(1);
      const rec = rows[0];
      if (rec && Date.now() - new Date(rec.fetchedAt).getTime() < 8 * 3600e3) {
        days = (rec.payload as { days: DayForecast[] }).days;
        source = "cache";
      }
    } catch { /* noop */ }
    // 3) deterministic fallback
    if (!days) {
      days = fallbackForecast(districtCode);
      source = "fallback";
    }
  }

  return { ...analyzeDistrict(district.code, district.nameEn, district.nameKn, days), source, fetchedAt: new Date().toISOString() };
}

function analyzeDistrict(code: string, nameEn: string, nameKn: string, days: DayForecast[]) {
  const totalRain = Math.round(days.reduce((a: number, d: DayForecast) => a + d.rainMm, 0) * 10) / 10;
  const avgHumidity = Math.round(days.reduce((a: number, d: DayForecast) => a + d.humidity, 0) / days.length);
  const maxTemp = Math.max(...days.map((d) => d.tMax));
  const heavyRainDays = days.filter((d) => d.rainMm >= 25).length;
  const drySpell = days.every((d) => d.rainMm < 2);
  const humid = avgHumidity >= 80;
  const hot = maxTemp >= 36;

  const risks: CropRisk[] = [];
  // TOMATO — rain & humidity sensitive
  {
    let score = 15;
    if (heavyRainDays >= 2) score += 55; else if (heavyRainDays === 1) score += 30;
    if (humid) score += 20;
    if (hot) score += 12;
    score = clamp(score, 5, 96);
    const level = score >= 66 ? "HIGH" : score >= 38 ? "MEDIUM" : "LOW";
    risks.push({
      cropCode: "tomato", level, score,
      reasonEn:
        heavyRainDays >= 2
          ? `${heavyRainDays} days of heavy rain (>25mm) → waterlogging & fungal disease risk; supply may drop and prices can rise 15–25%.`
          : humid
            ? `High humidity (${avgHumidity}%) — early blight / leaf disease watch.`
            : "Weather mostly favourable for standing tomato crop.",
      reasonKn:
        heavyRainDays >= 2
          ? `${heavyRainDays} ದಿನ ಭಾರೀ ಮಳೆ → ನೀರು ನಿಲ್ಲುವ ಅಪಾಯ, ಶಿಲೀಂಧ್ರ ರೋಗ. ಬೆಲೆ 15–25% ಏರಿಕೆ ಸಾಧ್ಯತೆ.`
          : humid
            ? `ಹೆಚ್ಚು ಆರ್ದ್ರತೆ (${avgHumidity}%) — ಎಲೆ ರೋಗದ ಎಚ್ಚರಿಕೆ.`
            : "ಟೊಮೇಟೊ ಬೆಳೆಗೆ ಹವಾಮಾನ ಅनुಕೂಲ.",
    });
  }
  // ONION — storage rot & sprouting with rain/humidity
  {
    let score = 12;
    if (heavyRainDays >= 1) score += 42;
    if (humid) score += 26;
    if (hot && humid) score += 10;
    score = clamp(score, 5, 94);
    const level = score >= 62 ? "HIGH" : score >= 36 ? "MEDIUM" : "LOW";
    risks.push({
      cropCode: "onion", level, score,
      reasonEn:
        heavyRainDays >= 1
          ? `Rain + humidity → storage rot & sprouting risk for harvested onion. Move stock under cover.`
          : "Dry-ish conditions — good for curing and storing onion.",
      reasonKn:
        heavyRainDays >= 1
          ? `ಮಳೆ + ಆರ್ದ್ರತೆ → ಸಂಗ್ರಹ ಈರುಳ್ಳಿ ಕೊಳೆ/ಮೊಳಕೆ ಅಪಾಯ. ಈರುಳ್ಳಿಯನ್ನು ಆವರಣಕ್ಕೆ ಸರಿಸಿ.`
          : "ಒಣ ಹವಾಮಾನ — ಈರುಳ್ಳಿ ಸಂಗ್ರಹಣೆಗೆ ಒಳ್ಳೆಯದು.",
    });
  }
  // RAGI — hardy; drought delays, harvest rain hurts
  {
    let score = 10;
    if (drySpell && hot) score += 45; else if (drySpell) score += 22;
    if (heavyRainDays >= 3) score += 35;
    score = clamp(score, 5, 92);
    const level = score >= 60 ? "HIGH" : score >= 33 ? "MEDIUM" : "LOW";
    risks.push({
      cropCode: "ragi", level, score,
      reasonEn:
        drySpell
          ? `Dry spell forecast in ${nameEn} → ragi earhead filling may suffer; harvest could shift ~1 week.`
          : heavyRainDays >= 3
            ? "Prolonged rain may delay ragi harvest / threshing."
            : "Adequate moisture — ragi progressing well.",
      reasonKn:
        drySpell
          ? `${nameKn}ನಲ್ಲಿ ಬರಗಾಲ ನಿರೀಕ್ಷೆ → ರಾಗಿ ಕೊಯ್ಲು ~1 ವಾರ ತಡವಾಗಬಹುದು.`
          : heavyRainDays >= 3
            ? "ಮುರಿಯದ ಮಳೆ ರಾಗಿ ಕೊಯ್ಲು/ಒಡಲಿ ಕೆಲಸ ತಡಗೊಳಿಸಬಹುದು."
            : "ಸಾಕಷ್ಟು ತೇವಾಂಶ — ರಾಗಿ ಬೆಳೆ ಚೇತರಿಕೆಯಲ್ಲಿದೆ.",
    });
  }

  // district-level advisories
  const advisories: DistrictWeather["advisories"] = [];
  if (heavyRainDays >= 2) {
    advisories.push({
      level: "critical",
      en: `Heavy rain predicted in ${nameEn} for ${heavyRainDays} days — tomato prices may rise ~20% on supply drop; protect standing crop drainage.`,
      kn: `ಎಚ್ಚರಿಕೆ: ${nameKn}ದಲ್ಲಿ ${heavyRainDays} ದಿನ ಭಾರೀ ಮಳೆ ನಿರೀಕ್ಷೆ — ಟೊಮೇಟೊ ಪೂರೈಕೆ ಕುಸಿದು ಬೆಲೆ ~20% ಏರಿಕೆಯಾಗಬಹುದು.`,
    });
  }
  if (drySpell && code === "RAI") {
    advisories.push({
      level: "warning",
      en: `Dry spell in Raichur — ragi harvest may be delayed by ~1 week; plan irrigation for standing crop.`,
      kn: `ರಾಯಚೂರಿನಲ್ಲಿ ಬರಗಾಲ — ರಾಗಿ ಕೊಯ್ಲು 1 ವಾರ ತಡವಾಗಬಹುದು; ನೀರಾವರಿ ಯೋಜನೆ ಮಾಡಿ.`,
    });
  }
  if (humid && heavyRainDays === 0) {
    advisories.push({
      level: "warning",
      en: `High humidity in ${nameEn} (${avgHumidity}%) — spray preventive fungicide on tomato/onion within 2 days.`,
      kn: `${nameKn}ದಲ್ಲಿ ಹೆಚ್ಚು ಆರ್ದ್ರತೆ (${avgHumidity}%) — ಟೊಮೇಟೊ/ಈರುಳ್ಳಿಗೆ 2 ದಿನದಲ್ಲಿ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ.`,
    });
  }
  if (advisories.length === 0) {
    advisories.push({
      level: "info",
      en: `No severe weather stress in ${nameEn} this week. Good window for field operations and transport.`,
      kn: `${nameKn}ದಲ್ಲಿ ಈ ವಾರ ತೀವ್ರ ಹವಾಮಾನ ತೊಂದರೆ ಇಲ್ಲ. ಕೃಷಿ ಕೆಲಸಕ್ಕೆ ಒಳ್ಳೆಯ ಸಮಯ.`,
    });
  }

  return { districtCode: code, nameEn, nameKn, days, totalRain, avgHumidity, maxTemp, risks, advisories };
}

export async function getAllDistrictsWeather(): Promise<DistrictWeather[]> {
  const results: DistrictWeather[] = [];
  for (const d of DISTRICTS) results.push(await getDistrictWeather(d.code));
  return results;
}
