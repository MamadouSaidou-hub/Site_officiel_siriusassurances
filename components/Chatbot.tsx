"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "Bonjour 👋 Je suis Sirius Assist. Posez-moi vos questions sur l'assurance (vie, non-vie) ou nos services — je peux aussi vous orienter vers un audit gratuit.",
};

const SUGGESTIONS = [
  "Quelle est la différence entre assurance vie et non-vie ?",
  "Quelles assurances proposez-vous pour une entreprise ?",
  "Comment se passe un audit gratuit ?",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionRef = useRef<string>("");
  if (!sessionRef.current) {
    sessionRef.current =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `s_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages, open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    setInput("");

    const next: Msg[] = [...messages, { role: "user", content }];
    // Ajoute un message assistant vide qu'on remplira au fil du flux.
    setMessages([...next, { role: "assistant", content: "" }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, sessionId: sessionRef.current }),
      });

      if (!res.ok || !res.body) {
        throw new Error("service");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
      if (!acc) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content:
              "Désolé, je n'ai pas pu répondre. Réessayez, ou contactez-nous au +221 78 423 71 71.",
          };
          return copy;
        });
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "Une erreur est survenue. Réessayez dans un instant, ou écrivez-nous à contact@siriusassurances.com.",
        };
        return copy;
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Fermer l'assistant" : "Ouvrir l'assistant"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sirius-gold text-sirius-bg shadow-lg shadow-sirius-gold/30 transition-transform hover:scale-105"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Panneau de chat */}
      {open && (
        <div className="fixed inset-x-3 bottom-24 z-50 flex h-[70vh] max-h-[560px] flex-col overflow-hidden rounded-2xl border border-sirius-light-border bg-sirius-card shadow-2xl sm:inset-x-auto sm:right-5 sm:w-[380px]">
          {/* En-tête */}
          <div className="flex items-center gap-3 bg-sirius-bg px-4 py-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sirius-gold/15">
              <Sparkles size={18} className="text-sirius-gold" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-sirius-text">Sirius Assist</p>
              <p className="text-[11px] text-sirius-text-dim">
                Assistant assurances · en ligne
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer le chat"
              className="flex h-8 w-8 items-center justify-center rounded-full text-sirius-text-dim transition-colors hover:bg-white/10 hover:text-sirius-text"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto bg-sirius-light px-4 py-4"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-sirius-gold text-sirius-bg"
                      : "border border-sirius-light-border bg-sirius-card text-sirius-ink"
                  }`}
                >
                  {m.content || (
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sirius-ink-mute [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sirius-ink-mute [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-sirius-ink-mute" />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Suggestions (uniquement au tout début) */}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-full border border-sirius-light-border bg-sirius-card px-3 py-1.5 text-left text-xs text-sirius-ink-dim transition-colors hover:border-sirius-gold/40 hover:text-sirius-ink"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Saisie */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-sirius-light-border bg-sirius-card p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Votre question…"
              className="min-w-0 flex-1 rounded-full border border-sirius-light-border bg-sirius-light-2 px-4 py-2.5 text-sm text-sirius-ink outline-none placeholder:text-sirius-ink-mute"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Envoyer"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sirius-gold text-sirius-bg disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </form>
          <p className="bg-sirius-card pb-2 text-center text-[10px] text-sirius-ink-mute">
            Réponses indicatives — pour un devis, demandez un audit gratuit.
          </p>
        </div>
      )}
    </>
  );
}
