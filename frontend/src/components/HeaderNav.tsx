import React, { useState } from "react";
import {
  Home,
  BookOpen,
  MapPin,
  Award,
  Calendar,
  Image,
  Info,
  HelpCircle,
  Mail,
  TrendingUp,
  Menu,
  X,
  Landmark,
  Layers,
} from "lucide-react";

interface HeaderNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: "en" | "kn";
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentTab,
  onSelectTab,
  language,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const navItems = [
    { id: "home", label: language === "kn" ? "ಮುಖಪುಟ" : "Home", icon: Home },
    { id: "history", label: language === "kn" ? "ಇತಿಹಾಸ" : "History", icon: BookOpen },
    { id: "places", label: language === "kn" ? "ಐತಿಹಾಸಿಕ ಸ್ಥಳಗಳು" : "Historical Places", icon: MapPin },
    { id: "personalities", label: language === "kn" ? "ವ್ಯಕ್ತಿತ್ವಗಳು" : "Personalities", icon: Award },
    { id: "events", label: language === "kn" ? "ಘಟನೆಗಳು" : "Events", icon: Calendar },
    { id: "atlas", label: language === "kn" ? "ಮಾರುಕಟ್ಟೆ ನಕ್ಷೆ" : "Market Atlas", icon: Layers },
    { id: "gallery", label: language === "kn" ? "ಗ್ಯಾಲರಿ" : "Gallery", icon: Image },
    { id: "about", label: language === "kn" ? "ನಮ್ಮ ಬಗ್ಗೆ" : "About Us", icon: Info },
    { id: "manual", label: language === "kn" ? "ಕೈಪಿಡಿ" : "User Manual", icon: HelpCircle },
    { id: "contact", label: language === "kn" ? "ಸಂಪರ್ಕ" : "Contact", icon: Mail },
  ];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-[#C5A059]/30 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Title */}
          <button
            onClick={() => handleNavClick("home")}
            className="flex items-center space-x-3 text-left focus:outline-none"
            aria-label="Go to AgriIntel Karnataka Homepage"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2D1E18] to-[#1F7A3D] flex items-center justify-center text-[#FDFBF7] shadow-md border border-[#C5A059]">
              <Landmark className="w-6 h-6 text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black text-[#2D1E18] tracking-tight">
                  AgriIntel Karnataka
                </span>
                <span className="text-[10px] bg-[#C5A059]/20 text-[#2D1E18] font-bold px-1.5 py-0.5 rounded border border-[#C5A059]/40 hidden sm:inline">
                  Heritage & Market
                </span>
              </div>
              <div className="text-[11px] text-[#C5A059] font-bold tracking-wide">
                ಕರ್ನಾಟಕ ಕೃಷಿ ಪರಂಪರೆ ಮತ್ತು ಡಿಜಿಟಲ್ ಇತಿಹಾಸ
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap focus:outline-none ${
                    isActive
                      ? "bg-[#2D1E18] text-[#FDFBF7] shadow-sm"
                      : "text-[#2D1E18] hover:bg-[#FDFBF7] hover:text-[#C5A059]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C5A059]" : "text-[#5B6354]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Quick Switcher to Live Market Intelligence Tab */}
            <button
              onClick={() => handleNavClick("market")}
              className={`ml-2 px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shadow-sm focus:outline-none ${
                [
                  "market",
                  "forecast",
                  "logistics",
                  "marketplace",
                  "advisory",
                  "external",
                  "krushimitra",
                ].includes(currentTab)
                  ? "bg-[#1F7A3D] text-white"
                  : "bg-emerald-50 text-[#1F7A3D] hover:bg-emerald-100 border border-emerald-200"
              }`}
              title="Launch Live Market Prices & ML Models"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Live Mandi Tools</span>
            </button>
          </nav>

          {/* Medium Screens (Tablet) Compact Nav / Mobile Hamburger Button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick("market")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1F7A3D] text-white flex items-center space-x-1 shadow-sm"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Live Mandis</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#FDFBF7] border border-[#E2E5DC] text-[#2D1E18] hover:bg-[#EAECE6] transition focus:outline-none"
              aria-label="Toggle Mobile Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#2D1E18]" /> : <Menu className="w-6 h-6 text-[#2D1E18]" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden py-4 border-t border-[#E2E5DC] space-y-1 animate-fadeIn bg-white rounded-b-2xl shadow-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-bold transition text-left ${
                    isActive
                      ? "bg-[#2D1E18] text-[#FDFBF7]"
                      : "text-[#2D1E18] hover:bg-[#FDFBF7]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#C5A059]" : "text-[#5B6354]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-2 px-2 border-t border-[#E2E5DC]">
              <button
                onClick={() => handleNavClick("market")}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#1F7A3D] text-white shadow-sm"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Launch Live Market Intelligence Engine</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

