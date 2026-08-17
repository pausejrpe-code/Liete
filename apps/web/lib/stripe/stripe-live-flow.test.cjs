const test = require("node:test");
const assert = require("node:assert/strict");
const { createHmac } = require("node:crypto");

function createSignedWebhookHeader(payload, secret, customTimestamp) {
  const timestamp = customTimestamp || Math.floor(Date.now() / 1000).toString();
  const signedPayload = `${timestamp}.${payload}`;
  const signature = createHmac("sha256", secret).update(signedPayload).digest("hex");
  return {
    header: `t=${timestamp},v1=${signature}`,
    timestamp
  };
}

function verifyStripeSignature(rawPayload, signatureHeader, webhookSecret) {
  if (!signatureHeader || !webhookSecret) return { isValid: false };
  try {
    const parts = signatureHeader.split(",");
    let timestamp = "";
    let signature = "";
    for (const part of parts) {
      const [key, value] = part.trim().split("=");
      if (key === "t") timestamp = value;
      if (key === "v1") signature = value;
    }
    if (!timestamp || !signature) return { isValid: false };
    const eventTime = parseInt(timestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    if (Math.abs(currentTime - eventTime) > 300) return { isValid: false };

    const signedPayload = `${timestamp}.${rawPayload}`;
    const hmac = createHmac("sha256", webhookSecret);
    hmac.update(signedPayload, "utf8");
    const expected = hmac.digest("hex");
    return {
      event: signature === expected ? JSON.parse(rawPayload) : undefined,
      isValid: signature === expected
    };
  } catch {
    return { isValid: false };
  }
}

test("Fluxo de Webhook Stripe & Idempotência", async (t) => {
  const webhookSecret = "whsec_test_secret_998877";
  const sessionPayload = JSON.stringify({
    id: "evt_checkout_completed_test",
    type: "checkout.session.completed",
    data: {
      object: {
        id: "cs_test_123456",
        client_reference_id: "ord-test-999",
        payment_status: "paid",
        metadata: {
          order_id: "ord-test-999",
          excursion_id: "exc-test-1",
          quantity: "2"
        }
      }
    }
  });

  await t.test("valida evento legítimo checkout.session.completed", () => {
    const { header } = createSignedWebhookHeader(sessionPayload, webhookSecret);
    const { isValid, event } = verifyStripeSignature(sessionPayload, header, webhookSecret);
    assert.equal(isValid, true);
    assert.equal(event?.type, "checkout.session.completed");
    assert.equal(event?.data?.object?.metadata?.order_id, "ord-test-999");
  });

  await t.test("rejeita evento expirado fora da janela de 5 minutos", () => {
    const oldTimestamp = (Math.floor(Date.now() / 1000) - 400).toString(); // 6m40s atrás
    const { header } = createSignedWebhookHeader(sessionPayload, webhookSecret, oldTimestamp);
    const { isValid } = verifyStripeSignature(sessionPayload, header, webhookSecret);
    assert.equal(isValid, false);
  });
});
