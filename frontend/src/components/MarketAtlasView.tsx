import React, { useState } from "react";
import {
  MapPin,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Info,
  Calendar,
  Layers,
  TrendingUp,
  Truck,
  Check,
} from "lucide-react";
import type { MarketInfo } from "../contracts/types";

interface MarketAtlasViewProps {
  markets: MarketInfo[];
  selectedCrop: string;
  setSelectedCrop: (crop: string) => void;
  selectedMarketId: number;
  setSelectedMarketId: (id: number) => void;
  selectedDistrict: string;
  setSelectedDistrict: (dist: string) => void;
  onNavigateToTab?: (tab: string) => void;
  language: "en" | "kn";
}

// Karnataka APMC Geo Points mapped to SVG coordinate bounds (viewBox 0 0 600 680)
// Longitude: 74.0 to 78.6 -> X mapping
// Latitude: 18.5 to 11.5 -> Y mapping (inverted)
interface MapPoint {
  id: number;
  name: string;
  kannadaName: string;
  district: string;
  x: number;
  y: number;
  arrivalsQtl: number;
  modalPrice: number;
  historicalPeriod: string;
  historicalSignificance: string;
}

const APMC_MAP_POINTS: MapPoint[] = [
  {
    id: 1,
    name: "Bengaluru (Binny Mill)",
    kannadaName: "ಬೆಂಗಳೂರು (ಬಿನ್ನಿ ಮಿಲ್)",
    district: "Bengaluru Urban",
    x: 440,
    y: 540,
    arrivalsQtl: 1420,
    modalPrice: 2450,
    historicalPeriod: "Est. 1884 (Mysore Kingdom)",
    historicalSignificance: "Centennial rail-fed trading depot and central commodity pricing clearing house.",
  },
  {
    id: 2,
    name: "Kolar Mandi",
    kannadaName: "ಕೋಲಾರ ಮಂಡಿ",
    district: "Kolar",
    x: 510,
    y: 520,
    arrivalsQtl: 2850,
    modalPrice: 2520,
    historicalPeriod: "Est. 1948",
    historicalSignificance: "Asia's 2nd largest tomato terminal; drought resilience horticultural miracle.",
  },
  {
    id: 3,
    name: "Hubballi APMC",
    kannadaName: "ಹುಬ್ಬಳ್ಳಿ ಎಪಿಎಂಸಿ",
    district: "Dharwad",
    x: 180,
    y: 280,
    arrivalsQtl: 1890,
    modalPrice: 2380,
    historicalPeriod: "Est. 1928 (Bombay Act)",
    historicalSignificance: "Karnataka's oldest regulated cotton and grain terminal market yard.",
  },
  {
    id: 4,
    name: "Belagavi APMC",
    kannadaName: "ಬೆಳಗಾವಿ ಎಪಿಎಂಸಿ",
    district: "Belagavi",
    x: 110,
    y: 220,
    arrivalsQtl: 1150,
    modalPrice: 2410,
    historicalPeriod: "Est. 1935",
    historicalSignificance: "Strategic tri-state agricultural corridor connecting Karnataka, Maharashtra and Goa.",
  },
  {
    id: 5,
    name: "Mysuru Bandipalya",
    kannadaName: "ಮೈಸೂರು ಬಂಡಿಪಾಳ್ಯ",
    district: "Mysuru",
    x: 340,
    y: 600,
    arrivalsQtl: 1280,
    modalPrice: 2480,
    historicalPeriod: "Est. 1912 (Nalvadi Wadiyar)",
    historicalSignificance: "Royal Mysore regulated yard designed with Sir M. Visvesvaraya for Cauvery ryots.",
  },
  {
    id: 6,
    name: "Davanagere APMC",
    kannadaName: "ದಾವಣಗೆರೆ ಎಪಿಎಂಸಿ",
    district: "Davanagere",
    x: 270,
    y: 380,
    arrivalsQtl: 920,
    modalPrice: 2400,
    historicalPeriod: "Est. 1954",
    historicalSignificance: "The 'Manchester of Karnataka' – primary maize, cotton, and oilseed exchange.",
  },
  {
    id: 7,
    name: "Shimoga APMC",
    kannadaName: "ಶಿವಮೊಗ್ಗ ಎಪಿಎಂಸಿ",
    district: "Shimoga",
    x: 220,
    y: 430,
    arrivalsQtl: 840,
    modalPrice: 2430,
    historicalPeriod: "Est. 1961",
    historicalSignificance: "Malenadu agrarian gateway for Arecanut, paddy, and spices.",
  },
  {
    id: 8,
    name: "Tumakuru APMC",
    kannadaName: "ತುಮಕೂರು ಎಪಿಎಂಸಿ",
    district: "Tumakuru",
    x: 390,
    y: 490,
    arrivalsQtl: 1100,
    modalPrice: 2420,
    historicalPeriod: "Est. 1958",
    historicalSignificance: "Major coconut, ragi, and pulses trading yard for Central Karnataka.",
  },
  {
    id: 9,
    name: "Mandya APMC",
    kannadaName: "ಮಂಡ್ಯ ಎಪಿಎಂಸಿ",
    district: "Mandya",
    x: 370,
    y: 575,
    arrivalsQtl: 980,
    modalPrice: 2460,
    historicalPeriod: "Est. 1941",
    historicalSignificance: "Sugarcane and jaggery capital irrigated by the historic KRS Visvesvaraya Canal.",
  },
  {
    id: 10,
    name: "Hassan APMC",
    kannadaName: "ಹಾಸನ ಎಪಿಎಂಸಿ",
    district: "Hassan",
    x: 290,
    y: 530,
    arrivalsQtl: 870,
    modalPrice: 2390,
    historicalPeriod: "Est. 1952",
    historicalSignificance: "Foremost potato and coffee curing agrarian marketing yard.",
  },
];

