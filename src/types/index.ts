export interface Brand {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  logo_url?: string;
  banner_url?: string;
  country_of_origin?: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  description_ar: string;
  description_en: string;
  image_url?: string;
  parent_id?: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name_ar: string;
  name_en: string;
  sku: string;
  price_sar: number;
  compare_at_price_sar?: number | null;
  stock_quantity?: number;
  is_active: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  brand_id: string;
  name_ar: string;
  name_en: string;
  slug: string;
  sku: string;
  description_ar: string;
  description_en: string;
  notes_top_ar?: string;
  notes_top_en?: string;
  notes_heart_ar?: string;
  notes_heart_en?: string;
  notes_base_ar?: string;
  notes_base_en?: string;
  price_sar: number;
  compare_at_price_sar?: number | null;
  primary_image_url: string;
  images: string[];
  is_active: boolean;
  is_featured: boolean;
  track_inventory: boolean;
  stock_quantity?: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Joined or populated fields
  brand?: Brand;
  category_ids?: string[];
  categories?: Category[];
  variants?: ProductVariant[];
}

export interface StoreSettings {
  store_name_ar: string;
  store_name_en: string;
  tagline_ar: string;
  tagline_en: string;
  whatsapp_number: string;
  default_currency: string;
  default_language: 'ar' | 'en';
  inventory_tracking_enabled: boolean;
  contact_email: string;
  contact_phone: string;
  address_ar: string;
  address_en: string;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  // Snapshot for rendering in local storage
  product: Product;
  selectedVariant?: ProductVariant;
  storedPrice: number;
}

export interface VerifiedCartItem {
  productId: string;
  variantId?: string;
  productNameAr: string;
  productNameEn: string;
  brandNameAr: string;
  brandNameEn: string;
  variantNameAr?: string;
  variantNameEn?: string;
  sku: string;
  unitPriceSar: number;
  quantity: number;
  lineTotalSar: number;
  inStock: boolean;
  availableStock?: number;
}

export interface CartVerificationResult {
  verified: boolean;
  hasPriceDiscrepancy: boolean;
  discrepancies: Array<{
    productId: string;
    productTitle: string;
    oldPrice: number;
    newPrice: number;
  }>;
  items: VerifiedCartItem[];
  subtotalSar: number;
  currency: string;
  storeWhatsApp: string;
}

export interface CatalogFilterParams {
  query?: string;
  brandSlug?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'featured';
  page?: number;
  limit?: number;
}
