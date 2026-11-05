"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, TrendingUp, CloudSun, Truck, Recycle,
  Newspaper, MessageCircle, BrainCircuit, Sprout, Menu, X, Languages,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", key: "nav.home", Icon: LayoutDashboard },
  { href: "/prices", key: "nav.prices", Icon: TrendingUp },
  { href: "/weather", key: "nav.weather", Icon: CloudSun },
  { href: "/transport", key: "nav.transport", Icon: Truck },
  { href: "/waste-to-value", key: "nav.waste", Icon: Recycle },
  { href: "/news", key: "nav.news", Icon: Newspaper },
  { href: "/insights", key: "nav.insights", Icon: BrainCircuit },
  { href: "/chat", key: "nav.chat", Icon: MessageCircle },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const { lang, setLang, t } = useI18n();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-cream/85 shadow-[0_1px_0_rgb(26_36_28/0.08),0_12px_36px_-18px_rgb(26_36_28/0.25)] backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-xl bg-forest text-cream shadow-soft transition-transform duration-300 group-hover:rotate-6">
            <Sprout className="size-5" strokeWidth={2.2} />
          </span>
          <span className="leading-tight">
            <span className="font-display block text-lg font-semibold tracking-tight text-ink">
              ಕೃಷಿಮಿತ್ರ
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.16em] text-moss">
              KrushiMitra · Karnataka
            </span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-0.5 lg:flex">
          {NAV.map(({ href, key, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
                  active ? "bg-forest text-cream" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
                )}
              >
                <Icon className="size-3.5" strokeWidth={2.4} />
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setLang(lang === "en" ? "kn" : "en")}
          className={cn(
            "ml-2 flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1.5 text-[13px] font-semibold",
            "bg-paper shadow-soft transition-all hover:border-harvest/60 hover:shadow-lift"
          )}
          aria-label="Toggle language"
        >
          <Languages className="size-3.5 text-harvest-2" strokeWidth={2.4} />
          {lang === "en" ? "ಕನ್ನಡ" : "English"}
        </button>

        <button
          className="grid size-9 place-items-center rounded-full border border-ink/15 bg-paper lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* mobile nav */}
      <div
        className={cn(
          "overflow-hidden border-t border-ink/5 bg-cream/95 backdrop-blur-xl transition-all duration-300 lg:hidden",
          open ? "max-h-[420px]" : "max-h-0 border-t-0"
        )}
      >
        <div className="grid grid-cols-2 gap-1.5 px-4 py-3">
          {NAV.map(({ href, key, Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium",
                  active ? "bg-forest text-cream" : "bg-paper text-ink"
                )}
              >
                <Icon className="size-4 shrink-0" strokeWidth={2.4} />
                <span className="truncate">{t(key)}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
