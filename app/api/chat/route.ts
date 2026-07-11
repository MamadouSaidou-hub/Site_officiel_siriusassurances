import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/chatbot/knowledge";

// Fonction serverless plafonnée à 30s — ne peut jamais se figer indéfiniment.
export const maxDuration = 30;
export const dynamic = "force-dynamic";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

type ChatMessage = { role: "user" | "assistant"; content: string };

function sanitize(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
}

/** Journalise l'échange via l'API REST Supabase (best effort, borné à 3s). */
async function logExchange(
  sessionId: string | null,
  question: string,
  answer: string
): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return;
  try {
    await fetch(`${url}/rest/v1/chat_logs`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        session_id: sessionId,
        question,
        answer: answer || null,
        model: MODEL,
      }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // best effort
  }
}

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Chatbot non configuré (GROQ_API_KEY manquante)." },
      { status: 503 }
    );
  }

  let body: { messages?: unknown; sessionId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  const history = sanitize(body.messages);
  if (history.length === 0) {
    return NextResponse.json({ error: "Aucun message." }, { status: 400 });
  }
  const sessionId =
    typeof body.sessionId === "string" ? body.sessionId.slice(0, 64) : null;
  const question =
    [...history].reverse().find((m) => m.role === "user")?.content ?? "";

  // Appel Groq NON-streaming, plafonné à 25s.
  let groqRes: Response;
  try {
    groqRes = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.3,
        max_tokens: 1024,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      }),
      signal: AbortSignal.timeout(25000),
    });
  } catch {
    return NextResponse.json(
      { error: "Le service IA n'a pas répondu à temps." },
      { status: 504 }
    );
  }

  if (!groqRes.ok) {
    const detail = await groqRes.text().catch(() => "");
    return NextResponse.json(
      { error: `Erreur du service IA (${groqRes.status}).`, detail },
      { status: 502 }
    );
  }

  const data = await groqRes.json().catch(() => null);
  const answer: string =
    data?.choices?.[0]?.message?.content?.trim() ?? "";

  if (!answer) {
    return NextResponse.json(
      { error: "Réponse vide du service IA." },
      { status: 502 }
    );
  }

  // Logging non bloquant (borné à 3s, best effort).
  await logExchange(sessionId, question, answer);

  return new Response(answer, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
