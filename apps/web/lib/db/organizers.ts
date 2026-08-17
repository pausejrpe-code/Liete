import { isSupabaseConfigured } from "../supabase/config";
import { createSupabaseServerClient } from "../supabase/server";
import type { OrganizerRecord, VerificationStatus } from "./types";

export async function getOrganizerProfile(organizerId: string): Promise<OrganizerRecord | null> {
  if (!isSupabaseConfigured()) {
    return {
      address: { city: "São Paulo", state: "SP" },
      bank_account: {
        account: "12345-6",
        agency: "0001",
        bank: "Nubank",
        pixKey: "contato@rotaserra.tur.br"
      },
      bio: "Especialista em turismo de natureza, ecoturismo e viagens de bate-volta em São Paulo e Minas Gerais.",
      business_name: "Rota Serra Turismo",
      created_at: new Date().toISOString(),
      document_number: "12.345.678/0001-90",
      email: "organizador@liete.demo",
      id: organizerId,
      instagram: "@rotaserratur",
      legal_type: "pj",
      phone: "(11) 98765-4321",
      stripe_account_id: null,
      stripe_charges_enabled: false,
      stripe_onboarding_completed: false,
      stripe_payouts_enabled: false,
      trade_name: "Rota Serra Viagens",
      updated_at: new Date().toISOString(),
      verification_status: "verified" as VerificationStatus,
      website: "https://rotaserra.tur.br"
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("organizers")
      .select("*")
      .eq("id", organizerId)
      .single();

    if (error || !data) return null;
    return data as OrganizerRecord;
  } catch {
    return null;
  }
}

export async function upsertOrganizerProfile(
  organizerId: string,
  payload: Partial<OrganizerRecord>
): Promise<OrganizerRecord> {
  if (!isSupabaseConfigured()) {
    return {
      business_name: payload.business_name || "Organizador Demo",
      created_at: new Date().toISOString(),
      document_number: payload.document_number || "000.000.000-00",
      email: payload.email || "organizador@liete.demo",
      id: organizerId,
      legal_type: payload.legal_type || "pf",
      stripe_charges_enabled: payload.stripe_charges_enabled ?? false,
      stripe_onboarding_completed: payload.stripe_onboarding_completed ?? false,
      stripe_payouts_enabled: payload.stripe_payouts_enabled ?? false,
      updated_at: new Date().toISOString(),
      verification_status: payload.verification_status || "pending",
      ...payload
    } as OrganizerRecord;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("organizers")
    .upsert({
      id: organizerId,
      ...payload,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Não foi possível salvar os dados do organizador.");
  }

  return data as OrganizerRecord;
}
