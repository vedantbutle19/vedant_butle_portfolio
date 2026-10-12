import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, GraduationCap, Calendar, Award, Sparkles, type LucideIcon } from "lucide-react";
import { ImageGalleryCarousel } from "@/components/ImageGalleryCarousel";

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!milestone) return null;

  const IconComponent = milestone.icon || GraduationCap;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative z-10 my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-border/80 bg-background/95 p-6 md:p-8 shadow-2xl backdrop-blur-xl"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 grid h-9 w-9 place-items-center rounded-full border border-border/60 bg-secondary/80 text-muted-foreground transition-all hover:bg-destructive hover:text-destructive-foreground hover:scale-105"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

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

            <ImageGalleryCarousel
              images={milestone.images}
              title={milestone.title}
              wrapperClassName="mb-6"
            />

            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Overview
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {milestone.summary}
                </p>
              </div>

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
        </div>
      )}
    </AnimatePresence>
  );
}
