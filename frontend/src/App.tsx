import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  AlertTriangle,
  Truck,
  ShoppingBag,
  MapPin,
  Sparkles,
  RefreshCw,
  LogOut,
  User as UserIcon,
  ShieldAlert,
  Globe,
  Activity,
  Recycle,
  MessageSquare,
  Newspaper,
  Phone,
  Send,
} from "lucide-react";
import { api } from "./api";
import type {
  Atlas,
  CropRecommendations,
  Forecast,
  HikeAlert,
  Listing,
  MarketInfo,
  MspAdvisory,
  PriceSeries,
  UserPublic,
} from "./contracts/types";

// Enhanced Cultural & History Components
import { TopUtilityBar } from "./components/TopUtilityBar";
import { HeaderNav } from "./components/HeaderNav";
import { HomepageDashboard } from "./components/HomepageDashboard";
import { MarketAtlasView } from "./components/MarketAtlasView";
import { UserManualView } from "./components/UserManualView";
import { AboutContactView } from "./components/AboutContactView";
import { DataAnalysisComparisonView } from "./components/DataAnalysisComparisonView";
import { LogisticsOptimizerView } from "./components/LogisticsOptimizerView";
import { B2BMarketplaceView } from "./components/B2BMarketplaceView";
import { Footer } from "./components/Footer";

export const ALL_CROPS = [
  { id: "tomato", name: "Tomato (ಟೊಮೆಟೊ)" },
  { id: "onion", name: "Onion (ಈರುಳ್ಳಿ)" },
  { id: "potato", name: "Potato (ಆಲೂಗಡ್ಡೆ)" },
  { id: "wheat", name: "Wheat (ಗೋಧಿ)" },
  { id: "maize", name: "Maize (ಮೆಕ್ಕೆಜೋಳ)" },
  { id: "cotton", name: "Cotton (ಹತ್ತಿ)" },
  { id: "chana", name: "Chana / Gram (ಕಡಲೆ)" },
  { id: "tur", name: "Tur / Pigeon Pea (ತೊಗರಿ)" },
  { id: "ragi", name: "Ragi / Finger Millet (ರಾಗಿ)" },
  { id: "arecanut", name: "Arecanut / Betel Nut (ಅಡಿಕೆ)" },
  { id: "coffee", name: "Coffee (ಕಾಫಿ)" },
  { id: "chilli", name: "Byadgi Chilli (ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ)" },
  { id: "groundnut", name: "Groundnut (ಕಡಲೆಕಾಯಿ)" },
  { id: "sugarcane", name: "Sugarcane (ಕಬ್ಬು)" },
  { id: "rice", name: "Rice / Paddy (ಭತ್ತ / ಅಕ್ಕಿ)" },
];

export const ALL_DISTRICTS = [
  "Bengaluru Urban",
  "Kolar",
  "Dharwad",
  "Belagavi",
  "Mysuru",
  "Davanagere",
  "Shimoga",
  "Tumakuru",
  "Mandya",
  "Hassan",
  "Haveri",
  "Kalaburagi",
  "Raichur",
  "Ballari",
  "Vijayapura",
  "Chikkamagaluru",
  "Bagalkote",
  "Chitradurga",
  "Gadag",
  "Dakshina Kannada",
];

