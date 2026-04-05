import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // One-way only — no unliking
    const alreadyLiked = await kv.sismember("portfolio:likers", ip);
    if (alreadyLiked) {
      const likes = await kv.get<number>("portfolio:likes");
      return NextResponse.json({ likes: likes ?? 0, hasLiked: true });
    }

    await kv.sadd("portfolio:likers", ip);
    await kv.incr("portfolio:likes");

    const likes = await kv.get<number>("portfolio:likes");
    return NextResponse.json({ likes: likes ?? 0, hasLiked: true });
  } catch (error) {
    console.error("Like error:", error);
    return NextResponse.json({ error: "Failed to like" }, { status: 500 });
  }
}