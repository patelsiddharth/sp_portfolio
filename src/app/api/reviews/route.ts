import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";

export interface Review {
  id: string;
  name: string;
  message: string;
  mood: string;
  createdAt: number;
}

export async function GET() {
  try {
    const reviewIds = await kv.zrange<string[]>("portfolio:reviews", 0, 99, { rev: true });

    if (!reviewIds || reviewIds.length === 0) {
      return NextResponse.json({ reviews: [] });
    }

    const reviews = await Promise.all(
      reviewIds.map((id) => kv.get<Review>(`review:${id}`))
    );

    return NextResponse.json({ reviews: reviews.filter(Boolean) });
  } catch (error) {
    console.error("Reviews GET error:", error);
    return NextResponse.json({ reviews: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, message, mood } = body;

    if (!name?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name and message are required" }, { status: 400 });
    }

    if (name.trim().length > 60 || message.trim().length > 500) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    const validMoods = ["🔥", "😊", "👏", "💡", "🚀"];
    const safeMood = validMoods.includes(mood) ? mood : "😊";

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const review: Review = {
      id,
      name: name.trim(),
      message: message.trim(),
      mood: safeMood,
      createdAt: Date.now(),
    };

    await kv.set(`review:${id}`, review);
    await kv.zadd("portfolio:reviews", { score: review.createdAt, member: id });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error("Reviews POST error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}