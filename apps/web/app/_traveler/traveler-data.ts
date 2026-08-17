import type { StatusChipIntent, TripCardAvailability } from "@liete/ui-web";

export type TravelerExcursion = {
  availability: TripCardAvailability;
  boardingPoints: string[];
  cancellationPolicy: string;
  category: "aventura" | "cultural" | "natureza" | "praia";
  date: string;
  dateIso: string;
  departureCity: string;
  description: string;
  destination: string;
  duration: "4dias" | "bate-volta" | "fim-de-semana";
  durationLabel: string;
  gallery: string[];
  image: string;
  included: string[];
  itinerary: Array<{ description: string; time: string; title: string }>;
  notIncluded: string[];
  organizer: string;
  participantCount: number;
  price: number;
  rating: number;
  seats: number;
  slug: string;
  title: string;
  verified: boolean;
};

export type TravelerBookingStatus = "cancelled" | "past" | "upcoming";

export type TravelerBooking = {
  excursionSlug: string;
  id: string;
  orderDate: string;
  participants: Array<{
    birthDate: string;
    document: string;
    name: string;
  }>;
  paymentMethod: string;
  paymentStatus: string;
  status: TravelerBookingStatus;
  statusIntent: StatusChipIntent;
  statusLabel: string;
  total: number;
  tripDate?: string;
  voucherCode: string;
};

const commonGallery = [
  "/home/trip-sakura.jpeg",
  "/home/destination-capitolio.png",
  "/home/trip-mountains.jpeg",
  "/home/destination-arraial.jpeg",
  "/home/cta-mountains.jpeg"
];

