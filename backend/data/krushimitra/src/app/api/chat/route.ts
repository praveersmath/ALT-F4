import { NextRequest, NextResponse } from "next/server";
import { answerQuestion } from "@/lib/chat";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body.message ?? "").slice(0, 600).trim();
    const sessionId = String(body.sessionId ?? "anon").slice(0, 60);
    if (!message) return NextResponse.json({ ok: false, error: "empty message" }, { status: 400 });
    const { reply, lang } = await answerQuestion(message, sessionId);
    return NextResponse.json({ ok: true, reply, lang });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String((e as Error)?.message ?? e) }, { status: 500 });
  }
}
