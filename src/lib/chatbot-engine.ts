// Synchronizes with all markdown files in /knowledge/*.md at build/dev time
const rawKnowledgeFiles = import.meta.glob("../../knowledge/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export interface KnowledgeSection {
  file: string;
  title: string;
  text: string;
}

export const CORE_BIO = `[Core Profile Facts]
- Full Name: Vedant Vivek Butle
- Location / Current Residence: Nagpur, Maharashtra, India.
- Hometown: Wani, Yavatmal district, Maharashtra, India.
- Nationality: Indian.
- Current Role: AI/ML Engineer, Young Professional-II (YP-II) at ICAR-NBSS&LUP, Nagpur (under Dr. Nirmal Kumar Sir, NASF project "Indian Agro Mission for Soil Health").
- Previous Internship: AI/ML & GIS Intern at ICAR-NBSS&LUP, Nagpur (January 2026 – June 2026), built the Soil Erosion Decision Support System (DSS) using RUSLE and R Shiny.
- Key Projects: (1) Soil Erosion DSS (R, RUSLE, GIS, R Shiny), (2) Aarogyam Health Locker (Digital Health Records presented to Hon'ble Union Minister Nitin Gadkari Sir), (3) Pneumonia Detection using ML (PyTorch, CNN, Chest X-Rays), (4) Safety Kit / PPE Detection (YOLOv11, OpenCV, published research paper), (5) Aapla Shetkari / आपला शेतकरी (AI & Voice Smart Farming Assistant).
- Education: B.Tech in Artificial Intelligence from St. Vincent Pallotti College of Engineering and Technology, Nagpur (2022–2026, CGPA 7.18).
- Junior College: IINSIGHT Junior College, Nagpur (12th: 87%, MHT-CET: 86 percentile).
- Schooling: Swarneela International School, Wani (Elected School Council Member with 60% votes).
- Leadership & Achievements: Presented Health Locker startup concept to Hon'ble Union Minister Nitin Gadkari Sir (2026); Elected Cultural Fest Coordinator (3,000+ students, 120+ performances, 110+ committee heads); Training & Placement Coordinator (2024–2026); Composed & performed original song "Zindagii" on Radio Mirchi.
- Family: Father (Vivek Nagoraoji Butle, teacher at Mahavir Hindi High School), Mother (Nilima Vivek Butle, tuition teacher), Grandparents (Nagoraoji & Krushna Bai Butle), Sister (Tanvi / Tanu, Pharm.D student).
- Contact: Email vedantvbutle@gmail.com, Phone +91 7796041818, GitHub https://github.com/vedantbutle19, LinkedIn https://www.linkedin.com/in/vedant-butle-a4966126a/, Instagram https://www.instagram.com/vedantt_butlee/.
- Technical Skills: Python, R, TypeScript, JavaScript, C++, React, HTML, CSS, AI/ML, Deep Learning (PyTorch, TensorFlow, CNN, U-Net), Computer Vision (YOLOv11, OpenCV), Generative AI / LLMs / RAG, Geospatial AI (GEE, GIS, RUSLE, Terra, R Shiny).`;

export const SYSTEM_PROMPT = `You are the personal portfolio AI assistant for Vedant Vivek Butle.
Your job is to answer questions about Vedant using his portfolio information provided below.

INSTRUCTIONS:
1. Understand the user's intent across different question styles and wordings.
2. Answer informatively, accurately, and directly based on the provided portfolio knowledge.
3. Synthesize details from the provided sections using clean markdown formatting (bullet points, bold key terms) where helpful.
4. If a question is about something completely unrelated to Vedant or not present in his portfolio, politely explain that this detail is not available in Vedant's portfolio.
5. Location fact: Vedant lives in Nagpur, Maharashtra, India, and his hometown is Wani, Maharashtra, India.
6. Keep answers polite, professional, friendly, and concise.`;

function parseSections(): KnowledgeSection[] {
  const sections: KnowledgeSection[] = [];

  for (const [path, rawContent] of Object.entries(rawKnowledgeFiles)) {
    const fileName = path.split("/").pop() || "knowledge.md";
    const stem = fileName.replace(/\.md$/i, "");
    const content = (rawContent || "").trim();
    if (!content) continue;

    const lines = content.split(/\r?\n/);
    let currentTitle = stem;
    let currentLines: string[] = [];

    for (const line of lines) {
      if (line.startsWith("## ")) {
        if (currentLines.length > 0) {
          sections.push({
            file: fileName,
            title: currentTitle,
            text: currentLines.join("\n").trim(),
          });
        }
        currentTitle = line.replace("## ", "").trim();
        currentLines = [line];
      } else {
        currentLines.push(line);
      }
    }

    if (currentLines.length > 0) {
      sections.push({
        file: fileName,
        title: currentTitle,
        text: currentLines.join("\n").trim(),
      });
    }
  }

  return sections;
}

