import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "O e-mail é obrigatório." },
        { status: 400 }
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        message: "E-mail de recuperação enviado com sucesso."
      });
    }

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());

    if (error) {
      return NextResponse.json(
        { error: error.message || "Não foi possível enviar o e-mail de recuperação." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Instruções de redefinição de senha enviadas para o seu e-mail."
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro interno ao processar recuperação." },
      { status: 500 }
    );
  }
}
