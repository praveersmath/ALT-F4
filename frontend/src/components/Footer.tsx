import React from "react";
import { ArrowUp, Landmark } from "lucide-react";

interface FooterProps {
  onNavigateToTab: (tab: any) => void;
  language?: "en" | "kn";
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToTab }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#1A231C] text-[#FDFBF7] mt-16 border-t-2 border-[#1F7A3D]/40">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          {/* Col 1: Platform Identity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#1F7A3D] flex items-center justify-center text-white font-bold">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                AgriIntel Karnataka
              </span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Karnataka APMC agricultural intelligence platform providing real-time mandi price forecasts, AGMARKNET spatial market atlas, logistics freight optimization, and 7-pillar external data analytics.
            </p>
            <div className="text-[11px] text-[#C5A059] font-semibold">
              Regulated Markets & Predictive Agricultural Economics
            </div>
          </div>

          {/* Col 2: Core Platform Modules */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-sm text-[#C5A059] uppercase tracking-wider">
              Market Intelligence
            </h4>
            <ul className="space-y-1.5 text-gray-300">
              <li>
                <button
                  onClick={() => onNavigateToTab("atlas")}
                  className="hover:text-[#C5A059] transition"
                >
                  Karnataka APMC Market Atlas (Map)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToTab("market")}
                  className="hover:text-[#C5A059] transition"
                >
                  Mandi Prices & Hike Alerts
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToTab("forecast")}
                  className="hover:text-[#C5A059] transition"
                >
                  ML Predictive Price Forecasting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToTab("logistics")}
                  className="hover:text-[#C5A059] transition"
                >
                  Logistics & Transport Cost Optimizer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToTab("marketplace")}
                  className="hover:text-[#C5A059] transition"
                >
                  B2B Farmer-to-Buyer Marketplace
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Advanced Analytics & Help */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-sm text-[#C5A059] uppercase tracking-wider">
              Scientific Feeds & Guides
            </h4>
            <ul className="space-y-1.5 text-gray-300">
              <li>
                <button
                  onClick={() => onNavigateToTab("external")}
                  className="hover:text-[#C5A059] transition"
                >
                  Multi-Source External Data (7 Pillars)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToTab("krushimitra")}
                  className="hover:text-[#C5A059] transition"
                >
                  KrushiMitra Value-Add & Scenarios
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToTab("advisory")}
                  className="hover:text-[#C5A059] transition"
                >
                  Crop Recommendation & MSP Advisory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToTab("manual")}
                  className="hover:text-[#C5A059] transition font-bold text-[#C5A059]"
                >
                  User Manual & Help Centre (13 Sections)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToTab("about")}
                  className="hover:text-[#C5A059] transition"
                >
                  About Platform & Contact Form
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Portals & Back to Top */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#C5A059] uppercase tracking-wider">
              Verified Portals
            </h4>
            <p className="text-[11px] text-gray-300">
              Connected with AGMARKNET, data.gov.in, IMD Weather, NASA POWER, Earth Engine, and Soil Health Card Portal.
            </p>
            <div className="pt-2">
              <button
                onClick={scrollToTop}
                className="w-full py-2.5 bg-[#C5A059] hover:bg-[#d4af37] text-[#2D1E18] font-bold rounded-xl transition flex items-center justify-center space-x-2 shadow-sm active:scale-95"
                title="Scroll back to the top of the page"
              >
                <ArrowUp className="w-4 h-4" />
                <span>Back to Top / ಮೇಲಕ್ಕೆ ಹೋಗಿ</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Accessibility statement */}
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400">
          <div>
            © {new Date().getFullYear()} AgriIntel Karnataka Market Platform. All rights reserved.
          </div>
          <div className="flex items-center space-x-3 text-[#C5A059]">
            <span>Agricultural Intelligence & Supply Chain Prediction</span>
            <span>•</span>
            <span>WCAG 2.1 Accessible</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