export const MarketAtlasView: React.FC<MarketAtlasViewProps> = ({
  markets,
  selectedCrop,
  setSelectedCrop,
  selectedMarketId,
  setSelectedMarketId,
  selectedDistrict,
  setSelectedDistrict,
  onNavigateToTab,
  language,
}) => {
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [legendMode, setLegendMode] = useState<"arrivals" | "price">("arrivals");
  const [filterAppliedNotice, setFilterAppliedNotice] = useState<boolean>(false);

  // Selected market details from map points or fallback
  const selectedPoint =
    APMC_MAP_POINTS.find((p) => p.id === selectedMarketId) || APMC_MAP_POINTS[0];

  const handleGo = () => {
    // Find market corresponding to selected district if any
    const matchingPoint = APMC_MAP_POINTS.find((p) => p.district === selectedDistrict);
    if (matchingPoint) {
      setSelectedMarketId(matchingPoint.id);
    }
    setFilterAppliedNotice(true);
    setTimeout(() => setFilterAppliedNotice(false), 3000);
  };

  const handleReset = () => {
    setSelectedCrop("tomato");
    setSelectedDistrict("Bengaluru Urban");
    setSelectedMarketId(1);
    setFilterDate(new Date().toISOString().split("T")[0]);
    setZoomLevel(1);
    setLegendMode("arrivals");
  };

  const getMarkerColor = (point: MapPoint) => {
    if (legendMode === "arrivals") {
      if (point.arrivalsQtl >= 1500) return "#1F7A3D"; // High - Dark Emerald
      if (point.arrivalsQtl >= 1000) return "#C5A059"; // Moderate - Muted Gold
      return "#4B5563"; // Low - Slate
    } else {
      if (point.modalPrice >= 2500) return "#7C3AED"; // High Price - Purple
      if (point.modalPrice >= 2400) return "#1D4ED8"; // Normal - Blue
      return "#059669"; // Budget - Green
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Reference Note Banner */}
      <div className="bg-gradient-to-r from-[#2D1E18] to-[#3E2723] text-[#FDFBF7] p-6 rounded-2xl shadow-md border border-[#C5A059]/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs text-[#C5A059] font-bold tracking-wider uppercase mb-1">
              <Layers className="w-4 h-4" />
              <span>Karnataka APMC Geospatial Atlas</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              {language === "kn" ? "ಕರ್ನಾಟಕ ಮಾರುಕಟ್ಟೆ ನಕ್ಷೆ ಮತ್ತು ಮಂಡಿ ವಿಶ್ಲೇಷಣೆ" : "Karnataka Market Atlas & APMC Geospatial Intelligence"}
            </h2>
            <p className="text-xs text-[#E8DFD8] mt-1 max-w-2xl">
              Interactive geospatial visualization of Karnataka's agricultural regulated markets, combining real-time daily arrivals, modal prices, and century-old agrarian trade histories.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-black/40 px-3 py-2 rounded-xl border border-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{APMC_MAP_POINTS.length} APMC Terminals Mapped</span>
          </div>
        </div>
      </div>

      {/* FILTER CARD (Reference: agmarknet.gov.in/market-atlas) */}
      <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E5DC] pb-3">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-[#C5A059]" />
            <h3 className="font-bold text-sm text-[#2D1E18] uppercase tracking-wide">
              {language === "kn" ? "ಮಾರುಕಟ್ಟೆ ಶೋಧಕ ಫಿಲ್ಟರ್ ಕಾರ್ಡ್" : "Market Atlas Query & Filter Controls"}
            </h3>
          </div>
          {filterAppliedNotice && (
            <span className="inline-flex items-center space-x-1 text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              <span>Filters updated successfully</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Commodity Dropdown */}
          <div className="space-y-1">
            <label className="font-bold text-[#2D1E18] block">Commodity / ಬೆಳೆ:</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-2.5 py-2 font-semibold text-[#2D1E18] focus:border-[#C5A059]"
            >
              <option value="tomato">Tomato (ಟೊಮ್ಯಾಟೊ)</option>
              <option value="onion">Onion (ಈರುಳ್ಳಿ)</option>
              <option value="wheat">Wheat (ಗೋಧಿ)</option>
            </select>
          </div>

          {/* District Dropdown */}
          <div className="space-y-1">
            <label className="font-bold text-[#2D1E18] block">District / ಜಿಲ್ಲೆ:</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-2.5 py-2 font-semibold text-[#2D1E18] focus:border-[#C5A059]"
            >
              <option value="Bengaluru Urban">Bengaluru Urban</option>
              <option value="Kolar">Kolar</option>
              <option value="Dharwad">Dharwad</option>
              <option value="Belagavi">Belagavi</option>
              <option value="Mysuru">Mysuru</option>
              <option value="Davanagere">Davanagere</option>
              <option value="Shimoga">Shimoga</option>
              <option value="Tumakuru">Tumakuru</option>
              <option value="Mandya">Mandya</option>
              <option value="Hassan">Hassan</option>
            </select>
          </div>

          {/* APMC Market Dropdown */}
          <div className="space-y-1">
            <label className="font-bold text-[#2D1E18] block">APMC Yard / ಮಂಡಿ:</label>
            <select
              value={selectedMarketId}
              onChange={(e) => setSelectedMarketId(Number(e.target.value))}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-2.5 py-2 font-semibold text-[#2D1E18] focus:border-[#C5A059]"
            >
              {markets.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.district})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="space-y-1">
            <label className="font-bold text-[#2D1E18] block flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#C5A059]" />
              Date / ದಿನಾಂಕ:
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-2.5 py-1.5 font-semibold text-[#2D1E18] focus:border-[#C5A059]"
            />
          </div>

          {/* Action Buttons: Go & Reset */}
          <div className="flex items-end space-x-2">
            <button
              onClick={handleGo}
              className="flex-1 bg-[#1F7A3D] hover:bg-[#165a2d] text-white font-bold py-2 rounded-lg shadow-sm transition active:scale-95"
            >
              {language === "kn" ? "ಶೋಧಿಸಿ (Go)" : "Go"}
            </button>
            <button
              onClick={handleReset}
              className="px-3 bg-[#EAECE6] hover:bg-[#dfe2d8] text-[#2D1E18] font-bold py-2 rounded-lg transition active:scale-95 flex items-center"
              title="Reset Filters to Default"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN ATLAS INTERFACE: Interactive Map + Side Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / CENTER: Interactive Karnataka APMC SVG Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-3 relative overflow-hidden">
          {/* Map Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E5DC] pb-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#2D1E18]">Map View:</span>
              <div className="inline-flex rounded-lg border border-[#E2E5DC] p-0.5 bg-[#FDFBF7]">
                <button
                  onClick={() => setLegendMode("arrivals")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                    legendMode === "arrivals"
                      ? "bg-[#1F7A3D] text-white"
                      : "text-[#5B6354] hover:text-[#1A1F16]"
                  }`}
                >
                  Arrivals Volume
                </button>
                <button
                  onClick={() => setLegendMode("price")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                    legendMode === "price"
                      ? "bg-[#7C3AED] text-white"
                      : "text-[#5B6354] hover:text-[#1A1F16]"
                  }`}
                >
                  Modal Price Level
                </button>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
                className="p-1.5 rounded-md bg-[#FDFBF7] hover:bg-[#EAECE6] border border-[#E2E5DC] text-[#2D1E18]"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
                className="p-1.5 rounded-md bg-[#FDFBF7] hover:bg-[#EAECE6] border border-[#E2E5DC] text-[#2D1E18]"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="px-2 py-1 rounded-md bg-[#FDFBF7] hover:bg-[#EAECE6] border border-[#E2E5DC] text-[11px] font-bold text-[#2D1E18]"
                title="Reset View"
              >
                Reset View
              </button>
            </div>
          </div>

          {/* Interactive SVG Map Container */}
          <div className="relative w-full h-[460px] bg-[#F7F4EB] rounded-xl overflow-hidden border border-[#E2E5DC] flex items-center justify-center">
            {/* SVG Vector Map of Karnataka */}
            <svg
              viewBox="0 0 600 680"
              className="w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {/* Karnataka State Boundary Silhouette */}
              <defs>
                <radialGradient id="mapBgGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFDF9" />
                  <stop offset="100%" stopColor="#F5EFE6" />
                </radialGradient>
                <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="2" dy="3" stdDeviation="3" floodColor="#2D1E18" floodOpacity="0.15" />
                </filter>
              </defs>

              {/* Generalized Karnataka boundary polygon */}
              <path
                d="M 120 180 
                   Q 150 120 250 80 
                   Q 330 60 410 130 
                   Q 460 210 440 320 
                   Q 490 380 530 480 
                   Q 540 550 490 610 
                   Q 420 650 330 640 
                   Q 260 620 220 540 
                   Q 180 480 140 400 
                   Q 90 300 120 180 Z"
                fill="url(#mapBgGrad)"
                stroke="#C5A059"
                strokeWidth="2.5"
                filter="url(#shadow)"
              />

              {/* Internal District Guidance Lines */}
              <path d="M 250 80 L 270 380 L 440 540" stroke="#E2E5DC" strokeWidth="1" strokeDasharray="3,3" />
              <path d="M 180 280 L 440 320" stroke="#E2E5DC" strokeWidth="1" strokeDasharray="3,3" />
              <path d="M 220 540 L 370 575" stroke="#E2E5DC" strokeWidth="1" strokeDasharray="3,3" />

              {/* Waterway: Cauvery & Krishna representation */}
              <path d="M 220 540 Q 330 580 490 610" fill="none" stroke="#93C5FD" strokeWidth="2" strokeDasharray="4,2" />
              <text x="235" y="590" fill="#3B82F6" fontSize="10" fontStyle="italic">Cauvery Basin</text>

              {/* APMC Market Pins */}
              {APMC_MAP_POINTS.map((pt) => {
                const isSelected = pt.id === selectedMarketId;
                const markerFill = getMarkerColor(pt);
                return (
                  <g
                    key={pt.id}
                    onClick={() => {
                      setSelectedMarketId(pt.id);
                      setSelectedDistrict(pt.district);
                    }}
                    className="cursor-pointer transition transform hover:scale-110"
                    style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle cx={pt.x} cy={pt.y} r="18" fill="none" stroke="#C5A059" strokeWidth="2.5" className="animate-ping" opacity="0.6" />
                    )}

                    {/* Outer Pin Body */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? "11" : "8"}
                      fill={markerFill}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />

                    {/* Inner core */}
                    <circle cx={pt.x} cy={pt.y} r="3" fill="#FFFFFF" />

                    {/* Market Label */}
                    <text
                      x={pt.x + 12}
                      y={pt.y + 4}
                      fill="#2D1E18"
                      fontSize={isSelected ? "11" : "9"}
                      fontWeight={isSelected ? "bold" : "600"}
                      className="select-none pointer-events-none drop-shadow"
                    >
                      {language === "kn" ? pt.kannadaName.split(" ")[0] : pt.name.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* COLOR LEGEND OVERLAY (Bottom-Left) */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-[#E2E5DC] text-[11px] space-y-1.5 shadow-md">
              <div className="font-bold text-[#2D1E18] flex items-center space-x-1">
                <span>{legendMode === "arrivals" ? "Arrivals Legend (qtl)" : "Price Spread (₹/qtl)"}</span>
              </div>
              {legendMode === "arrivals" ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#1F7A3D]" />
                    <span>High Volume (&gt; 1,500 qtl)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#C5A059]" />
                    <span>Moderate (1,000 - 1,500 qtl)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#4B5563]" />
                    <span>Low Volume (&lt; 1,000 qtl)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#7C3AED]" />
                    <span>Premium (&gt; ₹2,500/qtl)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#1D4ED8]" />
                    <span>Normal (₹2,400 - 2,500/qtl)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#059669]" />
                    <span>Competitive (&lt; ₹2,400/qtl)</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: SIDE DETAILS PANEL (Reference: agmarknet.gov.in/market-atlas) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-3">
              <span className="text-xs uppercase font-bold text-[#C5A059] tracking-wider">
                Market Details & Summary
              </span>
              <span className="text-xs bg-[#FDFBF7] text-[#2D1E18] font-bold px-2 py-0.5 rounded border border-[#E2E5DC]">
                {selectedPoint.district}
              </span>
            </div>

            {/* Selected Market Info Header */}
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#2D1E18]">
                {selectedPoint.name}
              </h3>
              <p className="text-xs text-[#C5A059] font-semibold">
                {selectedPoint.kannadaName}
              </p>
              <div className="inline-block bg-[#FDFBF7] px-2 py-0.5 rounded text-[11px] text-[#5B6354] font-medium border border-[#E2E5DC] mt-1">
                {selectedPoint.historicalPeriod}
              </div>
            </div>

            {/* Live Pricing & Arrival Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E2E5DC] space-y-1">
                <span className="text-[11px] text-[#5B6354]">Prevailing Modal Price</span>
                <div className="text-2xl font-extrabold text-[#1F7A3D]">
                  ₹{selectedPoint.modalPrice.toLocaleString()}
                  <span className="text-xs font-normal text-[#5B6354]">/qtl</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  Crop: {selectedCrop.toUpperCase()}
                </div>
              </div>

              <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E2E5DC] space-y-1">
                <span className="text-[11px] text-[#5B6354]">Today's Recorded Arrivals</span>
                <div className="text-2xl font-extrabold text-[#2D1E18]">
                  {selectedPoint.arrivalsQtl.toLocaleString()}
                  <span className="text-xs font-normal text-[#5B6354]"> qtl</span>
                </div>
                <div className="text-[10px] text-blue-700 font-semibold">
                  Active Auction Flow
                </div>
              </div>
            </div>

            {/* Historical Agrarian Significance */}
            <div className="bg-[#F7F4EB] p-4 rounded-xl border border-[#C5A059]/30 space-y-1.5 text-xs text-[#2D1E18]">
              <div className="font-bold text-[#2D1E18] flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Historical Mandi Heritage</span>
              </div>
              <p className="text-[11px] text-[#2D1E18] leading-relaxed">
                {selectedPoint.historicalSignificance}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons connecting to live intelligence */}
          <div className="space-y-2 pt-2 border-t border-[#E2E5DC]">
            <div className="text-[11px] text-[#5B6354] font-semibold">
              Deep Analytics for {selectedPoint.name}:
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateToTab && onNavigateToTab("market")}
                className="flex items-center justify-center space-x-1 px-3 py-2 bg-[#1F7A3D] hover:bg-[#165a2d] text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
              >
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                <span>Live Price Series</span>
              </button>
              <button
                onClick={() => onNavigateToTab && onNavigateToTab("logistics")}
                className="flex items-center justify-center space-x-1 px-3 py-2 bg-[#2D1E18] hover:bg-[#3E2723] text-[#FDFBF7] text-xs font-bold rounded-lg shadow-sm transition active:scale-95"
              >
                <Truck className="w-3.5 h-3.5 mr-1" />
                <span>Freight Calculator</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

