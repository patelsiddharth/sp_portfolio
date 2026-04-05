import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export async function GET(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    // Track unique visit
    const visitKey = `visitor:${ip}`;
    const isNewVisitor = await kv.setnx(visitKey, 1);
    if (isNewVisitor) {
      await kv.expire(visitKey, 60 * 60 * 24 * 365); // 1 year TTL
      await kv.incr("portfolio:visits");
    }

    const [visits, likes, hasLiked] = await Promise.all([
      kv.get<number>("portfolio:visits"),
      kv.get<number>("portfolio:likes"),
      kv.sismember("portfolio:likers", ip),
    ]);

    return NextResponse.json({
      visits: visits ?? 1,
      likes: likes ?? 0,
      hasLiked: hasLiked === 1,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ visits: 0, likes: 0, hasLiked: false }, { status: 500 });
  }
}