import React, { useState, useEffect } from "react";
import { Eye, Clock, Volume2, Globe } from "lucide-react";

interface TopUtilityBarProps {
  textSize: "sm" | "md" | "lg";
  setTextSize: (size: "sm" | "md" | "lg") => void;
  highContrast: boolean;
  setHighContrast: (contrast: boolean) => void;
  language: "en" | "kn";
  setLanguage: (lang: "en" | "kn") => void;
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({
  textSize,
  setTextSize,
  highContrast,
  setHighContrast,
  language,
  setLanguage,
}) => {
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        }) + " IST"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#2D1E18] text-[#FDFBF7] text-xs py-1.5 px-4 border-b border-[#C5A059]/30">
      {/* Skip to Main Content Link for Screen Readers and Keyboard Navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content / ಮುಖ್ಯ ವಿಷಯಕ್ಕೆ ಹೋಗಿ
      </a>

      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Project Badge & Real-time clock */}
        <div className="flex items-center space-x-3 text-[11px] text-[#E8DFD8]">
          <span className="font-semibold text-[#C5A059] flex items-center">
            <Volume2 className="w-3.5 h-3.5 mr-1" />
            Karnataka Agricultural Heritage & Market Intelligence
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="hidden sm:flex items-center text-white/70">
            <Clock className="w-3 h-3 mr-1 text-[#C5A059]" />
            {timeStr}
          </span>
        </div>

        {/* Right: Accessibility Controls & Language Selector */}
        <div className="flex items-center space-x-4">
          {/* Text Size Switcher (A- / A / A+) */}
          <div className="flex items-center space-x-1 bg-black/30 rounded px-1.5 py-0.5 border border-white/10" aria-label="Text Size Controls">
            <span className="text-[10px] text-white/60 mr-1 hidden md:inline">Text:</span>
            <button
              onClick={() => setTextSize("sm")}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition ${
                textSize === "sm" ? "bg-[#C5A059] text-[#2D1E18]" : "hover:text-[#C5A059]"
              }`}
              title="Decrease Font Size (A-)"
              aria-label="Decrease Font Size"
            >
              A-
            </button>
            <button
              onClick={() => setTextSize("md")}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition ${
                textSize === "md" ? "bg-[#C5A059] text-[#2D1E18]" : "hover:text-[#C5A059]"
              }`}
              title="Reset Font Size (A)"
              aria-label="Normal Font Size"
            >
              A
            </button>
            <button
              onClick={() => setTextSize("lg")}
              className={`px-1.5 py-0.5 rounded text-[11px] font-bold transition ${
                textSize === "lg" ? "bg-[#C5A059] text-[#2D1E18]" : "hover:text-[#C5A059]"
              }`}
              title="Increase Font Size (A+)"
              aria-label="Increase Font Size"
            >
              A+
            </button>
          </div>

          {/* High Contrast Toggle */}
          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium border transition ${
              highContrast
                ? "bg-[#FFD700] text-black border-[#FFD700] font-bold"
                : "bg-black/30 text-white/80 border-white/10 hover:border-[#C5A059] hover:text-[#C5A059]"
            }`}
            title="Toggle High Contrast Display"
            aria-pressed={highContrast}
          >
            <Eye className="w-3 h-3 mr-0.5" />
            <span>{highContrast ? "High Contrast: On" : "Contrast"}</span>
          </button>

          {/* Language Selector (English / ಕನ್ನಡ) */}
          <div className="flex items-center space-x-1">
            <Globe className="w-3 h-3 text-[#C5A059]" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as "en" | "kn")}
              className="bg-black/40 text-white text-[11px] font-semibold border border-white/20 rounded px-1.5 py-0.5 focus:outline-none focus:border-[#C5A059]"
              aria-label="Select Language"
            >
              <option value="en">English (EN)</option>
              <option value="kn">ಕನ್ನಡ (KN)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