export const KNOWLEDGE_SECTIONS: KnowledgeSection[] = parseSections();

const SYNONYM_MAP: Record<string, string[]> = {
  study: [
    "education",
    "college",
    "school",
    "btech",
    "degree",
    "cgpa",
    "academics",
    "iinsight",
    "pallotti",
  ],
  studied: [
    "education",
    "college",
    "school",
    "btech",
    "degree",
    "cgpa",
    "academics",
    "iinsight",
    "pallotti",
  ],
  studies: ["education", "college", "school", "btech", "degree", "cgpa", "academics"],
  college: ["education", "btech", "pallotti", "st vincent", "cgpa", "nagpur"],
  school: ["swarneela", "wani", "schooling", "iinsight", "junior"],
  schooling: ["swarneela", "wani", "school", "iinsight"],
  degree: ["btech", "education", "college", "cgpa"],
  education: ["college", "school", "btech", "academics", "cgpa", "mht-cet", "st vincent"],
  academics: ["education", "cgpa", "btech", "exam", "nptel", "paper"],
  cgpa: ["education", "7.18", "btech", "college"],
  marks: ["cgpa", "87%", "percentage", "mht-cet", "education"],
  job: ["employment", "work", "icar", "nbss", "professional", "role", "yp-ii"],
  work: ["employment", "job", "icar", "internship", "professional", "freelancing", "projects"],
  working: ["employment", "job", "icar", "internship", "professional"],
  role: ["employment", "professional", "engineer", "icar", "yp-ii"],
  company: ["icar", "employment", "professional", "startup", "goals"],
  experience: ["internship", "employment", "professional", "freelancing", "work", "projects"],
  internship: ["icar", "nbss", "intern", "soil", "dss", "vidarbha", "rusle"],
  intern: ["icar", "nbss", "internship", "soil"],
  icar: ["nbss", "soil", "nirmal", "kumar", "nasf", "internship", "professional"],
  tech: ["programming", "languages", "python", "react", "ai", "machine learning", "technologies"],
  stack: [
    "programming",
    "languages",
    "python",
    "react",
    "c++",
    "web",
    "technologies",
    "typescript",
  ],
  skills: [
    "programming",
    "technologies",
    "ai",
    "machine learning",
    "deep learning",
    "computer vision",
    "web",
  ],
  coding: ["programming", "python", "c++", "javascript", "typescript", "r", "languages"],
  code: ["programming", "languages", "python"],
  languages: ["programming", "python", "r", "c++", "javascript", "typescript", "html", "css"],
  programming: ["python", "r", "c++", "javascript", "typescript", "coding", "web"],
  web: ["react", "frontend", "websites", "javascript", "html", "css", "freelancing"],
  website: ["web", "react", "frontend", "development", "freelancing", "redesign"],
  websites: ["web", "react", "frontend", "development", "freelancing", "redesign"],
  ai: [
    "machine learning",
    "deep learning",
    "yolo",
    "opencv",
    "rag",
    "llm",
    "generative",
    "projects",
  ],
  ml: ["machine learning", "deep learning", "yolo", "opencv", "scikit-learn", "pneumonia"],
  vision: ["computer vision", "opencv", "yolo", "yolov11", "detection", "safety"],
  cv: ["computer vision", "opencv", "yolo", "detection"],
  rag: ["generative", "llm", "vector", "chatbot"],
  friends: [
    "friend",
    "friendship",
    "sarvesh",
    "indrajeet",
    "sujal",
    "om",
    "yadhynesh",
    "atharva",
    "pritish",
    "abhishek",
    "purushottam",
    "mukul",
  ],
  friend: [
    "friends",
    "friendship",
    "sarvesh",
    "indrajeet",
    "sujal",
    "om",
    "yadhynesh",
    "atharva",
    "pritish",
    "abhishek",
    "purushottam",
    "mukul",
  ],
  family: ["father", "mother", "sister", "parents", "tanvi", "vivek", "nilima", "butle", "family"],
  parents: ["father", "mother", "family", "vivek", "nilima"],
  father: ["vivek", "family", "teacher", "mahavir"],
  mother: ["nilima", "family", "teacher", "tuition"],
  sister: ["tanvi", "tanu", "family", "pharm.d"],
  hobbies: [
    "hobby",
    "guitar",
    "music",
    "football",
    "travel",
    "reading",
    "entertainment",
    "zindagii",
  ],
  hobby: ["hobbies", "guitar", "football", "music", "travel", "biographies", "zindagii"],
  free: ["hobbies", "guitar", "football", "music", "travel", "time"],
  music: ["guitar", "songs", "poetry", "hobbies", "zindagii", "mirchi"],
  song: ["zindagii", "music", "guitar", "mirchi", "youtube"],
  guitar: ["music", "songs", "hobbies", "zindagii"],
  football: ["sports", "relax", "hobbies"],
  travel: ["places", "himachal", "india", "hobbies"],
  live: ["residence", "location", "nagpur", "wani", "home", "lives"],
  lives: ["residence", "location", "nagpur", "wani", "home", "live"],
  living: ["location", "residence", "nagpur", "wani", "home"],
  where: ["location", "residence", "nagpur", "wani", "home", "education", "college"],
  hometown: ["wani", "location", "yavatmal", "schooling", "home"],
  from: ["wani", "nagpur", "location", "residence"],
  location: ["nagpur", "wani", "maharashtra", "india", "residence"],
  gadkari: [
    "minister",
    "nitin",
    "presentation",
    "health",
    "locker",
    "abdm",
    "achievements",
    "aarogyam",
  ],
  minister: ["gadkari", "nitin", "presentation", "health locker", "achievements", "aarogyam"],
  presentation: ["gadkari", "nitin", "startup", "achievements", "aarogyam"],
  culture: ["cultural", "fest", "coordinator", "performances", "stage", "achievements"],
  cultural: ["fest", "coordinator", "performances", "stage", "achievements"],
  fest: ["cultural", "coordinator", "performances", "stage", "achievements"],
  leadership: [
    "coordinator",
    "cultural",
    "council",
    "placement",
    "leader",
    "management",
    "achievements",
  ],
  contact: ["email", "phone", "number", "instagram", "linkedin", "portfolio", "github", "hire"],
  hire: ["contact", "freelancing", "email", "phone", "services"],
  email: ["contact", "vedantvbutle@gmail.com"],
  phone: ["contact", "7796041818", "number"],
  number: ["contact", "phone", "7796041818"],
  reach: ["contact", "email", "phone"],
  projects: [
    "projects",
    "soil",
    "icar",
    "safety kit",
    "dss",
    "pneumonia",
    "yolo",
    "aarogyam",
    "shetkari",
  ],
  project: [
    "projects",
    "soil",
    "icar",
    "safety kit",
    "dss",
    "pneumonia",
    "yolo",
    "aarogyam",
    "shetkari",
  ],
  goals: ["short-term", "long-term", "company", "vision", "career", "future"],
  goal: ["goals", "short-term", "long-term", "company", "career"],
  future: ["goals", "company", "career", "short-term", "long-term", "vision"],
  personality: ["values", "personal", "emotional", "genuine", "curious"],
  values: ["personal", "authenticity", "learning", "professionalism"],
};

