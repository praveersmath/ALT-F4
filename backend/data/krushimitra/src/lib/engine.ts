// ─────────────────────────────────────────────────────────────
// Deterministic market data engine + PostgreSQL persistence
// Generates realistic Agmarknet-style modal price series per
// (crop, mandi). Same inputs → same outputs, so DB and fallback
// stay perfectly in sync. Data refreshes forward automatically.
// ─────────────────────────────────────────────────────────────
import { db } from "@/db";
import { priceRecords } from "@/db/schema";
import { and, eq, gte, sql, desc } from "drizzle-orm";
import { MANDIS, CROPS } from "./constants";

export interface PricePoint {
  date: string; // YYYY-MM-DD
  min: number;
  max: number;
  modal: number;
  arrivals: number; // tonnes
}

// ── date helpers (IST anchored) ───────────────────────────────
export function todayIST(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(new Date());
}

export function addDays(dateStr: string, n: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

export function dayOfYear(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return Math.floor((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 1)) / 86400000) + 1;
}

export function weekday(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0=Sun
}

// ── deterministic PRNG ────────────────────────────────────────
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Monthly "rain index" — deterministic, monsoon-shaped. Used to
// couple rainfall → price so cross-correlation is REAL in data.
export function rainIndex(cropKey: string, dateStr: string): number {
  const doy = dayOfYear(dateStr);
  const [y] = dateStr.split("-").map(Number);
  const rnd = mulberry32(hashStr(`rain-${cropKey}-${y}-${Math.ceil(doy / 30)}`));
  // Southwest monsoon peak Jul + NE peak Oct
  const sw = 190 * Math.exp(-Math.pow((doy - 195) / 55, 2));
  const ne = 120 * Math.exp(-Math.pow((doy - 305) / 30, 2));
  const base = 28 + sw + ne;
  return Math.max(0, base + (rnd() - 0.5) * 90);
}

// ── price curves ──────────────────────────────────────────────
const gauss = (doy: number, center: number, width: number) =>
  Math.exp(-Math.pow((doy - center) / width, 2));

function tomatoBase(dateStr: string): number {
  const doy = dayOfYear(dateStr);
  const [y] = dateStr.split("-").map(Number);
  const yearTrend = 1 + (y - 2018) * 0.045; // ~4.5% YoY inflation
  let p = 17; // baseline
  p += 30 * gauss(doy, 202, 42); // monsoon peak (Jul)
  p += 14 * gauss(doy, 300, 22); // Oct secondary
  p -= 6 * gauss(doy, 40, 38); // Jan–Apr crash zone
  // rain coupling: heavy rain month → next-month supply premium
  const r = rainIndex("tomato", addDays(dateStr, -30));
  if (r > 190) p *= 1 + Math.min(0.55, (r - 190) / 260);
  p *= yearTrend;
  return Math.max(6, p);
}

function onionBase(dateStr: string): number {
  const doy = dayOfYear(dateStr);
  const [y] = dateStr.split("-").map(Number);
  const yearTrend = 1 + (y - 2018) * 0.038;
  let p = 19;
  p += 10 * gauss(doy, 285, 34); // Oct storage premium
  p -= 7.5 * gauss(doy, 78, 30); // Mar–Apr harvest arrival crash
  p += 4.5 * gauss(doy, 190, 26); // monsoon lean season
  p *= yearTrend;
  return Math.max(6, p);
}

function ragiBase(dateStr: string): number {
  const doy = dayOfYear(dateStr);
  const [y] = dateStr.split("-").map(Number);
  const yearTrend = 1 + (y - 2018) * 0.05;
  let p = 34;
  p -= 3.2 * gauss(doy, 340, 30); // Dec post-harvest dip
  p += 2.6 * gauss(doy, 210, 60); // mid-year lean rise
  p += doy * 0.004; // gentle intra-year drift
  p *= yearTrend;
  return Math.max(28, p);
}

const MANDI_OFFSET: Record<string, Record<string, number>> = {
  tomato: { KOL: 0, HUB: 5.5, BLR: 2.8, MYS: 1.2, RAI: -1.8 },
  onion: { KOL: -0.8, HUB: 3.2, BLR: 1.5, MYS: 0.4, RAI: -1.2 },
  ragi: { KOL: 0.4, HUB: -1.4, BLR: 3.6, MYS: -0.6, RAI: -1.8 },
};

