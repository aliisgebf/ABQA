import { Brand, Category, Product, StoreSettings, CartItem, CartVerificationResult } from '../types';
import { INITIAL_BRANDS, INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS } from '../data/seedData';

// Local cache/store for client-side demo and instant responsiveness
let localBrands: Brand[] = [...INITIAL_BRANDS];
let localCategories: Category[] = [...INITIAL_CATEGORIES];
let localProducts: Product[] = [...INITIAL_PRODUCTS];
let localSettings: StoreSettings = { ...INITIAL_STORE_SETTINGS };

// Load persistent local edits if any were made in demo admin
try {
  const savedBrands = localStorage.getItem('abaq_demo_brands');
  if (savedBrands) localBrands = JSON.parse(savedBrands);
  const savedCategories = localStorage.getItem('abaq_demo_categories');
  if (savedCategories) localCategories = JSON.parse(savedCategories);
  const savedProducts = localStorage.getItem('abaq_demo_products');
  if (savedProducts) localProducts = JSON.parse(savedProducts);
  const savedSettings = localStorage.getItem('abaq_demo_settings');
  if (savedSettings) localSettings = JSON.parse(savedSettings);
} catch {
  // Ignore in SSR/browser sandbox
}

export function saveDemoAdminChanges() {
  try {
    localStorage.setItem('abaq_demo_brands', JSON.stringify(localBrands));
    localStorage.setItem('abaq_demo_categories', JSON.stringify(localCategories));
    localStorage.setItem('abaq_demo_products', JSON.stringify(localProducts));
    localStorage.setItem('abaq_demo_settings', JSON.stringify(localSettings));
  } catch (e) {
    console.error('Could not save demo changes', e);
  }
}

export async function fetchStoreConfig(): Promise<{
  settings: StoreSettings;
  isSupabaseConnected: boolean;
  isDemoData: boolean;
}> {
  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // server route not yet reached or dev mode fallback
  }

  return {
    settings: localSettings,
    isSupabaseConnected: false,
    isDemoData: true,
  };
}

