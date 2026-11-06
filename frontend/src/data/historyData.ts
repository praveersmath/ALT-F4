// Agricultural Heritage & Local History Data for AgriIntel Karnataka
// Preserves authentic historical records of Karnataka's mandis, agricultural evolution, visionaries, and events.

export interface HeritagePlace {
  id: string;
  name: string;
  kannadaName: string;
  district: string;
  establishedPeriod: string;
  historicalImportance: string;
  location: string;
  coordinates: { lat: number; lon: number };
  majorCommodities: string[];
  imageUrl: string;
  detailedHistory: string;
  heritageStatus: string;
}

export interface HeritagePersonality {
  id: string;
  name: string;
  kannadaName: string;
  period: string;
  role: string;
  photographUrl: string;
  biography: string;
  keyAchievements: string[];
  historicalContribution: string;
  notableQuote: string;
}

export interface HeritageEvent {
  id: string;
  title: string;
  kannadaTitle: string;
  year: string;
  period: string;
  importance: string;
  description: string;
  keyOutcome: string;
  category: "legislation" | "infrastructure" | "scientific" | "digital";
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: "mandis" | "farming" | "heritage" | "produce";
  year: string;
  location: string;
  imageUrl: string;
  caption: string;
}

export interface FaqItem {
  question: string;
  kannadaQuestion?: string;
  answer: string;
  category: string;
}

