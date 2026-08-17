import { NextResponse } from "next/server";
import { getCurrentUserProfile, updateProfile } from "../../../../lib/db/profiles";

export async function GET() {
  try {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    return NextResponse.json({ profile: userProfile });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao consultar perfil do viajante." },
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
    const { fullName, phone, document, birthDate, city, state } = body;

    const updated = await updateProfile(userProfile.id, {
      birth_date: birthDate,
      city,
      document,
      full_name: fullName,
      phone,
      state
    });

    return NextResponse.json({
      message: "Perfil atualizado com sucesso.",
      profile: updated
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao atualizar perfil do viajante." },
      { status: 500 }
    );
  }
}