export const travelerExcursions: TravelerExcursion[] = [
  {
    availability: "available",
    boardingPoints: [
      "Terminal Tietê — São Paulo, 05:30",
      "Posto Graal — Campinas, 07:00"
    ],
    cancellationPolicy:
      "Cancelamento integral até 7 dias após a compra. Depois desse prazo, o valor devolvido segue as condições e custos informados na reserva.",
    category: "cultural",
    date: "24 out 2026",
    dateIso: "2026-10-24",
    departureCity: "São Paulo",
    description:
      "Um dia entre flores, sabores e arquitetura holandesa, com transporte confortável e acompanhamento durante todo o passeio.",
    destination: "Holambra, SP",
    duration: "bate-volta",
    durationLabel: "Bate-volta",
    gallery: commonGallery,
    image: "/home/trip-sakura.jpeg",
    included: ["Transporte executivo", "Ingresso do evento", "Guia acompanhante", "Seguro viagem"],
    itinerary: [
      { description: "Encontro e conferência dos participantes.", time: "05:30", title: "Embarque em São Paulo" },
      { description: "Parada para café e segundo embarque.", time: "07:00", title: "Campinas" },
      { description: "Tempo livre, visita guiada e festival.", time: "09:00", title: "Experiência em Holambra" },
      { description: "Retorno previsto para o início da noite.", time: "17:30", title: "Viagem de volta" }
    ],
    notIncluded: ["Alimentação", "Compras pessoais", "Passeios opcionais"],
    organizer: "Rota Serra Turismo",
    participantCount: 48,
    price: 258.82,
    rating: 4.9,
    seats: 5,
    slug: "holambra-festival-flores",
    title: "Holambra e o festival das flores",
    verified: true
  },
  {
    availability: "available",
    boardingPoints: ["Praça da Liberdade — Belo Horizonte, 05:00"],
    cancellationPolicy: "Solicitações podem ser feitas pela área logada e serão analisadas conforme o prazo da viagem.",
    category: "natureza",
    date: "15 nov 2026",
    dateIso: "2026-11-15",
    departureCity: "Belo Horizonte",
    description: "Mirantes, cânions e navegação em um roteiro completo por Capitólio.",
    destination: "Capitólio, MG",
    duration: "bate-volta",
    durationLabel: "Bate-volta",
    gallery: ["/home/destination-capitolio.png", ...commonGallery.slice(1)],
    image: "/home/destination-capitolio.png",
    included: ["Transporte", "Passeio de lancha", "Guia acompanhante", "Seguro viagem"],
    itinerary: [
      { description: "Saída com parada técnica no caminho.", time: "05:00", title: "Embarque" },
      { description: "Passeio pelos principais atrativos do lago.", time: "10:00", title: "Lancha pelos cânions" },
      { description: "Tempo livre para almoço e mirantes.", time: "13:30", title: "Centro de Capitólio" }
    ],
    notIncluded: ["Almoço", "Bebidas", "Atividades opcionais"],
    organizer: "Bora Tour",
    participantCount: 36,
    price: 460,
    rating: 4.8,
    seats: 12,
    slug: "capitolio-bate-volta",
    title: "Capitólio bate-volta",
    verified: true
  },
  {
    availability: "available",
    boardingPoints: ["Terminal Novo Rio — Rio de Janeiro, 06:00"],
    cancellationPolicy: "Cancelamento solicitado pela área logada, sujeito às condições da reserva.",
    category: "praia",
    date: "29 nov 2026",
    dateIso: "2026-11-29",
    departureCity: "Rio de Janeiro",
    description: "Mar azul, passeio de barco e tempo livre nas praias de Arraial do Cabo.",
    destination: "Arraial do Cabo, RJ",
    duration: "bate-volta",
    durationLabel: "Bate-volta",
    gallery: ["/home/trip-coast.png", "/home/destination-arraial.jpeg", ...commonGallery.slice(2)],
    image: "/home/trip-coast.png",
    included: ["Transporte", "Passeio de barco", "Guia acompanhante"],
    itinerary: [
      { description: "Encontro no terminal e saída.", time: "06:00", title: "Embarque" },
      { description: "Roteiro pelas praias e ilhas.", time: "09:30", title: "Passeio de barco" },
      { description: "Tempo livre na Praia Grande.", time: "14:30", title: "Fim de tarde" }
    ],
    notIncluded: ["Alimentação", "Taxa ambiental"],
    organizer: "Trilha Viva",
    participantCount: 52,
    price: 329,
    rating: 4.7,
    seats: 4,
    slug: "arraial-do-cabo",
    title: "Arraial do Cabo bate-volta",
    verified: true
  },
  {
    availability: "available",
    boardingPoints: ["Rodoviária de São Luís, 05:30"],
    cancellationPolicy: "Cancelamento e estorno podem ser solicitados pela área logada.",
    category: "aventura",
    date: "05 dez 2026",
    dateIso: "2026-12-05",
    departureCity: "São Luís",
    description: "Quatro dias para viver lagoas, dunas e o pôr do sol dos Lençóis Maranhenses.",
    destination: "Barreirinhas, MA",
    duration: "4dias",
    durationLabel: "4 dias",
    gallery: ["/home/trip-desert.png", "/home/hero-road.jpeg", ...commonGallery.slice(1)],
    image: "/home/trip-desert.png",
    included: ["Transporte local", "3 diárias", "Café da manhã", "Passeios descritos"],
    itinerary: [
      { description: "Traslado até Barreirinhas.", time: "05:30", title: "Dia 1 — Chegada" },
      { description: "Circuito de lagoas em veículo 4x4.", time: "08:00", title: "Dia 2 — Lagoas" },
      { description: "Passeio pelo Rio Preguiças.", time: "08:30", title: "Dia 3 — Rio e vilarejos" }
    ],
    notIncluded: ["Passagem até São Luís", "Almoço e jantar", "Passeios opcionais"],
    organizer: "Viva Trip",
    participantCount: 28,
    price: 1290,
    rating: 4.9,
    seats: 8,
    slug: "lencois-maranhenses",
    title: "Dunas e lagoas dos Lençóis",
    verified: true
  },
  {
    availability: "sold-out",
    boardingPoints: ["Praça da Estação — Belo Horizonte, 06:00"],
    cancellationPolicy: "Cancelamento solicitado pela área logada.",
    category: "natureza",
    date: "12 dez 2026",
    dateIso: "2026-12-12",
    departureCity: "Belo Horizonte",
    description: "Trilhas, queijos artesanais e cachoeiras em um fim de semana na Serra da Canastra.",
    destination: "São Roque de Minas, MG",
    duration: "fim-de-semana",
    durationLabel: "Fim de semana",
    gallery: ["/home/trip-mountains.jpeg", ...commonGallery.slice(1)],
    image: "/home/trip-mountains.jpeg",
    included: ["Transporte", "Hospedagem", "Café da manhã", "Guia local"],
    itinerary: [{ description: "Roteiro pelas principais cachoeiras.", time: "07:00", title: "Serra da Canastra" }],
    notIncluded: ["Almoço", "Jantar"],
    organizer: "Bora Tour",
    participantCount: 40,
    price: 540,
    rating: 4.8,
    seats: 0,
    slug: "serra-da-canastra",
    title: "Serra e cachoeiras de Minas",
    verified: true
  },
  {
    availability: "available",
    boardingPoints: ["Terminal Barra Funda — São Paulo, 20:00"],
    cancellationPolicy: "Solicite cancelamento pela área logada para análise.",
    category: "natureza",
    date: "20 dez 2026",
    dateIso: "2026-12-20",
    departureCity: "São Paulo",
    description: "Um roteiro para conhecer as Cataratas e os principais atrativos de Foz do Iguaçu.",
    destination: "Foz do Iguaçu, PR",
    duration: "fim-de-semana",
    durationLabel: "Fim de semana",
    gallery: ["/home/destination-iguacu.jpeg", ...commonGallery.slice(0, 4)],
    image: "/home/destination-iguacu.jpeg",
    included: ["Transporte", "Hospedagem", "Café da manhã", "Guia"],
    itinerary: [{ description: "Visita ao Parque Nacional e tempo livre.", time: "09:00", title: "Cataratas do Iguaçu" }],
    notIncluded: ["Ingressos", "Alimentação"],
    organizer: "Rota Serra Turismo",
    participantCount: 44,
    price: 890,
    rating: 4.9,
    seats: 15,
    slug: "foz-do-iguacu",
    title: "Foz do Iguaçu em grupo",
    verified: true
  }
];

