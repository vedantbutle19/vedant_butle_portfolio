import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Calendar,
  Award,
  Sparkles,
  Maximize2,
  Minimize2,
  type LucideIcon,
} from "lucide-react";

export type AcademicMilestone = {
  id: string;
  title: string;
  org: string;
  period: string;
  icon?: LucideIcon;
  images: string[];
  summary: string;
  achievements?: string[];
  skills?: string[];
};

interface AcademicModalProps {
  isOpen: boolean;
  onClose: () => void;
  milestone: AcademicMilestone | null;
}

export function AcademicModal({ isOpen, onClose, milestone }: AcademicModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Reset image index when modal opens or milestone changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsZoomed(false);
    }
  }, [isOpen, milestone]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isZoomed, onClose]);

  if (!milestone) return null;

  const images = milestone.images && milestone.images.length > 0 ? milestone.images : [];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const IconComponent = milestone.icon || GraduationCap;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Centered Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-border/80 bg-background/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-secondary/80 text-muted-foreground transition-all hover:bg-destructive hover:text-destructive-foreground hover:scale-105"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header: Title & Duration */}
            <div className="mb-6 flex flex-col gap-2 pr-10">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--lavender)]/15 text-[var(--lavender)]">
                  <IconComponent className="h-5 w-5" />
                </div>
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--lavender)]/15 px-3 py-0.5 text-xs font-semibold text-[var(--lavender)]">
                    <Calendar className="h-3 w-3" />
                    {milestone.period}
                  </span>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {milestone.title}
                  </h3>
                </div>
              </div>
              <p className="text-sm font-medium text-[var(--mint)] md:text-base">{milestone.org}</p>
            </div>

            {/* Photo Gallery Carousel */}
            {images.length > 0 && (
              <div className="relative mb-6 overflow-hidden rounded-2xl border border-border/70 bg-black/40">
                <div
                  className="relative aspect-[16/9] w-full overflow-hidden cursor-pointer"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onClick={() => setIsZoomed(true)}
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentIndex}
                      src={images[currentIndex]}
                      alt={`${milestone.title} photo ${currentIndex + 1}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="h-full w-full object-cover select-none"
                    />
                  </AnimatePresence>

                  {/* Zoom Hint Overlay */}
                  <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Click to enlarge</span>
                  </div>

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-transform hover:scale-110 hover:bg-black/80"
                        aria-label="Previous photo"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNext();
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-transform hover:scale-110 hover:bg-black/80"
                        aria-label="Next photo"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Image Counter Badge */}
                  {images.length > 1 && (
                    <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
                      {currentIndex + 1} / {images.length}
                    </div>
                  )}
                </div>

                {/* Dot Indicators */}
                {images.length > 1 && (
                  <div className="flex items-center justify-center gap-2 py-2.5 bg-card/60 border-t border-border/40">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === currentIndex
                            ? "w-6 bg-[var(--mint)]"
                            : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Details Content */}
            <div className="space-y-5">
              {/* Summary */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Overview
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {milestone.summary}
                </p>
              </div>

              {/* Achievements */}
              {milestone.achievements && milestone.achievements.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--mint)] mb-2">
                    <Award className="h-3.5 w-3.5" />
                    Key Highlights & Achievements
                  </h4>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {milestone.achievements.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-muted-foreground md:text-sm"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mint)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills */}
              {milestone.skills && milestone.skills.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--lavender)] mb-2">
                    <Sparkles className="h-3.5 w-3.5" />
                    Skills & Knowledge Gained
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {milestone.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="rounded-lg border border-[var(--lavender)]/30 bg-[var(--lavender)]/10 px-3 py-1 text-xs font-medium text-[var(--lavender)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Image Lightbox Zoom Overlay */}
          <AnimatePresence>
            {isZoomed && images[currentIndex] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsZoomed(false)}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl cursor-zoom-out"
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
                  src={images[currentIndex]}
                  alt="Enlarged view"
                  className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
