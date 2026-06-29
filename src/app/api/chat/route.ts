import { anthropic } from "@ai-sdk/anthropic";
import {
  streamText,
  convertToModelMessages,
  isTextUIPart,
  type UIMessage,
} from "ai";
import { buildSystemPrompt } from "@/lib/knowledge";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_MESSAGES = 24; // cap the conversation we'll forward
const MAX_CHARS = 1500; // cap a single user turn

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "The chat isn't configured yet. Email dikeuche3@gmail.com in the meantime." },
      { status: 503 }
    );
  }

  // best-effort per-IP throttle
  const ip = (req.headers.get("x-forwarded-for") ?? "anon").split(",")[0].trim();
  const limit = rateLimit(`chat:${ip}`);
  if (!limit.ok) {
    return Response.json(
      { error: "That's a lot of questions. Give it a moment and try again." },
      { status: 429, headers: { "retry-after": String(limit.retryAfter) } }
    );
  }

  let messages: UIMessage[];
  try {
    const body = await req.json();
    messages = body.messages;
  } catch {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > MAX_MESSAGES) {
    return Response.json({ error: "Bad request." }, { status: 400 });
  }

  // length guard on the most recent user turn
  const last = messages[messages.length - 1];
  const lastText = (last?.parts ?? [])
    .filter(isTextUIPart)
    .map((p) => p.text)
    .join(" ");
  if (lastText.length > MAX_CHARS) {
    return Response.json(
      { error: "That message is a bit long. Try trimming it down." },
      { status: 413 }
    );
  }

  const result = streamText({
    model: anthropic("claude-haiku-4-5"),
    system: buildSystemPrompt(),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 700,
    temperature: 0.5,
  });

  return result.toUIMessageStreamResponse();
}
