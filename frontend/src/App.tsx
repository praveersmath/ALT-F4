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
  CheckCircle,
  ShieldAlert,
  Globe,
  CloudRain,
  Activity,
  Recycle,
  MessageSquare,
  Newspaper,
  Phone,
  Send,
  ExternalLink,
  ShieldCheck,
  Sprout,
  Bug,
  Building,
  Database,
  Layers,
  Droplets,
  Sun,
  ArrowUpRight,
} from "lucide-react";
import { api } from "./api";
import type {
  Atlas,
  BestMarket,
  CropRecommendations,
  Forecast,
  HikeAlert,
  Listing,
  MarketInfo,
  MspAdvisory,
  PriceSeries,
  TransportCost,
  UserPublic,
} from "./contracts/types";

// Fallback markets ensuring UI is never broken even prior to backend connection
const DEFAULT_MARKETS: MarketInfo[] = [
  { id: 1, name: "Bengaluru (Binny Mill)", district: "Bengaluru Urban", state: "karnataka", lat: 12.9716, lon: 77.5946, coords_estimated: false },
  { id: 2, name: "Kolar Mandi", district: "Kolar", state: "karnataka", lat: 13.1367, lon: 78.1291, coords_estimated: false },
  { id: 3, name: "Hubballi APMC", district: "Dharwad", state: "karnataka", lat: 15.3647, lon: 75.1240, coords_estimated: false },
  { id: 4, name: "Belagavi APMC", district: "Belagavi", state: "karnataka", lat: 15.8497, lon: 74.4977, coords_estimated: false },
  { id: 5, name: "Mysuru Bandipalya", district: "Mysuru", state: "karnataka", lat: 12.2958, lon: 76.6394, coords_estimated: false },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "market" | "forecast" | "logistics" | "marketplace" | "advisory" | "external" | "krushimitra"
  >("market");
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
  const [bestMarket, setBestMarket] = useState<BestMarket | null>(null);
  const [transportCost, setTransportCost] = useState<TransportCost | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [advisory, setAdvisory] = useState<MspAdvisory | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendations | null>(null);
  const [externalData, setExternalData] = useState<any | null>(null);

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

  // Auth form states
  const [authEmail, setAuthEmail] = useState("farmer1@agriintel.in");
  const [authPassword, setAuthPassword] = useState("Password123!");
  const [authRole] = useState<"farmer" | "wholesaler" | "retailer">("farmer");
  const [authName] = useState("Basavaraj Patil");

  // Listing form states
  const [listQuantity, setListQuantity] = useState<number>(15);
  const [listPrice, setListPrice] = useState<number>(2400);

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
        const [bestRes, costRes] = await Promise.all([
          api.getBestMarket(selectedCrop, 12.9716, 77.5946, 20).catch(() => null),
          api.getTransportCost(selectedMarketId, selectedCrop, 20, 12.9716, 77.5946).catch(() => null),
        ]);
        if (bestRes) {
          setBestMarket(bestRes.data);
          setBackendOnline(true);
        }
        if (costRes) setTransportCost(costRes.data);
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
          setExternalData(extRes.data);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.login({ email: authEmail, password: authPassword });
      localStorage.setItem("agriintel_token", res.data.access_token);
      await checkAuth();
    } catch (err: any) {
      alert(`Login failed: ${err.message}`);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.register({
        name: authName,
        email: authEmail,
        password: authPassword,
        role: authRole,
        district: selectedDistrict,
      });
      const loginRes = await api.login({ email: authEmail, password: authPassword });
      localStorage.setItem("agriintel_token", loginRes.data.access_token);
      await checkAuth();
    } catch (err: any) {
      alert(`Registration failed: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("agriintel_token");
    setCurrentUser(null);
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      alert("Please login first to create a trade listing.");
      return;
    }
    try {
      await api.createListing({
        crop: selectedCrop,
        quantity_qtl: listQuantity,
        asking_price_per_qtl: listPrice,
        district: selectedDistrict,
        market_id: selectedMarketId,
      });
      alert("Listing published successfully with automated price-check!");
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

      {/* Top Navbar */}
      <header className="bg-white border-b border-[#E2E5DC] sticky top-0 z-50 px-4 lg:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-[#1F7A3D] flex items-center justify-center text-white font-bold text-xl shadow">
              AI
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#1A1F16]">AgriIntel Karnataka</h1>
              <p className="text-xs text-[#5B6354]">APMC Supply Chain & Intelligence System</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-[#F7F8F5] px-3 py-1.5 rounded-lg border border-[#E2E5DC] text-sm">
              <span className="text-xs font-semibold text-[#5B6354]">CROP:</span>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="bg-transparent font-medium text-[#1A1F16] focus:outline-none capitalize"
              >
                <option value="tomato">Tomato</option>
                <option value="onion">Onion</option>
                <option value="wheat">Wheat</option>
              </select>
            </div>

            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-xs font-semibold">{currentUser.name}</div>
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
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Navigation Tabs */}
        <nav className="flex space-x-2 border-b border-[#E2E5DC] pb-2 overflow-x-auto">
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
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition whitespace-nowrap ${
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

        {/* Global Controls & Freshness Banner */}
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
                <option value="Bengaluru Urban">Bengaluru Urban</option>
                <option value="Kolar">Kolar</option>
                <option value="Belagavi">Belagavi</option>
                <option value="Mysuru">Mysuru</option>
                <option value="Davanagere">Davanagere</option>
                <option value="Dharwad">Dharwad</option>
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

        {/* TAB 3: LOGISTICS & NET PROFIT */}
        {activeTab === "logistics" && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold flex items-center space-x-2">
                    <Truck className="w-5 h-5 text-[#1F7A3D]" />
                    <span>Best Net-Profit Mandi Finder (Part 3 Algorithm)</span>
                  </h3>
                  <p className="text-xs text-[#5B6354]">
                    Ranked by: Modal Price minus Itemized Transport & Toll Cost per Quintal
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#F7F8F5] text-xs uppercase text-[#5B6354]">
                    <tr>
                      <th className="px-4 py-2 font-semibold">Rank</th>
                      <th className="px-4 py-2 font-semibold">Market Name</th>
                      <th className="px-4 py-2 font-semibold">Distance</th>
                      <th className="px-4 py-2 font-semibold">APMC Price</th>
                      <th className="px-4 py-2 font-semibold">Transport/qtl</th>
                      <th className="px-4 py-2 font-semibold">Net Realization</th>
                      <th className="px-4 py-2 font-semibold">Weather Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E5DC]">
                    {bestMarket?.options?.map((opt) => (
                      <tr key={opt.market_id} className={opt.rank === 1 ? "bg-emerald-50/50" : ""}>
                        <td className="px-4 py-3 font-bold text-[#1F7A3D]">#{opt.rank}</td>
                        <td className="px-4 py-3 font-medium">
                          {opt.market} ({opt.district})
                        </td>
                        <td className="px-4 py-3 text-[#5B6354]">{opt.distance_km} km</td>
                        <td className="px-4 py-3">₹{opt.predicted_price.toLocaleString()}</td>
                        <td className="px-4 py-3 text-red-700">-₹{opt.transport_cost_per_qtl}</td>
                        <td className="px-4 py-3 font-extrabold text-[#1F7A3D]">
                          ₹{opt.net_price_per_qtl.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold uppercase ${
                              opt.weather_risk === "high"
                                ? "bg-red-100 text-red-800"
                                : opt.weather_risk === "medium"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {opt.weather_risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {transportCost && (
              <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
                <h4 className="font-bold text-sm uppercase tracking-wider text-[#5B6354]">
                  Itemized Freight & Cost Breakdown (To Selected Mandi)
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                  <div className="bg-[#F7F8F5] p-3 rounded-lg">
                    <div className="text-[11px] text-[#5B6354]">Road Distance</div>
                    <div className="text-base font-bold">{transportCost.distance_km} km</div>
                  </div>
                  <div className="bg-[#F7F8F5] p-3 rounded-lg">
                    <div className="text-[11px] text-[#5B6354]">Base Freight</div>
                    <div className="text-base font-bold">₹{transportCost.freight}</div>
                  </div>
                  <div className="bg-[#F7F8F5] p-3 rounded-lg">
                    <div className="text-[11px] text-[#5B6354]">Toll Plazas</div>
                    <div className="text-base font-bold">₹{transportCost.toll}</div>
                  </div>
                  <div className="bg-[#F7F8F5] p-3 rounded-lg">
                    <div className="text-[11px] text-[#5B6354]">Handling Fee</div>
                    <div className="text-base font-bold">₹{transportCost.loading_unloading}</div>
                  </div>
                  <div className="bg-[#F7F8F5] p-3 rounded-lg">
                    <div className="text-[11px] text-[#5B6354]">Transit Spoilage</div>
                    <div className="text-base font-bold">₹{transportCost.spoilage}</div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
                    <div className="text-[11px] text-emerald-800 font-semibold">Total Cost/qtl</div>
                    <div className="text-base font-extrabold text-[#1F7A3D]">₹{transportCost.per_quintal}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: B2B MARKETPLACE */}
        {activeTab === "marketplace" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
              <h3 className="font-bold text-base flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-[#1F7A3D]" />
                <span>Post Trade Listing</span>
              </h3>
              <p className="text-xs text-[#5B6354]">
                Direct producer-to-buyer listing with automated fair-price validation.
              </p>

              {currentUser ? (
                <form onSubmit={handleCreateListing} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-[#5B6354]">Quantity (Quintals)</label>
                    <input
                      type="number"
                      value={listQuantity}
                      onChange={(e) => setListQuantity(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 border border-[#E2E5DC] rounded-lg text-sm bg-[#F7F8F5]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#5B6354]">Asking Price (₹/Quintal)</label>
                    <input
                      type="number"
                      value={listPrice}
                      onChange={(e) => setListPrice(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 border border-[#E2E5DC] rounded-lg text-sm bg-[#F7F8F5]"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1F7A3D] text-white rounded-lg text-sm font-semibold hover:bg-emerald-800 transition"
                  >
                    Publish Listing
                  </button>
                </form>
              ) : (
                <div className="space-y-4 bg-[#F7F8F5] p-4 rounded-xl border border-[#E2E5DC]">
                  <div className="text-xs font-bold uppercase text-[#5B6354]">Quick Login / Demo Account</div>
                  <form onSubmit={handleLogin} className="space-y-2">
                    <input
                      type="email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full px-3 py-1.5 border border-[#E2E5DC] rounded text-xs bg-white"
                      required
                    />
                    <input
                      type="password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-3 py-1.5 border border-[#E2E5DC] rounded text-xs bg-white"
                      required
                    />
                    <button
                      type="submit"
                      className="w-full py-2 bg-[#1F7A3D] text-white rounded text-xs font-semibold"
                    >
                      Login to Post
                    </button>
                    <button
                      type="button"
                      onClick={handleRegister}
                      className="w-full py-1.5 bg-white border border-[#E2E5DC] text-[#1A1F16] rounded text-xs"
                    >
                      Register Demo Farmer
                    </button>
                  </form>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-bold text-base">Active APMC Market Listings ({listings.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listings.map((l) => (
                  <div key={l.id} className="bg-white p-5 rounded-xl border border-[#E2E5DC] shadow-sm space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-bold capitalize">{l.crop}</div>
                        <div className="text-xs text-[#5B6354]">
                          {l.district} • Owner: {l.owner.name}
                        </div>
                      </div>
                      <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {l.status}
                      </span>
                    </div>

                    <div className="flex items-baseline justify-between border-t border-b border-[#E2E5DC] py-2">
                      <div>
                        <div className="text-[10px] text-[#5B6354]">Quantity</div>
                        <div className="text-base font-bold">{l.quantity_qtl} qtl</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-[#5B6354]">Asking Price</div>
                        <div className="text-base font-extrabold text-[#1F7A3D]">
                          ₹{l.asking_price_per_qtl.toLocaleString()}/qtl
                        </div>
                      </div>
                    </div>

                    <div className="text-xs bg-[#F7F8F5] p-2.5 rounded-lg border border-[#E2E5DC] space-y-1">
                      <div className="flex items-center space-x-1 font-semibold">
                        <CheckCircle className="w-3.5 h-3.5 text-[#1F7A3D]" />
                        <span>Price Verdict: {l.price_check?.verdict}</span>
                      </div>
                      <p className="text-[11px] text-[#5B6354]">{l.price_check?.note}</p>
                    </div>
                  </div>
                ))}
                {listings.length === 0 && (
                  <div className="col-span-2 bg-white p-8 text-center text-[#5B6354] rounded-xl border border-[#E2E5DC]">
                    No listings found. Post the first one!
                  </div>
                )}
              </div>
            </div>
          </div>
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

        {/* TAB 6: MULTI-SOURCE EXTERNAL DATA (7 PILLARS) */}
        {activeTab === "external" && (
          <div className="space-y-6">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-[#1F7A3D] via-[#165a2d] to-[#0f3d1f] text-white p-6 rounded-2xl shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                    <Globe className="w-8 h-8 text-emerald-300" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Multi-Source Real-Time Intelligence (7 Pillars)</h2>
                    <p className="text-xs text-emerald-100 mt-1">
                      Comprehensive cross-comparison synthesizing IMD, NASA, OpenWeatherMap, DES Agri, FAOSTAT, AGMARKNET, Google Earth Engine, ISRIC SoilGrids, Soil Health Card, CABI Plantwise, FCI, and NABARD.
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-lg text-xs font-medium self-start md:self-auto">
                  <Database className="w-4 h-4 text-emerald-300" />
                  <span>District: <strong className="text-white">{selectedDistrict}</strong> | Crop: <strong className="text-white capitalize">{selectedCrop}</strong></span>
                </div>
              </div>
            </div>

            {/* Official External Portals Direct Access Ribbon */}
            <div className="bg-white p-4 rounded-xl border border-[#E2E5DC] shadow-sm space-y-2">
              <div className="text-xs font-bold text-[#5B6354] uppercase tracking-wide flex items-center space-x-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-[#1F7A3D]" />
                <span>Verified Government & Global Agriculture Portals Directory</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { name: "IMD Weather", url: "https://api.imd.gov.in/public/", cat: "Weather" },
                  { name: "NASA POWER", url: "https://power.larc.nasa.gov/", cat: "Weather" },
                  { name: "OpenWeatherMap", url: "https://openweathermap.org/api", cat: "Weather" },
                  { name: "data.gov.in APY", url: "https://www.data.gov.in/", cat: "Production" },
                  { name: "DES Agri (MoA)", url: "https://desagri.gov.in/", cat: "Production" },
                  { name: "FAOSTAT", url: "https://www.fao.org/faostat/", cat: "Global" },
                  { name: "AGMARKNET", url: "https://agmarknet.gov.in/", cat: "Mandi" },
                  { name: "Google Earth Engine", url: "https://earthengine.google.com/", cat: "Satellite" },
                  { name: "ISRIC SoilGrids", url: "https://isric.org/explore/soilgrids/", cat: "Soil" },
                  { name: "Soil Health Card", url: "https://soilhealth.dac.gov.in/", cat: "Soil" },
                  { name: "CABI Plantwise", url: "https://www.cabi.org/projects/plantwise/", cat: "Pest" },
                  { name: "FCI Food Grain", url: "https://fci.gov.in/", cat: "Supply" },
                  { name: "NABARD", url: "https://www.nabard.org/", cat: "Finance" },
                ].map((portal) => (
                  <a
                    key={portal.name}
                    href={portal.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-[#F7F8F5] hover:bg-[#EAECE6] text-[#1A1F16] border border-[#E2E5DC] transition"
                  >
                    <span>{portal.name}</span>
                    <ArrowUpRight className="w-3 h-3 text-[#5B6354]" />
                  </a>
                ))}
              </div>
            </div>

            {/* Composite Real-Time Comparison Matrix */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              <div className="bg-white p-3.5 rounded-xl border border-[#E2E5DC] shadow-sm space-y-1">
                <div className="text-[11px] font-semibold text-[#5B6354]">NASA Temperature</div>
                <div className="text-xl font-extrabold text-[#1F7A3D]">
                  {externalData?.weather?.nasa_power?.series?.slice(-1)[0]?.temp_avg_c || "26.4"}°C
                </div>
                <div className="text-[10px] text-emerald-700 font-medium">
                  Rain: {externalData?.weather?.nasa_power?.series?.slice(-1)[0]?.rain_mm || "0.4"} mm
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E2E5DC] shadow-sm space-y-1">
                <div className="text-[11px] font-semibold text-[#5B6354]">IMD Departure</div>
                <div className="text-xl font-extrabold text-blue-700">
                  {externalData?.weather?.imd_normals?.monsoon_cumulative_pct_departure || "+4%"}
                </div>
                <div className="text-[10px] text-blue-600 font-medium">South Interior KT</div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E2E5DC] shadow-sm space-y-1">
                <div className="text-[11px] font-semibold text-[#5B6354]">AGMARKNET Modal</div>
                <div className="text-xl font-extrabold text-[#1F7A3D]">
                  ₹{externalData?.mandi_agmarknet?.agmarknet_modal_price?.toLocaleString() || "2,548"}
                </div>
                <div className="text-[10px] text-amber-700 font-medium">
                  Spread: {externalData?.mandi_agmarknet?.price_divergence_pct || "-3.85"}%
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E2E5DC] shadow-sm space-y-1">
                <div className="text-[11px] font-semibold text-[#5B6354]">Sentinel-2 NDVI</div>
                <div className="text-xl font-extrabold text-emerald-700">
                  {externalData?.satellite_ndvi?.ndvi_mean ?? 0.52}
                </div>
                <div className="text-[10px] text-emerald-800 font-semibold uppercase">
                  {externalData?.satellite_ndvi?.canopy_vigor || "Vigorous"}
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E2E5DC] shadow-sm space-y-1">
                <div className="text-[11px] font-semibold text-[#5B6354]">SoilGrids pH (H₂O)</div>
                <div className="text-xl font-extrabold text-purple-700">
                  {externalData?.soil_health?.soil_properties?.soil_ph_water || "6.4"}
                </div>
                <div className="text-[10px] text-purple-800 font-medium">
                  {externalData?.soil_health?.crop_compatibility?.ph_suitability || "Optimal"}
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-[#E2E5DC] shadow-sm space-y-1">
                <div className="text-[11px] font-semibold text-[#5B6354]">CABI Pest Pressure</div>
                <div className="text-base font-extrabold text-emerald-800 pt-1">
                  {externalData?.pest_disease?.overall_pest_pressure || "Low Risk"}
                </div>
                <div className="text-[10px] text-[#5B6354]">Field monitored</div>
              </div>
            </div>

            {/* PILLAR 1: WEATHER & AGROCLIMATOLOGY */}
            <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E5DC] pb-3">
                <h3 className="font-bold text-base flex items-center space-x-2">
                  <CloudRain className="w-5 h-5 text-blue-600" />
                  <span>Pillar 1: Multi-Source Weather & Agroclimatology (IMD vs NASA POWER vs OpenWeatherMap)</span>
                </h3>
                <div className="flex items-center space-x-2">
                  <a
                    href="https://power.larc.nasa.gov/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-700 hover:underline flex items-center"
                  >
                    NASA POWER <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </a>
                  <span className="text-gray-300">|</span>
                  <a
                    href="https://api.imd.gov.in/public/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-blue-700 hover:underline flex items-center"
                  >
                    IMD Public API <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#F7F8F5] p-4 rounded-xl border border-[#E2E5DC] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#5B6354] font-semibold">NASA POWER (Agroclimatology)</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">Live Solar/Rain</span>
                  </div>
                  <div className="text-2xl font-extrabold text-[#1F7A3D]">
                    {externalData?.weather?.nasa_power?.series?.slice(-1)[0]?.temp_avg_c || "26.4"}°C
                  </div>
                  <div className="text-xs text-[#5B6354] space-y-1">
                    <div className="flex items-center space-x-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      <span>Precipitation: <strong className="text-[#1A1F16]">{externalData?.weather?.nasa_power?.series?.slice(-1)[0]?.rain_mm || "0.4"} mm</strong></span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>Solar Radiation: <strong className="text-[#1A1F16]">{externalData?.weather?.nasa_power?.series?.slice(-1)[0]?.solar_radiation_mj || "18.5"} MJ/m²/day</strong></span>
                    </div>
                    <div>Relative Humidity: <strong className="text-[#1A1F16]">{externalData?.weather?.nasa_power?.series?.slice(-1)[0]?.humidity_pct || "68"}%</strong></div>
                  </div>
                </div>

                <div className="bg-[#F7F8F5] p-4 rounded-xl border border-[#E2E5DC] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#5B6354] font-semibold">IMD Normals & Departure</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">Official Benchmark</span>
                  </div>
                  <div className="text-2xl font-extrabold text-blue-700">
                    {externalData?.weather?.imd_normals?.monsoon_cumulative_pct_departure || "+4% Normal"}
                  </div>
                  <div className="text-xs text-[#5B6354] space-y-1">
                    <div>Subdivision: <strong className="text-[#1A1F16]">{externalData?.weather?.imd_normals?.subdivision || "South Interior Karnataka"}</strong></div>
                    <div>Normal Climatology: <strong className="text-[#1A1F16]">{externalData?.weather?.imd_normals?.normal_min_temp_c || "19.5"}°C - {externalData?.weather?.imd_normals?.normal_max_temp_c || "31.0"}°C</strong></div>
                    <div className="text-[11px] text-blue-800 italic pt-1">{externalData?.weather?.imd_normals?.agro_advisory || "Optimal canopy microclimate."}</div>
                  </div>
                </div>

                <div className="bg-[#F7F8F5] p-4 rounded-xl border border-[#E2E5DC] space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[#5B6354] font-semibold">Agricultural Risk Assessment</span>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded">Risk Index</span>
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Heat: {externalData?.weather?.agri_weather_risk?.heat_stress_level || "Low"}
                    </span>
                    <span className="text-xs uppercase font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Drought: {externalData?.weather?.agri_weather_risk?.drought_risk_level || "Low"}
                    </span>
                  </div>
                  <div className="text-xs text-[#5B6354] pt-2">
                    {externalData?.weather?.agri_weather_risk?.canopy_microclimate || "Optimal for crop maturity and harvest."}
                  </div>
                </div>
              </div>
            </div>

            {/* PILLAR 2 & PILLAR 3: CROP PRODUCTION APY & AGMARKNET */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PILLAR 2: APY */}
              <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-3">
                  <h3 className="font-bold text-base flex items-center space-x-2">
                    <Activity className="w-5 h-5 text-[#1F7A3D]" />
                    <span>Pillar 2: Crop Production APY (DES Agri & FAOSTAT)</span>
                  </h3>
                  <a
                    href="https://desagri.gov.in/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-700 hover:underline flex items-center"
                  >
                    DES Agri <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs border-b border-[#E2E5DC] pb-2">
                    <span className="text-[#5B6354]">State Total Production (DES Agri):</span>
                    <span className="font-bold text-[#1A1F16]">
                      {externalData?.production_apy?.state_aggregates?.total_production_mt?.toLocaleString() || "2,187,500"} MT
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-[#E2E5DC] pb-2">
                    <span className="text-[#5B6354]">State Total Cultivated Area:</span>
                    <span className="font-bold text-[#1A1F16]">
                      {externalData?.production_apy?.state_aggregates?.total_cultivated_area_ha?.toLocaleString() || "62,500"} ha
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-[#E2E5DC] pb-2">
                    <span className="text-[#5B6354]">{selectedDistrict} Yield:</span>
                    <span className="font-bold text-[#1F7A3D]">
                      {externalData?.production_apy?.district_metrics?.yield_kg_ha?.toLocaleString() || "35,000"} kg/ha
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-[#E2E5DC] pb-2">
                    <span className="text-[#5B6354]">District Yield Efficiency Index:</span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {externalData?.production_apy?.yield_efficiency_index || "100.0"}% of State Baseline
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#5B6354]">FAOSTAT Global Benchmark:</span>
                    <span className="font-bold text-blue-700">
                      India #{externalData?.production_apy?.faostat_benchmark?.india_global_rank || "2"} Globally (World Avg: {externalData?.production_apy?.faostat_benchmark?.world_avg_yield_kg_ha?.toLocaleString() || "37,100"} kg/ha)
                    </span>
                  </div>
                </div>
              </div>

              {/* PILLAR 3: AGMARKNET */}
              <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-3">
                  <h3 className="font-bold text-base flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                    <span>Pillar 3: AGMARKNET Live Mandi Price Spread</span>
                  </h3>
                  <a
                    href="https://agmarknet.gov.in/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-amber-700 hover:underline flex items-center"
                  >
                    AGMARKNET <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs border-b border-[#E2E5DC] pb-2">
                    <span className="text-[#5B6354]">AGMARKNET Modal Price:</span>
                    <span className="font-bold text-lg text-[#1F7A3D]">
                      ₹{externalData?.mandi_agmarknet?.agmarknet_modal_price?.toLocaleString() || "2,548"}/qtl
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-[#E2E5DC] pb-2">
                    <span className="text-[#5B6354]">AGMARKNET Min - Max Range:</span>
                    <span className="font-medium text-[#1A1F16]">
                      ₹{externalData?.mandi_agmarknet?.agmarknet_price_range?.min?.toLocaleString() || "2,242"} - ₹{externalData?.mandi_agmarknet?.agmarknet_price_range?.max?.toLocaleString() || "2,854"}/qtl
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-[#E2E5DC] pb-2">
                    <span className="text-[#5B6354]">Local APMC Yard Price:</span>
                    <span className="font-bold text-lg text-[#1A1F16]">
                      ₹{externalData?.mandi_agmarknet?.local_mandi_price?.toLocaleString() || "2,450"}/qtl
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-b border-[#E2E5DC] pb-2">
                    <span className="text-[#5B6354]">Price Divergence:</span>
                    <span className={`font-bold px-2 py-0.5 rounded text-xs ${(externalData?.mandi_agmarknet?.price_divergence_pct ?? 0) >= 0 ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
                      {externalData?.mandi_agmarknet?.price_divergence_pct || "-3.85"}%
                    </span>
                  </div>
                  <div className="text-xs text-[#5B6354] italic">
                    {externalData?.mandi_agmarknet?.divergence_interpretation || "Local mandi trades at competitive rates against state modal."}
                  </div>
                </div>
              </div>
            </div>

            {/* PILLAR 4 & PILLAR 5: SATELLITE NDVI & SOIL HEALTH */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PILLAR 4: SATELLITE / NDVI */}
              <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-3">
                  <h3 className="font-bold text-base flex items-center space-x-2">
                    <Layers className="w-5 h-5 text-emerald-600" />
                    <span>Pillar 4: Satellite NDVI Vegetation Index (Earth Engine & Sentinel-2)</span>
                  </h3>
                  <a
                    href="https://earthengine.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-emerald-700 hover:underline flex items-center"
                  >
                    Earth Engine <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </a>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs border-b border-[#E2E5DC] pb-2">
                    <span className="text-[#5B6354]">District Canopy Mean NDVI:</span>
                    <span className="font-extrabold text-lg text-emerald-700">
                      {externalData?.satellite_ndvi?.ndvi_mean ?? 0.52}
                    </span>
                  </div>

                  <div className="w-full bg-[#EAECE6] rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(10, ((externalData?.satellite_ndvi?.ndvi_mean ?? 0.52) / 0.9) * 100))}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                    <div className="bg-[#F7F8F5] p-2.5 rounded-lg border border-[#E2E5DC]">
                      <div className="text-[#5B6354]">10-Yr Historical Median</div>
                      <div className="font-bold text-[#1A1F16]">{externalData?.satellite_ndvi?.historical_10yr_median ?? 0.54}</div>
                    </div>
                    <div className="bg-[#F7F8F5] p-2.5 rounded-lg border border-[#E2E5DC]">
                      <div className="text-[#5B6354]">NDVI Anomaly Delta</div>
                      <div className={`font-bold ${(externalData?.satellite_ndvi?.ndvi_anomaly ?? 0) >= 0 ? "text-emerald-700" : "text-amber-700"}`}>
                        {(externalData?.satellite_ndvi?.ndvi_anomaly ?? 0) >= 0 ? "+" : ""}{externalData?.satellite_ndvi?.ndvi_anomaly ?? -0.02}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs border-t border-[#E2E5DC] pt-2">
                    <span className="text-[#5B6354]">Resolution & Cloud Filtering:</span>
                    <span className="font-medium text-[#1A1F16]">
                      10m Spatial | {externalData?.satellite_ndvi?.cloud_cover_filtered_pct ?? 2.4}% Masked
                    </span>
                  </div>

                  <div className="text-xs text-[#5B6354] bg-[#F7F8F5] p-3 rounded-lg border border-[#E2E5DC]">
                    <strong>Interpretation:</strong> {externalData?.satellite_ndvi?.vegetation_interpretation || "Canopy density is vigorous with steady biomass accumulation."}
                  </div>
                </div>
              </div>

              {/* PILLAR 5: SOIL HEALTH */}
              <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-3">
                  <h3 className="font-bold text-base flex items-center space-x-2">
                    <Sprout className="w-5 h-5 text-lime-600" />
                    <span>Pillar 5: Soil Health & Micronutrients (ISRIC SoilGrids & SHC)</span>
                  </h3>
                  <a
                    href="https://soilhealth.dac.gov.in/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-lime-700 hover:underline flex items-center"
                  >
                    Soil Health Card <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </a>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="bg-[#F7F8F5] p-2.5 rounded-lg border border-[#E2E5DC]">
                      <div className="text-[#5B6354]">Soil pH (H₂O)</div>
                      <div className="font-extrabold text-base text-purple-700">
                        {externalData?.soil_health?.soil_properties?.soil_ph_water || "6.4"} ({externalData?.soil_health?.crop_compatibility?.ph_suitability || "Optimal"})
                      </div>
                    </div>
                    <div className="bg-[#F7F8F5] p-2.5 rounded-lg border border-[#E2E5DC]">
                      <div className="text-[#5B6354]">Soil Classification</div>
                      <div className="font-bold text-xs text-[#1A1F16] truncate">
                        {externalData?.soil_health?.soil_properties?.soil_type || "Red Sandy Loam / Alfisols"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-[#F7F8F5] p-2 rounded-lg border border-[#E2E5DC] text-center">
                      <div className="text-[10px] text-[#5B6354]">Organic Carbon</div>
                      <div className="font-bold text-emerald-800">{externalData?.soil_health?.soil_properties?.organic_carbon_pct || "0.82"}%</div>
                    </div>
                    <div className="bg-[#F7F8F5] p-2 rounded-lg border border-[#E2E5DC] text-center">
                      <div className="text-[10px] text-[#5B6354]">Available N-P-K</div>
                      <div className="font-bold text-blue-800">Med-High-Med</div>
                    </div>
                    <div className="bg-[#F7F8F5] p-2 rounded-lg border border-[#E2E5DC] text-center">
                      <div className="text-[10px] text-[#5B6354]">Boron / Zinc</div>
                      <div className="font-bold text-amber-800">Target Borax</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs border-t border-[#E2E5DC] pt-2">
                    <span className="text-[#5B6354] flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>SHC Official Grade:</span>
                    </span>
                    <span className="font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                      {externalData?.soil_health?.crop_compatibility?.soil_health_card_rating || "Grade A (Prime Soils)"}
                    </span>
                  </div>

                  <div className="text-xs text-[#5B6354] bg-[#F7F8F5] p-3 rounded-lg border border-[#E2E5DC]">
                    <strong>Agronomic Directive:</strong> {externalData?.soil_health?.crop_compatibility?.recommendation || "Maintain organic mulch; apply 5kg Borax/acre prior to flowering."}
                  </div>
                </div>
              </div>
            </div>

            {/* PILLAR 6 & PILLAR 7: CABI PEST SURVEILLANCE & FCI/NABARD SUPPLY CHAIN */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* PILLAR 6: PEST & DISEASE */}
              <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-3">
                  <h3 className="font-bold text-base flex items-center space-x-2">
                    <Bug className="w-5 h-5 text-red-600" />
                    <span>Pillar 6: Pest & Pathogen Surveillance (CABI Plantwise Knowledge Bank)</span>
                  </h3>
                  <a
                    href="https://www.cabi.org/projects/plantwise/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-red-700 hover:underline flex items-center"
                  >
                    CABI Plantwise <ArrowUpRight className="w-3 h-3 ml-0.5" />
                  </a>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[#5B6354]">Economic Threshold Level (ETL):</span>
                    <span className="font-bold text-[#1A1F16]">
                      {externalData?.pest_disease?.economic_threshold_level || "5 whiteflies/leaf or 10% foliar lesions"}
                    </span>
                  </div>

                  {/* Threats List */}
                  <div className="space-y-2">
                    {(externalData?.pest_disease?.threats || [
                      {
                        name: "Tomato Leaf Curl Virus (ToLCV)",
                        vector: "Whitefly (Bemisia tabaci)",
                        climate_trigger: "Dry spells followed by temperatures 28-34°C",
                        risk_level: "Moderate",
                        ipm_measure: "Install yellow sticky traps (15/acre); apply neem oil 3% at 10-day intervals.",
                      },
                      {
                        name: "Early Blight (Alternaria solani)",
                        vector: "Fungal spore dispersal",
                        climate_trigger: "High relative humidity (>80%) and leaf wetness",
                        risk_level: "Low",
                        ipm_measure: "Prophylactic spray of Trichoderma harzianum; ensure wide row spacing.",
                      },
                    ]).map((threat: any, idx: number) => (
                      <div key={idx} className="bg-[#F7F8F5] p-3 rounded-xl border border-[#E2E5DC] space-y-1.5 text-xs">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-[#1A1F16]">{threat.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${threat.risk_level === "Moderate" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                            {threat.risk_level} Risk
                          </span>
                        </div>
                        <div className="text-[11px] text-[#5B6354]">
                          <strong>Vector:</strong> {threat.vector} | <strong>Trigger:</strong> {threat.climate_trigger}
                        </div>
                        <div className="text-[11px] text-emerald-800 bg-emerald-50/60 p-2 rounded border border-emerald-100">
                          <strong>IPM Measure:</strong> {threat.ipm_measure}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* PILLAR 7: FCI & NABARD SUPPLY CHAIN */}
              <div className="bg-white p-6 rounded-xl border border-[#E2E5DC] shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-3">
                  <h3 className="font-bold text-base flex items-center space-x-2">
                    <Building className="w-5 h-5 text-indigo-600" />
                    <span>Pillar 7: Market Demand & Storage (FCI & NABARD Infrastructure)</span>
                  </h3>
                  <div className="flex items-center space-x-2">
                    <a
                      href="https://fci.gov.in/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-700 hover:underline flex items-center"
                    >
                      FCI <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </a>
                    <span className="text-gray-300">|</span>
                    <a
                      href="https://www.nabard.org/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-indigo-700 hover:underline flex items-center"
                    >
                      NABARD <ArrowUpRight className="w-3 h-3 ml-0.5" />
                    </a>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#F7F8F5] p-3 rounded-xl border border-[#E2E5DC] space-y-2">
                    <div className="text-xs font-bold text-[#1A1F16] flex items-center space-x-1">
                      <Database className="w-3.5 h-3.5 text-indigo-600" />
                      <span>FCI Central Pool Grain Buffer Stock</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-[#5B6354]">Buffer Surplus Status</div>
                        <div className="font-bold text-emerald-700">{externalData?.demand_supply?.fci_food_grain_buffer?.surplus_deficit_pct || "Adequate Buffer"}</div>
                      </div>
                      <div>
                        <div className="text-[#5B6354]">Central Pool Stock</div>
                        <div className="font-bold text-[#1A1F16]">{externalData?.demand_supply?.fci_food_grain_buffer?.central_pool_stock_lmt ? `${externalData?.demand_supply?.fci_food_grain_buffer?.central_pool_stock_lmt} LMT` : "Strategic Reserves"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#F7F8F5] p-3 rounded-xl border border-[#E2E5DC] space-y-2">
                    <div className="text-xs font-bold text-[#1A1F16] flex items-center space-x-1">
                      <Truck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>NABARD Rural Cold Storage & Logistics Profile</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-[#5B6354]">Cold Storage Units (KT)</div>
                        <div className="font-bold text-[#1A1F16]">
                          {externalData?.demand_supply?.nabard_infrastructure?.karnataka_cold_storage_units || 248} Units ({externalData?.demand_supply?.nabard_infrastructure?.total_cold_capacity_mt?.toLocaleString() || "720,000"} MT)
                        </div>
                      </div>
                      <div>
                        <div className="text-[#5B6354]">Capacity Utilization</div>
                        <div className="font-bold text-blue-700">
                          {externalData?.demand_supply?.nabard_infrastructure?.capacity_utilization_pct || 74.5}% Utilized
                        </div>
                      </div>
                      <div>
                        <div className="text-[#5B6354]">RIDF Allocated</div>
                        <div className="font-bold text-emerald-800">
                          ₹{externalData?.demand_supply?.nabard_infrastructure?.nabard_rif_fund_allocated_crores?.toLocaleString() || "1,420.5"} Cr
                        </div>
                      </div>
                      <div>
                        <div className="text-[#5B6354]">WDRA e-NWR Finance</div>
                        <div className="font-bold text-purple-700">
                          Active (115 Warehouses)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-[#5B6354] bg-[#F7F8F5] p-3 rounded-lg border border-[#E2E5DC]">
                    <strong>Supply Chain Outlook:</strong> {externalData?.demand_supply?.supply_chain_resilience || "Perishable supply chain supported by NABARD cold storage facilities and high regional absorption."}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    </div>
  );
}
