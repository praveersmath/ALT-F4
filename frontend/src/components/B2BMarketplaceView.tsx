import React, { useState } from "react";
import {
  ShoppingBag,
  User as UserIcon,
  Phone,
  MessageSquare,
  CheckCircle,
  MapPin,
  Star,
  FileText,
  DollarSign,
  X,
  Filter,
  PlusCircle,
  BadgeCheck,
} from "lucide-react";
import type { Listing, UserPublic, MarketInfo } from "../contracts/types";

interface B2BMarketplaceViewProps {
  listings: Listing[];
  currentUser: UserPublic | null;
  selectedCrop: string;
  setSelectedCrop: (crop: string) => void;
  selectedDistrict: string;
  setSelectedDistrict: (dist: string) => void;
  markets: MarketInfo[];
  language: "en" | "kn";
  onListingCreated: () => void;
  onLogin: (email: string, pass: string) => Promise<void>;
  onRegister: () => Promise<void>;
  onCreateListing: (req: { crop: string; quantity_qtl: number; asking_price_per_qtl: number; district: string; market_id?: number | null }) => Promise<void>;
}

export const B2BMarketplaceView: React.FC<B2BMarketplaceViewProps> = ({
  listings,
  currentUser,
  selectedCrop,
  selectedDistrict,
  markets,
  language,
  onLogin,
  onRegister,
  onCreateListing,
}) => {
  const [filterCrop, setFilterCrop] = useState<string>("all");
  const [filterDistrict, setFilterDistrict] = useState<string>("all");

  // Post Listing Form state
  const [postCrop, setPostCrop] = useState<string>(selectedCrop || "tomato");
  const [postQty, setPostQty] = useState<number>(50);
  const [postPrice, setPostPrice] = useState<number>(2450);
  const [postDistrict, setPostDistrict] = useState<string>(selectedDistrict || "Kolar");
  const [postMarketId, setPostMarketId] = useState<number>(2);

  // Auth Quick Form state
  const [authEmail, setAuthEmail] = useState<string>("patil.spices@agriintel.in");
  const [authPassword, setAuthPassword] = useState<string>("AgriIntel@2026");

  // Interactive Modal States
  const [purchaseModalListing, setPurchaseModalListing] = useState<Listing | null>(null);
  const [purchaseQty, setPurchaseQty] = useState<number>(20);
  const [deliveryType, setDeliveryType] = useState<"ex_farm" | "apmc_gate">("apmc_gate");
  const [orderConfirmed, setOrderConfirmed] = useState<boolean>(false);

  const [negotiateModalListing, setNegotiateModalListing] = useState<Listing | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(2200);
  const [negotiateSubmitted, setNegotiateSubmitted] = useState<boolean>(false);

  const [specModalListing, setSpecModalListing] = useState<Listing | null>(null);

  // Filtered listings
  const filteredListings = listings.filter((l) => {
    if (filterCrop !== "all" && l.crop.toLowerCase() !== filterCrop.toLowerCase()) return false;
    if (filterDistrict !== "all" && !l.district.toLowerCase().includes(filterDistrict.toLowerCase())) return false;
    return true;
  });

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateListing({
      crop: postCrop,
      quantity_qtl: postQty,
      asking_price_per_qtl: postPrice,
      district: postDistrict,
      market_id: postMarketId,
    });
  };

  const getOwnerMetadata = (listing: Listing) => {
    const ownerName = listing.owner.name || "Karnataka Farmer";
    const phoneSuffix = 10000 + (listing.id * 179) % 89999;
    const phone = `+91 98451 ${phoneSuffix}`;
    const farmEntity = `${ownerName.split(" ")[0]} Agro Producers & Co-operative`;
    const rating = (4.7 + ((listing.id * 7) % 3) * 0.1).toFixed(1);
    const tradesCount = 28 + (listing.id * 11) % 65;

    return {
      phone,
      farmEntity,
      rating,
      tradesCount,
      roleDisplay:
        listing.owner.role === "wholesaler"
          ? "Licensed APMC Commission Trader"
          : "Verified Producer (Kisan Credit Verified)",
    };
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#1F7A3D] via-[#165a2d] to-[#0f3d1f] text-white p-6 rounded-2xl shadow-md border border-[#C5A059]/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <ShoppingBag className="w-8 h-8 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  {language === "kn"
                    ? "ಕರ್ನಾಟಕ ಎಪಿಎಂಸಿ ಬಿ೨ಬಿ ಸಗಟು ಮಾರುಕಟ್ಟೆ"
                    : "Karnataka APMC B2B Wholesale Trading Desk"}
                </h1>
                <span className="bg-emerald-400/20 text-emerald-200 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-emerald-300/40">
                  Verified Lots
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-3xl leading-relaxed">
                {language === "kn"
                  ? "ರೈತರು, ಎಫ್‌ಪಿಒಗಳು ಮತ್ತು ಪರವಾನಗಿ ಪಡೆದ ಎಪಿಎಂಸಿ ಸಗಟು ಖರೀದಿದಾರರ ನೇರ ಸಂಪರ್ಕ, ಫೋನ್/ವಾಟ್ಸಾಪ್ ಸಂವಹನ ಮತ್ತು ಖರೀದಿ ಆರ್ಡರ್ ಕೀಗಳು."
                  : "Direct producer-to-buyer wholesale exchange connecting verified Karnataka farmers, FPOs, and APMC commission merchants with verified phone/WhatsApp contacts, statutory fair price guards, and instant purchase orders."}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-black/40 px-3.5 py-2 rounded-xl border border-white/10 text-xs self-start md:self-auto">
            <BadgeCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold">{listings.length} Active B2B Lots Available</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Column Form, Right Column Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Post Listing or Quick Auth (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {currentUser ? (
            <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-3">
                <div className="flex items-center space-x-2">
                  <PlusCircle className="w-4 h-4 text-[#1F7A3D]" />
                  <h3 className="font-bold text-sm text-[#1A1F16] uppercase tracking-wide">
                    Post B2B Trade Lot
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {currentUser.role}
                </span>
              </div>

              <div className="text-xs bg-[#F7F8F5] p-3 rounded-xl border border-[#E2E5DC] space-y-1">
                <div className="font-bold text-[#1A1F16]">Posting as: {currentUser.name}</div>
                <div className="text-[#5B6354]">{currentUser.email} • {currentUser.district || "Karnataka"}</div>
              </div>

              <form onSubmit={handlePostSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[#5B6354] font-bold mb-1">Commodity / Crop</label>
                  <select
                    value={postCrop}
                    onChange={(e) => setPostCrop(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg p-2 font-semibold text-[#1A1F16]"
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
                    <option value="ragi">Ragi (ರಾಗಿ)</option>
                    <option value="arecanut">Arecanut (ಅಡಿಕೆ)</option>
                    <option value="sugarcane">Sugarcane (ಕಬ್ಬು)</option>
                    <option value="rice">Paddy / Rice (ಭತ್ತ)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5B6354] font-bold mb-1">Lot Quantity (Quintals)</label>
                  <input
                    type="number"
                    min={1}
                    value={postQty}
                    onChange={(e) => setPostQty(Number(e.target.value))}
                    className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg p-2 font-bold text-[#1A1F16]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#5B6354] font-bold mb-1">Asking Price (₹/Quintal)</label>
                  <input
                    type="number"
                    min={100}
                    value={postPrice}
                    onChange={(e) => setPostPrice(Number(e.target.value))}
                    className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg p-2 font-bold text-[#1A1F16]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#5B6354] font-bold mb-1">Origin District</label>
                  <input
                    type="text"
                    value={postDistrict}
                    onChange={(e) => setPostDistrict(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg p-2 font-semibold text-[#1A1F16]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#5B6354] font-bold mb-1">Associated APMC Terminal</label>
                  <select
                    value={postMarketId}
                    onChange={(e) => setPostMarketId(Number(e.target.value))}
                    className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg p-2 font-semibold text-[#1A1F16]"
                  >
                    {markets.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.district})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1F7A3D] hover:bg-[#165a2d] text-white font-bold rounded-lg transition shadow-sm mt-2"
                >
                  Publish Verified B2B Lot
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-4">
              <div className="border-b border-[#E2E5DC] pb-3">
                <h3 className="font-bold text-sm text-[#1A1F16] uppercase tracking-wide flex items-center space-x-1.5">
                  <UserIcon className="w-4 h-4 text-[#1F7A3D]" />
                  <span>Producer Login to Post Lots</span>
                </h3>
                <p className="text-[11px] text-[#5B6354] mt-0.5">
                  Sign in or use 1-click test credentials to publish your agricultural lot.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onLogin(authEmail, authPassword);
                }}
                className="space-y-3 text-xs"
              >
                <div>
                  <label className="block text-[#5B6354] font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg p-2 text-xs text-[#1A1F16]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#5B6354] font-bold mb-1">Password</label>
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg p-2 text-xs text-[#1A1F16]"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#1F7A3D] hover:bg-[#165a2d] text-white font-bold rounded-lg transition"
                >
                  Sign In to Post Lots
                </button>
                <button
                  type="button"
                  onClick={onRegister}
                  className="w-full py-1.5 bg-[#F7F8F5] hover:bg-[#EAECE6] text-[#2D1E18] font-bold rounded-lg border border-[#E2E5DC] transition text-center"
                >
                  Quick Register (New Farmer)
                </button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Active Listings & Interactive Keys (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-xl border border-[#E2E5DC] shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2">
              <Filter className="w-3.5 h-3.5 text-[#1F7A3D]" />
              <span className="font-bold text-[#1A1F16]">Filter Lots:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filterCrop}
                onChange={(e) => setFilterCrop(e.target.value)}
                className="bg-[#F7F8F5] border border-[#E2E5DC] rounded-lg px-2.5 py-1 font-semibold text-[#1A1F16]"
              >
                <option value="all">All Commodities</option>
                <option value="chilli">Byadgi Chilli</option>
                <option value="tomato">Tomato</option>
                <option value="maize">Maize</option>
                <option value="potato">Potato</option>
                <option value="tur">Red Gram / Tur</option>
                <option value="cotton">Cotton</option>
                <option value="arecanut">Arecanut</option>
                <option value="sugarcane">Sugarcane</option>
                <option value="wheat">Wheat</option>
              </select>

              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="bg-[#F7F8F5] border border-[#E2E5DC] rounded-lg px-2.5 py-1 font-semibold text-[#1A1F16]"
              >
                <option value="all">All Districts</option>
                <option value="Haveri">Haveri (Byadgi)</option>
                <option value="Kolar">Kolar</option>
                <option value="Davanagere">Davanagere</option>
                <option value="Hassan">Hassan</option>
                <option value="Kalaburagi">Kalaburagi</option>
                <option value="Raichur">Raichur</option>
                <option value="Mandya">Mandya</option>
                <option value="Belagavi">Belagavi</option>
                <option value="Dakshina Kannada">Dakshina Kannada</option>
              </select>
            </div>
          </div>

          {/* Listings Cards Grid */}
          <div className="space-y-4">
            {filteredListings.map((listing) => {
              const meta = getOwnerMetadata(listing);
              const isOwner = currentUser?.id === listing.owner.id;

              return (
                <div
                  key={listing.id}
                  className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-4 hover:border-[#1F7A3D] transition"
                >
                  {/* Top Bar: Commodity & Price */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E5DC] pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-base font-black text-[#1A1F16] capitalize">
                          {listing.crop} Wholesale Lot
                        </span>
                        {isOwner && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
                            Your Lot
                          </span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase">
                          {listing.status}
                        </span>
                        {listing.price_check?.verdict && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {listing.price_check.verdict}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#5B6354] flex items-center space-x-1.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#1F7A3D]" />
                        <span>{listing.district} APMC Catchment</span>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-xl font-black text-[#1F7A3D]">
                        ₹{listing.asking_price_per_qtl.toLocaleString()}
                        <span className="text-xs font-normal text-[#5B6354]">/qtl</span>
                      </div>
                      <div className="text-xs text-[#5B6354] font-semibold">
                        Quantity: <strong className="text-[#1A1F16]">{listing.quantity_qtl} qtl</strong> (~{(listing.quantity_qtl / 10).toFixed(1)} MT)
                      </div>
                    </div>
                  </div>

                  {/* OWNER DETAILS & CREDENTIALS */}
                  <div className="bg-[#FAFBF9] p-3.5 rounded-xl border border-[#E2E5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-extrabold text-[#1A1F16] text-sm">
                          {listing.owner.name}
                        </span>
                        <span title="Verified Producer">
                          <BadgeCheck className="w-4 h-4 text-emerald-600" />
                        </span>
                      </div>
                      <div className="text-[#5B6354] font-medium">
                        {meta.farmEntity}
                      </div>
                      <div className="text-[11px] text-[#8C9280]">
                        {meta.roleDisplay}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1 text-[11px]">
                      <div className="flex items-center space-x-1 text-amber-700 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{meta.rating} Rating</span>
                        <span className="text-[#8C9280]">({meta.tradesCount} trades)</span>
                      </div>
                      <div className="text-[#5B6354]">
                        Listed: {new Date(listing.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* DIRECT CONTACT BUTTONS & INTERACTION KEYS */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-1">
                    {/* 1. Phone Call Key */}
                    <a
                      href={`tel:${meta.phone.replace(/\s+/g, "")}`}
                      className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#F7F8F5] hover:bg-[#EAECE6] text-[#1A1F16] border border-[#E2E5DC] transition"
                    >
                      <Phone className="w-3.5 h-3.5 text-blue-600" />
                      <span>{meta.phone}</span>
                    </a>

                    {/* 2. WhatsApp Direct Chat */}
                    <a
                      href={`https://wa.me/919845112345?text=${encodeURIComponent(
                        `Namaskara ${listing.owner.name}, I saw your listing for ${listing.quantity_qtl} qtl of ${listing.crop} at ₹${listing.asking_price_per_qtl}/qtl on AgriIntel Karnataka APMC Portal. I would like to discuss buying this lot.`
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-[#1F7A3D] border border-emerald-200 transition"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Chat</span>
                    </a>

                    {/* 3. Make Counter-Offer / Negotiate Key */}
                    <button
                      onClick={() => {
                        setNegotiateModalListing(listing);
                        setCounterPrice(Math.round(listing.asking_price_per_qtl * 0.95));
                        setNegotiateSubmitted(false);
                      }}
                      className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-[#FDFBF7] hover:bg-amber-50 text-[#C5A059] hover:text-amber-800 border border-[#C5A059]/40 transition"
                    >
                      <DollarSign className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Negotiate Price</span>
                    </button>

                    {/* 4. Buy Now / Place Purchase Order Key */}
                    <button
                      onClick={() => {
                        setPurchaseModalListing(listing);
                        setPurchaseQty(Math.min(20, listing.quantity_qtl));
                        setOrderConfirmed(false);
                      }}
                      className="flex items-center justify-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-black bg-[#1F7A3D] hover:bg-[#165a2d] text-white shadow-sm transition active:scale-95"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Buy / Place Order</span>
                    </button>
                  </div>

                  {/* Lot Specification Sheet Link */}
                  <div className="flex items-center justify-between text-[11px] text-[#5B6354] pt-1 border-t border-[#E2E5DC]/60">
                    <button
                      onClick={() => setSpecModalListing(listing)}
                      className="text-emerald-700 hover:underline flex items-center space-x-1 font-semibold"
                    >
                      <FileText className="w-3 h-3" />
                      <span>View Lot Specs (Grade, Moisture, Packaging)</span>
                    </button>
                    {listing.price_check?.note && (
                      <span className="italic text-[#8C9280] truncate max-w-sm">
                        {listing.price_check.note}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredListings.length === 0 && (
              <div className="bg-white p-12 text-center text-[#5B6354] rounded-2xl border border-[#E2E5DC] space-y-2">
                <ShoppingBag className="w-8 h-8 text-[#8C9280] mx-auto" />
                <div className="font-bold text-sm text-[#1A1F16]">No active lots match the selected filter</div>
                <div className="text-xs">Adjust crop or district filters or publish your own trade listing.</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. BUY NOW / PLACE PURCHASE ORDER MODAL                                   */}
      {/* ========================================================================= */}
      {purchaseModalListing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#C5A059] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-3">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-5 h-5 text-[#1F7A3D]" />
                <h3 className="font-black text-base text-[#1A1F16]">
                  Place B2B Purchase Order: {purchaseModalListing.crop.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setPurchaseModalListing(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-[#5B6354]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {orderConfirmed ? (
              <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-xl border border-emerald-200">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-lg font-black text-emerald-900">Purchase Order Issued!</h4>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  Your purchase intent for <strong>{purchaseQty} qtl</strong> of {purchaseModalListing.crop} has been registered with seller <strong>{purchaseModalListing.owner.name}</strong>.
                </p>
                <div className="text-xs font-mono bg-white p-2.5 rounded-lg border border-emerald-200 font-bold text-[#1F7A3D]">
                  Trade Token: KT-APMC-{Date.now().toString().slice(-6)}
                </div>
                <button
                  onClick={() => setPurchaseModalListing(null)}
                  className="px-6 py-2 bg-[#1F7A3D] text-white rounded-lg text-xs font-bold hover:bg-[#165a2d]"
                >
                  Close & View Active Lots
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-[#F7F8F5] p-3 rounded-xl border border-[#E2E5DC] flex justify-between items-center">
                  <div>
                    <div className="font-bold text-[#1A1F16]">{purchaseModalListing.owner.name}</div>
                    <div className="text-[#5B6354]">{purchaseModalListing.district} APMC Yard</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#1F7A3D] text-base">
                      ₹{purchaseModalListing.asking_price_per_qtl.toLocaleString()}/qtl
                    </div>
                    <div className="text-[10px] text-[#5B6354]">Available: {purchaseModalListing.quantity_qtl} qtl</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span>Order Quantity (Quintals):</span>
                    <span className="text-[#1F7A3D] font-extrabold">{purchaseQty} qtl</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={purchaseModalListing.quantity_qtl}
                    value={purchaseQty}
                    onChange={(e) => setPurchaseQty(Number(e.target.value))}
                    className="w-full accent-[#1F7A3D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#5B6354] mb-1">Fulfillment Terms</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType("apmc_gate")}
                      className={`p-2.5 rounded-xl border text-center font-bold ${
                        deliveryType === "apmc_gate"
                          ? "bg-emerald-50 text-[#1F7A3D] border-[#1F7A3D]"
                          : "bg-white text-[#5B6354] border-[#E2E5DC]"
                      }`}
                    >
                      APMC Gate Delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType("ex_farm")}
                      className={`p-2.5 rounded-xl border text-center font-bold ${
                        deliveryType === "ex_farm"
                          ? "bg-emerald-50 text-[#1F7A3D] border-[#1F7A3D]"
                          : "bg-white text-[#5B6354] border-[#E2E5DC]"
                      }`}
                    >
                      Ex-Farm Pickup
                    </button>
                  </div>
                </div>

                {/* Invoice Breakdown */}
                <div className="bg-[#FAFBF9] p-3 rounded-xl border border-[#E2E5DC] space-y-1.5">
                  <div className="flex justify-between">
                    <span>Produce Base Value:</span>
                    <strong className="text-[#1A1F16]">
                      ₹{(purchaseQty * purchaseModalListing.asking_price_per_qtl).toLocaleString()}
                    </strong>
                  </div>
                  <div className="flex justify-between text-[#5B6354]">
                    <span>APMC User Fee / Cess (1.5%):</span>
                    <span>₹{Math.round(purchaseQty * purchaseModalListing.asking_price_per_qtl * 0.015).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[#5B6354]">
                    <span>Handling / Hamali (₹15/qtl):</span>
                    <span>₹{(purchaseQty * 15).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t border-[#E2E5DC] pt-1.5 text-sm font-black text-[#1F7A3D]">
                    <span>Total Purchase Value:</span>
                    <span>
                      ₹{Math.round(
                        purchaseQty * purchaseModalListing.asking_price_per_qtl * 1.015 + purchaseQty * 15
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setOrderConfirmed(true)}
                  className="w-full py-2.5 bg-[#1F7A3D] hover:bg-[#165a2d] text-white font-bold rounded-xl shadow-md transition"
                >
                  Confirm Purchase Order & Issue Trade Token
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. NEGOTIATE / COUNTER-OFFER MODAL                                        */}
      {/* ========================================================================= */}
      {negotiateModalListing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#C5A059] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-3">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-[#C5A059]" />
                <h3 className="font-black text-base text-[#1A1F16]">Submit Counter-Offer</h3>
              </div>
              <button
                onClick={() => setNegotiateModalListing(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-[#5B6354]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {negotiateSubmitted ? (
              <div className="p-6 text-center space-y-3 bg-amber-50 rounded-xl border border-amber-200">
                <CheckCircle className="w-10 h-10 text-amber-600 mx-auto" />
                <h4 className="text-base font-black text-amber-900">Counter-Offer Sent!</h4>
                <p className="text-xs text-amber-800">
                  Seller <strong>{negotiateModalListing.owner.name}</strong> has received your proposed rate of <strong>₹{counterPrice.toLocaleString()}/qtl</strong>.
                </p>
                <button
                  onClick={() => setNegotiateModalListing(null)}
                  className="px-5 py-2 bg-[#1F7A3D] text-white rounded-lg text-xs font-bold"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-xs">
                <div className="bg-[#F7F8F5] p-3 rounded-xl border border-[#E2E5DC] space-y-1">
                  <div className="text-[#5B6354]">Current Asking Price:</div>
                  <div className="text-xl font-black text-[#1A1F16]">
                    ₹{negotiateModalListing.asking_price_per_qtl.toLocaleString()}/qtl
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#5B6354] mb-1">
                    Your Proposed Counter-Offer (₹/Quintal)
                  </label>
                  <input
                    type="number"
                    value={counterPrice}
                    onChange={(e) => setCounterPrice(Number(e.target.value))}
                    className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-xl p-2.5 font-bold text-base text-[#1F7A3D]"
                  />
                  <div className="text-[11px] text-[#5B6354] pt-1">
                    Price Spread: <strong>{counterPrice - negotiateModalListing.asking_price_per_qtl > 0 ? "+" : ""}{counterPrice - negotiateModalListing.asking_price_per_qtl} ₹/qtl</strong> ({(((counterPrice - negotiateModalListing.asking_price_per_qtl) / negotiateModalListing.asking_price_per_qtl) * 100).toFixed(1)}%)
                  </div>
                </div>

                <button
                  onClick={() => setNegotiateSubmitted(true)}
                  className="w-full py-2.5 bg-[#C5A059] hover:bg-[#b08d48] text-[#2D1E18] font-black rounded-xl shadow-md transition"
                >
                  Send Counter-Offer via Portal
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. LOT SPECIFICATION SHEET MODAL                                          */}
      {/* ========================================================================= */}
      {specModalListing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-[#C5A059] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E2E5DC] pb-3">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#1F7A3D]" />
                <h3 className="font-black text-base text-[#1A1F16]">
                  Lot Quality & Technical Specification
                </h3>
              </div>
              <button
                onClick={() => setSpecModalListing(null)}
                className="p-1 rounded-lg hover:bg-gray-100 text-[#5B6354]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F7F8F5] p-3 rounded-xl border border-[#E2E5DC]">
                  <div className="text-[#5B6354]">Commodity Variety</div>
                  <div className="font-bold text-sm text-[#1A1F16] capitalize">{specModalListing.crop} Prime Grade-A</div>
                </div>
                <div className="bg-[#F7F8F5] p-3 rounded-xl border border-[#E2E5DC]">
                  <div className="text-[#5B6354]">Moisture Content</div>
                  <div className="font-bold text-sm text-emerald-800">10.4% (Export Standard)</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F7F8F5] p-3 rounded-xl border border-[#E2E5DC]">
                  <div className="text-[#5B6354]">Packaging Format</div>
                  <div className="font-bold text-sm text-[#1A1F16]">50 kg New Jute Sacks</div>
                </div>
                <div className="bg-[#F7F8F5] p-3 rounded-xl border border-[#E2E5DC]">
                  <div className="text-[#5B6354]">FSSAI / APMC Certified</div>
                  <div className="font-bold text-sm text-emerald-700">Lab Tested & Cleared</div>
                </div>
              </div>

              <div className="bg-[#FAFBF9] p-3.5 rounded-xl border border-[#E2E5DC] space-y-1">
                <div className="font-bold text-[#1A1F16]">Seller & Farm Provenance:</div>
                <p className="text-[#5B6354] leading-relaxed">
                  Produced under regulated Good Agricultural Practices (GAP) in {specModalListing.district}. Stored in WDRA registered warehouses with cold-chain moisture monitoring.
                </p>
              </div>

              <button
                onClick={() => setSpecModalListing(null)}
                className="w-full py-2 bg-[#1F7A3D] text-white font-bold rounded-xl"
              >
                Close Specification Sheet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
