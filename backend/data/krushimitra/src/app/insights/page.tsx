"use client";

import { useEffect, useState } from "react";
import {
  BrainCircuit, Crosshair, Database, CloudRain, Satellite,
  Newspaper, Landmark, ListChecks, CalendarDays, BarChart3, Trophy, CloudSun,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { MANDIS, CROPS } from "@/lib/constants";
import Reveal from "@/components/Reveal";
import { Segmented, Skeleton } from "@/components/ui";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CropIcon } from "../page";

interface InsightsData {
  crop: string; mandi: string;
  cropNameEn: string; cropNameKn: string;
  mandiNameEn: string; mandiNameKn: string;
  current: number;
  card: {
    likely: number; optimistic: number; pessimistic: number; confidence: number;
    probLikely: number; probOpt: number; probPes: number;
    basedOn: { en: string; kn: string }[];
    reasoning: { en: string; kn: string }[];
    whatIfs: { cond: string; condKn: string; price: number }[];
    action: { en: string; kn: string };
    accuracy: number; mape: number;
    timing: { sellWindowEn: string; sellWindowKn: string };
  };
  correlation: {
    r: number; title: { en: string; kn: string }; note: { en: string; kn: string };
    rain: number[]; nextMonthPrice: number[];
  };
  seasonal: { table: Record<string, Record<string, number | null>>; monthlyAvg: { month: string; avg: number }[] } | null;
  heatmap: Record<string, Record<string, { price: number; trend: number }>>;
  demandForecast: {
    cropCode: string; confidence: number; supplyGap: number; priceRangeEn: string;
    driversEn: string[]; risksEn: string[]; profitPerAcre: number;
  }[];
  weather: { nameEn: string; nameKn: string; totalRain: number; maxTemp: number };
}

