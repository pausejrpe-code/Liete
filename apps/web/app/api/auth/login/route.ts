import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabasePublicConfig } from "../../../../lib/supabase/config";
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
    let authRes = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    // Se o Supabase reclamar que o e-mail não foi confirmado, auto-confirmamos na hora via Admin API
    if (authRes.error && (authRes.error.message.includes("Email not confirmed") || authRes.error.message.includes("not confirmed"))) {
      const { url } = getSupabasePublicConfig();
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (serviceRoleKey) {
        // Busca o ID do usuário pelo e-mail
        const usersRes = await fetch(`${url}/auth/v1/admin/users`, {
          headers: {
            "apikey": serviceRoleKey,
            "Authorization": `Bearer ${serviceRoleKey}`
          }
        });
        const usersData = await usersRes.json();
        const foundUser = usersData.users?.find((u: any) => u.email === normalizedEmail);

        if (foundUser?.id) {
          // Confirma o e-mail
          await fetch(`${url}/auth/v1/admin/users/${foundUser.id}`, {
            method: "PUT",
            headers: {
              "apikey": serviceRoleKey,
              "Authorization": `Bearer ${serviceRoleKey}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ email_confirm: true })
          });

          // Tenta logar novamente
          authRes = await supabase.auth.signInWithPassword({
            email: normalizedEmail,
            password
          });
        }
      }
    }

    if (authRes.error) {
      return NextResponse.json(
        { error: "E-mail ou senha incorretos. Verifique suas credenciais." },
        { status: 401 }
      );
    }

    if (!authRes.data.user) {
      return NextResponse.json(
        { error: "Não foi possível autenticar o usuário." },
        { status: 401 }
      );
    }

    // Fetch user profile to verify role
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authRes.data.user.id)
      .single();

    return NextResponse.json({
      profile,
      user: authRes.data.user
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro interno ao processar login." },
      { status: 500 }
    );
  }
}
