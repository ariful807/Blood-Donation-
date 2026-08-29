import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import { HomeSliderItem } from '../types';
import { formatDriveImageUrl } from '../utils/imageUtils';

interface HomeImageSliderProps {
  sliders: HomeSliderItem[];
  onNavigate: (page: string) => void;
  onOpenEmergencyModal?: () => void;
}

export const HomeImageSlider: React.FC<HomeImageSliderProps> = ({
  sliders,
  onNavigate,
  onOpenEmergencyModal
}) => {
  const activeSliders = (sliders && sliders.length > 0)
    ? sliders.filter(s => s.isActive)
    : [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = activeSliders.length;

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [totalSlides, isPaused]);

  if (totalSlides === 0) {
    return null;
  }

  const currentSlide = activeSliders[currentIndex] || activeSliders[0];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % totalSlides);
  };

  const formattedImageUrl = formatDriveImageUrl(currentSlide.imageUrl);

  return (
    <div 
      className="relative w-full overflow-hidden rounded-3xl bg-stone-900 text-white shadow-xl border border-stone-800 my-6 group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Image with Overlay */}
      <div className="relative h-[340px] sm:h-[400px] md:h-[450px] lg:h-[480px] w-full overflow-hidden">
        {activeSliders.map((slide, idx) => {
          const isActive = idx === currentIndex;
          const bgUrl = formatDriveImageUrl(slide.imageUrl);
          return (
            <div
              key={slide.id || idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <img
                src={bgUrl}
                alt={slide.title}
                className="w-full h-full object-cover object-center scale-105 transition-transform duration-7000 ease-out group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
              {/* Gradient overlays for high contrast readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/30" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            </div>
          );
        })}

        {/* Content Container */}
        <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-10 md:p-12 max-w-4xl">
          {/* Badge */}
          {currentSlide.badge && (
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-600/90 backdrop-blur-md text-white text-xs font-bold w-fit mb-3 border border-red-400/40 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{currentSlide.badge}</span>
            </div>
          )}

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md mb-3">
            {currentSlide.title}
          </h2>

          {/* Subtitle */}
          {currentSlide.subtitle && (
            <p className="text-stone-200 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl drop-shadow mb-6 line-clamp-2 sm:line-clamp-3">
              {currentSlide.subtitle}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {currentSlide.linkPage && (
              <button
                onClick={() => onNavigate(currentSlide.linkPage || 'requests')}
                className="px-6 py-3 bg-gradient-to-r from-[#B71C1C] to-[#D32F2F] hover:from-[#9A0007] hover:to-[#B71C1C] text-white font-bold rounded-2xl text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-200 flex items-center space-x-2 border border-red-500/40 cursor-pointer"
              >
                <span>{currentSlide.linkText || 'বিস্তারিত দেখুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            {onOpenEmergencyModal && (
              <button
                onClick={onOpenEmergencyModal}
                className="px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-semibold rounded-2xl text-sm sm:text-base transition-all duration-200 flex items-center space-x-2 border border-white/30 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                <span>জরুরি রক্তের আবেদন</span>
              </button>
            )}
          </div>
        </div>

        {/* Previous / Next Controls */}
        {totalSlides > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-110"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white border border-white/20 transition-all opacity-80 hover:opacity-100 hover:scale-110"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Indicators */}
        {totalSlides > 1 && (
          <div className="absolute bottom-4 right-4 sm:right-8 z-30 flex items-center space-x-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {activeSliders.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'w-6 bg-red-500' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
