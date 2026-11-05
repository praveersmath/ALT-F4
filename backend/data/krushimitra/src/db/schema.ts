import {
  pgTable,
  serial,
  text,
  real,
  date,
  timestamp,
  jsonb,
  integer,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/**
 * KrushiMitra — Agricultural Market Intelligence for Karnataka
 * Dynamic data tables. Reference data (mandis, crops, processing units)
 * lives in src/lib/constants.ts as typed constants.
 */

export const priceRecords = pgTable(
  "price_records",
  {
    id: serial("id").primaryKey(),
    date: date("date").notNull(), // YYYY-MM-DD (IST)
    mandiCode: text("mandi_code").notNull(),
    cropCode: text("crop_code").notNull(),
    minPrice: real("min_price").notNull(), // ₹ / kg
    maxPrice: real("max_price").notNull(),
    modalPrice: real("modal_price").notNull(),
    arrivals: real("arrivals_tonnes").notNull(),
  },
  (t) => [
    uniqueIndex("price_unique").on(t.date, t.mandiCode, t.cropCode),
    index("price_lookup").on(t.cropCode, t.mandiCode, t.date),
  ]
);

export const weatherCache = pgTable("weather_cache", {
  id: serial("id").primaryKey(),
  districtCode: text("district_code").notNull(),
  payload: jsonb("payload").notNull(),
  source: text("source").notNull().default("open-meteo"),
  fetchedAt: timestamp("fetched_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const newsArticles = pgTable(
  "news_articles",
  {
    id: serial("id").primaryKey(),
    urlHash: text("url_hash").notNull(),
    title: text("title").notNull(),
    source: text("source").notNull(),
    url: text("url").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    cropCode: text("crop_code").notNull().default("general"),
    sentiment: text("sentiment").notNull().default("neutral"),
    impactEn: text("impact_en").notNull().default(""),
    impactKn: text("impact_kn").notNull().default(""),
    fetchedAt: timestamp("fetched_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [uniqueIndex("news_url_hash").on(t.urlHash)]
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: serial("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    role: text("role").notNull(), // user | assistant
    lang: text("lang").notNull().default("en"),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("chat_session").on(t.sessionId, t.createdAt)]
);

export const alerts = pgTable(
  "alerts",
  {
    id: serial("id").primaryKey(),
    kind: text("kind").notNull(), // price | weather | news | scheme
    severity: text("severity").notNull().default("info"), // info | warning | critical
    cropCode: text("crop_code"),
    mandiCode: text("mandi_code"),
    messageEn: text("message_en").notNull(),
    messageKn: text("message_kn").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
  },
  (t) => [index("alerts_active").on(t.kind, t.createdAt)]
);

export const predictionLogs = pgTable(
  "prediction_logs",
  {
    id: serial("id").primaryKey(),
    cropCode: text("crop_code").notNull(),
    mandiCode: text("mandi_code").notNull(),
    predictedFor: date("predicted_for").notNull(),
    horizonDays: integer("horizon_days").notNull(),
    predictedPrice: real("predicted_price").notNull(),
    actualPrice: real("actual_price"),
    errorPct: real("error_pct"),
    confidence: real("confidence").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("pred_lookup").on(t.cropCode, t.mandiCode, t.predictedFor)]
);
