import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_BRANDS, INITIAL_CATEGORIES, INITIAL_PRODUCTS, INITIAL_STORE_SETTINGS } from './src/data/seedData';
import { Product, Brand, Category, StoreSettings } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Supabase setup
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY || 'abaq2010';

let supabase: ReturnType<typeof createClient> | null = null;
if (SUPABASE_URL && (SUPABASE_SECRET_KEY || SUPABASE_PUBLISHABLE_KEY)) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_SECRET_KEY || SUPABASE_PUBLISHABLE_KEY!);
  } catch (err) {
    console.warn('Supabase initialization failed, falling back to in-memory catalog:', err);
  }
}

// In-memory catalog store
let inMemoryBrands: Brand[] = [...INITIAL_BRANDS];
let inMemoryCategories: Category[] = [...INITIAL_CATEGORIES];
let inMemoryProducts: Product[] = [...INITIAL_PRODUCTS];
let inMemorySettings: StoreSettings = {
  ...INITIAL_STORE_SETTINGS,
  whatsapp_number: process.env.STORE_WHATSAPP || INITIAL_STORE_SETTINGS.whatsapp_number,
};

// Security middleware for Admin routes
function requireAdminAuth(req: Request, res: Response, next: () => void) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'مطلوب تسجيل الدخول كمسؤول للنظام (Unauthorized)' });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (token !== ADMIN_SECRET_KEY && token !== 'abaq_session_token_authorized') {
    return res.status(403).json({ error: 'صلاحيات المشرف غير صالحة (Forbidden)' });
  }
  next();
}

// ==============================================================================
// PUBLIC API ROUTES
// ==============================================================================

// 1. Store Config & Connectivity status
app.get('/api/config', (_req: Request, res: Response) => {
  res.json({
    settings: inMemorySettings,
    isSupabaseConnected: !!supabase,
    isDemoData: !supabase,
    supabaseConfigured: !!(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY),
    supabaseUrl: SUPABASE_URL || null,
    supabasePublishableKey: SUPABASE_PUBLISHABLE_KEY || null,
  });
});

// 2. Multi-Brand Catalog with Search, Filters, Sorting, and Pagination
app.get('/api/catalog', (req: Request, res: Response) => {
  const query = typeof req.query.query === 'string' ? req.query.query.trim().toLowerCase() : '';
  const brandSlug = typeof req.query.brand === 'string' ? req.query.brand : '';
  const categorySlug = typeof req.query.category === 'string' ? req.query.category : '';
  const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined;
  const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined;
  const sort = typeof req.query.sort === 'string' ? req.query.sort : 'newest';
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 12;

  let filtered = inMemoryProducts.filter(p => p.is_active);

  if (query) {
    filtered = filtered.filter(p => {
      const b = inMemoryBrands.find(b => b.id === p.brand_id);
      return (
        p.name_ar.toLowerCase().includes(query) ||
        p.name_en.toLowerCase().includes(query) ||
        p.description_ar.toLowerCase().includes(query) ||
        p.description_en.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        (b && (b.name_ar.toLowerCase().includes(query) || b.name_en.toLowerCase().includes(query)))
      );
    });
  }

  if (brandSlug) {
    const brand = inMemoryBrands.find(b => b.slug === brandSlug);
    if (brand) {
      filtered = filtered.filter(p => p.brand_id === brand.id);
    }
  }

  if (categorySlug) {
    const cat = inMemoryCategories.find(c => c.slug === categorySlug);
    if (cat) {
      filtered = filtered.filter(p => p.category_ids?.includes(cat.id));
    }
  }

  if (minPrice !== undefined && !isNaN(minPrice)) {
    filtered = filtered.filter(p => p.price_sar >= minPrice);
  }

  if (maxPrice !== undefined && !isNaN(maxPrice)) {
    filtered = filtered.filter(p => p.price_sar <= maxPrice);
  }

  // Sort
  if (sort === 'price_asc') {
    filtered.sort((a, b) => a.price_sar - b.price_sar);
  } else if (sort === 'price_desc') {
    filtered.sort((a, b) => b.price_sar - a.price_sar);
  } else if (sort === 'featured') {
    filtered.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
  } else {
    // Newest
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const paginated = filtered.slice((page - 1) * limit, page * limit);

  // Attach joined brand & categories
  const populated = paginated.map(p => ({
    ...p,
    brand: inMemoryBrands.find(b => b.id === p.brand_id),
    categories: inMemoryCategories.filter(c => p.category_ids?.includes(c.id)),
  }));

  res.json({
    products: populated,
    total,
    page,
    totalPages,
    brands: inMemoryBrands.filter(b => b.is_active),
    categories: inMemoryCategories.filter(c => c.is_active),
  });
});

// 3. Single Product by Slug
app.get('/api/catalog/product/:slug', (req: Request, res: Response) => {
  const product = inMemoryProducts.find(p => p.slug === req.params.slug && p.is_active);
  if (!product) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }

  const populated = {
    ...product,
    brand: inMemoryBrands.find(b => b.id === product.brand_id),
    categories: inMemoryCategories.filter(c => product.category_ids?.includes(c.id)),
  };

  const related = inMemoryProducts
    .filter(p => p.id !== product.id && p.is_active && (p.brand_id === product.brand_id || p.category_ids?.some(c => product.category_ids?.includes(c))))
    .slice(0, 4)
    .map(p => ({
      ...p,
      brand: inMemoryBrands.find(b => b.id === p.brand_id),
    }));

  res.json({ product: populated, related });
});