export const HERITAGE_PLACES: HeritagePlace[] = [
  {
    id: "binny-mill-blr",
    name: "Bengaluru Binny Mill & Cottonpet Yard",
    kannadaName: "ಬೆಂಗಳೂರು ಬಿನ್ನಿ ಮಿಲ್ ಮತ್ತು ಹತ್ತಿಪೇಟೆ ಮಾರುಕಟ್ಟೆ",
    district: "Bengaluru Urban",
    establishedPeriod: "1884 (Late 19th Century)",
    historicalImportance: "The nerve center of early Mysore State commercial agriculture, establishing steam-driven cotton ginning and wholesale grain distribution.",
    location: "Cottonpet & Binny Mill Ground, Central Bengaluru",
    coordinates: { lat: 12.9716, lon: 77.5946 },
    majorCommodities: ["Cotton", "Silk Cocoons", "Finger Millet (Ragi)", "Staple Vegetables"],
    imageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80",
    detailedHistory: "Founded during the reign of Maharaja Chamarajendra Wadiyar X and Dewan Sir K. Seshadri Iyer, the Binny Cotton & Agricultural Depot connected rail-transported agricultural commodities from across South Karnataka to port terminals. It pioneered the first standardized metric weighing scales and organized wholesale commission agent registries.",
    heritageStatus: "Centennial Agricultural Trading Landmark",
  },
  {
    id: "kolar-mandi",
    name: "Kolar Horticultural Terminal Mandi",
    kannadaName: "ಕೋಲಾರ ತೋಟಗಾರಿಕಾ ಟರ್ಮಿನಲ್ ಮಂಡಿ",
    district: "Kolar",
    establishedPeriod: "1948 (Post-Independence Transformation)",
    historicalImportance: "Asia's second-largest tomato trading terminal; a historic triumph of community borewell irrigation transforming arid drought-prone plateau soil into an agrarian powerhouse.",
    location: "APMC Yard, Bangarpet Road, Kolar",
    coordinates: { lat: 13.1367, lon: 78.1291 },
    majorCommodities: ["Tomato", "Mango", "Mulberry", "Capsicum"],
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    detailedHistory: "Established right after Indian Independence to rescue Kolar farmers from severe drought, this market formalized open-cry daily auctions. By the 1980s, it grew into a national price-setter for tomato across South India, handling over 1,500 tonnes per day during peak harvest.",
    heritageStatus: "State Model APMC Terminal",
  },
  {
    id: "hubballi-amargol",
    name: "Hubballi Cotton & Grain Regulated Yard (Amargol)",
    kannadaName: "ಹುಬ್ಬಳ್ಳಿ ಹತ್ತಿ ಮತ್ತು ಧಾನ್ಯ ನಿಯಂತ್ರಿತ ಮಾರುಕಟ್ಟೆ",
    district: "Dharwad",
    establishedPeriod: "1928 (Bombay Cotton Markets Act)",
    historicalImportance: "Karnataka's oldest continuous regulated market; instituted the first formal cotton testing laboratory and fair trader arbitration.",
    location: "Amargol APMC Complex, Hubballi-Dharwad Corridor",
    coordinates: { lat: 15.3647, lon: 75.1240 },
    majorCommodities: ["Byadgi Red Chilli", "Hybrid Cotton", "Bengal Gram", "Onion"],
    imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80",
    detailedHistory: "Under the Cotton Regulated Markets Act of 1928, Hubballi replaced arbitrary colonial brokerage with statutory weighment and public bulletin boards. Today, it hosts one of India's largest e-NAM trading nodes spanning over 120 acres.",
    heritageStatus: "Pioneer Regulated Market Yard (1928)",
  },
  {
    id: "belagavi-yard",
    name: "Belagavi Northern Agro-Trading Yard",
    kannadaName: "ಬೆಳಗಾವಿ ಕೃಷಿ ವಾಣಿಜ್ಯ ಮಂಡಿ",
    district: "Belagavi",
    establishedPeriod: "1935 (Inter-State Deccan Exchange)",
    historicalImportance: "Historic tri-state agricultural confluence linking Karnataka, Maharashtra, and Goa along the Malaprabha and Krishna river basins.",
    location: "APMC Yard, Pune-Bengaluru Highway, Belagavi",
    coordinates: { lat: 15.8497, lon: 74.4977 },
    majorCommodities: ["Sugarcane / Jaggery", "Winter Wheat", "Onion", "Soybean"],
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    detailedHistory: "Operating as an inter-regional hub since the 1930s, Belagavi specialized in cane-jaggery trading and winter cereal storage. It was one of the earliest adopters of electronic auction grading in Northern Karnataka.",
    heritageStatus: "Inter-State Border Agrarian Heritage Site",
  },
  {
    id: "mysuru-bandipalya",
    name: "Mysuru Bandipalya Regulated Market",
    kannadaName: "ಮೈಸೂರು ಬಂಡಿಪಾಳ್ಯ ನಿಯಂತ್ರಿತ ಮಾರುಕಟ್ಟೆ",
    district: "Mysuru",
    establishedPeriod: "1912 (Princely Mysore Regulation)",
    historicalImportance: "Conceived by Maharaja Nalvadi Krishnaraja Wadiyar and Sir M. Visvesvaraya to eliminate predatory middlemen fees for Cauvery basin ryots.",
    location: "Bandipalya, Ooty Road, Mysuru",
    coordinates: { lat: 12.2958, lon: 76.6394 },
    majorCommodities: ["Paddy", "Nanjangud Banana", "Coconut", "Turmeric"],
    imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",
    detailedHistory: "Bandipalya ('Yard of Bullock Carts') was formalized under the Mysore Agricultural Regulation of 1912. Farmers arriving with bullock carts from Chamarajanagar and Mandya were guaranteed clean drinking troughs, protected sheds, and direct auction cash settlements.",
    heritageStatus: "Royal Mysore Agrarian Monument",
  },
];

