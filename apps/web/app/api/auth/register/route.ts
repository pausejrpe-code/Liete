import { NextResponse } from "next/server";
import { isSupabaseConfigured, getSupabasePublicConfig } from "../../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { checkRateLimit, getClientIp } from "../../../../lib/security/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limitCheck = checkRateLimit(`register:${ip}`, { intervalSeconds: 60, maxRequests: 5 });
    if (!limitCheck.success) {
      return NextResponse.json(
        { error: "Muitas tentativas de cadastro. Aguarde 1 minuto antes de tentar novamente." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password, fullName, role = "traveler", document, legalType = "pf", phone, businessName } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "E-mail e senha são obrigatórios." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "A senha deve conter ao menos 8 caracteres." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        message: "Cadastro realizado com sucesso.",
        profile: {
          document: document || null,
          email: normalizedEmail,
          full_name: fullName || "Novo Usuário",
          id: `usr-${Date.now()}`,
          role
        },
        user: { email: normalizedEmail, id: `usr-${Date.now()}` }
      });
    }

    const { url } = getSupabasePublicConfig();
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    let userId = "";

    // 1. Criação direta com email_confirm: true (sem envio de email de confirmação)
    if (serviceRoleKey) {
      const createRes = await fetch(`${url}/auth/v1/admin/users`, {
        method: "POST",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: normalizedEmail,
          password,
          email_confirm: true,
          user_metadata: {
            document,
            full_name: fullName,
            role
          }
        })
      });

      const adminData = await createRes.json();
      if (createRes.ok && adminData?.id) {
        userId = adminData.id;
      } else if (adminData?.message?.includes("already been registered") || adminData?.error?.includes("already")) {
        return NextResponse.json(
          { error: "Este e-mail já está cadastrado. Faça login para continuar." },
          { status: 400 }
        );
      }
    }

    // 2. Se não conseguiu criar via admin, tenta via signUp padrão
    const supabase = await createSupabaseServerClient();
    if (!userId) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: normalizedEmail,
        options: {
          data: {
            document,
            full_name: fullName,
            role
          }
        },
        password
      });

      if (authError) {
        return NextResponse.json(
          { error: authError.message || "Não foi possível criar a conta." },
          { status: 400 }
        );
      }

      if (authData.user) {
        userId = authData.user.id;
      }
    }

    // 3. Autentica e gera o cookie de sessão imediatamente
    await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password
    });

    // 4. Garante a criação do perfil em public.profiles
    if (serviceRoleKey && userId) {
      await fetch(`${url}/rest/v1/profiles`, {
        method: "POST",
        headers: {
          "apikey": serviceRoleKey,
          "Authorization": `Bearer ${serviceRoleKey}`,
          "Content-Type": "application/json",
          "Prefer": "resolution=merge-duplicates"
        },
        body: JSON.stringify({
          document: document || null,
          email: normalizedEmail,
          full_name: fullName || null,
          id: userId,
          phone: phone || null,
          role
        })
      });

      // Se for organizador, cria o registro na tabela organizers
      if (role === "organizer") {
        await fetch(`${url}/rest/v1/organizers`, {
          method: "POST",
          headers: {
            "apikey": serviceRoleKey,
            "Authorization": `Bearer ${serviceRoleKey}`,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
          },
          body: JSON.stringify({
            business_name: businessName || fullName || "Minha Agência de Turismo",
            document_number: document || "000.000.000-00",
            email: normalizedEmail,
            id: userId,
            legal_type: legalType === "pj" ? "pj" : "pf",
            phone: phone || null,
            verification_status: "pending",
            stripe_charges_enabled: false,
            stripe_payouts_enabled: false
          })
        });
      }
    }

    return NextResponse.json({
      message: "Conta criada e autenticada com sucesso.",
      userId
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro interno ao processar cadastro." },
      { status: 500 }
    );
  }
}
