import React, { useState } from "react";
import { Image, ChevronLeft, ChevronRight, X, Maximize2, MapPin } from "lucide-react";
import { GALLERY_PHOTOS, GalleryPhoto } from "../data/historyData";

interface GalleryViewProps {
  language: "en" | "kn";
}

export const GalleryView: React.FC<GalleryViewProps> = ({ language }) => {
  const [activeCategory, setActiveCategory] = useState<"all" | "mandis" | "farming" | "heritage" | "produce">("all");
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const filteredPhotos =
    activeCategory === "all"
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === activeCategory);

  const openModal = (photoId: string) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photoId);
    if (idx !== -1) setModalIndex(idx);
  };

  const closeModal = () => {
    setModalIndex(null);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (modalIndex !== null) {
      setModalIndex((modalIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (modalIndex !== null) {
      setModalIndex((modalIndex + 1) % filteredPhotos.length);
    }
  };

  const activePhoto: GalleryPhoto | null =
    modalIndex !== null ? filteredPhotos[modalIndex] : null;

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <div className="bg-gradient-to-r from-[#2D1E18] to-[#1A2F3B] text-[#FDFBF7] p-8 rounded-2xl shadow-md border border-[#C5A059]/40">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-2 bg-[#C5A059]/90 text-[#2D1E18] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Image className="w-3.5 h-3.5" />
            <span>Digital Photographic Repository</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === "kn" ? "ಕರ್ನಾಟಕ ಕೃಷಿ ಮತ್ತು ಮಂಡಿ ಛಾಯಾಚಿತ್ರ ಗ್ಯಾಲರಿ" : "Karnataka Agrarian & APMC Mandi Photographic Gallery"}
          </h2>
          <p className="text-xs sm:text-sm text-[#E8DFD8]">
            Archival and contemporary visual records of Karnataka's agricultural life, bullock cart trading auctions, canal systems, and modern electronic e-NAM exchanges.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#C5A059]/30 shadow-sm text-xs">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Photographs" },
            { id: "mandis", label: "APMC Mandis & Auctions" },
            { id: "farming", label: "Agrarian Field Heritage" },
            { id: "heritage", label: "Historical Architecture & Canals" },
            { id: "produce", label: "Karnataka Specialty Produce" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3.5 py-1.5 rounded-lg font-bold transition ${
                activeCategory === cat.id
                  ? "bg-[#2D1E18] text-[#FDFBF7] shadow-sm"
                  : "bg-[#FDFBF7] hover:bg-[#EAECE6] text-[#2D1E18] border border-[#E2E5DC]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <span className="text-[#5B6354] font-medium text-xs">
          Showing {filteredPhotos.length} curated photographs
        </span>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => openModal(photo.id)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-[#C5A059]/30 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 bg-[#2D1E18]/90 text-[#FDFBF7] text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 backdrop-blur-sm transition-opacity duration-300 border border-[#C5A059]">
                  <Maximize2 className="w-3.5 h-3.5 mr-1" />
                  <span>View Full Photo</span>
                </span>
              </div>
              <span className="absolute top-2 left-2 bg-[#2D1E18]/80 text-[#C5A059] text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                {photo.year}
              </span>
            </div>

            <div className="p-4 space-y-1">
              <h3 className="font-bold text-sm text-[#2D1E18] group-hover:text-[#C5A059] transition">
                {photo.title}
              </h3>
              <div className="flex items-center text-[11px] text-[#5B6354]">
                <MapPin className="w-3 h-3 mr-1 text-[#C5A059]" />
                <span>{photo.location}</span>
              </div>
              <p className="text-[11px] text-[#5B6354] line-clamp-2 pt-1">{photo.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FULL-SCREEN IMAGE MODAL VIEWER */}
      {activePhoto && (
        <div
          onClick={closeModal}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#2D1E18] text-[#FDFBF7] rounded-2xl max-w-4xl w-full overflow-hidden border border-[#C5A059] shadow-2xl flex flex-col max-h-[95vh]"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <div className="space-y-0.5">
                <span className="text-[10px] text-[#C5A059] font-bold uppercase tracking-wider">
                  {activePhoto.year} • {activePhoto.category.toUpperCase()}
                </span>
                <h3 className="text-lg font-bold text-white">{activePhoto.title}</h3>
              </div>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Image & Navigation Arrows */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[350px] max-h-[60vh]">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-w-full max-h-[60vh] object-contain"
              />

              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition focus:outline-none"
                title="Previous Image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition focus:outline-none"
                title="Next Image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Caption Footer */}
            <div className="p-4 bg-[#231712] border-t border-white/10 space-y-1 text-xs">
              <div className="flex items-center space-x-2 text-[#C5A059]">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-semibold">{activePhoto.location}</span>
              </div>
              <p className="text-[#E8DFD8] leading-relaxed">{activePhoto.caption}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

