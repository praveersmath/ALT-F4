"use client";

import { useEffect, useState } from "react";
import { Trophy, Fuel, Truck, Package, Landmark, HardHat, Route } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { ORIGIN_TOWNS, CROPS } from "@/lib/constants";
import Reveal from "@/components/Reveal";
import { Skeleton, FieldLabel } from "@/components/ui";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CropIcon } from "../page";

interface Quote {
  mandiCode: string; mandiEn: string; mandiKn: string; distanceKm: number;
  sellPrice: number; revenue: number; transportCost: number; packagingCost: number;
  commission: number; labourCost: number; totalCost: number; netProfit: number;
}
interface TransportData {
  originNameEn: string; originNameKn: string; qty: number;
  diesel: { price: number; source: string };
  quotes: Quote[];
  recommendation: { en: string; kn: string };
}

export default function TransportPage() {
  const { t, pick, lang } = useI18n();
  const [from, setFrom] = useState("CHIK");
  const [crop, setCrop] = useState("tomato");
  const [qty, setQty] = useState(500);
  const [data, setData] = useState<TransportData | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true);
    fetch(`/api/transport?from=${from}&crop=${crop}&qty=${qty}`)
      .then((r) => r.json()).then((d) => d.ok && setData(d))
      .catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(run, []); // eslint-disable-line react-hooks/exhaustive-deps

  const cropObj = CROPS.find((c) => c.code === crop)!;
  const best = data?.quotes[0];
  const maxProfit = data ? Math.max(...data.quotes.map((q) => q.netProfit), 1) : 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Reveal>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t("t.title")}</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">{t("t.subtitle")}</p>
      </Reveal>

      {/* inputs */}
      <Reveal delay={0.05} className="card mt-6 p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_0.7fr_0.6fr]">
          <div>
            <FieldLabel>{t("t.from")}</FieldLabel>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full rounded-xl border border-ink/12 bg-cream-2/50 px-3.5 py-2.5 text-sm font-semibold text-ink">
              {ORIGIN_TOWNS.map((o) => <option key={o.code} value={o.code}>{pick(o.nameEn, o.nameKn)}</option>)}
            </select>
          </div>
          <div>
            <FieldLabel>{t("common.crop")}</FieldLabel>
            <div className="grid grid-cols-3 gap-1 rounded-xl border border-ink/12 bg-cream-2/50 p-1">
              {CROPS.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setCrop(c.code)}
                  className={cn("flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-[12px] font-bold transition-all", crop === c.code ? "seg-active" : "text-ink-soft")}
                >
                  <CropIcon code={c.code} color={crop === c.code ? "#faf6ee" : c.color} size={16} />
                  {pick(c.nameEn.split(" ")[0], c.nameKn)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <FieldLabel>{t("t.qty")}</FieldLabel>
            <input
              type="number" min={50} max={20000} step={50} value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-full rounded-xl border border-ink/12 bg-cream-2/50 px-3.5 py-2.5 text-sm font-bold tabular-nums text-ink"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={run} disabled={loading}
              className="w-full rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-cream shadow-soft transition-all hover:bg-forest-2 disabled:opacity-60"
            >
              {loading ? "…" : t("t.calculate")}
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 text-[12px] text-ink-soft">
          <span className="flex items-center gap-1.5"><Fuel className="size-3.5 text-harvest-2" />{t("t.diesel")}: <b className="tabular-nums">{data ? formatINR(data.diesel.price, 2) : "…"}{t("t.perLitre")}</b></span>
          <span className="flex items-center gap-1.5"><Route className="size-3.5 text-forest" />{lang === "kn" ? "ದೂರ = ಸರಿಯಾದ ರಸ್ತೆ ಅಂದಾಜು (ಹಿಂತಿರುಗುವ ಸಹ)" : "Round-trip road distance included"}</span>
        </div>
      </Reveal>

      {/* recommendation banner */}
      {best && data && (
        <Reveal>
          <div className="card mt-6 border-forest/35 bg-gradient-to-r from-forest via-forest-2 to-forest p-5 text-cream">
            <div className="flex flex-wrap items-center gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-harvest text-ink shadow-lift">
                <Trophy className="size-6" />
              </span>
              <div className="min-w-[220px] flex-1">
                <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-harvest">{t("t.bestOption")}</div>
                <p className="mt-1 text-[15px] font-medium leading-snug">
                  {lang === "kn" ? data.recommendation.kn : data.recommendation.en}
                </p>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-bold tabular-nums">{formatINR(best.netProfit)}</div>
                <div className="text-[11px] uppercase tracking-wider text-cream/70">{t("t.netProfit")}</div>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* comparison table */}
      <Reveal className="mt-6" delay={0.05}>
        <h2 className="font-display flex items-center gap-2 text-2xl font-semibold text-ink">
          <Truck className="size-5 text-harvest-2" /> {t("t.results")}
        </h2>
        <div className="card mt-4 overflow-x-auto">
          {!data ? (
            <div className="p-5"><Skeleton className="h-64" /></div>
          ) : (
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-ink/10 text-left text-[11px] uppercase tracking-wider text-moss">
                  <th className="px-5 py-3 font-bold">{t("common.mandi")}</th>
                  <th className="px-4 py-3 font-bold">{t("common.distance")}</th>
                  <th className="px-4 py-3 font-bold">{t("t.expectedPrice")}</th>
                  <th className="px-4 py-3 font-bold">{t("t.revenue")}</th>
                  <th className="px-4 py-3 font-bold">{t("t.transport")}</th>
                  <th className="px-4 py-3 font-bold">{t("t.packaging")}</th>
                  <th className="px-4 py-3 font-bold">{t("t.commission")}</th>
                  <th className="px-4 py-3 font-bold">{t("t.labour")}</th>
                  <th className="px-4 py-3 font-bold">{t("t.netProfit")}</th>
                </tr>
              </thead>
              <tbody>
                {data.quotes.map((q, i) => (
                  <tr key={q.mandiCode} className={cn("border-b border-ink/5 last:border-0", i === 0 && "bg-forest/[0.05]")}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 font-semibold text-ink">
                        {i === 0 && <Trophy className="size-4 text-harvest-2" />}
                        {pick(q.mandiEn, q.mandiKn)}
                      </div>
                      {i === 0 && <span className="ml-6 rounded-full bg-forest px-2 py-0.5 text-[10px] font-bold text-cream">{t("t.bestOption")}</span>}
                    </td>
                    <td className="px-4 py-3.5 tabular-nums text-ink-soft">{q.distanceKm} {t("common.km")}</td>
                    <td className="px-4 py-3.5 tabular-nums font-semibold text-ink">₹{q.sellPrice.toFixed(1)}</td>
                    <td className="px-4 py-3.5 tabular-nums font-semibold text-ink">{formatINR(q.revenue)}</td>
                    <td className="px-4 py-3.5 tabular-nums text-tomato">{formatINR(q.transportCost)}</td>
                    <td className="px-4 py-3.5 tabular-nums text-ink-soft">{formatINR(q.packagingCost)}</td>
                    <td className="px-4 py-3.5 tabular-nums text-ink-soft">{formatINR(q.commission)}</td>
                    <td className="px-4 py-3.5 tabular-nums text-ink-soft">{formatINR(q.labourCost)}</td>
                    <td className="px-4 py-3.5">
                      <span className={cn("font-display text-base font-bold tabular-nums", i === 0 ? "text-forest" : "text-ink")}>
                        {formatINR(q.netProfit)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Reveal>

      {/* profit bars */}
      {data && (
        <Reveal className="card mt-6 p-5" delay={0.08}>
          <h3 className="font-display text-lg font-semibold text-ink">{t("v.revenueCompare")}</h3>
          <div className="mt-4 space-y-3">
            {data.quotes.map((q, i) => (
              <div key={q.mandiCode} className="flex items-center gap-3">
                <div className="w-32 shrink-0 truncate text-[13px] font-semibold text-ink">{pick(q.mandiEn.split(",")[0], q.mandiKn)}</div>
                <div className="h-7 flex-1 overflow-hidden rounded-lg bg-ink/6">
                  <div
                    className={cn("flex h-full items-center rounded-lg pl-3 text-[11px] font-bold text-cream transition-all duration-700", i === 0 ? "bg-forest" : "bg-moss/60")}
                    style={{ width: `${Math.max(6, (q.netProfit / maxProfit) * 100)}%` }}
                  >
                    {q.netProfit > 0 ? formatINR(q.netProfit) : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-ink/8 pt-4 text-[12px] text-ink-soft sm:grid-cols-4">
            {[
              { Icon: Truck, label: t("t.transport") },
              { Icon: Package, label: t("t.packaging") + " ₹2/kg" },
              { Icon: Landmark, label: t("t.commission") },
              { Icon: HardHat, label: t("t.labour") + " ₹1/kg" },
            ].map((c, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <c.Icon className="size-3.5 text-harvest-2" /> {c.label}
              </div>
            ))}
          </div>
        </Reveal>
      )}
    </div>
  );
}
