import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, X, Send, RotateCcw, Sparkles, ExternalLink, ChevronDown } from "lucide-react";
import {
  SYSTEM_PROMPT,
  buildKnowledgeContext,
  retrieveKnowledge,
  synthesizeKnowledgeAnswer,
} from "@/lib/chatbot-engine";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  time: string;
  isStreaming?: boolean;
}

const DEFAULT_API_URL =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_CHATBOT_API_URL) ||
  "http://127.0.0.1:8000";

const SUGGESTED_PROMPTS = [
  {
    icon: "🚀",
    label: "Key AI Projects",
    query: "What are your key AI and software projects?",
  },
  {
    icon: "💻",
    label: "Skills & Tech Stack",
    query: "What programming languages and AI technologies do you specialize in?",
  },
  {
    icon: "🎓",
    label: "Education & Leadership",
    query: "What is your educational background and leadership experience?",
  },
  {
    icon: "📬",
    label: "Contact & Hire",
    query: "How can I contact or hire Vedant?",
  },
];

function formatTime(): string {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function renderFormattedMarkdown(text: string) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeBlockContent: string[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      const items = [...listItems];
      listItems = [];
      elements.push(
        <ul key={`ul-${elements.length}`} className="my-1.5 list-disc space-y-1 pl-5">
          {items.map((item, idx) => (
            <li key={idx}>{parseInlineText(item)}</li>
          ))}
        </ul>,
      );
    }
  };

  const parseInlineText = (str: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    const regex = /(\[.*?\]\((?:https?:\/\/|mailto:)[^\s)]+\)|\*\*.*?\*\*|`.*?`|\*.*?\*)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(str)) !== null) {
      if (match.index > lastIndex) {
        parts.push(str.substring(lastIndex, match.index));
      }
      const token = match[0];

      if (token.startsWith("[") && token.includes("](")) {
        const linkMatch = token.match(/\[(.*?)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)/);
        if (linkMatch) {
          parts.push(
            <a
              key={match.index}
              href={linkMatch[2]}
              target={linkMatch[2].startsWith("mailto:") ? undefined : "_blank"}
              rel={linkMatch[2].startsWith("mailto:") ? undefined : "noopener noreferrer"}
              className="inline-flex items-center gap-0.5 font-medium text-[var(--mint)] underline underline-offset-2 hover:opacity-80"
            >
              {linkMatch[1]}
              <ExternalLink className="inline h-3 w-3" />
            </a>,
          );
        } else {
          parts.push(token);
        }
      } else if (token.startsWith("**") && token.endsWith("**")) {
        parts.push(
          <strong key={match.index} className="font-semibold text-foreground">
            {token.slice(2, -2)}
          </strong>,
        );
      } else if (token.startsWith("`") && token.endsWith("`")) {
        parts.push(
          <code
            key={match.index}
            className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-xs text-[var(--mint)]"
          >
            {token.slice(1, -1)}
          </code>,
        );
      } else if (token.startsWith("*") && token.endsWith("*")) {
        parts.push(
          <em key={match.index} className="italic text-foreground/90">
            {token.slice(1, -1)}
          </em>,
        );
      } else {
        parts.push(token);
      }

      lastIndex = match.index + token.length;
    }

    if (lastIndex < str.length) {
      parts.push(str.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [str];
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        elements.push(
          <pre
            key={`code-${elements.length}`}
            className="my-2 overflow-x-auto rounded-lg border border-border bg-black/40 p-3 font-mono text-xs text-[var(--mint)]"
          >
            <code>{codeBlockContent.join("\n")}</code>
          </pre>,
        );
        codeBlockContent = [];
        inCodeBlock = false;
      } else {
        flushList();
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent.push(line);
      continue;
    }

    const trimmed = line.trim();
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      listItems.push(trimmed.substring(2));
      continue;
    } else {
      flushList();
    }

    if (trimmed.length > 0) {
      elements.push(
        <p key={`p-${elements.length}`} className="my-1 leading-relaxed">
          {parseInlineText(line)}
        </p>,
      );
    }
  }

  flushList();

  if (inCodeBlock && codeBlockContent.length > 0) {
    elements.push(
      <pre
        key={`code-end-${elements.length}`}
        className="my-2 overflow-x-auto rounded-lg border border-border bg-black/40 p-3 font-mono text-xs text-[var(--mint)]"
      >
        <code>{codeBlockContent.join("\n")}</code>
      </pre>,
    );
  }

  return elements;
}

