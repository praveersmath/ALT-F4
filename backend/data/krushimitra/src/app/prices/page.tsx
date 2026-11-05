"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LineChart as LChart, Trophy, AlertTriangle, Target, BarChart3, Gauge } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { MANDIS, CROPS } from "@/lib/constants";
import Reveal from "@/components/Reveal";
import PriceChart from "@/components/PriceChart";
import { Segmented, Skeleton, TrendChip } from "@/components/ui";
import { cn } from "@/lib/utils";
import { CropIcon } from "../page";

interface PriceData {
  history: { date: string; price: number }[];
  forecast: { date: string; price: number; lower: number; upper: number }[];
  trend7d: number; trend30d: number; pred5d: number; pred14d: number;
  accuracy: number; mape: number; direction: string;
  alert: { kind: string; en: string; kn: string; pct: number } | null;
  compare: { code: string; nameEn: string; nameKn: string; now: number; min: number; max: number; arrivals: number; f5: number; f14: number; trend7: number }[];
}

function PricesInner() {
  const { t, pick, lang } = useI18n();
  const params = useSearchParams();
  const [crop, setCrop] = useState(params.get("crop") ?? "tomato");
  const [mandi, setMandi] = useState(params.get("mandi") ?? "KOL");
  const [days, setDays] = useState("90");
  const [data, setData] = useState<PriceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/prices?crop=${crop}&mandi=${mandi}&days=${days}`)
      .then((r) => r.json()).then((d) => { if (d.ok) setData(d); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [crop, mandi, days]);

  const cropObj = CROPS.find((c) => c.code === crop)!;
  const current = data?.history[data.history.length - 1]?.price;

  const stats = useMemo(() => {
    if (!data) return [];
    return [
      { label: t("dash.trend7d"), node: <TrendChip value={data.trend7d} />, Icon: TrendingUpIcon },
      { label: `30 ${t("pr.days")}`, node: <TrendChip value={data.trend30d} />, Icon: BarChart3 },
      { label: `+5 ${t("pr.days")}`, node: <TrendChip value={data.pred5d} />, Icon: Target },
      { label: `+14 ${t("pr.days")}`, node: <TrendChip value={data.pred14d} />, Icon: Gauge },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, lang]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Reveal>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t("pr.title")}</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">{t("pr.subtitle")}</p>
      </Reveal>

      {/* controls */}
      <Reveal delay={0.06}>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Segmented
            value={crop}
            onChange={(v) => setCrop(v as string)}
            options={CROPS.map((c) => ({ value: c.code, label: pick(c.nameEn, c.nameKn) }))}
          />
          <Segmented
            value={days}
            onChange={setDays}
            options={[
              { value: "30", label: `30 ${t("pr.days")}` },
              { value: "60", label: `60 ${t("pr.days")}` },
              { value: "90", label: `90 ${t("pr.days")}` },
              { value: "180", label: `180 ${t("pr.days")}` },
            ]}
          />
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {MANDIS.map((m) => (
            <button
              key={m.code}
              onClick={() => setMandi(m.code)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[13px] font-semibold transition-all",
                mandi === m.code
                  ? "border-forest bg-forest text-cream shadow-soft"
                  : "border-ink/12 bg-paper text-ink-soft hover:border-harvest/50 hover:text-ink"
              )}
            >
              {pick(m.nameEn.split(",")[0], m.nameKn)}
            </button>
          ))}
        </div>
      </Reveal>

      {/* price alert banner */}
      {data?.alert && (
        <Reveal delay={0.1}>
          <div className="card mt-6 flex items-start gap-3 border-harvest/45 bg-gradient-to-r from-harvest/12 via-paper to-paper p-4">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-harvest/20 text-harvest-2">
              <AlertTriangle className="size-5" />
            </span>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.14em] text-harvest-2">{t("pr.alert")}</div>
              <p className="mt-0.5 text-[15px] font-medium leading-snug text-ink">
                {lang === "kn" ? data.alert.kn : data.alert.en}
              </p>
            </div>
          </div>
        </Reveal>
      )}

      {/* main chart + stats */}
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.6fr_0.4fr]">
        <Reveal className="card p-4 sm:p-6" delay={0.1}>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl" style={{ background: cropObj.bgSoft }}>
                <CropIcon code={crop} color={cropObj.color} />
              </span>
              <div>
                <div className="font-display text-lg font-semibold text-ink">
                  {pick(cropObj.nameEn, cropObj.nameKn)} · {pick(MANDIS.find((m) => m.code === mandi)!.nameEn, MANDIS.find((m) => m.code === mandi)!.nameKn)}
                </div>
                {current != null && (
                  <div className="text-[13px] text-moss">
                    {t("common.today")}: <b className="tabular-nums text-ink">₹{current.toFixed(1)}/kg</b>
                  </div>
                )}
              </div>
            </div>
            {data && (
              <div className="text-right">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-moss">{t("pr.backtest")}</div>
                <div className="font-display text-xl font-bold text-forest tabular-nums">{data.accuracy}%</div>
              </div>
            )}
          </div>
          {loading || !data ? (
            <Skeleton className="h-[340px]" />
          ) : (
            <PriceChart
              history={data.history}
              forecast={data.forecast}
              color={cropObj.color}
              labelActual={t("pr.actual")}
              labelPred={t("pr.predicted")}
            />
          )}
          {data && (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl border border-ink/8 bg-cream-2/60 px-3 py-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-moss">{s.label}</span>
                  {s.node}
                </div>
              ))}
            </div>
          )}
        </Reveal>

        {/* metrics column */}
        <div className="flex flex-col gap-4">
          <Reveal delay={0.14} className="card p-5">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-moss">{t("pr.minMax")}</div>
            {data && current != null ? (
              <>
                <div className="font-display mt-2 text-3xl font-bold tabular-nums text-ink">
                  ₹{(current * 0.86).toFixed(1)} – ₹{(current * 1.14).toFixed(1)}
                </div>
                <div className="text-xs text-moss">{t("common.perKg")}</div>
              </>
            ) : <Skeleton className="mt-2 h-10" />}
          </Reveal>
          <Reveal delay={0.18} className="card p-5">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-moss">{t("pr.mape")}</div>
            {data ? (
              <>
                <div className="font-display mt-2 text-3xl font-bold tabular-nums text-ink">±{data.mape}%</div>
                <div className="mt-1 text-xs leading-snug text-ink-soft">
                  {lang === "kn"
                    ? "ಹಿಂದಿನ 14 ದಿನಗಳ ಮುನ್ಸೂಚನೆ ಪರೀಕ್ಷೆಯ ಆಧಾರದಲ್ಲಿ"
                    : "measured by replaying the model over its last 14 observed days"}
                </div>
              </>
            ) : <Skeleton className="mt-2 h-10" />}
          </Reveal>
          <Reveal delay={0.22} className="card flex-1 bg-forest p-5 !border-forest text-cream">
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-harvest">{t("t.recommendation")}</div>
            {data && (
              <p className="mt-2 text-[15px] font-medium leading-relaxed">
                {data.direction === "down"
                  ? lang === "kn"
                    ? "ಬೆಲೆ ಇಳುವಿಕೆ ಹಂತದಲ್ಲಿದೆ — 2–3 ದಿನದಲ್ಲಿ ಮಾರಾಟ ಪೂರ್ಣಗೊಳಿಸಿ. ಮಧ್ಯಂತರದಲ್ಲಿ ಟರಕ್ಕು ಹೆಚ್ಚು ಸಂಖ್ಯೆಗೆ ಬಯಸಬೇಡಿ."
                    : "Prices are in a down-phase — finish selling within 2–3 days; don't schedule extra trips waiting for a bounce."
                  : data.direction === "up"
                    ? lang === "kn"
                      ? "ಬೆಲೆ ಏರಿಕೆ ಹಂತದಲ್ಲಿದೆ — ರಸಾಯನಿಕ ಸಂಗ್ರಹಣೆ ಸಾಧ್ಯವಾದರೆ 50% ದಾಸ್ತಾನು 4–6 ದಿನ ಹಿಡಿಯಿರಿ."
                      : "Prices trending up — if your produce holds quality, keep ~50% back for 4–6 days to ride the rise."
                    : lang === "kn"
                      ? "ಬೆಲೆ ಸ್ಥಿರ — 2 ಕಂತುಗಳಲ್ಲಿ ಮಾರಿ; ದೈನಂದಿನ ಏರಿಳಿತ ತಪ್ಪಿಸಿ."
                      : "Range-bound market — sell in 2 lots across the week to smooth out daily swings."}
              </p>
            )}
          </Reveal>
        </div>
      </div>

      {/* mandi comparison */}
      <Reveal className="mt-8">
        <h2 className="font-display flex items-center gap-2 text-2xl font-semibold text-ink">
          <Trophy className="size-5 text-harvest-2" />
          {t("pr.mandiCompare")}
        </h2>
        <div className="card mt-4 overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm">
            <thead>
              <tr className="border-b border-ink/10 text-left text-[11px] uppercase tracking-wider text-moss">
                <th className="px-5 py-3 font-bold">{t("common.mandi")}</th>
                <th className="px-5 py-3 font-bold">{t("common.today")}</th>
                <th className="px-5 py-3 font-bold">{t("dash.minPrice")}–{t("dash.maxPrice")}</th>
                <th className="px-5 py-3 font-bold">{t("dash.arrivals")}</th>
                <th className="px-5 py-3 font-bold">+5d</th>
                <th className="px-5 py-3 font-bold">+14d</th>
                <th className="px-5 py-3 font-bold">{t("dash.trend7d")}</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {(data?.compare ?? []).map((m, i) => (
                <tr key={m.code} className={cn("border-b border-ink/5 last:border-0", i === 0 && "bg-forest/[0.045]")}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2 font-semibold text-ink">
                      {i === 0 && <Trophy className="size-4 text-harvest-2" />}
                      {pick(m.nameEn, m.nameKn)}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-display text-base font-bold tabular-nums text-ink">₹{m.now.toFixed(1)}</td>
                  <td className="px-5 py-3.5 tabular-nums text-ink-soft">₹{m.min.toFixed(1)} – ₹{m.max.toFixed(1)}</td>
                  <td className="px-5 py-3.5 tabular-nums text-ink-soft">{Math.round(m.arrivals)} t</td>
                  <td className="px-5 py-3.5 tabular-nums font-semibold">₹{m.f5.toFixed(1)}</td>
                  <td className="px-5 py-3.5 tabular-nums font-semibold">₹{m.f14.toFixed(1)}</td>
                  <td className="px-5 py-3.5"><TrendChip value={m.trend7} /></td>
                  <td className="px-5 py-3.5">
                    {i === 0 && (
                      <span className="rounded-full bg-forest px-3 py-1 text-[11px] font-bold text-cream">{t("pr.sellHere")}</span>
                    )}
                  </td>
                </tr>
              ))}
              {!data && (
                <tr><td colSpan={8} className="p-5"><Skeleton className="h-40" /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}

function TrendingUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props} />;
}

export default function PricesPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl p-10"><Skeleton className="h-96" /></div>}>
      <PricesInner />
    </Suspense>
  );
}