export default function InsightsPage() {
  const { t, pick, lang } = useI18n();
  const [crop, setCrop] = useState("tomato");
  const [mandi, setMandi] = useState("KOL");
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/insights?crop=${crop}&mandi=${mandi}`)
      .then((r) => r.json()).then((d) => d.ok && setData(d))
      .catch(() => {}).finally(() => setLoading(false));
  }, [crop, mandi]);

  const cropObj = CROPS.find((c) => c.code === crop)!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Reveal>
        <span className="inline-flex items-center gap-2 rounded-full border border-harvest/40 bg-harvest/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-harvest-2">
          <BrainCircuit className="size-3.5" /> Module 11 · Analytics Engine
        </span>
        <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t("i.title")}</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">{t("i.subtitle")}</p>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Segmented value={crop} onChange={(v) => setCrop(v as string)} options={CROPS.map((c) => ({ value: c.code, label: pick(c.nameEn.split(" ")[0], c.nameKn) }))} />
          <Segmented value={mandi} onChange={(v) => setMandi(v as string)} options={MANDIS.map((m) => ({ value: m.code, label: pick(m.nameEn.split(",")[0], m.nameKn) }))} />
        </div>
      </Reveal>

      {/* ── PREDICTION CARD ─────────────────────────── */}
      {loading || !data ? (
        <div className="mt-6"><Skeleton className="h-[560px]" /></div>
      ) : (
        <Reveal delay={0.08}>
          <div className="card mt-6 overflow-hidden">
            {/* card header */}
            <div className="border-b border-ink/8 bg-forest px-5 py-4 text-cream sm:px-7">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Crosshair className="size-5 text-harvest" />
                  <h2 className="font-display text-xl font-semibold">{t("i.predictionCard")}</h2>
                </div>
                <div className="text-right text-[12px] font-medium text-cream/80">
                  <div className="font-display text-lg font-semibold text-cream">
                    {pick(data.cropNameEn, data.cropNameKn)} · {pick(data.mandiNameEn, data.mandiNameKn)}
                  </div>
                  <div>{lang === "kn" ? "ಮುಂದಿನ 14 ದಿನ" : "Next 14 days"} · {t("common.today")} ₹{data.current.toFixed(1)}/kg</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_1.1fr]">
              {/* scenarios */}
              <div className="border-b border-ink/8 p-5 sm:p-7 lg:border-b-0 lg:border-r">
                <div className="space-y-3">
                  {[
                    { label: t("i.optimistic"), price: data.card.optimistic, prob: data.card.probOpt, cls: "text-forest", bar: "bg-forest" },
                    { label: t("i.likely"), price: data.card.likely, prob: data.card.probLikely, cls: "text-harvest-2", bar: "bg-harvest" },
                    { label: t("i.pessimistic"), price: data.card.pessimistic, prob: data.card.probPes, cls: "text-tomato", bar: "bg-tomato" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl border border-ink/8 bg-cream-2/50 p-4">
                      <div className="flex items-baseline justify-between">
                        <span className={cn("text-[11px] font-bold uppercase tracking-[0.14em]", s.cls)}>{s.label}</span>
                        <span className="text-[11px] font-semibold text-moss">{s.prob}% {t("i.probability")}</span>
                      </div>
                      <div className="font-display mt-1 text-3xl font-bold tabular-nums text-ink">₹{s.price.toFixed(1)}<span className="text-sm font-medium text-moss">{t("common.perKg")}</span></div>
                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink/8">
                        <div className={cn("h-full rounded-full", s.bar)} style={{ width: `${s.prob}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between rounded-2xl bg-forest/8 px-4 py-3">
                  <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-forest">{t("common.confidence")}</span>
                  <span className="font-display text-2xl font-bold tabular-nums text-forest">{data.card.confidence}%</span>
                </div>
              </div>

              {/* based on + reasoning */}
              <div className="p-5 sm:p-7">
                <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-moss">
                  <Database className="size-3.5" /> {t("i.basedOn")}
                </h3>
                <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
                  {data.card.basedOn.map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-[13px] text-ink-soft">
                      <span className="mt-[5px] size-1.5 shrink-0 rounded-full bg-harvest" />
                      {lang === "kn" ? b.kn : b.en}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-moss">
                  <ListChecks className="size-3.5" /> {t("i.reasoning")}
                </h3>
                <ol className="mt-2 space-y-1.5">
                  {data.card.reasoning.map((r, i) => (
                    <li key={i} className="flex gap-2.5 text-[13px] leading-snug text-ink">
                      <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-forest/12 text-[10px] font-bold text-forest">{i + 1}</span>
                      {lang === "kn" ? r.kn : r.en}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* what-ifs + action */}
            <div className="grid border-t border-ink/8 lg:grid-cols-2">
              <div className="border-b border-ink/8 p-5 sm:p-7 lg:border-b-0 lg:border-r">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-moss">{t("i.whatIf")}</h3>
                <div className="mt-3 space-y-2">
                  {data.card.whatIfs.map((w, i) => (
                    <div key={i} className="flex items-center justify-between gap-3 rounded-xl border border-ink/8 bg-cream-2/50 px-3.5 py-2.5 text-[13px]">
                      <span className="text-ink-soft">{lang === "kn" ? w.condKn : w.cond}</span>
                      <span className={cn("font-display shrink-0 text-base font-bold tabular-nums", w.price > data.card.likely ? "text-forest" : "text-tomato")}>
                        ₹{w.price.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-harvest/12 to-forest/8 p-5 sm:p-7">
                <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-harvest-2">
                  <Trophy className="size-3.5" /> {t("i.action")}
                </h3>
                <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink">{lang === "kn" ? data.card.action.kn : data.card.action.en}</p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-paper/80 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-moss">{t("i.histAccuracy")}</div>
                    <div className="font-display mt-1 text-xl font-bold tabular-nums text-forest">{data.card.accuracy}%</div>
                  </div>
                  <div className="rounded-xl bg-paper/80 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-moss">{t("pr.mape")}</div>
                    <div className="font-display mt-1 text-xl font-bold tabular-nums text-ink">±{data.card.mape}%</div>
                  </div>
                  <div className="rounded-xl bg-paper/80 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-moss">{lang === "kn" ? "ಮಾರಾಟ ಸಮಯ" : "Sell window"}</div>
                    <div className="mt-1 text-[12px] font-bold text-ink">{pick(data.card.timing.sellWindowEn, data.card.timing.sellWindowKn)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* ── CORRELATION + SEASONAL ──────────────────── */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Reveal className="card p-5 sm:p-6">
          <h2 className="font-display flex items-center gap-2 text-xl font-semibold text-ink">
            <CloudRain className="size-5 text-sky-bad" /> {t("i.correl")}
          </h2>
          {data ? (
            <>
              <p className="mt-2 text-[14px] leading-snug text-ink">{lang === "kn" ? data.correlation.title.kn : data.correlation.title.en}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className={cn("rounded-full px-3 py-1 text-sm font-bold tabular-nums", Math.abs(data.correlation.r) > 0.5 ? "bg-forest/10 text-forest" : "bg-harvest/12 text-harvest-2")}>
                  r = {data.correlation.r}
                </span>
                <span className="text-[12px] text-moss">{lang === "kn" ? data.correlation.note.kn : data.correlation.note.en}</span>
              </div>
              <div className="mt-5">
                <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-moss">{lang === "kn" ? "ಮಳೆ ಸೂಚಿ (ತಿಂಗಳು)" : "Rain index (month) → next-month price"}</div>
                <div className="flex h-40 items-end gap-3">
                  {["tomato", "onion"].length && data.correlation.rain.map((r, i) => (
                    <div key={i} className="flex flex-1 flex-col items-center gap-1">
                      <div className="relative h-28 w-full max-w-10">
                        <div className="absolute bottom-0 w-full rounded-t-md bg-sky-bad/60" style={{ height: `${Math.min(100, (r / 280) * 100)}%` }} />
                        <div
                          className="absolute bottom-0 left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-tomato"
                          style={{ bottom: `${Math.min(96, (data.correlation.nextMonthPrice[i] / 80) * 100)}%`, boxShadow: "0 0 0 4px rgb(194 64 46 / 0.35)" }}
                        />
                      </div>
                      <span className="text-[10px] font-semibold text-moss">M-{data.correlation.rain.length - i}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex gap-4 text-[11px] text-ink-soft">
                  <span className="flex items-center gap-1"><span className="h-2.5 w-3 rounded-sm bg-sky-bad/60" />{t("w.rainfall")}</span>
                  <span className="flex items-center gap-1"><span className="size-2 rounded-full bg-tomato" />{lang === "kn" ? "ಮುಂದಿನ ತಿಂಗಳ ಬೆಲೆ" : "Next-month price"}</span>
                </div>
              </div>
            </>
          ) : <Skeleton className="mt-4 h-64" />}
        </Reveal>

        {/* heatmap */}
        <Reveal className="card p-5 sm:p-6" delay={0.06}>
          <h2 className="font-display flex items-center gap-2 text-xl font-semibold text-ink">
            <BarChart3 className="size-5 text-harvest-2" /> {t("i.heatmap")}
          </h2>
          {data ? (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[560px] text-center text-[12px]">
                <thead>
                  <tr className="text-[10px] font-bold uppercase tracking-wider text-moss">
                    <th className="p-2 text-left">{t("common.crop")} ↓ {t("common.mandi")} →</th>
                    {MANDIS.map((m) => <th key={m.code} className="p-2">{pick(m.nameEn.split(",")[0], m.nameKn)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {CROPS.map((c) => (
                    <tr key={c.code}>
                      <td className="p-2 text-left font-semibold text-ink">
                        <span className="flex items-center gap-1.5"><CropIcon code={c.code} color={c.color} size={14} />{pick(c.nameEn.split(" ")[0], c.nameKn)}</span>
                      </td>
                      {MANDIS.map((m) => {
                        const cell = data.heatmap[c.code]?.[m.code];
                        if (!cell) return <td key={m.code} className="p-2">—</td>;
                        const all = CROPS.flatMap((cc) => MANDIS.map((mm) => data.heatmap[cc.code]?.[mm.code]?.price ?? 0)).filter(Boolean);
                        const mn = Math.min(...all), mx = Math.max(...all);
                        const norm = (cell.price - mn) / (mx - mn || 1);
                        return (
                          <td key={m.code} className="p-1.5">
                            <div
                              className="rounded-xl px-2 py-2.5 font-bold tabular-nums text-cream transition-transform hover:scale-[1.04]"
                              style={{ background: `linear-gradient(135deg, rgba(29,70,51,${0.35 + norm * 0.6}), rgba(217,142,43,${0.25 + norm * 0.55}))` }}
                            >
                              ₹{cell.price.toFixed(1)}
                              <div className="text-[9px] font-medium opacity-80">{cell.trend >= 0 ? "▲" : "▼"} {Math.abs(cell.trend)}%</div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <Skeleton className="mt-4 h-64" />}
        </Reveal>
      </div>

      {/* ── SEASONAL TABLE (tomato) ─────────────────── */}
      {data?.seasonal && (
        <Reveal className="card mt-8 p-5 sm:p-6">
          <h2 className="font-display flex items-center gap-2 text-xl font-semibold text-ink">
            <CalendarDays className="size-5 text-harvest-2" /> {t("i.seasonal")}
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-[11px] uppercase tracking-wider text-moss">
                  <th className="px-3 py-2 text-left font-bold">Year</th>
                  {["Jan", "Apr", "Jun", "Aug", "Oct", "Dec"].map((m) => <th key={m} className="px-3 py-2 text-right font-bold">{m}</th>)}
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.seasonal.table).map(([year, row]) => (
                  <tr key={year} className="border-b border-ink/5 last:border-0">
                    <td className="px-3 py-2.5 font-bold text-ink">{year}</td>
                    {["Jan", "Apr", "Jun", "Aug", "Oct", "Dec"].map((m) => {
                      const v = row[m];
                      const isPeak = v !== null && v >= 55;
                      return (
                        <td key={m} className="px-3 py-2.5 text-right tabular-nums">
                          {v === null ? <span className="text-moss">—</span> : (
                            <span className={cn("font-semibold", isPeak ? "text-tomato" : v <= 15 ? "text-forest" : "text-ink")}>
                              ₹{v}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid gap-2 text-[13px] sm:grid-cols-2">
            <p className="rounded-xl bg-tomato/[0.07] p-3 text-ink"><b className="text-tomato">{lang === "kn" ? "ಮಾದರಿ:" : "Pattern:"}</b> {lang === "kn" ? "ಟೊಮೇಟೊ ಬೆಲೆ ಯಾವಾಗಲೂ ಜುಲೈ–ಆಗಸ್ಟ್‌ನಲ್ಲಿ (ಮಾನ್ಸೂನ್) ಗರಿಷ್ಠ; ವಾರ್ಷಿಕ ಗರಿಷ್ಠ ಬೆಲೆ ಪ್ರತಿವರ್ಷ ~12% ಹೆಚ್ಚುತ್ತಿದೆ." : "Tomato ALWAYS peaks Jul–Aug (monsoon damage); peak-month price compounds ~12% YoY."}</p>
            <p className="rounded-xl bg-forest/[0.07] p-3 text-ink"><b className="text-forest">{lang === "kn" ? "ಸಲಹೆ:" : "Strategy:"}</b> {lang === "kn" ? "ಜನವರಿ–ಏಪ್ರಿಲ್ ಕಡಿಮೆ ಬೆಲೆ ಅವಧಿ — ಮೇ–ಜೂನ್ ಕೊಯ್ಲಿಗೆ ಕೃಷಿ ಯೋಜಿಸಿದರೆ ಮಾನ್ಸೂನ್ ಪ್ರೀಮಿಯಂ ಸಿಗುತ್ತದೆ." : "Jan–Apr is the deep-value zone — time harvests for Jun–Jul to earn the monsoon premium."}</p>
          </div>
        </Reveal>
      )}

      {/* ── DEMAND FORECAST ─────────────────────────── */}
      <Reveal className="mt-8">
        <h2 className="font-display flex items-center gap-2 text-2xl font-semibold text-ink">
          <Satellite className="size-5 text-forest" /> {t("i.demandForecast")}
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {(data?.demandForecast ?? []).map((d, i) => {
            const c = CROPS.find((x) => x.code === d.cropCode)!;
            const avoid = d.supplyGap > 0 || d.confidence < 70;
            return (
              <Reveal key={d.cropCode} delay={i * 0.06} className={cn("card card-hover p-5", avoid && "border-tomato/30")}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="grid size-10 place-items-center rounded-2xl" style={{ background: c.bgSoft }}>
                      <CropIcon code={c.code} color={c.color} size={20} />
                    </span>
                    <div>
                      <div className="font-display text-lg font-semibold text-ink">{pick(c.nameEn, c.nameKn)}</div>
                      <div className="text-[11px] font-semibold text-moss">{d.confidence}% {t("common.confidence")}</div>
                    </div>
                  </div>
                  <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider", avoid ? "bg-tomato/10 text-tomato" : "bg-forest text-cream")}>
                    {avoid ? t("i.avoid") : t("i.sow")}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-xl bg-cream-2/70 p-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-moss">{lang === "kn" ? "ಬೆಲೆ ವ್ಯಾಪ್ತಿ" : "Price range"}</div>
                    <div className="font-display text-[15px] font-bold text-ink">{d.priceRangeEn}</div>
                  </div>
                  <div className="rounded-xl bg-cream-2/70 p-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-moss">{t("i.expectedProfit")}</div>
                    <div className="font-display text-[15px] font-bold tabular-nums text-forest">{formatINR(d.profitPerAcre)}</div>
                  </div>
                </div>
                <ul className="mt-3 space-y-1">
                  {d.driversEn.map((x, xi) => (
                    <li key={xi} className="flex gap-1.5 text-[12px] text-ink-soft"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-forest" />{x}</li>
                  ))}
                  {d.risksEn.map((x, xi) => (
                    <li key={xi} className="flex gap-1.5 text-[12px] text-tomato/90"><span className="mt-1 size-1.5 shrink-0 rounded-full bg-tomato" />{x}</li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </Reveal>

      {/* ── SEASONAL CALENDAR ───────────────────────── */}
      <Reveal className="card mt-8 p-5 sm:p-6">
        <h2 className="font-display flex items-center gap-2 text-xl font-semibold text-ink">
          <Landmark className="size-5 text-harvest-2" /> {t("i.calendar")}
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {[
            { season: t("i.kharif"), tone: "forest", Icon: CloudRain, itemsEn: ["Monsoon onset vs 30-yr avg → sowing shift", "Arrivals gap → Oct tomato premium window", "Dam levels decide Rabi irrigation"], itemsKn: ["ಚಾವಟಿ ಎತ್ತರ vs 30-ವರ್ಷ ಸರಾಸರಿ", "ಅಕ್ಟೋಬರ್ ಟೊಮೇಟೊ ಪ್ರೀಮಿಯಂ ಕಿಟಕಿ", "ಕಟ್ಟೆ ನೀರು = ರಬಿ ನೀರಾವರಿ"] },
            { season: t("i.rabi"), tone: "harvest", Icon: CloudSun, itemsEn: ["Soil-moisture carryover forecasting", "Frost watch for N. Karnataka", "Festival demand timing for onion"], itemsKn: ["ಮಣ್ಣಿನ ತೇವಾಂಶ ಮುನ್ಸೂಚನೆ", "ಉತ್ತರ ಕರ್ನಾಟಕ ಹಿಮದ ಎಚ್ಚರಿಕೆ", "ಹಬ್ಬದ ಈರುಳ್ಳಿ ಬೇಡಿಕೆ"] },
            { season: t("i.summer"), tone: "tomato", Icon: Newspaper, itemsEn: ["Borewell + power reliability scoring", "Summer vegetable premium windows", "Heat-wave duration impact"], itemsKn: ["ಬೋರ್ವೆল್ ನಂಬಿಕೆ ಸ್ಕೋರ್", "ಬೇಸಿಗೆ ತರಕಾರಿ ಪ್ರೀಮಿಯಂ", "ಶಾಖದ ಅಲೆ ಪರಿಣಾಮ"] },
          ].map((s, i) => (
            <div key={i} className="rounded-2xl border border-ink/10 bg-cream-2/50 p-4">
              <div className="flex items-center gap-2">
                <s.Icon className={cn("size-4", s.tone === "forest" ? "text-forest" : s.tone === "harvest" ? "text-harvest-2" : "text-tomato")} />
                <span className="font-display font-semibold text-ink">{s.season}</span>
              </div>
              <ul className="mt-2.5 space-y-1.5">
                {(lang === "kn" ? s.itemsKn : s.itemsEn).map((x, xi) => (
                  <li key={xi} className="flex gap-1.5 text-[12.5px] text-ink-soft">
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-moss" />{x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
