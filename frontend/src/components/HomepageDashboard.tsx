import React, { useState } from "react";
import {
  Search,
  Sparkles,
  MapPin,
  Award,
  ArrowRight,
  Database,
  Building,
  Globe,
  Clock,
  Landmark,
} from "lucide-react";
import { InteractiveSlider } from "./InteractiveSlider";
import {
  HERITAGE_PLACES,
  HERITAGE_PERSONALITIES,
  HERITAGE_EVENTS,
} from "../data/historyData";

interface HomepageDashboardProps {
  onNavigateToTab: (tab: any) => void;
  language: "en" | "kn";
}

export const HomepageDashboard: React.FC<HomepageDashboardProps> = ({
  onNavigateToTab,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateToTab("history");
  };

  return (
    <div className="space-y-10">
      {/* 1. HERO WELCOME SECTION WITH CULTURAL STYLING */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#C5A059]/40 bg-[#2D1E18] text-[#FDFBF7]">
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:16px_16px] opacity-10" />

        <div className="relative p-6 sm:p-10 md:p-14 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#C5A059]/90 text-[#2D1E18] px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm">
            <Landmark className="w-4 h-4" />
            <span>Digital Heritage & Agrarian Archive of Karnataka</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-[#FDFBF7]">
            {language === "kn"
              ? "ಕರ್ನಾಟಕ ಕೃಷಿ ಪರಂಪರೆ ಮತ್ತು ಐತಿಹಾಸಿಕ ಮಾರುಕಟ್ಟೆ ವೇದಿಕೆ"
              : "Preserving Karnataka's Agricultural Heritage & Trading Mandis"}
          </h1>

          <p className="text-sm sm:text-base text-[#E8DFD8] leading-relaxed max-w-3xl">
            A specialized digital heritage project dedicated to chronicling over 140 years of agricultural evolution in Karnataka—from the historic Mysore State regulated grain depots and Sir M. Visvesvaraya's canal engineering to Asia's largest horticultural terminals and today's satellite-guided intelligence.
          </p>

          {/* PROMINENT SEARCH BAR */}
          <form onSubmit={handleSearchSubmit} className="pt-2 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-[#C5A059] absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === "kn"
                    ? "ಐತಿಹಾಸಿಕ ಸ್ಥಳಗಳು, ನಾಯಕರು ಅಥವಾ ಮಂಡಿ ದಾಖಲೆಗಳನ್ನು ಹುಡುಕಿ..."
                    : "Search historical places, personalities, mandis, or events (e.g. Visvesvaraya, Kolar)..."
                }
                className="w-full bg-white/10 backdrop-blur-md border-2 border-[#C5A059]/60 rounded-xl pl-11 pr-28 py-3 text-sm text-[#FDFBF7] placeholder-white/60 focus:outline-none focus:border-[#C5A059] focus:bg-black/30 transition shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-2 bg-[#C5A059] hover:bg-[#d4af37] text-[#2D1E18] text-xs font-bold rounded-lg transition active:scale-95 shadow-md"
              >
                {language === "kn" ? "ಹುಡುಕಿ" : "Search"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* 2. INTERACTIVE IMAGE SLIDER / CAROUSEL */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[#C5A059] uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>Featured Historical Epochs & Gallery Showcase</span>
          </h2>
          <span className="text-xs text-[#5B6354]">Interactive Archival Carousel</span>
        </div>
        <InteractiveSlider language={language} onExploreClick={() => onNavigateToTab("history")} />
      </div>

      {/* 3. STATISTICS DASHBOARD (Using actual data) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-1">
          <div className="text-xs text-[#5B6354] font-semibold flex items-center space-x-1.5">
            <Building className="w-4 h-4 text-[#C5A059]" />
            <span>APMC Terminals</span>
          </div>
          <div className="text-3xl font-black text-[#2D1E18]">10</div>
          <div className="text-[11px] text-[#5B6354]">Key Historical Mandis Mapped</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-1">
          <div className="text-xs text-[#5B6354] font-semibold flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-[#1F7A3D]" />
            <span>Historical Records</span>
          </div>
          <div className="text-3xl font-black text-[#1F7A3D]">10,965</div>
          <div className="text-[11px] text-emerald-700">Verified Price & Arrival Observations</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-1">
          <div className="text-xs text-[#5B6354] font-semibold flex items-center space-x-1.5">
            <Award className="w-4 h-4 text-[#C5A059]" />
            <span>Visionary Leaders</span>
          </div>
          <div className="text-3xl font-black text-[#2D1E18]">5</div>
          <div className="text-[11px] text-[#5B6354]">Biographical Agrarian Profiles</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-1">
          <div className="text-xs text-[#5B6354] font-semibold flex items-center space-x-1.5">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Official Portals</span>
          </div>
          <div className="text-3xl font-black text-blue-700">13</div>
          <div className="text-[11px] text-blue-600">Verified Govt & Global Feeds</div>
        </div>
      </div>

      {/* 4. QUICK-ACCESS NAVIGATION CARDS */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-[#2D1E18] flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-[#C5A059]" />
          <span>Quick Exploration Channels</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              tab: "places",
              title: "Historical Mandis",
              desc: "Explore 5 landmark regulated market yards from 1884 to today.",
              color: "from-[#2D1E18] to-[#3E2723]",
            },
            {
              tab: "personalities",
              title: "Visionary Leaders",
              desc: "Sir M. Visvesvaraya, Nalvadi Wadiyar, and Dr. M.S. Swaminathan.",
              color: "from-[#1F7A3D] to-[#165a2d]",
            },
            {
              tab: "atlas",
              title: "Market Atlas Map",
              desc: "AGMARKNET-style interactive Karnataka map with zoom and filters.",
              color: "from-[#1A2F3B] to-[#0F2027]",
            },
            {
              tab: "gallery",
              title: "Photo Gallery",
              desc: "High-resolution archival photographs of farms, bullock carts and mandis.",
              color: "from-[#7C3AED] to-[#5B21B6]",
            },
          ].map((card) => (
            <button
              key={card.tab}
              onClick={() => onNavigateToTab(card.tab)}
              className={`bg-gradient-to-r ${card.color} text-white p-5 rounded-2xl shadow-sm hover:shadow-md transition text-left flex flex-col justify-between group active:scale-95`}
            >
              <div className="space-y-1.5">
                <h3 className="font-bold text-base group-hover:text-[#C5A059] transition">
                  {card.title}
                </h3>
                <p className="text-xs text-white/80 leading-relaxed">{card.desc}</p>
              </div>
              <div className="pt-4 flex items-center text-xs font-semibold text-[#C5A059] group-hover:translate-x-1 transition-transform">
                <span>Access Archive</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. FEATURED HISTORICAL PLACES (Popular Heritage Locations) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-2">
          <h2 className="text-lg font-bold text-[#2D1E18] flex items-center space-x-2">
            <Building className="w-5 h-5 text-[#C5A059]" />
            <span>Featured Centennial Trading Mandis</span>
          </h2>
          <button
            onClick={() => onNavigateToTab("places")}
            className="text-xs font-bold text-[#C5A059] hover:underline flex items-center"
          >
            <span>View All Places</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HERITAGE_PLACES.slice(0, 3).map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-2xl border border-[#C5A059]/30 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 w-full overflow-hidden">
                  <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-[#2D1E18]/85 text-[#C5A059] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                    {place.establishedPeriod}
                  </span>
                </div>
                <div className="p-4 space-y-1.5">
                  <h3 className="font-bold text-base text-[#2D1E18]">{place.name}</h3>
                  <p className="text-xs text-[#C5A059] font-medium">{place.kannadaName}</p>
                  <p className="text-xs text-[#5B6354] line-clamp-2 leading-relaxed">
                    {place.historicalImportance}
                  </p>
                </div>
              </div>
              <div className="p-4 pt-0">
                <button
                  onClick={() => onNavigateToTab("places")}
                  className="w-full py-1.5 bg-[#FDFBF7] hover:bg-[#EAECE6] text-[#2D1E18] border border-[#E2E5DC] rounded-lg text-xs font-bold transition"
                >
                  Explore History
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. HISTORICAL PERSONALITIES & IMPORTANT EVENTS PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personality Highlight */}
        <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-2">
            <h3 className="font-bold text-base text-[#2D1E18] flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#C5A059]" />
              <span>Visionary Agrarian Reformer</span>
            </h3>
            <button
              onClick={() => onNavigateToTab("personalities")}
              className="text-xs text-[#C5A059] font-bold hover:underline"
            >
              All Visionaries
            </button>
          </div>

          <div className="flex gap-4 items-start">
            <img
              src={HERITAGE_PERSONALITIES[0].photographUrl}
              alt={HERITAGE_PERSONALITIES[0].name}
              className="w-20 h-20 rounded-xl object-cover border border-[#C5A059]/50 shadow-sm shrink-0"
            />
            <div className="space-y-1">
              <span className="text-[10px] bg-[#FDFBF7] text-[#C5A059] font-bold px-2 py-0.5 rounded border border-[#E2E5DC]">
                {HERITAGE_PERSONALITIES[0].period}
              </span>
              <h4 className="font-bold text-base text-[#2D1E18]">{HERITAGE_PERSONALITIES[0].name}</h4>
              <p className="text-xs text-[#5B6354] line-clamp-3">
                {HERITAGE_PERSONALITIES[0].biography}
              </p>
            </div>
          </div>
        </div>

        {/* Recently Added Historical Records & Milestones */}
        <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-2">
            <h3 className="font-bold text-base text-[#2D1E18] flex items-center space-x-2">
              <Clock className="w-5 h-5 text-[#1F7A3D]" />
              <span>Recently Added Historical Records</span>
            </h3>
            <span className="text-xs text-[#5B6354]">Archival Feed</span>
          </div>

          <div className="space-y-3 text-xs">
            {HERITAGE_EVENTS.slice(0, 3).map((evt) => (
              <div key={evt.id} className="flex items-start space-x-3 pb-2 border-b border-[#E2E5DC]/60 last:border-0">
                <span className="font-bold text-[#1F7A3D] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                  {evt.year}
                </span>
                <div>
                  <h4 className="font-bold text-[#2D1E18]">{evt.title}</h4>
                  <p className="text-[11px] text-[#5B6354] line-clamp-1">{evt.importance}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

