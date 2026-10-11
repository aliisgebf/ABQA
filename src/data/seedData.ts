import { Brand, Category, Product, StoreSettings } from '../types';

export const IS_DEMO_SEED_DATA = false;

export const INITIAL_STORE_SETTINGS: StoreSettings = {
  store_name_ar: 'عَبَق للأطياب والبخور',
  store_name_en: 'ABAQ Fine Fragrances',
  tagline_ar: 'المتجر الجامع لنخبة دور العطور الشرقية والعود الأصيل',
  tagline_en: 'The multi-brand sanctuary of rare agarwood & niche fragrances',
  whatsapp_number: '+967718488431',
  default_currency: 'SAR',
  default_language: 'ar',
  inventory_tracking_enabled: false,
  contact_email: 'concierge@abaq-perfumes.com',
  contact_phone: '+967718488431',
  address_ar: 'صنعاء / الرياض — شحن مباشر وموثوق لجميع مناطق اليمن والخليج العربي',
  address_en: "Sana'a / Riyadh — Direct delivery across Yemen & GCC",
  instagram_url: 'https://instagram.com/',
  tiktok_url: 'https://tiktok.com/',
  facebook_url: 'https://facebook.com/',
  offers: [],
};

// All demo items removed per user request: clean slate for live management
export const INITIAL_BRANDS: Brand[] = [];
export const INITIAL_CATEGORIES: Category[] = [];
export const INITIAL_PRODUCTS: Product[] = [];