export const HERITAGE_PERSONALITIES: HeritagePersonality[] = [
  {
    id: "sir-mv",
    name: "Bharat Ratna Sir M. Visvesvaraya",
    kannadaName: "ಸರ್ ಎಂ. ವಿಶ್ವೇಶ್ವರಯ್ಯ",
    period: "1860 – 1962",
    role: "Chief Engineer & Dewan of Mysore | Father of Modern Irrigation",
    photographUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    biography: "Sir Mokshagundam Visvesvaraya was a towering visionary whose irrigation marvels secured Karnataka's agrarian resilience. As Dewan of Mysore, he conceptualized the Krishnarajasagara (KRS) Dam across the Cauvery and designed the automatic sluice gates that prevented disastrous reservoir breaches.",
    keyAchievements: [
      "Engineered the Krishnarajasagara (KRS) Dam, irrigating 120,000+ acres.",
      "Established the Mysore Agricultural Residential College at Hebbal (now UAS Bengaluru).",
      "Founded the Bank of Mysore (1913) to extend low-interest rural credit to farmers.",
      "Authored 'Reconstructing India' emphasizing agrarian-industrial synergy.",
    ],
    historicalContribution: "Pioneered systematic watershed management and agricultural banking, liberating thousands of Mysore farmers from colonial moneylenders.",
    notableQuote: "Agriculture is the foundation of national wealth; industry without food sovereignty is a house built on sand.",
  },
  {
    id: "nalvadi-krishnaraja",
    name: "Maharaja Nalvadi Krishnaraja Wadiyar IV",
    kannadaName: "ನಾಲ್ವಡಿ ಕೃಷ್ಣರಾಜ ಒಡೆಯರ್",
    period: "1884 – 1940",
    role: "Maharaja of Mysore | Philosopher King & Agrarian Reformer",
    photographUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
    biography: "Nalvadi Krishnaraja Wadiyar presided over the 'Golden Era of Mysore'. He redirected state finances to rural schools, constructed thousands of village irrigation tanks, abolished punitive land taxes during droughts, and created regulated grain yards.",
    keyAchievements: [
      "Instituted the Mysore Department of Agriculture in 1913.",
      "Funded and sanctioned the Visvesvaraya Canal network across Mandya and Mysuru.",
      "Passed the Mysore Co-operative Societies Act to build village-level grain banks.",
      "Created Karnataka's first formal agricultural research experimental farms.",
    ],
    historicalContribution: "Established institutional welfare for farmers, laying the legal foundation for the modern APMC regulated marketplace.",
    notableQuote: "The welfare of the tiller is the ultimate barometer of a civilized government.",
  },
  {
    id: "dr-ms-swaminathan",
    name: "Dr. M. S. Swaminathan",
    kannadaName: "ಡಾ. ಎಂ. ಎಸ್. ಸ್ವಾಮಿನಾಥನ್",
    period: "1925 – 2023",
    role: "Father of India's Green Revolution | Agricultural Scientist",
    photographUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
    biography: "Dr. Monkombu Sambasivan Swaminathan transformed India from a 'ship-to-mouth' famine-vulnerable nation into a grain-exporting power. In Karnataka, he personally assisted UAS Bengaluru and Dharwad in breeding semi-dwarf disease-resistant cereal cultivars.",
    keyAchievements: [
      "Architect of the National Farmers Commission, recommending MSP = C2 + 50%.",
      "Spearheaded high-yielding wheat and rice trials across Northern Karnataka basins.",
      "Championed the 'Evergreen Revolution' balancing high yields with soil ecology.",
      "Helped set up community seed banks for Karnataka millets (Ragi and Jowar).",
    ],
    historicalContribution: "Ensured agricultural price stability mechanisms and statutory Minimum Support Price (MSP) benchmarks.",
    notableQuote: "If agriculture fails, everything else will fail.",
  },
  {
    id: "dr-leslie-coleman",
    name: "Dr. Leslie C. Coleman",
    kannadaName: "ಡಾ. ಲೆಸ್ಲಿ ಕೋಲ್ಮನ್",
    period: "1878 – 1954",
    role: "First Director of Agriculture of Mysore State (1913 – 1934)",
    photographUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80",
    biography: "A pioneering Canadian-born agricultural scientist appointed by Nalvadi Krishnaraja Wadiyar. Dr. Coleman revolutionized plant pathology and entomology in Mysore, saving the coffee industry from Koleroga and breeding high-sucrose sugarcanes.",
    keyAchievements: [
      "Introduced Bordeaux mixture against Koleroga fungal blight across Western Ghats plantations.",
      "Bred Mysore sugarcane variety H.M. 320, facilitating the Mandya Sugar Mill founding.",
      "Authored seminal botanical treatises on South Indian insect pests and soil chemistry.",
      "Established the Hebbal Experimental Dairy and Poultry Station.",
    ],
    historicalContribution: "Built the scientific research and extension backbone that modern Karnataka agricultural universities rely on.",
    notableQuote: "Scientific farming is not an abstract theory; it is the practical shield of the rural home.",
  },
  {
    id: "kadidal-manjappa",
    name: "Shri Kadidal Manjappa",
    kannadaName: "ಕಡಿದಾಳ್ ಮಂಜಪ್ಪ",
    period: "1908 – 1992",
    role: "Third Chief Minister of Mysore State | Pioneer of Land Tenancy Reforms",
    photographUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    biography: "A Gandhian statesman from Thirthahalli, Kadidal Manjappa drafted and passed the historic Mysore Land Tenancy Act of 1952, protecting tenant tillers against arbitrary eviction by absentee zamindars.",
    keyAchievements: [
      "Drafted the landmark Mysore Tenancy Reform legislation.",
      "Facilitated the integration of unified Karnataka in 1956.",
      "Promoted cooperative rural marketing unions in Malenadu.",
      "Donated vast ancestral farmlands for public schools and rural hospitals.",
    ],
    historicalContribution: "Empowered the actual tillers with tenure security, creating an independent farming class that populated Karnataka's APMC mandis.",
    notableQuote: "Land belongs to the sweat that falls on the soil.",
  },
];

