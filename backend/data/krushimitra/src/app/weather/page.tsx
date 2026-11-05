"use client";

import { useEffect, useState } from "react";
import { CloudRain, Droplets, Wind, Thermometer, TriangleAlert, Info, CircleCheck, MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { DISTRICTS, CROPS } from "@/lib/constants";
import Reveal from "@/components/Reveal";
import { RiskBadge, Skeleton, FieldLabel } from "@/components/ui";
import { shortDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import { CropIcon } from "../page";

interface DayF { date: string; tMax: number; tMin: number; rainMm: number; rainProb: number; humidity: number; windKmh: number }
interface CropRisk { cropCode: string; level: "LOW" | "MEDIUM" | "HIGH"; score: number; reasonEn: string; reasonKn: string }
interface DW {
  districtCode: string; nameEn: string; nameKn: string; days: DayF[];
  totalRain: number; avgHumidity: number; maxTemp: number;
  risks: CropRisk[];
  advisories: { en: string; kn: string; level: "info" | "warning" | "critical" }[];
  source: string;
}

export default function WeatherPage() {
  const { t, pick, lang } = useI18n();
  const [code, setCode] = useState("KOL");
  const [data, setData] = useState<DW | null>(null);
  const [all, setAll] = useState<DW[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/weather?district=${code}`)
      .then((r) => r.json()).then((d) => { if (d.ok) setData(d.district); })
      .catch(() => {}).finally(() => setLoading(false));
  }, [code]);

  useEffect(() => {
    fetch("/api/weather?district=all").then((r) => r.json()).then((d) => d.ok && setAll(d.districts)).catch(() => {});
  }, []);

  const maxRain = data ? Math.max(...data.days.map((d) => d.rainMm), 10) : 10;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Reveal>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t("w.title")}</h1>
        <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">{t("w.subtitle")}</p>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mt-6 flex flex-wrap gap-2">
          {DISTRICTS.map((d) => (
            <button
              key={d.code}
              onClick={() => setCode(d.code)}
              className={cn(
                "rounded-full border px-4 py-2 text-[13px] font-semibold transition-all",
                code === d.code ? "border-forest bg-forest text-cream shadow-soft" : "border-ink/12 bg-paper text-ink-soft hover:border-harvest/50 hover:text-ink"
              )}
            >
              {pick(d.nameEn, d.nameKn)}
            </button>
          ))}
        </div>
      </Reveal>

      {/* 7-day forecast */}
      <Reveal className="card mt-6 p-5" delay={0.08}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-xl font-semibold text-ink">{t("w.7day")} — {data ? pick(data.nameEn, data.nameKn) : "…"}</h2>
          {data && (
            <span className="rounded-full bg-forest/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-forest">
              {data.source === "fallback" ? t("common.source.fallback") : t("common.source.live")}
            </span>
          )}
        </div>
        {loading || !data ? (
          <Skeleton className="mt-4 h-48" />
        ) : (
          <>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
              {data.days.map((d, i) => (
                <div key={d.date} className={cn("rounded-2xl border p-3 text-center transition-all hover:shadow-soft", i === 0 ? "border-harvest/50 bg-harvest/8" : "border-ink/8 bg-cream-2/50")}>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-moss">{i === 0 ? t("common.today") : shortDate(d.date)}</div>
                  <RainIcon rain={d.rainMm} />
                  <div className="font-display mt-1 text-lg font-bold tabular-nums text-ink">{d.tMax}°</div>
                  <div className="text-[11px] tabular-nums text-moss">{d.tMin}° min</div>
                  <div className="mt-1.5 flex items-center justify-center gap-1 text-[11px] font-semibold text-sky-bad tabular-nums">
                    <Droplets className="size-3" />{d.rainMm}mm
                  </div>
                  <div className="text-[10px] text-moss">{d.rainProb}% · {d.humidity}% RH</div>
                </div>
              ))}
            </div>
            {/* rain bars */}
            <div className="mt-5 flex h-20 items-end gap-2">
              {data.days.map((d, i) => (
                <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-semibold tabular-nums text-sky-bad">{d.rainMm > 0 ? `${d.rainMm}` : ""}</span>
                  <div
                    className={cn("w-full max-w-14 rounded-t-lg transition-all", d.rainMm > 5 ? "bg-sky-bad/75" : "bg-ink/12")}
                    style={{ height: `${Math.max(6, (d.rainMm / maxRain) * 64)}px` }}
                  />
                  <span className="text-[10px] font-medium text-moss">{i === 0 ? t("common.today") : shortDate(d.date)}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </Reveal>

      {/* summary chips */}
      {data && (
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { Icon: CloudRain, label: t("w.totalRain"), value: `${data.totalRain} mm`, tone: "text-sky-bad" },
            { Icon: Thermometer, label: t("w.maxTemp"), value: `${data.maxTemp}°C`, tone: "text-tomato" },
            { Icon: Wind, label: t("w.humidity"), value: `${data.avgHumidity}% RH`, tone: "text-forest" },
          ].map((s, i) => (
            <Reveal key={i} delay={i * 0.05} className="card flex items-center gap-3 p-4">
              <span className={cn("grid size-10 place-items-center rounded-xl bg-cream-2", s.tone)}><s.Icon className="size-5" /></span>
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-moss">{s.label}</div>
                <div className="font-display text-xl font-bold tabular-nums text-ink">{s.value}</div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* crop risk analysis */}
      <Reveal className="mt-8">
        <h2 className="font-display text-2xl font-semibold text-ink">{t("w.cropImpact")}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {!data
            ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-44" />)
            : data.risks.map((r, i) => {
                const c = CROPS.find((x) => x.code === r.cropCode)!;
                return (
                  <Reveal key={r.cropCode} delay={i * 0.07} className="card card-hover p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="grid size-10 place-items-center rounded-2xl" style={{ background: c.bgSoft }}>
                          <CropIcon code={c.code} color={c.color} size={20} />
                        </span>
                        <div className="font-display text-lg font-semibold text-ink">{pick(c.nameEn, c.nameKn)}</div>
                      </div>
                      <RiskBadge level={r.level} />
                    </div>
                    {/* risk meter */}
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink/8">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", r.level === "HIGH" ? "bg-tomato" : r.level === "MEDIUM" ? "bg-harvest" : "bg-forest")}
                        style={{ width: `${r.score}%` }}
                      />
                    </div>
                    <div className="mt-1 text-right text-[11px] font-bold tabular-nums text-moss">{r.score}/100</div>
                    <p className="mt-3 text-[13px] leading-snug text-ink-soft">{lang === "kn" ? r.reasonKn : r.reasonEn}</p>
                  </Reveal>
                );
              })}
        </div>
      </Reveal>

      {/* advisories */}
      {data && (
        <Reveal className="mt-8">
          <h2 className="font-display text-2xl font-semibold text-ink">{t("w.advisories")}</h2>
          <div className="mt-4 space-y-3">
            {data.advisories.map((a, i) => {
              const Icon = a.level === "critical" ? TriangleAlert : a.level === "warning" ? Info : CircleCheck;
              const cls = a.level === "critical" ? "border-tomato/40 bg-tomato/[0.06] text-tomato" : a.level === "warning" ? "border-harvest/40 bg-harvest/[0.08] text-harvest-2" : "border-forest/30 bg-forest/[0.05] text-forest";
              return (
                <div key={i} className={cn("flex gap-3 rounded-2xl border p-4", cls)}>
                  <Icon className="mt-0.5 size-5 shrink-0" />
                  <p className="text-[14px] font-medium leading-snug text-ink">{lang === "kn" ? a.kn : a.en}</p>
                </div>
              );
            })}
          </div>
        </Reveal>
      )}

      {/* all districts grid */}
      <Reveal className="mt-10">
        <h2 className="font-display flex items-center gap-2 text-2xl font-semibold text-ink">
          <MapPin className="size-5 text-harvest-2" /> {t("w.allDistricts")}
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {all.length === 0 && [0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32" />)}
          {all.map((d, i) => {
            const worst = d.risks.reduce((a, b) => (b.score > a.score ? b : a), d.risks[0]);
            return (
              <Reveal key={d.districtCode} delay={i * 0.05}>
                <button
                  onClick={() => setCode(d.districtCode)}
                  className={cn("card card-hover block w-full p-4 text-left", code === d.districtCode && "ring-2 ring-forest")}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display font-semibold text-ink">{pick(d.nameEn, d.nameKn)}</span>
                    <RiskBadge level={worst.level} showLabel={false} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-1 text-center text-[11px] tabular-nums">
                    <div><div className="font-bold text-ink">{d.maxTemp}°</div><div className="text-moss">max</div></div>
                    <div><div className="font-bold text-sky-bad">{d.totalRain}mm</div><div className="text-moss">{t("w.rainfall")}</div></div>
                    <div><div className="font-bold text-moss">{d.avgHumidity}%</div><div className="text-moss">RH</div></div>
                  </div>
                  <div className="mt-2 flex gap-1">
                    {d.risks.map((r) => (
                      <div key={r.cropCode} className={cn("h-1.5 flex-1 rounded-full", r.level === "HIGH" ? "bg-tomato" : r.level === "MEDIUM" ? "bg-harvest" : "bg-forest")} />
                    ))}
                  </div>
                </button>
              </Reveal>
            );
          })}
        </div>
      </Reveal>
    </div>
  );
}

function RainIcon({ rain }: { rain: number }) {
  return (
    <svg viewBox="0 0 28 28" className="mx-auto mt-1 size-8">
      <path d="M8 15a6 6 0 1 1 1.7-11.8A7 7 0 0 1 21 6.4 4.6 4.6 0 0 1 20 15H8Z" fill={rain > 4 ? "#3e6e94" : rain > 0.4 ? "#8fae6a" : "#d98e2b"} opacity={rain > 0.4 ? 1 : 0.85} />
      {rain > 0.4 && [0, 1, 2].map((i) => (
        <line key={i} x1={10 + i * 4} y1={17.5} x2={9 + i * 4} y2={22.5} stroke="#3e6e94" strokeWidth="1.8" strokeLinecap="round" opacity={Math.min(1, 0.35 + rain / 25)} />
      ))}
    </svg>
  );
}
