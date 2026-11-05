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

export default function App() {
  const [activeTab, setActiveTab] = useState<"market" | "forecast" | "logistics" | "marketplace" | "advisory">("market");
  const [selectedCrop, setSelectedCrop] = useState<string>("tomato");
  const [selectedMarketId, setSelectedMarketId] = useState<number>(1);
  const [selectedDistrict, setSelectedDistrict] = useState<string>("Bengaluru Urban");
  const [markets, setMarkets] = useState<MarketInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserPublic | null>(null);

  // Data states
  const [prices, setPrices] = useState<PriceSeries | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [alerts, setAlerts] = useState<HikeAlert[]>([]);
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [bestMarket, setBestMarket] = useState<BestMarket | null>(null);
  const [transportCost, setTransportCost] = useState<TransportCost | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [advisory, setAdvisory] = useState<MspAdvisory | null>(null);
  const [recommendations, setRecommendations] = useState<CropRecommendations | null>(null);

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
  }, [activeTab, selectedCrop, selectedMarketId, selectedDistrict]);

  const checkAuth = async () => {
    const token = localStorage.getItem("agriintel_token");
    if (!token) {
      setCurrentUser(null);
      return;
    }
    try {
      const res = await api.getMe();
      setCurrentUser(res.data);
    } catch {
      localStorage.removeItem("agriintel_token");
      setCurrentUser(null);
    }
  };

  const loadMarkets = async () => {
    try {
      const res = await api.getMarkets();
      setMarkets(res.data);
      if (res.data.length > 0) {
        setSelectedMarketId(res.data[0].id);
      }
    } catch (e) {
      console.error("Could not load markets", e);
    }
  };

  const loadTabData = async () => {
    setLoading(true);
    try {
      if (activeTab === "market") {
        const [priceRes, alertRes] = await Promise.all([
          api.getPrices(selectedCrop, selectedMarketId).catch(() => null),
          api.getHikeAlerts(selectedCrop).catch(() => null),
        ]);
        if (priceRes) setPrices(priceRes.data);
        if (alertRes) setAlerts(alertRes.data);
      } else if (activeTab === "forecast") {
        const [foreRes, atlasRes] = await Promise.all([
          api.getForecast(selectedCrop, selectedMarketId).catch(() => null),
          api.getAtlas(selectedCrop).catch(() => null),
        ]);
        if (foreRes) setForecast(foreRes.data);
        if (atlasRes) setAtlas(atlasRes.data);
      } else if (activeTab === "logistics") {
        const [bestRes, costRes] = await Promise.all([
          api.getBestMarket(selectedCrop, 12.9716, 77.5946, 20).catch(() => null),
          api.getTransportCost(selectedMarketId, selectedCrop, 20, 12.9716, 77.5946).catch(() => null),
        ]);
        if (bestRes) setBestMarket(bestRes.data);
        if (costRes) setTransportCost(costRes.data);
      } else if (activeTab === "marketplace") {
        const listRes = await api.getListings(selectedCrop).catch(() => null);
        if (listRes) setListings(listRes.data);
      } else if (activeTab === "advisory") {
        const [advRes, recRes] = await Promise.all([
          api.getMspAdvisory(selectedCrop, selectedDistrict).catch(() => null),
          api.getCropRecommendations(selectedDistrict).catch(() => null),
        ]);
        if (advRes) setAdvisory(advRes.data);
        if (recRes) setRecommendations(recRes.data);
      }
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

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#1A1F16]">
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
              </select>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs text-[#5B6354]">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              ● Live Data Ingested
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
            {/* Price Overview Banner */}
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
            {/* Forecast Interval Fan */}
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

              {/* Trajectory Table */}
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
            {/* Best Market Ranking */}
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

            {/* Transport Cost Breakdown Card */}
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
            {/* Create Listing Form */}
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

            {/* Active Listings Grid */}
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

                    {/* Price check verdict */}
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
            {/* MSP Advisory Card */}
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

            {/* Season-Ahead Crop Recommendations */}
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
      </main>
    </div>
  );
}

