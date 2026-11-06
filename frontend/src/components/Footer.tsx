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
    <footer className="bg-[#2D1E18] text-[#FDFBF7] mt-16 border-t-2 border-[#C5A059]/40">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-xs">
          {/* Col 1: Platform Identity */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#C5A059] flex items-center justify-center text-[#2D1E18] font-bold">
                <Landmark className="w-5 h-5 text-[#2D1E18]" />
              </div>
              <span className="font-extrabold text-base text-[#FDFBF7] tracking-tight">
                AgriIntel Karnataka
              </span>
            </div>
            <p className="text-[#E8DFD8] leading-relaxed">
              Preserving Karnataka's rich agricultural heritage and empowering farming communities with multi-source scientific data, predictive models, and fair market access.
            </p>
            <div className="text-[11px] text-[#C5A059]">
              Digitally Cataloging 140+ Years of Mandi History
            </div>
          </div>

          {/* Col 2: Historical Archives */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-sm text-[#C5A059] uppercase tracking-wider">
              Heritage Archives
            </h4>
            <ul className="space-y-1.5 text-[#E8DFD8]">
              <li>
                <button
                  onClick={() => onNavigateToTab("places")}
                  className="hover:text-[#C5A059] transition"
                >
                  Historical Places & Mandis
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToTab("personalities")}
                  className="hover:text-[#C5A059] transition"
                >
                  Agrarian Visionaries & Leaders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToTab("events")}
                  className="hover:text-[#C5A059] transition"
                >
                  Chronological Timeline & Milestones
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToTab("atlas")}
                  className="hover:text-[#C5A059] transition"
                >
                  Interactive Karnataka Market Atlas
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateToTab("gallery")}
                  className="hover:text-[#C5A059] transition"
                >
                  Historical Photographic Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Intelligence & Assistance */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-sm text-[#C5A059] uppercase tracking-wider">
              Market Platform & Help
            </h4>
            <ul className="space-y-1.5 text-[#E8DFD8]">
              <li>
                <button
                  onClick={() => onNavigateToTab("market")}
                  className="hover:text-[#C5A059] transition"
                >
                  Real-time APMC Mandi Prices
                </button>
              </li>
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
                  About the Project & Inquiries
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Verified Portals & Back to Top */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-[#C5A059] uppercase tracking-wider">
              Government Portals
            </h4>
            <p className="text-[11px] text-[#E8DFD8]">
              Integrated with AGMARKNET, data.gov.in, IMD Weather, FAOSTAT, and Soil Health Card Portal.
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
        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#E8DFD8]/80">
          <div>
            © {new Date().getFullYear()} AgriIntel Karnataka Local History & Market Platform. All rights reserved.
          </div>
          <div className="flex items-center space-x-3 text-[#C5A059]">
            <span>Non-Commercial Educational & Digital Heritage Preservation</span>
            <span>•</span>
            <span>WCAG 2.1 Accessible</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