export function generateDay(crop: string, mandi: string, dateStr: string): PricePoint {
  const base =
    crop === "tomato" ? tomatoBase(dateStr) : crop === "onion" ? onionBase(dateStr) : ragiBase(dateStr);

  // autoregressive daily component (seeded chain, reproducible)
  const rnd = mulberry32(hashStr(`${crop}-${mandi}-${dateStr}`));
  const yRnd = mulberry32(hashStr(`${crop}-${mandi}-${addDays(dateStr, -1)}`));
  const wave = 0.62 * (yRnd() - 0.5) * 2 + (rnd() - 0.5) * 2;
  const ampByCrop = crop === "tomato" ? 2.6 : crop === "onion" ? 1.8 : 0.65;

  // weekly market rhythm (Mon arrival dip lifts prices, Sat glut)
  const wd = weekday(dateStr);
  const weekly = [0.0, 0.9, 0.2, -0.2, 0.1, -0.3, -0.9][wd];

  const offset = MANDI_OFFSET[crop]?.[mandi] ?? 0;
  const localNoise = (mulberry32(hashStr(`m-${mandi}-${dateStr}-${crop}`))() - 0.5) * 2.2;

  const modal = Math.max(4.5, base + offset + wave * ampByCrop + weekly + localNoise);
  const spreadRnd = rnd();
  const min = Math.max(3, modal * (0.82 + spreadRnd * 0.05));
  const max = modal * (1.13 + rnd() * 0.06);

  // arrivals inversely track price (supply drives price)
  const arrBase = crop === "tomato" ? 1450 : crop === "onion" ? 980 : 520;
  const mandiScale: Record<string, number> = { KOL: 1.35, HUB: 1.1, BLR: 1.5, MYS: 0.85, RAI: 0.7 };
  let arrivals = (arrBase - modal * (crop === "ragi" ? 3 : 16)) * (mandiScale[mandi] ?? 1);
  arrivals = Math.max(60, arrivals + (rnd() - 0.5) * 220 + weekly * -60);

  const r2 = (n: number) => Math.round(n * 100) / 100;
  return { date: dateStr, min: r2(min), max: r2(max), modal: r2(modal), arrivals: r2(arrivals) };
}

export function generateSeries(crop: string, mandi: string, days: number, endDate?: string): PricePoint[] {
  const end = endDate ?? todayIST();
  const out: PricePoint[] = [];
  for (let i = days - 1; i >= 0; i--) out.push(generateDay(crop, mandi, addDays(end, -i)));
  return out;
}

// ── DB persistence ────────────────────────────────────────────
const HISTORY_DAYS = 180;

let ensurePromise: Promise<void> | null = null;

export function ensureMarketData(): Promise<void> {
  if (!ensurePromise) ensurePromise = syncMarketData().catch((e) => {
    console.error("market data sync failed, falling back to in-memory:", e?.message ?? e);
    ensurePromise = null;
  });
  return ensurePromise;
}

async function syncMarketData(): Promise<void> {
  const today = todayIST();
  const [{ maxDate, cnt }] = await db
    .select({ maxDate: sql<string | null>`max(date)`, cnt: sql<number>`count(*)::int` })
    .from(priceRecords);

  if (maxDate && maxDate >= today && (cnt ?? 0) > 0) return; // fresh

  const startDay = maxDate && maxDate < today ? addDays(maxDate, 1) : addDays(today, -(HISTORY_DAYS - 1));
  const daysToAdd = Math.min(
    HISTORY_DAYS,
    Math.max(1, Math.round((Date.parse(today) - Date.parse(startDay)) / 86400000) + 1)
  );

  const rows: (typeof priceRecords.$inferInsert)[] = [];
  for (const crop of CROPS) {
    for (const mandi of MANDIS) {
      for (let i = daysToAdd - 1; i >= 0; i--) {
        const p = generateDay(crop.code, mandi.code, addDays(today, -i));
        rows.push({
          date: p.date, mandiCode: mandi.code, cropCode: crop.code,
          minPrice: p.min, maxPrice: p.max, modalPrice: p.modal, arrivals: p.arrivals,
        });
      }
    }
  }
  // chunked upsert
  for (let i = 0; i < rows.length; i += 400) {
    await db
      .insert(priceRecords)
      .values(rows.slice(i, i + 400))
      .onConflictDoNothing({ target: [priceRecords.date, priceRecords.mandiCode, priceRecords.cropCode] });
  }
}

/** Read history from DB; transparently falls back to the engine. */
export async function getHistory(crop: string, mandi: string, days: number): Promise<PricePoint[]> {
  try {
    await ensureMarketData();
    const since = addDays(todayIST(), -(days - 1));
    const rows = await db
      .select()
      .from(priceRecords)
      .where(and(eq(priceRecords.cropCode, crop), eq(priceRecords.mandiCode, mandi), gte(priceRecords.date, since)))
      .orderBy(desc(priceRecords.date))
      .limit(days);
    if (rows.length >= Math.min(days, 10)) {
      return rows
        .map((r) => ({ date: r.date, min: r.minPrice, max: r.maxPrice, modal: r.modalPrice, arrivals: r.arrivals }))
        .reverse();
    }
  } catch (e) {
    console.error("getHistory fallback:", (e as Error)?.message);
  }
  return generateSeries(crop, mandi, days);
}

export async function getAllCurrent(): Promise<Record<string, Record<string, PricePoint>>> {
  const out: Record<string, Record<string, PricePoint>> = {};
  for (const crop of CROPS) {
    out[crop.code] = {};
    for (const mandi of MANDIS) {
      const series = await getHistory(crop.code, mandi.code, 7);
      if (series.length) out[crop.code][mandi.code] = series[series.length - 1];
    }
  }
  return out;
}
