import React, { useState, useMemo } from "react";
import {
  Search,
  RotateCcw,
  BookOpen,
  MapPin,
  Calendar,
  Quote,
  Award,
  ChevronRight,
} from "lucide-react";
import {
  HERITAGE_PLACES,
  HERITAGE_PERSONALITIES,
  HERITAGE_EVENTS,
  HeritagePlace,
} from "../data/historyData";

interface HistoryViewProps {
  language: "en" | "kn";
  initialSubTab?: "all" | "places" | "personalities" | "events" | "timeline";
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  language,
  initialSubTab = "places",
}) => {
  const [subTab, setSubTab] = useState<"all" | "places" | "personalities" | "events" | "timeline">(
    initialSubTab
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPlaceModal, setSelectedPlaceModal] = useState<HeritagePlace | null>(null);

  // Filtered lists based on search
  const filteredPlaces = useMemo(() => {
    if (!searchQuery) return HERITAGE_PLACES;
    const q = searchQuery.toLowerCase();
    return HERITAGE_PLACES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.kannadaName.toLowerCase().includes(q) ||
        p.district.toLowerCase().includes(q) ||
        p.historicalImportance.toLowerCase().includes(q) ||
        p.majorCommodities.some((c) => c.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredPersonalities = useMemo(() => {
    if (!searchQuery) return HERITAGE_PERSONALITIES;
    const q = searchQuery.toLowerCase();
    return HERITAGE_PERSONALITIES.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.kannadaName.toLowerCase().includes(q) ||
        p.role.toLowerCase().includes(q) ||
        p.biography.toLowerCase().includes(q) ||
        p.keyAchievements.some((a) => a.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const filteredEvents = useMemo(() => {
    if (!searchQuery) return HERITAGE_EVENTS;
    const q = searchQuery.toLowerCase();
    return HERITAGE_EVENTS.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.kannadaTitle.toLowerCase().includes(q) ||
        e.year.includes(q) ||
        e.period.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const totalResults =
    (subTab === "all" || subTab === "places" ? filteredPlaces.length : 0) +
    (subTab === "all" || subTab === "personalities" ? filteredPersonalities.length : 0) +
    (subTab === "all" || subTab === "events" || subTab === "timeline" ? filteredEvents.length : 0);

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Historical Header Banner */}
      <div className="bg-gradient-to-r from-[#2D1E18] via-[#3E2723] to-[#1F7A3D] text-[#FDFBF7] p-8 rounded-2xl shadow-md border border-[#C5A059]/40 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#C5A059]/90 text-[#2D1E18] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Digital Agrarian Heritage Archive</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === "kn"
              ? "ಕರ್ನಾಟಕ ಕೃಷಿ ಇತಿಹಾಸ ಮತ್ತು ಪರಂಪರೆ ದರ್ಶನ"
              : "Karnataka Agricultural Heritage & Historical Archives"}
          </h2>
          <p className="text-xs sm:text-sm text-[#E8DFD8] leading-relaxed">
            Preserving and honoring the landmark trading mandis, royal water works, agrarian reformers, and legislative breakthroughs that shaped Karnataka's food security across two centuries.
          </p>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-[#C5A059]/30 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Prominent Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#C5A059] absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === "kn"
                  ? "ಸ್ಥಳ, ವ್ಯಕ್ತಿ ಅಥವಾ ಇತಿಹಾಸ ಹುಡುಕಿ (ಉದಾ. ವಿಶ್ವೇಶ್ವರಯ್ಯ, ಬಿನ್ನಿ ಮಿಲ್)..."
                  : "Search places, personalities, events, keywords (e.g. Visvesvaraya, Binny)..."
              }
              className="w-full bg-[#FDFBF7] border border-[#E2E5DC] rounded-lg pl-9 pr-8 py-2 text-xs font-medium text-[#2D1E18] focus:border-[#C5A059]"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-2.5 top-2.5 text-xs text-[#5B6354] hover:text-[#2D1E18]"
                title="Clear Search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sub-Category Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto text-xs">
            {[
              { id: "all", label: "All Archives", count: HERITAGE_PLACES.length + HERITAGE_PERSONALITIES.length + HERITAGE_EVENTS.length },
              { id: "places", label: "Historical Places (Mandis)", count: HERITAGE_PLACES.length },
              { id: "personalities", label: "Pioneering Personalities", count: HERITAGE_PERSONALITIES.length },
              { id: "events", label: "Historical Milestones", count: HERITAGE_EVENTS.length },
              { id: "timeline", label: "Interactive Timeline", count: HERITAGE_EVENTS.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-bold transition text-xs flex items-center space-x-1.5 ${
                  subTab === tab.id
                    ? "bg-[#2D1E18] text-[#FDFBF7] shadow-sm"
                    : "bg-[#FDFBF7] hover:bg-[#EAECE6] text-[#2D1E18] border border-[#E2E5DC]"
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-70 bg-black/10 px-1.5 py-0.2 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {searchQuery && (
          <div className="flex items-center justify-between text-xs text-[#5B6354] pt-1 border-t border-[#E2E5DC]">
            <span>
              Showing <strong>{totalResults}</strong> result(s) for "{searchQuery}"
            </span>
            <button onClick={clearSearch} className="text-[#C5A059] font-bold hover:underline flex items-center">
              <RotateCcw className="w-3 h-3 mr-1" /> Clear search filters
            </button>
          </div>
        )}
      </div>

      {/* EMPTY STATE IF NO RESULTS */}
      {totalResults === 0 && (
        <div className="bg-white p-12 text-center rounded-2xl border border-[#E2E5DC] space-y-3">
          <BookOpen className="w-12 h-12 text-[#C5A059] mx-auto opacity-60" />
          <h3 className="text-base font-bold text-[#2D1E18]">No Matching Historical Records Found</h3>
          <p className="text-xs text-[#5B6354] max-w-md mx-auto">
            We couldn't find any historical places, personalities, or events matching "<strong>{searchQuery}</strong>".
            Try searching for terms like "Visvesvaraya", "KRS", "APMC", "Tomato", or "Hubballi".
          </p>
          <button
            onClick={clearSearch}
            className="px-4 py-2 bg-[#2D1E18] text-[#FDFBF7] rounded-lg text-xs font-bold hover:bg-[#3E2723] transition"
          >
            Reset Filters & View All Records
          </button>
        </div>
      )}

      {/* SECTION A: HISTORICAL PLACES & MANDIS */}
      {(subTab === "all" || subTab === "places") && filteredPlaces.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#C5A059]/40 pb-2">
            <h3 className="text-lg font-bold text-[#2D1E18] flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-[#C5A059]" />
              <span>Historical Places & Heritage APMC Trading Yards</span>
            </h3>
            <span className="text-xs text-[#5B6354]">{filteredPlaces.length} locations</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <div
                key={place.id}
                className="bg-white rounded-2xl border border-[#C5A059]/30 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full overflow-hidden">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#2D1E18]/85 text-[#C5A059] px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide backdrop-blur-sm border border-[#C5A059]/40">
                      {place.establishedPeriod}
                    </div>
                    <div className="absolute top-3 right-3 bg-white/90 text-[#2D1E18] px-2 py-0.5 rounded text-[10px] font-bold">
                      {place.district}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h4 className="font-bold text-base text-[#2D1E18] leading-tight">{place.name}</h4>
                    <p className="text-xs text-[#C5A059] font-medium">{place.kannadaName}</p>
                    <p className="text-xs text-[#5B6354] line-clamp-3 leading-relaxed">{place.historicalImportance}</p>

                    <div className="pt-2 space-y-1">
                      <div className="text-[11px] font-semibold text-[#2D1E18]">Major Heritage Commodities:</div>
                      <div className="flex flex-wrap gap-1">
                        {place.majorCommodities.map((c, i) => (
                          <span
                            key={i}
                            className="bg-[#FDFBF7] text-[#2D1E18] border border-[#E2E5DC] text-[10px] px-2 py-0.5 rounded font-medium"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => setSelectedPlaceModal(place)}
                    className="w-full py-2 bg-[#FDFBF7] hover:bg-[#EAECE6] text-[#2D1E18] border border-[#E2E5DC] rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1"
                  >
                    <span>Read Archival Chronicle</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION B: HISTORICAL PERSONALITIES */}
      {(subTab === "all" || subTab === "personalities") && filteredPersonalities.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-[#C5A059]/40 pb-2">
            <h3 className="text-lg font-bold text-[#2D1E18] flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#C5A059]" />
              <span>Visionaries & Personalities of Karnataka Agriculture</span>
            </h3>
            <span className="text-xs text-[#5B6354]">{filteredPersonalities.length} leaders</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPersonalities.map((person) => (
              <div
                key={person.id}
                className="bg-white p-6 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={person.photographUrl}
                    alt={person.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-[#C5A059]/60 shadow-sm shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="inline-block bg-[#FDFBF7] text-[#C5A059] px-2 py-0.5 rounded text-[10px] font-bold border border-[#E2E5DC]">
                      {person.period}
                    </div>
                    <h4 className="font-bold text-lg text-[#2D1E18]">{person.name}</h4>
                    <p className="text-xs text-[#C5A059] font-medium">{person.kannadaName}</p>
                    <p className="text-xs text-[#5B6354] font-semibold">{person.role}</p>
                  </div>
                </div>

                <p className="text-xs text-[#2D1E18] leading-relaxed">{person.biography}</p>

                <div className="bg-[#FDFBF7] p-3.5 rounded-xl border border-[#E2E5DC] space-y-1.5 text-xs">
                  <div className="font-bold text-[#2D1E18] text-[11px] uppercase tracking-wide">
                    Historical Milestones & Contributions:
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-[#5B6354] text-[11px]">
                    {person.keyAchievements.map((ach, idx) => (
                      <li key={idx} className="leading-snug">
                        {ach}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-[#F7F4EB] p-3 rounded-xl border border-[#C5A059]/30 flex items-start space-x-2 text-xs italic text-[#2D1E18]">
                  <Quote className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>"{person.notableQuote}"</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION C & D: HISTORICAL EVENTS & INTERACTIVE TIMELINE */}
      {(subTab === "all" || subTab === "events" || subTab === "timeline") && filteredEvents.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-[#C5A059]/40 pb-2">
            <h3 className="text-lg font-bold text-[#2D1E18] flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-[#C5A059]" />
              <span>Chronological Timeline & Agrarian Milestones</span>
            </h3>
            <span className="text-xs text-[#5B6354]">From 1884 to Present</span>
          </div>

          <div className="relative pl-6 sm:pl-8 border-l-2 border-[#C5A059] space-y-8 my-4">
            {filteredEvents.map((evt, idx) => (
              <div key={evt.id} className="relative group">
                {/* Timeline node circle */}
                <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-6 h-6 rounded-full bg-[#2D1E18] border-2 border-[#C5A059] flex items-center justify-center text-[10px] text-[#C5A059] font-bold group-hover:bg-[#C5A059] group-hover:text-[#2D1E18] transition">
                  {idx + 1}
                </div>

                <div className="bg-white p-5 rounded-2xl border border-[#C5A059]/30 shadow-sm space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-base font-extrabold text-[#1F7A3D] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {evt.year}
                      </span>
                      <h4 className="font-bold text-base text-[#2D1E18]">{evt.title}</h4>
                    </div>
                    <span className="text-[10px] bg-[#FDFBF7] text-[#5B6354] font-semibold px-2 py-0.5 rounded border border-[#E2E5DC] uppercase">
                      {evt.period}
                    </span>
                  </div>

                  <p className="text-xs text-[#C5A059] font-medium">{evt.kannadaTitle}</p>
                  <p className="text-xs text-[#2D1E18] leading-relaxed">{evt.description}</p>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#E2E5DC] text-[11px]">
                    <span className="text-[#5B6354]">
                      <strong>Impact:</strong> {evt.importance}
                    </span>
                    <span className="bg-[#F7F4EB] text-[#2D1E18] px-2 py-0.5 rounded font-semibold border border-[#C5A059]/30">
                      Outcome: {evt.keyOutcome}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DETAIL MODAL FOR HISTORICAL PLACE */}
      {selectedPlaceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#C5A059] shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs bg-[#FDFBF7] text-[#C5A059] font-bold px-2 py-0.5 rounded border border-[#E2E5DC]">
                  {selectedPlaceModal.establishedPeriod}
                </span>
                <h3 className="text-xl font-bold text-[#2D1E18] mt-1">{selectedPlaceModal.name}</h3>
                <p className="text-xs text-[#C5A059]">{selectedPlaceModal.kannadaName}</p>
              </div>
              <button
                onClick={() => setSelectedPlaceModal(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-[#5B6354] text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <img
              src={selectedPlaceModal.imageUrl}
              alt={selectedPlaceModal.name}
              className="w-full h-56 object-cover rounded-xl border border-[#E2E5DC]"
            />

            <div className="space-y-3 text-xs leading-relaxed text-[#2D1E18]">
              <div>
                <strong className="text-[#2D1E18] block text-[13px] mb-1">Archival Chronicle:</strong>
                <p>{selectedPlaceModal.detailedHistory}</p>
              </div>

              <div className="bg-[#FDFBF7] p-3 rounded-xl border border-[#E2E5DC] space-y-1">
                <div>
                  <strong>Location:</strong> {selectedPlaceModal.location}
                </div>
                <div>
                  <strong>GPS Coordinates:</strong> {selectedPlaceModal.coordinates.lat}° N, {selectedPlaceModal.coordinates.lon}° E
                </div>
                <div>
                  <strong>Heritage Classification:</strong> {selectedPlaceModal.heritageStatus}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-[#E2E5DC] flex justify-end">
              <button
                onClick={() => setSelectedPlaceModal(null)}
                className="px-4 py-2 bg-[#2D1E18] text-[#FDFBF7] rounded-lg text-xs font-bold hover:bg-[#3E2723]"
              >
                Close Archive View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

