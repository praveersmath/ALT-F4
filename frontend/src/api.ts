import type {
  ApiResponse,
  Atlas,
  BestMarket,
  CropInfo,
  CropRecommendations,
  Forecast,
  HikeAlert,
  Listing,
  ListingCreate,
  LoginRequest,
  MarketInfo,
  ModelMetrics,
  MspAdvisory,
  MspInfo,
  PriceSeries,
  RegisterRequest,
  Token,
  TransportCost,
  UserPublic,
  WeatherResponse,
} from "./contracts/types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem("agriintel_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };
  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody?.detail || errorBody?.error?.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Part 1: Meta & Prices
  getCrops: () => request<ApiResponse<CropInfo[]>>("/api/meta/crops"),
  getMarkets: (state = "karnataka") => request<ApiResponse<MarketInfo[]>>(`/api/meta/markets?state=${state}`),
  getPrices: (crop: string, marketId: number) =>
    request<ApiResponse<PriceSeries>>(`/api/prices?crop=${crop}&market_id=${marketId}`),
  getWeather: (district: string, state = "karnataka") =>
    request<ApiResponse<WeatherResponse>>(`/api/weather?district=${encodeURIComponent(district)}&state=${state}`),
  getMsp: (crop: string) => request<ApiResponse<MspInfo>>(`/api/msp?crop=${crop}`),

  // Part 2: Intelligence & Models
  getForecast: (crop: string, marketId: number, horizon = 7) =>
    request<ApiResponse<Forecast>>(`/api/forecast?crop=${crop}&market_id=${marketId}&horizon=${horizon}`),
  getHikeAlerts: (crop: string, state = "karnataka", horizon = 7) =>
    request<ApiResponse<HikeAlert[]>>(`/api/hike-alerts?crop=${crop}&state=${state}&horizon=${horizon}`),
  getAtlas: (crop: string, state = "karnataka", horizon = 7) =>
    request<ApiResponse<Atlas>>(`/api/atlas?crop=${crop}&state=${state}&horizon=${horizon}`),
  getModelMetrics: (crop: string) =>
    request<ApiResponse<ModelMetrics[]>>(`/api/model-metrics?crop=${crop}`),
  getCropRecommendations: (district: string) =>
    request<ApiResponse<CropRecommendations>>(`/api/crop-recommendations?district=${encodeURIComponent(district)}`),
  getMspAdvisory: (crop: string, district: string) =>
    request<ApiResponse<MspAdvisory>>(`/api/msp-advisory?crop=${crop}&district=${encodeURIComponent(district)}`),

  // Part 3: Logistics & Marketplace
  getTransportCost: (destMarketId: number, crop: string, quantityQtl: number, originLat: number, originLon: number) =>
    request<ApiResponse<TransportCost>>(
      `/api/transport-cost?dest_market_id=${destMarketId}&crop=${crop}&quantity_qtl=${quantityQtl}&origin_lat=${originLat}&origin_lon=${originLon}`
    ),
  getBestMarket: (crop: string, originLat: number, originLon: number, quantityQtl: number, horizon = 7) =>
    request<ApiResponse<BestMarket>>(
      `/api/best-market?crop=${crop}&origin_lat=${originLat}&origin_lon=${originLon}&quantity_qtl=${quantityQtl}&horizon=${horizon}`
    ),
  register: (req: RegisterRequest) =>
    request<ApiResponse<UserPublic>>("/api/auth/register", { method: "POST", body: JSON.stringify(req) }),
  login: (req: LoginRequest) =>
    request<ApiResponse<Token>>("/api/auth/login", { method: "POST", body: JSON.stringify(req) }),
  getMe: () => request<ApiResponse<UserPublic>>("/api/auth/me"),
  getListings: (crop?: string, district?: string) => {
    const params = new URLSearchParams();
    if (crop) params.append("crop", crop);
    if (district) params.append("district", district);
    return request<ApiResponse<Listing[]>>(`/api/listings?${params.toString()}`);
  },
  createListing: (req: ListingCreate) =>
    request<ApiResponse<Listing>>("/api/listings", { method: "POST", body: JSON.stringify(req) }),
  updateListingStatus: (id: number, status: "open" | "sold" | "cancelled") =>
    request<ApiResponse<Listing>>(`/api/listings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // Multi-Source External Data Feeds (7 Pillars)
  getComprehensiveExternalAnalysis: (
    crop: string,
    district: string,
    marketName = "Bengaluru (Binny Mill)",
    prevailingPrice = 2450
  ) =>
    request<ApiResponse<any>>(
      `/api/external/comprehensive-analysis?crop=${crop}&district=${encodeURIComponent(
        district
      )}&market_name=${encodeURIComponent(marketName)}&prevailing_price=${prevailingPrice}`
    ),
  getWeatherComparison: (district: string) =>
    request<ApiResponse<any>>(`/api/external/weather-comparison?district=${encodeURIComponent(district)}`),
  getProductionApy: (crop: string, district: string) =>
    request<ApiResponse<any>>(
      `/api/external/production-apy?crop=${crop}&district=${encodeURIComponent(district)}`
    ),
  getAgmarknetComparison: (crop: string, marketName: string, prevailingPrice: number) =>
    request<ApiResponse<any>>(
      `/api/external/mandi-agmarknet?crop=${crop}&market_name=${encodeURIComponent(
        marketName
      )}&prevailing_price=${prevailingPrice}`
    ),
  getSatelliteNdvi: (district: string) =>
    request<ApiResponse<any>>(`/api/external/satellite-ndvi?district=${encodeURIComponent(district)}`),
  getSoilHealth: (district: string, crop: string) =>
    request<ApiResponse<any>>(
      `/api/external/soil-health?district=${encodeURIComponent(district)}&crop=${crop}`
    ),
  getPestRisk: (crop: string, district: string) =>
    request<ApiResponse<any>>(
      `/api/external/pest-risk?crop=${crop}&district=${encodeURIComponent(district)}`
    ),
  getFciNabardSupply: (crop: string) =>
    request<ApiResponse<any>>(`/api/external/fci-nabard-supply?crop=${crop}`),
  getDistrictComparison: (
    crop: string,
    districtA: string,
    districtB: string,
    priceA = 2450,
    priceB = 2380
  ) =>
    request<ApiResponse<any>>(
      `/api/external/district-comparison?crop=${crop}&district_a=${encodeURIComponent(
        districtA
      )}&district_b=${encodeURIComponent(
        districtB
      )}&prevailing_price_a=${priceA}&prevailing_price_b=${priceB}`
    ),

  // KrushiMitra Deep Integration
  getWasteToValue: (crop = "tomato", condition = "damaged", qtyKg = 500, fromTown = "CHIK") =>
    request<ApiResponse<any>>(
      `/api/krushimitra/waste-to-value?crop=${crop}&condition=${condition}&qty_kg=${qtyKg}&from_town=${fromTown}`
    ),
  getCrossCorrelation: (crop = "tomato", mandi = "KOL") =>
    request<ApiResponse<any>>(
      `/api/krushimitra/cross-correlation?crop=${crop}&mandi=${mandi}`
    ),
  getNewsSentiment: (crop = "tomato") =>
    request<ApiResponse<any>>(`/api/krushimitra/news-sentiment?crop=${crop}`),
  getProcessingClusters: () => request<ApiResponse<any>>("/api/krushimitra/processing-clusters"),
  getOriginTowns: () => request<ApiResponse<any>>("/api/krushimitra/origin-towns"),
  sendChatAdvisory: (query: string, crop = "tomato", district = "Kolar") =>
    request<ApiResponse<any>>("/api/krushimitra/chat", {
      method: "POST",
      body: JSON.stringify({ query, crop, district }),
    }),
};


