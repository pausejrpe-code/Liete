export type StripeConfig = {
  feePercent: number;
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
};

export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return Boolean(
    key &&
    (key.startsWith("sk_test_") || key.startsWith("sk_live_")) &&
    !key.includes("placeholder") &&
    !key.includes("substitua_aqui")
  );
}

export function getStripeConfig(): StripeConfig {
  return {
    feePercent: Number(process.env.PLATFORM_FEE_PERCENT || 0),
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    secretKey: process.env.STRIPE_SECRET_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || ""
  };
}

/**
 * Utilitário HTTP para chamadas REST seguras à API da Stripe (v1),
 * sem dependência de módulos binários externos.
 */
export async function stripeApiRequest<T = any>(
  endpoint: string,
  options: {
    body?: Record<string, string | number | boolean | undefined | null | Record<string, any>>;
    formUrlEncoded?: boolean;
    idempotencyKey?: string;
    method?: "GET" | "POST" | "DELETE";
    stripeAccount?: string;
  } = {}
): Promise<T> {
  const { secretKey } = getStripeConfig();
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY não configurada no ambiente.");
  }

  const url = `https://api.stripe.com/v1${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${secretKey}`
  };

  if (options.stripeAccount) {
    headers["Stripe-Account"] = options.stripeAccount;
  }
  if (options.idempotencyKey) {
    headers["Idempotency-Key"] = options.idempotencyKey;
  }

  let requestBody: string | undefined;

  if (options.method === "POST" && options.body) {
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    const params = new URLSearchParams();

    function flatten(obj: Record<string, any>, prefix = "") {
      for (const [key, value] of Object.entries(obj)) {
        if (value === undefined || value === null) continue;
        const paramKey = prefix ? `${prefix}[${key}]` : key;
        if (typeof value === "object" && !Array.isArray(value)) {
          flatten(value, paramKey);
        } else if (Array.isArray(value)) {
          value.forEach((v, i) => {
            if (typeof v === "object") {
              flatten(v, `${paramKey}[${i}]`);
            } else {
              params.append(`${paramKey}[${i}]`, String(v));
            }
          });
        } else {
          params.append(paramKey, String(value));
        }
      }
    }

    flatten(options.body);
    requestBody = params.toString();
  }

  const response = await fetch(url, {
    body: requestBody,
    headers,
    method: options.method || "GET"
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data?.error?.message || `Erro na API da Stripe: ${response.statusText}`;
    throw new Error(errorMsg);
  }

  return data as T;
}
