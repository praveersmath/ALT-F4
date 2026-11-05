// Aggregated home-dashboard payload
import { NextResponse } from "next/server";
import { MANDIS, CROPS } from "@/lib/constants";
import { getHistory, ensureMarketData } from "@/lib/engine";
import { forecastSeries, buildPriceAlert } from "@/lib/forecast";
import { getDistrictWeather } from "@/lib/weather";
import { getNews } from "@/lib/news";
import { getDieselPrice } from "@/lib/geo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureMarketData();
    const diesel = await getDieselPrice();
    const { items: news, mood } = await getNews();

    const crops = [];
    const alertsList: { cropCode: string; mandiCode: string; en: string; kn: string; kind: string }[] = [];

    for (const crop of CROPS) {
      let best = { mandiCode: "", now: 0, f5: 0, trend7: 0, sparkline: [] as number[], min: 0, max: 0, arrivals: 0 };
      const mandiPrices: { code: string; now: number; }[] = [];
      for (const mandi of MANDIS) {
        const series = await getHistory(crop.code, mandi.code, 45);
        const last = series[series.length - 1];
        const f = forecastSeries(series, 14);
        mandiPrices.push({ code: mandi.code, now: last.modal });
        if (last.modal > best.now) {
          best = {
            mandiCode: mandi.code, now: last.modal, f5: f.forecast[4]?.price ?? last.modal,
            trend7: f.trend7d, sparkline: series.slice(-30).map((p) => p.modal),
            min: last.min, max: last.max, arrivals: last.arrivals,
          };
        }
        const al = buildPriceAlert(crop.nameEn, crop.nameKn, mandi.nameEn, mandi.nameKn, last.modal, f);
        if (al) alertsList.push({ cropCode: crop.code, mandiCode: mandi.code, en: al.en, kn: al.kn, kind: al.kind });
      }
      crops.push({
        code: crop.code, nameEn: crop.nameEn, nameKn: crop.nameKn, color: crop.color,
        now: best.now, min: best.min, max: best.max, arrivals: best.arrivals,
        trend7: best.trend7, f5: best.f5, sparkline: best.sparkline,
        bestMandi: best.mandiCode, mandiPrices,
      });
    }

    // weather summary (default: Kolar)
    const weather = await getDistrictWeather("KOL");
    const weatherAlertWx = weather.advisories.map((a) => ({
      cropCode: "weather", mandiCode: weather.districtCode, en: a.en, kn: a.kn, kind: a.level,
    }));

    return NextResponse.json({
      ok: true,
      crops,
      mandis: MANDIS,
      mood,
      alerts: [...alertsList, ...weatherAlertWx].slice(0, 6),
      weather: { district: weather.nameEn, districtKn: weather.nameKn, code: weather.districtCode, today: weather.days[0], tomorrow: weather.days[1], source: weather.source },
      diesel,
      newsCount: news.length,
      newsSource: news.length ? "live-or-cache" : "none",
      topNews: news.slice(0, 2),
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
