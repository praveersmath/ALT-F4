import React, { useState } from "react";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { USER_MANUAL_FAQS } from "../data/historyData";

interface UserManualViewProps {
  language: "en" | "kn";
}

export const UserManualView: React.FC<UserManualViewProps> = ({ language }) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setExpandedFaq(expandedFaq === idx ? null : idx);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title Header */}
      <div className="bg-gradient-to-r from-[#1F7A3D] to-[#165a2d] text-white p-8 rounded-2xl shadow-md border border-emerald-400/40">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#C5A059] text-[#2D1E18] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Complete Platform Documentation & User Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === "kn"
              ? "ಬಳಕೆದಾರರ ಕೈಪಿಡಿ ಮತ್ತು ಸಹಾಯ ಕೇಂದ್ರ"
              : "User Manual & Complete Platform Operating Guide"}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100">
            A step-by-step guide designed to help farmers, commission agents, wholesalers, and researchers operate the AgriIntel Karnataka APMC platform, interactive Market Atlas, ML forecasting models, logistics calculators, and multi-source scientific feeds.
          </p>
        </div>
      </div>

      {/* QUICK SECTION INDEX TABLE */}
      <div className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-[#1A1F16] uppercase tracking-wider flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#1F7A3D]" />
          <span>Manual Table of Contents (13 Sections)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {[
            { num: "01", title: "Introduction & Purpose", anchor: "#sec-1" },
            { num: "02", title: "Homepage Guide", anchor: "#sec-2" },
            { num: "03", title: "Navigation Guide", anchor: "#sec-3" },
            { num: "04", title: "Search System Guide", anchor: "#sec-4" },
            { num: "05", title: "Market Atlas (Map) Guide", anchor: "#sec-5" },
            { num: "06", title: "Mandi Prices & Alerts Guide", anchor: "#sec-6" },
            { num: "07", title: "ML Price Forecast Guide", anchor: "#sec-7" },
            { num: "08", title: "Logistics Optimizer Guide", anchor: "#sec-8" },
            { num: "09", title: "7-Pillar External Data Guide", anchor: "#sec-9" },
            { num: "10", title: "Mobile Usage Guide", anchor: "#sec-10" },
            { num: "11", title: "Accessibility Features", anchor: "#sec-11" },
            { num: "12", title: "Troubleshooting Guide", anchor: "#sec-12" },
            { num: "13", title: "Frequently Asked Questions", anchor: "#sec-13" },
          ].map((item) => (
            <a
              key={item.num}
              href={item.anchor}
              className="p-2 rounded-lg bg-[#FDFBF7] hover:bg-[#EAECE6] text-[#2D1E18] border border-[#E2E5DC] font-medium transition flex items-center space-x-2"
            >
              <span className="font-bold text-[#1F7A3D]">{item.num}.</span>
              <span className="truncate">{item.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* SECTION 1: INTRODUCTION */}
      <div id="sec-1" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#1F7A3D] text-white flex items-center justify-center font-bold text-sm">
            1
          </span>
          <h3 className="font-bold text-lg text-[#1A1F16]">Introduction – Purpose of the Website</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          The <strong>AgriIntel Karnataka Platform</strong> is a next-generation agricultural supply chain and price intelligence portal for the state of Karnataka. It empowers agricultural stakeholders by providing transparent APMC mandi price discovery, machine-learning-driven price spike prediction, geospatial market mapping, haulage optimization, and multi-source scientific data (weather, satellite NDVI, soil health, and central buffer reserves).
        </p>
      </div>

      {/* SECTION 2: HOMEPAGE GUIDE */}
      <div id="sec-2" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#1F7A3D] text-white flex items-center justify-center font-bold text-sm">
            2
          </span>
          <h3 className="font-bold text-lg text-[#1A1F16]">Homepage Guide – How to Understand the Dashboard</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          The Homepage presents a real-time summary of Karnataka's agricultural markets:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-[#2D1E18] font-medium">
          <li><strong>Hero Welcome Section:</strong> Quick search bar to locate APMC mandis, commodities, or districts.</li>
          <li><strong>Platform Statistics:</strong> Live counters showing mapped APMC mandis (10), historical observations (10,965), and external data pillars (7).</li>
          <li><strong>Module Navigation Cards:</strong> Instant 1-click access to the Market Atlas, Mandi Prices, ML Forecast, Logistics Optimizer, and KrushiMitra.</li>
          <li><strong>APMC Daily Spotlight:</strong> Prevailing modal rates and arrivals in major yards (Bengaluru, Kolar, Hubballi, Belagavi, Mysuru).</li>
        </ol>
      </div>

      {/* SECTION 3: NAVIGATION GUIDE */}
      <div id="sec-3" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#1F7A3D] text-white flex items-center justify-center font-bold text-sm">
            3
          </span>
          <h3 className="font-bold text-lg text-[#1A1F16]">Navigation Guide – How to Access Different Sections</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          The main navigation bar provides direct routes to every module:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#2D1E18]">
          <div className="p-2.5 bg-[#FDFBF7] rounded-lg border border-[#E2E5DC]">
            <strong>Market Atlas:</strong> Interactive Karnataka map with zoom and side panel details.
          </div>
          <div className="p-2.5 bg-[#FDFBF7] rounded-lg border border-[#E2E5DC]">
            <strong>Mandi Prices:</strong> Live price trends, min/max spreads, and spike alerts.
          </div>
          <div className="p-2.5 bg-[#FDFBF7] rounded-lg border border-[#E2E5DC]">
            <strong>ML Forecast:</strong> 7 to 28-day predictive horizons with MAPE and confidence bounds.
          </div>
          <div className="p-2.5 bg-[#FDFBF7] rounded-lg border border-[#E2E5DC]">
            <strong>Logistics:</strong> Haulage cost calculator and highest net profit market ranking.
          </div>
          <div className="p-2.5 bg-[#FDFBF7] rounded-lg border border-[#E2E5DC]">
            <strong>7 Pillars:</strong> Scientific feeds comparing IMD, NASA, Earth Engine NDVI, and SoilGrids.
          </div>
          <div className="p-2.5 bg-[#FDFBF7] rounded-lg border border-[#E2E5DC]">
            <strong>KrushiMitra:</strong> Waste-to-value calculator and bilingual advisory chat.
          </div>
        </div>
      </div>

      {/* SECTION 4: SEARCH GUIDE */}
      <div id="sec-4" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#1F7A3D] text-white flex items-center justify-center font-bold text-sm">
            4
          </span>
          <h3 className="font-bold text-lg text-[#1A1F16]">Search System Guide – Locating Mandis & Commodities</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          Use the prominent search bar on the Homepage to search by:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs text-[#2D1E18]">
          <li><strong>Mandi Name:</strong> e.g. <em>"Kolar"</em>, <em>"Binny Mill"</em>, <em>"Hubballi"</em>, <em>"Belagavi"</em></li>
          <li><strong>Commodity:</strong> e.g. <em>"Tomato"</em>, <em>"Onion"</em>, <em>"Wheat"</em></li>
          <li><strong>District:</strong> e.g. <em>"Bengaluru Urban"</em>, <em>"Dharwad"</em>, <em>"Mysuru"</em></li>
        </ul>
      </div>

      {/* SECTION 5: MARKET ATLAS GUIDE */}
      <div id="sec-5" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#1F7A3D] text-white flex items-center justify-center font-bold text-sm">
            5
          </span>
          <h3 className="font-bold text-lg text-[#1A1F16]">Karnataka Market Atlas Guide – Interactive Map & Filters</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          Modeled after the AGMARKNET Market Atlas layout:
        </p>
        <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#2D1E18]">
          <li><strong>Filter Card:</strong> Select your Commodity, District, APMC Yard, and Date. Click <strong>"Go"</strong> to filter or <strong>"Reset"</strong> to restore defaults.</li>
          <li><strong>Interactive SVG Map:</strong> Use <strong>+</strong> and <strong>-</strong> to zoom in and out. Click <strong>"Reset View"</strong> to restore 1x scale.</li>
          <li><strong>Colour Legend:</strong> Toggle between <em>Arrivals Volume</em> and <em>Price Spread</em>.</li>
          <li><strong>Side Panel:</strong> Click any market pin on the map to display its current modal price, arrivals, distance, and quick action buttons.</li>
        </ol>
      </div>

      {/* SECTION 6: MANDI PRICES & ALERTS GUIDE */}
      <div id="sec-6" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#1F7A3D] text-white flex items-center justify-center font-bold text-sm">
            6
          </span>
          <h3 className="font-bold text-lg text-[#1A1F16]">Mandi Prices & Price Hike Alerts Guide</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          Track daily modal prices, minimum and maximum ranges, and automated spike alerts. The system monitors statistical volatility (+15% threshold) to warn farmers before impending price drops or surges.
        </p>
      </div>

      {/* SECTION 7: ML PRICE FORECAST GUIDE */}
      <div id="sec-7" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#1F7A3D] text-white flex items-center justify-center font-bold text-sm">
            7
          </span>
          <h3 className="font-bold text-lg text-[#1A1F16]">Machine Learning Price Forecast Guide</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          Our machine learning models (Ridge regression with EMA baseline) project expected prices 7, 14, 21, and 28 days into the future. Each projection displays lower and upper statistical confidence bounds and validation metrics (MAPE and RMSE).
        </p>
      </div>

      {/* SECTION 8: LOGISTICS OPTIMIZER GUIDE */}
      <div id="sec-8" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#1F7A3D] text-white flex items-center justify-center font-bold text-sm">
            8
          </span>
          <h3 className="font-bold text-lg text-[#1A1F16]">Logistics & Net Profit Optimizer Guide</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          Input your harvest quantity in quintals and origin coordinates. The haulage engine evaluates distance, diesel costs, toll gates, loading/unloading labor, mandi user fees (1.5%), and transit spoilage (0.5% per 100km) to rank Karnataka APMC markets by highest net profit per quintal.
        </p>
      </div>

      {/* SECTION 9: 7-PILLAR EXTERNAL DATA GUIDE */}
      <div id="sec-9" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#1F7A3D] text-white flex items-center justify-center font-bold text-sm">
            9
          </span>
          <h3 className="font-bold text-lg text-[#1A1F16]">Multi-Source External Data (7 Pillars) Guide</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          Aggregates seven official public data streams:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs text-[#2D1E18]">
          <li><strong>Pillar 1 (Weather):</strong> IMD normals vs. NASA POWER agroclimatology & OpenWeatherMap.</li>
          <li><strong>Pillar 2 (Production):</strong> DES Agri & data.gov.in Area-Production-Yield (APY) vs. FAOSTAT.</li>
          <li><strong>Pillar 3 (Mandi Prices):</strong> AGMARKNET live feed price divergence and arbitrage spreads.</li>
          <li><strong>Pillar 4 (Satellite):</strong> Google Earth Engine / Sentinel-2 NDVI canopy vigor index.</li>
          <li><strong>Pillar 5 (Soil Health):</strong> ISRIC SoilGrids 250m REST API and Soil Health Card ratings.</li>
          <li><strong>Pillar 6 (Pest Surveillance):</strong> CABI Plantwise biological threat monitoring and IPM measures.</li>
          <li><strong>Pillar 7 (Storage & Supply):</strong> Food Corporation of India buffer stocks and NABARD cold chains.</li>
        </ul>
      </div>

      {/* SECTION 10: MOBILE USAGE GUIDE */}
      <div id="sec-10" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#1F7A3D] text-white flex items-center justify-center font-bold text-sm">
            10
          </span>
          <h3 className="font-bold text-lg text-[#1A1F16]">Mobile Usage Guide – Smartphones & Tablets</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          On mobile phones, tap the <strong>Hamburger Menu (☰)</strong> at the top right to access all modules. All data cards, interactive SVG maps, and tables adapt cleanly to portrait and landscape orientations without horizontal page clipping.
        </p>
      </div>

      {/* SECTION 11: ACCESSIBILITY GUIDE */}
      <div id="sec-11" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#1F7A3D] text-white flex items-center justify-center font-bold text-sm">
            11
          </span>
          <h3 className="font-bold text-lg text-[#1A1F16]">Accessibility Features – Readability & High-Contrast Mode</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          The Top Utility Bar includes:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC]">
            <strong>Text Resizing (A- / A / A+):</strong> Increases or decreases font size across the entire platform.
          </div>
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC]">
            <strong>High-Contrast Toggle:</strong> Switches to accessible dark theme with vivid yellow accents.
          </div>
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC]">
            <strong>Bilingual Language:</strong> Switch between English and Kannada (ಕನ್ನಡ) seamlessly.
          </div>
        </div>
      </div>

      {/* SECTION 12: TROUBLESHOOTING */}
      <div id="sec-12" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#1F7A3D] text-white flex items-center justify-center font-bold text-sm">
            12
          </span>
          <h3 className="font-bold text-lg text-[#1A1F16]">Troubleshooting Guide – Common Solutions</h3>
        </div>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC]">
            <span className="font-bold text-[#1A1F16] block">Q: Market Atlas side panel shows default instructions</span>
            <p className="text-[#5B6354] mt-0.5">Click any round pin on the interactive Karnataka map to load that specific market's pricing and arrivals.</p>
          </div>
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC]">
            <span className="font-bold text-[#1A1F16] block">Q: Status badge indicates "Offline Mode"</span>
            <p className="text-[#5B6354] mt-0.5">Click the "Refresh" button next to the badge. The application uses cached baseline data automatically when working offline.</p>
          </div>
        </div>
      </div>

      {/* SECTION 13: FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <div id="sec-13" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-4">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#1F7A3D] text-white flex items-center justify-center font-bold text-sm">
            13
          </span>
          <h3 className="font-bold text-lg text-[#1A1F16]">Frequently Asked Questions (Interactive FAQ)</h3>
        </div>

        <div className="space-y-2">
          {USER_MANUAL_FAQS.map((faq, idx) => {
            const isOpen = expandedFaq === idx;
            return (
              <div
                key={idx}
                className="border border-[#E2E5DC] rounded-xl overflow-hidden transition"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-4 bg-[#FDFBF7] hover:bg-[#EAECE6] flex items-center justify-between transition focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-xs sm:text-sm text-[#1A1F16] pr-4">
                    {language === "kn" && faq.kannadaQuestion ? faq.kannadaQuestion : faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#1F7A3D] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#5B6354] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="p-4 bg-white text-xs sm:text-sm text-[#5B6354] leading-relaxed border-t border-[#E2E5DC]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
