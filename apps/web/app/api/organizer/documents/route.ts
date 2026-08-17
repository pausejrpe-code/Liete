import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "../../../../lib/supabase/config";
import { createSupabaseServerClient } from "../../../../lib/supabase/server";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const documentType = (formData.get("documentType") as string) || "identification";

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        document: {
          document_type: documentType,
          file_url: "https://placeholder-storage.supabase.co/kyc/doc-demo.pdf",
          id: `doc-${Date.now()}`,
          status: "in_review"
        },
        message: "Documento enviado com sucesso para análise."
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

    const { data: organizer } = await supabase
      .from("organizers")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!organizer) {
      return NextResponse.json({ error: "Perfil de organizador não encontrado." }, { status: 404 });
    }

    let fileUrl = "https://placeholder-storage.supabase.co/kyc/doc.pdf";

    if (file) {
      const fileExt = file.name.split(".").pop() || "pdf";
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("kyc-documents")
        .upload(fileName, buffer, {
          contentType: file.type || "application/pdf",
          upsert: true
        });

      if (!uploadError && uploadData) {
        fileUrl = uploadData.path;
      }
    }

    const { data: docRecord, error: docError } = await supabase
      .from("organizer_documents")
      .insert({
        document_type: documentType,
        file_url: fileUrl,
        organizer_id: organizer.id,
        status: "in_review"
      })
      .select()
      .single();

    if (docError) {
      return NextResponse.json(
        { error: docError.message || "Não foi possível registrar o documento." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      document: docRecord,
      message: "Documento enviado com sucesso para análise."
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro no envio do documento." },
      { status: 500 }
    );
  }
}
