import { isSupabaseConfigured } from "../supabase/config";
import { createSupabaseServerClient } from "../supabase/server";
import { travelerExcursions } from "../../app/_traveler/traveler-data";
import type { ExcursionRecord, ExcursionStatus } from "./types";

export function mapLegacyToRecord(item: (typeof travelerExcursions)[0], index: number): ExcursionRecord {
  return {
    boarding_points: item.boardingPoints,
    cancellation_policy: item.cancellationPolicy,
    capacity: 48,
    category: item.category,
    created_at: new Date().toISOString(),
    date: item.date,
    date_iso: item.dateIso,
    departure_city: item.departureCity,
    description: item.description,
    desired_margin: 50,
    destination: item.destination,
    destination_region: item.destination.includes(",") ? item.destination.split(",")[1]?.trim() : "Brasil",
    duration_label: item.durationLabel,
    duration_type: item.duration,
    extra_cost: 200,
    gallery: item.gallery,
    guide_cost: 600,
    id: `leg-exc-${index + 1}`,
    image_url: item.image,
    included: item.included,
    is_featured: index < 4,
    itinerary: item.itinerary,
    minimum_group: 20,
    not_included: item.notIncluded,
    organizer_id: "organizer-demo-id",
    price_per_seat: item.price,
    rating: item.rating,
    return_date: item.dateIso,
    slug: item.slug,
    sold_seats: Math.max(0, 48 - item.seats),
    status: item.availability as ExcursionStatus,
    summary: item.description.slice(0, 120),
    title: item.title,
    transport_cost: 2800,
    updated_at: new Date().toISOString(),
    variable_cost_per_person: 35
  };
}

export async function getPublishedExcursions(options?: {
  category?: string;
  destination?: string;
  limit?: number;
  featuredOnly?: boolean;
}): Promise<ExcursionRecord[]> {
  if (!isSupabaseConfigured()) {
    let list = travelerExcursions.map(mapLegacyToRecord);
    if (options?.category && options.category !== "todas") {
      list = list.filter((e) => e.category.toLowerCase() === options.category?.toLowerCase());
    }
    if (options?.destination) {
      const q = options.destination.toLowerCase();
      list = list.filter((e) => e.destination.toLowerCase().includes(q) || e.title.toLowerCase().includes(q));
    }
    if (options?.featuredOnly) {
      list = list.filter((e) => e.is_featured);
    }
    if (options?.limit) {
      list = list.slice(0, options.limit);
    }
    return list;
  }

  try {
    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from("excursions")
      .select("*")
      .in("status", ["available", "confirmed", "sold_out"])
      .order("created_at", { ascending: false });

    if (options?.category && options.category !== "todas") {
      query = query.eq("category", options.category);
    }
    if (options?.destination) {
      query = query.ilike("destination", `%${options.destination}%`);
    }
    if (options?.featuredOnly) {
      query = query.eq("is_featured", true);
    }
    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return travelerExcursions.map(mapLegacyToRecord);
    }

    return data as ExcursionRecord[];
  } catch {
    return travelerExcursions.map(mapLegacyToRecord);
  }
}

export async function getExcursionBySlug(slug: string): Promise<ExcursionRecord | null> {
  if (!isSupabaseConfigured()) {
    const found = travelerExcursions.find((e) => e.slug === slug);
    if (found) return mapLegacyToRecord(found, 0);
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("excursions")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error || !data) {
      const fallback = travelerExcursions.find((e) => e.slug === slug);
      return fallback ? mapLegacyToRecord(fallback, 0) : null;
    }

    return data as ExcursionRecord;
  } catch {
    const fallback = travelerExcursions.find((e) => e.slug === slug);
    return fallback ? mapLegacyToRecord(fallback, 0) : null;
  }
}

export async function getExcursionById(id: string): Promise<ExcursionRecord | null> {
  if (!isSupabaseConfigured()) {
    const found = travelerExcursions[0];
    return found ? mapLegacyToRecord(found, 0) : null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("excursions")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data as ExcursionRecord;
  } catch {
    return null;
  }
}

export async function getOrganizerExcursions(organizerId: string): Promise<ExcursionRecord[]> {
  if (!isSupabaseConfigured()) {
    return travelerExcursions.map(mapLegacyToRecord);
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("excursions")
      .select("*")
      .eq("organizer_id", organizerId)
      .order("created_at", { ascending: false });

    if (error || !data) {
      return travelerExcursions.map(mapLegacyToRecord);
    }
    return data as ExcursionRecord[];
  } catch {
    return travelerExcursions.map(mapLegacyToRecord);
  }
}

export async function createExcursion(
  organizerId: string,
  payload: Omit<ExcursionRecord, "id" | "created_at" | "updated_at" | "sold_seats" | "organizer_id">
): Promise<ExcursionRecord> {
  if (!isSupabaseConfigured()) {
    const mockRecord: ExcursionRecord = {
      ...payload,
      created_at: new Date().toISOString(),
      id: `exc-${Date.now()}`,
      organizer_id: organizerId,
      sold_seats: 0,
      updated_at: new Date().toISOString()
    };
    return mockRecord;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("excursions")
    .insert({
      ...payload,
      organizer_id: organizerId,
      sold_seats: 0
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Não foi possível criar a excursão.");
  }

  return data as ExcursionRecord;
}

export async function updateExcursion(
  id: string,
  organizerId: string,
  updates: Partial<ExcursionRecord>
): Promise<ExcursionRecord> {
  if (!isSupabaseConfigured()) {
    return {
      ...updates,
      id,
      organizer_id: organizerId
    } as ExcursionRecord;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("excursions")
    .update(updates)
    .eq("id", id)
    .eq("organizer_id", organizerId)
    .select()
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Não foi possível atualizar a excursão.");
  }

  return data as ExcursionRecord;
}
