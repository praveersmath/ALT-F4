"use client";

import { useEffect, useState } from "react";
import { Recycle, Phone, MapPin, CircleCheckBig, Factory, ArrowUpFromLine } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CROPS, ORIGIN_TOWNS } from "@/lib/constants";
import Reveal from "@/components/Reveal";
import { Segmented, Skeleton, FieldLabel } from "@/components/ui";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CropIcon } from "../page";

type Cond = "damaged" | "price_crash" | "surplus";

interface Product {
  id: string; productEn: string; productKn: string;
  revenueMultiple: number; shelfLifeEn: string; shelfLifeKn: string;
  marketEn: string; stepsEn: string[]; stepsKn: string[];
  yieldPct: number; sellPricePerKg: number;
  productQty: number; revenue: number; rawRevenue: number;
  investment: number; netAdvantage: number; multiple: number;
}
interface Unit {
  id: string; name: string; districtEn: string; districtKn: string;
  phone: string; handlesEn: string; handlesKn: string; distanceKm: number;
}
interface WasteData {
  rawPrice: number; rawTotal: number; products: Product[]; units: Unit[];
}

export default function WastePage() {
  const { t, pick, lang } = useI18n();
  const [crop, setCrop] = useState("tomato");
  const [cond, setCond] = useState<Cond>("damaged");
  const [qty, setQty] = useState(200);
  const [from, setFrom] = useState("CHIK");
  const [data, setData] = useState<WasteData | null>(null);
  const [loading, setLoading] = useState(false);
  const [openSteps, setOpenSteps] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/waste?crop=${crop}&condition=${cond}&qty=${qty}&from=${from}`)
      .then((r) => r.json()).then((d) => d.ok && setData(d))
      .catch(() => {}).finally(() => setLoading(false));
  }, [crop, cond, qty, from]);

  const cropObj = CROPS.find((c) => c.code === crop)!;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Reveal>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t("v.title")}</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">{t("v.subtitle")}</p>
      </Reveal>

      {/* banner */}
      <Reveal delay={0.05}>
        <div className="mt-6 overflow-hidden rounded-3xl bg-gradient-to-r from-tomato via-[#a83a2a] to-harvest-2 p-5 text-cream">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-cream/15">
              <Recycle className="size-6" />
            </span>
            <p className="font-display text-lg font-medium leading-snug sm:text-xl">{t("v.bannerHeadline")}</p>
          </div>
        </div>
      </Reveal>

      {/* controls */}
      <Reveal delay={0.08} className="card mt-6 p-5">
        <div className="grid gap-4 lg:grid-cols-[auto_auto_1fr_auto] lg:items-end">
          <div>
            <FieldLabel>{t("common.crop")}</FieldLabel>
            <Segmented
              value={crop}
              onChange={(v) => setCrop(v as string)}
              options={CROPS.map((c) => ({ value: c.code as string, label: pick(c.nameEn.split(" ")[0], c.nameKn) }))}
            />
          </div>
          <div>
            <FieldLabel>{t("v.condition")}</FieldLabel>
            <Segmented
              value={cond}
              onChange={(v) => setCond(v as Cond)}
              options={[
                { value: "damaged" as Cond, label: t("v.damaged") },
                { value: "price_crash" as Cond, label: t("v.price_crash") },
                { value: "surplus" as Cond, label: t("v.surplus") },
              ]}
            />
          </div>
          <div>
            <FieldLabel>{t("t.qty")}</FieldLabel>
            <input
              type="number" min={50} step={50} value={qty}
              onChange={(e) => setQty(Math.max(50, Number(e.target.value)))}
              className="w-full max-w-[200px] rounded-xl border border-ink/12 bg-cream-2/50 px-3.5 py-2 text-sm font-bold tabular-nums"
            />
          </div>
          <div>
            <FieldLabel>{t("t.from")}</FieldLabel>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-xl border border-ink/12 bg-cream-2/50 px-3.5 py-2.5 text-sm font-semibold">
              {ORIGIN_TOWNS.map((o) => <option key={o.code} value={o.code}>{pick(o.nameEn, o.nameKn)}</option>)}
            </select>
          </div>
        </div>
      </Reveal>

      {/* raw-vs-product headline numbers */}
      {data && !loading && (
        <Reveal delay={0.1}>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="card border-tomato/25 bg-tomato/[0.05] p-5">
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-tomato">{t("v.rawSale")}</div>
              <div className="font-display mt-1 text-3xl font-bold tabular-nums text-ink">{formatINR(data.rawTotal)}</div>
              <div className="text-xs text-moss">{qty} kg × ₹{data.rawPrice.toFixed(1)}/kg</div>
            </div>
            <div className="card border-forest/30 bg-forest/[0.05] p-5 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-forest">
                <ArrowUpFromLine className="size-3.5" /> {t("v.asProduct")}
              </div>
              <div className="font-display mt-1 text-3xl font-bold tabular-nums text-forest">
                {formatINR(Math.max(...data.products.map((p) => p.revenue), 0))}
              </div>
              <div className="text-xs text-ink-soft">
                {lang === "kn"
                  ? `ಉತ್ತಮ ಆಯ್ಕೆ — ${qty}kg ನಿಂದ ಸಂಭಾವ್ಯ ಗರಿಷ್ಠ ಆದಾಯ`
                  : `best option among ${data.products.length} value-added products — compared line-by-line below`}
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {/* product cards */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {loading && [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-72" />)}
        {data && !loading && data.products.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.06} className="card card-hover flex flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl" style={{ background: cropObj.bgSoft }}>
                  <CropIcon code={crop} color={cropObj.color} size={22} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold leading-tight text-ink">{pick(p.productEn, p.productKn)}</h3>
                  <div className="text-[11px] font-medium text-moss">{pick(p.shelfLifeEn, p.shelfLifeKn)} · {t("v.market")}: {p.marketEn.split(",")[0]}</div>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-forest px-2.5 py-1 text-xs font-bold tabular-nums text-cream">
                {p.multiple}×
              </span>
            </div>

            {/* revenue compare bars */}
            <div className="mt-4 space-y-2">
              <div>
                <div className="mb-1 flex justify-between text-[11px] font-semibold">
                  <span className="text-tomato">{t("v.rawSale")}</span>
                  <span className="tabular-nums text-ink-soft">{formatINR(p.rawRevenue)}</span>
                </div>
                <div className="h-5 overflow-hidden rounded-md bg-ink/6">
                  <div className="h-full rounded-md bg-tomato/70 transition-all duration-700" style={{ width: `${Math.max(4, (p.rawRevenue / p.revenue) * 100)}%` }} />
                </div>
              </div>
              <div>
                <div className="mb-1 flex justify-between text-[11px] font-semibold">
                  <span className="text-forest">{p.productQty} kg → {pick(p.productEn, p.productKn)}</span>
                  <span className="tabular-nums text-ink">{formatINR(p.revenue)}</span>
                </div>
                <div className="h-5 overflow-hidden rounded-md bg-ink/6">
                  <div className="flex h-full items-center rounded-md bg-forest pl-2 text-[10px] font-bold text-cream transition-all duration-700" style={{ width: "100%" }}>
                    {lang === "kn" ? `+${formatINR(p.netAdvantage)} ಹೆಚ್ಚುವರಿ` : `+${formatINR(p.netAdvantage)} net advantage`}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 text-[12px]">
              <div className="rounded-lg bg-cream-2/70 px-3 py-2">
                <span className="font-semibold text-moss">{t("v.investment")}</span>
                <div className="font-bold tabular-nums text-ink">{formatINR(p.investment)}</div>
              </div>
              <div className="rounded-lg bg-cream-2/70 px-3 py-2">
                <span className="font-semibold text-moss">{lang === "kn" ? "ಮಾರಾಟ ಬೆಲೆ" : "Sell price"}</span>
                <div className="font-bold tabular-nums text-ink">₹{p.sellPricePerKg}/kg</div>
              </div>
            </div>

            <button
              onClick={() => setOpenSteps(openSteps === p.id ? null : p.id)}
              className="mt-3 flex items-center justify-between rounded-xl border border-ink/12 px-3.5 py-2.5 text-[13px] font-bold text-ink transition-colors hover:border-harvest/50"
            >
              {t("v.steps")}
              <span className={cn("transition-transform", openSteps === p.id && "rotate-45")}>＋</span>
            </button>
            <div className={cn("grid transition-all duration-300", openSteps === p.id ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
              <ol className="overflow-hidden">
                {(lang === "kn" ? p.stepsKn : p.stepsEn).map((s, si) => (
                  <li key={si} className="flex gap-2.5 py-1 text-[13px] leading-snug text-ink-soft">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-forest/12 text-[10px] font-bold text-forest">{si + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </Reveal>
        ))}
      </div>

      {/* nearby units */}
      <Reveal className="mt-10">
        <h2 className="font-display flex items-center gap-2 text-2xl font-semibold text-ink">
          <Factory className="size-5 text-harvest-2" /> {t("v.nearbyUnits")}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(data?.units ?? []).map((u, i) => (
            <div key={u.id} className="card card-hover p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display font-semibold leading-tight text-ink">{u.name}</h3>
                <span className="shrink-0 rounded-full bg-forest/10 px-2 py-0.5 text-[11px] font-bold tabular-nums text-forest">{u.distanceKm} km</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-[12px] text-moss">
                <MapPin className="size-3.5" /> {pick(u.districtEn, u.districtKn)} · Karnataka
              </div>
              <p className="mt-2 flex items-start gap-1.5 text-[13px] text-ink-soft">
                <CircleCheckBig className="mt-0.5 size-3.5 shrink-0 text-forest" />
                {pick(u.handlesEn, u.handlesKn)}
              </p>
              <a href={`tel:${u.phone.replace(/[^0-9+]/g, "")}`} className="mt-3 flex items-center gap-1.5 rounded-lg border border-ink/12 px-3 py-2 text-[13px] font-bold text-ink transition-colors hover:border-forest hover:bg-forest hover:text-cream">
                <Phone className="size-3.5" /> {u.phone}
              </a>
            </div>
          ))}
          {!data && [0, 1, 2].map((i) => <Skeleton key={i} className="h-36" />)}
        </div>
      </Reveal>
    </div>
  );
}