export const HERITAGE_EVENTS: HeritageEvent[] = [
  {
    id: "evt-1884",
    title: "Foundation of Mysore Agricultural Society",
    kannadaTitle: "ಮೈಸೂರು ಕೃಷಿ ಸಂಘದ ಸ್ಥಾಪನೆ",
    year: "1884",
    period: "Colonial & Princely Mysore",
    importance: "First organized body to conduct state-level cattle exhibitions and seeds distribution.",
    description: "Formed under Royal patronage to catalog drought-resistant indigenous crops and introduce iron ploughshares to Mysore ryots.",
    keyOutcome: "Established the tradition of annual Mysore Dasara Agricultural Exhibitions.",
    category: "legislation",
  },
  {
    id: "evt-1911",
    title: "Commencement of Krishnarajasagara (KRS) Dam",
    kannadaTitle: "ಕೃಷ್ಣರಾಜಸಾಗರ (KRS) ಆಣೆಕಟ್ಟು ನಿರ್ಮಾಣ",
    year: "1911",
    period: "Colonial & Princely Mysore",
    importance: "Turned the arid Mandya-Mysuru tracts into South India's sugar and paddy bowl.",
    description: "Designed by Sir M. Visvesvaraya with indigenous surki mortar, KRS became one of Asia's largest reservoirs, safeguarding millions against recurring famines.",
    keyOutcome: "Assured perennial canal irrigation across 120,000+ acres.",
    category: "infrastructure",
  },
  {
    id: "evt-1928",
    title: "Enactment of the Cotton Regulated Markets Act",
    kannadaTitle: "ಹತ್ತಿ ನಿಯಂತ್ರಿತ ಮಾರುಕಟ್ಟೆ ಕಾಯ್ದೆ",
    year: "1928",
    period: "Colonial & Princely Mysore",
    importance: "Birth of statutory regulated mandis in the Hubballi-Dharwad cotton belt.",
    description: "Abolished unfair arbitrary deductions ('karda' and 'dhalta') by moneylenders, introducing licensed commission agents and official daily market rates.",
    keyOutcome: "Paved the path for the modern APMC system.",
    category: "legislation",
  },
  {
    id: "evt-1966",
    title: "Passage of the Karnataka APMC Act, 1966",
    kannadaTitle: "ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಕಾಯ್ದೆ ೧೯೬೬",
    year: "1966",
    period: "Post-Independence Consolidation",
    importance: "Created 160+ regulated APMC market yards across 31 districts of Karnataka.",
    description: "Standardized market fees, instituted democratically elected farmer-majority market committees, and mandated transparent open auctions.",
    keyOutcome: "Empowered farmers with institutional protection and weighing accuracy.",
    category: "legislation",
  },
  {
    id: "evt-1969",
    title: "High-Yielding Varieties (HYV) Green Revolution Rollout",
    kannadaTitle: "ಹೈ-ಯೀಲ್ಡಿಂಗ್ ಹಸಿರು ಕ್ರಾಂತಿಯ ಪರಿಚಯ",
    year: "1969",
    period: "Green Revolution Era",
    importance: "Tripled per-hectare grain output across Dharwad, Belagavi, and Tungabhadra basins.",
    description: "In collaboration with ICAR and Dr. M. S. Swaminathan, dwarf Mexican wheat varieties and IR-8 paddy were deployed alongside subsidized tube-well power.",
    keyOutcome: "Eliminated chronic food grain deficits in Karnataka.",
    category: "scientific",
  },
  {
    id: "evt-2014",
    title: "Launch of Karnataka Unified Market Platform (UMP)",
    kannadaTitle: "ಕರ್ನಾಟಕ ಏಕೀಕೃತ ಮಾರುಕಟ್ಟೆ ವೇದಿಕೆ (UMP)",
    year: "2014",
    period: "Digital & Modern Era",
    importance: "India's first statewide electronic agricultural auction exchange (ReMS).",
    description: "Karnataka interconnected 130 APMCs into a single digital clearing house, allowing traders anywhere in India to bid on Karnataka produce electronically.",
    keyOutcome: "Farmer realization increased by 13-38%; served as the blueprint for national e-NAM.",
    category: "digital",
  },
];

