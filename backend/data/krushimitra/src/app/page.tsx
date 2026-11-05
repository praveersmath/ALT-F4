"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight, TrendingUp, CloudRain, Wind, Droplets, Fuel,
  AlertTriangle, BellRing, Calculator, Trophy, MapPin, ArrowDownRight,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CROPS, MANDIS, ORIGIN_TOWNS } from "@/lib/constants";
import Reveal from "@/components/Reveal";
import { MoodBadge, TrendChip, Sparkline, Skeleton, Segmented } from "@/components/ui";
import { formatINR } from "@/lib/format";

interface CropDash {
  code: string; nameEn: string; nameKn: string; color: string;
  now: number; min: number; max: number; arrivals: number;
  trend7: number; f5: number; sparkline: number[]; bestMandi: string;
  mandiPrices: { code: string; now: number }[];
}
interface DashData {
  crops: CropDash[];
  mood: Record<string, "bullish" | "neutral" | "bearish">;
  alerts: { cropCode: string; mandiCode: string; en: string; kn: string; kind: string }[];
  weather: { district: string; districtKn: string; today: { tMax: number; tMin: number; rainMm: number; rainProb: number; humidity: number; windKmh: number }; source: string };
  diesel: { price: number };
}

export default function HomePage() {
  const { t, lang, pick } = useI18n();
  const [data, setData] = useState<DashData | null>(null);

  useEffect(() => {
    fetch("/api/dashboard").then((r) => r.json()).then((d) => d.ok && setData(d)).catch(() => {});
  }, []);

  const tickerItems = useMemo(() => {
    if (!data) return [];
    const items: string[] = [];
    for (const c of data.crops) {
      for (const mp of c.mandiPrices) {
        const m = MANDIS.find((x) => x.code === mp.code)!;
        items.push(`${pick(c.nameEn, c.nameKn)} · ${pick(m.nameEn, m.nameKn)}: ₹${mp.now.toFixed(1)}/kg`);
      }
    }
    return items;
  }, [data, pick]);

  return (
    <div className="overflow-x-clip">
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 pb-10 pt-10 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:pt-16">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-harvest/40 bg-harvest/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-harvest-2">
              <span className="live-dot size-1.5 rounded-full bg-harvest" />
              {t("hero.kicker")}
            </div>
            <h1 className="font-display text-balance mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.6rem]">
              {t("hero.title")}
            </h1>
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-ink-soft sm:text-base">
              {t("hero.sub")}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/prices"
                className="group inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-sm font-bold text-cream shadow-lift transition-all hover:bg-forest-2 hover:shadow-[0_24px_48px_-16px_rgb(29_70_51/0.5)]"
              >
                <TrendingUp className="size-4 transition-transform group-hover:translate-x-0.5" />
                {t("hero.cta.prices")}
                <ArrowRight className="size-4 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-6 py-3 text-sm font-bold text-ink shadow-soft transition-all hover:border-harvest/50 hover:shadow-lift"
              >
                {t("hero.cta.chat")}
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2.2rem] bg-gradient-to-br from-lime-leaf/25 via-transparent to-harvest/20 blur-2xl" />
              <div className="overflow-hidden rounded-[1.8rem] border border-ink/10 shadow-lift">
                <Image
                  src="/hero-farm.jpg"
                  alt="Karnataka farmland at dawn"
                  width={900}
                  height={640}
                  priority
                  className="h-72 w-full object-cover sm:h-80"
                />
              </div>
              {data && (
                <div className="absolute -bottom-6 left-4 right-4 grid grid-cols-3 gap-2">
                  {data.crops.map((c) => (
                    <div key={c.code} className="rounded-2xl border border-ink/10 bg-paper/95 px-3 py-2.5 shadow-lift backdrop-blur">
                      <div className="truncate text-[10px] font-bold uppercase tracking-wider" style={{ color: c.color }}>
                        {pick(c.nameEn, c.nameKn)}
                      </div>
                      <div className="font-display text-lg font-bold tabular-nums text-ink sm:text-xl">
                        ₹{c.now.toFixed(0)}
                        <span className="text-[10px] font-medium text-moss">{t("common.perKg")}</span>
                      </div>
                      <TrendChip value={c.trend7} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* ticker */}
        <div className="mt-14 border-y border-ink/10 bg-forest py-2.5 text-cream">
          <div className="marquee-track gap-10 px-4">
            {(tickerItems.length ? [...tickerItems, ...tickerItems] : ["…"]).map((s, i) => (
              <span key={i} className="flex items-center gap-2 text-[13px] font-medium tabular-nums text-cream/90">
                <span className="size-1.5 rounded-full bg-harvest" />
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARD GRID ───────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-12 sm:px-6">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{t("dash.todayPrices")}</h2>
              <p className="mt-1 text-sm text-ink-soft">
                {data ? t("dash.bestToday") + " · " + t("dash.acrossMandis") : t("common.loading")}
              </p>
            </div>
            <Link href="/prices" className="group flex items-center gap-1 text-sm font-bold text-forest hover:text-harvest-2">
              {t("common.viewAll")}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {!data
            ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-72" />)
            : data.crops.map((c, i) => (
                <Reveal key={c.code} delay={i * 0.08}>
                  <CropCard crop={c} mood={data.mood[c.code] ?? "neutral"} />
                </Reveal>
              ))}
        </div>
      </section>

      {/* ── ALERTS + WEATHER + QUICK CALC ────────────────── */}
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_1fr_1.15fr]">
        {/* alerts */}
        <Reveal className="card p-5">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-tomato/12 text-tomato"><BellRing className="size-4" /></span>
            <h3 className="font-display text-lg font-semibold text-ink">{t("dash.alerts")}</h3>
          </div>
          <div className="mt-4 space-y-3">
            {!data && <Skeleton className="h-32" />}
            {data && data.alerts.slice(0, 4).map((a, i) => (
              <div key={i} className="flex gap-2.5 rounded-xl border border-ink/8 bg-cream-2/60 p-3">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-harvest-2" />
                <p className="text-[13px] leading-snug text-ink-soft">{lang === "kn" ? a.kn : a.en}</p>
              </div>
            ))}
            {data && data.alerts.length === 0 && (
              <p className="rounded-xl bg-forest/8 p-3 text-[13px] text-forest">
                {lang === "kn" ? "ಪ್ರಸ್ತುತ ತೀವ್ರ ಎಚ್ಚರಿಕೆ ಇಲ್ಲ. ಮಾರುಕಟ್ಟೆ ಸ್ಥಿರವಾಗಿದೆ." : "No critical alerts right now. Markets are stable."}
              </p>
            )}
          </div>
        </Reveal>

        {/* weather */}
        <Reveal delay={0.08} className="card p-5">
          <div className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-lg bg-sky-bad/12 text-sky-bad"><CloudRain className="size-4" /></span>
            <h3 className="font-display text-lg font-semibold text-ink">{t("dash.weatherNow")}</h3>
          </div>
          {!data ? (
            <div className="mt-4"><Skeleton className="h-32" /></div>
          ) : (
            <div className="mt-4">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-moss">
                <MapPin className="size-3.5" />
                {pick(data.weather.district, data.weather.districtKn)}
                <span className="ml-auto rounded-full bg-forest/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-forest">
                  {data.weather.source === "fallback" ? t("common.source.fallback") : t("common.source.live")}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-cream-2/70 p-3">
                  <div className="font-display text-2xl font-bold text-ink">{data.weather.today.tMax}°</div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-moss">{data.weather.today.tMin}° min</div>
                </div>
                <div className="rounded-xl bg-cream-2/70 p-3">
                  <div className="flex items-center justify-center gap-1 font-display text-2xl font-bold text-sky-bad">
                    <Droplets className="size-4" />{data.weather.today.rainMm}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-moss">mm · {data.weather.today.rainProb}%</div>
                </div>
                <div className="rounded-xl bg-cream-2/70 p-3">
                  <div className="flex items-center justify-center gap-1 font-display text-2xl font-bold text-moss">
                    <Wind className="size-4" />{data.weather.today.windKmh}
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-moss">km/h · {data.weather.today.humidity}%</div>
                </div>
              </div>
              <Link href="/weather" className="mt-3 inline-flex items-center gap-1 text-[13px] font-bold text-forest hover:text-harvest-2">
                {t("w.7day")} <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}
        </Reveal>

        {/* quick profit calc */}
        <Reveal delay={0.14} className="card p-5">
          <QuickCalc />
        </Reveal>
      </section>

      {/* fuel strip */}
      {data && (
        <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
          <Reveal>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 rounded-2xl border border-ink/10 bg-paper px-6 py-3 text-[13px] text-ink-soft shadow-soft">
              <span className="flex items-center gap-1.5">
                <Fuel className="size-4 text-harvest-2" />
                {t("t.diesel")}: <b className="tabular-nums text-ink">{formatINR(data.diesel.price, 2)}{t("t.perLitre")}</b>
              </span>
              <span className="hidden h-4 w-px bg-ink/15 sm:block" />
              <span className="flex items-center gap-1.5">
                <ArrowDownRight className="size-4 text-forest" />
                {lang === "kn" ? "ಪ್ಯಾಕಿಂಗ್ ₹2/ಕೆಜಿ · ಮಂಡಿ ಶುಲ್ಕ 1% · ಸಾರಿಗೆ ರೌಂಡ್-ಟ್ರಿಪ್ ಆಧಾರಿತ" : "Packaging ₹2/kg · Mandi fee 1% · Transport on round-trip distance"}
              </span>
            </div>
          </Reveal>
        </section>
      )}

      {/* value props */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { Icon: TrendingUp, href: "/prices", key: "nav.prices", descEn: "14-day ML forecasts with confidence bands & sell alerts", descKn: "14 ದಿನದ AI ಮುನ್ಸೂಚನೆ ಮತ್ತು ಮಾರಾಟ ಎಚ್ಚರಿಕೆಗಳು" },
            { Icon: CloudRain, href: "/weather", key: "nav.weather", descEn: "District-wise crop risk: LOW / MEDIUM / HIGH", descKn: "ಜಿಲ್ಲಾವಾರು ಬೆಳೆ ಅಪಾಯ: ಕಡಿಮೆ / ಮಧ್ಯಮ / ಹೆಚ್ಚು" },
            { Icon: Calculator, href: "/transport", key: "nav.transport", descEn: "Net profit per mandi after diesel, packaging, commission", descKn: "ಡೀಸೆಲ್, ಪ್ಯಾಕಿಂಗ್, ಕಮಿಷನ್ ನಂತರದ ನಿವ್ವಳ ಲಾಭ" },
            { Icon: Trophy, href: "/waste-to-value", key: "nav.waste", descEn: "Convert damaged crop into 3–6× higher-value products", descKn: "ಹಾಳಾದ ಬೆಳೆಯನ್ನು 3–6 ಪಟ್ಟು ಮೌಲ್ಯದ ಉತ್ಪನ್ನವಾಗಿ" },
          ].map((f, i) => (
            <Reveal key={f.href + f.key} delay={i * 0.06}>
              <Link href={f.href} className="card card-hover group block h-full p-5">
                <span className="grid size-10 place-items-center rounded-xl bg-forest/10 text-forest transition-colors group-hover:bg-forest group-hover:text-cream">
                  <f.Icon className="size-5" strokeWidth={2.2} />
                </span>
                <h3 className="font-display mt-3 text-lg font-semibold text-ink">{t(f.key)}</h3>
                <p className="mt-1 text-[13px] leading-snug text-ink-soft">{lang === "kn" ? f.descKn : f.descEn}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}

// ── Crop card ─────────────────────────────────────────────────
function CropCard({ crop, mood }: { crop: CropDash; mood: "bullish" | "neutral" | "bearish" }) {
  const { t, pick } = useI18n();
  const mandi = MANDIS.find((m) => m.code === crop.bestMandi);
  const constCrop = CROPS.find((c) => c.code === crop.code);
  return (
    <Link href={`/prices?crop=${crop.code}`} className="card card-hover block p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-2xl" style={{ background: constCrop?.bgSoft }}>
            <CropIcon code={crop.code} color={crop.color} />
          </span>
          <div>
            <h3 className="font-display text-lg font-semibold leading-tight text-ink">{pick(crop.nameEn, crop.nameKn)}</h3>
            <div className="text-[11px] font-medium text-moss">{crop.code === "ragi" ? "MSP ₹42.9/kg" : `${t("dash.arrivals")}: ${Math.round(crop.arrivals)} ${t("dash.tonnes")}`}</div>
          </div>
        </div>
        <MoodBadge mood={mood} size="sm" />
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="font-display text-4xl font-bold tabular-nums tracking-tight text-ink">
            ₹{crop.now.toFixed(1)}
          </div>
          <div className="text-xs text-moss">{t("common.perKg").replace("/", "") + " · " + t("dash.minPrice") + " ₹" + crop.min.toFixed(1) + " / " + t("dash.maxPrice") + " ₹" + crop.max.toFixed(1)}</div>
        </div>
        <Sparkline data={crop.sparkline} color={crop.color} width={110} height={42} />
      </div>

      <div className="mt-4 flex items-center justify-between rounded-xl bg-cream-2/70 px-3 py-2.5 text-[13px]">
        <span className="flex items-center gap-1.5 font-semibold text-ink">
          <Trophy className="size-4 text-harvest-2" />
          {pick(mandi?.nameEn ?? "", mandi?.nameKn ?? "")}
        </span>
        <span className="flex items-center gap-2">
          <TrendChip value={crop.trend7} />
          <span className="text-[11px] font-medium text-moss">{t("dash.trend7d")}</span>
        </span>
      </div>
    </Link>
  );
}

// ── Crop SVG icons ────────────────────────────────────────────
export function CropIcon({ code, color, size = 22 }: { code: string; color: string; size?: number }) {
  if (code === "tomato") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="13.5" r="7.5" fill={color} />
        <path d="M12 6.5c-1-2 -3-2.6-4.2-3" stroke="#2c6047" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M12 6.5c.4-1.6 2-2.2 3.4-2.6" stroke="#2c6047" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        <path d="M12 6.2l-1.6 1.4L12 8.2l1.6-.6L12 6.2Z" fill="#2c6047" />
      </svg>
    );
  }
  if (code === "ragi") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={i} x1={12 + (i - 2) * 2.6} y1="20" x2={12 + (i - 2) * 3.4} y2={8 - Math.abs(i - 2) * 1.1} stroke={color} strokeWidth="1.7" strokeLinecap="round" />
        ))}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle key={i} cx={12 + (i - 2) * 3.4} cy={7 - Math.abs(i - 2) * 1.1} r="1.9" fill={color} />
        ))}
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 4c-3.4 2.2-6 5.2-6 9a6 6 0 0 0 12 0c0-3.8-2.6-6.8-6-9Z" fill={color} />
      <path d="M12 4c-.6 2.2-.6 4.8 0 7.4" stroke="#fffdf8" strokeOpacity="0.7" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M10.5 3.2c.7-.8 2.3-.8 3 0" stroke="#8fae6a" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ── Quick calc widget ─────────────────────────────────────────
function QuickCalc() {
  const { t, pick, lang } = useI18n();
  const [crop, setCrop] = useState("tomato");
  const [from, setFrom] = useState("CHIK");
  const [qty, setQty] = useState(500);
  const [res, setRes] = useState<{ quotes: { mandiEn: string; mandiKn: string; netProfit: number; sellPrice: number }[]; recommendation: { en: string; kn: string } } | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    fetch(`/api/transport?from=${from}&crop=${crop}&qty=${qty}`)
      .then((r) => r.json())
      .then((d) => d.ok && setRes(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { run(); /* eslint-disable-line react-hooks/exhaustive-deps */ }, []);

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="grid size-8 place-items-center rounded-lg bg-harvest/15 text-harvest-2"><Calculator className="size-4" /></span>
        <h3 className="font-display text-lg font-semibold text-ink">{t("dash.quickCalc")}</h3>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <select value={crop} onChange={(e) => setCrop(e.target.value)} className="rounded-xl border border-ink/12 bg-paper px-3 py-2 text-sm font-semibold">
          {CROPS.map((c) => <option key={c.code} value={c.code}>{pick(c.nameEn, c.nameKn)}</option>)}
        </select>
        <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-xl border border-ink/12 bg-paper px-3 py-2 text-sm font-semibold">
          {ORIGIN_TOWNS.map((o) => <option key={o.code} value={o.code}>{pick(o.nameEn, o.nameKn)}</option>)}
        </select>
        <input
          type="number" min={50} max={20000} value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          className="rounded-xl border border-ink/12 bg-paper px-3 py-2 text-sm font-semibold tabular-nums"
          placeholder="kg"
        />
        <button onClick={run} disabled={loading} className="rounded-xl bg-forest px-3 py-2 text-sm font-bold text-cream transition-colors hover:bg-forest-2 disabled:opacity-60">
          {loading ? "…" : t("t.calculate")}
        </button>
      </div>
      {res && (
        <div className="mt-3 space-y-1.5">
          {res.quotes.slice(0, 3).map((q, i) => (
            <div key={q.mandiEn} className="flex items-center justify-between rounded-xl border border-ink/8 bg-cream-2/60 px-3 py-2 text-[13px]">
              <span className="flex items-center gap-1.5 font-medium text-ink">
                {i === 0 && <Trophy className="size-3.5 text-harvest-2" />}
                {pick(q.mandiEn, q.mandiKn)}
              </span>
              <span className={`font-bold tabular-nums ${i === 0 ? "text-forest" : "text-ink-soft"}`}>{formatINR(q.netProfit)}</span>
            </div>
          ))}
          <p className="pt-1 text-[12px] leading-snug text-ink-soft">{lang === "kn" ? res.recommendation.kn : res.recommendation.en}</p>
        </div>
      )}
    </>
  );
}
