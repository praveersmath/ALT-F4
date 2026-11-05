// ─────────────────────────────────────────────────────────────
// KrushiMitra reference data — Karnataka agricultural intelligence
// ─────────────────────────────────────────────────────────────

export interface Mandi {
  code: string;
  nameEn: string;
  nameKn: string;
  districtEn: string;
  districtKn: string;
  lat: number;
  lng: number;
  specialty: string; // crop codes
}

export const MANDIS: Mandi[] = [
  { code: "KOL", nameEn: "Kolar APMC", nameKn: "ಕೋಲಾರ ಮಂಡಿ", districtEn: "Kolar", districtKn: "ಕೋಲಾರ", lat: 13.1367, lng: 78.1292, specialty: "tomato" },
  { code: "HUB", nameEn: "Hubli APMC", nameKn: "ಹುಬ್ಬಳ್ಳಿ ಮಂಡಿ", districtEn: "Dharwad", districtKn: "ಧಾರವಾಡ", lat: 15.3647, lng: 75.124, specialty: "onion" },
  { code: "BLR", nameEn: "Yeshwanthpur APMC, Bengaluru", nameKn: "ಯಶವಂತಪುರ ಮಂಡಿ, ಬೆಂಗಳೂರು", districtEn: "Bengaluru Urban", districtKn: "ಬೆಂಗಳೂರು", lat: 13.028, lng: 77.5395, specialty: "tomato" },
  { code: "MYS", nameEn: "Mysuru APMC", nameKn: "ಮೈಸೂರು ಮಂಡಿ", districtEn: "Mysuru", districtKn: "ಮೈಸೂರು", lat: 12.2958, lng: 76.6394, specialty: "ragi" },
  { code: "RAI", nameEn: "Raichur APMC", nameKn: "ರಾಯಚೂರು ಮಂಡಿ", districtEn: "Raichur", districtKn: "ರಾಯಚೂರು", lat: 16.2076, lng: 77.3463, specialty: "ragi" },
];

export interface Crop {
  code: string;
  nameEn: string;
  nameKn: string;
  unit: string; // display unit
  unitKn: string;
  msp?: number; // ₹/kg if exists
  perishability: "high" | "medium" | "low";
  color: string; // accent color for UI
  bgSoft: string;
}

export const CROPS: Crop[] = [
  { code: "tomato", nameEn: "Tomato", nameKn: "ಟೊಮೇಟೊ", unit: "kg", unitKn: "ಕೆಜಿ", perishability: "high", color: "#C2402E", bgSoft: "#FBEDE9" },
  { code: "ragi", nameEn: "Ragi (Finger Millet)", nameKn: "ರಾಗಿ", unit: "kg", unitKn: "ಕೆಜಿ", msp: 42.9, perishability: "low", color: "#8A6A35", bgSoft: "#F5EEDF" },
  { code: "onion", nameEn: "Onion", nameKn: "ಈರುಳ್ಳಿ", unit: "kg", unitKn: "ಕೆಜಿ", perishability: "medium", color: "#7A4A8C", bgSoft: "#F2EAF6" },
];

export interface District {
  code: string;
  nameEn: string;
  nameKn: string;
  lat: number;
  lng: number;
  agroZone: string;
}

export const DISTRICTS: District[] = [
  { code: "KOL", nameEn: "Kolar", nameKn: "ಕೋಲಾರ", lat: 13.1367, lng: 78.1292, agroZone: "Eastern Dry Zone" },
  { code: "HUB", nameEn: "Dharwad (Hubli)", nameKn: "ಧಾರವಾಡ (ಹುಬ್ಬಳ್ಳಿ)", lat: 15.4589, lng: 75.0078, agroZone: "Northern Transition" },
  { code: "BLR", nameEn: "Bengaluru Rural", nameKn: "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ", lat: 13.1986, lng: 77.7066, agroZone: "Eastern Dry Zone" },
  { code: "MYS", nameEn: "Mysuru", nameKn: "ಮೈಸೂರು", lat: 12.2958, lng: 76.6394, agroZone: "Southern Dry Zone" },
  { code: "RAI", nameEn: "Raichur", nameKn: "ರಾಯಚೂರು", lat: 16.2076, lng: 77.3463, agroZone: "North-Eastern Dry Zone" },
];

