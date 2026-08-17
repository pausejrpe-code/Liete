import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "../../../../lib/db/profiles";
import { getOrganizerFinanceSummary } from "../../../../lib/db/finance";

export async function GET() {
  try {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const summary = await getOrganizerFinanceSummary(userProfile.id);
    return NextResponse.json(summary);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao consultar resumo financeiro do organizador." },
      { status: 500 }
    );
  }
}