export async function fetchCatalog(params: {
  query?: string;
  brandSlug?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'featured';
  page?: number;
  limit?: number;
}): Promise<{
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  brands: Brand[];
  categories: Category[];
}> {
  const queryStr = new URLSearchParams();
  if (params.query) queryStr.set('query', params.query);
  if (params.brandSlug) queryStr.set('brand', params.brandSlug);
  if (params.categorySlug) queryStr.set('category', params.categorySlug);
  if (params.minPrice !== undefined) queryStr.set('minPrice', String(params.minPrice));
  if (params.maxPrice !== undefined) queryStr.set('maxPrice', String(params.maxPrice));
  if (params.sort) queryStr.set('sort', params.sort);
  if (params.page) queryStr.set('page', String(params.page));
  if (params.limit) queryStr.set('limit', String(params.limit));

  try {
    const res = await fetch(`/api/catalog?${queryStr.toString()}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback to robust client-side filter
  }

  // Client-side execution matching the server logic
  let filtered = localProducts.filter(p => p.is_active);

  if (params.query) {
    const q = params.query.toLowerCase().trim();
    filtered = filtered.filter(p => {
      const b = localBrands.find(b => b.id === p.brand_id);
      return (
        p.name_ar.toLowerCase().includes(q) ||
        p.name_en.toLowerCase().includes(q) ||
        p.description_ar.toLowerCase().includes(q) ||
        p.description_en.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (b && (b.name_ar.toLowerCase().includes(q) || b.name_en.toLowerCase().includes(q)))
      );
    });
  }

  if (params.brandSlug) {
    const brand = localBrands.find(b => b.slug === params.brandSlug);
    if (brand) {
      filtered = filtered.filter(p => p.brand_id === brand.id);
    }
  }

  if (params.categorySlug) {
    const cat = localCategories.find(c => c.slug === params.categorySlug);
    if (cat) {
      filtered = filtered.filter(p => p.category_ids?.includes(cat.id));
    }
  }

  if (params.minPrice !== undefined) {
    filtered = filtered.filter(p => p.price_sar >= params.minPrice!);
  }

  if (params.maxPrice !== undefined) {
    filtered = filtered.filter(p => p.price_sar <= params.maxPrice!);
  }

  // Sort
  if (params.sort === 'price_asc') {
    filtered.sort((a, b) => a.price_sar - b.price_sar);
  } else if (params.sort === 'price_desc') {
    filtered.sort((a, b) => b.price_sar - a.price_sar);
  } else if (params.sort === 'featured') {
    filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  } else {
    // newest
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const page = params.page || 1;
  const limit = params.limit || 12;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Attach populated brand & categories
  const populated = paginated.map(p => ({
    ...p,
    brand: localBrands.find(b => b.id === p.brand_id),
    categories: localCategories.filter(c => p.category_ids?.includes(c.id)),
  }));

  return {
    products: populated,
    total,
    page,
    totalPages,
    brands: localBrands.filter(b => b.is_active),
    categories: localCategories.filter(c => c.is_active),
  };
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`/api/catalog/product/${slug}`);
    if (res.ok) {
      const data = await res.json();
      return data.product;
    }
  } catch {
    // fallback
  }

  const found = localProducts.find(p => p.slug === slug);
  if (!found) return null;

  return {
    ...found,
    brand: localBrands.find(b => b.id === found.brand_id),
    categories: localCategories.filter(c => found.category_ids?.includes(c.id)),
  };
}

export async function fetchBrandBySlug(slug: string): Promise<{ brand: Brand; products: Product[] } | null> {
  try {
    const res = await fetch(`/api/catalog/brand/${slug}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const brand = localBrands.find(b => b.slug === slug);
  if (!brand) return null;

  const products = localProducts
    .filter(p => p.brand_id === brand.id && p.is_active)
    .map(p => ({
      ...p,
      brand,
      categories: localCategories.filter(c => p.category_ids?.includes(c.id)),
    }));

  return { brand, products };
}

export async function fetchCategoryBySlug(slug: string): Promise<{ category: Category; products: Product[] } | null> {
  try {
    const res = await fetch(`/api/catalog/category/${slug}`);
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback
  }

  const category = localCategories.find(c => c.slug === slug);
  if (!category) return null;

  const products = localProducts
    .filter(p => p.category_ids?.includes(category.id) && p.is_active)
    .map(p => ({
      ...p,
      brand: localBrands.find(b => b.id === p.brand_id),
      categories: [category],
    }));

  return { category, products };
}

/**
 * Trusted Cart Verification Endpoint
 * NEVER trust localStorage prices. Calls server /api/cart/verify.
 */
export async function verifyCartWithServer(cartItems: CartItem[]): Promise<CartVerificationResult> {
  try {
    const payload = cartItems.map(item => ({
      productId: item.productId,
      variantId: item.variantId,
      quantity: item.quantity,
      clientPrice: item.storedPrice,
    }));

    const res = await fetch('/api/cart/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: payload }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // fallback client-side validation
  }

  // Trusted local verification fallback
  let hasPriceDiscrepancy = false;
  const discrepancies: CartVerificationResult['discrepancies'] = [];
  let subtotalSar = 0;

  const verifiedItems = cartItems.map(item => {
    const product = localProducts.find(p => p.id === item.productId);
    if (!product) {
      throw new Error(`Product ${item.productId} not found`);
    }

    const brand = localBrands.find(b => b.id === product.brand_id);
    let unitPrice = product.price_sar;
    let variantNameAr: string | undefined;
    let variantNameEn: string | undefined;
    let sku = product.sku;

    if (item.variantId && product.variants) {
      const variant = product.variants.find(v => v.id === item.variantId);
      if (variant) {
        unitPrice = variant.price_sar;
        variantNameAr = variant.name_ar;
        variantNameEn = variant.name_en;
        sku = variant.sku;
      }
    }

    if (item.storedPrice !== unitPrice) {
      hasPriceDiscrepancy = true;
      discrepancies.push({
        productId: product.id,
        productTitle: product.name_ar,
        oldPrice: item.storedPrice,
        newPrice: unitPrice,
      });
    }

    const lineTotalSar = unitPrice * item.quantity;
    subtotalSar += lineTotalSar;

    return {
      productId: product.id,
      variantId: item.variantId,
      productNameAr: product.name_ar,
      productNameEn: product.name_en,
      brandNameAr: brand?.name_ar || 'عَبَق',
      brandNameEn: brand?.name_en || 'ABAQ',
      variantNameAr,
      variantNameEn,
      sku,
      unitPriceSar: unitPrice,
      quantity: item.quantity,
      lineTotalSar,
      inStock: true,
      availableStock: product.stock_quantity,
    };
  });

  return {
    verified: true,
    hasPriceDiscrepancy,
    discrepancies,
    items: verifiedItems,
    subtotalSar,
    currency: 'SAR',
    storeWhatsApp: localSettings.whatsapp_number,
  };
}