const STOPWORDS = new Set([
  "is",
  "the",
  "a",
  "an",
  "what",
  "where",
  "how",
  "who",
  "which",
  "are",
  "his",
  "her",
  "he",
  "she",
  "in",
  "at",
  "to",
  "for",
  "of",
  "and",
  "or",
  "on",
  "with",
  "tell",
  "me",
  "about",
  "can",
  "you",
  "does",
  "do",
  "did",
  "vedant",
  "vedants",
  "butle",
  "your",
]);

export function retrieveKnowledge(question: string, topK = 6): KnowledgeSection[] {
  const words = question.toLowerCase().match(/\w+/g) || [];
  let queryTerms = words.filter((w) => !STOPWORDS.has(w));
  if (queryTerms.length === 0) {
    queryTerms = words.filter((w) => !["is", "the", "a", "an"].includes(w));
  }

  const expandedTerms = new Set(queryTerms);
  for (const t of queryTerms) {
    if (SYNONYM_MAP[t]) {
      for (const syn of SYNONYM_MAP[t]) {
        expandedTerms.add(syn);
      }
    }
  }

  const scored: Array<{ score: number; section: KnowledgeSection }> = [];
  for (const section of KNOWLEDGE_SECTIONS) {
    let score = 0;
    const textLower = `${section.title} ${section.text}`.toLowerCase();
    const titleLower = section.title.toLowerCase();
    const fileLower = section.file.toLowerCase();

    for (const term of expandedTerms) {
      if (titleLower.includes(term)) score += 8;
      if (fileLower.includes(term)) score += 6;
      const matches = textLower.split(term).length - 1;
      if (matches > 0) score += Math.min(matches * 2, 8);
    }

    if (score > 0) {
      scored.push({ score, section });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  let results = scored.slice(0, topK).map((item) => item.section);

  if (results.length === 0) {
    const fallbackFiles = new Set([
      "Projects.md",
      "Professional.md",
      "Education.md",
      "Achievements.md",
      "contact.md",
    ]);
    results = KNOWLEDGE_SECTIONS.filter((s) => fallbackFiles.has(s.file)).slice(0, topK);
  }

  return results;
}

export function buildKnowledgeContext(sections: KnowledgeSection[]): string {
  const parts = [CORE_BIO, ...sections.map((s) => `[${s.file} - ${s.title}]\n${s.text.trim()}`)];
  return parts.join("\n\n---\n\n");
}

function formatSectionBody(text: string, maxLines = 6): string {
  return text
    .split("\n")
    .map((l) => l.trim().replace(/^-\s*/, ""))
    .filter((l) => l && !l.startsWith("#"))
    .slice(0, maxLines)
    .join(" ");
}

function renderFileSections(
  fileNames: string[],
  heading: string,
  matchQuery?: string,
): string | null {
  const fileSet = new Set(fileNames);
  const allSections = KNOWLEDGE_SECTIONS.filter((s) => fileSet.has(s.file));
  if (allSections.length === 0) return null;

  let targetSections = allSections;
  if (matchQuery) {
    const matched = allSections.filter((s) => {
      const keywords = s.title
        .toLowerCase()
        .split(/[\s()—–-]+/)
        .filter((w) => w.length > 2 && !["the", "and", "for", "using"].includes(w));
      return keywords.some((kw) => matchQuery.includes(kw));
    });
    if (matched.length > 0) {
      targetSections = matched;
    }
  }

  return [
    `**${heading}:**`,
    ...targetSections.map((s) => `- **${s.title}:** ${formatSectionBody(s.text)}`),
  ].join("\n");
}

/**
 * Generates a rich, well-structured Markdown answer directly from the synchronized knowledge base
 * when deployed on Vercel or when local servers are not running.
 */
export function synthesizeKnowledgeAnswer(question: string): string {
  const q = question.toLowerCase();

  if (/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)\b/.test(q.trim())) {
    return "Hello! 👋 I'm **Vedant Butle's AI Assistant**. You can ask me about his **AI & software projects**, **ICAR-NBSS&LUP experience**, **presentation to Hon'ble Union Minister Nitin Gadkari**, **skills & tech stack**, **education**, **hobbies**, **family**, **friends**, or **contact details**!";
  }

  if (
    q.includes("who is vedant") ||
    q.includes("about vedant") ||
    q.includes("introduce") ||
    q.includes("tell me about yourself")
  ) {
    return [
      "**Vedant Vivek Butle** is an **AI/ML Engineer** and **Web Designer** based in **Nagpur, Maharashtra, India**.",
      '- **Current Role:** Young Professional-II (YP-II) at **ICAR-NBSS&LUP, Nagpur** under Dr. Nirmal Kumar Sir on the NASF project *"Indian Agro Mission for Soil Health."*',
      "- **Education:** B.Tech in Artificial Intelligence from **St. Vincent Pallotti College of Engineering and Technology, Nagpur** (CGPA: 7.18).",
      "- **Core Expertise:** Machine Learning, Deep Learning, Computer Vision (YOLOv11, OpenCV), Generative AI / RAG, Geospatial AI (R, RUSLE, GEE), and React/TypeScript Web Development.",
      "- **Highlights:** Presented his *Aarogyam Health Locker* startup concept to **Hon'ble Union Minister Nitin Gadkari Sir**, led the college Cultural Fest for **3,000+ students**, and composed his original song *Zindagii* (performed on Radio Mirchi).",
    ].join("\n");
  }

  if (
    q.includes("friend") ||
    KNOWLEDGE_SECTIONS.some(
      (s) => s.file === "Friends.md" && q.includes(s.title.toLowerCase().split(" ")[0]),
    )
  ) {
    const res = renderFileSections(["Friends.md"], "Vedant's Friends", q);
    if (res) return res;
  }

  if (
    q.includes("family") ||
    q.includes("father") ||
    q.includes("mother") ||
    q.includes("sister") ||
    q.includes("parent") ||
    q.includes("tanvi") ||
    q.includes("tanu") ||
    q.includes("vivek") ||
    q.includes("nilima")
  ) {
    const res = renderFileSections(["Family.md"], "Vedant's Family");
    if (res) return res;
  }

  if (
    q.includes("pneumonia") ||
    q.includes("safety kit") ||
    q.includes("ppe") ||
    q.includes("shetkari") ||
    q.includes("project") ||
    q.includes("built") ||
    q.includes("portfolio work")
  ) {
    const res = renderFileSections(["Projects.md"], "Vedant Butle's Key Projects", q);
    if (res) return res;
  }

  if (q.includes("gadkari") || q.includes("minister") || q.includes("aarogyam")) {
    const res = renderFileSections(
      ["Achievements.md", "Projects.md"],
      "Presentation to Hon'ble Union Minister Nitin Gadkari Sir",
      "gadkari aarogyam",
    );
    if (res) return res;
  }

  if (
    q.includes("icar") ||
    q.includes("nbss") ||
    q.includes("intern") ||
    q.includes("nirmal") ||
    q.includes("work") ||
    q.includes("job") ||
    q.includes("experience") ||
    q.includes("role") ||
    q.includes("soil")
  ) {
    const res = renderFileSections(
      ["Professional.md", "Internship.md"],
      "Vedant's Professional & ICAR-NBSS&LUP Experience",
      q,
    );
    if (res) return res;
  }

  if (
    q.includes("skill") ||
    q.includes("tech") ||
    q.includes("stack") ||
    q.includes("language") ||
    q.includes("program") ||
    q.includes("coding")
  ) {
    const res = renderFileSections(
      ["Programming.md", "AI.md", "CV.md"],
      "Vedant's Technical Skills & AI Expertise",
      q,
    );
    if (res) return res;
  }

  if (
    q.includes("educat") ||
    q.includes("college") ||
    q.includes("school") ||
    q.includes("degree") ||
    q.includes("cgpa") ||
    q.includes("study") ||
    q.includes("studied") ||
    q.includes("academic") ||
    q.includes("leadership") ||
    q.includes("coordinator") ||
    q.includes("cultural")
  ) {
    const res = renderFileSections(
      ["Education.md", "Academics.md", "Achievements.md"],
      "Education, Academics & Leadership",
      q,
    );
    if (res) return res;
  }

  if (
    q.includes("song") ||
    q.includes("zindagi") ||
    q.includes("music") ||
    q.includes("guitar") ||
    q.includes("hobb") ||
    q.includes("football") ||
    q.includes("travel") ||
    q.includes("movie")
  ) {
    const res = renderFileSections(["Hobbies.md"], "Hobbies, Music & Creative Interests", q);
    if (res) return res;
  }

  if (q.includes("goal") || q.includes("future") || q.includes("vision")) {
    const res = renderFileSections(["Goals.md"], "Vedant's Career Goals & Vision", q);
    if (res) return res;
  }

  if (q.includes("freelanc") || q.includes("service")) {
    const res = renderFileSections(["Freelancing.md"], "Freelancing & Digital Services", q);
    if (res) return res;
  }

  if (
    q.includes("where") ||
    q.includes("live") ||
    q.includes("location") ||
    q.includes("hometown") ||
    q.includes("from") ||
    q.includes("personal") ||
    q.includes("value")
  ) {
    const res = renderFileSections(["Personal.md"], "Personal Background & Location", q);
    if (res) return res;
  }

  if (
    q.includes("contact") ||
    q.includes("hire") ||
    q.includes("email") ||
    q.includes("phone") ||
    q.includes("reach") ||
    q.includes("linkedin")
  ) {
    const res = renderFileSections(["contact.md"], "Contact Details");
    if (res) return res;
  }

  const sections = retrieveKnowledge(question, 3);
  if (sections.length === 0) {
    return "Vedant Vivek Butle is an **AI/ML Engineer** (Young Professional-II at **ICAR-NBSS&LUP, Nagpur**) and **Web Designer** specializing in Computer Vision, Generative AI, Geospatial AI, and React development. Feel free to ask about his projects, experience, education, or contact details!";
  }

  return sections.map((s) => `- **${s.title}:** ${formatSectionBody(s.text)}`).join("\n");
}
