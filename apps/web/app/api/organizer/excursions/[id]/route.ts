import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "../../../../../lib/db/profiles";
import { getExcursionById, updateExcursion } from "../../../../../lib/db/excursions";
import { isSupabaseConfigured } from "../../../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../../../lib/supabase/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const excursion = await getExcursionById(id);
    if (!excursion) {
      return NextResponse.json({ error: "Excursão não encontrada." }, { status: 404 });
    }

    // Ownership check (IDOR Protection)
    if (excursion.organizer_id !== userProfile.id && excursion.organizer_id !== "organizer-demo-id") {
      return NextResponse.json({ error: "Acesso não autorizado a este recurso." }, { status: 403 });
    }

    return NextResponse.json({ excursion });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao consultar excursão." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const excursion = await getExcursionById(id);
    if (!excursion) {
      return NextResponse.json({ error: "Excursão não encontrada." }, { status: 404 });
    }

    // Ownership check (IDOR Protection)
    if (excursion.organizer_id !== userProfile.id && excursion.organizer_id !== "organizer-demo-id") {
      return NextResponse.json({ error: "Acesso não autorizado a este recurso." }, { status: 403 });
    }

    const updated = await updateExcursion(id, userProfile.id, body);
    return NextResponse.json({
      excursion: updated,
      message: "Excursão atualizada com sucesso."
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao atualizar excursão." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const excursion = await getExcursionById(id);
    if (!excursion) {
      return NextResponse.json({ error: "Excursão não encontrada." }, { status: 404 });
    }

    // Ownership check (IDOR Protection)
    if (excursion.organizer_id !== userProfile.id && excursion.organizer_id !== "organizer-demo-id") {
      return NextResponse.json({ error: "Acesso não autorizado a este recurso." }, { status: 403 });
    }

    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseServerClient();
      await supabase.from("excursions").delete().eq("id", id).eq("organizer_id", userProfile.id);
    }

    return NextResponse.json({ message: "Excursão removida com sucesso." });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao excluir excursão." },
      { status: 500 }
    );
  }
}
