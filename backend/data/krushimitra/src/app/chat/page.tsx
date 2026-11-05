"use client";

import { useEffect, useRef, useState } from "react";
import { SendHorizonal, Bot, User, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface Msg { role: "user" | "assistant"; content: string; lang?: string }

export default function ChatPage() {
  const { t, lang } = useI18n();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const sessionRef = useRef<string>("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    sessionRef.current = `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }, []);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: "assistant", content: t("c.welcome") }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, busy]);

  const send = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: msg }]);
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, sessionId: sessionRef.current }),
      });
      const d = await r.json();
      setMessages((m) => [...m, { role: "assistant", content: d.ok ? d.reply : "…error, please retry." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", content: lang === "kn" ? "ದೊರೆತ ನೆಟ್‌ವರ್ಕ್ ತೊಂದರೆ — ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ." : "Network hiccup — please try again." }]);
    } finally {
      setBusy(false);
      inputRef.current?.focus();
    }
  };

  const quicks = [t("c.q1"), t("c.q2"), t("c.q3"), t("c.q4")];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <span className="mx-auto inline-flex items-center gap-2 rounded-full border border-harvest/40 bg-harvest/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-harvest-2">
          <Sparkles className="size-3.5" /> AI · ಕನ್ನಡ + English
        </span>
        <h1 className="font-display mt-3 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">{t("c.title")}</h1>
        <p className="mx-auto mt-2 max-w-xl text-[15px] text-ink-soft">{t("c.subtitle")}</p>
      </div>

      <div className="card mt-8 overflow-hidden">
        {/* chat surface */}
        <div className="h-[56vh] min-h-[420px] space-y-4 overflow-y-auto bg-[linear-gradient(180deg,#f8f3e7,#faf6ee)] p-4 sm:p-6">
          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={cn("flex gap-2.5", m.role === "user" && "flex-row-reverse")}
              >
                <span
                  className={cn(
                    "grid size-8 shrink-0 place-items-center rounded-full shadow-soft",
                    m.role === "user" ? "bg-harvest text-ink" : "bg-forest text-cream"
                  )}
                >
                  {m.role === "user" ? <User className="size-4" /> : <Bot className="size-4" />}
                </span>
                <div
                  className={cn(
                    "max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[14px] leading-relaxed shadow-soft sm:max-w-[70%]",
                    m.role === "user"
                      ? "rounded-tr-sm bg-harvest/15 text-ink"
                      : "rounded-tl-sm border border-ink/10 bg-paper text-ink"
                  )}
                >
                  {m.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {busy && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-full bg-forest text-cream"><Bot className="size-4" /></span>
              <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-ink/10 bg-paper px-4 py-3 text-sm text-ink-soft">
                <span className="size-1.5 animate-bounce rounded-full bg-moss" />
                <span className="size-1.5 animate-bounce rounded-full bg-moss [animation-delay:0.15s]" />
                <span className="size-1.5 animate-bounce rounded-full bg-moss [animation-delay:0.3s]" />
                <span className="ml-2 text-[12px]">{t("c.thinking")}</span>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* quick actions */}
        <div className="flex gap-2 overflow-x-auto border-t border-ink/8 bg-paper px-4 py-2.5">
          {quicks.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="shrink-0 rounded-full border border-forest/25 bg-forest/5 px-3.5 py-1.5 text-[12px] font-semibold text-forest transition-colors hover:bg-forest hover:text-cream"
            >
              {q}
            </button>
          ))}
        </div>

        {/* input */}
        <form
          onSubmit={(e) => { e.preventDefault(); send(); }}
          className="flex items-center gap-2 border-t border-ink/8 bg-paper p-3"
        >
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("c.placeholder")}
            className="flex-1 rounded-xl border border-ink/12 bg-cream-2/50 px-4 py-3 text-[14px] text-ink placeholder:text-moss/70"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="grid size-12 place-items-center rounded-xl bg-forest text-cream shadow-soft transition-all hover:bg-forest-2 disabled:opacity-50"
            aria-label={t("c.send")}
          >
            <SendHorizonal className="size-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