// Farmer origin towns used by the transport calculator
export interface OriginTown {
  code: string;
  nameEn: string;
  nameKn: string;
  lat: number;
  lng: number;
}

export const ORIGIN_TOWNS: OriginTown[] = [
  { code: "CHIK", nameEn: "Chikkaballapur", nameKn: "ಚಿಕ್ಕಬಳ್ಳಾಪುರ", lat: 13.4355, lng: 77.7315 },
  { code: "TUM", nameEn: "Tumakuru", nameKn: "ತುಮಕೂರು", lat: 13.3392, lng: 77.114 },
  { code: "HAS", nameEn: "Hassan", nameKn: "ಹಾಸನ", lat: 13.0068, lng: 76.0996 },
  { code: "CHIT", nameEn: "Chitradurga", nameKn: "ಚಿತ್ರದುರ್ಗ", lat: 14.2251, lng: 76.398 },
  { code: "GAD", nameEn: "Gadag", nameKn: "ಗದಗ", lat: 15.4312, lng: 75.6297 },
  { code: "HAV", nameEn: "Haveri", nameKn: "ಹಾವೇರಿ", lat: 14.7951, lng: 75.3991 },
  { code: "MAN", nameEn: "Mandya", nameKn: "ಮಂಡ್ಯ", lat: 12.5218, lng: 76.8951 },
  { code: "RAM", nameEn: "Ramanagara", nameKn: "ರಾಮನಗರ", lat: 12.715, lng: 77.2817 },
  { code: "BEL", nameEn: "Belagavi", nameKn: "ಬೆಳಗಾವಿ", lat: 15.8497, lng: 74.4977 },
  { code: "DAV", nameEn: "Davanagere", nameKn: "ದಾವಣಗೆರೆ", lat: 14.4644, lng: 75.9218 },
  { code: "KOPP", nameEn: "Koppal", nameKn: "ಕೊಪ್ಪಳ", lat: 15.3547, lng: 76.1547 },
  { code: "MUL", nameEn: "Mulbagal", nameKn: "ಮುಳಬಾಗಿಲು", lat: 13.1637, lng: 78.3926 },
];

export const DIESEL_PRICE_INR = 87.6; // Karnataka retail diesel ₹/litre (fallback)
export const TEMPO_MILEAGE_KMPL = 12; // typical goods tempo
export const ROAD_FACTOR = 1.28; // haversine → road distance
export const PACKAGING_PER_KG = 2.0;
export const LOADING_PER_KG = 0.5;
export const UNLOADING_PER_KG = 0.5;
export const LABOUR_PER_KG = 0.5;
export const MANDI_COMMISSION_PCT = 0.01;

// ── Waste-to-Value catalog ────────────────────────────────────
export interface ValueProduct {
  id: string;
  cropCode: string;
  condition: "damaged" | "price_crash" | "surplus";
  productEn: string;
  productKn: string;
  revenueMultiple: number; // vs raw selling
  investmentPer100kg: number; // ₹
  shelfLifeEn: string;
  shelfLifeKn: string;
  marketEn: string;
  stepsEn: string[];
  stepsKn: string[];
  yieldPct: number; // kg of product from 100kg raw
  sellPricePerKg: number; // ₹/kg of finished product
}

