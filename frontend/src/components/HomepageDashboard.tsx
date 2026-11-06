import React, { useState } from "react";
import {
  Search,
  Sparkles,
  TrendingUp,
  Database,
  Building,
  Globe,
  ArrowRight,
  Truck,
  ShoppingBag,
  AlertTriangle,
  Recycle,
  Layers,
  Landmark,
} from "lucide-react";

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
    if (searchQuery.toLowerCase().includes("map") || searchQuery.toLowerCase().includes("atlas")) {
      onNavigateToTab("atlas");
    } else {
      onNavigateToTab("market");
    }
  };

  const SPOTLIGHT_MANDIS = [
    {
      name: "Bengaluru (Binny Mill)",
      district: "Bengaluru Urban",
      crop: "Tomato",
      modalPrice: 2450,
      arrivals: "1,420 qtl",
      trend: "+3.2%",
    },
    {
      name: "Kolar Mandi",
      district: "Kolar",
      crop: "Tomato",
      modalPrice: 2520,
      arrivals: "2,850 qtl",
      trend: "+5.8%",
    },
    {
      name: "Hubballi APMC",
      district: "Dharwad",
      crop: "Onion",
      modalPrice: 2380,
      arrivals: "1,890 qtl",
      trend: "-1.5%",
    },
    {
      name: "Belagavi APMC",
      district: "Belagavi",
      crop: "Wheat",
      modalPrice: 2410,
      arrivals: "1,150 qtl",
      trend: "+0.8%",
    },
    {
      name: "Mysuru Bandipalya",
      district: "Mysuru",
      crop: "Tomato",
      modalPrice: 2480,
      arrivals: "1,280 qtl",
      trend: "+2.1%",
    },
  ];

  return (
    <div className="space-y-10">
      {/* 1. HERO BANNER WITH SEARCH */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#C5A059]/40 bg-gradient-to-r from-[#1F7A3D] via-[#165a2d] to-[#0f3d1f] text-[#FDFBF7]">
        <div className="relative p-6 sm:p-10 md:p-14 max-w-4xl space-y-4">
          <div className="inline-flex items-center space-x-2 bg-[#C5A059] text-[#2D1E18] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
            <Landmark className="w-4 h-4" />
            <span>Karnataka APMC Market Intelligence & Prediction</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
            {language === "kn"
              ? "ಕರ್ನಾಟಕ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ಮುನ್ಸೂಚನೆ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ"
              : "Karnataka APMC Supply Chain & Market Intelligence"}
          </h1>

          <p className="text-sm sm:text-base text-emerald-100 leading-relaxed max-w-3xl">
            Real-time APMC mandi modal price forecasting, AGMARKNET spatial market atlas, logistics freight optimizer, 7-pillar external scientific intelligence, and KrushiMitra waste-to-value circular economics across Karnataka.
          </p>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearchSubmit} className="pt-2 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-[#C5A059] absolute left-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === "kn"
                    ? "ಮಂಡಿ, ಬೆಳೆ ಅಥವಾ ಜಿಲ್ಲೆಯನ್ನು ಹುಡುಕಿ (ಉದಾ. Kolar, Tomato, Hubballi)..."
                    : "Search APMC mandi, crop, or district (e.g. Kolar, Tomato, Hubballi, Onion)..."
                }
                className="w-full bg-white/10 backdrop-blur-md border-2 border-emerald-300/40 rounded-xl pl-11 pr-28 py-3 text-sm text-white placeholder-emerald-100/70 focus:outline-none focus:border-[#C5A059] focus:bg-black/30 transition shadow-inner"
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

      {/* 2. REAL-TIME PLATFORM STATISTICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-1">
          <div className="text-xs text-[#5B6354] font-semibold flex items-center space-x-1.5">
            <Building className="w-4 h-4 text-[#1F7A3D]" />
            <span>APMC Yards Mapped</span>
          </div>
          <div className="text-3xl font-black text-[#1A1F16]">10</div>
          <div className="text-[11px] text-[#5B6354]">Regulated Trading Hubs</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-1">
          <div className="text-xs text-[#5B6354] font-semibold flex items-center space-x-1.5">
            <Database className="w-4 h-4 text-[#1F7A3D]" />
            <span>Historical Price Points</span>
          </div>
          <div className="text-3xl font-black text-[#1F7A3D]">10,965</div>
          <div className="text-[11px] text-emerald-700">Daily Observations in Database</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-1">
          <div className="text-xs text-[#5B6354] font-semibold flex items-center space-x-1.5">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>External Scientific Feeds</span>
          </div>
          <div className="text-3xl font-black text-blue-700">7 Pillars</div>
          <div className="text-[11px] text-blue-600">IMD, NASA, Sentinel, SoilGrids</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-1">
          <div className="text-xs text-[#5B6354] font-semibold flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Forecast Models</span>
          </div>
          <div className="text-3xl font-black text-purple-700">ML Ridge/EMA</div>
          <div className="text-[11px] text-purple-600">7 to 28-Day Predictions</div>
        </div>
      </div>

      {/* 3. CORE INTELLIGENCE MODULES (Quick Access) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#1A1F16] flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#1F7A3D]" />
            <span>Agricultural Intelligence Modules</span>
          </h2>
          <span className="text-xs text-[#5B6354]">Interactive Tools</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              tab: "atlas",
              title: "Market Atlas (Map)",
              desc: "AGMARKNET-style interactive map of Karnataka APMC markets with filter card & legend.",
              icon: Layers,
              badge: "Map Reference",
              color: "border-emerald-300 hover:border-emerald-500",
            },
            {
              tab: "market",
              title: "Mandi Prices & Alerts",
              desc: "Live daily modal price feeds, statutory min/max spreads, and statistical spike detection.",
              icon: TrendingUp,
              badge: "Real-time",
              color: "border-blue-300 hover:border-blue-500",
            },
            {
              tab: "forecast",
              title: "ML Forecast & Atlas",
              desc: "Predictive price horizons (7, 14, 21, 28 days) with statistical confidence bounds.",
              icon: Sparkles,
              badge: "Machine Learning",
              color: "border-purple-300 hover:border-purple-500",
            },
            {
              tab: "logistics",
              title: "Logistics & Net Profit",
              desc: "Transport cost calculator factoring distance, fuel, loading, mandi fees, and net profit.",
              icon: Truck,
              badge: "Haulage Engine",
              color: "border-amber-300 hover:border-amber-500",
            },
            {
              tab: "marketplace",
              title: "B2B Marketplace",
              desc: "Connect directly with verified wholesale buyers with MSP statutory price validation.",
              icon: ShoppingBag,
              badge: "Trading Desk",
              color: "border-teal-300 hover:border-teal-500",
            },
            {
              tab: "advisory",
              title: "MSP Advisory & Crops",
              desc: "Statutory MSP benchmark advisories, climate risk signals, and district recommendations.",
              icon: AlertTriangle,
              badge: "Agronomy Advisory",
              color: "border-red-300 hover:border-red-500",
            },
            {
              tab: "external",
              title: "7 Pillars Comparison",
              desc: "Multi-source real-time data analysis across IMD, NASA POWER, DES Agri, AGMARKNET, Earth Engine, ISRIC, CABI, FCI & NABARD.",
              icon: Globe,
              badge: "7 Pillars Analysis",
              color: "border-emerald-300 hover:border-emerald-500",
            },
            {
              tab: "krushimitra",
              title: "KrushiMitra Value-Add",
              desc: "Secondary processing calculator, 3-way stress scenarios, and bilingual farmer advisory.",
              icon: Recycle,
              badge: "Circular Economy",
              color: "border-green-300 hover:border-green-500",
            },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.tab}
                onClick={() => onNavigateToTab(card.tab)}
                className={`bg-white p-5 rounded-2xl border ${card.color} shadow-sm hover:shadow-md transition text-left flex flex-col justify-between group active:scale-95`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-[#F7F8F5] text-[#1F7A3D] group-hover:bg-[#1F7A3D] group-hover:text-white transition">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-[#5B6354] bg-[#F7F8F5] px-2 py-0.5 rounded-full border border-[#E2E5DC]">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-[#1A1F16] group-hover:text-[#1F7A3D] transition">
                    {card.title}
                  </h3>
                  <p className="text-xs text-[#5B6354] leading-relaxed">{card.desc}</p>
                </div>
                <div className="pt-4 flex items-center text-xs font-bold text-[#1F7A3D] group-hover:translate-x-1 transition-transform">
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. TODAY'S APMC MANDI SPOTLIGHT */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E5DC] pb-3">
          <div>
            <h2 className="text-lg font-bold text-[#1A1F16] flex items-center space-x-2">
              <Building className="w-5 h-5 text-[#1F7A3D]" />
              <span>Karnataka APMC Mandi Daily Spotlight</span>
            </h2>
            <p className="text-xs text-[#5B6354]">prevailing modal price quotes and recorded daily arrival volumes</p>
          </div>
          <button
            onClick={() => onNavigateToTab("atlas")}
            className="text-xs font-bold text-[#1F7A3D] hover:underline flex items-center self-start sm:self-auto"
          >
            <span>View Full Market Atlas</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {SPOTLIGHT_MANDIS.map((mandi, idx) => (
            <div
              key={idx}
              onClick={() => onNavigateToTab("atlas")}
              className="bg-[#F7F8F5] p-3.5 rounded-xl border border-[#E2E5DC] hover:border-[#1F7A3D] cursor-pointer transition space-y-1.5"
            >
              <div className="flex justify-between items-start">
                <span className="font-bold text-xs text-[#1A1F16] truncate">{mandi.name}</span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  {mandi.trend}
                </span>
              </div>
              <div className="text-[11px] text-[#5B6354]">{mandi.district}</div>
              <div className="text-xl font-black text-[#1F7A3D] pt-1">
                ₹{mandi.modalPrice}
                <span className="text-[10px] font-normal text-[#5B6354]">/qtl</span>
              </div>
              <div className="text-[10px] text-[#5B6354] flex items-center justify-between pt-1 border-t border-[#E2E5DC]/60">
                <span>Arrivals:</span>
                <strong className="text-[#1A1F16]">{mandi.arrivals}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
