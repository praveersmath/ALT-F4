"use client";

import { useMemo, useRef, useState, useCallback } from "react";
import { shortDate } from "@/lib/format";

export interface ChartPoint {
  date: string;
  price: number;
}

export interface ForecastPointUI {
  date: string;
  price: number;
  lower: number;
  upper: number;
}

interface Props {
  history: ChartPoint[];
  forecast: ForecastPointUI[];
  color: string;
  height?: number;
  labelActual: string;
  labelPred: string;
  lang?: string;
}

const W = 900;
const H = 340;
const PAD = { l: 46, r: 16, t: 18, b: 32 };

export default function PriceChart({ history, forecast, color, height = 340, labelActual, labelPred }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const { all, pathActual, pathLine, pathBand, xOf, yOf, minY, maxY, splitIdx, yTicks, xTicks } = useMemo(() => {
    const allPts = [
      ...history.map((p) => ({ x: p.date, y: p.price, kind: "A" as const })),
      ...forecast.map((p) => ({ x: p.date, y: p.price, lo: p.lower, hi: p.upper, kind: "F" as const })),
    ];
    const allY = [
      ...history.map((p) => p.price),
      ...forecast.flatMap((p) => [p.lower, p.upper]),
    ];
    let mn = Math.min(...allY), mx = Math.max(...allY);
    const padV = (mx - mn) * 0.14 || 1;
    mn = Math.max(0, mn - padV); mx += padV;

    const n = allPts.length;
    const x = (i: number) => PAD.l + (i / Math.max(1, n - 1)) * (W - PAD.l - PAD.r);
    const y = (v: number) => PAD.t + (1 - (v - mn) / (mx - mn)) * (H - PAD.t - PAD.b);

    const actualPath = history.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.price).toFixed(1)}`).join(" ");
    const split = history.length;
    const firstFIdx = split;

    const linePath = forecast.length
      ? `M${x(split - 1)},${y(history[history.length - 1].price)} ` +
        forecast.map((p, i) => `L${x(firstFIdx + i).toFixed(1)},${y(p.price).toFixed(1)}`).join(" ")
      : "";

    const bandPath = forecast.length
      ? forecast.map((p, i) => `${i === 0 ? "M" : "L"}${x(firstFIdx + i).toFixed(1)},${y(p.upper).toFixed(1)}`).join(" ") +
        forecast.slice().reverse().map((p, i) => `L${x(firstFIdx + forecast.length - 1 - i).toFixed(1)},${y(p.lower).toFixed(1)}`).join(" ") +
        " Z"
      : "";

    const yTickVals = Array.from({ length: 5 }, (_, i) => mn + (i / 4) * (mx - mn));
    const xTickIdxs = Array.from(new Set(
      Array.from({ length: 7 }, (_, i) => Math.round((i / 6) * (n - 1)))
    ));

    return {
      all: allPts, pathActual: actualPath, pathLine: linePath, pathBand: bandPath,
      xOf: x, yOf: y, minY: mn, maxY: mx, splitIdx: split,
      yTicks: yTickVals, xTicks: xTickIdxs,
    };
  }, [history, forecast]);

  const onMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * W;
      const i = Math.round(((px - PAD.l) / (W - PAD.l - PAD.r)) * (all.length - 1));
      setHover(Math.max(0, Math.min(all.length - 1, i)));
    },
    [all.length]
  );

  const hoverPt = hover != null ? all[hover] : null;
  const isForecastHover = hover != null && hover >= splitIdx;

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full cursor-crosshair"
        style={{ height }}
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d98e2b" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#d98e2b" stopOpacity="0.06" />
          </linearGradient>
        </defs>

        {/* grid + y labels */}
        {yTicks.map((v, i) => (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={yOf(v)} y2={yOf(v)} stroke="#1a241c" strokeOpacity="0.06" />
            <text x={PAD.l - 8} y={yOf(v) + 4} textAnchor="end" fontSize="11" fill="#42503f" fillOpacity="0.75">
              ₹{Math.round(v)}
            </text>
          </g>
        ))}

        {/* x labels */}
        {xTicks.map((i) => (
          <text key={i} x={xOf(i)} y={H - 10} textAnchor="middle" fontSize="11" fill="#42503f" fillOpacity="0.75">
            {shortDate(all[i].x)}
          </text>
        ))}

        {/* forecast band */}
        {forecast.length > 0 && (
          <path d={pathBand} fill="url(#bandGrad)" stroke="#d98e2b" strokeOpacity="0.35" strokeWidth="1" />
        )}

        {/* forecast split line */}
        {forecast.length > 0 && (
          <line
            x1={xOf(splitIdx - 1)} x2={xOf(splitIdx - 1)}
            y1={PAD.t} y2={H - PAD.b}
            stroke="#1a241c" strokeOpacity="0.18" strokeDasharray="3 4"
          />
        )}

        {/* actual area + line */}
        <path
          d={`${pathActual} L${xOf(splitIdx - 1)},${yOf(minY)} L${xOf(0)},${yOf(minY)} Z`}
          fill="url(#areaGrad)"
        />
        <path d={pathActual} fill="none" stroke={color} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />
        {forecast.length > 0 && (
          <path d={pathLine} fill="none" stroke="#8a6a35" strokeWidth="2.4" strokeDasharray="6 5" strokeLinecap="round" />
        )}

        {/* hover crosshair */}
        {hover != null && hoverPt && (
          <g>
            <line x1={xOf(hover)} x2={xOf(hover)} y1={PAD.t} y2={H - PAD.b} stroke="#1a241c" strokeOpacity="0.25" />
            <circle
              cx={xOf(hover)} cy={yOf(hoverPt.y)} r={5}
              fill={isForecastHover ? "#8a6a35" : color}
              stroke="#fffdf8" strokeWidth="2"
            />
          </g>
        )}
      </svg>

      {/* tooltip */}
      {hoverPt && (
        <div
          className="chart-tip z-10 rounded-xl border border-ink/10 bg-ink px-3 py-2 text-xs text-cream shadow-lift"
          style={{ left: `${(xOf(hover!) / W) * 100}%`, top: `${(yOf(hoverPt.y) / H) * 100}%` }}
        >
          <div className="font-semibold">₹{hoverPt.y.toFixed(1)}/kg</div>
          <div className="opacity-70">
            {shortDate(hoverPt.x)} · {isForecastHover ? labelPred : labelActual}
          </div>
          {isForecastHover && "lo" in hoverPt && (
            <div className="opacity-70">
              ₹{(hoverPt as { lo?: number }).lo?.toFixed(1)} – ₹{(hoverPt as { hi?: number }).hi?.toFixed(1)}
            </div>
          )}
        </div>
      )}

      {/* legend */}
      <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="h-[3px] w-6 rounded-full" style={{ background: color }} />
          {labelActual}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-[3px] w-6 rounded-full bg-[repeating-linear-gradient(90deg,#8a6a35_0_6px,transparent_6px_11px)]" />
          {labelPred}
        </span>
        {forecast.length > 0 && (
          <span className="flex items-center gap-1.5">
            <span className="h-3.5 w-6 rounded-sm bg-harvest/25 border border-harvest/40" />
            Confidence band
          </span>
        )}
      </div>
    </div>
  );
}