export const VALUE_PRODUCTS: ValueProduct[] = [
  // TOMATO
  {
    id: "tom-paste", cropCode: "tomato", condition: "damaged",
    productEn: "Tomato Paste / Puree", productKn: "ಟೊಮೇಟೊ ಪೇಸ್ಟ್",
    revenueMultiple: 3.2, investmentPer100kg: 800, shelfLifeEn: "6 months (sealed jars)",
    shelfLifeKn: "6 ತಿಂಗಳು", marketEn: "Local kirana stores, HOPCOMS, caterers",
    stepsEn: ["Sort — remove fully rotten fruits, keep damaged-but-firm ones", "Wash and crush, boil 15 min", "Strain through muslin / pulper", "Cook down to half volume, add 1% salt + citric acid", "Fill hot into sterilized jars, seal", "Label with date — sell within 6 months"],
    stepsKn: ["ಹಾಳಾದ ಆದರೂ ಗಟ್ಟಿಯಾದ ಟೊಮೇಟೊ ಆಯ್ಕೆ ಮಾಡಿ", "ತೊಳೆದು ಕುದಿಸಿ — 15 ನಿಮಿಷ", "ಚಾದಿ/ಮಸ್ಲಿನ್‌ನಿಂದ ಶೇಧಿಸಿ", "ಅರ್ಧ ಪರಿಮಾಣಕ್ಕೆ ಕುದಿಸಿ, ಉಪ್ಪು ಸೇರಿಸಿ", "ಬಾಟಲಿಗೆ ತುಂಬಿಸಿ, ಮುಚ್ಚಿ", "6 ತಿಂಗಳಲ್ಲಿ ಮಾರಾಟ ಮಾಡಿ"],
    yieldPct: 35, sellPricePerKg: 92,
  },
  {
    id: "tom-ketchup", cropCode: "tomato", condition: "damaged",
    productEn: "Tomato Ketchup / Sauce", productKn: "ಟೊಮೇಟೊ ಕೆಚಪ್",
    revenueMultiple: 3.8, investmentPer100kg: 1500, shelfLifeEn: "9–12 months",
    shelfLifeKn: "9–12 ತಿಂಗಳು", marketEn: "Bakeries, hotels, college canteens, online",
    stepsEn: ["Make pulp as for paste", "Add vinegar, sugar, spice mix per FSSAI recipe", "Cook to 28° Brix thickness", "Fill in squeeze bottles", "Get FSSAI registration (₹100/yr) for shop sales"],
    stepsKn: ["ಪೇಸ್ಟ್ ತಯಾರಿಸಿ", "ವಿನಿಗರ್, ಸಕ್ಕರೆ, ಮಸಾಲೆ ಸೇರಿಸಿ", "ದಪ್ಪವಾಗುವವರೆಗೆ ಕುದಿಸಿ", "ಬಾಟಲಿಗೆ ತುಂಬಿಸಿ", "FSSAI ನೋಂದಣಿ ಪಡೆಯಿರಿ"],
    yieldPct: 40, sellPricePerKg: 110,
  },
  {
    id: "tom-dried", cropCode: "tomato", condition: "price_crash",
    productEn: "Sun-dried Tomato Flakes", productKn: "ಬಿಸಿಲಲ್ಲಿ ಒಣಗಿಸಿದ ಟೊಮೇಟೊ",
    revenueMultiple: 5.5, investmentPer100kg: 500, shelfLifeEn: "12 months (airtight)",
    shelfLifeKn: "12 ತಿಂಗಳು", marketEn: "Premium: online, organic stores, Bengaluru restaurants",
    stepsEn: ["Slice firm tomatoes 5mm thick", "Sprinkle salt, lay on clean mesh trays", "Sun-dry 3–4 days (or solar dryer, 1.5 days)", "Pack airtight with food-grade pouch", "List on Amazon/GoCoop/FPO portal"],
    stepsKn: ["ಟೊಮೇಟೊವನ್ನು 5ಮಿಮೀ ತೆಳ ಕಡಚಿ", "ಉಪ್ಪು ಬಿಚ್ಚಿ, ಜಾಲಿ ಹಂಚಿಗೆ ಜಮಾಯಿಸಿ", "3–4 ದಿನ ಬಿಸಿಲಲ್ಲಿ ಒಣಗಿಸಿ", "ಗಾಳಿಹೊಕ್ಕದ ಪೌಚ್‌ನಲ್ಲಿ ಮುಚ್ಚಿ", "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಮಾರಿ"],
    yieldPct: 8, sellPricePerKg: 900,
  },
  {
    id: "tom-powder", cropCode: "tomato", condition: "surplus",
    productEn: "Tomato Powder", productKn: "ಟೊಮೇಟೊ ಪುಡಿ",
    revenueMultiple: 6.2, investmentPer100kg: 2200, shelfLifeEn: "12 months",
    shelfLifeKn: "12 ತಿಂಗಳು", marketEn: "Instant-food industry, masala companies (MTR, Aachi buy bulk)",
    stepsEn: ["Dry slices fully (solar/mechanical dryer)", "Grind fine, sieve", "Add anti-caking agent", "Vacuum pack in 5kg liners", "Ship to food processors — contact list below"],
    stepsKn: ["ಪೂರ್ತಿ ಒಣಗಿಸಿ", "ಸಣ್ಣದಾಗಿ ರುಬ್ಬಿ", "ಪ್ಯಾಕ್ ಮಾಡಿ", "ಆಹಾರ ಘಟಕಗಳಿಗೆ ಕೊಡಿ"],
    yieldPct: 7, sellPricePerKg: 1050,
  },
  // RAGI
  {
    id: "rag-flour", cropCode: "ragi", condition: "price_crash",
    productEn: "Ragi Flour (ರಾಗಿ ಹಿಟ್ಟು)", productKn: "ರಾಗಿ ಹಿಟ್ಟು",
    revenueMultiple: 1.9, investmentPer100kg: 600, shelfLifeEn: "4 months",
    shelfLifeKn: "4 ತಿಂಗಳು", marketEn: "Direct retail, FPO brand, Bengaluru organic stores",
    stepsEn: ["Clean, destone the grain", "Mill at nearest flour mill (₹2/kg)", "Sieve fine, pack 1kg/5kg pouches", "Print simple label with date + phone", "Sell at 2× mandi price direct"],
    stepsKn: ["ರಾಗಿ ಸ್ವಚ್ಛಗೊಳಿಸಿ", "ಗಿರಣಿಯಲ್ಲಿ ಹಿಟ್ಟು ಮಾಡಿಸಿ", "1/5 ಕೆಜಿ ಪೌಚ್ ಪ್ಯಾಕ್ ಮಾಡಿ", "ಲೇಬಲ್ ಅಂಟಿಸಿ", "ನೇರ ಮಾರಾಟ — 2 ಪಟ್ಟು ಬೆಲೆ"],
    yieldPct: 96, sellPricePerKg: 78,
  },
  {
    id: "rag-malt", cropCode: "ragi", condition: "surplus",
    productEn: "Ragi Malt (Health Drink)", productKn: "ರಾಗಿ ಮಾಲ್ಟ್",
    revenueMultiple: 3.4, investmentPer100kg: 1800, shelfLifeEn: "9 months",
    shelfLifeKn: "9 ತಿಂಗಳು", marketEn: "Health-food market exploding — gyms, schools, IT parks",
    stepsEn: ["Soak ragi 12 hrs, germinate 24 hrs in cloth", "Dry the sprouted grain", "Roast & mill fine", "Blend: 70% malt + 20% jaggery + cardamom", "Pack, brand, sell at ₹220/kg"],
    stepsKn: ["ರಾಗಿ ನೆನೆಸಿ, ಮೊಳಕೆಯೊಡಿಸಿ", "ಒಣಗಿಸಿ, ಹುರಿದು ಹಿಟ್ಟು ಮಾಡಿ", "ಬೆಲ್ಲ, ಏಲಕ್ಕಿ ಬೆರೆಸಿ", "ಪ್ಯಾಕ್ ಮಾಡಿ ₹220/ಕೆಜಿಗೆ ಮಾರಿ"],
    yieldPct: 88, sellPricePerKg: 165,
  },
  {
    id: "rag-cookies", cropCode: "ragi", condition: "surplus",
    productEn: "Ragi Cookies / Biscuits", productKn: "ರಾಗಿ ಬಿಸ್ಕಿಟ್",
    revenueMultiple: 4.6, investmentPer100kg: 3500, shelfLifeEn: "3 months",
    shelfLifeKn: "3 ತಿಂಗಳು", marketEn: "Urban premium — tie up with bakeries or SHG kitchen",
    stepsEn: ["Partner with local bakery / SHG (revenue share)", "Ragi flour + butter + jaggery recipe", "Bake, pack in 200g boxes", "Sell via schools, offices, online"],
    stepsKn: ["ಬೇಕರಿ ಸಹಕಾರ ಪಡೆಯಿರಿ", "ರಾಗಿ ಹಿಟ್ಟು, ಬೆಣ್ಣೆ, ಬೆಲ್ಲ — ಬೇಕ್ ಮಾಡಿ", "200ಗ್ರಾ ಪ್ಯಾಕ್", " ಶಾಲೆ, ಆಫೀಸು, ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಮಾರಿ"],
    yieldPct: 120, sellPricePerKg: 320,
  },
  {
    id: "rag-baby", cropCode: "ragi", condition: "price_crash",
    productEn: "Ragi Baby Food Mix", productKn: "ರಾಗಿ ಮಗು ಆಹಾರ",
    revenueMultiple: 5.1, investmentPer100kg: 2600, shelfLifeEn: "6 months",
    shelfLifeKn: "6 ತಿಂಗಳು", marketEn: "Huge infant-food market — pediatricians recommend ragi",
    stepsEn: ["Sprout + dry ragi (as malt)", "Blend with roasted green-gram dal, rice", "Add cardamom, no sugar", "FSSAI license needed (₹2,000)", "Pack 500g tins — sell ₹450/kg"],
    stepsKn: ["ಮೊಳಕೆ ರಾಗಿ + ಹೆಸರು ಕಾಳು ಬ್ಲೆಂಡ್", "ಸಕ್ಕರೆ ಬೇಡ, ಏಲಕ್ಕಿ ಸೇರಿಸಿ", "FSSAI ಪರವಾನಗಿ", "₹450/ಕೆಜಿಗೆ ಮಾರಿ"],
    yieldPct: 85, sellPricePerKg: 440,
  },
  // ONION
  {
    id: "oni-powder", cropCode: "onion", condition: "damaged",
    productEn: "Onion Powder", productKn: "ಈರುಳ್ಳಿ ಪುಡಿ",
    revenueMultiple: 5.8, investmentPer100kg: 2400, shelfLifeEn: "12 months",
    shelfLifeKn: "12 ತಿಂಗಳು", marketEn: "Spice industry buys bulk — Everest, MDH suppliers, exporters",
    stepsEn: ["Peel, slice onions thin", "Dehydrate at 60°C (solar dryer works)", "Grind, sieve 60-mesh", "Vacuum pack — moisture is the enemy", "Quote ₹190/kg to spice grinders"],
    stepsKn: ["ಸಿಪ್ಪೆ ಸುಲಿದು ತೆಳು ಕಡಚಿ", "ಸೋಲಾರ್ ಡ್ರೈಯರ್‌ನಲ್ಲಿ ಒಣಗಿಸಿ", "ಪುಡಿ ಮಾಡಿ", "ವ್ಯಾಕ್ಯೂಮ್ ಪ್ಯಾಕ್", "ಮಸಾಲೆ ಘಟಕಗಳಿಗೆ ₹190/ಕೆಜಿ"],
    yieldPct: 10, sellPricePerKg: 230,
  },
  {
    id: "oni-flakes", cropCode: "onion", condition: "surplus",
    productEn: "Dehydrated Onion Flakes", productKn: "ಒಣ ಈರುಳ್ಳಿ ಹೊಳೆ",
    revenueMultiple: 4.9, investmentPer100kg: 1600, shelfLifeEn: "12 months",
    shelfLifeKn: "12 ತಿಂಗಳು", marketEn: "Export quality — Gujarat exporters buy from Karnataka",
    stepsEn: ["Slice 3–4mm uniform", "Dehydrate to <6% moisture", "Grade by size, pack in 10kg cartons", "Contact exporters in Mahuva/Palghar or Bengaluru"],
    stepsKn: ["ಸಮಾನವಾಗಿ ಕಡಚಿ", "ಪೂರ್ತಿ ಒಣಗಿಸಿ", "ಗ್ರೇಡ್ ಮಾಡಿ ಪ್ಯಾಕ್ ಮಾಡಿ", "ರಫ್ತುದಾರರಿಗೆ ಕರೆ ಮಾಡಿ"],
    yieldPct: 11, sellPricePerKg: 210,
  },
  {
    id: "oni-paste", cropCode: "onion", condition: "damaged",
    productEn: "Onion Paste (Ready-to-cook)", productKn: "ಈರುಳ್ಳಿ ಪೇಸ್ಟ್",
    revenueMultiple: 3.4, investmentPer100kg: 1200, shelfLifeEn: "4 months (chilled)",
    shelfLifeKn: "4 ತಿಂಗಳು (ಶೀತ)", marketEn: "Hotels, hostels, cloud kitchens in Bengaluru/Hubli",
    stepsEn: ["Peel + wash bulbs (remove spoiled layers)", "Grind with 2% salt + permitted preservative", "Pack 1kg/5kg food-grade pouches", "Cold-chain delivery to kitchens", "₹95/kg vs raw ₹15 — kitchens save labour"],
    stepsKn: ["ಸಿಪ್ಪೆ ಸುಲಿದು ಗ್ರೈಂಡ್ ಮಾಡಿ", "ಉಪ್ಪು ಸೇರಿಸಿ", "ಪೌಚ್ ಪ್ಯಾಕ್", "ಹೋಟೆಲ್‌ಗಳಿಗೆ ₹95/ಕೆಜಿ"],
    yieldPct: 70, sellPricePerKg: 95,
  },
  {
    id: "oni-compost", cropCode: "onion", condition: "damaged",
    productEn: "Organic Compost", productKn: "ಸಾವಯವ ಗೊಬ್ಬರ",
    revenueMultiple: 1.6, investmentPer100kg: 300, shelfLifeEn: "Indefinite",
    shelfLifeKn: "ಅನಿಯಮಿತ", marketEn: "Use on own farm or sell ₹8/kg to estates",
    stepsEn: ["Shred spoiled onions", "Layer with dry leaves + cow dung slurry", "Turn every 10 days", "Ready in 45 days — NPK-rich compost", "Saves ₹4,000/acre fertilizer cost"],
    stepsKn: ["ಹಾಳಾದ ಈರುಳ್ಳಿ ಸಿಗ್ಗಿ ಮಾಡಿ", "ಎಲೆ + ಗೊಬ್ಬರ ಪದರ", "45 ದಿನ ಗೊಬ್ಬರ ಸಿದ್ಧ", "ಜಮೀನಿಗೆ ಹಾಕಿ ಅಥವಾ ಮಾರಿ"],
    yieldPct: 55, sellPricePerKg: 8,
  },
];

