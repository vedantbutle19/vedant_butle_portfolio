import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  Sparkles,
  CheckCircle2,
  Maximize2,
  Minimize2,
  Code2,
  Layers,
} from "lucide-react";

export type ProjectItem = {
  id: string;
  title: string;
  category: "AI" | "Web" | "UI";
  desc: string;
  summary: string;
  img: string;
  images: string[];
  tags: string[];
  features?: string[];
  demoUrl?: string;
  githubUrl?: string;
};

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectItem | null;
}

export function ProjectModal({ isOpen, onClose, project }: ProjectModalProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Reset carousel index when modal opens or project changes
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsZoomed(false);
    }
  }, [isOpen, project]);

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

  // Escape key close listener
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

  if (!project) return null;

  const galleryImages =
    project.images && project.images.length > 0 ? project.images : [project.img];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  // Touch Swipe handlers for mobile
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Semi-transparent dark backdrop with blur */}
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

            {/* Header: Category Badge & Title */}
            <div className="mb-5 flex flex-col gap-2 pr-10">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-[var(--mint)]/15 px-3 py-0.5 text-xs font-semibold text-[var(--mint)]">
                  <Sparkles className="h-3 w-3" />
                  {project.category} Project
                </span>
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                {project.title}
              </h3>
            </div>

            {/* Photo Gallery Carousel */}
            {galleryImages.length > 0 && (
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
                      src={galleryImages[currentIndex]}
                      alt={`${project.title} screenshot ${currentIndex + 1}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                      className="h-full w-full object-cover select-none"
                    />
                  </AnimatePresence>

                  {/* Zoom Hint */}
                  <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
                    <Maximize2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Click to enlarge</span>
                  </div>

                  {/* Navigation Arrows */}
                  {galleryImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrev();
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full bg-black/60 text-white backdrop-blur transition-transform hover:scale-110 hover:bg-black/80"
                        aria-label="Previous image"
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
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}

                  {/* Image Counter Badge */}
                  {galleryImages.length > 1 && (
                    <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur">
                      {currentIndex + 1} / {galleryImages.length}
                    </div>
                  )}
                </div>

                {/* Dot Indicators */}
                {galleryImages.length > 1 && (
                  <div className="flex items-center justify-center gap-2 py-2.5 bg-card/60 border-t border-border/40">
                    {galleryImages.map((_, idx) => (
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

            {/* Project Details Content */}
            <div className="space-y-5">
              {/* Summary */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Project Overview
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {project.summary}
                </p>
              </div>

              {/* Key Features */}
              {project.features && project.features.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--mint)] mb-2">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Key Features & Highlights
                  </h4>
                  <ul className="grid gap-2 sm:grid-cols-2">
                    {project.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-muted-foreground md:text-sm"
                      >
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mint)]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Tech Stack Tags */}
              <div>
                <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--lavender)] mb-2">
                  <Code2 className="h-3.5 w-3.5" />
                  Technologies & Frameworks
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-[var(--lavender)]/30 bg-[var(--lavender)]/10 px-3 py-1 text-xs font-medium text-[var(--lavender)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-md transition-transform hover:scale-105"
                  >
                    Launch Live Demo <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-secondary"
                  >
                    View Source Code <Github className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Full Screen Lightbox Zoom Overlay */}
          <AnimatePresence>
            {isZoomed && galleryImages[currentIndex] && (
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
                  src={galleryImages[currentIndex]}
                  alt="Enlarged project view"
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
