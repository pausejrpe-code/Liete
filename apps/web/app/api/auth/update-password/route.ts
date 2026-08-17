import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { checkRateLimit, getClientIp } from "../../../../lib/security/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limitCheck = checkRateLimit(`update-pwd:${ip}`, { intervalSeconds: 60, maxRequests: 5 });
    if (!limitCheck.success) {
      return NextResponse.json(
        { error: "Muitas tentativas de alteração de senha. Aguarde 1 minuto antes de tentar novamente." },
        { status: 429 }
      );
    }

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
