import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function POST() {
  try {
    if (isSupabaseConfigured()) {
      const supabase = await createSupabaseServerClient();
      await supabase.auth.signOut();
    }
    return NextResponse.json({ message: "Sessão encerrada com sucesso." });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao encerrar sessão." },
      { status: 500 }
    );
  }
}
