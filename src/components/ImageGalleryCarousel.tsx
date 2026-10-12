import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";

interface ImageGalleryCarouselProps {
  images: string[];
  title: string;
  aspectClassName?: string;
  wrapperClassName?: string;
  showGlow?: boolean;
}

export function ImageGalleryCarousel({
  images,
  title,
  aspectClassName = "aspect-[16/9]",
  wrapperClassName = "",
  showGlow = false,
}: ImageGalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(0);
    setIsZoomed(false);
  }, [images]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isZoomed) {
        e.stopPropagation();
        setIsZoomed(false);
      }
    };
    if (isZoomed) {
      window.addEventListener("keydown", handleKeyDown, true);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [isZoomed]);

  if (!images || images.length === 0) return null;

  const safeIndex = currentIndex < images.length ? currentIndex : 0;
  const currentPhoto = images[safeIndex] || images[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 40) {
      handleNext();
    } else if (distance < -40) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      <div className={`relative group ${wrapperClassName}`}>
        {showGlow && (
          <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-[var(--gradient-brand)] opacity-30 blur-2xl transition-opacity group-hover:opacity-50" />
        )}
        <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-black/40">
          <div
            className={`relative ${aspectClassName} w-full overflow-hidden cursor-pointer`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onClick={() => setIsZoomed(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={safeIndex}
                src={currentPhoto}
                alt={`${title} photo ${safeIndex + 1}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full object-cover select-none"
              />
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />

            <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Click to enlarge</span>
            </div>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-all hover:scale-110 hover:bg-black/80"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-all hover:scale-110 hover:bg-black/80"
                  aria-label="Next photo"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                  {safeIndex + 1} / {images.length}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div
              className="flex items-center justify-center gap-2 py-2.5 bg-card/60 border-t border-border/40"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === safeIndex
                      ? "w-6 bg-[var(--mint)]"
                      : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground"
                  }`}
                  aria-label={`Go to photo ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isZoomed && currentPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setIsZoomed(false)}
              className="absolute right-6 top-6 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
              aria-label="Close zoom view"
            >
              <Minimize2 className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              src={currentPhoto}
              alt="Enlarged view"
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