export const CAROUSEL_SLIDES = [
  {
    id: "slide-1",
    title: "Centuries of Agrarian Heritage in Karnataka",
    kannadaTitle: "ಕರ್ನಾಟಕದ ಶತಮಾನಗಳ ಕೃಷಿ ಪರಂಪರೆ",
    subtitle: "From Vijayanagara granaries to the Cauvery canal networks of Mysore",
    period: "14th Century – Present",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1400&q=80",
    description: "Explore the ancient water management traditions, royal princely decrees, and generational farmer wisdom that shaped Karnataka's agrarian landscape.",
  },
  {
    id: "slide-2",
    title: "The Historic Mandis of the Deccan Plateau",
    kannadaTitle: "ದಖ್ಖನ್ ಪ್ರಸ್ಥಭೂಮಿಯ ಐತಿಹಾಸಿಕ ಮಂಡಿಗಳು",
    subtitle: "Regulated trade hubs from Hubballi Cotton (1928) to Kolar Tomatoes",
    period: "1928 – 1966 Evolution",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1400&q=80",
    description: "Discover how Karnataka pioneered statutory APMC market committees, safeguarding ryots against predatory brokerage and standardizing fair weighment.",
  },
  {
    id: "slide-3",
    title: "Visionaries Who Irrigated the State",
    kannadaTitle: "ರಾಜ್ಯಕ್ಕೆ ಜೀವಜಲ ತಂದ ಮಹಾನ್ ದಾರ್ಶನಿಕರು",
    subtitle: "Sir M. Visvesvaraya & Maharaja Nalvadi Krishnaraja Wadiyar IV",
    period: "1911 KRS Dam Epoch",
    imageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=1400&q=80",
    description: "Honoring the engineers, agronomists, and statesmen whose dams, experimental colleges, and land tenure reforms built modern Karnataka.",
  },
  {
    id: "slide-4",
    title: "Digital Mandi Intelligence & 7-Pillar Science",
    kannadaTitle: "ಡಿಜಿಟಲ್ ಮಂಡಿ ಗುಪ್ತಚರ ಮತ್ತು ೭-ಸ್ತಂಭಗಳ ವಿಜ್ಞಾನ",
    subtitle: "Fusing AGMARKNET, NASA Agroclimatology, Earth Engine NDVI & AI",
    period: "2026 Future Frontier",
    imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=1400&q=80",
    description: "Bridging timeless agricultural history with real-time satellite canopy analytics, predictive price modeling, and waste-to-value circular economics.",
  },
];

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "gal-1",
    title: "Vintage Bullock Carts at Mysuru Bandipalya",
    category: "mandis",
    year: "Historical APMC",
    location: "Bandipalya, Mysuru",
    imageUrl: "https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80",
    caption: "Traditional bullock carts loaded with paddy and jaggery entering the covered auction sheds of Bandipalya yard.",
  },
  {
    id: "gal-2",
    title: "Kolar Morning Tomato Open Auction",
    category: "produce",
    year: "Active Daily Trade",
    location: "Kolar APMC Terminal",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
    caption: "Traders and commission agents inspecting crates of hybrid tomatoes under the primary trading pavilion in Kolar.",
  },
  {
    id: "gal-3",
    title: "Canal Irrigation Waters of the Cauvery Basin",
    category: "heritage",
    year: "KRS Water Heritage",
    location: "Mandya-Mysuru District",
    imageUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    caption: "The historic Visvesvaraya canal system delivering life-giving waters to lush paddy and sugarcane fields.",
  },
  {
    id: "gal-4",
    title: "North Karnataka Cotton Baling & Grading",
    category: "farming",
    year: "Amargol Hubballi",
    location: "Dharwad APMC Yard",
    imageUrl: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80",
    caption: "Mechanical baling and electronic staple length grading of black soil cotton at the Amargol market complex.",
  },
  {
    id: "gal-5",
    title: "Historic Binny Cotton Ginning Complex",
    category: "heritage",
    year: "1884 Industrial Archival",
    location: "Cottonpet, Bengaluru",
    imageUrl: "https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80",
    caption: "The colonial-era brick architecture of Binny Mill, which catalyzed organized commodity handling in the Mysore Kingdom.",
  },
  {
    id: "gal-6",
    title: "Byadgi Chilli Sun-Drying Heritage",
    category: "produce",
    year: "Traditional Processing",
    location: "Haveri / Dharwad APMC",
    imageUrl: "https://images.unsplash.com/photo-1588252303782-cb80119abd6d?auto=format&fit=crop&w=800&q=80",
    caption: "Acres of vivid red Byadgi chillies drying in the Deccan sun, prized globally for deep oleoresin color and mild pungency.",
  },
  {
    id: "gal-7",
    title: "Millets (Ragi) Threshing in Tumakuru",
    category: "farming",
    year: "Traditional Agriculture",
    location: "Tumakuru Rural",
    imageUrl: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80",
    caption: "Community harvesting of Finger Millet (Ragi), Karnataka's climate-resilient staple crop cultivated since the 12th century.",
  },
  {
    id: "gal-8",
    title: "Modern e-NAM Electronic Auction Terminal",
    category: "mandis",
    year: "Digital Era",
    location: "Belagavi APMC",
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    caption: "Farmers verifying online bid receipts and direct bank transfers (DBT) on electronic display screens.",
  },
];

