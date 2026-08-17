import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "../../../../../lib/db/profiles";
import { getOrganizerProfile, upsertOrganizerProfile } from "../../../../../lib/db/organizers";
import { getAccountStatus, createExpressDashboardLink } from "../../../../../lib/stripe/connect";

export async function GET() {
  try {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const organizer = await getOrganizerProfile(userProfile.id);
    if (!organizer?.stripe_account_id) {
      return NextResponse.json({
        chargesEnabled: false,
        connected: false,
        onboardingCompleted: false,
        payoutsEnabled: false
      });
    }

    const status = await getAccountStatus(organizer.stripe_account_id);

    // Sync status into database
    await upsertOrganizerProfile(userProfile.id, {
      stripe_charges_enabled: status.chargesEnabled,
      stripe_onboarding_completed: status.onboardingCompleted,
      stripe_payouts_enabled: status.payoutsEnabled,
      verification_status: status.onboardingCompleted ? "verified" : organizer.verification_status
    });

    let dashboardUrl: string | null = null;
    if (status.onboardingCompleted) {
      try {
        dashboardUrl = await createExpressDashboardLink(organizer.stripe_account_id);
      } catch {
        dashboardUrl = null;
      }
    }

    return NextResponse.json({
      ...status,
      connected: true,
      dashboardUrl
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao consultar status da Stripe." },
      { status: 500 }
    );
  }
}
