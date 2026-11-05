# AgriIntel API Contract

## 1. Overview & Envelope Specification
Every endpoint under `/api` returns a JSON envelope formatted as follows:

### Success Response
```json
{
  "data": <payload>,
  "meta": {
    "data_source": "live" | "cached" | "fixture" | "no_data",
    "generated_at": "2026-11-05T12:00:00Z",
    "notes": ["Optional explanation or caveat"]
  }
}
```
*Exception*: `GET /api/geo/districts` returns a raw GeoJSON `FeatureCollection` with properties `district_id` and `name`.

### Error Response
```json
{
  "error": {
    "code": "BAD_REQUEST",
    "message": "Detailed error message"
  }
}
```

---

## 2. Table Ownership Matrix
Cross-module rule: **The DB is the bus**. Each table has a single owner that writes to it. Other modules may only read.

| Owner Part | Tables Owned (Writer) | Read-Only Consumers |
|---|---|---|
| **Part 1 (Data & Platform)** | `crops`, `markets`, `price_records`, `weather_daily`, `msp_records`, `fuel_prices`, `festival_events`, `demand_proxies`, `ingest_runs` | Parts 2, 3 |
| **Part 2 (Intelligence & ML)** | `model_runs`, `forecasts`, `hike_alerts` | Part 3 |
| **Part 3 (Logistics & Marketplace)** | `users`, `listings` | Read by Part 3 routes |

---

## 3. Endpoints by Owner

### Part 1: Data & Platform
| Method | Path | Query / Body | Data Type | Notes |
|---|---|---|---|---|
| `GET` | `/api/meta/crops` | - | `CropInfo[]` | Tomato, Onion, Wheat metadata |
| `GET` | `/api/meta/markets` | `state` | `MarketInfo[]` | Mandi list with geo coords |
| `GET` | `/api/meta/districts` | `state` | `DistrictInfo[]` | District metadata |
| `GET` | `/api/prices` | `crop`, `market_id` or `district`, `from`, `to` | `PriceSeries` | Historical modal, min, max, arrivals |
| `GET` | `/api/weather` | `district`+`state` or `lat`+`lon` | `WeatherResponse` | 7 past days + 7 forecast days |
| `GET` | `/api/geo/districts` | `state` | GeoJSON `FeatureCollection` | Polygon boundaries for atlas |
| `GET` | `/api/msp` | `crop`, `year` | `MspInfo` | Wheat MSP or `msp_applicable=false` |
| `GET` | `/api/demand-proxy` | `district`, `crop` | `DemandProxyInfo` | Population, festivals, trends |
| `GET` | `/api/data/status` | - | `DataStatusItem[]` | Freshness and status per source |
| `GET` | `/api/data/coverage` | `crop`, `state` | `CoverageItem[]` | Coverage & history sufficiency |
| `POST` | `/api/admin/ingest/{source}` | Header `X-Admin-Token` | `{run_id, status}` | Trigger ingest manually |

### Part 2: Intelligence & Models
| Method | Path | Query / Body | Data Type | Notes |
|---|---|---|---|---|
| `GET` | `/api/forecast` | `crop`, `market_id`, `horizon` (7 or 15) | `Forecast` | Multi-step forecast + confidence interval |
| `GET` | `/api/hike-alerts` | `crop`, `state`, `horizon` | `HikeAlert[]` | Green / Amber / Red + statistical spikes |
| `GET` | `/api/atlas` | `crop`, `state`, `horizon` | `Atlas` | District level trends and outlook |
| `GET` | `/api/model-metrics` | `crop` | `ModelMetrics[]` | Time-based evaluation vs baselines |
| `GET` | `/api/crop-recommendations` | `district` | `CropRecommendations` | Roadmap preview |
| `GET` | `/api/msp-advisory` | `crop`, `district` | `MspAdvisory` | Roadmap preview |

### Part 3: Logistics & Marketplace
| Method | Path | Query / Body | Data Type | Notes |
|---|---|---|---|---|
| `GET` | `/api/transport-cost` | `origin_market_id` or `origin_lat`+`origin_lon`, `dest_market_id`, `crop`, `quantity_qtl` | `TransportCost` | Distance, freight, toll, spoilage |
| `GET` | `/api/best-market` | `crop`, `origin_lat`, `origin_lon`, `quantity_qtl`, `horizon` | `BestMarket` | Net price ranked markets |
| `POST` | `/api/auth/register` | `RegisterRequest` | `UserPublic` | User registration |
| `POST` | `/api/auth/login` | `LoginRequest` | `Token` | JWT authentication |
| `GET` | `/api/auth/me` | Bearer Token | `UserPublic` | Current profile |
| `GET` | `/api/listings` | `crop`, `district`, `status`, `limit`, `offset` | `Listing[]` | Marketplace listings |
| `POST` | `/api/listings` | `ListingCreate` (Auth) | `Listing` | Create listing with price check |
| `GET` | `/api/listings/{id}` | - | `Listing` | Single listing details |
| `PATCH` | `/api/listings/{id}/status` | `{status}` (Auth) | `Listing` | Owner status change |

### Core Root
| Method | Path | Notes |
|---|---|---|
| `GET` | `/health` | Health check reporting loaded modules |

