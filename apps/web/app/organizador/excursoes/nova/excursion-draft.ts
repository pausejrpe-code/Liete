export type ExcursionDraft = {
  boardingAddress: string;
  boardingPoint: string;
  capacity: number;
  cardFeeRate: string;
  category: string;
  departureDate: string;
  departureTime: string;
  description: string;
  destination: string;
  includedItems: string;
  itinerary: string;
  minimumParticipants: number;
  minimumProfit: string;
  origin: string;
  perPersonCost: string;
  returnDate: string;
  returnTime: string;
  summary: string;
  title: string;
  transportCost: string;
  cancellationPolicy: string;
  policyAccepted: boolean;
};

export type DraftField = keyof ExcursionDraft | "images";
export type DraftErrors = Partial<Record<DraftField, string>>;

export const journeySteps = [
  {
    description: "Nome, tipo e descrição da experiência.",
    heading: "Nova excursão",
    label: "Informações básicas"
  },
  {
    description: "Origem, destino e programação.",
    heading: "Destino, roteiro e fotos",
    label: "Destino, roteiro e fotos"
  },
  {
    description: "Quando acontece e onde embarcar.",
    heading: "Datas e embarque",
    label: "Datas e embarque"
  },
  {
    description: "Custos, lucro e cálculo automático do ingresso.",
    heading: "Preço e taxas",
    label: "Preço, taxas e capacidade"
  },
  {
    description: "Confira tudo antes de publicar.",
    heading: "Revisão",
    label: "Revisão"
  }
] as const;

export const emptyExcursionDraft: ExcursionDraft = {
  boardingAddress: "",
  boardingPoint: "",
  cancellationPolicy:
    "O viajante pode solicitar reembolso até 7 dias antes do embarque. O organizador não poderá cancelar voluntariamente após a excursão atingir o mínimo de participantes.",
  capacity: 30,
  cardFeeRate: "5,00",
  category: "",
  departureDate: "",
  departureTime: "",
  description: "",
  destination: "",
  includedItems: "",
  itinerary: "",
  minimumParticipants: 15,
  minimumProfit: "",
  origin: "",
  perPersonCost: "",
  policyAccepted: false,
  returnDate: "",
  returnTime: "",
  summary: "",
  title: "",
  transportCost: ""
};

export const exampleExcursionDraft: ExcursionDraft = {
  boardingAddress: "Praça Charles Miller, s/n — Pacaembu",
  boardingPoint: "São Paulo — Praça Charles Miller",
  cancellationPolicy:
    "O viajante pode solicitar reembolso até 7 dias antes do embarque. O organizador não poderá cancelar voluntariamente após a excursão atingir o mínimo de participantes.",
  capacity: 32,
  cardFeeRate: "5,00",
  category: "bate-volta",
  departureDate: "24/10/2026",
  departureTime: "06:00",
  description:
    "Um dia para conhecer Holambra durante a temporada de flores, com tempo livre no centro e visita aos principais campos da região.",
  destination: "Holambra, SP",
  includedItems:
    "Transporte executivo, guia acompanhante, ingresso para o parque e seguro viagem.",
  itinerary:
    "06:00 — embarque em São Paulo\n08:30 — chegada e café de boas-vindas\n10:00 — visita aos campos de flores\n13:00 — almoço e tempo livre\n18:00 — retorno para São Paulo",
  minimumParticipants: 30,
  minimumProfit: "1.500,00",
  origin: "São Paulo, SP",
  perPersonCost: "150,00",
  policyAccepted: true,
  returnDate: "24/10/2026",
  returnTime: "21:00",
  summary: "Bate-volta com transporte, guia e ingresso para o parque.",
  title: "Holambra e o festival das flores",
  transportCost: "6.000,00"
};

function required(value: string, message: string, errors: DraftErrors, field: DraftField) {
  if (!value.trim()) errors[field] = message;
}

export function parseBrazilianCurrency(value: string) {
  const normalized = value
    .replace(/[^\d,.]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const amount = Number(normalized);
  return Number.isFinite(amount) ? amount : 0;
}

export function formatBrazilianCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    style: "currency"
  }).format(value);
}

export const PLATFORM_FEE_RATE = 0.15;

export type ExcursionPricing = {
  cardFee: number;
  cardFeeRate: number;
  finalPrice: number;
  minimumCardFeeRevenue: number;
  minimumGrossRevenue: number;
  minimumOrganizerRevenue: number;
  minimumPlatformRevenue: number;
  minimumProfit: number;
  minimumProfitPerParticipant: number;
  organizerBase: number;
  passengerCost: number;
  platformFee: number;
  totalCostPerParticipant: number;
  transportCost: number;
  transportPerParticipant: number;
};

