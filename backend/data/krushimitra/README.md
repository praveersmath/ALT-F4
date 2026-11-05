# ಕೃಷಿಮಿತ್ರ KrushiMitra — Agricultural Market Intelligence for Karnataka

A bilingual (ಕನ್ನಡ / English) full-stack market intelligence system for Karnataka's
farmers, traders and FPOs. Live APMC-style mandi prices, 14-day statistical forecasts,
real weather-driven crop-risk analysis, transport & profit economics, news sentiment,
waste-to-value conversion guidance, and a data-grounded bilingual AI chatbot.

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · Framer Motion · custom SVG charts |
| Backend | Next.js Route Handlers (TypeScript) |
| Database | PostgreSQL via Drizzle ORM (price records, weather cache, news cache, chat history, alerts, prediction logs) |
| ML / Analytics | Holt-Winters triple-exponential forecasting + weekly seasonality + backtest accuracy engine (`src/lib/forecast.ts`) |
| Real APIs | Open-Meteo (live 7-day weather, no key) · Google News RSS (live agri news, no key) |
| Optional APIs | `GEMINI_API_KEY` upgrades the chatbot to generative answers; `NEWS_API_KEY` reserved |

## Pages

- `/` — Home dashboard: live price cards, mood badges, alert feed, weather widget, quick profit check
- `/prices` — 180-day history + 14-day forecast chart with confidence bands, mandi comparison table, sell alerts
- `/weather` — Real 7-day district forecasts, crop risk levels (LOW/MEDIUM/HIGH), bilingual advisories
- `/transport` — Distance × diesel × cost model → net profit per mandi, with recommendation
- `/waste-to-value` — Damaged/surplus crop → product options, revenue comparison, processing units with contacts
- `/news` — Live Karnataka agri news, AI sentiment class, market mood per crop
- `/insights` — Module 11: prediction cards with reasoning chains, rainfall×price correlation, heatmap, seasonal calendar, pre-sowing demand forecast
- `/chat` — Bilingual AI assistant grounded in live prices/weather/transport/news

## Crops & Mandis

- **Crops:** Tomato (ಟೊಮೇಟೊ) · Ragi (ರಾಗಿ) · Onion (ಈರುಳ್ಳಿ)
- **Mandis:** Kolar · Hubli (Dharwad) · Yeshwanthpur (Bengaluru) · Mysuru · Raichur

## Setup

```bash
npm install
npx drizzle-kit push        # create PostgreSQL tables
npm run dev                 # develop
npm run build && npm start  # production
```

The market-data engine (`src/lib/engine.ts`) deterministically generates an
Agmarknet-style 180-day price series per crop×mandi, persists it to PostgreSQL on
first request (`ensureMarketData`), and rolls forward one day at a time — so the
demo never breaks even fully offline. Every analysis (forecasts, alerts,
transport profits, chatbot answers) is computed from that one consistent dataset.

## Environment

Copy `.env.example` → `.env` and fill optional keys as needed.

## Data freshness & fallbacks

- Weather: Open-Meteo → 8h PostgreSQL cache → deterministic climatology fallback
- News: Google News RSS → PostgreSQL cache → curated fallback
- Chat: Gemini (if key) → built-in bilingual data-grounded intent engine
- All API routes return `source` flags so the UI can display *Live data* vs *Offline estimate*
