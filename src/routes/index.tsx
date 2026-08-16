// Special Moments
import gadkari1 from "@/assets/nitin gadkari.jpeg";
import gadkari2 from "@/assets/nitin gadkari 2.PNG";

import certificate from "@/assets/certificate.PNG";
import culturalScreenshot1 from "@/assets/Screenshot 2026-08-05 153136.png";
import insight25 from "@/assets/insight25.JPG";
import culturalScreenshot2 from "@/assets/Screenshot 2026-08-05 153108.png";
import walk from "@/assets/walk.jpeg";
import insight25_2 from "@/assets/insight252.JPG";

import cdcCoordinator from "@/assets/CDC coordinator.png";
import placementPhoto from "@/assets/WhatsApp Image 2025-12-03 at 16.23.01_68a5aa43.jpg";
import nss from "@/assets/nss.jpg";

import zindagii1 from "@/assets/Screenshot 2026-08-12 201056.png";
import zindagii2 from "@/assets/Screenshot 2026-08-12 203429.png";

// Education
import btech1 from "@/assets/537154818_1284932906981488_120772090917446355_n.jpg";
import batch2026 from "@/assets/batch2026.jpg";
import aiverse from "@/assets/aiverse.jpeg";
import baitak from "@/assets/baitak.jpg";
import baitak2 from "@/assets/baitak2.jpg";

import iinsight1 from "@/assets/iinsight1.jpg";
import iinsight2 from "@/assets/iinsight2.avif";

import swarneela from "@/assets/swarneela.jpg";
import flagParade from "@/assets/flag paraid.jpeg";
import batchCeremony from "@/assets/batch ceremony.jpeg";
import councilMembers from "@/assets/council members.jpeg";

// Projects
import icar1 from "@/assets/icar1.png";
import icar2 from "@/assets/icar2.png";
import icar3 from "@/assets/icar3.png";
import soil1 from "@/assets/soil_1.jpg";

import pneumonia1 from "@/assets/pneumonia1.png";
import pneumonia2 from "@/assets/pneumonia2.png";
import pneumoniaProject1 from "@/assets/pneumonia_1.jpg";

import ppekit3 from "@/assets/ppekit3.jpg";
import ppekit4 from "@/assets/ppekit4.jpg";
import ppekit5 from "@/assets/ppekit5.jpg";
import ppekitMain from "@/assets/1763977201502.jpg";

import aaplaShetkari1 from "@/assets/aaplashetkari1.png";
import aaplaShetkari2 from "@/assets/aaplashetkari2.png";
import aaplaShetkari3 from "@/assets/aaplashetkari3.png";
import { createFileRoute } from "@tanstack/react-router";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useState, useRef, type ReactNode } from "react";
import {
  ArrowRight,
  Download,
  Mail,
  Github,
  Linkedin,
  Dribbble,
  ChevronDown,
  Palette,
  Code2,
  Brain,
  Zap,
  Bot,
  Smartphone,
  Database,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Wrench,
  Twitter,
  Send,
  Briefcase,
  GraduationCap,
  Rocket,
  Sun,
  Moon,
  Eye,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Music2,
  X,
  BarChart3,
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { AcademicModal, type AcademicMilestone } from "@/components/AcademicModal";
import { ProjectModal, type ProjectItem } from "@/components/ProjectModal";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import heroImg from "@/assets/vedant-hero.jpg";
import aboutImg from "@/assets/vedant-about.jpg";
import resumePdfFile from "@/assets/vedant vivek butle resume 2026.pdf";
import bunnyLogo from "@/assets/bunny_developer_logo_pro (1).png";

export const resumeUrl = resumePdfFile;
const resumeDownloadName = "Vedant_Butle_Resume.pdf";

export const Route = createFileRoute("/")({
  component: PortfolioPage,
});

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#moments", label: "Moments" },
  { href: "#experience", label: "Experience" },
  { href: "#education", label: "Education" },
  { href: "#services", label: "Services" },
  { href: "#projects", label: "Projects" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

type TestimonialItem = {
  text: string;
  name: string;
  role: string;
  initials: string;
};

const initialTestimonials: TestimonialItem[] = [
  {
    text: "Vedant did an amazing job designing a user-friendly and intuitive experience for our project. His attention to detail and creativity made a huge difference!",
    name: "Pritish Manwatkar",
    role: "Machine Learning Engineer",
    initials: "PM",
  },
  {
    text: "Working with Vedant was fantastic. He transformed our complex requirements into a beautiful, intuitive interface that our users love.",
    name: "Shrushti Satpute",
    role: "Data Analyst",
    initials: "SS",
  },
];

function PortfolioPage() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [testimonials, setTestimonials] = useState(initialTestimonials);

  const addTestimonial = (testimonial: TestimonialItem) => {
    setTestimonials((prev) => [testimonial, ...prev]);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <BackgroundOrbs />
      <Header onViewResume={() => setResumeOpen(true)} />
      <ResumeModal open={resumeOpen} onOpenChange={setResumeOpen} />
      <main>
        <Hero onViewResume={() => setResumeOpen(true)} />
        <About />
        <SpecialMoments />
        <ExperienceEducation />
        <Services />
        <Projects />
        <Testimonials testimonials={testimonials} />
        <Contact onSendMessage={addTestimonial} />
      </main>
      <Footer />
    </div>
  );
}

/* ---------- Background ---------- */
function BackgroundOrbs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-[var(--mint)] opacity-20 blur-3xl animate-float" />
      <div className="absolute top-1/3 -right-40 h-[600px] w-[600px] rounded-full bg-[var(--lavender)] opacity-15 blur-3xl animate-float [animation-delay:2s]" />
      <div className="absolute bottom-0 left-1/3 h-[500px] w-[500px] rounded-full bg-[var(--violet-brand)] opacity-15 blur-3xl animate-float [animation-delay:4s]" />
    </div>
  );
}

