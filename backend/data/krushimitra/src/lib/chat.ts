// ─────────────────────────────────────────────────────────────
// KrushiMitra chat engine — bilingual (auto-detects Kannada),
// data-grounded in live prices / weather / transport / news.
// Uses Gemini when GEMINI_API_KEY is present; otherwise a rich
// intent engine synthesises answers from real DB data.
// ─────────────────────────────────────────────────────────────
import { db } from "@/db";
import { chatMessages } from "@/db/schema";
import { MANDIS, CROPS, DISTRICTS, VALUE_PRODUCTS, PROCESSING_UNITS } from "./constants";
import { getHistory } from "./engine";
import { forecastSeries } from "./forecast";
import { getDistrictWeather } from "./weather";
import { computeQuotes } from "./geo";
import { getNews } from "./news";
import { formatINR } from "./format";

export function detectLang(text: string): "kn" | "en" {
  const knChars = (text.match(/[\u0C80-\u0CFF]/g) || []).length;
  return knChars >= 2 ? "kn" : "en";
}

type Intent = "best_mandi" | "price" | "weather" | "waste" | "transport" | "greeting" | "thanks" | "news" | "help";

function detectIntent(q: string): Intent {
  const t = q.toLowerCase();
  if (/ವಂದ(adapter)?|thank|ಧನ್ಯವಾದ/.test(t)) return "thanks";
  if (/^(hi|hello|hey|namask|ನಮಸ್ಕ|ಹಲೋ|ಹಾಯ್)/.test(t.trim()) && t.trim().length < 24) return "greeting";
  if (/ಹಾಳ|damaged|waste|spoil|ಕೆಟ್ಟಿ|ತ್ಯಾಜ್ಯ|crash|rotten|ಮೊಳಕೆ/.test(t)) return "waste";
  if (/ಮಳೆ|ಹವಾಮಾನ|weather|rain|ಬಿಸಿಲು|temperature/.test(t)) return "weather";
  if (/ಸಾರಿಗೆ|transport|distance|ದೂರ|diesel|ಡೀಸೆಲ್|profit|ಲಾಭ/.test(t)) return "transport";
  if (/news|ಸುದ್ದಿ|export|ರಫ್ತು|ban|ನಿಷೇಧ/.test(t)) return "news";
  if (/(best|ಉತ್ತಮ|ಯಾವ).*(ಮಂಡಿ|mandi)|ಮಂಡಿ.*(ಒಳ್ಳೆ|best)|where.*sell|ಎಲ್ಲಿ ಮಾರ/.test(t)) return "best_mandi";
  if (/ಬೆಲೆ|price|ದರ|rate|ಮಂಡಿ|mandi/.test(t)) return "price";
  return "help";
}

function extractCrop(q: string): string {
  const t = q.toLowerCase();
  if (/tomato|ಟೊಮೇಟೊ|ಟೊಮಾಟ/.test(t)) return "tomato";
  if (/onion|ಈರುಳ್ಳಿ/.test(t)) return "onion";
  if (/ragi|millet|ರಾಗಿ/.test(t)) return "ragi";
  return "tomato";
}

function extractQty(q: string): number {
  const m = q.match(/(\d{2,6})/);
  if (m) {
    const n = Number(m[1]);
    if (n >= 10 && n <= 100000) return n;
  }
  return 500;
}

function extractDistrict(q: string): string {
  const t = q.toLowerCase();
  for (const d of DISTRICTS) {
    if (
      t.includes(d.nameEn.toLowerCase().split(" ")[0]) ||
      q.includes(d.nameKn)
    ) return d.code;
  }
  return "KOL";
}

async function snapshot() {
  // current + forecast for every crop/mandi
  const data: Record<string, Record<string, { now: number; f3: number; f5: number; trend7: number }>> = {};
  for (const crop of CROPS) {
    data[crop.code] = {};
    for (const mandi of MANDIS) {
      const s = await getHistory(crop.code, mandi.code, 45);
      const f = forecastSeries(s, 14);
      const last = s[s.length - 1]?.modal ?? 0;
      data[crop.code][mandi.code] = {
        now: last,
        f3: f.forecast[2]?.price ?? last,
        f5: f.forecast[4]?.price ?? last,
        trend7: f.trend7d,
      };
    }
  }
  return data;
}

