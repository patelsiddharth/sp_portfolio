import { NextResponse } from "next/server";
import xml2js from "xml2js";

export const revalidate = 3600;

export async function GET() {
  try {
    const USER_ID = "181162134";

    const url = `https://www.goodreads.com/review/list_rss/${USER_ID}?shelf=currently-reading`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
    });

    const xml = await res.text();

    const parser = new xml2js.Parser();
    const data = await parser.parseStringPromise(xml);
    
    const items = data?.rss?.channel?.[0]?.item || [];

    const books = items.map((item: any) => ({
      title: item.title?.[0] || "",
      author_name: item.author_name?.[0] || "",
      book_large_image_url: item.book_large_image_url?.[0] || "",
      book_medium_image_url: item.book_medium_image_url?.[0] || "",
      book_small_image_url: item.book_small_image_url?.[0] || "",
      book_description: item.book_description?.[0] || "",
      average_rating: item.average_rating?.[0] || "0",
      num_pages: item.num_pages?.[0] || "",
      link: item.link?.[0] || "",
      total_pages: item.book?.[0]?.num_pages?.[0] || "",
      pubDate: item.pubDate?.[0] || "",
    }));

    return NextResponse.json({ books });
  } catch (error) {
    return NextResponse.json({ books: [] }, { status: 500 });
  }
}