export function ChatBotCard({ apiUrl = DEFAULT_API_URL }: { apiUrl?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "ready">("checking");
  const [effectiveUrl, setEffectiveUrl] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Check backend health and verify service identity ("Vedant AI")
  useEffect(() => {
    let isMounted = true;
    const checkHealth = async () => {
      const isLocalHost =
        typeof window !== "undefined" &&
        (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
      const configuredApiUrl =
        typeof import.meta !== "undefined" ? import.meta.env?.VITE_CHATBOT_API_URL : undefined;

      // On Vercel/production without an external backend URL, immediately use the built-in RAG engine
      if (!isLocalHost && !configuredApiUrl) {
        if (isMounted) {
          setEffectiveUrl(null);
          setBackendStatus("ready");
        }
        return;
      }

      const candidates = Array.from(
        new Set(
          [
            configuredApiUrl,
            ...(isLocalHost
              ? [apiUrl, "http://127.0.0.1:8000", "http://localhost:8000", "http://127.0.0.1:8001"]
              : []),
          ].filter(Boolean) as string[],
        ),
      );

      for (const url of candidates) {
        try {
          const controller = new AbortController();
          const timer = setTimeout(() => controller.abort(), 1800);
          const res = await fetch(`${url}/health`, { method: "GET", signal: controller.signal });
          clearTimeout(timer);
          if (res.ok) {
            const data = await res.json().catch(() => null);
            if (data?.service === "Vedant AI" && isMounted) {
              setEffectiveUrl(url);
              setBackendStatus("online");
              return;
            }
          }
        } catch {
          // continue checking other candidates
        }
      }

      if (isMounted) {
        setEffectiveUrl(null);
        setBackendStatus("ready");
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [apiUrl]);

  // Click outside or Escape to close the chatbot card
  useEffect(() => {
    function handlePointerDown(event: MouseEvent | TouchEvent) {
      if (!isOpen) return;
      const target = event.target as Node;
      if (
        (cardRef.current && cardRef.current.contains(target)) ||
        (buttonRef.current && buttonRef.current.contains(target))
      ) {
        return;
      }
      setIsOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handlePointerDown);
      document.addEventListener("touchstart", handlePointerDown);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isGenerating]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleReset = () => {
    if (isGenerating) return;
    setMessages([]);
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const updateBotMessage = (botMessageId: string, content: string, isStreaming = false) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === botMessageId ? { ...msg, text: content, isStreaming } : msg)),
    );
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isGenerating) return;

    const userMessageId = `user-${Date.now()}`;
    const botMessageId = `bot-${Date.now()}`;

    const userMsg: Message = {
      id: userMessageId,
      sender: "user",
      text,
      time: formatTime(),
    };

    const botMsg: Message = {
      id: botMessageId,
      sender: "bot",
      text: "",
      time: formatTime(),
      isStreaming: true,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInputValue("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.focus();
    }
    setIsGenerating(true);

    let accumulatedText = "";
    const isLocalHost =
      typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
    const configuredApiUrl =
      typeof import.meta !== "undefined" ? import.meta.env?.VITE_CHATBOT_API_URL : undefined;

    const urlsToTry = Array.from(
      new Set(
        [
          effectiveUrl,
          configuredApiUrl,
          ...(isLocalHost
            ? [apiUrl, "http://127.0.0.1:8000", "http://localhost:8000", "http://127.0.0.1:8001"]
            : []),
        ].filter(Boolean) as string[],
      ),
    );

    let handled = false;

    // 1. Try Vedant AI FastAPI streaming endpoint
    for (const targetUrl of urlsToTry) {
      try {
        const streamController = new AbortController();
        const timeoutId = setTimeout(() => streamController.abort(), 25000);

        const res = await fetch(`${targetUrl}/chat/stream`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
          signal: streamController.signal,
        });

        if (!res.ok || !res.body) {
          clearTimeout(timeoutId);
          continue;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let isDone = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          clearTimeout(timeoutId);
          buffer += decoder.decode(value, { stream: true });
          const parts = buffer.split("\n\n");
          buffer = parts.pop() || "";

          for (const part of parts) {
            if (!part.startsWith("data: ")) continue;
            const dataStr = part.replace("data: ", "").trim();

            if (dataStr === "[DONE]") {
              isDone = true;
              break;
            }

            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.type === "token") {
                accumulatedText += parsed.token;
                updateBotMessage(botMessageId, accumulatedText, false);
              } else if (parsed.type === "error") {
                accumulatedText = parsed.error || "";
              }
            } catch {
              // Ignore partial chunk
            }
          }

          if (isDone) break;
        }

        if (accumulatedText.trim().length > 0) {
          handled = true;
          setEffectiveUrl(targetUrl);
          setBackendStatus("online");
          break;
        }
      } catch {
        // try next candidate
      }
    }

    // 2. Fallback to standard /chat JSON endpoint on verified backend
    if (!handled) {
      for (const targetUrl of urlsToTry) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000);

          const fallbackRes = await fetch(`${targetUrl}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          if (!fallbackRes.ok) continue;

          const data = await fallbackRes.json();
          if (data?.answer) {
            accumulatedText = data.answer;
            updateBotMessage(botMessageId, accumulatedText, false);
            handled = true;
            setEffectiveUrl(targetUrl);
            setBackendStatus("online");
            break;
          }
        } catch {
          // try next candidate
        }
      }
    }

    // 3. Direct Local Ollama RAG fallback (when running locally without FastAPI)
    if (!handled && isLocalHost) {
      try {
        const sections = retrieveKnowledge(text, 6);
        const context = buildKnowledgeContext(sections);
        const userPrompt = `PORTFOLIO INFORMATION:\n${context}\n\nUSER QUESTION:\n${text}\n\nPlease answer the user's question directly and informatively based on the portfolio information above.`;

        const ollamaController = new AbortController();
        const timeoutId = setTimeout(() => ollamaController.abort(), 12000);

        const ollamaRes = await fetch("http://127.0.0.1:11434/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "qwen2.5:1.5b",
            stream: false,
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              { role: "user", content: userPrompt },
            ],
            options: {
              num_predict: 512,
              num_ctx: 3072,
              temperature: 0.2,
            },
          }),
          signal: ollamaController.signal,
        });
        clearTimeout(timeoutId);

        if (ollamaRes.ok) {
          const ollamaData = await ollamaRes.json();
          const content = ollamaData?.message?.content;
          if (content && content.trim().length > 0) {
            accumulatedText = content.trim();
            updateBotMessage(botMessageId, accumulatedText, false);
            handled = true;
          }
        }
      } catch {
        // Ollama not running locally or blocked by CORS; proceed to built-in knowledge engine
      }
    }

    // 4. Built-in Synchronized Knowledge Base Responder (guarantees 100% uptime on Vercel & everywhere)
    if (!handled) {
      const answer = synthesizeKnowledgeAnswer(text);
      const tokens = answer.split(" ");
      let current = "";
      for (let i = 0; i < tokens.length; i += 4) {
        current += (i === 0 ? "" : " ") + tokens.slice(i, i + 4).join(" ");
        updateBotMessage(botMessageId, current, false);
        await new Promise((r) => setTimeout(r, 18));
      }
    }

    setIsGenerating(false);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 10);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 flex h-[580px] max-h-[calc(100vh-120px)] w-[calc(100vw-32px)] sm:w-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-card/95 backdrop-blur-2xl shadow-2xl text-foreground ring-1 ring-border/50"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/80 bg-background/50 px-4 py-3 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[var(--mint)] to-[var(--violet-brand)] text-xs font-bold text-black shadow-md">
                  VB
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span
                      className={`h-full w-full rounded-full border-2 border-card ${
                        backendStatus === "checking" ? "bg-amber-400" : "bg-emerald-500"
                      }`}
                    />
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-sm leading-tight text-foreground">
                    Vedant Butle
                    <span className="rounded-full bg-[var(--mint)]/15 px-1.5 py-0.2 text-[10px] font-medium text-[var(--mint)]">
                      AI
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        backendStatus === "checking"
                          ? "bg-amber-400"
                          : "bg-emerald-500 animate-pulse"
                      }`}
                    />
                    <span>
                      {backendStatus === "online"
                        ? "Assistant Online"
                        : backendStatus === "checking"
                          ? "Connecting..."
                          : "AI Assistant Ready"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  disabled={isGenerating || messages.length === 0}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  title="Close chat"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages Scroll View */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scroll-smooth">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--mint)]/30 bg-[var(--mint)]/10 px-3 py-1 text-xs font-medium text-[var(--mint)] shadow-sm">
                    <span className="h-2 w-2 rounded-full bg-[var(--mint)] animate-pulse" />
                    Knowledge Base Synchronized
                  </div>

                  <h3 className="mt-3 text-base font-bold text-foreground">
                    Hi, I'm <span className="text-gradient">Vedant's</span> AI Assistant 👋
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground max-w-[320px] leading-relaxed">
                    Ask me anything about Vedant's projects, experience, tech stack, or
                    achievements!
                  </p>

                  <div className="mt-4 w-full">
                    <p className="mb-2 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                      Suggested questions:
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {SUGGESTED_PROMPTS.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleSendMessage(prompt.query);
                            inputRef.current?.focus();
                          }}
                          className="flex items-center gap-2 rounded-xl border border-border/80 bg-secondary/40 hover:bg-[var(--mint)]/10 hover:border-[var(--mint)]/40 hover:text-[var(--mint)] px-3 py-2 text-left text-xs transition-all duration-200"
                        >
                          <span className="text-sm">{prompt.icon}</span>
                          <span className="flex-1 truncate font-medium">{prompt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.sender === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-[var(--mint)] to-[var(--violet-brand)] text-black font-medium shadow-md rounded-br-xs"
                          : "border border-border/80 bg-secondary/50 text-foreground rounded-bl-xs shadow-sm"
                      }`}
                    >
                      {msg.sender === "bot" && msg.isStreaming && !msg.text ? (
                        <div className="flex items-center gap-1.5 py-1">
                          <span className="h-2 w-2 rounded-full bg-[var(--mint)] animate-bounce [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 rounded-full bg-[var(--mint)] animate-bounce [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 rounded-full bg-[var(--mint)] animate-bounce" />
                        </div>
                      ) : (
                        renderFormattedMarkdown(msg.text)
                      )}
                    </div>
                    <span className="mt-1 text-[10px] text-muted-foreground px-1">{msg.time}</span>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Box Footer */}
            <div className="border-t border-border/80 bg-background/50 p-3 backdrop-blur-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                  inputRef.current?.focus();
                }}
                className="flex items-end gap-2 rounded-xl border border-border bg-card/90 px-3 py-2 focus-within:border-[var(--mint)] focus-within:ring-2 focus-within:ring-[var(--mint)]/20 transition-all"
              >
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isGenerating ? "Vedant AI is responding..." : "Ask anything about Vedant..."
                  }
                  rows={1}
                  className="max-h-28 flex-1 resize-none bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="submit"
                  onMouseDown={(e) => e.preventDefault()}
                  disabled={!inputValue.trim() || isGenerating}
                  className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--mint)] text-black shadow hover:opacity-90 disabled:opacity-40 disabled:hover:opacity-40 transition-all shrink-0"
                  aria-label="Send message"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
              <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-muted-foreground/75">
                <span>Enter to send • Shift+Enter for newline</span>
                <span>Vedant AI v1.0</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
            className="hidden md:flex items-center gap-1.5 rounded-full border border-border/80 bg-card/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-lg backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-[var(--mint)] animate-pulse" />
            <span>Chat with Vedant AI</span>
          </motion.div>
        )}

        <motion.button
          ref={buttonRef}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative grid h-14 w-14 place-items-center rounded-full bg-gradient-to-tr from-[var(--mint)] via-[#2dd4bf] to-[var(--violet-brand)] text-black shadow-[var(--shadow-glow)] transition-shadow hover:shadow-[0_12px_36px_rgba(52,211,153,0.5)] focus:outline-none"
          aria-label={isOpen ? "Close Vedant AI Assistant" : "Open Vedant AI Assistant"}
          title={isOpen ? "Close Chat" : "Ask Vedant AI"}
        >
          {isOpen ? (
            <ChevronDown className="h-6 w-6 text-foreground stroke-[2.5]" />
          ) : (
            <>
              <Bot className="h-6 w-6 stroke-[2.3]" />
              <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-400" />
              </span>
            </>
          )}
        </motion.button>
      </div>
    </>
  );
}
