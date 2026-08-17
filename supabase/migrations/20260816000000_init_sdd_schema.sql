-- ============================================================================
-- LIETE PLATFORM — DATABASE SCHEMA & RLS MIGRATION
-- Migration: 20260816000000_init_sdd_schema.sql
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ENUMS & DOMAINS
-- ----------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('traveler', 'organizer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE legal_type AS ENUM ('pf', 'pj');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'in_review', 'verified', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE excursion_status AS ENUM ('draft', 'available', 'confirmed', 'sold_out', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payout_stage AS ENUM ('first_payout', 'final_payout');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payout_status AS ENUM ('pending', 'processing', 'paid', 'retained');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 2. TABLES
-- ----------------------------------------------------------------------------

-- PROFILES (Users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'traveler',
    phone TEXT,
    document TEXT,
    birth_date TEXT,
    city TEXT,
    state TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ORGANIZERS (Partner Profile)
CREATE TABLE IF NOT EXISTS public.organizers (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    trade_name TEXT,
    legal_type legal_type NOT NULL DEFAULT 'pf',
    document_number TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    bio TEXT,
    instagram TEXT,
    website TEXT,
    address JSONB DEFAULT '{}'::jsonb,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    stripe_account_id TEXT,
    stripe_charges_enabled BOOLEAN NOT NULL DEFAULT false,
    stripe_payouts_enabled BOOLEAN NOT NULL DEFAULT false,
    stripe_onboarding_completed BOOLEAN NOT NULL DEFAULT false,
    bank_account JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ORGANIZER DOCUMENTS
CREATE TABLE IF NOT EXISTS public.organizer_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES public.organizers(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    status verification_status NOT NULL DEFAULT 'in_review',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- EXCURSIONS
CREATE TABLE IF NOT EXISTS public.excursions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizer_id UUID NOT NULL REFERENCES public.organizers(id) ON DELETE CASCADE,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    description TEXT,
    category TEXT NOT NULL DEFAULT 'natureza',
    departure_city TEXT NOT NULL,
    destination TEXT NOT NULL,
    destination_region TEXT,
    date TEXT NOT NULL,
    date_iso TEXT NOT NULL,
    return_date TEXT,
    duration_type TEXT DEFAULT 'bate-volta',
    duration_label TEXT DEFAULT 'Bate-volta',
    capacity INTEGER NOT NULL CHECK (capacity > 0),
    minimum_group INTEGER NOT NULL CHECK (minimum_group > 0 AND minimum_group <= capacity),
    sold_seats INTEGER NOT NULL DEFAULT 0 CHECK (sold_seats >= 0),
    price_per_seat NUMERIC(10, 2) NOT NULL CHECK (price_per_seat > 0),
    transport_cost NUMERIC(10, 2) DEFAULT 0,
    guide_cost NUMERIC(10, 2) DEFAULT 0,
    extra_cost NUMERIC(10, 2) DEFAULT 0,
    variable_cost_per_person NUMERIC(10, 2) DEFAULT 0,
    desired_margin NUMERIC(10, 2) DEFAULT 0,
    image_url TEXT,
    gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
    boarding_points TEXT[] DEFAULT ARRAY[]::TEXT[],
    included TEXT[] DEFAULT ARRAY[]::TEXT[],
    not_included TEXT[] DEFAULT ARRAY[]::TEXT[],
    itinerary JSONB DEFAULT '[]'::jsonb,
    cancellation_policy TEXT,
    status excursion_status NOT NULL DEFAULT 'available',
    rating NUMERIC(3, 2) DEFAULT 5.00,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ORDERS (Bookings / Reservas)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    buyer_email TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    excursion_id UUID NOT NULL REFERENCES public.excursions(id) ON DELETE RESTRICT,
    organizer_id UUID NOT NULL REFERENCES public.organizers(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'BRL',
    stripe_checkout_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    payment_method TEXT DEFAULT 'card',
    payment_status order_payment_status NOT NULL DEFAULT 'pending',
    status order_status NOT NULL DEFAULT 'pending',
    voucher_code TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ORDER PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.order_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    document TEXT NOT NULL,
    birth_date TEXT,
    emergency_contact TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- PAYOUTS (Repasses Financeiros em 2 Etapas)
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    excursion_id UUID NOT NULL REFERENCES public.excursions(id) ON DELETE RESTRICT,
    organizer_id UUID NOT NULL REFERENCES public.organizers(id) ON DELETE RESTRICT,
    stage payout_stage NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    status payout_status NOT NULL DEFAULT 'pending',
    scheduled_date TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    stripe_transfer_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ----------------------------------------------------------------------------
-- 3. INDEXES
-- ----------------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_excursions_organizer_id ON public.excursions(organizer_id);
CREATE INDEX IF NOT EXISTS idx_excursions_status ON public.excursions(status);
CREATE INDEX IF NOT EXISTS idx_excursions_slug ON public.excursions(slug);
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id ON public.orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_excursion_id ON public.orders(excursion_id);
CREATE INDEX IF NOT EXISTS idx_orders_organizer_id ON public.orders(organizer_id);
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session ON public.orders(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_payouts_organizer_id ON public.payouts(organizer_id);
CREATE INDEX IF NOT EXISTS idx_payouts_excursion_id ON public.payouts(excursion_id);

-- ----------------------------------------------------------------------------
-- 4. TRIGGERS & AUTOMATIONS
-- ----------------------------------------------------------------------------

-- Automatic updated_at timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_organizers_updated_at BEFORE UPDATE ON public.organizers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_excursions_updated_at BEFORE UPDATE ON public.excursions FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER tr_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Automatic user profile creation on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'traveler'::public.user_role)
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Automatic excursion seats update on order payment
CREATE OR REPLACE FUNCTION public.handle_order_payment_completed()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.payment_status = 'paid' AND (OLD.payment_status IS NULL OR OLD.payment_status != 'paid') THEN
        -- Increment sold seats
        UPDATE public.excursions
        SET sold_seats = sold_seats + NEW.quantity,
            status = CASE
                WHEN (sold_seats + NEW.quantity) >= capacity THEN 'sold_out'::public.excursion_status
                WHEN (sold_seats + NEW.quantity) >= minimum_group AND status = 'available' THEN 'confirmed'::public.excursion_status
                ELSE status
            END
        WHERE id = NEW.excursion_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_order_payment_completed
    AFTER UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_order_payment_completed();

-- ----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES & PERMISSIONS
-- ----------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.excursions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;

-- GRANTS FOR SUPABASE ROLES
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ORGANIZERS POLICIES
CREATE POLICY "Public can view verified or active organizers"
    ON public.organizers FOR SELECT USING (true);

CREATE POLICY "Organizers can insert/update their own profile"
    ON public.organizers FOR ALL USING (auth.uid() = id);

-- EXCURSIONS POLICIES
CREATE POLICY "Public can view published excursions"
    ON public.excursions FOR SELECT
    USING (status IN ('available', 'confirmed', 'sold_out') OR auth.uid() = organizer_id);

CREATE POLICY "Organizers can create excursions"
    ON public.excursions FOR INSERT
    WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their own excursions"
    ON public.excursions FOR UPDATE
    USING (auth.uid() = organizer_id);

CREATE POLICY "Organizers can delete their own excursions"
    ON public.excursions FOR DELETE
    USING (auth.uid() = organizer_id);

-- ORDERS POLICIES
CREATE POLICY "Buyers can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = buyer_id OR auth.uid() = organizer_id);

CREATE POLICY "Buyers can create pending orders"
    ON public.orders FOR INSERT
    WITH CHECK (auth.uid() = buyer_id OR buyer_id IS NULL);

-- ORDER PARTICIPANTS POLICIES
CREATE POLICY "Buyers and organizers can view order participants"
    ON public.order_participants FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            WHERE o.id = order_participants.order_id
            AND (o.buyer_id = auth.uid() OR o.organizer_id = auth.uid())
        )
    );

CREATE POLICY "Allow participant insertion on order creation"
    ON public.order_participants FOR INSERT
    WITH CHECK (true);

-- PAYOUTS POLICIES
CREATE POLICY "Organizers can view their own payouts"
    ON public.payouts FOR SELECT
    USING (auth.uid() = organizer_id);
