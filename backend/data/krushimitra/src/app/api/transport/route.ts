import { NextRequest, NextResponse } from "next/server";
import { MANDIS, ORIGIN_TOWNS, CROPS, PACKAGING_PER_KG, LOADING_PER_KG, LABOUR_PER_KG, MANDI_COMMISSION_PCT } from "@/lib/constants";
import { getHistory, ensureMarketData } from "@/lib/engine";
import { forecastSeries } from "@/lib/forecast";
import { computeQuotes, getDieselPrice } from "@/lib/geo";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const origin = (sp.get("from") ?? "CHIK").toUpperCase();
  const crop = (sp.get("crop") ?? "tomato").toLowerCase();
  const qty = Math.min(20000, Math.max(50, Number(sp.get("qty") ?? 500) || 500));

  await ensureMarketData();

  // expected sell price = forecast D+3 per mandi
  const expected: Record<string, number> = {};
  for (const m of MANDIS) {
    const s = await getHistory(crop, m.code, 45);
    const f = forecastSeries(s, 14);
    expected[m.code] = f.forecast[2]?.price ?? s[s.length - 1].modal;
  }

  const quotes = computeQuotes(origin, qty, expected);
  const diesel = await getDieselPrice();
  const best = quotes[0];
  const worst = quotes[quotes.length - 1];
  const cropObj = CROPS.find((c) => c.code === crop)!;
  const town = ORIGIN_TOWNS.find((t) => t.code === origin) ?? ORIGIN_TOWNS[0];

  const recommendation = {
    en: `Sell ${qty.toLocaleString("en-IN")} kg ${cropObj.nameEn} at ${best.mandiEn}. Net profit ₹${best.netProfit.toLocaleString("en-IN")} vs ₹${worst.netProfit.toLocaleString("en-IN")} at ${worst.mandiEn} — ${best.mandiEn} wins on price despite ${best.distanceKm > worst.distanceKm ? "longer" : "shorter"} distance.`,
    kn: `${qty.toLocaleString("en-IN")} ಕೆಜಿ ${cropObj.nameKn} ಅನ್ನು ${best.mandiKn}ಗೆ ಮಾರಿ. ನಿವ್ವಳ ಲಾಭ ₹${best.netProfit.toLocaleString("en-IN")} — ${worst.mandiKn}ನಲ್ಲಿ ಕೇವಲ ₹${worst.netProfit.toLocaleString("en-IN")}.`,
  };

  return NextResponse.json({
    ok: true, origin, originNameEn: town.nameEn, originNameKn: town.nameKn, crop, qty,
    diesel, quotes, recommendation,
    costModel: { packagingPerKg: PACKAGING_PER_KG, loadingPerKg: LOADING_PER_KG, labourPerKg: LABOUR_PER_KG, commissionPct: MANDI_COMMISSION_PCT * 100 },
  });
}
