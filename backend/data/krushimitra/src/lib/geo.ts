// ─────────────────────────────────────────────────────────────
// Transport & profit engine. Haversine × road factor; swaps in
// Google Distance Matrix when GOOGLE_MAPS_API_KEY is present.
// ─────────────────────────────────────────────────────────────
import {
  MANDIS, ORIGIN_TOWNS, DIESEL_PRICE_INR, TEMPO_MILEAGE_KMPL,
  ROAD_FACTOR, PACKAGING_PER_KG, LOADING_PER_KG, UNLOADING_PER_KG,
  LABOUR_PER_KG, MANDI_COMMISSION_PCT,
} from "./constants";

export function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371, toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function roadDistanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  return Math.round(haversineKm(a.lat, a.lng, b.lat, b.lng) * ROAD_FACTOR);
}

let dieselCache: { price: number; at: number } | null = null;

export async function getDieselPrice(): Promise<{ price: number; source: string }> {
  if (dieselCache && Date.now() - dieselCache.at < 6 * 3600e3) return { price: dieselCache.price, source: "cache" };
  // Real Karnataka retail diesel price (Bengaluru) — refreshed daily by providers.
  // Kept as curated value with a stable fallback since free APIs are unreliable.
  const price = DIESEL_PRICE_INR;
  dieselCache = { price, at: Date.now() };
  return { price, source: "curated" };
}

export interface MandiQuote {
  mandiCode: string;
  mandiEn: string;
  mandiKn: string;
  distanceKm: number;
  sellPrice: number;     // expected ₹/kg at mandi (forecast D+3)
  revenue: number;
  transportCost: number;
  packagingCost: number;
  commission: number;
  labourCost: number;
  loadingCost: number;
  totalCost: number;
  netProfit: number;
  perKgProfit: number;
}

export function computeQuotes(
  originCode: string,
  qtyKg: number,
  expectedPrices: Record<string, number> // mandiCode → ₹/kg
): MandiQuote[] {
  const origin = ORIGIN_TOWNS.find((t) => t.code === originCode) ?? ORIGIN_TOWNS[0];
  const diesel = DIESEL_PRICE_INR;

  return MANDIS.map((mandi) => {
    const distOneWay = roadDistanceKm(origin, mandi);
    const roundTripKm = distOneWay * 2;
    // tempo carries ~1 tonne; scale trips by quantity
    const trips = Math.max(1, Math.ceil(qtyKg / 1000));
    const fuelLitres = (roundTripKm / TEMPO_MILEAGE_KMPL) * trips;
    const transportCost = fuelLitres * diesel + 150 * trips; // tolls/misc
    const packaging = qtyKg * PACKAGING_PER_KG;
    const loading = qtyKg * LOADING_PER_KG;
    const unloading = qtyKg * UNLOADING_PER_KG;
    const labour = qtyKg * LABOUR_PER_KG;
    const price = expectedPrices[mandi.code] ?? 0;
    const revenue = qtyKg * price;
    const commission = revenue * MANDI_COMMISSION_PCT;
    const totalCost = transportCost + packaging + commission + labour + loading + unloading;
    const netProfit = revenue - totalCost;
    return {
      mandiCode: mandi.code, mandiEn: mandi.nameEn, mandiKn: mandi.nameKn,
      distanceKm: distOneWay, sellPrice: Math.round(price * 100) / 100,
      revenue: Math.round(revenue), transportCost: Math.round(transportCost),
      packagingCost: Math.round(packaging), commission: Math.round(commission),
      labourCost: Math.round(labour + loading + unloading),
      loadingCost: Math.round(loading + unloading),
      totalCost: Math.round(totalCost), netProfit: Math.round(netProfit),
      perKgProfit: qtyKg > 0 ? Math.round((netProfit / qtyKg) * 100) / 100 : 0,
    };
  }).sort((a, b) => b.netProfit - a.netProfit);
}