export const travelerBookings: TravelerBooking[] = [
  {
    excursionSlug: "holambra-festival-flores",
    id: "LIE-28491",
    orderDate: "02 ago 2026",
    participants: [
      { birthDate: "14/05/1992", document: "•••.456.789-••", name: "Ana Oliveira" },
      { birthDate: "22/09/1990", document: "•••.987.654-••", name: "Rafael Oliveira" }
    ],
    paymentMethod: "Cartão em 3x",
    paymentStatus: "Pagamento confirmado",
    status: "upcoming",
    statusIntent: "confirmed",
    statusLabel: "Confirmada",
    total: 517.64,
    voucherCode: "LIE28491HOL"
  },
  {
    excursionSlug: "capitolio-bate-volta",
    id: "LIE-27984",
    orderDate: "18 jul 2026",
    participants: [
      { birthDate: "14/05/1992", document: "•••.456.789-••", name: "Ana Oliveira" }
    ],
    paymentMethod: "Pix",
    paymentStatus: "Pagamento confirmado",
    status: "upcoming",
    statusIntent: "available",
    statusLabel: "Próxima",
    total: 460,
    voucherCode: "LIE27984CAP"
  },
  {
    excursionSlug: "arraial-do-cabo",
    id: "LIE-25016",
    orderDate: "05 mar 2026",
    participants: [
      { birthDate: "14/05/1992", document: "•••.456.789-••", name: "Ana Oliveira" }
    ],
    paymentMethod: "Cartão",
    paymentStatus: "Concluído",
    status: "past",
    statusIntent: "verified",
    statusLabel: "Realizada",
    total: 329,
    tripDate: "18 abr 2026",
    voucherCode: "LIE25016ARR"
  },
  {
    excursionSlug: "serra-da-canastra",
    id: "LIE-24102",
    orderDate: "11 jan 2026",
    participants: [
      { birthDate: "14/05/1992", document: "•••.456.789-••", name: "Ana Oliveira" }
    ],
    paymentMethod: "Pix",
    paymentStatus: "Estorno concluído",
    status: "cancelled",
    statusIntent: "cancelled",
    statusLabel: "Cancelada",
    total: 540,
    tripDate: "14 fev 2026",
    voucherCode: "LIE24102CAN"
  }
];

export function formatTravelerCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    minimumFractionDigits: 2,
    style: "currency"
  }).format(value);
}

export function recordToTravelerExcursion(record: any): TravelerExcursion {
  return {
    availability: record.status === "sold_out" ? "sold-out" : (record.status || "available"),
    boardingPoints: Array.isArray(record.boarding_points) ? record.boarding_points : ["Embarque central"],
    cancellationPolicy: record.cancellation_policy || "Cancelamento conforme política da plataforma.",
    category: record.category || "natureza",
    date: record.date || "Em breve",
    dateIso: record.date_iso || new Date().toISOString().slice(0, 10),
    departureCity: record.departure_city || "São Paulo",
    description: record.description || record.summary || "",
    destination: record.destination || "Destino",
    duration: record.duration_type || "bate-volta",
    durationLabel: record.duration_label || "Bate-volta",
    gallery: Array.isArray(record.gallery) && record.gallery.length ? record.gallery : [record.image_url || "/home/trip-sakura.jpeg"],
    image: record.image_url || "/home/trip-sakura.jpeg",
    included: Array.isArray(record.included) ? record.included : ["Transporte executivo", "Guia"],
    itinerary: Array.isArray(record.itinerary) ? record.itinerary : [],
    notIncluded: Array.isArray(record.not_included) ? record.not_included : ["Alimentação"],
    organizer: "Organizador parceiro",
    participantCount: record.sold_seats || 32,
    price: Number(record.price_per_seat || 0),
    rating: Number(record.rating || 5.0),
    seats: Math.max(0, (record.capacity || 48) - (record.sold_seats || 0)),
    slug: record.slug,
    title: record.title,
    verified: true
  };
}

export function getTravelerExcursion(slug: string) {
  return travelerExcursions.find((excursion) => excursion.slug === slug);
}

export function getTravelerBooking(id: string) {
  return travelerBookings.find((booking) => booking.id === id);
}

