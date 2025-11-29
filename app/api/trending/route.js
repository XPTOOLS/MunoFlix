import { getTrendingMovies } from "@/lib/MoviesFunctions";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const trendingData = await getTrendingMovies("all", 1);
    return NextResponse.json(trendingData);
  } catch (error) {
    console.error("Error in trending API:", error);
    return NextResponse.json({ error: "Failed to fetch trending data" }, { status: 500 });
  }
}