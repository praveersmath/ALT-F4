import React, { useState } from "react";
import {
  Home,
  Layers,
  TrendingUp,
  Sparkles,
  Truck,
  ShoppingBag,
  AlertTriangle,
  Globe,
  Recycle,
  HelpCircle,
  Info,
  Menu,
  X,
  Landmark,
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
    { id: "atlas", label: language === "kn" ? "ಮಾರುಕಟ್ಟೆ ಅಟ್ಲಾಸ್" : "Market Atlas", icon: Layers },
    { id: "market", label: language === "kn" ? "ಮಂಡಿ ಬೆಲೆಗಳು" : "Mandi Prices", icon: TrendingUp },
    { id: "forecast", label: language === "kn" ? "ಮುನ್ಸೂಚನೆ" : "ML Forecast", icon: Sparkles },
    { id: "logistics", label: language === "kn" ? "ಸಾರಿಗೆ ವೆಚ್ಚ" : "Logistics", icon: Truck },
    { id: "marketplace", label: language === "kn" ? "ಮಾರುಕಟ್ಟೆ" : "Marketplace", icon: ShoppingBag },
    { id: "advisory", label: language === "kn" ? "ಬೆಳೆ ಸಲಹೆ" : "Crop Advisory", icon: AlertTriangle },
    { id: "external", label: language === "kn" ? "೭-ಸ್ತಂಭಗಳ ಡೇಟಾ" : "7 Pillars", icon: Globe },
    { id: "krushimitra", label: language === "kn" ? "ಕೃಷಿಮಿತ್ರ" : "KrushiMitra", icon: Recycle },
    { id: "manual", label: language === "kn" ? "ಕೈಪಿಡಿ" : "User Manual", icon: HelpCircle },
    { id: "about", label: language === "kn" ? "ಬಗ್ಗೆ / ಸಂಪರ್ಕ" : "About & Contact", icon: Info },
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
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1F7A3D] to-[#165a2d] flex items-center justify-center text-[#FDFBF7] shadow-md border border-[#C5A059]">
              <Landmark className="w-6 h-6 text-[#FDFBF7]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-black text-[#2D1E18] tracking-tight">
                  AgriIntel Karnataka
                </span>
                <span className="text-[10px] bg-[#1F7A3D]/10 text-[#1F7A3D] font-bold px-1.5 py-0.5 rounded border border-[#1F7A3D]/30 hidden sm:inline">
                  APMC Intelligence
                </span>
              </div>
              <div className="text-[11px] text-[#1F7A3D] font-bold tracking-wide">
                ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಮುನ್ಸೂಚನೆ ಮತ್ತು ವಿಶ್ಲೇಷಣೆ
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
                  className={`flex items-center space-x-1 px-2.5 py-2 rounded-lg text-xs font-bold transition whitespace-nowrap focus:outline-none ${
                    isActive
                      ? "bg-[#1F7A3D] text-white shadow-sm"
                      : "text-[#2D1E18] hover:bg-[#FDFBF7] hover:text-[#1F7A3D]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-[#5B6354]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick("atlas")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1F7A3D] text-white flex items-center space-x-1 shadow-sm"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Atlas</span>
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
                      ? "bg-[#1F7A3D] text-white"
                      : "text-[#2D1E18] hover:bg-[#FDFBF7]"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#5B6354]"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
