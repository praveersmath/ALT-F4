"use client";
// ─────────────────────────────────────────────────────────────
// Bilingual (English / ಕನ್ನಡ) internationalisation
// ─────────────────────────────────────────────────────────────
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

export type Lang = "en" | "kn";

export const STRINGS: Record<string, { en: string; kn: string }> = {
  // nav
  "nav.home": { en: "Dashboard", kn: "ಮುಖಪುಟ" },
  "nav.prices": { en: "Price Analysis", kn: "ಬೆಲೆ ವಿಶ್ಲೇಷಣೆ" },
  "nav.weather": { en: "Weather & Risk", kn: "ಹವಾಮಾನ & ಅಪಾಯ" },
  "nav.transport": { en: "Transport & Profit", kn: "ಸಾರಿಗೆ & ಲಾಭ" },
  "nav.waste": { en: "Waste-to-Value", kn: "ತ್ಯಾಜ್ಯದಿಂದ ಮೌಲ್ಯ" },
  "nav.news": { en: "News & Insights", kn: "ಸುದ್ದಿ & ಒಳನೋಟ" },
  "nav.chat": { en: "AI Chatbot", kn: "AI ಸಹಾಯಕ" },
  "nav.insights": { en: "AI Insights", kn: "AI ವಿಶ್ಲೇಷಣೆ" },

  // common
  "app.name": { en: "KrushiMitra", kn: "ಕೃಷಿಮಿತ್ರ" },
  "app.tagline": { en: "Farmer's Friend — Karnataka Agri Intelligence", kn: "ರೈತರ ಸ್ನೇಹಿತ — ಕರ್ನಾಟಕ ಕೃಷಿ ಮಾಹಿತಿ" },
  "common.loading": { en: "Loading live market data…", kn: "ತಾಜಾ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಬರುತ್ತಿದೆ…" },
  "common.perKg": { en: "/kg", kn: "/ಕೆಜಿ" },
  "common.today": { en: "Today", kn: "ಇಂದು" },
  "common.bestMandi": { en: "Best Mandi", kn: "ಉತ್ತಮ ಮಂಡಿ" },
  "common.mandi": { en: "Mandi", kn: "ಮಂಡಿ" },
  "common.crop": { en: "Crop", kn: "ಬೆಳೆ" },
  "common.price": { en: "Price", kn: "ಬೆಲೆ" },
  "common.quantity": { en: "Quantity", kn: "ಪ್ರಮಾಣ" },
  "common.kg": { en: "kg", kn: "ಕೆಜಿ" },
  "common.viewAll": { en: "View all", kn: "ಎಲ್ಲಾ ನೋಡಿ" },
  "common.risk": { en: "Risk", kn: "ಅಪಾಯ" },
  "common.LOW": { en: "LOW", kn: "ಕಡಿಮೆ" },
  "common.MEDIUM": { en: "MEDIUM", kn: "ಮಧ್ಯಮ" },
  "common.HIGH": { en: "HIGH", kn: "ಹೆಚ್ಚು" },
  "common.mood.bullish": { en: "Bullish", kn: "ಏರಿಕೆ ತ್ಸಾಹ" },
  "common.mood.neutral": { en: "Neutral", kn: "ತಟস্থ" },
  "common.mood.bearish": { en: "Bearish", kn: "ಇಳಿಕೆ ಒತ್ತಡ" },
  "common.distance": { en: "Distance", kn: "ದೂರ" },
  "common.km": { en: "km", kn: "ಕಿಮೀ" },
  "common.source.live": { en: "Live data", kn: "ತಾಜಾ ಮಾಹಿತಿ" },
  "common.source.fallback": { en: "Offline estimate", kn: "ಆಫ್‌ಲೈನ್ ಅಂದಾಜು" },
  "common.confidence": { en: "Confidence", kn: "ವಿಶ್ವಾಸಾರ್ಹತೆ" },

  // hero / dashboard
  "hero.kicker": { en: "Market Intelligence for Karnataka's Farmers", kn: "ಕರ್ನಾಟಕ ರೈತರಿಗಾಗಿ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ" },
  "hero.title": { en: "Know the price. Pick the mandi. Keep the profit.", kn: "ಬೆಲೆ ತಿಳಿಯಿರಿ. ಸರಿ ಮಂಡಿ ಆಯ್ಕೆಮಾಡಿ. ಲಾಭ ನಿಮ್ಮದಾಗಿಸಿ." },
  "hero.sub": { en: "Live APMC mandi prices, 14-day AI forecasts, weather risk alerts and profit calculators — in Kannada and English.", kn: "ತಾಜಾ ಮಂಡಿ ಬೆಲೆ, 14 ದಿನದ ಮುನ್ಸೂಚನೆ, ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ ಮತ್ತು ಲಾಭ ಲೆಕ್ಕ — ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷಿನಲ್ಲಿ." },
  "hero.cta.prices": { en: "Analyse prices", kn: "ಬೆಲೆ ನೋಡಿ" },
  "hero.cta.chat": { en: "Ask in Kannada", kn: "ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ" },
  "dash.todayPrices": { en: "Today's Mandi Prices", kn: "ಇಂದಿನ ಮಂಡಿ ಬೆಲೆ" },
  "dash.weatherNow": { en: "Weather Watch", kn: "ಹವಾಮಾನ ನೋಟ" },
  "dash.alerts": { en: "Smart Alerts", kn: "ಸ್ಮಾರ್ಟ್ ಎಚ್ಚರಿಕೆ" },
  "dash.quickCalc": { en: "Quick Profit Check", kn: "ತ್ವರಿತ ಲಾಭ ಲೆಕ್ಕ" },
  "dash.minPrice": { en: "Min", kn: "ಕನಿಷ್ಠ" },
  "dash.maxPrice": { en: "Max", kn: "ಗರಿಷ್ಠ" },
  "dash.arrivals": { en: "Arrivals", kn: "ಆಗಮನ" },
  "dash.tonnes": { en: "t", kn: "ಟನ್" },
  "dash.trend7d": { en: "7-day trend", kn: "7 ದಿನದ ಟ್ರೆಂಡ್" },
  "dash.forecast14d": { en: "14-day forecast", kn: "14 ದಿನದ ಮುನ್ಸೂಚನೆ" },
  "dash.bestToday": { en: "Best price today", kn: "ಇಂದು ಗರಿಷ್ಠ ಬೆಲೆ" },
  "dash.acrossMandis": { en: "across mandis", kn: "ಮಂಡಿಗಳಲ್ಲಿ" },

  // prices page
  "pr.title": { en: "APMC Price Analysis & Forecast", kn: "ಮಂಡಿ ಬೆಲೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಮುನ್ಸೂಚನೆ" },
  "pr.subtitle": { en: "180 days of mandi history, Holt-Winters ML forecast for the next 14 days, with confidence bands.", kn: "180 ದಿನಗಳ ಮಂಡಿ ಇತಿಹಾಸ, ಮುಂದಿನ 14 ದಿನದ ML ಮುನ್ಸೂಚನೆ (ವಿಶ್ವಾಸ ಪಟ್ಟಿಯೊಂದಿಗೆ)." },
  "pr.selectCrop": { en: "Select crop", kn: "ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ" },
  "pr.range": { en: "History range", kn: "ಇತಿಹಾಸ ಅವಧಿ" },
  "pr.days": { en: "days", kn: "ದಿನ" },
  "pr.actual": { en: "Actual price", kn: "ನಿಜ ಬೆಲೆ" },
  "pr.predicted": { en: "Predicted", kn: "ಮುನ್ಸೂಚನೆ" },
  "pr.band": { en: "Confidence band", kn: "ವಿಶ್ವಾಸ ಪಟ್ಟಿ" },
  "pr.alert": { en: "Price Alert", kn: "ಬೆಲೆ ಎಚ್ಚರಿಕೆ" },
  "pr.mandiCompare": { en: "Mandi Price Comparison", kn: "ಮಂಡಿ ಬೆಲೆ ಹೋಲಿಕೆ" },
  "pr.sellHere": { en: "Sell here", kn: "ಇಲ್ಲಿ ಮಾರಿ" },
  "pr.backtest": { en: "Model backtest accuracy", kn: "ಮಾಡೆಲ್ ಹಿಂದಿನ ಪರೀಕ್ಷಾ ನಿಖರತೆ" },
  "pr.mape": { en: "Avg error (MAPE)", kn: "ಸರಾಸರಿ ತಪ್ಪು" },
  "pr.minMax": { en: "Today's min–max", kn: "ಇಂದಿನ ಕನಿಷ್ಠ–ಗರಿಷ್ಠ" },

  // weather page
  "w.title": { en: "Weather Forecast & Crop Risk", kn: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ & ಬೆಳೆ ಅಪಾಯ" },
  "w.subtitle": { en: "Real 7-day district forecasts (Open-Meteo live feed) with AI crop-impact analysis in Kannada.", kn: "ಜಿಲ್ಲಾವಾರು 7 ದಿನಗಳ ನಿಜ ಮುನ್ಸೂಚನೆ, AI ಬೆಳೆ-ಪರಿಣಾಮ ವಿಶ್ಲೇಷಣೆಯೊಂದಿಗೆ." },
  "w.district": { en: "District", kn: "ಜಿಲ್ಲೆ" },
  "w.7day": { en: "7-Day Forecast", kn: "7 ದಿನಗಳ ಮುನ್ಸೂಚನೆ" },
  "w.rainfall": { en: "Rain", kn: "ಮಳೆ" },
  "w.humidity": { en: "Humidity", kn: "ಆರ್ದ್ರತೆ" },
  "w.wind": { en: "Wind", kn: "ಗಾಳಿ" },
  "w.cropImpact": { en: "AI Crop Impact Analysis", kn: "AI ಬೆಳೆ ಪರಿಣಾಮ ವಿಶ್ಲೇಷಣೆ" },
  "w.advisories": { en: "Advisories", kn: "ಸಲಹೆಗಳು" },
  "w.totalRain": { en: "Total rain (7d)", kn: "ಒಟ್ಟು ಮಳೆ (7ದಿ)" },
  "w.maxTemp": { en: "Peak temp", kn: "ಗರಿಷ್ಠ ತಾಪ" },
  "w.allDistricts": { en: "All Districts Risk Map", kn: "ಎಲ್ಲ ಜಿಲ್ಲೆಗಳ ಅಪಾಯ ನಕ್ಷೆ" },

  // transport page
  "t.title": { en: "Transport Cost & Profit Calculator", kn: "ಸಾರಿಗೆ ವೆಚ್ಚ & ಲಾಭ ಲೆಕ್ಕ" },
  "t.subtitle": { en: "Real distances, Karnataka diesel price and mandi economics — find where your harvest earns the most.", kn: "ನಿಜ ದೂರ, ಡೀಸೆಲ್ ದರ ಮತ್ತು ಮಂಡಿ ಲೆಕ್ಕ — ನಿಮ್ಮ ಬೆಳೆ ಎಲ್ಲಿ ಹೆಚ್ಚು ಲಾಭ ತರುತ್ತದೆ ನೋಡಿ." },
  "t.from": { en: "Your location", kn: "ನಿಮ್ಮ ಊರು" },
  "t.qty": { en: "Quantity (kg)", kn: "ಪ್ರಮಾಣ (ಕೆಜಿ)" },
  "t.calculate": { en: "Calculate Profit", kn: "ಲಾಭ ಲೆಕ್ಕ ಮಾಡಿ" },
  "t.diesel": { en: "Diesel price", kn: "ಡೀಸೆಲ್ ದರ" },
  "t.perLitre": { en: "/litre", kn: "/ಲೀಟರ್" },
  "t.results": { en: "Profit Comparison Across Mandis", kn: "ಮಂಡಿವಾರು ಲಾಭ ಹೋಲಿಕೆ" },
  "t.revenue": { en: "Revenue", kn: "ಆದಾಯ" },
  "t.transport": { en: "Transport", kn: "ಸಾರಿಗೆ" },
  "t.packaging": { en: "Packaging", kn: "ಪ್ಯಾಕಿಂಗ್" },
  "t.commission": { en: "Mandi fee (1%)", kn: "ಮಂಡಿ ಶುಲ್ಕ (1%)" },
  "t.labour": { en: "Labour & loading", kn: "ಕೂಲಿ & ಹೊರೆಯುವುದು" },
  "t.netProfit": { en: "Net Profit", kn: "ನಿವ್ವಳ ಲಾಭ" },
  "t.expectedPrice": { en: "Expected price (D+3 forecast)", kn: "ನಿರೀಕ್ಷಿತ ಬೆಲೆ (3 ದಿನದ ಮುನ್ಸೂಚನೆ)" },
  "t.recommendation": { en: "Recommendation", kn: "ಶಿಫಾರಸು" },
  "t.bestOption": { en: "Best option", kn: "ಉತ್ತಮ ಆಯ್ಕೆ" },

  // waste page
  "v.title": { en: "Waste-to-Value Converter", kn: "ತ್ಯಾಜ್ಯದಿಂದ ಮೌಲ್ಯ" },
  "v.subtitle": { en: "Damaged crop or crashed prices? Convert your harvest into products worth 3–6× more.", kn: "ಬೆಳೆ ಹಾಳಾಯಿತೇ? ಬೆಲೆ ಕುಸಿದಿತೇ? ನಿಮ್ಮ ಬೆಳೆಯನ್ನು 3–6 ಪಟ್ಟು ಮೌಲ್ಯದ ಉತ್ಪನ್ನಗಳಾಗಿ ಪರಿವರ್ತಿಸಿ." },
  "v.condition": { en: "Crop condition", kn: "ಬೆಳೆ ಸ್ಥಿತಿ" },
  "v.damaged": { en: "Damaged / Rain-hit", kn: "ಹಾಳಾದ / ಮಳೆ ಹಾನಿ" },
  "v.price_crash": { en: "Price crashed", kn: "ಬೆಲೆ ಕುಸಿತ" },
  "v.surplus": { en: "Surplus stock", kn: "ಹೆಚ್ಚುವರಿ ದಾಸ್ತಾನು" },
  "v.rawSale": { en: "Selling raw", kn: "ಕಚ್ಚಾ ಮಾರಾಟ" },
  "v.asProduct": { en: "As product", kn: "ಉತ್ಪನ್ನವಾಗಿ" },
  "v.investment": { en: "Investment /100kg", kn: "ಹೂಡಿಕೆ /100ಕೆಜಿ" },
  "v.shelfLife": { en: "Shelf life", kn: "ಉಣಬದುಕು" },
  "v.steps": { en: "Step-by-step process", kn: "ಹಂತ-ಹಂತದ ವಿಧಾನ" },
  "v.market": { en: "Where to sell", kn: "ಎಲ್ಲಿ ಮಾರುವುದು" },
  "v.nearbyUnits": { en: "Nearby Processing Units", kn: "ಹತ್ತಿರದ ಸಂಸ್ಕರಣಾ ಘಟಕಗಳು" },
  "v.revenueCompare": { en: "Revenue comparison", kn: "ಆದಾಯ ಹೋಲಿಕೆ" },
  "v.yieldNote": { en: "product from your stock", kn: "ಉತ್ಪನ್ನ ದೊರೆಯುತ್ತದೆ" },
  "v.bannerHeadline": { en: "Turn your damaged tomatoes into ketchup — earn 3× more!", kn: "ನಿಮ್ಮ ಹಾಳಾದ ಟೊಮೇಟೊವನ್ನು ಕೆಚಪ್ ಆಗಿ ಪರಿವರ್ತಿಸಿ — 3 ಪಟ್ಟು ಹೆಚ್ಚು ಲಾಭ!" },

  // news page
  "n.title": { en: "News & Market Sentiment", kn: "ಸುದ್ದಿ & ಮಾರುಕಟ್ಟೆ ಮನೋಭಾವ" },
  "n.subtitle": { en: "Live Karnataka agri-news with AI sentiment classification and farmer-action impact analysis.", kn: "ಕರ್ನಾಟಕ ಕೃಷಿ ಸುದ್ದಿಗಳು — AI ಭಾವನೆ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ರೈತರ ಕ್ರಮ ಸಲಹೆ." },
  "n.marketMood": { en: "Market Mood", kn: "ಮಾರುಕಟ್ಟೆ ಮನೋಭಾವ" },
  "n.sentiment": { en: "Sentiment", kn: "ಭಾವನೆ" },
  "n.impact": { en: "Impact for you", kn: "ನಿಮಗೆ ಪರಿಣಾಮ" },
  "n.positive": { en: "Positive", kn: "ಸಕಾರಾತ್ಮಕ" },
  "n.negative": { en: "Negative", kn: "ಋಣಾತ్మಕ" },
  "n.neutral": { en: "Neutral", kn: "ತಟস্থ" },
  "n.refresh": { en: "Refresh news", kn: "ಸುದ್ದಿ ರಿಫ್ರೆಶ್" },

  // chat page
  "c.title": { en: "KrushiMitra AI Assistant", kn: "ಕೃಷಿಮಿತ್ರ AI ಸಹಾಯಕ" },
  "c.subtitle": { en: "Ask in Kannada or English — prices, weather, transport, damaged crops. Knows every mandi in Karnataka.", kn: "ಕನ್ನಡದಲ್ಲಿ ಅಥವಾ ಇಂಗ್ಲಿಷಿನಲ್ಲಿ ಕೇಳಿ — ಬೆಲೆ, ಹವಾಮಾನ, ಸಾರಿಗೆ, ಹಾಳಾದ ಬೆಳೆ. ಕರ್ನಾಟಕದ ಪ್ರತಿ ಮಂಡಿ ತಿಳಿದಿದೆ." },
  "c.placeholder": { en: "Type your question… (e.g. best mandi for 500 kg tomato?)", kn: "ನಿಮ್ಮ ಪ್ರಶ್ನೆ ಬರೆಯಿರಿ… (ಉದಾ: 500 ಕೆಜಿ ಟೊಮೇಟೊಗೆ ಯಾವ ಮಂಡಿ?)" },
  "c.send": { en: "Send", kn: "ಕಳುಹಿಸಿ" },
  "c.thinking": { en: "Analysing market data…", kn: "ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ವಿಶ್ಲೇಷಿಸುತ್ತಿದೆ…" },
  "c.q1": { en: "Best mandi for tomato?", kn: "ಟೊಮೇಟೊಗೆ ಉತ್ತಮ ಮಂಡಿ?" },
  "c.q2": { en: "Kolar weather today?", kn: "ಕೋಲಾರ ಹವಾಮಾನ?" },
  "c.q3": { en: "Damaged tomatoes — what to do?", kn: "ಹಾಳಾದ ಟೊಮೇಟೊ — ಏನು ಮಾಡಲಿ?" },
  "c.q4": { en: "ಈರುಳ್ಳಿ ಬೆಲೆ ಎಷ್ಟು?", kn: "ಈರುಳ್ಳಿ ಬೆಲೆ ಎಷ್ಟು?" },
  "c.welcome": { en: "Namaskara! I am KrushiMitra, your agricultural assistant. Ask me about mandi prices, weather, transport profit, or damaged crop options.", kn: "ನಮಸ್ಕಾರ! ನಾನು ಕೃಷಿಮಿತ್ರ, ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ಮಂಡಿ ಬೆಲೆ, ಹವಾಮಾನ, ಸಾರಿಗೆ ಲಾಭ, ಹಾಳಾದ ಬೆಳೆ ಪರಿಹಾರ — ಏನೂ ಕೇಳಿ." },

  // insights page
  "i.title": { en: "AI Cross-Correlation Engine", kn: "AI ಸಂಬಂಧ ವಿಶ್ಲೇಷಣಾ ಯಂತ್ರ" },
  "i.subtitle": { en: "Historical + real-time data fused: rainfall × prices × arrivals × news — patterns no single dataset can reveal.", kn: "ಐತಿಹಾಸಿಕ + ತಾಜಾ ಮಾಹಿತಿ — ಮಳೆ × ಬೆಲೆ × ಆಗಮನ × ಸುದ್ದಿ. ಮರೆಮಾಚಿದ ಮಾದರಿಗಳ ಬಹಿರಂಗ." },
  "i.predictionCard": { en: "Prediction Card", kn: "ಮುನ್ಸೂಚನೆ ಕಾರ್ಡ್" },
  "i.optimistic": { en: "Optimistic", kn: "ಹೆಚ್ಚು ಸಾಧ್ಯ" },
  "i.likely": { en: "Most likely", kn: "ಹೆಚ್ಚು ನಿರೀಕ್ಷಿತ" },
  "i.pessimistic": { en: "Pessimistic", kn: "ಕಡಿಮೆ ಸಾಧ್ಯ" },
  "i.probability": { en: "probability", kn: "ಸಂಭವನೀಯತೆ" },
  "i.basedOn": { en: "Based on", kn: "ಆಧಾರಿತ" },
  "i.reasoning": { en: "Reasoning chain", kn: "ವಿಶ್ಲೇಷಣೆ ಹಂತಗಳು" },
  "i.whatIf": { en: "What-if scenarios", kn: "ಸಾಧ್ಯತೆ ಪರಿಸ್ಥಿತಿಗಳು" },
  "i.histAccuracy": { en: "Historical accuracy of similar predictions", kn: "ಇಂತಹ ಮುನ್ಸೂಚನೆಗಳ ಹಿಂದಿನ ನಿಖರತೆ" },
  "i.action": { en: "Farmer recommendation", kn: "ರೈತರಿಗೆ ಶಿಫಾರಸು" },
  "i.seasonal": { en: "Seasonal Intelligence — Kolar Tomato (Agmarknet pattern)", kn: "ಋತುಬದ್ಧ ಬುದ್ಧಿಮತ್ತೆ — ಕೋಲಾರ ಟೊಮೇಟೊ" },
  "i.correl": { en: "Rainfall × Price Correlation", kn: "ಮಳೆ × ಬೆலೆ ಸಂಬಂಧ" },
  "i.heatmap": { en: "Karnataka Price Heatmap (district grid)", kn: "ಕರ್ನಾಟಕ ಬೆಲೆ ಹೀಟ್‌ಮ್ಯಾಪ್" },
  "i.demandForecast": { en: "Pre-Sowing Demand Forecast", kn: "ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಬೇಡಿಕೆ ಮುನ್ಸೂಚನೆ" },
  "i.avoid": { en: "AVOID this season", kn: "ಈ ಸೀಸನ್‌ನಲ್ಲಿ ಬೇಡ" },
  "i.sow": { en: "SOW", kn: "ಬಿತ್ತಿ" },
  "i.expectedProfit": { en: "Expected profit / acre", kn: "ನಿರೀಕ್ಷಿತ ಲಾಭ / ಎಕರೆ" },
  "i.kharif": { en: "Kharif (Jun–Oct)", kn: "ಖಾರಿಫ್ (ಜೂನ್–ಅಕ್ಟೋ)" },
  "i.rabi": { en: "Rabi (Nov–Mar)", kn: "ರಬಿ (ನವೆ–ಮಾರ್ಚ್)" },
  "i.summer": { en: "Summer (Mar–May)", kn: "ಬೇಸಿಗೆ (ಮಾರ್ಚ್–ಮೇ)" },
  "i.calendar": { en: "Seasonal Calendar Intelligence", kn: "ಕೃಷಿ ಋತು ಕ್ಯಾಲೆಂಡರ್" },

  // footer
  "foot.disclaimer": { en: "Forecasts are statistical estimates for guidance. Verify mandi rates before transport. Built for Karnataka's farmers.", kn: "ಮುನ್ಸೂಚನೆಗಳು ಸಾಂಖ್ಯಿಕ ಅಂದಾಜು. ಸಾರಿಗೆ ಮೊದಲು ಮಂಡಿ ದರ ಪರಿಶೀಲಿಸಿ. ಕರ್ನಾಟಕ ರೈತರಿಗಾಗಿ ನಿರ್ಮಿತ." },
  "foot.sources": { en: "Data: Agmarknet-style mandi records · Open-Meteo weather · Google News RSS · NCDEX-style futures signals", kn: "ಮಾಹಿತಿ: ಮಂಡಿ ದಾಖಲೆ · Open-Meteo ಹವಾಮಾನ · Google ಸುದ್ದಿ RSS" },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  pick: (en: string, kn: string) => string;
}

const Ctx = createContext<I18nCtx>({
  lang: "en",
  setLang: () => {},
  t: (k) => k,
  pick: (en) => en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("km-lang") as Lang | null) : null;
    if (saved === "kn" || saved === "en") setLangState(saved);
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try { localStorage.setItem("km-lang", l); } catch { /* noop */ }
    document.documentElement.lang = l === "kn" ? "kn" : "en";
  }, []);

  const t = useCallback((key: string): string => {
    const s = STRINGS[key];
    if (!s) return key;
    return s[lang];
  }, [lang]);

  const pick = useCallback((en: string, kn: string) => (lang === "kn" && kn ? kn : en), [lang]);

  return <Ctx.Provider value={{ lang, setLang, t, pick }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
