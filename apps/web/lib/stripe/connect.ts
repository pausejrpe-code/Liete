import { isStripeConfigured, stripeApiRequest } from "./config";

export type StripeConnectAccountStatus = {
  chargesEnabled: boolean;
  detailsSubmitted: boolean;
  id: string;
  onboardingCompleted: boolean;
  payoutsEnabled: boolean;
};

export async function createConnectedAccount(options: {
  businessType?: "individual" | "company";
  email: string;
  organizerId: string;
}): Promise<string> {
  if (!isStripeConfigured()) {
    return `acct_demo_${Date.now()}`;
  }

  const account = await stripeApiRequest<{ id: string }>("accounts", {
    body: {
      business_profile: {
        mcc: "4722", // Travel agencies & tour operators
        url: "https://liete.com.br"
      },
      business_type: options.businessType || "individual",
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true }
      },
      country: "BR",
      default_currency: "brl",
      email: options.email,
      metadata: {
        organizer_id: options.organizerId
      },
      type: "express"
    },
    method: "POST"
  });

  return account.id;
}

export async function createAccountOnboardingLink(options: {
  accountId: string;
  refreshUrl: string;
  returnUrl: string;
}): Promise<string> {
  if (!isStripeConfigured()) {
    return `${options.returnUrl}?stripe_mock_completed=true`;
  }

  const link = await stripeApiRequest<{ url: string }>("account_links", {
    body: {
      account: options.accountId,
      collect: "eventually_due",
      refresh_url: options.refreshUrl,
      return_url: options.returnUrl,
      type: "account_onboarding"
    },
    method: "POST"
  });

  return link.url;
}

export async function getAccountStatus(accountId: string): Promise<StripeConnectAccountStatus> {
  if (!isStripeConfigured() || accountId.startsWith("acct_demo_")) {
    return {
      chargesEnabled: true,
      detailsSubmitted: true,
      id: accountId,
      onboardingCompleted: true,
      payoutsEnabled: true
    };
  }

  const account = await stripeApiRequest<{
    charges_enabled: boolean;
    details_submitted: boolean;
    id: string;
    payouts_enabled: boolean;
  }>(`accounts/${accountId}`);

  return {
    chargesEnabled: Boolean(account.charges_enabled),
    detailsSubmitted: Boolean(account.details_submitted),
    id: account.id,
    onboardingCompleted: Boolean(account.details_submitted && account.charges_enabled),
    payoutsEnabled: Boolean(account.payouts_enabled)
  };
}

export async function createExpressDashboardLink(accountId: string): Promise<string> {
  if (!isStripeConfigured() || accountId.startsWith("acct_demo_")) {
    return "https://dashboard.stripe.com";
  }

  const link = await stripeApiRequest<{ url: string }>(`accounts/${accountId}/login_links`, {
    method: "POST"
  });

  return link.url;
}
