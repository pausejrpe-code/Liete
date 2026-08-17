import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { checkRateLimit, getClientIp } from "../../../../lib/security/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limitCheck = checkRateLimit(`login:${ip}`, { intervalSeconds: 60, maxRequests: 10 });
    if (!limitCheck.success) {
      return NextResponse.json(
        { error: "Muitas tentativas de login. Aguarde 1 minuto antes de tentar novamente." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password, role = "traveler" } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        profile: {
          email: normalizedEmail,
          full_name: role === "organizer" ? "Organizador Rota Serra" : "Ana Oliveira",
          id: "demo-user-id",
          role
        },
        user: { email: normalizedEmail, id: "demo-user-id" }
      });
    }

    const supabase = await createSupabaseServerClient();
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    if (authError) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos. Verifique suas credenciais." },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: "Não foi possível autenticar o usuário." },
        { status: 401 }
      );
    }

    // Fetch user profile to verify role
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    return NextResponse.json({
      profile,
      user: authData.user
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro interno ao processar login." },
      { status: 500 }
    );
  }
}
