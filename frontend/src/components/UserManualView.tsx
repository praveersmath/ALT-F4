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
      <div className="bg-gradient-to-r from-[#2D1E18] to-[#1F7A3D] text-[#FDFBF7] p-8 rounded-2xl shadow-md border border-[#C5A059]/40">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#C5A059]/90 text-[#2D1E18] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Complete Platform Documentation & User Guide</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === "kn"
              ? "ಬಳಕೆದಾರರ ಕೈಪಿಡಿ ಮತ್ತು ಸಹಾಯ ಕೇಂದ್ರ"
              : "User Manual & Complete Platform Operating Guide"}
          </h2>
          <p className="text-xs sm:text-sm text-[#E8DFD8]">
            A step-by-step beginner-friendly guide designed to help citizens, farmers, traders, and researchers navigate all historical archives, maps, galleries, and live market intelligence tools.
          </p>
        </div>
      </div>

      {/* QUICK SECTION INDEX TABLE */}
      <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-[#2D1E18] uppercase tracking-wider flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#C5A059]" />
          <span>Manual Table of Contents (13 Sections)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
          {[
            { num: "01", title: "Introduction & Purpose", anchor: "#sec-1" },
            { num: "02", title: "Homepage Guide", anchor: "#sec-2" },
            { num: "03", title: "Navigation Guide", anchor: "#sec-3" },
            { num: "04", title: "Search System Guide", anchor: "#sec-4" },
            { num: "05", title: "Historical Places Guide", anchor: "#sec-5" },
            { num: "06", title: "Personalities Guide", anchor: "#sec-6" },
            { num: "07", title: "Historical Events Guide", anchor: "#sec-7" },
            { num: "08", title: "Interactive Timeline Guide", anchor: "#sec-8" },
            { num: "09", title: "Photo Gallery Guide", anchor: "#sec-9" },
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
              <span className="font-bold text-[#C5A059]">{item.num}.</span>
              <span className="truncate">{item.title}</span>
            </a>
          ))}
        </div>
      </div>

      {/* SECTION 1: INTRODUCTION */}
      <div id="sec-1" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#2D1E18] text-[#C5A059] flex items-center justify-center font-bold text-sm">
            1
          </span>
          <h3 className="font-bold text-lg text-[#2D1E18]">Introduction – Purpose of the Website</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          Welcome to the <strong>AgriIntel Karnataka Platform</strong>. This digital portal serves as a unified digital heritage and agricultural intelligence ecosystem for the state of Karnataka. It allows any visitor—regardless of technical background—to explore over 140 years of agricultural heritage, study historical mandis, learn about transformative leaders, and access live real-time APMC price analytics.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC] space-y-1">
            <strong className="text-[#2D1E18] block">Heritage Mission:</strong>
            <p className="text-[#5B6354]">Digital preservation of royal Mysore decrees, regulated market acts, irrigation canals, and farming personalities.</p>
          </div>
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC] space-y-1">
            <strong className="text-[#2D1E18] block">Farmer Intelligence:</strong>
            <p className="text-[#5B6354]">Empowering farmers with multi-source scientific data (IMD, NASA, AGMARKNET, Earth Engine NDVI, SoilGrids).</p>
          </div>
        </div>
      </div>

      {/* SECTION 2: HOMEPAGE GUIDE */}
      <div id="sec-2" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#2D1E18] text-[#C5A059] flex items-center justify-center font-bold text-sm">
            2
          </span>
          <h3 className="font-bold text-lg text-[#2D1E18]">Homepage Guide – How to Understand the Dashboard</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          The Homepage is structured into intuitive informational blocks:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-[#2D1E18] font-medium">
          <li><strong>Hero Welcome Section:</strong> Features the platform title, mission summary, and quick search bar.</li>
          <li><strong>Interactive Image Slider:</strong> Displays curated archival images with auto-transition and manual control.</li>
          <li><strong>Statistics Counter:</strong> Displays live counts of mapped APMC mandis, historical price records, visionaries, and connected portals.</li>
          <li><strong>Featured Places & Personalities:</strong> Quick preview cards highlighting centennial mandis and leaders.</li>
          <li><strong>Recently Added Records:</strong> Shows the newest verified additions to the archive.</li>
        </ol>
      </div>

      {/* SECTION 3: NAVIGATION GUIDE */}
      <div id="sec-3" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#2D1E18] text-[#C5A059] flex items-center justify-center font-bold text-sm">
            3
          </span>
          <h3 className="font-bold text-lg text-[#2D1E18]">Navigation Guide – How to Access Different Sections</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          Use the main navigation bar at the top of the screen:
        </p>
        <div className="space-y-2 text-xs text-[#2D1E18]">
          <div className="p-2.5 bg-[#FDFBF7] rounded-lg border border-[#E2E5DC] flex items-center space-x-3">
            <span className="font-bold text-[#C5A059] w-28">Home:</span>
            <span>Returns to the primary dashboard and image carousel.</span>
          </div>
          <div className="p-2.5 bg-[#FDFBF7] rounded-lg border border-[#E2E5DC] flex items-center space-x-3">
            <span className="font-bold text-[#C5A059] w-28">History:</span>
            <span>Opens the digital archives containing Places, Personalities, Events, and Timeline.</span>
          </div>
          <div className="p-2.5 bg-[#FDFBF7] rounded-lg border border-[#E2E5DC] flex items-center space-x-3">
            <span className="font-bold text-[#C5A059] w-28">Market Atlas:</span>
            <span>Opens the AGMARKNET-style interactive Karnataka map and filter card.</span>
          </div>
          <div className="p-2.5 bg-[#FDFBF7] rounded-lg border border-[#E2E5DC] flex items-center space-x-3">
            <span className="font-bold text-[#C5A059] w-28">Gallery:</span>
            <span>Accesses the categorized photographic repository and full-screen viewer.</span>
          </div>
          <div className="p-2.5 bg-[#FDFBF7] rounded-lg border border-[#E2E5DC] flex items-center space-x-3">
            <span className="font-bold text-[#C5A059] w-28">User Manual:</span>
            <span>Opens this comprehensive operating guide and FAQ system.</span>
          </div>
        </div>
      </div>

      {/* SECTION 4: SEARCH GUIDE */}
      <div id="sec-4" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#2D1E18] text-[#C5A059] flex items-center justify-center font-bold text-sm">
            4
          </span>
          <h3 className="font-bold text-lg text-[#2D1E18]">Search Guide – How to Search for Historical Information</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          The search engine filters across historical locations, personalities, events, and trade commodities in real time:
        </p>
        <ol className="list-decimal list-inside space-y-1.5 text-xs text-[#2D1E18]">
          <li>Locate the search input box on the Homepage or History section.</li>
          <li>Type your desired term (e.g. <em>"Visvesvaraya"</em>, <em>"Binny Mill"</em>, <em>"Tomato"</em>, or <em>"Cotton"</em>).</li>
          <li>The display updates immediately, showing matching entries with counts.</li>
          <li>Click the <strong>Clear Search (✕)</strong> button to reset the view.</li>
        </ol>
      </div>

      {/* SECTION 5: HISTORICAL PLACES GUIDE */}
      <div id="sec-5" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#2D1E18] text-[#C5A059] flex items-center justify-center font-bold text-sm">
            5
          </span>
          <h3 className="font-bold text-lg text-[#2D1E18]">Historical Places Guide – How to Explore Heritage Mandis</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          Each historical place card features the establishment period, geographic coordinates, commodities handled, and historical importance. Click <strong>"Read Archival Chronicle"</strong> on any card to view detailed historical accounts in a full modal dialog.
        </p>
      </div>

      {/* SECTION 6: PERSONALITIES GUIDE */}
      <div id="sec-6" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#2D1E18] text-[#C5A059] flex items-center justify-center font-bold text-sm">
            6
          </span>
          <h3 className="font-bold text-lg text-[#2D1E18]">Personalities Guide – How to Read Biographies</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          The Personalities section presents biographies of visionaries who modernized Karnataka's agriculture. Review their life periods, specific irrigation dams or research breakthroughs, and famous quotes.
        </p>
      </div>

      {/* SECTION 7: EVENTS GUIDE */}
      <div id="sec-7" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#2D1E18] text-[#C5A059] flex items-center justify-center font-bold text-sm">
            7
          </span>
          <h3 className="font-bold text-lg text-[#2D1E18]">Events Guide – How to Explore Historical Events</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          Historical events are categorized into <em>Legislation</em>, <em>Infrastructure</em>, <em>Scientific</em>, and <em>Digital</em> milestones. Each event highlights the specific year, description, and long-term agrarian outcome.
        </p>
      </div>

      {/* SECTION 8: TIMELINE GUIDE */}
      <div id="sec-8" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#2D1E18] text-[#C5A059] flex items-center justify-center font-bold text-sm">
            8
          </span>
          <h3 className="font-bold text-lg text-[#2D1E18]">Timeline Guide – How to Navigate Historical Periods</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          The interactive timeline displays events along a continuous vertical golden axis. As you scroll through the timeline, you transition from the 1884 Mysore Agricultural Society through the 1911 KRS Dam construction, 1966 APMC Act, and modern 2026 digital systems.
        </p>
      </div>

      {/* SECTION 9: GALLERY GUIDE */}
      <div id="sec-9" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#2D1E18] text-[#C5A059] flex items-center justify-center font-bold text-sm">
            9
          </span>
          <h3 className="font-bold text-lg text-[#2D1E18]">Gallery Guide – How to View and Explore Photographs</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          Click any photo in the Gallery to open the full-screen modal viewer. Use the <strong>Next (→)</strong> and <strong>Previous (←)</strong> arrows to browse photos without leaving the modal. Click <strong>✕</strong> or tap anywhere outside the photo to close it.
        </p>
      </div>

      {/* SECTION 10: MOBILE USAGE GUIDE */}
      <div id="sec-10" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#2D1E18] text-[#C5A059] flex items-center justify-center font-bold text-sm">
            10
          </span>
          <h3 className="font-bold text-lg text-[#2D1E18]">Mobile Usage Guide – How to Use on Smartphones</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          The website is optimized for touch devices:
        </p>
        <ul className="list-disc list-inside space-y-1 text-xs text-[#2D1E18]">
          <li>Tap the <strong>Hamburger Menu (☰)</strong> at the top right to open the drawer navigation.</li>
          <li>Swipe or use the arrow buttons on the image carousel.</li>
          <li>All maps and data tables adapt automatically with zero horizontal page clipping.</li>
        </ul>
      </div>

      {/* SECTION 11: ACCESSIBILITY GUIDE */}
      <div id="sec-11" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#2D1E18] text-[#C5A059] flex items-center justify-center font-bold text-sm">
            11
          </span>
          <h3 className="font-bold text-lg text-[#2D1E18]">Accessibility Guide – Readability & Keyboard Navigation</h3>
        </div>
        <p className="text-xs sm:text-sm text-[#5B6354] leading-relaxed">
          We comply with WCAG 2.1 accessibility standards:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC]">
            <strong>Text Resizing (A- / A / A+):</strong> Adjusts the global font size instantly from the Top Utility Bar.
          </div>
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC]">
            <strong>High Contrast Mode:</strong> Activates sharp yellow and white high-contrast elements on pure dark backgrounds.
          </div>
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC]">
            <strong>Keyboard Focus:</strong> Every interactive link and button displays a gold focus outline when pressing Tab.
          </div>
        </div>
      </div>

      {/* SECTION 12: TROUBLESHOOTING */}
      <div id="sec-12" className="bg-white p-6 rounded-2xl border border-[#E2E5DC] shadow-sm space-y-3">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#2D1E18] text-[#C5A059] flex items-center justify-center font-bold text-sm">
            12
          </span>
          <h3 className="font-bold text-lg text-[#2D1E18]">Troubleshooting – Common Issues & Resolutions</h3>
        </div>
        <div className="space-y-2 text-xs">
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC]">
            <span className="font-bold text-[#2D1E18] block">Issue: Real-time price charts show "Loading" or "Offline"</span>
            <p className="text-[#5B6354] mt-0.5">Ensure the backend uvicorn service is running on port 8000. All historical archives remain accessible regardless of backend connection.</p>
          </div>
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC]">
            <span className="font-bold text-[#2D1E18] block">Issue: Font size appears too large or small</span>
            <p className="text-[#5B6354] mt-0.5">Click the "A" button in the Top Utility Bar to return to normal default scaling.</p>
          </div>
          <div className="p-3 bg-[#FDFBF7] rounded-xl border border-[#E2E5DC]">
            <span className="font-bold text-[#2D1E18] block">Issue: Filter results in Market Atlas are empty</span>
            <p className="text-[#5B6354] mt-0.5">Click "Reset" in the filter card to clear custom criteria and display all Karnataka markets.</p>
          </div>
        </div>
      </div>

      {/* SECTION 13: FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
      <div id="sec-13" className="bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-4">
        <div className="flex items-center space-x-3 border-b border-[#E2E5DC] pb-3">
          <span className="w-8 h-8 rounded-full bg-[#2D1E18] text-[#C5A059] flex items-center justify-center font-bold text-sm">
            13
          </span>
          <h3 className="font-bold text-lg text-[#2D1E18]">Frequently Asked Questions (Interactive FAQ)</h3>
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
                  <span className="font-bold text-xs sm:text-sm text-[#2D1E18] pr-4">
                    {language === "kn" && faq.kannadaQuestion ? faq.kannadaQuestion : faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#C5A059] shrink-0" />
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

