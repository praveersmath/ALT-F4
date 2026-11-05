"use client";

import { Sprout, Database, CloudSun, Newspaper } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export default function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-20 border-t border-ink/10 bg-forest text-cream/90">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-cream/12 text-harvest">
              <Sprout className="size-5" />
            </span>
            <div className="font-display text-lg font-semibold text-cream">ಕೃಷಿಮಿತ್ರ KrushiMitra</div>
          </div>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/70">{t("foot.disclaimer")}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-cream/70 md:items-end">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-harvest" />
            <span>Agmarknet-style mandi records · PostgreSQL</span>
          </div>
          <div className="flex items-center gap-2">
            <CloudSun className="size-4 text-harvest" />
            <span>Open-Meteo live weather API</span>
          </div>
          <div className="flex items-center gap-2">
            <Newspaper className="size-4 text-harvest" />
            <span>Google News RSS + sentiment engine</span>
          </div>
          <p className="mt-3 text-xs text-cream/50">{t("foot.sources")}</p>
        </div>
      </div>
    </footer>
  );
}