// Fallback markets ensuring UI is never broken even prior to backend connection
const DEFAULT_MARKETS: MarketInfo[] = [
  { id: 1, name: "Bengaluru (Binny Mill)", district: "Bengaluru Urban", state: "karnataka", lat: 12.9716, lon: 77.5946, coords_estimated: false },
  { id: 2, name: "Kolar Mandi", district: "Kolar", state: "karnataka", lat: 13.1367, lon: 78.1291, coords_estimated: false },
  { id: 3, name: "Hubballi APMC", district: "Dharwad", state: "karnataka", lat: 15.3647, lon: 75.1240, coords_estimated: false },
  { id: 4, name: "Belagavi APMC", district: "Belagavi", state: "karnataka", lat: 15.8497, lon: 74.4977, coords_estimated: false },
  { id: 5, name: "Mysuru Bandipalya", district: "Mysuru", state: "karnataka", lat: 12.2958, lon: 76.6394, coords_estimated: false },
  { id: 6, name: "Davanagere APMC", district: "Davanagere", state: "karnataka", lat: 14.4644, lon: 75.9218, coords_estimated: false },
  { id: 7, name: "Shimoga APMC", district: "Shimoga", state: "karnataka", lat: 13.9299, lon: 75.5681, coords_estimated: false },
  { id: 8, name: "Tumakuru APMC", district: "Tumakuru", state: "karnataka", lat: 13.3409, lon: 77.1010, coords_estimated: false },
  { id: 9, name: "Mandya APMC", district: "Mandya", state: "karnataka", lat: 12.5242, lon: 76.8958, coords_estimated: false },
  { id: 10, name: "Hassan APMC", district: "Hassan", state: "karnataka", lat: 13.0072, lon: 76.1029, coords_estimated: false },
  { id: 11, name: "Byadgi APMC", district: "Haveri", state: "karnataka", lat: 14.6826, lon: 75.4878, coords_estimated: false },
  { id: 12, name: "Kalaburagi APMC (Nehru Gunj)", district: "Kalaburagi", state: "karnataka", lat: 17.3297, lon: 76.8343, coords_estimated: false },
  { id: 13, name: "Raichur APMC", district: "Raichur", state: "karnataka", lat: 16.2076, lon: 77.3463, coords_estimated: false },
  { id: 14, name: "Ballari APMC", district: "Ballari", state: "karnataka", lat: 15.1394, lon: 76.9214, coords_estimated: false },
  { id: 15, name: "Vijayapura APMC", district: "Vijayapura", state: "karnataka", lat: 16.8302, lon: 75.7100, coords_estimated: false },
  { id: 16, name: "Chikkamagaluru APMC", district: "Chikkamagaluru", state: "karnataka", lat: 13.3161, lon: 75.7720, coords_estimated: false },
  { id: 17, name: "Bagalkote APMC", district: "Bagalkote", state: "karnataka", lat: 16.1691, lon: 75.6615, coords_estimated: false },
  { id: 18, name: "Chitradurga APMC", district: "Chitradurga", state: "karnataka", lat: 14.2251, lon: 76.3980, coords_estimated: false },
  { id: 19, name: "Gadag APMC", district: "Gadag", state: "karnataka", lat: 15.4298, lon: 75.6320, coords_estimated: false },
  { id: 20, name: "Udupi-Mangaluru APMC", district: "Dakshina Kannada", state: "karnataka", lat: 12.9141, lon: 74.8560, coords_estimated: false },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<
    | "home"
    | "atlas"
    | "market"
    | "forecast"
    | "logistics"
    | "marketplace"
    | "advisory"
    | "external"
    | "krushimitra"
    | "manual"
    | "about"
  >("home");
  const [textSize, setTextSize] = useState<"sm" | "md" | "lg">("md");
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [language, setLanguage] = useState<"en" | "kn">("en");

  // Synchronize accessibility classes on body
  useEffect(() => {
    document.body.className = `${highContrast ? "high-contrast " : ""}text-scale-${textSize}`;
  }, [highContrast, textSize]);
  const [selectedCrop, setSelectedCrop] = useState<string>("tomato");
  const [selectedMarketId, setSelectedMarketId] = useState<number>(1);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Bengaluru Urban");
  const [markets, setMarkets] = useState<MarketInfo[]>(DEFAULT_MARKETS);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserPublic | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // Core Data states
  const [prices, setPrices] = useState<PriceSeries | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [alerts, setAlerts] = useState<HikeAlert[]>([]);
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [advisory, setAdvisory] = useState<MspAdvisory | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendations | null>(null);

  // KrushiMitra Data states
  const [krushiCondition, setKrushiCondition] = useState<"damaged" | "price_crash" | "surplus">("damaged");
  const [krushiQty, setKrushiQty] = useState<number>(500);
  const [krushiTown, setKrushiTown] = useState<string>("CHIK");
  const [wasteData, setWasteData] = useState<any | null>(null);
  const [crossData, setCrossData] = useState<any | null>(null);
  const [newsData, setNewsData] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "bot"; text: string; lang: "en" | "kn" }>
  >([
    {
      role: "bot",
      text: "ನಮಸ್ಕಾರ! ಕೃಷಿಮಿತ್ರ ಸಿಸ್ಟಂಗೆ ಸ್ವಾಗತ. ಮಾರುಕಟ್ಟೆ ಬೆಲೆ, ಸಾರಿಗೆ ವೆಚ್ಚ, ಹಾಳಾದ ಬೆಳೆಗಳ ಮೌಲ್ಯವರ್ಧನೆ ಬಗ್ಗೆ ಯಾವುದೇ ಪ್ರಶ್ನೆ ಕೇಳಿ.\n(Welcome to KrushiMitra! Ask anything about mandi prices, transport costs, or waste-to-value processing.)",
      lang: "kn",
    },
  ]);
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  useEffect(() => {
    loadMarkets();
    checkAuth();
  }, []);

  useEffect(() => {
    loadTabData();
  }, [activeTab, selectedCrop, selectedMarketId, selectedDistrict, krushiCondition, krushiQty, krushiTown]);

  const checkAuth = async () => {
    const token = localStorage.getItem("agriintel_token");
    if (!token) {
      setCurrentUser(null);
      return;
    }
    try {
      const res = await api.getMe();
      setCurrentUser(res.data);
      setBackendOnline(true);
    } catch {
      localStorage.removeItem("agriintel_token");
      setCurrentUser(null);
    }
  };

  const loadMarkets = async () => {
    try {
      const res = await api.getMarkets();
      if (res && res.data && res.data.length > 0) {
        setMarkets(res.data);
        setBackendOnline(true);
      }
    } catch (e) {
      console.warn("Could not load markets from backend, using default APMC catalog", e);
      setBackendOnline(false);
    }
  };

  const currentMarket = markets.find((m) => m.id === selectedMarketId) || markets[0];

  const loadTabData = async () => {
    setLoading(true);
    const prevailingModal = prices?.points?.slice(-1)[0]?.modal_price || 2450;
    try {
      if (activeTab === "market") {
        const [priceRes, alertRes] = await Promise.all([
          api.getPrices(selectedCrop, selectedMarketId).catch(() => null),
          api.getHikeAlerts(selectedCrop).catch(() => null),
        ]);
        if (priceRes) {
          setPrices(priceRes.data);
          setBackendOnline(true);
        }
        if (alertRes) setAlerts(alertRes.data);
      } else if (activeTab === "forecast") {
        const [foreRes, atlasRes] = await Promise.all([
          api.getForecast(selectedCrop, selectedMarketId).catch(() => null),
          api.getAtlas(selectedCrop).catch(() => null),
        ]);
        if (foreRes) {
          setForecast(foreRes.data);
          setBackendOnline(true);
        }
        if (atlasRes) setAtlas(atlasRes.data);
      } else if (activeTab === "logistics") {
        setBackendOnline(true);
      } else if (activeTab === "marketplace") {
        const listRes = await api.getListings(selectedCrop).catch(() => null);
        if (listRes) {
          setListings(listRes.data);
          setBackendOnline(true);
        }
      } else if (activeTab === "advisory") {
        const [advRes, recRes] = await Promise.all([
          api.getMspAdvisory(selectedCrop, selectedDistrict).catch(() => null),
          api.getCropRecommendations(selectedDistrict).catch(() => null),
        ]);
        if (advRes) {
          setAdvisory(advRes.data);
          setBackendOnline(true);
        }
        if (recRes) setRecommendations(recRes.data);
      } else if (activeTab === "external") {
        const extRes = await api
          .getComprehensiveExternalAnalysis(
            selectedCrop,
            selectedDistrict,
            currentMarket.name,
            prevailingModal
          )
          .catch(() => null);
        if (extRes) {
          setBackendOnline(true);
        }
      } else if (activeTab === "krushimitra") {
        const [wRes, cRes, nRes] = await Promise.all([
          api.getWasteToValue(selectedCrop, krushiCondition, krushiQty, krushiTown).catch(() => null),
          api.getCrossCorrelation(selectedCrop, "KOL").catch(() => null),
          api.getNewsSentiment(selectedCrop).catch(() => null),
        ]);
        if (wRes) {
          setWasteData(wRes.data);
          setBackendOnline(true);
        }
        if (cRes) setCrossData(cRes.data);
        if (nRes) setNewsData(nRes.data);
      }
    } catch {
      setBackendOnline(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("agriintel_token");
    setCurrentUser(null);
  };

  const handleMarketplaceLogin = async (email: string, pass: string) => {
    try {
      const res = await api.login({ email, password: pass });
      localStorage.setItem("agriintel_token", res.data.access_token);
      await checkAuth();
    } catch (err: any) {
      alert(`Login failed: ${err.message}`);
    }
  };

  const handleMarketplaceRegister = async () => {
    try {
      await api.register({
        name: "Basavaraj Patil",
        email: `farmer_${Date.now()}@agriintel.in`,
        password: "Password123!",
        role: "farmer",
        district: selectedDistrict,
      });
      alert("Farmer account registered! You can now post lots.");
      await checkAuth();
    } catch (err: any) {
      alert(`Registration failed: ${err.message}`);
    }
  };

  const handleMarketplaceCreateListing = async (req: {
    crop: string;
    quantity_qtl: number;
    asking_price_per_qtl: number;
    district: string;
    market_id?: number | null;
  }) => {
    try {
      await api.createListing({
        crop: req.crop,
        quantity_qtl: req.quantity_qtl,
        asking_price_per_qtl: req.asking_price_per_qtl,
        district: req.district,
        market_id: req.market_id,
      });
      alert("Trade lot published successfully to Karnataka B2B Wholesale Board!");
      const listRes = await api.getListings(selectedCrop);
      setListings(listRes.data);
    } catch (err: any) {
      alert(`Failed to create listing: ${err.message}`);
    }
  };

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { role: "user", text: userMsg, lang: "en" }]);
    setChatLoading(true);

    try {
      const res = await api.sendChatAdvisory(userMsg, selectedCrop, selectedDistrict);
      if (res && res.data) {
        setChatMessages((prev) => [
          ...prev,
          { role: "bot", text: res.data.reply, lang: res.data.language },
        ]);
        setBackendOnline(true);
      }
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "ಕ್ಷಮಿಸಿ, ಸಂಪರ್ಕ ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ. ಸರ್ವರ್ ಆನ್‌ಲೈನ್ ಇದೆಯೇ ಪರಿಶೀಲಿಸಿ. (Backend unreachable. Please verify server connection.)",
          lang: "kn",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#1A1F16]">
      {/* Top Warning Banner if Backend Server is offline */}
      {backendOnline === false && (
        <div className="bg-amber-500 text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            <span>
              Backend Server Offline (Vite proxy port 8000 unreachable). Run{" "}
              <code className="bg-amber-700 px-1.5 py-0.5 rounded font-mono">.\start.ps1</code> or{" "}
              <code className="bg-amber-700 px-1.5 py-0.5 rounded font-mono">
                python -m uvicorn app.main:app --reload --port 8000
              </code>{" "}
              in PowerShell.
            </span>
          </div>
          <button
            onClick={() => {
              loadMarkets();
              loadTabData();
            }}
            className="bg-white text-amber-800 px-2.5 py-1 rounded font-bold hover:bg-amber-50 transition ml-2 flex-shrink-0"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* 1. TOP ACCESSIBILITY & UTILITY BAR (Reference: agmarknet.gov.in/market-atlas) */}
      <TopUtilityBar
        textSize={textSize}
        setTextSize={setTextSize}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        language={language}
        setLanguage={setLanguage}
      />

      {/* 2. MAIN HEADER & RESPONSIVE NAVIGATION BAR */}
      <HeaderNav
        currentTab={activeTab}
        onSelectTab={(tab: string) => setActiveTab(tab as any)}
        language={language}
      />

      {/* 3. MAIN ACCESSIBLE CONTENT CONTAINER */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* HOMEPAGE DASHBOARD */}
        {activeTab === "home" && (
          <HomepageDashboard onNavigateToTab={(tab: any) => setActiveTab(tab)} language={language} />
        )}

        {/* AGMARKNET-STYLE INTERACTIVE MARKET ATLAS & MAP VIEW */}
        {activeTab === "atlas" && (
          <MarketAtlasView
            markets={markets}
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            selectedMarketId={selectedMarketId}
            setSelectedMarketId={setSelectedMarketId}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            onNavigateToTab={(tab: any) => setActiveTab(tab)}
            language={language}
          />
        )}

        {/* ABOUT US & CONTACT */}
        {activeTab === "about" && <AboutContactView language={language} />}

        {/* DEDICATED USER MANUAL (13 SECTIONS + EXPANDABLE FAQ) */}
        {activeTab === "manual" && <UserManualView language={language} />}

        {/* LIVE MARKET INTELLIGENCE ENGINE (PRESERVING ALL 7 EXISTING TABS & 37 APIS) */}
        {[
          "market",
          "forecast",
          "logistics",
          "marketplace",
          "advisory",
          "external",
          "krushimitra",
        ].includes(activeTab) && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header info bar for market tools */}
            <div className="bg-white p-4 rounded-xl border border-[#E2E5DC] shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-50 text-[#1F7A3D] rounded-lg border border-emerald-200">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-[#1A1F16]">Live APMC Market Intelligence Engine</h2>
                  <p className="text-xs text-[#5B6354]">Real-time forecasting, logistics optimizer, 7-pillar external data and waste-to-value calculator</p>
                </div>
              </div>

              {currentUser ? (
                <div className="flex items-center space-x-3 text-xs">
                  <div className="text-right">
                    <div className="font-semibold text-[#1A1F16]">{currentUser.name}</div>
                    <div className="text-[10px] uppercase font-bold text-[#1F7A3D]">{currentUser.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-1.5 text-[#5B6354] hover:text-[#B91C1C] rounded-lg transition"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="text-xs text-[#5B6354] flex items-center">
                  <UserIcon className="w-4 h-4 mr-1" /> Not logged in
                </div>
              )}
            </div>

            {/* Sub-Navigation Tabs for Market Intelligence */}
            <nav className="flex space-x-2 border-b border-[#E2E5DC] pb-2 overflow-x-auto" aria-label="Market Tools Navigation">
              {[
                { id: "market", label: "Mandi Prices & Alerts", icon: TrendingUp },
                { id: "forecast", label: "ML Forecast & Atlas", icon: Sparkles },
                { id: "logistics", label: "Logistics & Net Profit", icon: Truck },
                { id: "marketplace", label: "B2B Marketplace", icon: ShoppingBag },
                { id: "advisory", label: "Crop Advisory & MSP", icon: AlertTriangle },
                { id: "external", label: "External Data (7 Pillars)", icon: Globe },
                { id: "krushimitra", label: "KrushiMitra Value-Add & Scenarios", icon: Recycle },
              ].map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition whitespace-nowrap focus:outline-none ${
                      active
                        ? "bg-[#1F7A3D] text-white shadow-sm"
                        : "text-[#5B6354] hover:bg-white hover:text-[#1A1F16]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Global Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-[#E2E5DC] shadow-sm">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#1F7A3D]" />
                  <span className="text-xs text-[#5B6354]">APMC Yard:</span>
                  <select
                    value={selectedMarketId}
                    onChange={(e) => setSelectedMarketId(Number(e.target.value))}
                    className="font-medium bg-[#F7F8F5] border border-[#E2E5DC] rounded px-2 py-1 text-sm"
                  >
                    {markets.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.district})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#5B6354]">District:</span>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="font-medium bg-[#F7F8F5] border border-[#E2E5DC] rounded px-2 py-1 text-sm"
                  >
                    {ALL_DISTRICTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#5B6354]">Commodity:</span>
                  <select
                    value={selectedCrop}
                    onChange={(e) => setSelectedCrop(e.target.value)}
                    className="font-medium bg-[#F7F8F5] border border-[#E2E5DC] rounded px-2 py-1 text-sm capitalize"
                  >
                    {ALL_CROPS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs text-[#5B6354]">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ${
                    backendOnline === false
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200"
                  }`}
                >
                  ● {backendOnline === false ? "Offline Mode" : "Live API Connected"}
                </span>
                <button
                  onClick={loadTabData}
                  className="p-1.5 hover:bg-[#F7F8F5] rounded-md transition"
                  title="Refresh Data"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#1F7A3D]" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 1: MANDI PRICES & ALERTS */}
        {activeTab === "market" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-[#E2E5DC] shadow-sm">
                <div className="text-xs text-[#5B6354] uppercase font-bold tracking-wider">Latest Modal Price</div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-[#1F7A3D]">
                    ₹{prices?.points?.slice(-1)[0]?.modal_price?.toLocaleString() || "2,450"}
                  </span>
                  <span className="text-xs text-[#5B6354]">/ quintal</span>
                </div>
                <div className="mt-2 text-xs text-[#5B6354]">
                  Unit: INR/quintal (10 quintals = 1 Metric Tonne)
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E2E5DC] shadow-sm">
                <div className="text-xs text-[#5B6354] uppercase font-bold tracking-wider">Arrival Volume</div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-[#1A1F16]">
                    {prices?.points?.slice(-1)[0]?.arrivals_qtl?.toLocaleString() || "120"}
                  </span>
                  <span className="text-xs text-[#5B6354]">qtl today</span>
                </div>
                <div className="mt-2 text-xs text-[#5B6354]">Daily inbound APMC market stock</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-[#E2E5DC] shadow-sm">
                <div className="text-xs text-[#5B6354] uppercase font-bold tracking-wider">Active Hike Alerts</div>
                <div className="mt-2 flex items-baseline space-x-2">
                  <span className="text-3xl font-extrabold text-[#B45309]">{alerts.length}</span>
                  <span className="text-xs text-[#5B6354]">districts flagged</span>
                </div>
                <div className="mt-2 text-xs text-[#5B6354]">Based on &gt;1.5σ historical threshold detection</div>
              </div>
            </div>

            {/* Price Hike Alerts Table */}
            <div className="bg-white rounded-xl border border-[#E2E5DC] shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E2E5DC] flex items-center justify-between">
                <h3 className="font-bold text-base flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-[#B45309]" />
                  <span>District Price Hike Alerts (Part 2 Intelligence)</span>
                </h3>
                <span className="text-xs text-[#5B6354]">Threshold: &gt;15% Red, 5-15% Amber</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F7F8F5] text-xs uppercase text-[#5B6354] border-b border-[#E2E5DC]">
                    <tr>
                      <th className="px-6 py-3 font-semibold">District</th>
                      <th className="px-6 py-3 font-semibold">Current Price</th>
                      <th className="px-6 py-3 font-semibold">Forecast (7d)</th>
                      <th className="px-6 py-3 font-semibold">Change %</th>
                      <th className="px-6 py-3 font-semibold">Level</th>
                      <th className="px-6 py-3 font-semibold">Spike Signal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E5DC]">
                    {alerts.map((a, i) => (
                      <tr key={i} className="hover:bg-[#F7F8F5]/60 transition">
                        <td className="px-6 py-4 font-medium">{a.district}</td>
                        <td className="px-6 py-4">₹{a.current_price.toLocaleString()}</td>
                        <td className="px-6 py-4 font-semibold text-[#1F7A3D]">₹{a.predicted_price.toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold">
                          {a.pct_change > 0 ? `+${a.pct_change}%` : `${a.pct_change}%`}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                              a.level === "red"
                                ? "bg-red-100 text-red-800"
                                : a.level === "amber"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {a.level}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {a.is_statistical_spike ? (
                            <span className="text-xs text-red-700 font-bold flex items-center">
                              <ShieldAlert className="w-4 h-4 mr-1 text-red-600" /> &gt;1.5σ Abnormal
                            </span>
                          ) : (
                            <span className="text-xs text-[#5B6354]">Normal range</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {alerts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-6 py-8 text-center text-[#5B6354]">
                          No statistical price hike alerts active for {selectedCrop}.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ML FORECAST & ATLAS */}
        {activeTab === "forecast" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold flex items-center space-x-2">
                    <Sparkles className="w-5 h-5 text-[#1F7A3D]" />
                    <span>Multi-Step Modal Price Forecast with Confidence Interval</span>
                  </h3>
                  <p className="text-xs text-[#5B6354] mt-0.5">
                    Model: {forecast?.model_name || "ridge_lag_model"} • Horizon: {forecast?.horizon_days || 7} days
                  </p>
                </div>
                {forecast?.metrics && (
                  <div className="text-right text-xs bg-[#F7F8F5] p-2 rounded-lg border border-[#E2E5DC]">
                    <div className="font-bold text-[#1F7A3D]">Beats Baseline: {forecast.metrics.beats_baseline ? "YES" : "NO"}</div>
                    <div className="text-[#5B6354]">MAPE: {forecast.metrics.mape}% (Baseline: {forecast.metrics.baseline_mape}%)</div>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F7F8F5] text-xs uppercase text-[#5B6354]">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Target Date</th>
                      <th className="px-4 py-2 font-semibold">Lower Band (90%)</th>
                      <th className="px-4 py-2 font-semibold">Predicted Price</th>
                      <th className="px-4 py-2 font-semibold">Upper Band (90%)</th>
                      <th className="px-4 py-2 font-semibold">Visual Interval</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E5DC]">
                    {forecast?.points?.map((pt, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3 font-medium">{pt.target_date}</td>
                        <td className="px-4 py-3 text-[#5B6354]">₹{pt.lower.toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-[#1F7A3D]">₹{pt.predicted.toLocaleString()}</td>
                        <td className="px-4 py-3 text-[#5B6354]">₹{pt.upper.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="w-48 bg-gray-200 h-2.5 rounded-full overflow-hidden flex items-center">
                            <div
                              className="bg-[#1F7A3D] h-full rounded-full"
                              style={{ width: `${Math.min(100, (pt.predicted / 4000) * 100)}%` }}
                            ></div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* District Atlas Overview */}
            <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
              <h3 className="font-bold text-base flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-[#1F7A3D]" />
                <span>Karnataka District Atlas Outlook (Pillar 5 & 11)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {atlas?.districts?.map((d) => (
                  <div key={d.district_id} className="p-4 rounded-xl border border-[#E2E5DC] bg-[#F7F8F5]/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{d.district}</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          d.outlook === "rising"
                            ? "bg-emerald-100 text-emerald-800"
                            : d.outlook === "falling"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {d.outlook}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between text-xs text-[#5B6354]">
                      <span>Projected Change:</span>
                      <span className="font-bold text-[#1A1F16]">
                        {d.predicted_change_pct ? `${d.predicted_change_pct}%` : "0%"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: LOGISTICS OPTIMIZER (ORIGIN -> DESTINATION TRAVEL OVER ALL 20 APMCS) */}
        {activeTab === "logistics" && (
          <LogisticsOptimizerView
            markets={markets}
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            language={language}
            onNavigateToTab={(tab: string) => setActiveTab(tab as any)}
          />
        )}

        {/* TAB 4: B2B WHOLESALE MARKETPLACE (OWNER DETAILS, DIRECT WHATSAPP/PHONE, BUY/NEGOTIATE/SPECS) */}
        {activeTab === "marketplace" && (
          <B2BMarketplaceView
            listings={listings}
            currentUser={currentUser}
            selectedCrop={selectedCrop}
            setSelectedCrop={setSelectedCrop}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
            markets={markets}
            language={language}
            onListingCreated={loadTabData}
            onLogin={handleMarketplaceLogin}
            onRegister={handleMarketplaceRegister}
            onCreateListing={handleMarketplaceCreateListing}
          />
        )}

        {/* TAB 5: ADVISORY & MSP */}
        {activeTab === "advisory" && (
          <div className="space-y-6">
            {advisory && (
              <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5 text-[#B45309]" />
                    <span>Statutory MSP & Price Benchmark Advisory</span>
                  </h3>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    Climate: {advisory.climate_signal}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-[#F7F8F5] p-4 rounded-xl">
                    <div className="text-xs text-[#5B6354]">Statutory MSP Floor</div>
                    <div className="text-2xl font-extrabold text-[#1F7A3D]">
                      {advisory.msp_applicable && advisory.msp_inr_per_qtl
                        ? `₹${advisory.msp_inr_per_qtl.toLocaleString()}`
                        : "N/A (Non-MSP Crop)"}
                    </div>
                  </div>
                  <div className="bg-[#F7F8F5] p-4 rounded-xl">
                    <div className="text-xs text-[#5B6354]">Prevailing APMC Price</div>
                    <div className="text-2xl font-extrabold text-[#1A1F16]">
                      ₹{advisory.market_price?.toLocaleString() || "2,400"}
                    </div>
                  </div>
                  <div className="bg-[#F7F8F5] p-4 rounded-xl">
                    <div className="text-xs text-[#5B6354]">Cost Pressure Proxy</div>
                    <div className="text-2xl font-extrabold text-[#B45309]">
                      +{advisory.cost_pressure_pct}%
                    </div>
                  </div>
                </div>
                <p className="text-sm bg-emerald-50 text-emerald-900 border border-emerald-200 p-3 rounded-lg font-medium mt-3">
                  {advisory.advisory}
                </p>
              </div>
            )}

            {recommendations && (
              <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
                <h3 className="font-bold text-base flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#1F7A3D]" />
                  <span>Season-Ahead Crop Suitability Scoring ({recommendations.district})</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recommendations.items.map((item) => (
                    <div key={item.crop} className="border border-[#E2E5DC] p-5 rounded-xl bg-[#F7F8F5]/40 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-base capitalize">{item.crop}</span>
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-[#1F7A3D] text-white">
                          Score: {item.score}/10
                        </span>
                      </div>
                      <ul className="text-xs text-[#5B6354] space-y-1 list-disc pl-4 pt-1">
                        {item.rationale.map((r, i) => (
                          <li key={i}>{r}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 6: MULTI-SOURCE EXTERNAL DATA (7 PILLARS) & REAL-TIME COMPARISON */}
        {activeTab === "external" && (
          <DataAnalysisComparisonView
            language={language}
            selectedCrop={selectedCrop}
            selectedDistrict={selectedDistrict}
            onCropChange={setSelectedCrop}
            onDistrictChange={setSelectedDistrict}
            currentPrevailingPrice={prices?.points?.[prices.points.length - 1]?.modal_price || 2450}
          />
        )}

        {/* TAB 7: KRUSHIMITRA VALUE-ADD & STRESS SCENARIOS */}
        {activeTab === "krushimitra" && (
          <div className="space-y-6">
            {/* KrushiMitra Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-6 rounded-2xl shadow-md">
              <div className="flex items-center space-x-3">
                <Recycle className="w-8 h-8 text-emerald-300" />
                <div>
                  <h2 className="text-xl font-bold">KrushiMitra Intelligence System (ಕೃಷಿಮಿತ್ರ ಸಂಸ್ಕರಣೆ & ಮುನ್ಸೂಚನೆ)</h2>
                  <p className="text-xs text-emerald-100 mt-1">
                    Waste-to-Value secondary processing multipliers (up to 6.2x ROI), 3-way statistical stress scenarios, and bilingual farmer advisories.
                  </p>
                </div>
              </div>
            </div>

            {/* SECTION 1: WASTE-TO-VALUE CALCULATOR */}
            <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E5DC] pb-4">
                <div>
                  <h3 className="font-bold text-base flex items-center space-x-2">
                    <Recycle className="w-5 h-5 text-emerald-600" />
                    <span>Waste-to-Value Processing Calculator (ಮೌಲ್ಯವರ್ಧನೆ ಲೆಕ್ಕಾಚಾರ)</span>
                  </h3>
                  <p className="text-xs text-[#5B6354] mt-0.5">
                    Prevent distress selling when crops are damaged, surplus, or facing mandi price crashes.
                  </p>
                </div>

                {/* Calculator Inputs */}
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <div>
                    <label className="text-[#5B6354] block mb-1">Crop Condition:</label>
                    <div className="inline-flex rounded-lg border border-[#E2E5DC] p-0.5 bg-[#F7F8F5]">
                      {[
                        { id: "damaged", label: "Damaged (ಹಾಳಾದ)" },
                        { id: "price_crash", label: "Price Crash (ಕುಸಿತ)" },
                        { id: "surplus", label: "Surplus (ಹೆಚ್ಚುವರಿ)" },
                      ].map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setKrushiCondition(c.id as any)}
                          className={`px-3 py-1.5 rounded-md font-semibold transition ${
                            krushiCondition === c.id
                              ? "bg-[#1F7A3D] text-white"
                              : "text-[#5B6354] hover:text-[#1A1F16]"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[#5B6354] block mb-1">Raw Qty (kg):</label>
                    <input
                      type="number"
                      value={krushiQty}
                      onChange={(e) => setKrushiQty(Math.max(10, Number(e.target.value)))}
                      className="w-24 px-2 py-1.5 border border-[#E2E5DC] rounded bg-[#F7F8F5] text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[#5B6354] block mb-1">Origin Town:</label>
                    <select
                      value={krushiTown}
                      onChange={(e) => setKrushiTown(e.target.value)}
                      className="px-2 py-1.5 border border-[#E2E5DC] rounded bg-[#F7F8F5] text-xs font-semibold"
                    >
                      <option value="CHIK">Chikkaballapur (ಚಿಕ್ಕಬಳ್ಳಾಪುರ)</option>
                      <option value="TUM">Tumakuru (ತುಮಕೂರು)</option>
                      <option value="HAS">Hassan (ಹಾಸನ)</option>
                      <option value="CHIT">Chitradurga (ಚಿತ್ರದುರ್ಗ)</option>
                      <option value="GAD">Gadag (ಗದಗ)</option>
                      <option value="HAV">Haveri (ಹಾವೇರಿ)</option>
                      <option value="MAN">Mandya (ಮಂಡ್ಯ)</option>
                      <option value="RAM">Ramanagara (ರಾಮನಗರ)</option>
                      <option value="BEL">Belagavi (ಬೆಳಗಾವಿ)</option>
                      <option value="DAV">Davanagere (ದಾವಣಗೆರೆ)</option>
                      <option value="MUL">Mulbagal (ಮುಳಬಾಗಿಲು)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Economic Summary Banner */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-emerald-50/60 border border-emerald-200 p-4 rounded-xl">
                <div>
                  <div className="text-[11px] text-[#5B6354] font-semibold">Raw Distress Sale Price</div>
                  <div className="text-xl font-bold text-red-700">₹{wasteData?.distress_raw_price_per_kg || 6}/kg</div>
                  <div className="text-[11px] text-[#5B6354]">Total: ₹{wasteData?.distress_raw_total_inr?.toLocaleString() || "3,000"}</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#5B6354] font-semibold">Processed Gross Realization</div>
                  <div className="text-xl font-bold text-[#1F7A3D]">
                    ₹{wasteData?.value_products?.[0]?.gross_revenue_inr?.toLocaleString() || "16,100"}
                  </div>
                  <div className="text-[11px] text-emerald-800 font-semibold">
                    via {wasteData?.value_products?.[0]?.productEn || "Tomato Paste"}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-[#5B6354] font-semibold">Net Profit Advantage</div>
                  <div className="text-xl font-extrabold text-[#1F7A3D]">
                    +₹{wasteData?.value_products?.[0]?.net_advantage_inr?.toLocaleString() || "9,100"}
                  </div>
                  <div className="text-[11px] text-[#5B6354]">After all processing investments</div>
                </div>
                <div>
                  <div className="text-[11px] text-[#5B6354] font-semibold">Peak Revenue Multiplier</div>
                  <div className="text-2xl font-extrabold text-amber-700">
                    {wasteData?.value_products?.[wasteData.value_products.length - 1]?.effective_revenue_multiple || 6.2}x
                  </div>
                  <div className="text-[11px] text-[#5B6354]">vs selling raw at distress</div>
                </div>
              </div>

              {/* Product Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {wasteData?.value_products?.map((p: any) => (
                  <div key={p.id} className="border border-[#E2E5DC] rounded-xl p-4 bg-[#F7F8F5]/40 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-[#1A1F16]">{p.productEn}</h4>
                        <div className="text-xs text-[#5B6354] font-medium">{p.productKn}</div>
                      </div>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {p.effective_revenue_multiple}x ROI
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-b border-[#E2E5DC] py-2">
                      <div>
                        <span className="text-[#5B6354]">Yield (from {krushiQty}kg):</span>
                        <div className="font-bold text-[#1A1F16]">{p.produced_qty_kg} kg</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[#5B6354]">Sell Price:</span>
                        <div className="font-bold text-[#1F7A3D]">₹{p.sellPricePerKg}/kg</div>
                      </div>
                      <div>
                        <span className="text-[#5B6354]">Net Gain:</span>
                        <div className="font-bold text-emerald-700">+₹{p.net_advantage_inr?.toLocaleString()}</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[#5B6354]">Shelf Life:</span>
                        <div className="font-semibold text-[#1A1F16]">{p.shelfLifeEn}</div>
                      </div>
                    </div>

                    <div className="text-[11px] text-[#5B6354] space-y-1">
                      <div className="font-semibold text-[#1A1F16]">Preparation Process (ವಿಧಾನ):</div>
                      <ul className="list-disc pl-4 space-y-0.5">
                        {p.stepsEn?.slice(0, 3).map((st: string, idx: number) => (
                          <li key={idx}>{st}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nearest Certified Processing Clusters */}
              <div className="pt-4 border-t border-[#E2E5DC] space-y-3">
                <h4 className="font-bold text-sm flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#1F7A3D]" />
                  <span>Nearest Certified Food Processing Clusters (ಸಮೀಪದ ಸಂಸ್ಕರಣಾ ಘಟಕಗಳು)</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {wasteData?.nearest_processing_clusters?.map((u: any) => (
                    <div key={u.id} className="p-3 rounded-lg border border-[#E2E5DC] bg-white space-y-1.5 text-xs">
                      <div className="font-bold text-[#1A1F16]">{u.name}</div>
                      <div className="text-[#5B6354]">{u.districtEn} ({u.districtKn})</div>
                      <div className="font-bold text-emerald-800">{u.distance_km} km road distance</div>
                      <div className="text-[11px] text-[#5B6354]">Handles: {u.handlesEn}</div>
                      <div className="pt-1">
                        <a
                          href={`tel:${u.phone}`}
                          className="inline-flex items-center text-[#1F7A3D] font-bold hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5 mr-1" /> {u.phone}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 2: STATISTICAL CROSS-CORRELATION & STRESS SCENARIOS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 3-Way Trajectories */}
              <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-indigo-600" />
                    <span>3-Way Trajectory Projections (14 Days)</span>
                  </h3>
                  <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
                    Rainfall Cross-Correlation: r={crossData?.rainfall_price_correlation_r || 0.68}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                    <div className="text-[10px] text-emerald-800 font-bold uppercase">Optimistic Scenario</div>
                    <div className="text-lg font-extrabold text-[#1F7A3D] mt-1">
                      ₹{crossData?.trajectories_14d?.optimistic_modal_inr?.toLocaleString() || "2,989"}
                    </div>
                    <div className="text-[10px] text-[#5B6354]">/ quintal (+22%)</div>
                  </div>

                  <div className="bg-[#F7F8F5] border border-[#E2E5DC] p-3 rounded-lg">
                    <div className="text-[10px] text-[#5B6354] font-bold uppercase">Likely Base Trajectory</div>
                    <div className="text-lg font-extrabold text-[#1A1F16] mt-1">
                      ₹{crossData?.trajectories_14d?.likely_modal_inr?.toLocaleString() || "2,572"}
                    </div>
                    <div className="text-[10px] text-[#5B6354]">/ quintal (+5%)</div>
                  </div>

                  <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
                    <div className="text-[10px] text-red-800 font-bold uppercase">Pessimistic Scenario</div>
                    <div className="text-lg font-extrabold text-red-700 mt-1">
                      ₹{crossData?.trajectories_14d?.pessimistic_modal_inr?.toLocaleString() || "2,156"}
                    </div>
                    <div className="text-[10px] text-[#5B6354]">/ quintal (-12%)</div>
                  </div>
                </div>

                {/* 4 What-If Scenarios */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-[#5B6354] uppercase">Dynamic Stress Testing Scenarios:</div>
                  {crossData?.what_if_scenarios?.map((w: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-lg bg-[#F7F8F5] border border-[#E2E5DC] space-y-1 text-xs">
                      <div className="flex items-center justify-between font-bold">
                        <span>{w.scenario} ({w.scenario_kn})</span>
                        <span className={w.price_impact_pct > 0 ? "text-[#1F7A3D]" : "text-red-700"}>
                          {w.price_impact_pct > 0 ? `+${w.price_impact_pct}%` : `${w.price_impact_pct}%`} (₹{w.projected_price_qtl}/qtl)
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5B6354]">{w.driver}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bilingual News & Sentiment Feed */}
              <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base flex items-center space-x-2">
                    <Newspaper className="w-5 h-5 text-amber-600" />
                    <span>Market News & Sentiment Signals (ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ಸುದ್ದಿ)</span>
                  </h3>
                  <span className="text-xs text-[#5B6354]">Real-time Sentiment Tagging</span>
                </div>

                <div className="space-y-3">
                  {newsData?.map((item) => (
                    <div key={item.id} className="p-3.5 rounded-lg border border-[#E2E5DC] bg-[#F7F8F5]/50 space-y-2 text-xs">
                      <div className="flex items-start justify-between">
                        <div className="font-bold text-sm text-[#1A1F16]">{item.title}</div>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ml-2 flex-shrink-0 ${
                            item.sentiment === "positive"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.sentiment === "negative"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.sentiment}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#5B6354]">
                        Source: {item.source} • {item.publishedAt}
                      </div>
                      <div className="bg-white p-2.5 rounded border border-[#E2E5DC] text-[11px] space-y-1">
                        <div className="text-emerald-900 font-semibold">{item.impactEn}</div>
                        <div className="text-[#5B6354]">{item.impactKn}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: BILINGUAL AI FARMER ADVISOR CHATBOT */}
            <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5 text-[#1F7A3D]" />
                    <span>Bilingual Farmer AI Advisor (ಕೃಷಿಮಿತ್ರ ಸಂವಾದ - ಕನ್ನಡ & English)</span>
                  </h3>
                  <p className="text-xs text-[#5B6354] mt-0.5">
                    Ask natural questions in Kannada or English about market prices, transport optimization, or waste management.
                  </p>
                </div>
              </div>

              {/* Quick Prompt Pills */}
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  "ಟೊಮೇಟೊ ಬೆಲೆ ಎಷ್ಟಿದೆ?",
                  "ಹಾಳಾದ ಹಣ್ಣುಗಳನ್ನು ಮೌಲ್ಯವರ್ಧನೆ ಹೇಗೆ ಮಾಡುವುದು?",
                  "Which mandi gives best profit for tomato?",
                  "How to avoid distress sale?",
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setChatInput(prompt);
                    }}
                    className="px-3 py-1 bg-[#F7F8F5] border border-[#E2E5DC] rounded-full text-xs hover:border-[#1F7A3D] text-[#1A1F16] transition"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Chat Message Box */}
              <div className="border border-[#E2E5DC] rounded-xl p-4 bg-[#F7F8F5]/40 max-h-80 overflow-y-auto space-y-3 text-sm">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-xl px-4 py-2.5 text-xs ${
                        msg.role === "user"
                          ? "bg-[#1F7A3D] text-white"
                          : "bg-white border border-[#E2E5DC] text-[#1A1F16] shadow-sm whitespace-pre-wrap"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-[#E2E5DC] px-4 py-2 rounded-xl text-xs text-[#5B6354] animate-pulse">
                      ಕೃಷಿಮಿತ್ರ ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ... (Analyzing agricultural intelligence...)
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="ಪ್ರಶ್ನೆ ಕೇಳಿ / Ask your question in Kannada or English..."
                  className="flex-1 px-4 py-2.5 border border-[#E2E5DC] rounded-xl text-xs bg-[#F7F8F5] focus:outline-none focus:border-[#1F7A3D]"
                />
                <button
                  type="submit"
                  disabled={chatLoading}
                  className="px-5 py-2.5 bg-[#1F7A3D] text-white rounded-xl text-xs font-semibold hover:bg-emerald-800 transition flex items-center space-x-1"
                >
                  <Send className="w-3.5 h-3.5 mr-1" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* 4. ACCESSIBLE FOOTER WITH DIRECTORY & BACK TO TOP */}
      <Footer onNavigateToTab={setActiveTab} language={language} />
    </div>
  );
}
