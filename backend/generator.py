import os
import re
import subprocess
import time
import urllib.request
from pathlib import Path
import ollama

# ============================================================
# PATHS & CONFIG
# ============================================================

BASE_DIR = Path(__file__).resolve().parent.parent
KNOWLEDGE_DIR = BASE_DIR / "knowledge"

MODEL_NAME = os.getenv("LLM_MODEL", "qwen2.5:1.5b")

# ============================================================
# CORE GROUND TRUTH PROFILE
# ============================================================

CORE_BIO = """[Core Profile Facts]
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
- Technical Skills: Python, R, TypeScript, JavaScript, C++, React, HTML, CSS, AI/ML, Deep Learning (PyTorch, TensorFlow, CNN, U-Net), Computer Vision (YOLOv11, OpenCV), Generative AI / LLMs / RAG, Geospatial AI (GEE, GIS, RUSLE, Terra, R Shiny)."""


# ============================================================
# IN-MEMORY SECTION RETRIEVER
# ============================================================

def load_all_sections():
    """Parses all markdown files in knowledge/ into granular sections."""
    sections = []
    if not KNOWLEDGE_DIR.exists():
        return sections

    for file_path in sorted(KNOWLEDGE_DIR.glob("*.md")):
        try:
            content = file_path.read_text(encoding="utf-8").strip()
        except Exception:
            continue

        lines = content.split("\n")
        current_title = file_path.stem
        current_lines = []

        for line in lines:
            if line.startswith("## "):
                if current_lines:
                    sections.append({
                        "file": file_path.name,
                        "title": current_title,
                        "text": "\n".join(current_lines).strip()
                    })
                current_title = line.replace("## ", "").strip()
                current_lines = [line]
            else:
                current_lines.append(line)

        if current_lines:
            sections.append({
                "file": file_path.name,
                "title": current_title,
                "text": "\n".join(current_lines).strip()
            })

    return sections


_LAST_KNOWLEDGE_MTIME = 0.0
SECTIONS = []


def get_sections():
    """Returns knowledge sections, automatically reloading if any knowledge/*.md file changed."""
    global _LAST_KNOWLEDGE_MTIME, SECTIONS
    if not KNOWLEDGE_DIR.exists():
        return SECTIONS
    current_mtime = max(
        (f.stat().st_mtime for f in KNOWLEDGE_DIR.glob("*.md")),
        default=0.0
    )
    if not SECTIONS or current_mtime != _LAST_KNOWLEDGE_MTIME:
        SECTIONS = load_all_sections()
        _LAST_KNOWLEDGE_MTIME = current_mtime
    return SECTIONS


get_sections()

