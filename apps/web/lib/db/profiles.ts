import { isSupabaseConfigured } from "../supabase/config";
import { createSupabaseServerClient } from "../supabase/server";
import type { ProfileRecord, UserRole } from "./types";

export async function getCurrentUserProfile(): Promise<ProfileRecord | null> {
  if (!isSupabaseConfigured()) {
    return {
      avatar_url: null,
      birth_date: "1992-05-14",
      city: "São Paulo",
      created_at: new Date().toISOString(),
      document: "123.456.789-00",
      email: "ana@email.com",
      full_name: "Ana Oliveira",
      id: "demo-user-id",
      phone: "(11) 99999-1010",
      role: "traveler",
      state: "SP",
      updated_at: new Date().toISOString()
    };
  }

  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError || !user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      // Create fallback profile if not found
      const newProfile: ProfileRecord = {
        avatar_url: user.user_metadata?.avatar_url || null,
        birth_date: null,
        city: null,
        created_at: new Date().toISOString(),
        document: null,
        email: user.email || "",
        full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuário",
        id: user.id,
        phone: null,
        role: (user.user_metadata?.role as UserRole) || "traveler",
        state: null,
        updated_at: new Date().toISOString()
      };
      await supabase.from("profiles").upsert(newProfile);
      return newProfile;
    }

    return profile as ProfileRecord;
  } catch {
    return null;
  }
}

export async function updateProfile(
  userId: string,
  updates: Partial<Omit<ProfileRecord, "id" | "email" | "created_at">>
): Promise<ProfileRecord> {
  if (!isSupabaseConfigured()) {
    return {
      created_at: new Date().toISOString(),
      email: "ana@email.com",
      full_name: updates.full_name || "Ana Oliveira",
      id: userId,
      role: updates.role || "traveler",
      updated_at: new Date().toISOString(),
      ...updates
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Não foi possível atualizar o perfil.");
  }

  return data as ProfileRecord;
}
