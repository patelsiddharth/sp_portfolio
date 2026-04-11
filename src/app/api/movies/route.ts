import { NextResponse } from "next/server";
import xml2js from "xml2js";

export const runtime = "nodejs";

const TMDB_API_KEY = process.env.TMDB_API_KEY!;

async function fetchTMDBData(title: string, year?: string) {
  try {
    // 🔍 Step 1: Search movie
    const searchRes = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        title
      )}&year=${year}&api_key=${TMDB_API_KEY}`,
      {
        next: {
          revalidate: 60 * 60 * 12,
        },
      }
    );

    const searchData = await searchRes.json();

    const movie = searchData.results?.[0];
    if (!movie) return null;

    // 🎬 Step 2: Get full details
    const detailsRes = await fetch(
      `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`,
      {
        next: {
          revalidate: 60 * 60 * 12,
        },
      }
    );

    const details = await detailsRes.json();

    return {
      overview: details.overview,
      backdrop: details.backdrop_path
        ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
        : null,
      genres: details.genres?.map((g: any) => g.name) || [],
      tmdbRating: details.vote_average,
    };
  } catch (err) {
    console.error("TMDB fetch error:", err);
    return null;
  }
}

export async function GET() {
  try {
    const USERNAME = "sidd_425";

    const url = `https://letterboxd.com/${USERNAME}/rss/`;

    const res = await fetch(url);
    const xml = await res.text();

    const parser = new xml2js.Parser();
    const data = await parser.parseStringPromise(xml);

    const items = data?.rss?.channel?.[0]?.item || [];
    const item = items[0];

    if (!item) {
      return NextResponse.json({ movies: [] });
    }

    const description = item.description?.[0] || "";

    const imgMatch = description.match(/<img src="([^"]+)"/);
    const poster = imgMatch ? imgMatch[1] : "";

    const title =
      item["letterboxd:filmTitle"]?.[0] || item.title?.[0] || "";

    const year = item["letterboxd:filmYear"]?.[0] || "";

    // 🔥 Fetch TMDB data
    const tmdb = await fetchTMDBData(title, year);

    const movie = {
      title,
      link: item.link?.[0] || "",

      // 👉 Prefer TMDB overview (cleaner)
      description:
        tmdb?.overview ||
        description.replace(/<[^>]*>/g, "").slice(0, 160),

      poster,

      year,
      rating: item["letterboxd:memberRating"]?.[0] || "",
      rewatch: item["letterboxd:rewatch"]?.[0] === "Yes",

      // 🔥 NEW FIELDS
      backdrop: tmdb?.backdrop || null,
      genres: tmdb?.genres || [],
      tmdbRating: tmdb?.tmdbRating || null,
    };

    return NextResponse.json({ movies: [movie] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ movies: [] }, { status: 500 });
  }
}