// ── Food processing units in Karnataka ────────────────────────
export interface ProcessingUnit {
  id: string;
  name: string;
  districtEn: string;
  districtKn: string;
  lat: number;
  lng: number;
  phone: string;
  handlesEn: string;
  handlesKn: string;
  crops: string[];
}

export const PROCESSING_UNITS: ProcessingUnit[] = [
  { id: "u1", name: "Kolar Agro Foods Cluster (CFTPC)", districtEn: "Kolar", districtKn: "ಕೋಲಾರ", lat: 13.14, lng: 78.11, phone: "08152-243210", handlesEn: "Tomato paste, puree, powder", handlesKn: "ಟೊಮೇಟೊ ಪೇಸ್ಟ್, ಪುಡಿ", crops: ["tomato"] },
  { id: "u2", name: "Sri Matha Food Products", districtEn: "Mysuru", districtKn: "ಮೈಸೂರು", lat: 12.33, lng: 76.61, phone: "0821-2458841", handlesEn: "Ketchup, sauces, pickles", handlesKn: "ಕೆಚಪ್, ಸಾಸ್", crops: ["tomato", "onion"] },
  { id: "u3", name: "Hubli Dehydration Unit (KIADB)", districtEn: "Dharwad", districtKn: "ಧಾರವಾಡ", lat: 15.37, lng: 75.12, phone: "0836-2447780", handlesEn: "Onion flakes, garlic, powder", handlesKn: "ಈರುಳ್ಳಿ ಹೊಳೆ, ಪುಡಿ", crops: ["onion"] },
  { id: "u4", name: "Sahaja Samrudha Organics", districtEn: "Bengaluru", districtKn: "ಬೆಂಗಳೂರು", lat: 12.97, lng: 77.59, phone: "080-26729853", handlesEn: "Ragi flour, malt, millet mixes", handlesKn: "ರಾಗಿ ಹಿಟ್ಟು, ಮಾಲ್ಟ್", crops: ["ragi"] },
  { id: "u5", name: "Akshayakalpa Farm Foods (contract)", districtEn: "Tumakuru", districtKn: "ತುಮಕೂರು", lat: 13.34, lng: 77.1, phone: "0816-2290560", handlesEn: "Millet bakery, cookies", handlesKn: "ಸಿರಿಧಾನ್ಯ ಬೇಕರಿ", crops: ["ragi"] },
  { id: "u6", name: "Raichur Millet Processing Zone", districtEn: "Raichur", districtKn: "ರಾಯಚೂರು", lat: 16.2, lng: 77.36, phone: "08532-226012", handlesEn: "Ragi cleaning, grading, flour", handlesKn: "ರಾಗಿ ಹಿಟ್ಟು, ಗ್ರೇಡಿಂಗ್", crops: ["ragi"] },
  { id: "u7", name: "Gadag Spices Cluster", districtEn: "Gadag", districtKn: "ಗದಗ", lat: 15.43, lng: 75.63, phone: "08372-237555", handlesEn: "Onion powder, spice blending", handlesKn: "ಈರುಳ್ಳಿ ಪುಡಿ, ಮಸಾಲೆ", crops: ["onion"] },
  { id: "u8", name: "Nandini KMF Fruit & Veg Unit", districtEn: "Bengaluru", districtKn: "ಬೆಂಗಳೂರು", lat: 13.02, lng: 77.51, phone: "080-23445200", handlesEn: "Tomato crushing, ready mixes", handlesKn: "ಟೊಮೇಟೊ ಕ್ರಷಿಂಗ್", crops: ["tomato", "onion"] },
];