// 4. Single Brand by Slug
app.get('/api/catalog/brand/:slug', (req: Request, res: Response) => {
  const brand = inMemoryBrands.find(b => b.slug === req.params.slug && b.is_active);
  if (!brand) {
    return res.status(404).json({ error: 'العلامة التجارية غير موجودة' });
  }

  const products = inMemoryProducts
    .filter(p => p.brand_id === brand.id && p.is_active)
    .map(p => ({
      ...p,
      brand,
      categories: inMemoryCategories.filter(c => p.category_ids?.includes(c.id)),
    }));

  res.json({ brand, products });
});

// 5. Single Category by Slug
app.get('/api/catalog/category/:slug', (req: Request, res: Response) => {
  const category = inMemoryCategories.find(c => c.slug === req.params.slug && c.is_active);
  if (!category) {
    return res.status(404).json({ error: 'التصنيف غير موجود' });
  }

  const products = inMemoryProducts
    .filter(p => p.category_ids?.includes(category.id) && p.is_active)
    .map(p => ({
      ...p,
      brand: inMemoryBrands.find(b => b.id === p.brand_id),
      categories: [category],
    }));

  res.json({ category, products });
});

// 6. Trusted Cart Verification Endpoint
// CRITICAL: NEVER trust localStorage prices. Recalculates exact live price and verifies availability.
// Does NOT store orders, customer checkout information, or logs.
app.post('/api/cart/verify', (req: Request, res: Response) => {
  const { items } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'عربة التسوق فارغة' });
  }

  let hasPriceDiscrepancy = false;
  const discrepancies: Array<{ productId: string; productTitle: string; oldPrice: number; newPrice: number }> = [];
  let subtotalSar = 0;

  const verifiedItems = [];

  for (const item of items) {
    const product = inMemoryProducts.find(p => p.id === item.productId && p.is_active);
    if (!product) {
      return res.status(400).json({
        error: `المنتج المختار لم يعد متوفراً في المتجر`,
        unavailableProductId: item.productId,
      });
    }

    const brand = inMemoryBrands.find(b => b.id === product.brand_id);
    let unitPrice = product.price_sar;
    let variantNameAr: string | undefined;
    let variantNameEn: string | undefined;
    let sku = product.sku;
    let inStock = true;

    if (item.variantId && product.variants) {
      const variant = product.variants.find(v => v.id === item.variantId && v.is_active);
      if (variant) {
        unitPrice = variant.price_sar;
        variantNameAr = variant.name_ar;
        variantNameEn = variant.name_en;
        sku = variant.sku;

        if (inMemorySettings.inventory_tracking_enabled && variant.stock_quantity !== undefined) {
          inStock = variant.stock_quantity >= item.quantity;
        }
      }
    } else if (inMemorySettings.inventory_tracking_enabled && product.track_inventory && product.stock_quantity !== undefined) {
      inStock = product.stock_quantity >= item.quantity;
    }

    const clientReportedPrice = typeof item.clientPrice === 'number' ? item.clientPrice : 0;
    if (clientReportedPrice !== unitPrice) {
      hasPriceDiscrepancy = true;
      discrepancies.push({
        productId: product.id,
        productTitle: product.name_ar,
        oldPrice: clientReportedPrice,
        newPrice: unitPrice,
      });
    }

    const quantity = Math.max(1, Math.min(99, parseInt(item.quantity, 10) || 1));
    const lineTotalSar = unitPrice * quantity;
    subtotalSar += lineTotalSar;

    verifiedItems.push({
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
      quantity,
      lineTotalSar,
      inStock,
      availableStock: product.stock_quantity,
    });
  }

  res.json({
    verified: true,
    hasPriceDiscrepancy,
    discrepancies,
    items: verifiedItems,
    subtotalSar,
    currency: inMemorySettings.default_currency || 'SAR',
    storeWhatsApp: inMemorySettings.whatsapp_number,
  });
});