function roundCurrency(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateExcursionPricing(
  draft: Pick<
    ExcursionDraft,
    | "cardFeeRate"
    | "minimumParticipants"
    | "minimumProfit"
    | "perPersonCost"
    | "transportCost"
  >
): ExcursionPricing {
  const minimumParticipants = Math.max(0, draft.minimumParticipants);
  const transportCost = parseBrazilianCurrency(draft.transportCost);
  const passengerCost = parseBrazilianCurrency(draft.perPersonCost);
  const minimumProfit = parseBrazilianCurrency(draft.minimumProfit);
  const cardFeeRate = parseBrazilianCurrency(draft.cardFeeRate);
  const transportPerParticipant =
    minimumParticipants > 0
      ? roundCurrency(transportCost / minimumParticipants)
      : 0;
  const minimumProfitPerParticipant =
    minimumParticipants > 0
      ? roundCurrency(minimumProfit / minimumParticipants)
      : 0;
  const totalCostPerParticipant = roundCurrency(
    transportPerParticipant + passengerCost
  );
  const organizerBase = roundCurrency(
    totalCostPerParticipant + minimumProfitPerParticipant
  );
  const cardFee = roundCurrency(organizerBase * (cardFeeRate / 100));
  const platformFee = roundCurrency(organizerBase * PLATFORM_FEE_RATE);
  const finalPrice = roundCurrency(organizerBase + cardFee + platformFee);

  return {
    cardFee,
    cardFeeRate,
    finalPrice,
    minimumCardFeeRevenue: roundCurrency(cardFee * minimumParticipants),
    minimumGrossRevenue: roundCurrency(finalPrice * minimumParticipants),
    minimumOrganizerRevenue: roundCurrency(
      organizerBase * minimumParticipants
    ),
    minimumPlatformRevenue: roundCurrency(
      platformFee * minimumParticipants
    ),
    minimumProfit,
    minimumProfitPerParticipant,
    organizerBase,
    passengerCost,
    platformFee,
    totalCostPerParticipant,
    transportCost,
    transportPerParticipant
  };
}

export function validateJourneyStep(
  step: number,
  draft: ExcursionDraft,
  imageCount: number
) {
  const errors: DraftErrors = {};

  if (step === 0) {
    required(draft.title, "Informe o nome da excursão.", errors, "title");
    required(draft.category, "Selecione o tipo da excursão.", errors, "category");
    if (draft.summary.trim().length < 10) {
      errors.summary = "Escreva um resumo com pelo menos 10 caracteres.";
    }
    if (draft.description.trim().length < 30) {
      errors.description = "Descreva a experiência com pelo menos 30 caracteres.";
    }
  }

  if (step === 1) {
    required(draft.origin, "Informe a cidade de origem.", errors, "origin");
    required(draft.destination, "Informe o destino.", errors, "destination");
    if (draft.itinerary.trim().length < 20) {
      errors.itinerary = "Adicione um roteiro com pelo menos 20 caracteres.";
    }
    if (imageCount === 0) {
      errors.images = "Adicione pelo menos uma imagem principal.";
    }
  }

  if (step === 2) {
    required(draft.departureDate, "Informe a data de ida.", errors, "departureDate");
    required(draft.departureTime, "Informe o horário de saída.", errors, "departureTime");
    required(draft.returnDate, "Informe a data de retorno.", errors, "returnDate");
    required(draft.returnTime, "Informe o horário de retorno.", errors, "returnTime");
    required(draft.boardingPoint, "Informe o ponto de embarque.", errors, "boardingPoint");
    required(draft.boardingAddress, "Informe o endereço do embarque.", errors, "boardingAddress");
  }

  if (step === 3) {
    if (draft.minimumParticipants < 1) {
      errors.minimumParticipants = "O mínimo deve ser maior que zero.";
    }
    if (draft.capacity < draft.minimumParticipants) {
      errors.capacity = "A capacidade deve ser igual ou maior que o mínimo.";
    }
    if (parseBrazilianCurrency(draft.transportCost) <= 0) {
      errors.transportCost = "Informe o custo total do transporte.";
    }
    if (!draft.perPersonCost.trim()) {
      errors.perPersonCost = "Informe o custo do passeio por participante.";
    }
    if (parseBrazilianCurrency(draft.minimumProfit) <= 0) {
      errors.minimumProfit = "Informe o lucro mínimo total da excursão.";
    }
  }

  return errors;
}
