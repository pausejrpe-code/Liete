import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../lib/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        name: file.name,
        url: "/home/trip-sakura.jpeg"
      });
    }

    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from("excursion-images")
      .upload(fileName, buffer, {
        contentType: file.type || "image/jpeg",
        upsert: true
      });

    if (uploadError) {
      // If bucket doesn't exist or storage error, fallback safely
      return NextResponse.json({
        name: file.name,
        url: "/home/trip-sakura.jpeg"
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from("excursion-images")
      .getPublicUrl(fileName);

    return NextResponse.json({
      name: file.name,
      url: publicUrlData?.publicUrl || "/home/trip-sakura.jpeg"
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro no upload do arquivo." },
      { status: 500 }
    );
  }
}