/* ---------- Header ---------- */
function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-secondary/40 text-foreground transition-colors hover:bg-secondary ${className}`}
    >
      {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

function ResumeModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-5xl overflow-y-auto p-3 sm:p-6">
        <DialogHeader>
          <DialogTitle>Resume — Vedant Butle</DialogTitle>
        </DialogHeader>
        <div className="relative h-[75vh] w-full overflow-hidden rounded-xl border border-border/80 bg-black/40">
          <iframe
            src={`${resumeUrl}#toolbar=0`}
            title="Vedant Butle Resume PDF"
            className="h-full w-full rounded-xl border-none"
          />
        </div>
        <DialogFooter className="sm:justify-center">
          <a
            href={resumeUrl}
            download={resumeDownloadName}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
          >
            <Download className="h-4 w-4" /> Download PDF Resume
          </a>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Header({ onViewResume }: { onViewResume: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a
          href="#home"
          className="inline-flex items-center gap-3 text-lg font-bold text-foreground"
        >
          <img
            src={bunnyLogo}
            alt="Vedant Butle Portfolio"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="text-xl font-bold text-gradient animate-gradient">
            Vedant Butle Portfolio
          </span>
        </a>
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li className="ml-2">
              <ThemeToggle />
            </li>
          </ul>
        </nav>
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden rounded-md p-2 text-foreground"
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 bg-current transition ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`block h-0.5 w-6 bg-current transition ${open ? "opacity-0" : ""}`} />
            <span
              className={`block h-0.5 w-6 bg-current transition ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </div>
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden overflow-hidden border-t border-border bg-background/80 backdrop-blur-xl"
          >
            <ul className="flex flex-col p-4">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    onClick={() => setOpen(false)}
                    href={l.href}
                    className="block rounded-md px-3 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ---------- Reveal helper ---------- */
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto mb-14 max-w-2xl text-center">
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <Sparkles className="h-3 w-3 text-[var(--mint)]" /> {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
        <span className="text-gradient animate-gradient">{title}</span>
      </h2>
      {subtitle && <p className="mt-4 text-base text-muted-foreground md:text-lg">{subtitle}</p>}
    </div>
  );
}

/* ---------- Hero ---------- */
function Hero({ onViewResume }: { onViewResume: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col items-center justify-center gap-10 px-6 py-20 lg:flex-row lg:gap-16"
    >
      <motion.div style={{ y, opacity }} className="flex-1 space-y-6 text-center lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground"
        >
          <span className="h-2 w-2 rounded-full bg-[var(--mint)] animate-pulse-dot" />
          Available for work
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl"
        >
          Hi, I'm <span className="text-gradient animate-gradient">Vedant Butle</span>
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-2xl font-semibold text-muted-foreground md:text-3xl"
        >
          Web Designer & AI Engineer
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="max-w-xl text-base text-muted-foreground md:text-lg"
        >
          Passionate AI & Frontend Developer with strong leadership, management, and project
          coordination experience. I transform ideas into intuitive, visually appealing digital
          experiences while effectively coordinating projects, leading teams, and turning concepts
          into impactful solutions.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-4 lg:justify-start"
        >
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-105"
          >
            My Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
          <button
            type="button"
            onClick={onViewResume}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground backdrop-blur transition-colors hover:bg-secondary"
          >
            View Resume <Eye className="h-4 w-4" />
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="flex items-center justify-center gap-3 lg:justify-start"
        >
          {[
            { href: "mailto:vedantvbutle@gmail.com", icon: Mail },
            { href: "https://github.com/vedantbutle19", icon: Github },
            { href: "https://www.linkedin.com/in/vedant-butle-a4966126a/", icon: Linkedin },
            { href: "#", icon: Dribbble },
          ].map(({ href, icon: Icon }, i) => (
            <a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:-translate-y-1 hover:border-[var(--mint)] hover:text-[var(--mint)]"
            >
              <Icon className="h-5 w-5" />
            </a>
          ))}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        className="relative flex-1"
      >
        <div className="absolute -inset-6 rounded-[2rem] bg-[var(--gradient-brand)] opacity-40 blur-2xl animate-gradient" />
        <div className="relative overflow-hidden rounded-[2rem] border border-border glass-card">
          <img
            src={heroImg}
            alt="Vedant Butle portrait"
            width={768}
            height={960}
            className="h-full w-full object-cover"
          />
        </div>
      </motion.div>

      <motion.a
        href="#about"
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-xs text-muted-foreground"
      >
        Scroll
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity }}
          className="grid h-8 w-8 place-items-center rounded-full border border-border"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </motion.a>
    </section>
  );
}

/* ---------- About ---------- */
const skills = [
  {
    icon: BarChart3,
    title: "Data Analysis",
    desc: "Analyzing data to uncover insights and support data-driven decisions",
  },
  { icon: Code2, title: "Web Development", desc: "Building responsive, modern applications" },
  { icon: Brain, title: "Machine Learning", desc: "Implementing intelligent solutions" },
  { icon: Zap, title: "OpenCV Models", desc: "Real-time object detection" },
];

function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-[var(--gradient-brand)] opacity-30 blur-2xl" />
            <img
              src={aboutImg}
              alt="About Vedant"
              loading="lazy"
              width={800}
              height={800}
              className="relative w-full rounded-3xl border border-border object-cover glass-card"
            />
          </div>
        </Reveal>
        <div className="space-y-6">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--mint)]">
              About Me
            </span>
            <h2 className="mt-2 text-4xl font-bold md:text-5xl">
              Curious builder at the{" "}
              <span className="text-gradient animate-gradient">edge of AI</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-muted-foreground">
              B.Tech student specializing in Artificial Intelligence with hands-on experience in
              databases, machine learning, and web development. Skilled in C++, Python, SQL, Excel,
              generative AI, GIS, geospatial analysis and R development.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-muted-foreground">
              I bring strong skills in AI, machine learning, chatbot development, computer vision,
              and web development — with real-world project implementation.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex items-start gap-3 rounded-2xl border border-border glass-card p-4">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--mint)]" />
              <p className="text-sm text-muted-foreground">
                Deeply committed to my work — investing creativity and precision into every project
                to ensure a unique and effective user experience.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((s, i) => (
              <Reveal key={s.title} delay={0.1 + i * 0.05}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="flex items-start gap-3 rounded-2xl border border-border glass-card p-4"
                >
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--mint)]/15 text-[var(--mint)]">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">{s.title}</h4>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Special Moments ---------- */
type SpecialMoment = {
  id: string;
  title: string;
  badge: string;
  category: string;
  date: string;
  image: string;
  images: string[];
  summary: string;
  highlights: string[];
  youtubeLink?: string;
  youtubeButton?: {
    text: string;
    url: string;
  };
};

const specialMoments: SpecialMoment[] = [
  {
    id: "gadkari-presentation",
    title: "Project Presentation to Hon'ble Union Minister Nitin Gadkari Sir",
    category: "VIP Presentation",
    badge: "High-Level AI Showcase",
    date: "2026",
    image: gadkari1,
    images: [gadkari1, gadkari2],
    summary:
      "Privileged to present our startup concept inspired by the Government of India's Health Locker initiative to Hon'ble Union Minister Nitin Gadkari Sir. The solution focused on enabling secure, centralized, and accessible digital health records to strengthen India's digital healthcare ecosystem.",

    highlights: [
      "Presented startup concept to Hon'ble Union Minister Nitin Gadkari Sir",
      "Proposed a secure AI-enabled digital Health Locker solution for healthcare record management",
      "Aligned with India's Digital Health Mission to improve accessibility and continuity of care",
    ],
  },
  {
    id: "cultural-fest",
    title: "Elected Cultural Fest Coordinator (3,000+ Students & 120+ Performances)",
    category: "Leadership & Event Management",
    badge: "3,000+ Students | 120+ Performances",
    date: "2024 — 2025",
    image: culturalScreenshot1,
    images: [certificate, culturalScreenshot1, insight25, culturalScreenshot2, walk, insight25_2],
    summary:
      "Elected as the cultural Coordinator for the college flagship annual cultural festival. Successfully led cross-functional student teams, managed event logistics, security, and stage schedules for 3,000+ student attendees and 120+ live stage performances.",
    highlights: [
      "Elected by faculty and student body to lead annual cultural festival",
      "Managed logistics, stage management, and safety for 3,000+ attendees",
      "Coordinated 120+ live music, dance, drama, and fine arts performances",
      "Led a team of 110+ student committee heads seamlessly",
    ],
  },
  {
    id: "placement-coordinator",
    title: "Assigned as Training & Placement Coordinator",
    category: "Academic & Career Leadership",
    badge: "Campus Recruitment & Career Development",
    date: "2024 — 2026",
    image: cdcCoordinator,
    images: [cdcCoordinator, placementPhoto, nss],
    summary:
      "Assigned as Placement Coordinator to bridge the gap between engineering candidates and top hiring recruiters. Facilitated campus recruitment drives, organized technical mock interviews, and assisted students in securing internships and career opportunities.",
    highlights: [
      "Served as official student liaison for visiting corporate recruitment teams",
      "Organized resume building, coding practice sessions, and mock technical interviews",
      "Coordinated campus drives resulting in higher student placement offers",
      "Managed student data repositories and placement schedule communications",
    ],
  },
  {
    id: "zindagii-song",
    title: "Composed My First Original Song — Zindagii",
    category: "Creative Journey",
    badge: "Original Song",
    date: "2024",

    image: zindagii1,

    images: [zindagii1, zindagii2],

    summary:
      "A special creative moment from my journey — composing and writing 'Zindagii', an original melody love song inspired by emotions, memories, and the beautiful uncertainty of life and love. This musical journey became even more memorable when I had the opportunity to perform the song on Radio Mirchi, turning a personal creation into a shared moment with a wider audience.",
    highlights: [
      "Composed and wrote the original song 'Zindagii'",
      "Created the melody and lyrical concept from personal emotions and experiences",
      "Performed 'Zindagii' on Radio Mirchi, making it a memorable milestone in my musical journey",
    ],

    youtubeLink: "https://www.youtube.com/watch?v=nI_VClSU2nU",

    youtubeButton: {
      text: "🎵 Listen to Zindagii on YouTube",
      url: "https://www.youtube.com/watch?v=nI_VClSU2nU",
    },
  },
];

function MomentImageGallery({
  images,
  title,
  onZoom,
}: {
  images: string[];
  title: string;
  onZoom: (img: string) => void;
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const dist = touchStartX.current - touchEndX.current;
    if (dist > 40) {
      setPhotoIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    } else if (dist < -40) {
      setPhotoIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentPhoto = images[photoIndex] || images[0];

  return (
    <div className="relative group cursor-pointer" onClick={() => onZoom(currentPhoto)}>
      <div className="absolute -inset-4 rounded-3xl bg-[var(--gradient-brand)] opacity-30 blur-2xl transition-opacity group-hover:opacity-50" />
      <div
        className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border glass-card bg-black/40"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={photoIndex}
            src={currentPhoto}
            alt={`${title} photo ${photoIndex + 1}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="h-full w-full object-cover select-none"
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

        <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white backdrop-blur flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          <Maximize2 className="h-3.5 w-3.5" />
          <span>Zoom Photo</span>
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
              {photoIndex + 1} / {images.length} photos
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          className="mt-3 flex items-center justify-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setPhotoIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === photoIndex
                  ? "w-5 bg-[var(--mint)]"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground"
              }`}
              aria-label={`Go to photo ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SpecialMoments() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.clientWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);
    if (newIndex !== activeIndex && newIndex >= 0 && newIndex < specialMoments.length) {
      setActiveIndex(newIndex);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const width = container.clientWidth;
    const target =
      direction === "left" ? container.scrollLeft - width : container.scrollLeft + width;
    container.scrollTo({ left: target, behavior: "smooth" });
  };

  const scrollToIndex = (idx: number) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    container.scrollTo({ left: idx * container.clientWidth, behavior: "smooth" });
  };

  return (
    <section id="moments" className="mx-auto max-w-7xl px-6 py-24">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3 py-1 text-xs font-medium uppercase tracking-widest text-[var(--mint)]">
            <Sparkles className="h-3 w-3 text-[var(--mint)]" /> Milestones & Leadership
          </span>
          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            <span className="text-gradient animate-gradient">Special Moments</span>
          </h2>
          <p className="mt-2 text-base text-muted-foreground md:text-lg">
            Swipe or scroll horizontally to explore memorable achievements and honors.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card text-foreground backdrop-blur transition-all hover:bg-secondary hover:border-[var(--mint)] hover:scale-105 active:scale-95"
            aria-label="Previous event"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <span className="text-sm font-semibold text-muted-foreground px-2">
            {activeIndex + 1} / {specialMoments.length}
          </span>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card text-foreground backdrop-blur transition-all hover:bg-secondary hover:border-[var(--mint)] hover:scale-105 active:scale-95"
            aria-label="Next event"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full overflow-x-auto gap-8 pb-6 pt-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
      >
        {specialMoments.map((moment) => (
          <div
            key={moment.id}
            className="w-full min-w-full shrink-0 snap-center rounded-[2.5rem] border border-border glass-card p-6 md:p-10 grid items-center gap-10 lg:grid-cols-2"
          >
            <MomentImageGallery
              images={moment.images && moment.images.length > 0 ? moment.images : [moment.image]}
              title={moment.title}
              onZoom={(imgUrl) => setZoomedImage(imgUrl)}
            />

            <div className="space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="rounded-full bg-[var(--mint)]/15 px-3 py-1 text-xs font-semibold text-[var(--mint)]">
                    {moment.badge}
                  </span>
                  <span className="rounded-full bg-[var(--lavender)]/15 px-3 py-1 text-xs font-semibold text-[var(--lavender)]">
                    {moment.category}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto font-medium">
                    {moment.date}
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight md:text-4xl text-foreground">
                  {moment.title}
                </h3>
              </div>

              <p className="text-base leading-relaxed text-muted-foreground md:text-lg">
                {moment.summary}
              </p>

              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--mint)] flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-[var(--mint)]" /> Key Highlights & Impact
                </h4>
                <div className="grid gap-3">
                  {moment.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-2xl border border-border/70 bg-background/50 p-3.5"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--mint)]" />
                      <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              {moment.youtubeButton && (
                <a
                  href={moment.youtubeButton.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[var(--mint)] bg-[var(--mint)]/10 px-5 py-3 text-sm font-semibold text-[var(--mint)] transition-all hover:scale-[1.02] hover:bg-[var(--mint)] hover:text-black"
                >
                  <Music2 className="h-4 w-4" />
                  {moment.youtubeButton.text}
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2">
        {specialMoments.map((moment, idx) => (
          <button
            key={moment.id}
            type="button"
            onClick={() => scrollToIndex(idx)}
            className={`h-2.5 rounded-full transition-all ${
              idx === activeIndex
                ? "w-8 bg-[var(--mint)]"
                : "w-2.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
            }`}
            aria-label={`Go to event ${idx + 1}`}
          />
        ))}
      </div>

      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-xl cursor-zoom-out"
          >
            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              className="absolute right-6 top-6 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30"
              aria-label="Close zoom view"
            >
              <X className="h-5 w-5" />
            </button>
            <motion.img
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              src={zoomedImage}
              alt="Enlarged view"
              className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ---------- Experience & Education ---------- */
type TimelineItem = {
  icon: typeof Rocket;
  role: string;
  org: string;
  period: string;
  desc: string;
};

const experience: TimelineItem[] = [
  {
    icon: Brain,
    role: "GIS Development & AI Intern",
    org: "ICAR–National Bureau of Soil Survey & Land Use Planning (ICAR-NBSS&LUP), Nagpur.",
    period: "january 2026 - june 2026",
    desc: "Built a soil-erosion decision support system using RUSLE in R — geospatial data ingestion, modeling, and dashboarding.",
  },
  {
    icon: Rocket,
    role: "Freelance Frontend Developer",
    org: "Independent",
    period: "2024 — Present",
    desc: "Building responsive React apps and modern web experiences for clients across healthcare, agriculture, and AI startups.",
  },
  {
    icon: Briefcase,
    role: "AI / ML Project Intern",
    org: "Academic Research",
    period: "2024",
    desc: "Developed a pneumonia-detection ML model and an OpenCV-based safety-kit detection system deployed for real-time monitoring.",
  },
];

const academicMilestones: AcademicMilestone[] = [
  {
    id: "btech-ai",
    title: "B.Tech, Artificial Intelligence",
    org: "College of Engineering",
    period: "2022 — 2026",
    icon: GraduationCap,
    images: [btech1, batch2026, aiverse, baitak, baitak2],
    summary:
      "Specializing in Artificial Intelligence and Machine Learning. Acquired deep theoretical and practical knowledge in neural networks, computer vision, data structures, and software engineering principles through academic projects and lab research.",
    achievements: [
      "Built soil-erosion decision support system using RUSLE & R at ICAR-NBSS&LUP",
      "Developed real-time OpenCV safety-kit detection system",
      "Pneumonia detection ML model with high accuracy metric results",
      "Published AI & Web development project showcases",
    ],
    skills: [
      "Artificial Intelligence",
      "Machine Learning",
      "Python & C++",
      "OpenCV",
      "Data Science",
      "React & Web Dev",
    ],
  },
  {
    id: "junior-college",
    title: "11th and 12th (HSC - PCM)",
    org: "IINSIGHT Junior College, Nagpur",
    period: "2020 — 2022",
    icon: GraduationCap,
    images: [iinsight1, iinsight2],
    summary:
      "Chose the Physics, Chemistry, and Mathematics (PCM) stream, developing analytical thinking, problem-solving skills, and a strong mathematical baseline required for advanced AI and engineering studies.",
    achievements: [
      "Completed Higher Secondary Education with top marks in Mathematics & Physics",
      "Participated in regional Science & Technology exhibitions",
      "Developed early interest in programming and computer algorithms",
    ],
    skills: ["Physics & Mathematics", "Analytical Logic", "Scientific Method", "Problem Solving"],
  },
  {
    id: "schooling",
    title: "Secondary Schooling (SSC)",
    org: "Swarnleela International School",
    period: "2016 — 2020",
    icon: GraduationCap,
    images: [swarneela, flagParade, batchCeremony, councilMembers],
    summary:
      "Formative academic years focused on foundational STEM subjects, leadership skills, and extracurricular activities that built confidence, teamwork, and critical reasoning.",
    achievements: [
      "Secured academic excellence awards throughout secondary education",
      "Active participant in inter-school science competitions and debate clubs",
      "Led school technology & academic group activities",
    ],
    skills: ["Mathematics Basis", "Public Speaking", "Teamwork", "Academic Discipline"],
  },
];

function ExperienceEducation() {
  const [selectedMilestone, setSelectedMilestone] = useState<AcademicMilestone | null>(null);

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Career & Academics"
        title="Experience & Education"
        subtitle="A side-by-side view of my professional journey and academic background."
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div id="experience" className="rounded-[2rem] border border-border glass-card p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--mint)]">
              Experience
            </p>
            <h3 className="mt-2 text-2xl font-semibold">Professional Journey</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Work and projects that shaped my skills.
            </p>
          </div>
          <div className="space-y-5">
            {experience.map((e, i) => {
              const Icon = e.icon;
              return (
                <Reveal key={`${e.role}-${e.period}`} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-border/70 bg-background/50 p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--mint)]/15 text-[var(--mint)]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="inline-block rounded-full bg-[var(--mint)]/15 px-3 py-0.5 text-xs font-semibold text-[var(--mint)]">
                          {e.period}
                        </span>
                        <h4 className="mt-3 text-lg font-semibold">{e.role}</h4>
                        <p className="text-sm text-[var(--lavender)]">{e.org}</p>
                        <p className="mt-2 text-sm text-muted-foreground">{e.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>

        <div id="education" className="rounded-[2rem] border border-border glass-card p-6 lg:p-8">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--lavender)]">
              Education
            </p>
            <h3 className="mt-2 text-2xl font-semibold">Academic Journey</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Click any milestone to view photos, achievements, and details.
            </p>
          </div>
          <div className="space-y-5">
            {academicMilestones.map((item, i) => {
              const Icon = item.icon || GraduationCap;
              return (
                <Reveal key={item.id} delay={i * 0.08}>
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedMilestone(item)}
                    className="group relative cursor-pointer rounded-2xl border border-border/70 bg-background/50 p-5 transition-all hover:border-[var(--lavender)] hover:bg-background/80 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--lavender)]/15 text-[var(--lavender)] transition-transform group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-block rounded-full bg-[var(--lavender)]/15 px-3 py-0.5 text-xs font-semibold text-[var(--lavender)]">
                            {item.period}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-[var(--mint)]/10 px-2.5 py-0.5 text-[11px] font-medium text-[var(--mint)] opacity-80 group-hover:opacity-100">
                            <Sparkles className="h-3 w-3" /> View Photos & Details
                          </span>
                        </div>
                        <h4 className="mt-3 text-lg font-semibold transition-colors group-hover:text-[var(--lavender)]">
                          {item.title}
                        </h4>
                        <p className="text-sm text-[var(--mint)]">{item.org}</p>
                        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                          {item.summary}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>

      <AcademicModal
        isOpen={!!selectedMilestone}
        onClose={() => setSelectedMilestone(null)}
        milestone={selectedMilestone}
      />
    </section>
  );
}

/* ---------- Services ---------- */
const services = [
  {
    icon: Bot,
    title: "AI Development",
    desc: "Custom AI solutions, ML models, and intelligent automation tailored to your business.",
  },
  {
    icon: Code2,
    title: "Web Development",
    desc: "Modern, responsive websites and applications built with the latest technologies.",
  },
  {
    icon: Smartphone,
    title: "Social Media Marketing",
    desc: "Engaging content and audience-building strategies that grow reach.",
  },
  {
    icon: Brain,
    title: "ML Consulting",
    desc: "Expert guidance on implementing ML solutions and AI strategy.",
  },
  {
    icon: Database,
    title: "Data Analytics",
    desc: "Turn raw data into actionable insights with analytics and visualization.",
  },
  {
    icon: ShieldCheck,
    title: "Real-Time Detection",
    desc: "Surveillance, traffic monitoring, face recognition, and safety compliance systems.",
  },
];

function Services() {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Services"
        title="What I do"
        subtitle="Specialized solutions tailored to your needs"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.05}>
            <motion.div
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative h-full overflow-hidden rounded-2xl border border-border glass-card p-6"
            >
              <div className="absolute inset-0 -z-10 bg-[var(--gradient-brand)] opacity-0 blur-xl transition-opacity group-hover:opacity-20" />
              <div className="mb-4 inline-grid h-12 w-12 place-items-center rounded-xl bg-[var(--mint)]/15 text-[var(--mint)] transition-transform group-hover:scale-110">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Projects ---------- */
const projects: ProjectItem[] = [
  {
    id: "soil-dss",
    title: "Soil Erosion DSS",
    desc: "Decision support system for soil erosion assessment using RUSLE with R programming and data analysis.",
    summary:
      "Developed at ICAR-NBSS&LUP, this GIS & R-based Decision Support System calculates soil erosion risks using Revised Universal Soil Loss Equation (RUSLE) modeling. It translates satellite geospatial data into actionable conservation strategies for agricultural planners.",
    img: soil1,

    images: [soil1, icar3, icar2, icar1],
    tags: ["R Language", "RUSLE", "Data Science", "GIS"],
    category: "AI",
    features: [
      "Geospatial data ingestion and automated RUSLE factor calculation",
      "Interactive map overlays showing high soil-loss risk zones",
      "Automated PDF reporting for land use planners and policy makers",
      "Integration with R Shiny dashboard for interactive scenario analysis",
    ],
    demoUrl: "#",
    githubUrl: "https://github.com/vedantbutle19",
  },
  {
    id: "aarogyam",
    title: "Aarogyam Health Locker",
    desc: "A digital health platform to help patients and doctors manage medical records smoothly and securely.",
    summary:
      "Aarogyam is a modern electronic healthcare vault platform designed to streamline medical history, prescription sharing, and appointment tracking. It empowers patients with control over their health data while enabling doctors to access vital records with end-to-end encryption.",
    img: "/images/projects/aarogyam_1.jpg",
    images: ["/images/projects/aarogyam_1.jpg"],
    tags: ["Healthcare", "Web App", "UI/UX", "React"],
    category: "Web",
    features: [
      "Secure patient profile and medical record vault",
      "Doctor dashboard for real-time prescription and history access",
      "Encrypted cloud document storage & instant download",
      "Responsive design with seamless dark/light mode UI",
    ],
    demoUrl: "#",
    githubUrl: "https://github.com/vedantbutle19",
  },
  {
    id: "pneumonia-ai",
    title: "Pneumonia Detection using ML",
    desc: "AI-based pneumonia detection model that analyzes medical images to assist with early diagnosis.",
    summary:
      "An artificial intelligence solution leveraging deep convolutional neural networks to classify chest X-ray images. Built to assist radiographers in high-volume clinics with fast, high-accuracy preliminary diagnostics.",
    img: pneumoniaProject1,

    images: [pneumoniaProject1, pneumonia1, pneumonia2],
    tags: ["Machine Learning", "Python", "Medical AI", "PyTorch"],
    category: "AI",
    features: [
      "Deep Learning classification pipeline trained on chest X-ray datasets",
      "Grad-CAM visual heatmaps highlighting affected lung regions",
      "Web interface for instant radiograph upload and inference",
      "High accuracy and sensitivity metrics on validation benchmarks",
    ],
    demoUrl: "#",
    githubUrl: "https://github.com/vedantbutle19",
  },
  {
    id: "safety-kit",
    title: "Safety Kit Detection",
    desc: "Computer vision solution using OpenCV to detect whether workers are wearing required safety gear.",
    summary:
      "A real-time computer vision system tailored for industrial safety compliance. Uses OpenCV and object detection models to monitor live camera streams and alert supervisors when helmets or high-visibility vests are missing.",
    img: ppekit5,

    images: [ppekitMain, ppekit3, ppekit4, ppekit5],
    tags: ["OpenCV", "Computer Vision", "Safety", "Python"],
    category: "AI",
    features: [
      "Real-time multi-person safety gear tracking via video feeds",
      "Automated bounding boxes for helmets, vests, and safety goggles",
      "Instant alert logging and compliance dashboard",
      "Optimized model inference for edge devices and IP cameras",
    ],
    demoUrl: "#",
    githubUrl: "https://github.com/vedantbutle19",
  },
  {
    id: "shetkari-llm",
    title: "आपला शेतकरी (Farmer Assistant)",
    desc: "Smart Farming & AI-Powered Agricultural Decision Support Platform.",
    summary:
      "comprehensive digital farming platform for Indian farmers, combining farmmanagement, crop monitoring, weather intelligence, AI- based agricultural assistance, financial tracking, government schemes, farming news, and field surveillance.",
    img: aaplaShetkari1,

    images: [aaplaShetkari1, aaplaShetkari2, aaplaShetkari3],
    tags: ["LLM", "Agriculture", "Smart Farming", "Voice AI"],
    category: "UI",
    features: [
      "Natural language chat and voice query input in regional languages",
      "AI-driven diagnosis for crop diseases via user uploaded photos",
      "Real-time market price updates and local weather advisory",
      "Intuitive high-contrast mobile interface tailored for rural users",
    ],
    demoUrl: "#",
    githubUrl: "https://github.com/vedantbutle19",
  },
];

const filters = ["All", "AI", "Web", "UI"] as const;

function Projects() {
  const [active, setActive] = useState<(typeof filters)[number]>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Projects"
        title="Featured Work"
        subtitle="Explore my latest work blending cutting-edge AI with stunning design."
      />
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActive(f)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              active === f
                ? "border-[var(--mint)] bg-[var(--mint)]/15 text-[var(--mint)]"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {f === "All" ? "All Projects" : `${f} Projects`}
          </button>
        ))}
      </div>
      <motion.div layout className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p) => (
            <motion.article
              key={p.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              whileHover={{ y: -8 }}
              onClick={() => setSelectedProject(p)}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border glass-card transition-all hover:border-[var(--mint)] hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-70" />
                <div className="absolute top-3 right-3 rounded-full bg-black/60 px-3 py-1 text-[11px] font-medium text-[var(--mint)] backdrop-blur opacity-90 group-hover:opacity-100">
                  <Sparkles className="inline h-3 w-3 mr-1" />
                  View Details
                </div>
              </div>
              <div className="space-y-3 p-5">
                <h3 className="text-lg font-semibold transition-colors group-hover:text-[var(--mint)]">
                  {p.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border bg-secondary/40 px-2.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProject(p);
                  }}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--mint)] transition-transform hover:translate-x-1"
                >
                  View Demo <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <ProjectModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject}
      />
    </section>
  );
}

/* ---------- Testimonials ---------- */
function Testimonials({ testimonials }: { testimonials: TestimonialItem[] }) {
  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading eyebrow="Testimonials" title="Kind Words" />
      <div className="grid gap-6 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -6 }}
              className="relative h-full rounded-2xl border border-border glass-card p-8"
            >
              <div className="absolute -top-4 left-6 text-6xl leading-none text-[var(--mint)]/40">
                "
              </div>
              <p className="relative text-base text-muted-foreground">{t.text}</p>
              <div className="mt-6 flex items-center gap-4 border-t border-border pt-6">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--gradient-brand)] text-sm font-bold text-primary-foreground">
                  {t.initials}
                </div>
                <div>
                  <h4 className="text-sm font-semibold">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------- Contact ---------- */
function Contact({ onSendMessage }: { onSendMessage: (testimonial: TestimonialItem) => void }) {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();
    if (!name || !email || !message) return;

    const initials = name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");

    onSendMessage({
      text: message,
      name,
      role: email,
      initials: initials || "U",
    });

    setSent(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeading
        eyebrow="Contact"
        title="Let's Build the Future Together"
        subtitle="Have a project in mind? Let's create something extraordinary."
      />
      <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-border glass-card p-6 md:p-8"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                type="text"
                placeholder="Your Name"
                className="w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--mint)] focus:outline-none focus:ring-2 focus:ring-[var(--mint)]/30"
              />
              <input
                required
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                type="email"
                placeholder="Your Email"
                className="w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--mint)] focus:outline-none focus:ring-2 focus:ring-[var(--mint)]/30"
              />
            </div>
            <textarea
              required
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              rows={5}
              placeholder="Your Message"
              className="w-full rounded-xl border border-border bg-background/40 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--mint)] focus:outline-none focus:ring-2 focus:ring-[var(--mint)]/30"
            />
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02]"
            >
              {sent ? (
                "Message sent ✓"
              ) : (
                <>
                  Send Message <Send className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex h-full flex-col justify-between rounded-2xl border border-border glass-card p-6 md:p-8">
            <div>
              <h3 className="text-xl font-semibold">Connect With Me</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Reach out on any platform — I usually respond within 24 hours.
              </p>
              <div className="mt-6 flex gap-3">
                {[
                  { href: "https://github.com/vedantbutle19", icon: Github },
                  { href: "#", icon: Twitter },
                  { href: "https://www.linkedin.com/in/vedant-butle-a4966126a/", icon: Linkedin },
                  { href: "mailto:vedantvbutle@gmail.com", icon: Mail },
                ].map(({ href, icon: Icon }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="grid h-12 w-12 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-all hover:-translate-y-1 hover:border-[var(--mint)] hover:text-[var(--mint)]"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
            <div className="mt-8 inline-flex items-center gap-2 self-start rounded-full border border-[var(--mint)]/40 bg-[var(--mint)]/10 px-4 py-2 text-xs font-medium text-[var(--mint)]">
              <span className="h-2 w-2 rounded-full bg-[var(--mint)] animate-pulse-dot" />
              Currently accepting new opportunities
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  return (
    <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
      © 2025 Vedant's Portfolio. Crafted with care.
    </footer>
  );
}
