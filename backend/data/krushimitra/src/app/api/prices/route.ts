// Price history + forecast + mandi comparison
import { NextRequest, NextResponse } from "next/server";
import { MANDIS, CROPS } from "@/lib/constants";
import { getHistory, todayIST, ensureMarketData } from "@/lib/engine";
import { forecastSeries, buildPriceAlert } from "@/lib/forecast";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const crop = (sp.get("crop") ?? "tomato").toLowerCase();
  const mandi = (sp.get("mandi") ?? "KOL").toUpperCase();
  const days = Math.min(180, Math.max(14, Number(sp.get("days") ?? 90) || 90));

  const cropObj = CROPS.find((c) => c.code === crop) ?? CROPS[0];
  await ensureMarketData();

  const series = await getHistory(crop, mandi, days);
  const fc = forecastSeries(series, 14);
  const last = series[series.length - 1];
  const alert = buildPriceAlert(cropObj.nameEn, cropObj.nameKn, MANDIS.find((m) => m.code === mandi)?.nameEn ?? mandi, MANDIS.find((m) => m.code === mandi)?.nameKn ?? mandi, last.modal, fc);

  // comparison across mandis (today + forecast)
  const compare = await Promise.all(
    MANDIS.map(async (m) => {
      const s = await getHistory(crop, m.code, 40);
      const f = forecastSeries(s, 14);
      const l = s[s.length - 1];
      return {
        code: m.code, nameEn: m.nameEn, nameKn: m.nameKn,
        now: l.modal, min: l.min, max: l.max, arrivals: l.arrivals,
        f5: f.forecast[4]?.price ?? l.modal, f14: f.forecast[13]?.price ?? l.modal,
        trend7: f.trend7d,
      };
    })
  );
  compare.sort((a, b) => b.now - a.now);

  return NextResponse.json({
    ok: true, crop, mandi, days, today: todayIST(),
    history: fc.history,
    minMax: series.map((p) => ({ date: p.date, min: p.min, max: p.max, arrivals: p.arrivals })),
    forecast: fc.forecast,
    trend7d: Math.round(fc.trend7d * 10) / 10,
    trend30d: Math.round(fc.trend30d * 10) / 10,
    pred5d: Math.round(fc.pred5d * 10) / 10,
    pred14d: Math.round(fc.pred14d * 10) / 10,
    accuracy: fc.accuracy, mape: fc.mape, direction: fc.direction,
    alert,
    compare,
  });
}
