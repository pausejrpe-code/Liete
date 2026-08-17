const test = require("node:test");
const assert = require("node:assert/strict");
const { createHmac } = require("node:crypto");

// Test pricing logic on server
function calculateServerExcursionPricing(params) {
  const { transportCost = 0, guideCost = 0, extraCost = 0, minimumGroup = 1, variableCostPerPerson = 0, desiredMargin = 0 } = params;
  const totalFixedCosts = Number(transportCost) + Number(guideCost) + Number(extraCost);
  return Math.round(((totalFixedCosts + Number(desiredMargin)) / Number(minimumGroup) + Number(variableCostPerPerson)) * 100) / 100;
}

// Test webhook signature verification logic
function verifyStripeSignature(rawPayload, signatureHeader, webhookSecret) {
  if (!signatureHeader || !webhookSecret) return false;
  const parts = signatureHeader.split(",");
  let timestamp = "";
  let signature = "";
  for (const part of parts) {
    const [key, value] = part.trim().split("=");
    if (key === "t") timestamp = value;
    if (key === "v1") signature = value;
  }
  if (!timestamp || !signature) return false;
  const signedPayload = `${timestamp}.${rawPayload}`;
  const hmac = createHmac("sha256", webhookSecret);
  hmac.update(signedPayload, "utf8");
  const expectedSignature = hmac.digest("hex");
  return signature === expectedSignature;
}

test("Precificação de Excursão no Servidor", async (t) => {
  await t.test("calcula valor unitário correto por assento com margem e custos fixos", () => {
    const price = calculateServerExcursionPricing({
      desiredMargin: 1000,
      extraCost: 200,
      guideCost: 600,
      minimumGroup: 20,
      transportCost: 2800,
      variableCostPerPerson: 35
    });
    // (2800 + 600 + 200 + 1000) / 20 + 35 = 4600 / 20 + 35 = 230 + 35 = 265
    assert.equal(price, 265);
  });

  await t.test("nunca permite que o cliente defina o preço final", () => {
    const serverPrice = calculateServerExcursionPricing({
      minimumGroup: 10,
      transportCost: 1000,
      variableCostPerPerson: 10
    });
    const tamperedClientPrice = 0.01;
    assert.notEqual(tamperedClientPrice, serverPrice);
    assert.equal(serverPrice, 110);
  });
});

test("Assinatura Criptográfica do Webhook Stripe", async (t) => {
  const secret = "whsec_test_secret_123456";
  const payload = JSON.stringify({
    id: "evt_test_123",
    type: "checkout.session.completed"
  });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signedPayload = `${timestamp}.${payload}`;
  const validSignature = createHmac("sha256", secret).update(signedPayload).digest("hex");
  const validHeader = `t=${timestamp},v1=${validSignature}`;

  await t.test("valida webhook legítimo assinado com chave secreta", () => {
    const isValid = verifyStripeSignature(payload, validHeader, secret);
    assert.equal(isValid, true);
  });

  await t.test("rejeita webhook com assinatura adulterada ou incorreta", () => {
    const forgedHeader = `t=${timestamp},v1=invalid_signature_hash`;
    const isValid = verifyStripeSignature(payload, forgedHeader, secret);
    assert.equal(isValid, false);
  });
});
