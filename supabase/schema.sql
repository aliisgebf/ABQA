-- ==============================================================================
-- ABAQ | عَبَق — Supabase PostgreSQL Schema & Security Policies (RLS)
-- Complete Arabic-First Multi-Brand Fragrance Retailer
-- ==============================================================================
-- CRITICAL RULES APPLIED:
-- 1. NO orders table or checkout logs (Checkout is direct manual WhatsApp message).
-- 2. Multi-brand architecture: Brands have their own identity, logo, and metadata.
-- 3. Public read-only access for active catalog items & public store settings.
-- 4. Authorized admin access for catalog management, storage, and settings.
-- 5. Row Level Security (RLS) enabled on all tables.
-- ==============================================================================

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Store Settings Table
CREATE TABLE IF NOT EXISTS public.store_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_name_ar TEXT NOT NULL DEFAULT 'عَبَق للأطياب والبخور',
    store_name_en TEXT NOT NULL DEFAULT 'ABAQ Fine Fragrances',
    tagline_ar TEXT DEFAULT 'المتجر الجامع لنخبة دور العطور والعود الأصيل',
    tagline_en TEXT DEFAULT 'The multi-brand sanctuary of rare agarwood & niche fragrances',
    whatsapp_number TEXT NOT NULL DEFAULT '+967718488431',
    default_currency TEXT NOT NULL DEFAULT 'SAR',
    default_language TEXT NOT NULL DEFAULT 'ar',
    inventory_tracking_enabled BOOLEAN NOT NULL DEFAULT false,
    contact_email TEXT DEFAULT 'concierge@abaq-perfumes.com',
    contact_phone TEXT DEFAULT '+967718488431',
    address_ar TEXT DEFAULT 'صنعاء / الرياض — شحن لجميع مناطق الخليج واليمن',
    address_en TEXT DEFAULT 'Sana''a / Riyadh — GCC & Regional Delivery',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Admin Authorization Mapping Table (Linked to auth.users if Supabase Auth is enabled)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE, -- REFERENCES auth.users(id) ON DELETE CASCADE if Supabase Auth is active
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Brands Table (Independent Fragrance Houses)
CREATE TABLE IF NOT EXISTS public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description_ar TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    logo_url TEXT,
    banner_url TEXT,
    country_of_origin TEXT DEFAULT 'Saudi Arabia',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description_ar TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    image_url TEXT,
    parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT prevent_self_parent CHECK (id <> parent_id)
);

-- 6. Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES public.brands(id) ON DELETE RESTRICT,
    name_ar TEXT NOT NULL,
    name_en TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    description_ar TEXT DEFAULT '',
    description_en TEXT DEFAULT '',
    notes_top_ar TEXT DEFAULT '',
    notes_top_en TEXT DEFAULT '',
    notes_heart_ar TEXT DEFAULT '',
    notes_heart_en TEXT DEFAULT '',
    notes_base_ar TEXT DEFAULT '',
    notes_base_en TEXT DEFAULT '',
    price_sar NUMERIC(10, 2) NOT NULL CHECK (price_sar >= 0),
    compare_at_price_sar NUMERIC(10, 2) CHECK (compare_at_price_sar IS NULL OR compare_at_price_sar >= price_sar),
    primary_image_url TEXT NOT NULL,
    images TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    track_inventory BOOLEAN NOT NULL DEFAULT false,
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Product-Category Junction (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.product_categories (
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    PRIMARY KEY (product_id, category_id)
);

-- 8. Product Variants Table (Size, Weight, Volume, Concentrated Oil vs Spray)
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    name_ar TEXT NOT NULL, -- e.g. "50 مل", "100 مل", "تولة كاملة (12 غرام)"
    name_en TEXT NOT NULL, -- e.g. "50 ml", "100 ml", "1 Tola (12g)"
    sku TEXT UNIQUE NOT NULL,
    price_sar NUMERIC(10, 2) NOT NULL CHECK (price_sar >= 0),
    compare_at_price_sar NUMERIC(10, 2),
    stock_quantity INT DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active BOOLEAN NOT NULL DEFAULT true,
    sort_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Site Informational Content (About, Shipping, Returns, Privacy, Terms)
CREATE TABLE IF NOT EXISTS public.site_pages (
    slug TEXT PRIMARY KEY,
    title_ar TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_ar TEXT NOT NULL,
    content_en TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE & SEARCH
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active_featured ON public.brands(is_active, is_featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_active_featured ON public.products(is_active, is_featured, sort_order);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price_sar);
CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_categories_category ON public.product_categories(category_id);

-- Full-Text Search Indexes
CREATE INDEX IF NOT EXISTS idx_products_search_ar ON public.products USING gin(to_tsvector('arabic', name_ar || ' ' || coalesce(description_ar, '')));
CREATE INDEX IF NOT EXISTS idx_products_search_en ON public.products USING gin(to_tsvector('english', name_en || ' ' || coalesce(description_en, '')));

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_pages ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current Supabase Auth user is an active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.admin_users
        WHERE user_id = auth.uid() AND is_active = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Store Settings RLS
CREATE POLICY "Public can read store settings"
    ON public.store_settings FOR SELECT
    USING (true);

CREATE POLICY "Admins can update store settings"
    ON public.store_settings FOR ALL
    USING (public.is_admin());

-- 2. Admin Users RLS
CREATE POLICY "Only admins can view admin list"
    ON public.admin_users FOR SELECT
    USING (public.is_admin());

CREATE POLICY "Only super admins can modify admin list"
    ON public.admin_users FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.admin_users
            WHERE user_id = auth.uid() AND role = 'super_admin' AND is_active = true
        )
    );

-- 3. Brands RLS
CREATE POLICY "Public can view active brands"
    ON public.brands FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can insert/update/delete brands"
    ON public.brands FOR ALL
    USING (public.is_admin());

-- 4. Categories RLS
CREATE POLICY "Public can view active categories"
    ON public.categories FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage categories"
    ON public.categories FOR ALL
    USING (public.is_admin());

-- 5. Products RLS
CREATE POLICY "Public can view active products"
    ON public.products FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage products"
    ON public.products FOR ALL
    USING (public.is_admin());

-- 6. Product Categories RLS
CREATE POLICY "Public can view product categories"
    ON public.product_categories FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage product categories"
    ON public.product_categories FOR ALL
    USING (public.is_admin());

-- 7. Product Variants RLS
CREATE POLICY "Public can view active variants"
    ON public.product_variants FOR SELECT
    USING (is_active = true OR public.is_admin());

CREATE POLICY "Admins can manage product variants"
    ON public.product_variants FOR ALL
    USING (public.is_admin());

-- 8. Site Pages RLS
CREATE POLICY "Public can view site pages"
    ON public.site_pages FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage site pages"
    ON public.site_pages FOR ALL
    USING (public.is_admin());