SYNONYM_MAP = {
    "study": ["education", "college", "school", "btech", "degree", "cgpa", "academics", "iinsight", "pallotti"],
    "studied": ["education", "college", "school", "btech", "degree", "cgpa", "academics", "iinsight", "pallotti"],
    "studies": ["education", "college", "school", "btech", "degree", "cgpa", "academics"],
    "college": ["education", "btech", "pallotti", "st vincent", "cgpa", "nagpur"],
    "school": ["swarneela", "wani", "schooling", "iinsight", "junior"],
    "schooling": ["swarneela", "wani", "school", "iinsight"],
    "degree": ["btech", "education", "college", "cgpa"],
    "education": ["college", "school", "btech", "academics", "cgpa", "mht-cet", "st vincent"],
    "academics": ["education", "cgpa", "btech", "exam", "nptel", "paper"],
    "cgpa": ["education", "7.18", "btech", "college"],
    "marks": ["cgpa", "87%", "percentage", "mht-cet", "education"],
    "job": ["employment", "work", "icar", "nbss", "professional", "role", "yp-ii"],
    "work": ["employment", "job", "icar", "internship", "professional", "freelancing", "projects"],
    "working": ["employment", "job", "icar", "internship", "professional"],
    "role": ["employment", "professional", "engineer", "icar", "yp-ii"],
    "company": ["icar", "employment", "professional", "startup", "goals"],
    "experience": ["internship", "employment", "professional", "freelancing", "work", "projects"],
    "internship": ["icar", "nbss", "intern", "soil", "dss", "vidarbha", "rusle"],
    "intern": ["icar", "nbss", "internship", "soil"],
    "icar": ["nbss", "soil", "nirmal", "kumar", "nasf", "internship", "professional"],
    "tech": ["programming", "languages", "python", "react", "ai", "machine learning", "technologies"],
    "stack": ["programming", "languages", "python", "react", "c++", "web", "technologies", "typescript"],
    "skills": ["programming", "technologies", "ai", "machine learning", "deep learning", "computer vision", "web"],
    "coding": ["programming", "python", "c++", "javascript", "typescript", "r", "languages"],
    "code": ["programming", "languages", "python"],
    "languages": ["programming", "python", "r", "c++", "javascript", "typescript", "html", "css"],
    "programming": ["python", "r", "c++", "javascript", "typescript", "coding", "web"],
    "web": ["react", "frontend", "websites", "javascript", "html", "css", "freelancing"],
    "website": ["web", "react", "frontend", "development", "freelancing", "redesign"],
    "websites": ["web", "react", "frontend", "development", "freelancing", "redesign"],
    "ai": ["machine learning", "deep learning", "yolo", "opencv", "rag", "llm", "generative", "projects"],
    "ml": ["machine learning", "deep learning", "yolo", "opencv", "scikit-learn", "pneumonia"],
    "vision": ["computer vision", "opencv", "yolo", "yolov11", "detection", "safety"],
    "cv": ["computer vision", "opencv", "yolo", "detection"],
    "rag": ["generative", "llm", "vector", "chatbot"],
    "friends": ["friend", "friendship", "sarvesh", "indrajeet", "sujal", "om", "yadhynesh", "atharva", "pritish"],
    "friend": ["friends", "friendship", "sarvesh", "indrajeet", "sujal", "om", "yadhynesh", "atharva", "pritish"],
    "family": ["father", "mother", "sister", "parents", "tanvi", "vivek", "nilima", "butle", "family"],
    "parents": ["father", "mother", "family", "vivek", "nilima"],
    "father": ["vivek", "family", "teacher", "mahavir"],
    "mother": ["nilima", "family", "teacher", "tuition"],
    "sister": ["tanvi", "tanu", "family", "pharm.d"],
    "hobbies": ["hobby", "guitar", "music", "football", "travel", "reading", "entertainment", "zindagii"],
    "hobby": ["hobbies", "guitar", "football", "music", "travel", "biographies", "zindagii"],
    "free": ["hobbies", "guitar", "football", "music", "travel", "time"],
    "music": ["guitar", "songs", "poetry", "hobbies", "zindagii", "mirchi"],
    "song": ["zindagii", "music", "guitar", "mirchi", "youtube"],
    "guitar": ["music", "songs", "hobbies", "zindagii"],
    "football": ["sports", "relax", "hobbies"],
    "travel": ["places", "himachal", "india", "hobbies"],
    "live": ["residence", "location", "nagpur", "wani", "home", "lives"],
    "lives": ["residence", "location", "nagpur", "wani", "home", "live"],
    "living": ["location", "residence", "nagpur", "wani", "home"],
    "where": ["location", "residence", "nagpur", "wani", "home", "education", "college"],
    "hometown": ["wani", "location", "yavatmal", "schooling", "home"],
    "from": ["wani", "nagpur", "location", "residence"],
    "location": ["nagpur", "wani", "maharashtra", "india", "residence"],
    "gadkari": ["minister", "nitin", "presentation", "health", "locker", "abdm", "achievements", "aarogyam"],
    "minister": ["gadkari", "nitin", "presentation", "health locker", "achievements", "aarogyam"],
    "presentation": ["gadkari", "nitin", "startup", "achievements", "aarogyam"],
    "culture": ["cultural", "fest", "coordinator", "performances", "stage", "achievements"],
    "cultural": ["fest", "coordinator", "performances", "stage", "achievements"],
    "fest": ["cultural", "coordinator", "performances", "stage", "achievements"],
    "leadership": ["coordinator", "cultural", "council", "placement", "leader", "management", "achievements"],
    "contact": ["email", "phone", "number", "instagram", "linkedin", "portfolio", "github", "hire"],
    "hire": ["contact", "freelancing", "email", "phone", "services"],
    "email": ["contact", "vedantvbutle@gmail.com"],
    "phone": ["contact", "7796041818", "number"],
    "number": ["contact", "phone", "7796041818"],
    "reach": ["contact", "email", "phone"],
    "projects": ["projects", "soil", "icar", "safety kit", "dss", "pneumonia", "yolo", "aarogyam", "shetkari"],
    "project": ["projects", "soil", "icar", "safety kit", "dss", "pneumonia", "yolo", "aarogyam", "shetkari"],
    "goals": ["short-term", "long-term", "company", "vision", "career", "future"],
    "goal": ["goals", "short-term", "long-term", "company", "career"],
    "future": ["goals", "company", "career", "short-term", "long-term", "vision"],
    "personality": ["values", "personal", "emotional", "genuine", "curious"],
    "values": ["personal", "authenticity", "learning", "professionalism"]
}

STOPWORDS = {
    "is", "the", "a", "an", "what", "where", "how", "who", "which", "are",
    "his", "her", "he", "she", "in", "at", "to", "for", "of", "and", "or",
    "on", "with", "tell", "me", "about", "can", "you", "does", "do", "did",
    "vedant", "vedants", "butle", "your"
}


