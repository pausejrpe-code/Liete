import { createHmac, timingSafeEqual } from "node:crypto";
import { getStripeConfig } from "./config";

export type StripeWebhookEvent<T = any> = {
  created: number;
  data: {
    object: T;
  };
  id: string;
  type: string;
};

/**
 * Validação criptográfica do header `stripe-signature` usando HMAC SHA-256 nativo do Node.js.
 */
export function verifyStripeWebhookSignature(
  rawPayload: string,
  signatureHeader: string | null
): { event?: StripeWebhookEvent; isValid: boolean } {
  const { webhookSecret } = getStripeConfig();
  if (!webhookSecret || !signatureHeader) {
    return { isValid: false };
  }

  try {
    const parts = signatureHeader.split(",");
    let timestamp = "";
    let signature = "";

    for (const part of parts) {
      const [key, value] = part.trim().split("=");
      if (key === "t") timestamp = value;
      if (key === "v1") signature = value;
    }

    if (!timestamp || !signature) {
      return { isValid: false };
    }

    // Check tolerance (5 minutes)
    const eventTime = parseInt(timestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - eventTime) > 300) {
      return { isValid: false };
    }

    const signedPayload = `${timestamp}.${rawPayload}`;
    const hmac = createHmac("sha256", webhookSecret);
    hmac.update(signedPayload, "utf8");
    const expectedSignature = hmac.digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const actualBuffer = Buffer.from(signature, "utf8");

    if (expectedBuffer.length !== actualBuffer.length) {
      return { isValid: false };
    }

    const isValid = timingSafeEqual(expectedBuffer, actualBuffer);
    if (!isValid) {
      return { isValid: false };
    }

    const event = JSON.parse(rawPayload) as StripeWebhookEvent;
    return { event, isValid: true };
  } catch {
    return { isValid: false };
  }
}
