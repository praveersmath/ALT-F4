import { NextRequest, NextResponse } from "next/server";
import { getNews } from "@/lib/news";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const refresh = req.nextUrl.searchParams.get("refresh") === "1";
  const { items, mood, source } = await getNews(refresh);
  return NextResponse.json({ ok: true, items, mood, source });
}