def retrieve_knowledge(question: str, top_k=6):
    """Ranks knowledge sections with keyword + synonym expansion and title weighting."""
    words = re.findall(r"\w+", question.lower())
    query_terms = [w for w in words if w not in STOPWORDS]
    if not query_terms:
        query_terms = [w for w in words if w not in {"is", "the", "a", "an"}]

    expanded_terms = set(query_terms)
    for t in query_terms:
        if t in SYNONYM_MAP:
            expanded_terms.update(SYNONYM_MAP[t])

    sections = get_sections()
    scored = []
    for s in sections:
        score = 0
        text_lower = (s["title"] + " " + s["text"]).lower()
        title_lower = s["title"].lower()
        file_lower = s["file"].lower()

        for term in expanded_terms:
            if term in title_lower:
                score += 8
            if term in file_lower:
                score += 6
            count = text_lower.count(term)
            if count > 0:
                score += min(count * 2, 8)

        if score > 0:
            scored.append((score, s))

    scored.sort(key=lambda x: x[0], reverse=True)
    results = [s for _, s in scored[:top_k]]

    if not results:
        fallback_files = {"Projects.md", "Professional.md", "Education.md", "Achievements.md", "contact.md"}
        results = [s for s in sections if s["file"] in fallback_files][:top_k]

    documents = [f"[{s['file']} - {s['title']}]\n{s['text']}" for s in results]
    metadatas = [{"source": s["file"], "title": s["title"]} for s in results]

    return documents, metadatas


def build_context(documents, metadatas=None):
    context_parts = [CORE_BIO]
    for document in documents:
        if document.strip():
            context_parts.append(document.strip())
    return "\n\n---\n\n".join(context_parts)


def ensure_ollama_running():
    try:
        with urllib.request.urlopen("http://127.0.0.1:11434/api/tags", timeout=1.0) as res:
            if res.status == 200:
                return True
    except Exception:
        pass

    try:
        subprocess.Popen(
            ["ollama", "serve"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            creationflags=getattr(subprocess, "CREATE_NO_WINDOW", 0)
        )
        for _ in range(6):
            time.sleep(0.5)
            try:
                with urllib.request.urlopen("http://127.0.0.1:11434/api/tags", timeout=1.0) as res:
                    if res.status == 200:
                        return True
            except Exception:
                pass
    except Exception as e:
        print("Auto-start ollama info:", e)
    return False


def extract_direct_facts(documents):
    facts = []
    for doc in documents[:3]:
        lines = [
            line.strip()
            for line in doc.split("\n")
            if line.strip() and not line.strip().startswith("#") and not line.strip().startswith("[")
        ]
        if lines:
            facts.append(" ".join(lines))
    if facts:
        return "\n\n".join(facts)
    return (
        "Vedant Vivek Butle is an AI/ML Engineer (Young Professional-II at ICAR-NBSS&LUP, Nagpur) "
        "and Web Designer based in Nagpur, India. Explore his portfolio for projects, education, and achievements."
    )


SYSTEM_PROMPT = """You are the personal portfolio AI assistant for Vedant Vivek Butle.
Your job is to answer questions about Vedant using his portfolio information provided below.

INSTRUCTIONS:
1. Understand the user's intent across different question styles and wordings.
2. Answer informatively, accurately, and directly based on the provided portfolio knowledge.
3. Synthesize details from the provided sections using clean markdown formatting (bullet points, bold key terms) where helpful.
4. If a question is about something completely unrelated to Vedant or not present in his portfolio, politely explain that this detail is not available in Vedant's portfolio.
5. Location fact: Vedant lives in Nagpur, Maharashtra, India, and his hometown is Wani, Maharashtra, India.
6. Keep answers polite, professional, friendly, and concise."""


def generate_answer(question: str):
    documents, metadatas = retrieve_knowledge(question, top_k=6)
    context = build_context(documents, metadatas)

    user_prompt = f"""PORTFOLIO INFORMATION:
{context}

USER QUESTION:
{question}

Please answer the user's question directly and informatively based on the portfolio information above."""

    ensure_ollama_running()

    try:
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            options={
                "num_predict": 512,
                "num_ctx": 3072,
                "temperature": 0.2
            },
            keep_alive="60m"
        )
        answer = response["message"]["content"]
    except Exception as e:
        print("Ollama call failed, using knowledge fallback:", e)
        answer = extract_direct_facts(documents)

    return answer, metadatas


def generate_answer_stream(question: str):
    documents, metadatas = retrieve_knowledge(question, top_k=6)
    context = build_context(documents, metadatas)

    user_prompt = f"""PORTFOLIO INFORMATION:
{context}

USER QUESTION:
{question}

Please answer the user's question directly and informatively based on the portfolio information above."""

    ensure_ollama_running()

    try:
        stream_response = ollama.chat(
            model=MODEL_NAME,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            options={
                "num_predict": 320,
                "num_ctx": 3072,
                "temperature": 0.2
            },
            keep_alive="60m",
            stream=True
        )

        for chunk in stream_response:
            content = chunk.get("message", {}).get("content", "")
            if content:
                yield {"type": "token", "token": content}
    except Exception as e:
        print("Ollama stream failed, using knowledge fallback:", e)
        fallback = extract_direct_facts(documents)
        words = fallback.split(" ")
        for i in range(0, len(words), 3):
            yield {"type": "token", "token": " ".join(words[i:i+3]) + " "}
            time.sleep(0.03)


if __name__ == "__main__":
    print(f"Vedant AI initialized with {len(SECTIONS)} sections.")
    while True:
        q = input("\nYou: ")
        if q.strip().lower() in {"exit", "quit"}:
            break
        ans, _ = generate_answer(q)
        print("\nVedant AI:\n", ans)