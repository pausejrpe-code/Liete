import { NextResponse } from "next/server";
import { getCurrentUserProfile } from "../../../../lib/db/profiles";
import { getOrganizerExcursions, createExcursion } from "../../../../lib/db/excursions";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function GET() {
  try {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const excursions = await getOrganizerExcursions(userProfile.id);
    return NextResponse.json({ excursions });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao consultar excursões do organizador." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userProfile = await getCurrentUserProfile();
    if (!userProfile) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      category = "natureza",
      departureCity,
      destination,
      departureDate,
      returnDate,
      capacity,
      minimumGroup,
      transportCost = 0,
      guideCost = 0,
      extraCost = 0,
      variableCostPerPerson = 0,
      desiredMargin = 0,
      summary,
      description,
      itinerary = [],
      included = [],
      notIncluded = [],
      boardingPoints = [],
      cancellationPolicy,
      imageUrl,
      gallery = []
    } = body;

    // Server-side validation
    if (!title || !departureCity || !destination || !departureDate || !capacity || !minimumGroup) {
      return NextResponse.json(
        { error: "Campos obrigatórios ausentes: título, cidades, data e capacidade." },
        { status: 400 }
      );
    }

    const numCapacity = Number(capacity);
    const numMinGroup = Number(minimumGroup);

    if (numCapacity <= 0 || numMinGroup <= 0 || numCapacity < numMinGroup) {
      return NextResponse.json(
        { error: "A capacidade total deve ser maior ou igual ao quórum mínimo de passageiros." },
        { status: 400 }
      );
    }

    // Mathematical pricing formula on server
    const totalFixedCosts = Number(transportCost) + Number(guideCost) + Number(extraCost);
    const calculatedPrice = Math.round(((totalFixedCosts + Number(desiredMargin)) / numMinGroup + Number(variableCostPerPerson)) * 100) / 100;

    const baseSlug = slugify(title);
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    const newExcursion = await createExcursion(userProfile.id, {
      boarding_points: boardingPoints.length ? boardingPoints : [`Embarque principal em ${departureCity}`],
      cancellation_policy: cancellationPolicy || "Cancelamento padrão da plataforma conforme antecedência da saída.",
      capacity: numCapacity,
      category,
      date: departureDate,
      date_iso: departureDate,
      departure_city: departureCity,
      description: description || summary || title,
      desired_margin: Number(desiredMargin),
      destination,
      destination_region: destination.includes(",") ? destination.split(",")[1]?.trim() : "Brasil",
      duration_label: departureDate === returnDate ? "Bate-volta" : "Fim de semana",
      duration_type: departureDate === returnDate ? "bate-volta" : "fim-de-semana",
      extra_cost: Number(extraCost),
      gallery: gallery.length ? gallery : ["/home/trip-sakura.jpeg"],
      guide_cost: Number(guideCost),
      image_url: imageUrl || "/home/trip-sakura.jpeg",
      included: included.length ? included : ["Transporte executivo", "Guia acompanhante", "Seguro viagem"],
      is_featured: true,
      itinerary: Array.isArray(itinerary) && itinerary.length ? itinerary : [
        { description: `Saída de ${departureCity}`, time: "06:00", title: "Embarque" },
        { description: `Chegada e atividades em ${destination}`, time: "09:30", title: "Passeio" },
        { description: `Retorno para ${departureCity}`, time: "18:00", title: "Retorno" }
      ],
      minimum_group: numMinGroup,
      not_included: notIncluded.length ? notIncluded : ["Alimentação", "Despesas pessoais"],
      price_per_seat: calculatedPrice,
      rating: 5.0,
      return_date: returnDate || departureDate,
      slug: uniqueSlug,
      status: "available",
      summary: summary || description?.slice(0, 120) || title,
      title,
      transport_cost: Number(transportCost),
      variable_cost_per_person: Number(variableCostPerPerson)
    });

    return NextResponse.json({
      excursion: newExcursion,
      message: "Excursão criada e publicada com sucesso."
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Erro ao criar excursão." },
      { status: 500 }
    );
  }
}
