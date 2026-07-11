import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/chatbot/knowledge";

export const runtime = "edge";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

type ChatMessage = { role: "user" | "assistant"; content: string };

/** Garde les échanges dans des limites raisonnables. */
function sanitize(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter(
      (m): m is ChatMessage =>
        !!m &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string"
    )
    .slice(-12) // ne garde que les 12 derniers messages
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
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

  // Garde-fou : abandonne l'appel Groq s'il ne répond pas dans les temps.
  const abortController = new AbortController();
  const abortTimer = setTimeout(() => abortController.abort(), 30000);

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
        stream: true,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
      }),
      signal: abortController.signal,
    });
  } catch (e) {
    clearTimeout(abortTimer);
    return NextResponse.json(
      { error: "Le service IA n'a pas répondu.", detail: String(e) },
      { status: 504 }
    );
  }

  if (!groqRes.ok || !groqRes.body) {
    clearTimeout(abortTimer);
    const detail = await groqRes.text().catch(() => "");
    return NextResponse.json(
      { error: `Erreur du service IA (${groqRes.status}).`, detail },
      { status: 502 }
    );
  }

  // Ré-émet le flux SSE de Groq en texte brut (delta.content concaténés).
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const reader = groqRes.body.getReader();
  let buffer = "";
  let answer = "";
  let logged = false;

  // Journalise l'échange via l'API REST Supabase (edge-native, borné à 3s).
  // On évite @supabase/supabase-js qui peut stagner en edge runtime.
  async function logExchange() {
    if (logged) return;
    logged = true;
    clearTimeout(abortTimer);
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
      // best effort — jamais bloquant
    }
  }

  const stream = new ReadableStream<Uint8Array>({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) {
        await logExchange();
        controller.close();
        return;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const data = trimmed.slice(5).trim();
        if (data === "[DONE]") {
          await logExchange();
          controller.close();
          return;
        }
        try {
          const json = JSON.parse(data);
          const token = json.choices?.[0]?.delta?.content;
          if (token) {
            answer += token;
            controller.enqueue(encoder.encode(token));
          }
        } catch {
          // ligne partielle : ignorée (sera complétée au prochain chunk)
        }
      }
    },
    cancel() {
      clearTimeout(abortTimer);
      reader.cancel();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
