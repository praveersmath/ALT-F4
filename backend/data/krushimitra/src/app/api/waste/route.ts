import { NextRequest, NextResponse } from "next/server";
import { VALUE_PRODUCTS, PROCESSING_UNITS, ORIGIN_TOWNS, MANDIS } from "@/lib/constants";
import { getHistory } from "@/lib/engine";
import { roadDistanceKm } from "@/lib/geo";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const crop = (sp.get("crop") ?? "tomato").toLowerCase();
  const condition = (sp.get("condition") ?? "damaged") as "damaged" | "price_crash" | "surplus";
  const qty = Math.min(50000, Math.max(50, Number(sp.get("qty") ?? 200) || 200));
  const from = (sp.get("from") ?? "CHIK").toUpperCase();

  const origin = ORIGIN_TOWNS.find((t) => t.code === from) ?? ORIGIN_TOWNS[0];

  // crash reference price: lowest current mandi price
  let rawPrice = 8;
  try {
    let lowest = Infinity;
    for (const m of MANDIS) {
      const s = await getHistory(crop, m.code, 3);
      lowest = Math.min(lowest, s[s.length - 1]?.modal ?? Infinity);
    }
    if (isFinite(lowest)) rawPrice = Math.min(lowest, condition === "damaged" ? 5 : lowest);
  } catch { rawPrice = 5; }

  const products = VALUE_PRODUCTS.filter((p) => p.cropCode === crop).map((p) => {
    const productQty = Math.round((qty * p.yieldPct) / 100);
    const revenue = productQty * p.sellPricePerKg;
    const rawRevenue = Math.round(qty * rawPrice);
    const netAdv = revenue - rawRevenue - Math.round(p.investmentPer100kg * (qty / 100));
    return {
      ...p,
      productQty, revenue, rawRevenue,
      investment: Math.round(p.investmentPer100kg * (qty / 100)),
      netAdvantage: netAdv,
      multiple: rawRevenue > 0 ? Math.round((revenue / rawRevenue) * 10) / 10 : 0,
    };
  });

  const units = PROCESSING_UNITS.filter((u) => u.crops.includes(crop))
    .map((u) => ({ ...u, distanceKm: roadDistanceKm(origin, { lat: u.lat, lng: u.lng }) }))
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return NextResponse.json({
    ok: true, crop, condition, qty, rawPrice: Math.round(rawPrice * 100) / 100,
    rawTotal: Math.round(qty * rawPrice), products, units,
  });
}
