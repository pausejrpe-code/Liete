import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabasePublicConfig } from "./config";

/**
 * Cliente para Route Handlers e Server Actions, onde cookies podem ser gravados.
 * O fluxo de autenticação deverá adicionar o proxy de renovação de sessão.
 */
export async function createSupabaseServerClient() {
  const { publishableKey, url } = getSupabasePublicConfig();
  const cookieStore = await cookies();

  return createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, options, value }) => {
          cookieStore.set(name, value, options);
        });
      }
    }
  });
}