const knCrop = (c: string) => (c === "tomato" ? "ಟೊಮೇಟೊ" : c === "onion" ? "ಈರುಳ್ಳಿ" : "ರಾಗಿ");

export async function answerQuestion(message: string, sessionId: string): Promise<{ reply: string; lang: "kn" | "en" }> {
  const lang = detectLang(message);
  const intent = detectIntent(message);
  const crop = extractCrop(message);

  // persist user msg
  db.insert(chatMessages).values({ sessionId, role: "user", lang, content: message }).catch(() => {});

  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const reply = await geminiReply(message, lang, geminiKey, await snapshot());
      db.insert(chatMessages).values({ sessionId, role: "assistant", lang, content: reply }).catch(() => {});
      return { reply, lang };
    } catch { /* fall through to engine */ }
  }

  const reply = await engineReply(intent, crop, message, lang);
  db.insert(chatMessages).values({ sessionId, role: "assistant", lang, content: reply }).catch(() => {});
  return { reply, lang };
}

async function engineReply(intent: Intent, crop: string, message: string, lang: "kn" | "en"): Promise<string> {
  const snap = await snapshot();
  const c = CROPS.find((x) => x.code === crop)!;

  if (intent === "greeting") {
    return lang === "kn"
      ? "ನಮಸ್ಕಾರ ರೈತ ಬಂಧು! ನಾನು ಕೃಷಿಮಿತ್ರ.\n\nನಿಮ್ಮ ಪ್ರಶ್ನೆ ಕೇಳಿ — 'ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು?', 'ಯಾವ ಮಂಡಿ ಒಳ್ಳೆಯದು?', 'ಹಾಳಾದ ಈರುಳ್ಳಿ ಏನು ಮಾಡಲಿ?' — ಕನ್ನಡದಲ್ಲೇ ಉತ್ತರ ಸಿಗುತ್ತದೆ."
      : "Namaskara! I'm KrushiMitra — your market intelligence assistant for Karnataka.\n\nAsk me things like:\n• Best mandi for 500 kg tomato?\n• Kolar weather today?\n• My onion stock is damaged — now what?";
  }
  if (intent === "thanks") {
    return lang === "kn"
      ? "ಧನ್ಯವಾದ! ಮತ್ತೆ ಬೇಕಾದಾಗ ಕೇಳಿ — ನಾನು ಇಲ್ಲೇ ಇರುತ್ತೇನೆ. ಶುಭ ಬೆಳೆ ಬರಲಿ!"
      : "You're welcome! Ask anytime — I'll be here with the latest mandi intelligence.";
  }

  if (intent === "price" || intent === "best_mandi") {
    const rows = MANDIS.map((m) => {
      const d = snap[crop][m.code];
      return { name: lang === "kn" ? m.nameKn : m.nameEn, now: d.now, f5: d.f5, trend: d.trend7 };
    }).sort((a, b) => b.now - a.now);
    const best = rows[0];
    const list = rows.map((r, i) => `${i + 1}. ${r.name}: ₹${r.now.toFixed(0)}/kg (5d → ₹${r.f5.toFixed(0)})`).join("\n");
    if (lang === "kn") {
      return `ಇಂದಿನ ${knCrop(crop)} ಬೆಲೆಗಳು (5 ಮಂಡಿಗಳು):\n${list}\n\n✓ ಈ ವಾರದ ಟ್ರೆಂಡ್: ${best.trend >= 0 ? "+" : ""}${best.trend.toFixed(1)}%\n✓ ಹೆಚ್ಚಿನ ಬೆಲೆ: ${best.name} — ₹${best.now.toFixed(0)}/ಕೆಜಿ\n\n💡 ಸಾರಿಗೆ ವೆಚ್ಚವನ್ನೂ ಲೆಕ್ಕ ಹಾಕಿ — ನಿಖರ ಲಾಭಕ್ಕೆ "Transport & Profit" ಪುಟ ನೋಡಿ.`;
    }
    return `Today's ${c.nameEn} prices across mandis:\n${list}\n\n✓ Highest right now: ${best.name} at ₹${best.now.toFixed(0)}/kg\n✓ 7-day trend: ${best.trend >= 0 ? "+" : ""}${best.trend.toFixed(1)}%\n\nTip: factor transport before deciding — open the Transport & Profit page for exact net profit per mandi.`;
  }

  if (intent === "weather") {
    const dist = extractDistrict(message);
    const w = await getDistrictWeather(dist);
    const today = w.days[0]; const tmr = w.days[1];
    const topRisk = w.risks.find((r) => r.cropCode === crop) ?? w.risks[0];
    if (lang === "kn") {
      return `${w.nameKn} — ಹವಾಮಾನ ವರದಿ:\n\n• ಇಂದು: ${today.tMax}°C / ${today.tMin}°C, ಮಳೆ ${today.rainMm}mm (${today.rainProb}% ಸಾಧ್ಯತೆ), ಆರ್ದ್ರತೆ ${today.humidity}%\n• ನಾಳೆ: ${tmr.tMax}°C, ಮಳೆ ${tmr.rainMm}mm\n• 7 ದಿನ ಒಟ್ಟು ಮಳೆ: ${w.totalRain}mm\n\n${knCrop(crop)} ಅಪಾಯ ಮಟ್ಟ: ${topRisk.level === "HIGH" ? "ಹೆಚ್ಚು" : topRisk.level === "MEDIUM" ? "ಮಧ್ಯಮ" : "ಕಡಿಮೆ"}\n${topRisk.reasonKn}`;
    }
    return `${w.nameEn} — weather report:\n\n• Today: ${today.tMax}°C / ${today.tMin}°C, rain ${today.rainMm}mm (${today.rainProb}% chance), humidity ${today.humidity}%\n• Tomorrow: ${tmr.tMax}°C, rain ${tmr.rainMm}mm\n• 7-day total rain: ${w.totalRain}mm\n\n${c.nameEn} risk level: ${topRisk.level}\n${topRisk.reasonEn}`;
  }

  if (intent === "waste") {
    const qty = extractQty(message);
    const products = VALUE_PRODUCTS.filter((p) => p.cropCode === crop).slice(0, 3);
    const units = PROCESSING_UNITS.filter((u) => u.crops.includes(crop)).slice(0, 2);
    if (lang === "kn") {
      const opts = products.map((p, i) => {
        const productQty = Math.round((qty * p.yieldPct) / 100);
        const revenue = Math.round(productQty * p.sellPricePerKg);
        return `${i + 1}. ${p.productKn} — ಸುಮಾರು ${formatINR(revenue)} ದೊರೆಯುತ್ತದೆ (${productQty}kg ಉತ್ಪನ್ನ)`;
      }).join("\n");
      const unitKn = units.map((u) => `${u.name}, ${u.districtKn} (ದೂರ: ~${u.phone})`).join("\n");
      return `ಚಿಂತಿಸಬೇಡಿ! ಹಾಳಾದ ${knCrop(crop)} ಅನ್ನೂ ಲಾಭಕ್ಕೆ ಬದಲಾಯಿಸಬಹುದು. ${qty}kg ಗೆ ಆಯ್ಕೆಗಳು:\n\n${opts}\n\nಹತ್ತಿರದ ಘಟಕಗಳು:\n${unitKn}\n\n✓ ವಿವರ ಸಂಗ್ರಹ "Waste-to-Value" ಪುಟದಲ್ಲಿದെ.`;
    }
    const opts = products.map((p, i) => {
      const productQty = Math.round((qty * p.yieldPct) / 100);
      const revenue = Math.round(productQty * p.sellPricePerKg);
      return `${i + 1}. ${p.productEn} — you'd get ~${productQty}kg product ≈ ${formatINR(revenue)}`;
    }).join("\n");
    const unitEn = units.map((u) => `${u.name}, ${u.districtEn} (${u.phone})`).join("\n");
    return `Don't worry — your damaged ${c.nameEn.toLowerCase()} can still earn. For ${qty}kg:\n\n${opts}\n\nNearest processing units:\n${unitEn}\n\nFull step-by-step guides are on the Waste-to-Value page.`;
  }

  if (intent === "transport") {
    const qty = extractQty(message);
    const d3: Record<string, number> = {};
    for (const m of MANDIS) d3[m.code] = snap[crop][m.code].f3;
    const quotes = computeQuotes("CHIK", qty, d3); // default origin Chikkaballapur (tomato belt)
    const best = quotes[0]; const second = quotes[1];
    if (lang === "kn") {
      return `${qty}kg ${knCrop(crop)} — ಚಿಕ್ಕಬಳ್ಳಾಪುರದಿಂದ ಲಾಭ ಲೆಕ್ಕ:\n\n✓ ${best.mandiKn}: ಲಾಭ ${formatINR(best.netProfit)} (ಬೆಲೆ ₹${best.sellPrice}/kg, ದೂರ ${best.distanceKm}km, ಸಾರಿಗೆ ${formatINR(best.transportCost)})\n✗ ${second.mandiKn}: ಲಾಭ ${formatINR(second.netProfit)} (ದೂರ ${second.distanceKm}km)\n\n🏆 ಅಂದರೆ: ${best.mandiKn} ಗೆ ಹೋಗಿ! ನಿಖರ ಲೆಕ್ಕಕ್ಕೆ Transport ಪುಟದಲ್ಲಿ ನಿಮ್ಮ ಊರು, ಪ್ರಮಾಣ ಇಡಿ.`;
    }
    return `${qty}kg ${c.nameEn} — profit math from Chikkaballapur (default origin):\n\n✓ ${best.mandiEn}: net ${formatINR(best.netProfit)} (price ₹${best.sellPrice}/kg · ${best.distanceKm}km · transport ${formatINR(best.transportCost)})\n✗ ${second.mandiEn}: net ${formatINR(second.netProfit)}\n\nWinner: ${best.mandiEn}. For YOUR village, use the Transport & Profit page — it takes location + quantity.`;
  }

  if (intent === "news") {
    const { items } = await getNews();
    const rel = items.filter((n) => n.cropCode === crop || n.cropCode === "general").slice(0, 3);
    if (lang === "kn") {
      const lines = rel.map((n) => `• ${n.title}`).join("\n");
      return `${knCrop(crop)} ಸಂಬಂಧಿತ ಇತ್ತೀಚಿನ ಸುದ್ದಿಗಳು:\n\n${lines}\n\nಪ್ರತಿ ಸುದ್ದಿಯ ಪರಿಣಾಮ ವಿಶ್ಲೇಷಣೆ "News & Insights" ಪುಟದಲ್ಲಿ ಕನ್ನಡದಲ್ಲಿದೆ.`;
    }
    const lines = rel.map((n) => `• ${n.title}`).join("\n");
    return `Latest ${c.nameEn} / Karnataka agri news:\n\n${lines}\n\nImpact analysis for each headline is on the News & Insights page.`;
  }

  // help fallback
  if (lang === "kn") {
    return "ನಾನು ಇವೆಲ್ಲ ಕೇಳಬಹುದು:\n\n• 'ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟು?' — ಪ್ರಸ್ತುತ ಬೆಲೆ + ಮುನ್ಸೂಚನೆ\n• '500kg ಈರುಳ್ಳಿಗೆ ಯಾವ ಮಂಡಿ?' — ಲಾಭ ಹೋಲಿಕೆ\n• 'ಕೋಲಾರದಲ್ಲಿ ಮಳೆ ಬರುತ್ತದೆಯೇ?' — ಹವಾಮಾನ\n• 'ಹಾಳಾದ ರಾಗಿ ಏನು ಮಾಡಲಿ?' — ಮೌಲ್ಯವರ್ಧನೆ ಆಯ್ಕೆಗಳು\n\nನಿಮ್ಮ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ!";
  }
  return "I can help with:\n\n• 'Tomato price today?' — live prices + forecast\n• 'Best mandi for 500kg onion?' — profit comparison\n• 'Will it rain in Kolar?' — weather & crop risk\n• 'Damaged ragi — what to do?' — value-added options\n\nType your question in Kannada or English.";
}

async function geminiReply(message: string, lang: "kn" | "en", key: string, snap: Awaited<ReturnType<typeof snapshot>>): Promise<string> {
  const ctx = JSON.stringify(snap).slice(0, 6000);
  const sys = `You are KrushiMitra, a Karnataka agricultural market assistant. Reply ONLY in ${lang === "kn" ? "Kannada (ಕನ್ನಡ)" : "English"}. Simple farmer-friendly language. Use this live data (₹/kg modal prices, f3=day+3 forecast) to answer with specific numbers: ${ctx}. Keep under 180 words. No emojis, use ✓ sparingly.`;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: sys }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { temperature: 0.35, maxOutputTokens: 500 },
      }),
      signal: AbortSignal.timeout(9000),
    }
  );
  if (!res.ok) throw new Error("gemini " + res.status);
  const j = await res.json();
  const text = j?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("empty gemini");
  return text as string;
}
