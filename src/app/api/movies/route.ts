import { NextResponse } from "next/server";
import xml2js from "xml2js";

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

    const movie = {
      title: item.title?.[0] || "",
      link: item.link?.[0] || "",
      description,
      poster,
      pubDate: item.pubDate?.[0] || "",
    };

    // ✅ Return only ONE movie
    return NextResponse.json({ movies: [movie] });
  } catch (err) {
    return NextResponse.json({ movies: [] }, { status: 500 });
  }
}