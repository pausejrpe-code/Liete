const assert = require("node:assert/strict");
const test = require("node:test");
const {
  calculateExcursionPricing,
  emptyExcursionDraft,
  exampleExcursionDraft,
  parseBrazilianCurrency,
  validateJourneyStep
} = require("./excursion-draft.ts");

test("the complete example can reach review", () => {
  for (let step = 0; step <= 4; step += 1) {
    assert.deepEqual(
      validateJourneyStep(step, exampleExcursionDraft, 1),
      {}
    );
  }
});

test("the first step reports the required creation context", () => {
  const errors = validateJourneyStep(0, emptyExcursionDraft, 0);

  assert.equal(errors.title, "Informe o nome da excursão.");
  assert.equal(errors.category, "Selecione o tipo da excursão.");
  assert.ok(errors.summary);
  assert.ok(errors.description);
});

test("capacity cannot be smaller than the minimum group", () => {
  const errors = validateJourneyStep(
    3,
    {
      ...exampleExcursionDraft,
      capacity: 10,
      minimumParticipants: 15
    },
    1
  );

  assert.equal(
    errors.capacity,
    "A capacidade deve ser igual ou maior que o mínimo."
  );
});

test("Brazilian currency values are normalized for the pricing simulation", () => {
  assert.equal(parseBrazilianCurrency("R$ 1.249,90"), 1249.9);
  assert.equal(parseBrazilianCurrency("349,00"), 349);
  assert.equal(parseBrazilianCurrency(""), 0);
});

test("pricing is calculated automatically from costs, profit and minimum group", () => {
  const pricing = calculateExcursionPricing({
    cardFeeRate: "5,00",
    minimumParticipants: 30,
    minimumProfit: "1.500,00",
    perPersonCost: "150,00",
    transportCost: "6.000,00"
  });

  assert.equal(pricing.transportPerParticipant, 200);
  assert.equal(pricing.minimumProfitPerParticipant, 50);
  assert.equal(pricing.totalCostPerParticipant, 350);
  assert.equal(pricing.organizerBase, 400);
  assert.equal(pricing.cardFeeRate, 5);
  assert.equal(pricing.cardFee, 20);
  assert.equal(pricing.platformFee, 60);
  assert.equal(pricing.finalPrice, 480);
  assert.equal(pricing.minimumGrossRevenue, 14400);
  assert.equal(pricing.minimumOrganizerRevenue, 12000);
  assert.equal(pricing.minimumCardFeeRevenue, 600);
  assert.equal(pricing.minimumPlatformRevenue, 1800);
  assert.equal(pricing.minimumProfit, 1500);
});

test("pricing fields are required before continuing", () => {
  const errors = validateJourneyStep(3, emptyExcursionDraft, 1);

  assert.equal(
    errors.transportCost,
    "Informe o custo total do transporte."
  );
  assert.equal(
    errors.perPersonCost,
    "Informe o custo do passeio por participante."
  );
  assert.equal(
    errors.minimumProfit,
    "Informe o lucro mínimo total da excursão."
  );
});

test("destination, route and photos requires an image", () => {
  const errors = validateJourneyStep(1, exampleExcursionDraft, 0);

  assert.equal(
    errors.images,
    "Adicione pelo menos uma imagem principal."
  );
});
