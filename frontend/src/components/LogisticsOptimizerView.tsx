import React, { useState, useEffect } from "react";
import {
  Truck,
  MapPin,
  TrendingUp,
  ArrowRight,
  ArrowRightLeft,
  Download,
  Navigation,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import type { MarketInfo, TransportCost, BestMarket } from "../contracts/types";
import { api } from "../api";
import { APMC_MAP_POINTS } from "./MarketAtlasView";

interface LogisticsOptimizerViewProps {
  markets: MarketInfo[];
  selectedCrop: string;
  setSelectedCrop: (crop: string) => void;
  language: "en" | "kn";
  onNavigateToTab?: (tab: string) => void;
}

const VEHICLE_TYPES = [
  { id: "scv", name: "Mini Truck (Tata Ace / Bolero Pickup)", capacityQtl: 15, baseRateKm: 18 },
  { id: "lcv", name: "Light Commercial Vehicle (Eicher 14ft)", capacityQtl: 40, baseRateKm: 28 },
  { id: "mgv", name: "Medium Truck (6-Wheel 10-Tonne)", capacityQtl: 100, baseRateKm: 45 },
  { id: "hgv", name: "Heavy Multi-Axle Hauler (16-Tonne)", capacityQtl: 250, baseRateKm: 65 },
];

export const LogisticsOptimizerView: React.FC<LogisticsOptimizerViewProps> = ({
  markets,
  selectedCrop,
  setSelectedCrop,
  language,
  onNavigateToTab,
}) => {
  // Use APMC_MAP_POINTS or markets
  const apmcList = APMC_MAP_POINTS.length > 0 ? APMC_MAP_POINTS : markets;

  const [sourceId, setSourceId] = useState<number>(2); // Default: Kolar Mandi
  const [destId, setDestId] = useState<number>(1); // Default: Bengaluru Binny Mill
  const [quantityQtl, setQuantityQtl] = useState<number>(30);
  const [selectedVehicle, setSelectedVehicle] = useState<string>("lcv");
  const [horizon, setHorizon] = useState<number>(7);

  const [loading, setLoading] = useState<boolean>(false);
  const [transportCost, setTransportCost] = useState<TransportCost | null>(null);
  const [bestMarket, setBestMarket] = useState<BestMarket | null>(null);

  const sourceMarket = apmcList.find((m) => m.id === sourceId) || apmcList[0];
  const destMarket = apmcList.find((m) => m.id === destId) || apmcList[1] || apmcList[0];

  // Derive source coordinates
  const getCoordinates = (market: any) => {
    // If market has lat/lon
    if (market.lat && market.lon) return { lat: market.lat, lon: market.lon };
    // Or from APMC_MAP_POINTS
    const found = APMC_MAP_POINTS.find((p) => p.id === market.id);
    if (found) {
      // Map SVG coords back to rough Karnataka GPS
      const lat = 18.5 - ((found.y - 30) / 640) * 7.0;
      const lon = 74.0 + ((found.x - 70) / 460) * 4.6;
      return { lat, lon };
    }
    return { lat: 12.9716, lon: 77.5946 };
  };

  const sourceCoords = getCoordinates(sourceMarket);

  const calculateLogistics = async () => {
    setLoading(true);
    try {
      const [costRes, bestRes] = await Promise.all([
        api.getTransportCost(destId, selectedCrop, quantityQtl, sourceCoords.lat, sourceCoords.lon),
        api.getBestMarket(selectedCrop, sourceCoords.lat, sourceCoords.lon, quantityQtl, horizon),
      ]);
      setTransportCost(costRes.data);
      setBestMarket(bestRes.data);
    } catch (err) {
      console.error("Logistics calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateLogistics();
  }, [sourceId, destId, selectedCrop, quantityQtl, horizon]);

  const handleSwap = () => {
    const temp = sourceId;
    setSourceId(destId);
    setDestId(temp);
  };

  // Determine major highway corridor based on source and destination
  const getHighwayCorridor = () => {
    const sName = sourceMarket.name.toLowerCase();
    const dName = destMarket.name.toLowerCase();
    if ((sName.includes("bengaluru") && dName.includes("mysuru")) || (sName.includes("mysuru") && dName.includes("bengaluru"))) {
      return "NH-275 (Bengaluru-Mysuru Access-Controlled Expressway) - Fast Corridor";
    }
    if (sName.includes("hubballi") || dName.includes("hubballi") || sName.includes("belagavi") || dName.includes("belagavi") || sName.includes("davanagere") || dName.includes("davanagere")) {
      return "NH-48 (Golden Quadrilateral / Pune-Bengaluru High-Density Highway)";
    }
    if (sName.includes("kolar") || dName.includes("kolar")) {
      return "NH-75 (Bengaluru-Tirupati-Chennai Industrial Highway)";
    }
    if (sName.includes("mangaluru") || dName.includes("mangaluru") || sName.includes("udupi") || dName.includes("udupi")) {
      return "NH-75 Shiradi Ghat / Charmadi Ghat Coastal Freight Corridor";
    }
    if (sName.includes("kalaburagi") || dName.includes("kalaburagi") || sName.includes("raichur") || dName.includes("raichur")) {
      return "NH-50 / SH-19 North-South Kalyana-Karnataka Corridor";
    }
    return "National Highway Network & Karnataka State Agro-Corridors";
  };

  const handlePrintManifest = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-[#1F7A3D] via-[#165a2d] to-[#0f3d1f] text-white p-6 rounded-2xl shadow-md border border-[#C5A059]/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <Truck className="w-8 h-8 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {language === "kn"
                    ? "ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಸಾರಿಗೆ ಮತ್ತು ನಿವ್ವಳ ಲಾಭ ಕ್ಯಾಲ್ಕುಲೇಟರ್"
                    : "Karnataka APMC Logistics, Freight & Net Realization Optimizer"}
                </h1>
                <span className="bg-emerald-400/20 text-emerald-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-emerald-300/40">
                  All 20 Mandis
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-3xl leading-relaxed">
                {language === "kn"
                  ? "ಯಾವುದೇ ಮೂಲದಿಂದ ಎಲ್ಲಾ ೨೦ ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಮಂಡಿಗಳಿಗೆ ಸಾರಿಗೆ ವೆಚ್ಚ, ಟೋಲ್, ಡೀಸೆಲ್ ದರ, ಮತ್ತು ನಿವ್ವಳ ಲಾಭ ಹೋಲಿಕೆ."
                  : "Calculate point-to-point haulage across all 20 regional APMC terminals, factoring live diesel rates, road curvature, toll plazas, statutory mandi cess, and perishability shrinkage to maximize farmer net profit."}
              </p>
            </div>
          </div>

          <button
            onClick={handlePrintManifest}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-white text-[#1F7A3D] hover:bg-emerald-50 transition shadow-sm self-start md:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === "kn" ? "ಟ್ರಿಪ್ ಪಾಸ್ ಮುದ್ರಿಸಿ" : "Print Trip Manifest"}</span>
          </button>
        </div>
      </div>

      {/* Origin, Destination & Haulage Parameters Control Card */}
      <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-3">
          <span className="text-xs font-bold text-[#5B6354] uppercase tracking-wide flex items-center space-x-1.5">
            <Navigation className="w-4 h-4 text-[#1F7A3D]" />
            <span>Select Origin Source & Destination APMC Terminals</span>
          </span>
          <span className="text-xs text-[#8C9280]">Real-time diesel & road network calibrated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Source Origin (5 Cols) */}
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-bold text-[#5B6354]">
              {language === "kn" ? "ಮೂಲ ಮಂಡಿ / ಸ್ಥಳ (Source Origin)" : "Source Origin APMC Terminal"}
            </label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(Number(e.target.value))}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-xl px-3 py-2.5 text-xs font-bold text-[#1A1F16] focus:ring-2 focus:ring-[#1F7A3D] focus:outline-none"
            >
              {apmcList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.district})
                </option>
              ))}
            </select>
            <div className="text-[11px] text-[#8C9280] flex items-center space-x-1 pt-0.5">
              <MapPin className="w-3 h-3 text-[#1F7A3D]" />
              <span>District: {sourceMarket.district}</span>
            </div>
          </div>

          {/* Swap Button (2 Cols) */}
          <div className="md:col-span-2 flex justify-center items-center pt-2">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-full bg-[#F7F8F5] hover:bg-[#EAECE6] border border-[#E2E5DC] text-[#1F7A3D] hover:scale-110 transition shadow-xs"
              title="Swap Origin and Destination"
              aria-label="Swap"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Target Destination (5 Cols) */}
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-bold text-[#5B6354]">
              {language === "kn" ? "ಗಮ್ಯಸ್ಥಾನ ಮಂಡಿ (Target Destination)" : "Destination APMC Terminal"}
            </label>
            <select
              value={destId}
              onChange={(e) => setDestId(Number(e.target.value))}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-xl px-3 py-2.5 text-xs font-bold text-[#1A1F16] focus:ring-2 focus:ring-[#1F7A3D] focus:outline-none"
            >
              {apmcList.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.district})
                </option>
              ))}
            </select>
            <div className="text-[11px] text-[#8C9280] flex items-center space-x-1 pt-0.5">
              <MapPin className="w-3 h-3 text-blue-600" />
              <span>District: {destMarket.district}</span>
            </div>
          </div>
        </div>

        {/* Cargo Load & Commercial Vehicle Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-[#E2E5DC]">
          <div>
            <label className="block text-xs font-bold text-[#5B6354] mb-1">
              Commodity / Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1F16]"
            >
              <option value="tomato">Tomato (ಟೊಮೆಟೊ)</option>
              <option value="onion">Onion (ಈರುಳ್ಳಿ)</option>
              <option value="potato">Potato (ಆಲೂಗಡ್ಡೆ)</option>
              <option value="chilli">Byadgi Chilli (ಮೆಣಸಿನಕಾಯಿ)</option>
              <option value="maize">Maize (ಮೆಕ್ಕೆಜೋಳ)</option>
              <option value="wheat">Wheat (ಗೋಧಿ)</option>
              <option value="cotton">Cotton (ಹತ್ತಿ)</option>
              <option value="tur">Red Gram / Tur (ತೊಗರಿ)</option>
              <option value="chana">Bengal Gram (ಕಡಲೆ)</option>
              <option value="ragi">Ragi / Millet (ರಾಗಿ)</option>
              <option value="arecanut">Arecanut (ಅಡಿಕೆ)</option>
              <option value="coffee">Coffee (ಕಾಫಿ)</option>
              <option value="groundnut">Groundnut (ಕಡಲೆಕಾಯಿ)</option>
              <option value="sugarcane">Sugarcane (ಕಬ್ಬು)</option>
              <option value="rice">Paddy / Rice (ಭತ್ತ)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B6354] mb-1">
              Quantity to Transport (Quintals)
            </label>
            <input
              type="number"
              min={1}
              max={1000}
              value={quantityQtl}
              onChange={(e) => setQuantityQtl(Math.max(1, Number(e.target.value)))}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-3 py-2 text-xs font-bold text-[#1A1F16]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B6354] mb-1">
              Commercial Cargo Vehicle
            </label>
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1F16]"
            >
              {VEHICLE_TYPES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.capacityQtl} qtl cap)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5B6354] mb-1">
              Forecast Horizon
            </label>
            <select
              value={horizon}
              onChange={(e) => setHorizon(Number(e.target.value))}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-3 py-2 text-xs font-semibold text-[#1A1F16]"
            >
              <option value={3}>3-Day Horizon (Immediate)</option>
              <option value={7}>7-Day Horizon (Weekly)</option>
              <option value={14}>14-Day Horizon (Fortnightly)</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={calculateLogistics}
              disabled={loading}
              className="w-full py-2 px-3 bg-[#1F7A3D] hover:bg-[#165a2d] text-white text-xs font-bold rounded-lg transition shadow-sm flex items-center justify-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{loading ? "Optimizing Routes..." : "Recalculate Haulage"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selected Route Itemized Freight & Manifest Card */}
      {transportCost && (
        <div className="bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E5DC] pb-3">
            <div>
              <div className="text-xs uppercase font-extrabold text-[#C5A059] tracking-wider">
                Direct Route Manifest & Cost Breakdown
              </div>
              <h2 className="text-base font-black text-[#1A1F16] flex items-center space-x-2 mt-0.5">
                <span>{sourceMarket.name}</span>
                <ArrowRight className="w-4 h-4 text-[#1F7A3D]" />
                <span>{destMarket.name}</span>
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-xs">
              <span className="bg-emerald-50 text-[#1F7A3D] font-bold px-2.5 py-1 rounded-lg border border-emerald-200">
                Road: {transportCost.distance_km} km
              </span>
              <span className="bg-blue-50 text-blue-700 font-bold px-2.5 py-1 rounded-lg border border-blue-200">
                Est. Time: {Math.max(1, Math.round((transportCost.distance_km / 45) * 10) / 10)} hrs
              </span>
            </div>
          </div>

          {/* Highway Corridor Banner */}
          <div className="bg-[#F7F8F5] p-3 rounded-xl border border-[#E2E5DC] text-xs text-[#5B6354] flex items-center space-x-2">
            <Navigation className="w-4 h-4 text-[#1F7A3D] shrink-0" />
            <span>
              <strong>Primary Highway Corridor:</strong> {getHighwayCorridor()}
            </span>
          </div>

          {/* Itemized Cost Breakdown Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-[#E2E5DC] space-y-1">
              <div className="text-[11px] text-[#5B6354]">Base Freight</div>
              <div className="text-lg font-black text-[#1A1F16]">₹{transportCost.freight.toLocaleString()}</div>
              <div className="text-[10px] text-[#8C9280]">Vehicle transit fee</div>
            </div>

            <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-[#E2E5DC] space-y-1">
              <div className="text-[11px] text-[#5B6354]">NHAI Tolls</div>
              <div className="text-lg font-black text-[#1A1F16]">₹{transportCost.toll.toLocaleString()}</div>
              <div className="text-[10px] text-[#8C9280]">Fastag commercial plazas</div>
            </div>

            <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-[#E2E5DC] space-y-1">
              <div className="text-[11px] text-[#5B6354]">Loading / Unloading</div>
              <div className="text-lg font-black text-[#1A1F16]">₹{transportCost.loading_unloading.toLocaleString()}</div>
              <div className="text-[10px] text-[#8C9280]">Hamali labor charge</div>
            </div>

            <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-[#E2E5DC] space-y-1">
              <div className="text-[11px] text-[#5B6354]">APMC Statutory Cess</div>
              <div className="text-lg font-black text-[#1A1F16]">₹{transportCost.mandi_fee.toLocaleString()}</div>
              <div className="text-[10px] text-[#8C9280]">Yard infrastructure cess</div>
            </div>

            <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-[#E2E5DC] space-y-1">
              <div className="text-[11px] text-[#5B6354]">Transit Shrinkage</div>
              <div className="text-lg font-black text-amber-700">₹{transportCost.spoilage.toLocaleString()}</div>
              <div className="text-[10px] text-[#8C9280]">Moisture/perishability buffer</div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-1">
              <div className="text-[11px] text-emerald-800 font-bold">Total Logistics Cost/qtl</div>
              <div className="text-xl font-black text-[#1F7A3D]">₹{transportCost.per_quintal.toLocaleString()}</div>
              <div className="text-[10px] text-emerald-700 font-semibold">Total: ₹{transportCost.total.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      {/* MULTI-TERMINAL HAULAGE & NET PROFIT COMPARISON ACROSS ALL 20 APMCs */}
      <div className="bg-white rounded-2xl border border-[#C5A059]/30 shadow-sm overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-[#FAFBF9] to-[#F7F8F5] border-b border-[#E2E5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase font-extrabold text-[#C5A059] tracking-wider flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-[#1F7A3D]" />
              <span>Travel & Net Realization Leaderboard: All Karnataka Mandis</span>
            </div>
            <h2 className="text-base font-black text-[#1A1F16] mt-0.5">
              Ranked Destinations from Origin: <span className="text-[#1F7A3D]">{sourceMarket.name}</span> ({quantityQtl} qtl {selectedCrop.toUpperCase()})
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-xs text-[#5B6354]">
              Formula: <strong>Net Realization = APMC Price - Freight Cost/qtl</strong>
            </div>
            {onNavigateToTab && (
              <button
                onClick={() => onNavigateToTab("marketplace")}
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FAFBF9] hover:bg-emerald-50 text-[#1F7A3D] border border-emerald-200 transition"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Trade in B2B Lots</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#FAFBF9] border-b border-[#E2E5DC] text-[#5B6354] uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Destination APMC Yard</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Distance & Transit</th>
                <th className="py-3 px-4">Modal Price</th>
                <th className="py-3 px-4">Transport Cost/qtl</th>
                <th className="py-3 px-4 text-[#1F7A3D] font-extrabold">Net Farmer Realization</th>
                <th className="py-3 px-4">Transit Risk</th>
                <th className="py-3 px-4 text-right">Route Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E5DC]">
              {bestMarket?.options?.map((opt) => {
                const isCurrentTarget = opt.market_id === destId;
                const hours = Math.max(1, Math.round((opt.distance_km / 45) * 10) / 10);
                return (
                  <tr
                    key={opt.market_id}
                    className={`hover:bg-[#F7F8F5]/60 transition ${
                      opt.rank === 1 ? "bg-emerald-50/40" : isCurrentTarget ? "bg-blue-50/30" : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-black">
                      {opt.rank === 1 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-700 text-white shadow-2xs">
                          ★ #1 BEST
                        </span>
                      ) : (
                        <span className="text-[#5B6354]">#{opt.rank}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1A1F16]">
                      {opt.market}
                      {isCurrentTarget && (
                        <span className="ml-2 text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.2 rounded">
                          Selected
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#5B6354]">{opt.district}</td>
                    <td className="py-3 px-4 font-medium text-[#1A1F16]">
                      {opt.distance_km} km ({hours} hrs)
                    </td>
                    <td className="py-3 px-4 font-bold text-[#1A1F16]">
                      ₹{opt.predicted_price.toLocaleString()}/qtl
                    </td>
                    <td className="py-3 px-4 font-semibold text-red-700">
                      -₹{opt.transport_cost_per_qtl}/qtl
                    </td>
                    <td className="py-3 px-4 font-black text-sm text-[#1F7A3D]">
                      ₹{opt.net_price_per_qtl.toLocaleString()}/qtl
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
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
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setDestId(opt.market_id)}
                        className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                          isCurrentTarget
                            ? "bg-blue-600 text-white"
                            : "bg-[#F7F8F5] hover:bg-[#EAECE6] text-[#1F7A3D] border border-[#E2E5DC]"
                        }`}
                      >
                        {isCurrentTarget ? "Viewing Route" : "Select Target"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
