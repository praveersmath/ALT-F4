// Mirror of backend/app/contracts/schemas.py. Do not edit outside setup.
export type DataSource = "live" | "cached" | "fixture" | "no_data";
export type AlertLevel = "green" | "amber" | "red";
export type Outlook = "rising" | "stable" | "falling";
export type Role = "farmer" | "wholesaler" | "retailer";
export type ForecastStatus = "ok" | "insufficient_data" | "model_below_baseline";
export type WeatherRisk = "low" | "medium" | "high";
export type ListingStatus = "open" | "sold" | "cancelled";
export type Verdict = "below_msp" | "below_market" | "fair" | "above_market" | "no_reference";
export type ClimateSignal = "normal" | "drought_risk" | "excess_rain_risk" | "unknown";

export interface Meta { data_source: DataSource; generated_at: string; notes: string[] }
export interface ApiResponse<T> { data: T; meta: Meta }
export interface ErrorResponse { error: { code: string; message: string } }

export interface CropInfo { id: string; name: string; category: string; msp_applicable: boolean }
export interface MarketInfo { id: number; name: string; district: string; state: string; lat: number | null; lon: number | null; coords_estimated: boolean }
export interface DistrictInfo { district_id: string; name: string; state: string }
export interface PricePoint { date: string; modal_price: number; min_price: number | null; max_price: number | null; arrivals_qtl: number | null }
export interface PriceSeries { crop: string; market_id: number | null; district: string | null; unit: string; points: PricePoint[] }
export interface WeatherDay { date: string; temp_max_c: number | null; temp_min_c: number | null; rain_mm: number | null; is_forecast: boolean }
export interface WeatherResponse { location_name: string; lat: number; lon: number; days: WeatherDay[] }
export interface MspInfo { crop: string; msp_applicable: boolean; marketing_year: string | null; msp_inr_per_qtl: number | null; note: string | null }
export interface DemandProxyInfo { district: string; population: number | null; upcoming_festivals: string[]; arrivals_trend_pct: number | null; price_trend_pct: number | null }
export interface DataStatusItem { source_name: string; last_success: string | null; status: string; rows_last_run: number; message: string | null }
export interface CoverageItem { crop: string; market_id: number; market: string; first_date: string | null; last_date: string | null; n_days: number; sufficient_for_model: boolean }

export interface ModelMetrics { crop: string; horizon_days: number; model_name: string; mape: number; rmse: number; baseline_mape: number; baseline_rmse: number; beats_baseline: boolean; test_start: string; test_end: string; data_source: DataSource }
export interface ForecastPoint { target_date: string; predicted: number; lower: number; upper: number }
export interface Forecast { crop: string; market_id: number; market: string; horizon_days: number; current_price: number | null; status: ForecastStatus; points: ForecastPoint[]; model_name: string | null; metrics: ModelMetrics | null }
export interface HikeAlert { crop: string; district: string; district_id: string; state: string; horizon_days: number; current_price: number; predicted_price: number; pct_change: number; level: AlertLevel; is_statistical_spike: boolean; threshold_pct: number }
export interface AtlasDistrict { district_id: string; district: string; current_trend_pct: number | null; predicted_change_pct: number | null; alert_level: AlertLevel | null; outlook: Outlook | null }
export interface Atlas { crop: string; horizon_days: number; districts: AtlasDistrict[] }
export interface CropRecommendation { crop: string; score: number; rationale: string[] }
export interface CropRecommendations { district: string; items: CropRecommendation[]; assumptions: string[] }
export interface MspAdvisory { crop: string; district: string; msp_applicable: boolean; msp_inr_per_qtl: number | null; market_price: number | null; climate_signal: ClimateSignal; cost_pressure_pct: number | null; advisory: string }

export interface TransportCost { distance_km: number; distance_is_estimate: boolean; freight: number; toll: number; loading_unloading: number; mandi_fee: number; spoilage: number; total: number; per_quintal: number; assumptions: string[] }
export interface MarketOption { rank: number; market_id: number; market: string; district: string; distance_km: number; predicted_price: number; price_basis: "forecast" | "latest_actual"; transport_cost_per_qtl: number; net_price_per_qtl: number; weather_risk: WeatherRisk }
export interface BestMarket { crop: string; quantity_qtl: number; horizon_days: number; options: MarketOption[]; assumptions: string[] }
export interface RegisterRequest { name: string; email: string; password: string; role: Role; district?: string | null }
export interface LoginRequest { email: string; password: string }
export interface Token { access_token: string; token_type: "bearer" }
export interface UserPublic { id: number; name: string; email: string; role: Role; district: string | null }
export interface PriceCheck { msp_applicable: boolean; msp_inr_per_qtl: number | null; current_market_price: number | null; predicted_price: number | null; verdict: Verdict; note: string }
export interface ListingCreate { crop: string; quantity_qtl: number; asking_price_per_qtl: number; district: string; market_id?: number | null }
export interface Listing { id: number; owner: UserPublic; crop: string; quantity_qtl: number; asking_price_per_qtl: number; district: string; market_id: number | null; status: ListingStatus; created_at: string; price_check: PriceCheck }
export interface HealthResponse { status: "ok" | "degraded"; modules: { module: string; status: "loaded" | "failed"; error: string | null }[] }

