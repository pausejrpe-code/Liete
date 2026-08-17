export type UserRole = "traveler" | "organizer" | "admin";
export type LegalType = "pf" | "pj";
export type VerificationStatus = "pending" | "in_review" | "verified" | "rejected";
export type ExcursionStatus = "draft" | "available" | "confirmed" | "sold_out" | "cancelled";
export type OrderPaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type OrderStatus = "pending" | "confirmed" | "cancelled";
export type PayoutStage = "first_payout" | "final_payout";
export type PayoutStatus = "pending" | "processing" | "paid" | "retained";

export type ProfileRecord = {
  avatar_url?: string | null;
  birth_date?: string | null;
  city?: string | null;
  created_at: string;
  document?: string | null;
  email: string;
  full_name: string | null;
  id: string;
  phone?: string | null;
  role: UserRole;
  state?: string | null;
  updated_at: string;
};

export type OrganizerRecord = {
  address?: Record<string, unknown> | null;
  bank_account?: {
    account?: string;
    agency?: string;
    bank?: string;
    pixKey?: string;
  } | null;
  bio?: string | null;
  business_name: string;
  created_at: string;
  document_number: string;
  email: string;
  id: string;
  instagram?: string | null;
  legal_type: LegalType;
  phone?: string | null;
  stripe_account_id?: string | null;
  stripe_charges_enabled: boolean;
  stripe_onboarding_completed: boolean;
  stripe_payouts_enabled: boolean;
  trade_name?: string | null;
  updated_at: string;
  verification_status: VerificationStatus;
  website?: string | null;
};

export type OrganizerDocumentRecord = {
  created_at: string;
  document_type: string;
  file_url: string;
  id: string;
  organizer_id: string;
  status: VerificationStatus;
  updated_at: string;
};

export type ExcursionRecord = {
  boarding_points: string[];
  cancellation_policy?: string | null;
  capacity: number;
  category: string;
  created_at: string;
  date: string;
  date_iso: string;
  departure_city: string;
  description?: string | null;
  desired_margin: number;
  destination: string;
  destination_region?: string | null;
  duration_label: string;
  duration_type: string;
  extra_cost: number;
  gallery: string[];
  guide_cost: number;
  id: string;
  image_url?: string | null;
  included: string[];
  is_featured: boolean;
  itinerary: Array<{ description: string; time: string; title: string }>;
  minimum_group: number;
  not_included: string[];
  organizer_id: string;
  price_per_seat: number;
  rating: number;
  return_date?: string | null;
  slug: string;
  sold_seats: number;
  status: ExcursionStatus;
  summary?: string | null;
  title: string;
  transport_cost: number;
  updated_at: string;
  variable_cost_per_person: number;
};

export type OrderParticipantRecord = {
  birth_date?: string | null;
  created_at: string;
  document: string;
  emergency_contact?: string | null;
  full_name: string;
  id: string;
  order_id: string;
};

export type OrderRecord = {
  buyer_email: string;
  buyer_id?: string | null;
  buyer_name: string;
  created_at: string;
  currency: string;
  excursion_id: string;
  excursions?: ExcursionRecord;
  id: string;
  organizer_id: string;
  participants?: OrderParticipantRecord[];
  payment_method: string;
  payment_status: OrderPaymentStatus;
  quantity: number;
  status: OrderStatus;
  stripe_checkout_session_id?: string | null;
  stripe_payment_intent_id?: string | null;
  total_amount: number;
  unit_price: number;
  updated_at: string;
  voucher_code?: string | null;
};

export type PayoutRecord = {
  amount: number;
  created_at: string;
  excursion_id: string;
  id: string;
  organizer_id: string;
  paid_at?: string | null;
  scheduled_date?: string | null;
  stage: PayoutStage;
  status: PayoutStatus;
  stripe_transfer_id?: string | null;
};
