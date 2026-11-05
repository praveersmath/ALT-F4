"use client";

import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

// ── Mood badge (bullish/neutral/bearish) ──────────────────────
export function MoodBadge({ mood, size = "md" }: { mood: "bullish" | "neutral" | "bearish"; size?: "sm" | "md" }) {
  const { t } = useI18n();
  const map = {
    bullish: { cls: "bg-forest/10 text-forest border-forest/25", dot: "bg-forest", Icon: TrendingUp, key: "common.mood.bullish" },
    neutral: { cls: "bg-harvest/12 text-harvest-2 border-harvest/30", dot: "bg-harvest", Icon: Minus, key: "common.mood.neutral" },
    bearish: { cls: "bg-tomato/10 text-tomato border-tomato/25", dot: "bg-tomato", Icon: TrendingDown, key: "common.mood.bearish" },
  } as const;
  const m = map[mood];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-semibold",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
        m.cls
      )}
    >
      <span className={cn("live-dot size-1.5 rounded-full", m.dot)} />
      <m.Icon className={size === "sm" ? "size-3" : "size-3.5"} strokeWidth={2.5} />
      {t(m.key)}
    </span>
  );
}

// ── Risk badge (LOW/MEDIUM/HIGH) ──────────────────────────────
export function RiskBadge({ level, showLabel = true }: { level: "LOW" | "MEDIUM" | "HIGH"; showLabel?: boolean }) {
  const { t } = useI18n();
  const map = {
    LOW: { cls: "bg-forest/10 text-forest border-forest/25", Icon: CheckCircle2 },
    MEDIUM: { cls: "bg-harvest/12 text-harvest-2 border-harvest/30", Icon: Info },
    HIGH: { cls: "bg-tomato/10 text-tomato border-tomato/25", Icon: AlertTriangle },
  } as const;
  const m = map[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold tracking-wide", m.cls)}>
      <m.Icon className="size-3.5" strokeWidth={2.5} />
      {showLabel && t(`common.${level}`)}
    </span>
  );
}

// ── Trend chip ────────────────────────────────────────────────
export function TrendChip({ value, invert = false }: { value: number; invert?: boolean }) {
  const up = value > 0.4;
  const down = value < -0.4;
  const good = invert ? down : up;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold tabular-nums",
        up || down
          ? good
            ? "bg-forest/10 text-forest"
            : "bg-tomato/10 text-tomato"
          : "bg-ink/5 text-ink-soft"
      )}
    >
      {up ? <TrendingUp className="size-3" /> : down ? <TrendingDown className="size-3" /> : <Minus className="size-3" />}
      {value > 0 ? "+" : ""}{value.toFixed(1)}%
    </span>
  );
}

// ── Sparkline ─────────────────────────────────────────────────
export function Sparkline({ data, color, width = 120, height = 36 }: { data: number[]; color: string; width?: number; height?: number }) {
  if (!data.length) return null;
  const mn = Math.min(...data), mx = Math.max(...data);
  const y = (v: number) => height - 3 - ((v - mn) / (mx - mn || 1)) * (height - 6);
  const x = (i: number) => (i / (data.length - 1)) * width;
  const line = data.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <path d={`${line} L${width},${height} L0,${height} Z`} fill={color} opacity="0.12" />
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={x(data.length - 1)} cy={y(data[data.length - 1])} r="2.8" fill={color} stroke="#fffdf8" strokeWidth="1.4" />
    </svg>
  );
}

// ── Segmented control ─────────────────────────────────────────
export function Segmented<T extends string>({
  options, value, onChange, className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex flex-wrap gap-1 rounded-2xl border border-ink/12 bg-paper p-1 shadow-soft", className)}>
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-xl px-3.5 py-1.5 text-[13px] font-semibold transition-all",
            value === o.value ? "seg-active" : "text-ink-soft hover:text-ink"
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ── Loading skeleton block ────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton h-24 w-full", className)} />;
}

// ── Field label ───────────────────────────────────────────────
export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-moss">{children}</label>;
}
