import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "../../../../../lib/db/profiles";
import { getOrganizerProfile, upsertOrganizerProfile } from "../../../../../lib/db/organizers";
import { createConnectedAccount, createAccountOnboardingLink } from "../../../../../lib/stripe/connect";

export async function POST(request: Request) {
  try {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const host = request.headers.get("origin") || request.headers.get("host") || "http://localhost:3000";
    const origin = host.startsWith("http") ? host : `http://${host}`;

    let organizer = await getOrganizerProfile(userProfile.id);
    let stripeAccountId = organizer?.stripe_account_id;

    if (!stripeAccountId) {
      stripeAccountId = await createConnectedAccount({
        businessType: organizer?.legal_type === "pj" ? "company" : "individual",
        email: userProfile.email,
        organizerId: userProfile.id
      });

      await upsertOrganizerProfile(userProfile.id, {
        stripe_account_id: stripeAccountId
      });
    }

    const onboardingUrl = await createAccountOnboardingLink({
      accountId: stripeAccountId,
      refreshUrl: `${origin}/organizador/perfil/?stripe_refresh=true`,
      returnUrl: `${origin}/organizador/perfil/?stripe_connected=true`
    });

    return NextResponse.json({
      accountId: stripeAccountId,
      url: onboardingUrl
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao gerar link de onboarding Stripe Connect." },
      { status: 500 }
    );
  }
}
