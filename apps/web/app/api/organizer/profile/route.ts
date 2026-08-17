import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "../../../../lib/db/profiles";
import { getOrganizerProfile, upsertOrganizerProfile } from "../../../../lib/db/organizers";

export async function GET() {
  try {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const organizer = await getOrganizerProfile(userProfile.id);
    return NextResponse.json({
      organizer: organizer || {
        business_name: userProfile.full_name || "Meu Negócio",
        document_number: userProfile.document || "",
        email: userProfile.email,
        id: userProfile.id,
        legal_type: "pf",
        verification_status: "pending"
      },
      profile: userProfile
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao consultar perfil do organizador." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const {
      businessName,
      tradeName,
      legalType,
      documentNumber,
      phone,
      bio,
      instagram,
      website,
      bankAccount,
      address
    } = body;

    const updated = await upsertOrganizerProfile(userProfile.id, {
      address,
      bank_account: bankAccount,
      bio,
      business_name: businessName,
      document_number: documentNumber,
      email: userProfile.email,
      instagram,
      legal_type: legalType === "company" || legalType === "pj" ? "pj" : "pf",
      phone,
      trade_name: tradeName,
      website
    });

    return NextResponse.json({
      message: "Perfil do organizador atualizado com sucesso.",
      organizer: updated
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao atualizar perfil do organizador." },
      { status: 500 }
    );
  }
}