// ==============================================================================
// PROTECTED ADMIN API ROUTES
// ==============================================================================

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'يرجى إدخال كلمة المرور' });
  }

  // Check password against abaq2010 or ADMIN_SECRET_KEY
  if (password === 'abaq2010' || password === ADMIN_SECRET_KEY) {
    return res.json({
      success: true,
      token: 'abaq_session_token_authorized',
      adminUser: {
        email: 'admin@abaq-perfumes.com',
        role: 'super_admin',
        name: 'مدير منصة عَبَق',
      },
    });
  }

  return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
});

// Admin Overview Metrics (Counts only - NO fake sales metrics)
app.get('/api/admin/overview', requireAdminAuth, (_req: Request, res: Response) => {
  res.json({
    totalBrands: inMemoryBrands.length,
    activeBrands: inMemoryBrands.filter(b => b.is_active).length,
    totalProducts: inMemoryProducts.length,
    activeProducts: inMemoryProducts.filter(p => p.is_active).length,
    featuredProducts: inMemoryProducts.filter(p => p.is_featured).length,
    totalCategories: inMemoryCategories.length,
    activeCategories: inMemoryCategories.filter(c => c.is_active).length,
    inventoryTrackingEnabled: inMemorySettings.inventory_tracking_enabled,
  });
});

// Brand CRUD
app.post('/api/admin/brands', requireAdminAuth, (req: Request, res: Response) => {
  const brandData = req.body;
  if (!brandData.name_ar || !brandData.name_en || !brandData.slug) {
    return res.status(400).json({ error: 'الاسم بالعربية والإنجليزية والرابط التعريفي إلزامي' });
  }

  const newBrand: Brand = {
    id: `b-${Date.now()}`,
    name_ar: brandData.name_ar,
    name_en: brandData.name_en,
    slug: brandData.slug,
    description_ar: brandData.description_ar || '',
    description_en: brandData.description_en || '',
    logo_url: brandData.logo_url || '',
    banner_url: brandData.banner_url || '',
    country_of_origin: brandData.country_of_origin || 'المملكة العربية السعودية',
    is_featured: !!brandData.is_featured,
    is_active: brandData.is_active !== false,
    sort_order: parseInt(brandData.sort_order, 10) || inMemoryBrands.length + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  inMemoryBrands.push(newBrand);
  res.status(201).json(newBrand);
});

app.put('/api/admin/brands/:id', requireAdminAuth, (req: Request, res: Response) => {
  const index = inMemoryBrands.findIndex(b => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'العلامة التجارية غير موجودة' });
  }

  inMemoryBrands[index] = {
    ...inMemoryBrands[index],
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  res.json(inMemoryBrands[index]);
});

app.delete('/api/admin/brands/:id', requireAdminAuth, (req: Request, res: Response) => {
  const hasProducts = inMemoryProducts.some(p => p.brand_id === req.params.id);
  if (hasProducts) {
    return res.status(400).json({ error: 'لا يمكن حذف هذه العلامة لأن هناك منتجات مرتبطة بها' });
  }

  inMemoryBrands = inMemoryBrands.filter(b => b.id !== req.params.id);
  res.json({ success: true });
});

