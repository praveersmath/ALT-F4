import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from "lucide-react";
import { CAROUSEL_SLIDES } from "../data/historyData";

interface InteractiveSliderProps {
  language: "en" | "kn";
  onExploreClick?: (slideIndex: number) => void;
}

export const InteractiveSlider: React.FC<InteractiveSliderProps> = ({
  language,
  onExploreClick,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const totalSlides = CAROUSEL_SLIDES.length;
  const timerRef = useRef<any>(null);

  // Check prefers-reduced-motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsPlaying(false);
    }
  }, []);

  // Handle auto-advance
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % totalSlides);
      }, 5500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const slide = CAROUSEL_SLIDES[currentSlide];

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg border border-[#C5A059]/30 bg-[#2D1E18] text-white"
      role="region"
      aria-label="Agricultural Heritage Image Carousel"
    >
      {/* Background Image Container */}
      <div className="relative h-[340px] sm:h-[400px] md:h-[460px] w-full overflow-hidden">
        <img
          src={slide.imageUrl}
          alt={slide.title}
          className="w-full h-full object-cover object-center transform transition-transform duration-1000 ease-out scale-105"
        />
        {/* Dark cultural gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2D1E18] via-[#2D1E18]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#2D1E18]/90 via-[#2D1E18]/40 to-transparent" />

        {/* Slide Content Overlay */}
        <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-end max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-[#C5A059]/90 text-[#2D1E18] px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase self-start shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#2D1E18]" />
            <span>{slide.period}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#FDFBF7] tracking-tight leading-tight drop-shadow-md">
            {language === "kn" ? slide.kannadaTitle : slide.title}
          </h2>

          <p className="text-sm sm:text-base font-medium text-[#C5A059] leading-relaxed drop-shadow">
            {slide.subtitle}
          </p>

          <p className="text-xs sm:text-sm text-[#E8DFD8] line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-2xl">
            {slide.description}
          </p>

          <div className="pt-2 flex items-center space-x-3">
            {onExploreClick && (
              <button
                onClick={() => onExploreClick(currentSlide)}
                className="px-4 py-2 bg-[#C5A059] hover:bg-[#d4af37] text-[#2D1E18] text-xs sm:text-sm font-bold rounded-lg shadow-md transition transform active:scale-95"
              >
                {language === "kn" ? "ವಿವರಗಳನ್ನು ನೋಡಿ" : "Explore Archive"}
              </button>
            )}
            <span className="text-[11px] text-white/60">
              Slide {currentSlide + 1} of {totalSlides}
            </span>
          </div>
        </div>
      </div>

      {/* Slide Navigation Controls */}
      <div className="absolute bottom-4 right-4 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-1 rounded-full hover:bg-white/20 text-white transition focus:outline-none"
          title={isPlaying ? "Pause automatic slide change" : "Resume automatic slide change"}
          aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#C5A059]" />}
        </button>

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="p-1 rounded-full hover:bg-white/20 text-white transition focus:outline-none"
          title="Previous Slide"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Dot Indicators */}
        <div className="flex items-center space-x-1.5 px-1">
          {CAROUSEL_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlide === idx ? "w-5 bg-[#C5A059]" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              title={`Go to Slide ${idx + 1}`}
              aria-label={`Slide ${idx + 1}`}
              aria-current={currentSlide === idx}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="p-1 rounded-full hover:bg-white/20 text-white transition focus:outline-none"
          title="Next Slide"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

