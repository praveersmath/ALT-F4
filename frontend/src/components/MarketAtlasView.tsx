import React, { useState } from "react";
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Info,
  Layers,
  TrendingUp,
  Truck,
  Check,
  Building,
  ShoppingBag,
  Sprout,
} from "lucide-react";
import type { MarketInfo } from "../contracts/types";

interface MarketAtlasViewProps {
  markets: MarketInfo[];
  selectedCrop: string;
  setSelectedCrop: (crop: string) => void;
  selectedMarketId: number;
  setSelectedMarketId: (id: number) => void;
  selectedDistrict: string;
  setSelectedDistrict: (dist: string) => void;
  onNavigateToTab?: (tab: string) => void;
  language: "en" | "kn";
}

export interface ApmcRegionalAnalysis {
  id: number;
  name: string;
  kannadaName: string;
  district: string;
  x: number;
  y: number;
  zone: string;
  tier: string;
  established: string;
  modalPrice: number;
  arrivalsQtl: number;
  specialties: string[];
  giProducts?: string;
  infrastructure: {
    auctionHalls: number;
    electronicWeighbridges: number;
    coldStorageCapacityMt: number;
    eNamIntegrated: boolean;
    testingLab: boolean;
  };
  briefAnalysis: string;
}

export const APMC_MAP_POINTS: ApmcRegionalAnalysis[] = [
  {
    id: 1,
    name: "Bengaluru (Binny Mill)",
    kannadaName: "ಬೆಂಗಳೂರು (ಬಿನ್ನಿ ಮಿಲ್)",
    district: "Bengaluru Urban",
    x: 425,
    y: 555,
    zone: "South Interior / Metropolitan Consumption Hub",
    tier: "Principal Market Yard (Grade-A)",
    established: "Est. 1884 (Mysore Kingdom)",
    modalPrice: 2450,
    arrivalsQtl: 3200,
    specialties: ["Vegetables", "Paddy / Rice", "Fruits", "Food Grains"],
    giProducts: "Bangalore Blue Grapes, Bangalore Rose Onion",
    infrastructure: {
      auctionHalls: 14,
      electronicWeighbridges: 8,
      coldStorageCapacityMt: 45000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Karnataka's premier urban consumption clearing terminal with direct rail & highway conduits. Acts as the primary state price-discovery benchmark where fresh horticultural arrivals from Kolar, Ramanagara, and Mandya are absorbed by metropolitan retail and institutional buyers.",
  },
  {
    id: 2,
    name: "Kolar Mandi",
    kannadaName: "ಕೋಲಾರ ಮಂಡಿ",
    district: "Kolar",
    x: 495,
    y: 535,
    zone: "Eastern Dry Zone (Alfisols / Red Loams)",
    tier: "Specialized Horticultural Mega-Terminal",
    established: "Est. 1948",
    modalPrice: 2520,
    arrivalsQtl: 4800,
    specialties: ["Tomato", "Mango", "Potato", "Vegetables"],
    giProducts: "Bangalore Rose Onion (Chikkaballapura / Kolar belt)",
    infrastructure: {
      auctionHalls: 18,
      electronicWeighbridges: 12,
      coldStorageCapacityMt: 28000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Asia's second-largest tomato terminal handling over 1,500 tonnes of fresh produce daily during peak harvest. Farmers utilize micro-drip borewell horticulture across drought-prone red loams, dispatching refrigerated crates as far as Delhi, Kolkata, and Dhaka.",
  },
  {
    id: 3,
    name: "Hubballi APMC (Amaragol)",
    kannadaName: "ಹುಬ್ಬಳ್ಳಿ ಎಪಿಎಂಸಿ (ಅಮರಗೋಳ)",
    district: "Dharwad",
    x: 165,
    y: 275,
    zone: "Northern Transition Zone (Vertisols / Medium Black)",
    tier: "Principal Multi-Commodity Terminal",
    established: "Est. 1928 (Bombay Act)",
    modalPrice: 2380,
    arrivalsQtl: 3600,
    specialties: ["Cotton", "Onion", "Bengal Gram", "Maize", "Chilli"],
    giProducts: "Dharwad Pedha, Byadgi Chilli transit link",
    infrastructure: {
      auctionHalls: 16,
      electronicWeighbridges: 10,
      coldStorageCapacityMt: 35000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "North Karnataka's commercial trade capital and the sprawling Amaragol market yard (one of India's largest by acreage). Central clearinghouse connecting Kittur Karnataka and Kalyana Karnataka dryland pulses, cotton bales, and kharif red onions with Goa and Mumbai processors.",
  },
  {
    id: 4,
    name: "Belagavi APMC",
    kannadaName: "ಬೆಳಗಾವಿ ಎಪಿಎಂಸಿ",
    district: "Belagavi",
    x: 95,
    y: 230,
    zone: "Northern Transition / Ghataprabha Basin",
    tier: "Tri-State Strategic Border Terminal",
    established: "Est. 1935",
    modalPrice: 2410,
    arrivalsQtl: 2900,
    specialties: ["Sugarcane / Jaggery", "Wheat", "Maize", "Vegetables", "Soybean"],
    giProducts: "Belgaum Kunda, Kolhapur Border Jaggery",
    infrastructure: {
      auctionHalls: 12,
      electronicWeighbridges: 7,
      coldStorageCapacityMt: 24000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Gateway market yard commanding the fertile Krishna-Ghataprabha-Malaprabha river basins. Operates as an energetic cross-border trading platform linking Maharashtra (Kolhapur/Sangli) and Goa coastal demand with northern Karnataka's rich sugarcane, jaggery, and kharif grain harvests.",
  },
  {
    id: 5,
    name: "Mysuru Bandipalya",
    kannadaName: "ಮೈಸೂರು ಬಂಡಿಪಾಳ್ಯ",
    district: "Mysuru",
    x: 320,
    y: 625,
    zone: "Southern Dry / Cauvery Basin",
    tier: "Heritage Principal Regulated Yard",
    established: "Est. 1912 (Nalvadi Krishnaraja Wadiyar)",
    modalPrice: 2480,
    arrivalsQtl: 2750,
    specialties: ["Paddy / Rice", "Jaggery", "Ginger", "Turmeric", "Banana"],
    giProducts: "Nanjangud Rasabale, Mysore Betel Leaf, Mysore Sandal",
    infrastructure: {
      auctionHalls: 10,
      electronicWeighbridges: 6,
      coldStorageCapacityMt: 18000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Heritage agricultural yard modernised along the Outer Ring Road at Bandipalya. Anchors the Kabini and Cauvery canal-irrigated command areas, celebrated for premium Nanjangud horticultural crops, scented paddy varieties, and year-round ginger trade with Kerala.",
  },
  {
    id: 6,
    name: "Davanagere APMC",
    kannadaName: "ದಾವಣಗೆರೆ ಎಪಿಎಂಸಿ",
    district: "Davanagere",
    x: 260,
    y: 375,
    zone: "Central Dry Zone (Bhadra Canal Command)",
    tier: "National Maize & Foodgrain Nexus",
    established: "Est. 1954",
    modalPrice: 2400,
    arrivalsQtl: 2400,
    specialties: ["Maize", "Paddy", "Cotton", "Arecanut", "Pomegranate"],
    giProducts: "Davanagere Benne Dosa Rice, Cotton Fluff",
    infrastructure: {
      auctionHalls: 11,
      electronicWeighbridges: 8,
      coldStorageCapacityMt: 22000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Known as the 'Manchester of Karnataka', Davanagere APMC is the undisputed maize capital of South India. The terminal coordinates bulk feed-mill supply chains, starch industrial processing, and Bhadra-irrigated Sona Masuri paddy clearing across Central Karnataka.",
  },
  {
    id: 7,
    name: "Shimoga APMC",
    kannadaName: "ಶಿವಮೊಗ್ಗ ಎಪಿಎಂಸಿ",
    district: "Shimoga",
    x: 190,
    y: 440,
    zone: "Southern Transition / Malnad Gateway",
    tier: "Principal Arecanut & Forest Produce Terminal",
    established: "Est. 1961",
    modalPrice: 2430,
    arrivalsQtl: 2100,
    specialties: ["Arecanut (Rashi/Bette)", "Paddy", "Ginger", "Pepper"],
    giProducts: "Malnad Arecanut, Sharavathi Valley Spices",
    infrastructure: {
      auctionHalls: 9,
      electronicWeighbridges: 5,
      coldStorageCapacityMt: 16000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Primary commercial nerve-centre of the verdant Malnad agro-climatic zone. Specializes in electronic tender auctions of red and white Arecanut, black pepper, and high-yielding Tunga-Bhadra paddy varieties cultivated in lateritic soils.",
  },
  {
    id: 8,
    name: "Tumakuru APMC",
    kannadaName: "ತುಮಕೂರು ಎಪಿಎಂಸಿ",
    district: "Tumakuru",
    x: 375,
    y: 500,
    zone: "Central Dry Zone (Red Sandy Loams)",
    tier: "Coconut & Oilseed Hub",
    established: "Est. 1958",
    modalPrice: 2420,
    arrivalsQtl: 2350,
    specialties: ["Coconut / Copra", "Ragi", "Groundnut", "Tamarind"],
    giProducts: "Tiptur Copra (Dry Coconut)",
    infrastructure: {
      auctionHalls: 8,
      electronicWeighbridges: 5,
      coldStorageCapacityMt: 19000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Strategic central terminal famous for its Tiptur copra sub-market and dryland ragi auctions. Tumakuru acts as the industrial collection buffer for oilseeds and millets entering the Bengaluru metropolitan industrial belt.",
  },
  {
    id: 9,
    name: "Mandya APMC",
    kannadaName: "ಮಂಡ್ಯ ಎಪಿಎಂಸಿ",
    district: "Mandya",
    x: 340,
    y: 585,
    zone: "Southern Dry / KRS Visvesvaraya Command",
    tier: "Sugar Bowl & Jaggery Exchange",
    established: "Est. 1941",
    modalPrice: 2460,
    arrivalsQtl: 2150,
    specialties: ["Sugarcane / Jaggery", "Paddy", "Banana", "Coconut"],
    giProducts: "Mandya Golden Organic Jaggery",
    infrastructure: {
      auctionHalls: 10,
      electronicWeighbridges: 6,
      coldStorageCapacityMt: 14000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Heartland of Karnataka's sugarcane co-operative economy irrigated by the historic Krishnarajasagara Visvesvaraya canal system. Houses the state's largest open jaggery auction yards, with regular dispatches of chemical-free brown sugar to North India and exports.",
  },
  {
    id: 10,
    name: "Hassan APMC",
    kannadaName: "ಹಾಸನ ಎಪಿಎಂಸಿ",
    district: "Hassan",
    x: 255,
    y: 540,
    zone: "Hilly & Southern Transition Zone",
    tier: "Seed Potato & Spices Terminal",
    established: "Est. 1952",
    modalPrice: 2390,
    arrivalsQtl: 1950,
    specialties: ["Potato", "Coffee (Arabica/Robusta)", "Maize", "Cardamom"],
    giProducts: "Coorg / Hassan Green Cardamom, Bababudangiri Coffee",
    infrastructure: {
      auctionHalls: 8,
      electronicWeighbridges: 5,
      coldStorageCapacityMt: 32000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Foremost potato seed multiplication and plantation crops yard in Karnataka. Backed by multi-chamber specialized cold storage units preserving Kufri Jyoti seed potatoes, while facilitating coffee auctions from Sakleshpur estates.",
  },
  {
    id: 11,
    name: "Byadgi APMC",
    kannadaName: "ಬ್ಯಾಡಗಿ ಎಪಿಎಂಸಿ",
    district: "Haveri",
    x: 195,
    y: 340,
    zone: "Central Transition / Red Soil Plains",
    tier: "International GI Export Spice Terminal",
    established: "Est. 1947",
    modalPrice: 19500,
    arrivalsQtl: 5600,
    specialties: ["Byadgi Chilli (Kaddi / Dabbi)", "Cotton", "Groundnut"],
    giProducts: "Byadgi Chilli (Geographical Indication Registered)",
    infrastructure: {
      auctionHalls: 22,
      electronicWeighbridges: 14,
      coldStorageCapacityMt: 68000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "World-renowned spice auction terminal handling the internationally celebrated GI-tagged Byadgi red chilli. Celebrated for high deep-red capsanthin oleoresin color values and low pungency, trading over ₹1,200 crore annually with global cosmetic, condiment, and pharma exporters.",
  },
  {
    id: 12,
    name: "Kalaburagi APMC (Nehru Gunj)",
    kannadaName: "ಕಲಬುರಗಿ ಎಪಿಎಂಸಿ (ನೆಹರು ಗಂಜ್)",
    district: "Kalaburagi",
    x: 350,
    y: 95,
    zone: "North Eastern Dry Zone (Deep Black Vertisols)",
    tier: "National Pulses & Tur Mega-Yard",
    established: "Est. 1932 (Nizam State Trade Code)",
    modalPrice: 7550,
    arrivalsQtl: 4200,
    specialties: ["Red Gram / Tur", "Bengal Gram", "Green Gram", "Sorghum / Jowar"],
    giProducts: "Gulbarga Tur Dal (GI Tagged)",
    infrastructure: {
      auctionHalls: 15,
      electronicWeighbridges: 9,
      coldStorageCapacityMt: 26000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Globally acclaimed as the 'Tur Bowl of Karnataka'. The historic Nehru Gunj yard anchors 400+ modern dal mills processing GI-certified Gulbarga Tur Dal, possessing unmatched protein density, flavor, and fast cooking traits in mineral-rich black soils.",
  },
  {
    id: 13,
    name: "Raichur APMC",
    kannadaName: "ರಾಯಚೂರು ಎಪಿಎಂಸಿ",
    district: "Raichur",
    x: 410,
    y: 200,
    zone: "North Eastern Dry / Krishna-Tungabhadra Doab",
    tier: "Cotton & Sona Masuri Paddy Hub",
    established: "Est. 1956",
    modalPrice: 6900,
    arrivalsQtl: 3800,
    specialties: ["Cotton Bales", "Sona Masuri Paddy", "Groundnut", "Chilli"],
    giProducts: "Raichur Sona Masuri Rice",
    infrastructure: {
      auctionHalls: 14,
      electronicWeighbridges: 8,
      coldStorageCapacityMt: 30000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Thriving agricultural clearinghouse nestled in the fertile Krishna-Tungabhadra river doab. Hosts dozens of high-capacity cotton ginning presses and rice processing complexes dispatching export-grade Sona Masuri rice across India and the Middle East.",
  },
  {
    id: 14,
    name: "Ballari APMC",
    kannadaName: "ಬಳ್ಳಾರಿ ಎಪಿಎಂಸಿ",
    district: "Ballari",
    x: 380,
    y: 295,
    zone: "North Eastern Dry / Tungabhadra Basin",
    tier: "Onion, Cotton & Fig Terminal",
    established: "Est. 1949",
    modalPrice: 2200,
    arrivalsQtl: 2600,
    specialties: ["Bellary Red Onion", "Cotton", "Fig", "Sunflower"],
    giProducts: "Bellary Red Onion, Bellary Fig",
    infrastructure: {
      auctionHalls: 10,
      electronicWeighbridges: 6,
      coldStorageCapacityMt: 20000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Commanding terminal for the semi-arid Tungabhadra basin. Renowned for pungency-rich Bellary Red Onions that resist transit dehydration, along with raw cotton lint and sweet fig horticultural auctions.",
  },
  {
    id: 15,
    name: "Vijayapura APMC",
    kannadaName: "ವಿಜಯಪುರ ಎಪಿಎಂಸಿ",
    district: "Vijayapura",
    x: 210,
    y: 115,
    zone: "Northern Dry / Upper Krishna Command",
    tier: "Horticulture & Dryland Cereal Hub",
    established: "Est. 1952",
    modalPrice: 3200,
    arrivalsQtl: 2800,
    specialties: ["Grapes / Raisins", "Lime / Lemon", "Pomegranate", "Malkhedi Jowar"],
    giProducts: "Bijapur Grapes, Bijapur Raisins",
    infrastructure: {
      auctionHalls: 12,
      electronicWeighbridges: 7,
      coldStorageCapacityMt: 38000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Premier horticultural terminal of the historic Adil Shahi plateau. Dominates Indian raisin manufacturing and cold-chain lime shipments, with cutting-edge grape processing clusters integrated into National Horticulture Board export corridors.",
  },
  {
    id: 16,
    name: "Chikkamagaluru APMC",
    kannadaName: "ಚಿಕ್ಕಮಗಳೂರು ಎಪಿಎಂಸಿ",
    district: "Chikkamagaluru",
    x: 210,
    y: 500,
    zone: "Western Ghats Hilly / Coffee Belt",
    tier: "Coffee Board Regulated Spice Terminal",
    established: "Est. 1964",
    modalPrice: 28000,
    arrivalsQtl: 1400,
    specialties: ["Coffee (Parchment/Cherry)", "Pepper", "Cardamom", "Arecanut"],
    giProducts: "Bababudangiri Arabica Coffee, Chikmagalur Arabica",
    infrastructure: {
      auctionHalls: 7,
      electronicWeighbridges: 4,
      coldStorageCapacityMt: 12000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "The cradle of Indian coffee nestled on the slopes of the Mullayanagiri and Bababudan ranges. Houses specialized curing auction platforms for shade-grown Arabica and Robusta beans, black pepper, and high-value forest spices.",
  },
  {
    id: 17,
    name: "Bagalkote APMC",
    kannadaName: "ಬಾಗಲಕೋಟೆ ಎಪಿಎಂಸಿ",
    district: "Bagalkote",
    x: 210,
    y: 180,
    zone: "Northern Dry / Ghataprabha-Malaprabha Catchment",
    tier: "Sugar, Maize & Onion Interchange",
    established: "Est. 1960",
    modalPrice: 2150,
    arrivalsQtl: 2300,
    specialties: ["Sugarcane", "Maize", "Onion", "Pomegranate", "Silk Cocoons"],
    giProducts: "Ilkal Sarees agrarian raw silk, Guledgudd Khana fibers",
    infrastructure: {
      auctionHalls: 9,
      electronicWeighbridges: 6,
      coldStorageCapacityMt: 17000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Crucial agrarian link in North Karnataka's irrigated river corridors. Serves as a high-velocity aggregator for sugarcane supply to regional ethanol distilleries, alongside vibrant open auctions for winter onions and hybrid maize.",
  },
  {
    id: 18,
    name: "Chitradurga APMC",
    kannadaName: "ಚಿತ್ರದುರ್ಗ ಎಪಿಎಂಸಿ",
    district: "Chitradurga",
    x: 315,
    y: 405,
    zone: "Central Dry Zone (Granite Hills & Red Soils)",
    tier: "Pomegranate & Oilseeds Exchange",
    established: "Est. 1957",
    modalPrice: 3800,
    arrivalsQtl: 2050,
    specialties: ["Pomegranate (Bhagwa)", "Groundnut", "Onion", "Ragi"],
    giProducts: "Chitradurga Bhagwa Pomegranate",
    infrastructure: {
      auctionHalls: 8,
      electronicWeighbridges: 5,
      coldStorageCapacityMt: 19000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "The 'Fort City' terminal famous for drought-hardy Bhagwa export pomegranates and groundnut pods. Provides transparent electronic weighbridge clearing for farmers across the Vedavati and Vani Vilasa Sagara catchment basins.",
  },
  {
    id: 19,
    name: "Gadag APMC",
    kannadaName: "ಗದಗ ಎಪಿಎಂಸಿ",
    district: "Gadag",
    x: 215,
    y: 270,
    zone: "Northern Transition Zone",
    tier: "Historic Cotton & Groundnut Mandi",
    established: "Est. 1938",
    modalPrice: 6400,
    arrivalsQtl: 2200,
    specialties: ["Cotton Lint", "Groundnut", "Onion", "Bengal Gram"],
    giProducts: "Gadag Betgeri Khadi Cotton",
    infrastructure: {
      auctionHalls: 10,
      electronicWeighbridges: 6,
      coldStorageCapacityMt: 18000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Historic cotton and oilseed hub established during the early co-operative movement in Karnataka. Connected with century-old ginning mills and groundnut decorticating units, running automated e-NAM auctions for dryland pulse farmers.",
  },
  {
    id: 20,
    name: "Udupi-Mangaluru APMC",
    kannadaName: "ಉಡುಪಿ-ಮಂಗಳೂರು ಎಪಿಎಂಸಿ",
    district: "Dakshina Kannada",
    x: 130,
    y: 520,
    zone: "Coastal Alluvial & Heavy Rainfall Zone",
    tier: "Coastal Horticultural & Marine Agro Terminal",
    established: "Est. 1968",
    modalPrice: 44000,
    arrivalsQtl: 1750,
    specialties: ["Arecanut (White/Chali)", "Coconut / Copra", "Black Pepper", "Cashew"],
    giProducts: "Udupi Mattu Gulla Brinjal, Udupi Mallige (Jasmine)",
    infrastructure: {
      auctionHalls: 9,
      electronicWeighbridges: 5,
      coldStorageCapacityMt: 25000,
      eNamIntegrated: true,
      testingLab: true,
    },
    briefAnalysis:
      "Coastal gateway market serving Dakshina Kannada and Udupi. Cooperates tightly with the CAMPCO cooperative network for white chali arecanut processing, cashew nut shelling, and coastal coconut logistics linked with New Mangalore Port exports.",
  },
];

export const MarketAtlasView: React.FC<MarketAtlasViewProps> = ({
  markets: _markets,
  selectedCrop,
  setSelectedCrop,
  selectedMarketId,
  setSelectedMarketId,
  selectedDistrict,
  setSelectedDistrict,
  onNavigateToTab,
  language,
}) => {
  const [filterDate, setFilterDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [legendMode, setLegendMode] = useState<"arrivals" | "price">("arrivals");
  const [filterAppliedNotice, setFilterAppliedNotice] = useState<boolean>(false);
  const [hoveredPoint, setHoveredPoint] = useState<ApmcRegionalAnalysis | null>(null);

  // Selected market details from map points or fallback
  const selectedPoint =
    APMC_MAP_POINTS.find((p) => p.id === selectedMarketId) || APMC_MAP_POINTS[0];

  const handleGo = () => {
    const matchingPoint = APMC_MAP_POINTS.find((p) => p.district === selectedDistrict);
    if (matchingPoint) {
      setSelectedMarketId(matchingPoint.id);
    }
    setFilterAppliedNotice(true);
    setTimeout(() => setFilterAppliedNotice(false), 3000);
  };

  const handleReset = () => {
    setSelectedCrop("tomato");
    setSelectedDistrict("Bengaluru Urban");
    setSelectedMarketId(1);
    setFilterDate(new Date().toISOString().split("T")[0]);
    setZoomLevel(1);
    setLegendMode("arrivals");
  };

  const getMarkerColor = (point: ApmcRegionalAnalysis) => {
    if (legendMode === "arrivals") {
      if (point.arrivalsQtl >= 3500) return "#1F7A3D"; // Very High - Dark Emerald
      if (point.arrivalsQtl >= 2200) return "#C5A059"; // High - Gold
      return "#4B5563"; // Moderate - Slate
    } else {
      if (point.modalPrice >= 6000) return "#7C3AED"; // High Value / Spice - Purple
      if (point.modalPrice >= 2500) return "#1D4ED8"; // Normal Commodity - Blue
      return "#059669"; // Budget / Bulk - Green
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Reference Note Banner */}
      <div className="bg-gradient-to-r from-[#2D1E18] to-[#3E2723] text-[#FDFBF7] p-6 rounded-2xl shadow-md border border-[#C5A059]/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-xs text-[#C5A059] font-bold tracking-wider uppercase mb-1">
              <Layers className="w-4 h-4" />
              <span>Karnataka APMC Geospatial Atlas & Regional Intelligence</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {language === "kn"
                ? "ಕರ್ನಾಟಕ ಮಾರುಕಟ್ಟೆ ಅಟ್ಲಾಸ್ ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಎಪಿಎಂಸಿ ಸಮಗ್ರ ವಿಶ್ಲೇಷಣೆ"
                : "Karnataka Market Atlas & Comprehensive Regional APMC Terminal Analysis"}
            </h1>
            <p className="text-xs text-[#E8DFD8] mt-1 max-w-3xl leading-relaxed">
              {language === "kn"
                ? "ರಾಜ್ಯದ ೨೦ ಪ್ರಮುಖ ಎಪಿಎಂಸಿ ಟರ್ಮಿನಲ್‌ಗಳ ನಿಖರ ಭೌಗೋಳಿಕ ನಕ್ಷೆ, ನೈಜ-ಸಮಯ ದೈನಂದಿನ ಆವಕ, ಬೆಲೆಗಳು, ಜಿಐ-ಟ್ಯಾಗ್ ಉತ್ಪನ್ನಗಳು ಮತ್ತು ಕೃಷಿ-ಹವಾಮಾನ ವಿಶ್ಲೇಷಣೆ."
                : "Official AGMARKNET-style layout mapping 20 major regional APMC terminals across Karnataka with authentic boundary topography, Krishna-Tungabhadra-Cauvery river basins, GI products, e-NAM infrastructure, and deep agronomic intelligence."}
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-black/40 px-3.5 py-2 rounded-xl border border-white/10 text-xs self-start md:self-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">{APMC_MAP_POINTS.length} Regional Terminals Mapped</span>
          </div>
        </div>
      </div>

      {/* FILTER CARD (Reference: agmarknet.gov.in/market-atlas) */}
      <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E5DC] pb-3">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-[#C5A059]" />
            <h3 className="font-bold text-sm text-[#2D1E18] uppercase tracking-wide">
              {language === "kn" ? "ಮಾರುಕಟ್ಟೆ ಶೋಧಕ ಫಿಲ್ಟರ್ ಕಾರ್ಡ್" : "Market Atlas Query & Filter Controls"}
            </h3>
          </div>
          {filterAppliedNotice && (
            <span className="inline-flex items-center space-x-1 text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              <span>Filters applied successfully</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Commodity Dropdown */}
          <div>
            <label className="block text-[#5B6354] font-bold mb-1">
              {language === "kn" ? "ಕೃಷಿ ಉತ್ಪನ್ನ" : "Commodity / Crop"}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-2.5 py-2 font-semibold text-[#2D1E18] focus:border-[#C5A059] focus:outline-none"
            >
              <option value="tomato">Tomato (ಟೊಮೆಟೊ)</option>
              <option value="onion">Onion (ಈರುಳ್ಳಿ)</option>
              <option value="potato">Potato (ಆಲೂಗಡ್ಡೆ)</option>
              <option value="chilli">Byadgi Chilli (ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ)</option>
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
              <option value="rice">Paddy / Rice (ಭತ್ತ / ಅಕ್ಕಿ)</option>
            </select>
          </div>

          {/* District Dropdown */}
          <div>
            <label className="block text-[#5B6354] font-bold mb-1">
              {language === "kn" ? "ಜಿಲ್ಲೆ" : "District"}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-2.5 py-2 font-semibold text-[#2D1E18] focus:border-[#C5A059] focus:outline-none"
            >
              {Array.from(new Set(APMC_MAP_POINTS.map((p) => p.district))).sort().map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* APMC Market Dropdown */}
          <div>
            <label className="block text-[#5B6354] font-bold mb-1">
              {language === "kn" ? "ಎಪಿಎಂಸಿ ಪ್ರಾಂಗಣ" : "APMC Market Yard"}
            </label>
            <select
              value={selectedMarketId}
              onChange={(e) => {
                const id = Number(e.target.value);
                setSelectedMarketId(id);
                const found = APMC_MAP_POINTS.find((p) => p.id === id);
                if (found) setSelectedDistrict(found.district);
              }}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-2.5 py-2 font-semibold text-[#2D1E18] focus:border-[#C5A059] focus:outline-none"
            >
              {APMC_MAP_POINTS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.district})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-[#5B6354] font-bold mb-1">
              {language === "kn" ? "ದಿನಾಂಕ" : "Arrival Date"}
            </label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg px-2.5 py-1.5 font-semibold text-[#2D1E18] focus:border-[#C5A059]"
            />
          </div>

          {/* Action Buttons: Go & Reset */}
          <div className="flex items-end space-x-2">
            <button
              onClick={handleGo}
              className="flex-1 bg-[#1F7A3D] hover:bg-[#165a2d] text-white font-bold py-2 rounded-lg shadow-sm transition active:scale-95"
            >
              {language === "kn" ? "ಶೋಧಿಸಿ (Go)" : "Go"}
            </button>
            <button
              onClick={handleReset}
              className="px-3 bg-[#EAECE6] hover:bg-[#dfe2d8] text-[#2D1E18] font-bold py-2 rounded-lg transition active:scale-95 flex items-center"
              title="Reset Filters to Default"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN ATLAS INTERFACE: Interactive Map + Side Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT / CENTER: Authentic Karnataka APMC SVG Map (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-3 relative overflow-hidden">
          {/* Map Controls Header */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E2E5DC] pb-2 text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[#2D1E18]">Map View Metric:</span>
              <div className="inline-flex rounded-lg border border-[#E2E5DC] p-0.5 bg-[#FDFBF7]">
                <button
                  onClick={() => setLegendMode("arrivals")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                    legendMode === "arrivals"
                      ? "bg-[#1F7A3D] text-white"
                      : "text-[#5B6354] hover:text-[#1A1F16]"
                  }`}
                >
                  Arrivals Volume
                </button>
                <button
                  onClick={() => setLegendMode("price")}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition ${
                    legendMode === "price"
                      ? "bg-[#7C3AED] text-white"
                      : "text-[#5B6354] hover:text-[#1A1F16]"
                  }`}
                >
                  Modal Price Level
                </button>
              </div>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.15))}
                className="p-1.5 rounded-md bg-[#FDFBF7] hover:bg-[#EAECE6] border border-[#E2E5DC] text-[#2D1E18]"
                title="Zoom In"
                aria-label="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.15))}
                className="p-1.5 rounded-md bg-[#FDFBF7] hover:bg-[#EAECE6] border border-[#E2E5DC] text-[#2D1E18]"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="px-2 py-1 rounded-md bg-[#FDFBF7] hover:bg-[#EAECE6] border border-[#E2E5DC] text-[11px] font-bold text-[#2D1E18]"
                title="Reset View"
              >
                Reset View
              </button>
            </div>
          </div>

          {/* Interactive SVG Map Container */}
          <div className="relative w-full h-[520px] bg-[#F7F4EB] rounded-xl overflow-hidden border border-[#E2E5DC] flex items-center justify-center">
            {/* SVG Vector Map of Karnataka */}
            <svg
              viewBox="0 0 600 700"
              className="w-full h-full transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                <radialGradient id="mapBgGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFFDF9" />
                  <stop offset="100%" stopColor="#F5EFE6" />
                </radialGradient>
                <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="#2D1E18" floodOpacity="0.18" />
                </filter>
              </defs>

              {/* Realistic Authentic Karnataka State Boundary Polygon */}
              <path
                d="M 330 35 
                   C 355 30, 365 50, 370 70 
                   C 380 95, 395 120, 420 155
                   C 445 190, 435 230, 425 260
                   C 420 280, 435 310, 415 340
                   C 400 365, 420 400, 440 435
                   C 460 470, 520 515, 525 540
                   C 530 565, 495 590, 475 600
                   C 455 610, 420 635, 385 645
                   C 350 655, 315 670, 290 655
                   C 265 640, 240 610, 220 580
                   C 200 550, 160 550, 130 535
                   C 105 520, 95 480, 90 440
                   C 85 400, 75 360, 70 320
                   C 65 280, 75 250, 85 220
                   C 95 190, 125 170, 150 145
                   C 175 120, 210 95, 250 75
                   C 285 55, 305 40, 330 35 Z"
                fill="url(#mapBgGrad)"
                stroke="#C5A059"
                strokeWidth="2.8"
                filter="url(#shadow)"
              />

              {/* Major Karnataka Rivers: Krishna, Tungabhadra, Cauvery */}
              {/* Krishna River (North) */}
              <path
                d="M 100 170 C 160 160, 250 140, 330 150 C 370 155, 410 165, 430 180"
                fill="none"
                stroke="#93C5FD"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
              <text x="240" y="145" fill="#2563EB" fontSize="10" fontStyle="italic" fontWeight="600">
                Krishna River Basin
              </text>

              {/* Tungabhadra River (Central) */}
              <path
                d="M 180 390 C 230 360, 290 320, 360 300 C 400 290, 420 280, 425 270"
                fill="none"
                stroke="#93C5FD"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
              <text x="280" y="325" fill="#2563EB" fontSize="10" fontStyle="italic" fontWeight="600">
                Tungabhadra River Basin
              </text>

              {/* Cauvery River (South) */}
              <path
                d="M 230 600 C 280 610, 340 595, 400 615 C 430 625, 460 620, 480 610"
                fill="none"
                stroke="#93C5FD"
                strokeWidth="2"
                strokeDasharray="4,2"
              />
              <text x="280" y="620" fill="#2563EB" fontSize="10" fontStyle="italic" fontWeight="600">
                Cauvery River Basin
              </text>

              {/* Arabian Sea Coastal Label */}
              <text x="25" y="440" fill="#64748B" fontSize="10" fontStyle="italic" transform="rotate(-75 25 440)">
                Arabian Sea Coastline
              </text>

              {/* 20 APMC Market Pins */}
              {APMC_MAP_POINTS.map((pt) => {
                const isSelected = pt.id === selectedMarketId;
                const markerFill = getMarkerColor(pt);
                return (
                  <g
                    key={pt.id}
                    onClick={() => {
                      setSelectedMarketId(pt.id);
                      setSelectedDistrict(pt.district);
                    }}
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="cursor-pointer transition transform hover:scale-125"
                    style={{ transformOrigin: `${pt.x}px ${pt.y}px` }}
                  >
                    {/* Pulsing ring if selected */}
                    {isSelected && (
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r="18"
                        fill="none"
                        stroke="#C5A059"
                        strokeWidth="2.5"
                        className="animate-ping"
                        opacity="0.6"
                      />
                    )}

                    {/* Outer Pin Body */}
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isSelected ? "11" : "7.5"}
                      fill={markerFill}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                      className="shadow-sm"
                    />

                    {/* Inner core */}
                    <circle cx={pt.x} cy={pt.y} r="2.8" fill="#FFFFFF" />

                    {/* Market Label */}
                    <text
                      x={pt.x + 10}
                      y={pt.y + 4}
                      fill="#1A1F16"
                      fontSize={isSelected ? "11" : "8.5"}
                      fontWeight={isSelected ? "bold" : "600"}
                      className="select-none pointer-events-none drop-shadow"
                    >
                      {language === "kn" ? pt.kannadaName.split(" ")[0] : pt.name.split(" ")[0]}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredPoint && (
              <div
                className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-[#C5A059]/40 shadow-lg text-xs space-y-1 max-w-[220px] pointer-events-none z-10"
              >
                <div className="font-bold text-[#1A1F16]">{hoveredPoint.name}</div>
                <div className="text-[11px] text-[#C5A059] font-semibold">{hoveredPoint.district}</div>
                <div className="text-[11px] text-emerald-800 font-bold">
                  ₹{hoveredPoint.modalPrice.toLocaleString()}/qtl | {hoveredPoint.arrivalsQtl} qtl
                </div>
                <div className="text-[10px] text-[#5B6354] line-clamp-2">
                  {hoveredPoint.briefAnalysis}
                </div>
              </div>
            )}

            {/* COLOR LEGEND OVERLAY (Bottom-Left) */}
            <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-[#E2E5DC] text-[11px] space-y-1.5 shadow-md">
              <div className="font-bold text-[#2D1E18] flex items-center space-x-1">
                <span>{legendMode === "arrivals" ? "Arrivals Volume (qtl)" : "Price Spread (₹/qtl)"}</span>
              </div>
              {legendMode === "arrivals" ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#1F7A3D]" />
                    <span>Mega Terminal (&gt; 3,500 qtl)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#C5A059]" />
                    <span>Medium Flow (2,200 - 3,500 qtl)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#4B5563]" />
                    <span>Standard (&lt; 2,200 qtl)</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#7C3AED]" />
                    <span>Specialty / High Value (&gt; ₹6,000/qtl)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#1D4ED8]" />
                    <span>Commercial Band (₹2,500 - 6,000/qtl)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-[#059669]" />
                    <span>Bulk Grains (&lt; ₹2,500/qtl)</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: BRIEF REGIONAL APMC ANALYSIS SIDE PANEL (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-3">
              <span className="text-xs uppercase font-extrabold text-[#C5A059] tracking-wider flex items-center space-x-1.5">
                <Building className="w-4 h-4 text-[#1F7A3D]" />
                <span>Regional APMC Terminal Dossier</span>
              </span>
              <span className="text-xs bg-[#FDFBF7] text-[#1F7A3D] font-bold px-2.5 py-0.5 rounded-full border border-[#C5A059]/40">
                {selectedPoint.district}
              </span>
            </div>

            {/* Selected Market Info Header */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-[#2D1E18]">
                  {selectedPoint.name}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {selectedPoint.tier.split(" ")[0]}
                </span>
              </div>
              <p className="text-xs text-[#C5A059] font-bold">
                {selectedPoint.kannadaName}
              </p>
              <div className="text-[11px] text-[#5B6354] pt-0.5">
                Zone: <strong className="text-[#1A1F16]">{selectedPoint.zone}</strong> | {selectedPoint.established}
              </div>
            </div>

            {/* Live Pricing & Arrival Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E2E5DC] space-y-1">
                <span className="text-[11px] text-[#5B6354] font-semibold">Prevailing Modal Price</span>
                <div className="text-2xl font-black text-[#1F7A3D]">
                  ₹{selectedPoint.modalPrice.toLocaleString()}
                  <span className="text-xs font-normal text-[#5B6354]">/qtl</span>
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold truncate">
                  Target: {selectedCrop.toUpperCase()}
                </div>
              </div>

              <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E2E5DC] space-y-1">
                <span className="text-[11px] text-[#5B6354] font-semibold">Today's Recorded Arrivals</span>
                <div className="text-2xl font-black text-[#2D1E18]">
                  {selectedPoint.arrivalsQtl.toLocaleString()}
                  <span className="text-xs font-normal text-[#5B6354]"> qtl</span>
                </div>
                <div className="text-[10px] text-blue-700 font-semibold">
                  Active Auction Flow
                </div>
              </div>
            </div>

            {/* Commodity Specialties & GI Tag */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#5B6354] font-bold">Trading Specialties:</span>
                <span className="font-bold text-[#1A1F16]">{selectedPoint.specialties.join(", ")}</span>
              </div>
              {selectedPoint.giProducts && (
                <div className="flex items-center space-x-1.5 bg-amber-50 p-2 rounded-lg border border-amber-200 text-amber-900 text-[11px]">
                  <Sprout className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span><strong>GI Product:</strong> {selectedPoint.giProducts}</span>
                </div>
              )}
            </div>

            {/* Terminal Infrastructure Specs */}
            <div className="bg-[#F7F8F5] p-3 rounded-xl border border-[#E2E5DC] space-y-2 text-xs">
              <span className="text-[11px] font-bold text-[#5B6354] uppercase tracking-wide">
                Terminal Facilities & Infrastructure
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  Auction Sheds: <strong className="text-[#1A1F16]">{selectedPoint.infrastructure.auctionHalls} Platforms</strong>
                </div>
                <div>
                  Weighbridges: <strong className="text-[#1A1F16]">{selectedPoint.infrastructure.electronicWeighbridges} Digital</strong>
                </div>
                <div>
                  Cold Storage: <strong className="text-[#1A1F16]">{selectedPoint.infrastructure.coldStorageCapacityMt.toLocaleString()} MT</strong>
                </div>
                <div className="flex items-center space-x-1">
                  <span>e-NAM Trading:</span>
                  <strong className="text-emerald-700 font-bold">Integrated</strong>
                </div>
              </div>
            </div>

            {/* BRIEF REGIONAL APMC ANALYSIS (Comprehensive Agronomic Overview) */}
            <div className="bg-[#F7F4EB] p-4 rounded-xl border border-[#C5A059]/40 space-y-1.5 text-xs text-[#2D1E18]">
              <div className="font-bold text-[#1F7A3D] flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-[#C5A059]" />
                <span className="uppercase tracking-wide text-[11px]">Regional APMC In-Depth Analysis</span>
              </div>
              <p className="text-xs text-[#2D1E18] leading-relaxed">
                {selectedPoint.briefAnalysis}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons connecting to live intelligence */}
          <div className="space-y-2 pt-2 border-t border-[#E2E5DC]">
            <div className="text-[11px] text-[#5B6354] font-semibold">
              Actionable Intelligence for {selectedPoint.name}:
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => onNavigateToTab && onNavigateToTab("market")}
                className="flex items-center justify-center space-x-1 px-2.5 py-2 bg-[#1F7A3D] hover:bg-[#165a2d] text-white text-xs font-bold rounded-lg shadow-sm transition active:scale-95 text-center"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Price Series</span>
              </button>
              <button
                onClick={() => onNavigateToTab && onNavigateToTab("logistics")}
                className="flex items-center justify-center space-x-1 px-2.5 py-2 bg-[#2D1E18] hover:bg-[#3E2723] text-[#FDFBF7] text-xs font-bold rounded-lg shadow-sm transition active:scale-95 text-center"
              >
                <Truck className="w-3.5 h-3.5" />
                <span>Plan Freight</span>
              </button>
              <button
                onClick={() => onNavigateToTab && onNavigateToTab("marketplace")}
                className="flex items-center justify-center space-x-1 px-2.5 py-2 bg-[#C5A059] hover:bg-[#b08d48] text-[#2D1E18] text-xs font-bold rounded-lg shadow-sm transition active:scale-95 text-center"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>B2B Lots</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