// ── Historical monthly reference (Agmarknet-style, Kolar tomato, ₹/kg)
export const KOLAR_TOMATO_HISTORY: Record<number, Record<string, number | null>> = {
  2018: { Jan: 12, Apr: 8, Jun: 35, Aug: 45, Oct: 22, Dec: 15 },
  2019: { Jan: 18, Apr: 10, Jun: 28, Aug: 52, Oct: 30, Dec: 20 },
  2020: { Jan: 25, Apr: 15, Jun: 42, Aug: 38, Oct: 55, Dec: 35 },
  2021: { Jan: 14, Apr: 22, Jun: 30, Aug: 60, Oct: 28, Dec: 18 },
  2022: { Jan: 20, Apr: 12, Jun: 48, Aug: 72, Oct: 35, Dec: 25 },
  2023: { Jan: 30, Apr: 18, Jun: 55, Aug: 85, Oct: 40, Dec: 22 },
  2024: { Jan: 22, Apr: 25, Jun: 60, Aug: 78, Oct: 38, Dec: 28 },
};

export const CROP_DEMAND_FORECAST = [
  {
    cropCode: "onion", confidence: 82, supplyGap: -7000, priceRangeEn: "₹24–34/kg",
    driversEn: ["Festival & wedding season demand", "Export inquiries from Bangladesh", "Lower sowing reported in parts of N. Karnataka"],
    risksEn: ["Possible export policy change (15% probability)", "Unseasonal monsoon rain"],
    profitPerAcre: 85000,
  },
  {
    cropCode: "ragi", confidence: 78, supplyGap: -12000, priceRangeEn: "₹42–48/kg",
    driversEn: ["State area under ragi down 34% since 2010", "MSP ₹42.90/kg guarantees floor", "Health-food demand rising in Bengaluru"],
    risksEn: ["Import of millets from neighbouring states"],
    profitPerAcre: 38000,
  },
  {
    cropCode: "tomato", confidence: 64, supplyGap: 9000, priceRangeEn: "₹10–20/kg",
    driversEn: ["30% more farmers planning tomato this season", "Andhra supply overlaps in Nov–Dec"],
    risksEn: ["Oversupply crash to ₹8–12/kg likely"],
    profitPerAcre: 15000,
  },
];