export const USER_MANUAL_FAQS: FaqItem[] = [
  {
    category: "General",
    question: "What is the primary purpose of the AgriIntel Local History & Market Platform?",
    kannadaQuestion: "ಅಗ್ರಿಇಂಟೆಲ್ ವೆಬ್‌ಸೈಟ್‌ನ ಮುಖ್ಯ ಉದ್ದೇಶವೇನು?",
    answer: "AgriIntel Karnataka serves a dual mission: preserving the rich cultural and agricultural heritage of Karnataka's historical mandis and farming visionaries, while providing farmers, wholesalers, and researchers with real-time market intelligence, predictive price forecasting, and multi-source scientific analysis.",
  },
  {
    category: "Navigation",
    question: "How do I switch between Historical Heritage mode and Live Market Intelligence?",
    kannadaQuestion: "ಇತಿಹಾಸ ಮತ್ತು ಲೈವ್ ಮಾರುಕಟ್ಟೆ ನಡುವೆ ಹೇಗೆ ಬದಲಾಯಿಸುವುದು?",
    answer: "Use the top navigation bar. Click 'Home', 'History', 'Places', 'Personalities', 'Timeline', or 'Gallery' to explore historical archives. Click 'Market Atlas' or 'Market Intelligence' to access live APMC yard prices, ML forecasts, logistics calculators, and KrushiMitra tools.",
  },
  {
    category: "Accessibility",
    question: "How do I adjust text sizes or enable High Contrast mode?",
    kannadaQuestion: "ಅಕ್ಷರದ ಗಾತ್ರ ಬದಲಾಯಿಸುವುದು ಮತ್ತು ಹೈ-ಕಾಂಟ್ರಾಸ್ಟ್ ಮೋಡ್ ಹೇಗೆ ಆನ್ ಮಾಡುವುದು?",
    answer: "At the very top of the page, the Top Utility Bar includes 'A-', 'A', and 'A+' buttons to decrease, reset, or increase font size. Click the 'High Contrast' button to switch between the elegant cream/gold theme and a high-contrast dark mode with yellow accents designed for visual comfort.",
  },
  {
    category: "Language",
    question: "Can I use the website in Kannada?",
    kannadaQuestion: "ವೆಬ್‌ಸೈಟನ್ನು ಕನ್ನಡದಲ್ಲಿ ಬಳಸಬಹುದೇ?",
    answer: "Yes! In the Top Utility Bar, click the language dropdown and select 'ಕನ್ನಡ'. Key headings, navigation items, market labels, and AI chatbot prompts will render in Kannada.",
  },
  {
    category: "Market Atlas",
    question: "How do I use the AGMARKNET-style Karnataka Market Atlas map?",
    kannadaQuestion: "ಮಾರ್ಕೆಟ್ ಅಟ್ಲಾಸ್ ನಕ್ಷೆಯನ್ನು ಹೇಗೆ ಬಳಸುವುದು?",
    answer: "Navigate to 'Market Atlas'. Use the Filter Card to select your commodity (e.g. Tomato), district, and market, then click 'Go'. Click any market pin on the interactive Karnataka map to reveal its historical significance, current modal price, arrivals, and trade trends in the side panel.",
  },
  {
    category: "Search",
    question: "How does the search bar work?",
    kannadaQuestion: "ಹುಡುಕಾಟ (Search) ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ?",
    answer: "The prominent search bar on the Homepage and History sections lets you type any keyword (e.g. 'Visvesvaraya', 'Binny Mill', 'Tomato', 'KRS'). It instantly filters historical places, personalities, events, and mandis with zero delay. Click 'Reset / Clear' to view all entries again.",
  },
  {
    category: "Troubleshooting",
    question: "What should I do if a section appears empty or does not load?",
    kannadaQuestion: "ಮಾಹಿತಿ ಲೋಡ್ ಆಗದಿದ್ದರೆ ಏನು ಮಾಡಬೇಕು?",
    answer: "First, ensure your internet connection is active. Click the 'Refresh / Sync' button in the global control bar. If you are accessing backend-powered real-time data, verify that the backend status badge indicates 'Connected'. All historical archives are preserved offline and will always be accessible.",
  },
  {
    category: "Mobile",
    question: "Can I access this platform on Android smartphones and iPhones?",
    kannadaQuestion: "ಮೊಬೈಲ್ ಫೋನ್‌ಗಳಲ್ಲಿ ಇದನ್ನು ಬಳಸಬಹುದೇ?",
    answer: "Absolutely. The layout is 100% responsive. On mobile screens, tap the top-right hamburger menu (☰) to open the accessible slide-out navigation drawer. All maps, sliders, and cards adapt cleanly without horizontal scrolling.",
  },
];

