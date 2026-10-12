import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Github, Sparkles, CheckCircle2, Code2 } from "lucide-react";
import { ImageGalleryCarousel } from "@/components/ImageGalleryCarousel";

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

  if (!project) return null;

  const galleryImages =
    project.images && project.images.length > 0 ? project.images : [project.img];
  const validDemoUrl = project.demoUrl && project.demoUrl !== "#" ? project.demoUrl : undefined;

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

            <ImageGalleryCarousel
              images={galleryImages}
              title={project.title}
              wrapperClassName="mb-6"
            />

            <div className="space-y-5">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Project Overview
                </h4>
                <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                  {project.summary}
                </p>
              </div>

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

              <div className="flex flex-wrap items-center gap-3 pt-2">
                {validDemoUrl && (
                  <a
                    href={validDemoUrl}
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
        </div>
      )}
    </AnimatePresence>
  );
}
