"use client";

import { useEffect, useState } from "react";
import { Newspaper, RefreshCw, ExternalLink, ThumbsUp, ThumbsDown, Minus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { CROPS } from "@/lib/constants";
import Reveal from "@/components/Reveal";
import { MoodBadge, Skeleton } from "@/components/ui";
import { cn } from "@/lib/utils";
import { CropIcon } from "../page";

interface NewsItem {
  id: string; title: string; source: string; url: string; publishedAt: string;
  cropCode: string; sentiment: "positive" | "negative" | "neutral";
  impactEn: string; impactKn: string;
}
interface NewsData {
  items: NewsItem[];
  mood: Record<string, "bullish" | "neutral" | "bearish">;
  source: string;
}

const SENT = {
  positive: { Icon: ThumbsUp, cls: "bg-forest/10 text-forest border-forest/25", key: "n.positive" },
  negative: { Icon: ThumbsDown, cls: "bg-tomato/10 text-tomato border-tomato/25", key: "n.negative" },
  neutral: { Icon: Minus, cls: "bg-ink/6 text-ink-soft border-ink/12", key: "n.neutral" },
} as const;

export default function NewsPage() {
  const { t, pick, lang } = useI18n();
  const [data, setData] = useState<NewsData | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const load = (refresh: boolean) => {
    if (refresh) setRefreshing(true);
    fetch(`/api/news${refresh ? "?refresh=1" : ""}`)
      .then((r) => r.json()).then((d) => d.ok && setData(d))
      .catch(() => {}).finally(() => setRefreshing(false));
  };
  useEffect(() => { load(false); }, []);

  const items = data?.items.filter((n) => filter === "all" || n.cropCode === filter) ?? [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Reveal>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t("n.title")}</h1>
            <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">{t("n.subtitle")}</p>
          </div>
          <button
            onClick={() => load(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-full border border-ink/15 bg-paper px-4 py-2 text-sm font-bold text-ink shadow-soft transition-all hover:border-harvest/50 disabled:opacity-60"
          >
            <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
            {t("n.refresh")}
          </button>
        </div>
      </Reveal>

      {/* market mood */}
      <Reveal delay={0.05} className="card mt-6 p-5">
        <h2 className="font-display text-lg font-semibold text-ink">{t("n.marketMood")}</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {CROPS.map((c) => (
            <div key={c.code} className="flex items-center justify-between rounded-2xl border border-ink/8 bg-cream-2/50 p-4">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-2xl" style={{ background: c.bgSoft }}>
                  <CropIcon code={c.code} color={c.color} size={20} />
                </span>
                <div>
                  <div className="font-display font-semibold text-ink">{pick(c.nameEn, c.nameKn)}</div>
                  <div className="text-[11px] text-moss">{data?.source === "live" ? t("common.source.live") : data?.source ?? "…"}</div>
                </div>
              </div>
              {data ? <MoodBadge mood={data.mood[c.code] ?? "neutral"} /> : <Skeleton className="h-7 w-20" />}
            </div>
          ))}
        </div>
      </Reveal>

      {/* filter */}
      <Reveal delay={0.08}>
        <div className="mt-6 flex flex-wrap gap-2">
          {[{ code: "all", nameEn: "All news", nameKn: "ಎಲ್ಲಾ" }, ...CROPS.map((c) => ({ code: c.code, nameEn: c.nameEn.split(" ")[0], nameKn: c.nameKn })), { code: "general", nameEn: "General", nameKn: "ಸಾಮಾನ್ಯ" }].map((f) => (
            <button
              key={f.code}
              onClick={() => setFilter(f.code)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-all",
                filter === f.code ? "border-forest bg-forest text-cream" : "border-ink/12 bg-paper text-ink-soft hover:text-ink"
              )}
            >
              {pick(f.nameEn, f.nameKn)}
            </button>
          ))}
        </div>
      </Reveal>

      {/* news cards */}
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {!data && [0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}
        {data && items.map((n, i) => {
          const s = SENT[n.sentiment];
          const crop = CROPS.find((c) => c.code === n.cropCode);
          return (
            <Reveal key={n.id} delay={(i % 4) * 0.05} className="card card-hover flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 text-[11px] font-semibold text-moss">
                  <Newspaper className="size-3.5" />
                  {n.source} · {timeAgo(n.publishedAt, lang)}
                </div>
                <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-bold", s.cls)}>
                  <s.Icon className="size-3" />
                  {t(s.key)}
                </span>
              </div>
              <a href={n.url} target="_blank" rel="noopener noreferrer" className="group mt-2">
                <h3 className="font-display text-[17px] font-semibold leading-snug text-ink transition-colors group-hover:text-forest">
                  {n.title}
                  <ExternalLink className="ml-1.5 inline size-3.5 opacity-40" />
                </h3>
              </a>
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-ink/8 bg-cream-2/60 p-3">
                {crop && (
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg" style={{ background: crop.bgSoft }}>
                    <CropIcon code={crop.code} color={crop.color} size={15} />
                  </span>
                )}
                <p className="text-[13px] leading-snug text-ink-soft">
                  <span className="mr-1 font-bold uppercase tracking-wide text-[10px] text-harvest-2">{t("n.impact")}:</span>
                  {lang === "kn" && n.impactKn ? n.impactKn : n.impactEn}
                </p>
              </div>
            </Reveal>
          );
        })}
        {data && items.length === 0 && (
          <div className="card p-10 text-center text-ink-soft lg:col-span-2">
            {lang === "kn" ? "ಈ ಬೆಳೆಗೆ ಸಂಬಂಧಿಸಿದ ಸುದ್ದಿ ಈಗಿಲ್ಲ." : "No news for this crop right now."}
          </div>
        )}
      </div>
    </div>
  );
}

function timeAgo(iso: string, lang: string): string {
  const h = Math.max(0, (Date.now() - +new Date(iso)) / 3600e3);
  if (h < 1) return lang === "kn" ? "ಈಗಷ್ಟೇ" : "just now";
  if (h < 24) return lang === "kn" ? `${Math.round(h)} ಗಂಟೆ ಹಿಂದೆ` : `${Math.round(h)}h ago`;
  const d = Math.round(h / 24);
  return lang === "kn" ? `${d} ದಿನ ಹಿಂದೆ` : `${d}d ago`;
}
