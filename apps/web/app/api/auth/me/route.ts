import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";
import { getCurrentUserProfile } from "../../../../lib/db/profiles";

export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        authenticated: true,
        profile: {
          avatar_url: null,
          email: "ana@email.com",
          full_name: "Ana Oliveira",
          id: "demo-user-id",
          role: "traveler"
        }
      });
    }

    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.json({ authenticated: false, profile: null });
    }

    const profile = await getCurrentUserProfile();
    return NextResponse.json({
      authenticated: true,
      profile,
      user
    });
  } catch (err: any) {
    return NextResponse.json(
      { authenticated: false, error: err?.message || "Erro ao consultar sessão." },
      { status: 500 }
    );
  }
}
