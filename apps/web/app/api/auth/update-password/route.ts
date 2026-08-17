import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== "string" || password.length < 8) {
      return NextResponse.json(
        { error: "A nova senha deve conter no mínimo 8 caracteres." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        message: "Senha alterada com sucesso."
      });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password
    });

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message || "Não foi possível atualizar a senha." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Senha atualizada com sucesso."
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro interno ao atualizar senha." },
      { status: 500 }
    );
  }
}
