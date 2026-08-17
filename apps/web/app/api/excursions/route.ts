import { NextResponse } from "next/server";
import { getPublishedExcursions } from "../../../lib/db/excursions";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;
    const destination = searchParams.get("destination") || searchParams.get("q") || undefined;
    const featuredOnly = searchParams.get("featured") === "true";
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

    const excursions = await getPublishedExcursions({
      category,
      destination,
      featuredOnly,
      limit
    });

    return NextResponse.json({
      count: excursions.length,
      excursions
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao consultar catálogo de excursões." },
      { status: 500 }
    );
  }
}