// Category CRUD
app.post('/api/admin/categories', requireAdminAuth, (req: Request, res: Response) => {
  const catData = req.body;
  if (!catData.name_ar || !catData.name_en || !catData.slug) {
    return res.status(400).json({ error: 'الاسم بالعربية والإنجليزية والرابط التعريفي إلزامي' });
  }

  const newCat: Category = {
    id: `c-${Date.now()}`,
    name_ar: catData.name_ar,
    name_en: catData.name_en,
    slug: catData.slug,
    description_ar: catData.description_ar || '',
    description_en: catData.description_en || '',
    image_url: catData.image_url || '',
    parent_id: catData.parent_id || null,
    sort_order: parseInt(catData.sort_order, 10) || inMemoryCategories.length + 1,
    is_active: catData.is_active !== false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  inMemoryCategories.push(newCat);
  res.status(201).json(newCat);
});

app.put('/api/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  const index = inMemoryCategories.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'التصنيف غير موجود' });
  }

  inMemoryCategories[index] = {
    ...inMemoryCategories[index],
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  res.json(inMemoryCategories[index]);
});

app.delete('/api/admin/categories/:id', requireAdminAuth, (req: Request, res: Response) => {
  inMemoryCategories = inMemoryCategories.filter(c => c.id !== req.params.id);
  res.json({ success: true });
});

// Product CRUD
app.post('/api/admin/products', requireAdminAuth, (req: Request, res: Response) => {
  const p = req.body;
  if (!p.name_ar || !p.name_en || !p.brand_id || !p.sku || p.price_sar === undefined) {
    return res.status(400).json({ error: 'الاسم، الماركة، رمز المنتج SKU والسعر كلها حقول مطلوبة' });
  }

  const newProduct: Product = {
    id: `p-${Date.now()}`,
    brand_id: p.brand_id,
    name_ar: p.name_ar,
    name_en: p.name_en,
    slug: p.slug || `product-${Date.now()}`,
    sku: p.sku,
    description_ar: p.description_ar || '',
    description_en: p.description_en || '',
    notes_top_ar: p.notes_top_ar,
    notes_top_en: p.notes_top_en,
    notes_heart_ar: p.notes_heart_ar,
    notes_heart_en: p.notes_heart_en,
    notes_base_ar: p.notes_base_ar,
    notes_base_en: p.notes_base_en,
    price_sar: parseFloat(p.price_sar) || 0,
    compare_at_price_sar: p.compare_at_price_sar ? parseFloat(p.compare_at_price_sar) : null,
    primary_image_url: p.primary_image_url || '/src/assets/images/category_royal_perfumes_1791722807080.jpg',
    images: Array.isArray(p.images) ? p.images : [],
    is_active: p.is_active !== false,
    is_featured: !!p.is_featured,
    track_inventory: !!p.track_inventory,
    stock_quantity: parseInt(p.stock_quantity, 10) || 0,
    sort_order: parseInt(p.sort_order, 10) || inMemoryProducts.length + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category_ids: Array.isArray(p.category_ids) ? p.category_ids : [],
    variants: Array.isArray(p.variants) ? p.variants : [],
  };

  inMemoryProducts.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  const index = inMemoryProducts.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }

  inMemoryProducts[index] = {
    ...inMemoryProducts[index],
    ...req.body,
    updated_at: new Date().toISOString(),
  };

  res.json(inMemoryProducts[index]);
});

app.delete('/api/admin/products/:id', requireAdminAuth, (req: Request, res: Response) => {
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== req.params.id);
  res.json({ success: true });
});

// Settings Management
app.get('/api/admin/settings', requireAdminAuth, (_req: Request, res: Response) => {
  res.json(inMemorySettings);
});

app.put('/api/admin/settings', requireAdminAuth, (req: Request, res: Response) => {
  inMemorySettings = {
    ...inMemorySettings,
    ...req.body,
  };
  res.json(inMemorySettings);
});

// Media Upload Endpoint with validation
app.post('/api/admin/upload', requireAdminAuth, (req: Request, res: Response) => {
  const { fileData, fileName, mimeType } = req.body;
  if (!fileData || !mimeType) {
    return res.status(400).json({ error: 'ملف غير صالح' });
  }

  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!allowedMimes.includes(mimeType)) {
    return res.status(400).json({ error: 'نوع الملف غير مدعوم (يسمح فقط بصور JPG, PNG, WEBP, SVG)' });
  }

  // Generates unique media asset URL
  const uniqueName = `upload_${Date.now()}_${(fileName || 'image').replace(/[^a-zA-Z0-9.-]/g, '_')}`;
  // In demo / serverless environment, return data URI or simulated path
  res.json({
    success: true,
    url: fileData, // previewable data url
    fileName: uniqueName,
  });
});

// ==============================================================================
// VITE MIDDLEWARE INTEGRATION (DEV & PROD)
// ==============================================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[ABAQ | عَبَق] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
