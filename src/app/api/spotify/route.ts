export const runtime = "nodejs";

import { NextResponse } from "next/server";

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID!;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET!;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN!;

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

async function getAccessToken(): Promise<string> {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: REFRESH_TOKEN,
    }),
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(`Token error: ${data.error} — ${data.error_description}`);
  }

  return data.access_token;
}

export async function GET() {
  try {
    const access_token = await getAccessToken();

    const res = await fetch(
      "https://api.spotify.com/v1/me/top/tracks?limit=1&time_range=short_term",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    if (!res.ok) {
      console.error("Spotify fetch failed:", res.status, await res.text());
      return NextResponse.json({ song: null }, { status: res.status });
    }

    const data = await res.json();
    const track = data.items?.[0];

    if (!track) return NextResponse.json({ song: null });

    return NextResponse.json({
      song: {
        title: track.name,
        artist: track.artists.map((a: { name: string }) => a.name).join(", "),
        albumImage: track.album.images?.[0]?.url ?? null,
        url: track.external_urls.spotify,
      },
    });
  } catch (err) {
    console.error("Spotify route error:", err);
    return NextResponse.json({ song: null }, { status: 500 });
  }
}