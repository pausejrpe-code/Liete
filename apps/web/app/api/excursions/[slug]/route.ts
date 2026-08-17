import { NextResponse } from "next/server";
import { getExcursionBySlug } from "../../../../lib/db/excursions";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const excursion = await getExcursionBySlug(slug);

    if (!excursion) {
      return NextResponse.json(
        { error: "Excursão não encontrada ou indisponível." },
        { status: 404 }
      );
    }

    return NextResponse.json({ excursion });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao consultar detalhes da excursão." },
      { status: 500 }
    );
  }
}
