import React, { useState, useEffect, useTransition } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { BrandDirectory } from './components/BrandDirectory';
import { CategoryList } from './components/CategoryList';
import { AdminModal } from './components/AdminModal';
import { InfoPagesModal, InfoPageSlug } from './components/InfoPagesModal';
import { Footer } from './components/Footer';
import { Product, Brand, Category, StoreSettings } from './types';
import { fetchCatalog, fetchStoreConfig } from './services/catalogService';
import { Search, Filter, SlidersHorizontal, ArrowLeft, ArrowRight, Sparkles, ChevronLeft, ChevronRight, X, Percent } from 'lucide-react';

function MainApp() {
  const { language, t, isRTL, formatCurrency, setCurrency } = useLanguage();
  const [, startTransition] = useTransition();

  // Navigation tab state
  const [currentTab, setCurrentTab] = useState<'home' | 'catalog' | 'brands' | 'categories' | 'about'>('home');

  // Catalog data & filtering state
  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings>({
    store_name_ar: 'عَبَق للأطياب والبخور',
    store_name_en: 'ABAQ Fine Fragrances',
    tagline_ar: 'المتجر الجامع لأفخم دور العطور الشرقية والعود الأصيل',
    tagline_en: 'The multi-brand sanctuary of rare agarwood & niche fragrances',
    whatsapp_number: '+967718488431',
    default_currency: 'SAR',
    default_language: 'ar',
    inventory_tracking_enabled: false,
    contact_email: 'concierge@abaq-perfumes.com',
    contact_phone: '+967718488431',
    address_ar: 'صنعاء / الرياض',
    address_en: "Sana'a / Riyadh",
  });
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filter params
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedBrandSlug, setSelectedBrandSlug] = useState<string>('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'featured'>('featured');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [infoPageSlug, setInfoPageSlug] = useState<InfoPageSlug | null>(null);

  // Admin modal shortcut listener (Ctrl+M or Cmd+M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
        e.preventDefault();
        setIsAdminOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load config & initial catalog
  const loadData = async () => {
    setIsLoading(true);
    try {
      const config = await fetchStoreConfig();
      if (config) {
        setSettings(config.settings);
        setIsSupabaseConnected(config.isSupabaseConnected);
        if (config.settings?.default_currency) {
          setCurrency(config.settings.default_currency);
        }
      }

      const catalogData = await fetchCatalog({
        query: debouncedQuery,
        brandSlug: selectedBrandSlug || undefined,
        categorySlug: selectedCategorySlug || undefined,
        sort: sortBy,
        page,
        limit: 12,
      });

      setProducts(catalogData.products);
      setBrands(catalogData.brands);
      setCategories(catalogData.categories);
      setTotalPages(catalogData.totalPages);
      setTotalCount(catalogData.total);
    } catch (e) {
      console.error('Error loading catalog', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [debouncedQuery, selectedBrandSlug, selectedCategorySlug, sortBy, page]);

  const handleBrandSelect = (brandSlug: string) => {
    setSelectedBrandSlug(brandSlug);
    setCurrentTab('catalog');
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategorySlug(categorySlug);
    setCurrentTab('catalog');
    setPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setDebouncedQuery('');
    setSelectedBrandSlug('');
    setSelectedCategorySlug('');
    setSortBy('featured');
    setPage(1);
  };

  const activeFiltersCount =
    (debouncedQuery ? 1 : 0) + (selectedBrandSlug ? 1 : 0) + (selectedCategorySlug ? 1 : 0);

  const activeOffers = (settings.offers || []).filter((o) => o.is_active);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2E9] text-[#3A2419]">
      {/* Top Promotional Announcement Bar from Admin Dashboard */}
      {activeOffers.length > 0 && (
        <aside aria-label="العروض الترويجية" className="bg-[#3A2419] text-[#F7F2E9] py-2.5 px-4 border-b border-[#B8906A]/30 text-xs transition-colors shadow-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 truncate">
              <Sparkles className="w-3.5 h-3.5 text-[#B8906A] shrink-0" />
              {activeOffers[0].discount_tag && (
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#B8906A] text-[#3A2419] shrink-0">
                  {activeOffers[0].discount_tag}
                </span>
              )}
              <span className="font-bold truncate text-xs sm:text-sm">
                {language === 'ar' ? activeOffers[0].title_ar : (activeOffers[0].title_en || activeOffers[0].title_ar)}
              </span>
              {activeOffers[0].subtitle_ar && (
                <span className="hidden md:inline text-[#E6D8C3]/80 text-xs truncate">
                  — {language === 'ar' ? activeOffers[0].subtitle_ar : (activeOffers[0].subtitle_en || activeOffers[0].subtitle_ar)}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setCurrentTab('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-[#DFC7AC] hover:text-white shrink-0 underline"
            >
              {language === 'ar' ? 'تصفح العرض' : 'Shop Offer'}
            </button>
          </div>
        </aside>
      )}

      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          startTransition(() => {
            setCurrentTab(tab as any);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          });
        }}
      />

      {/* Main Page Area */}
      <main className="flex-1">
        
        {/* VIEW 1: HOME PAGE */}
        {currentTab === 'home' && (
          <div className="space-y-16 pb-20">
            {/* Hero Banner */}
            <Hero
              onExplore={() => {
                setCurrentTab('catalog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExploreBrands={() => {
                setCurrentTab('brands');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Admin Active Offers Showcase Strip */}
            {activeOffers.length > 0 && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-start">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">
                  <Percent className="w-4 h-4 text-[#B8906A]" />
                  <span>{language === 'ar' ? 'العروض والتخفيضات الخاصة' : 'Special Offers & Promotions'}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeOffers.map((offer) => (
                    <div
                      key={offer.id}
                      style={{ backgroundColor: offer.banner_bg_color || '#3A2419' }}
                      className="p-6 rounded-2xl text-white shadow-md relative overflow-hidden flex flex-col justify-between"
                    >
                      <div className="space-y-2 relative z-10">
                        <div className="flex items-center gap-2">
                          {offer.discount_tag && (
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-white">
                              {offer.discount_tag}
                            </span>
                          )}
                          <span className="text-[11px] tracking-wider uppercase opacity-80">عَبَق حصرياً</span>
                        </div>
                        <h3 className="font-wordmark text-2xl font-bold">
                          {language === 'ar' ? offer.title_ar : (offer.title_en || offer.title_ar)}
                        </h3>
                        {offer.subtitle_ar && (
                          <p className="text-xs text-white/85 max-w-md">
                            {language === 'ar' ? offer.subtitle_ar : (offer.subtitle_en || offer.subtitle_ar)}
                          </p>
                        )}
                      </div>
                      <div className="pt-5 relative z-10">
                        <button
                          onClick={() => {
                            setCurrentTab('catalog');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="px-4 py-2 rounded-lg bg-white text-[#3A2419] font-bold text-xs hover:bg-[#F7F2E9] transition-colors"
                        >
                          {language === 'ar' ? 'تصفح عطور العرض' : 'Explore Offer'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Independent Brand Houses Showcase Strip */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="p-6 rounded-2xl bg-[#E6D8C3]/30 border border-[#E6D8C3] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-start">
                  <div>
                    <h3 className="font-wordmark text-lg font-bold text-[#3A2419]">
                      {language === 'ar' ? 'دور العطور والشراكات المستقلة' : 'Independent Partner Houses'}
                    </h3>
                    <p className="text-xs text-[#3A2419]/70">
                      {language === 'ar'
                        ? 'عَبَق ليست داراً منفردة، بل ملتقى أفخم العلامات التجارية المتخصصة'
                        : 'ABAQ is a unified platform curating the most esteemed independent houses'}
                    </p>
                  </div>
                  {brands.length > 0 && (
                    <button
                      onClick={() => setCurrentTab('brands')}
                      className="text-xs font-semibold text-[#8B5E3C] hover:text-[#3A2419] flex items-center gap-1 self-start sm:self-auto"
                    >
                      <span>{language === 'ar' ? 'دليل الدور بالكامل' : 'View All Houses'}</span>
                      {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>

                {/* Brands Ribbon */}
                {brands.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                    {brands.slice(0, 5).map((b) => (
                      <button
                        key={b.id}
                        onClick={() => handleBrandSelect(b.slug)}
                        className="p-3 rounded-xl bg-[#F7F2E9] border border-[#E6D8C3] hover:border-[#B8906A] transition-all text-center group"
                      >
                        <span className="font-wordmark text-sm font-bold text-[#3A2419] group-hover:text-[#8B5E3C] block truncate">
                          {language === 'ar' ? b.name_ar : b.name_en}
                        </span>
                        <span className="text-[10px] text-[#8B5E3C]/70 block truncate mt-0.5">
                          {b.country_of_origin}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-[#F7F2E9] border border-[#E6D8C3] text-start text-xs text-[#8B5E3C]">
                    {language === 'ar'
                      ? 'يمكن للمشرف إضافة دور العطور والعلامات التجارية الشريكة بالضغط على اختصار (Ctrl+M).'
                      : 'Store manager can add fragrance houses and brands by pressing (Ctrl+M).'}
                  </div>
                )}
              </div>
            </section>

            {/* Featured Fragrances Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-start">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6D8C3] pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#B8906A]" />
                    <span>{language === 'ar' ? 'مختارات الموسم' : 'Seasonal Curation'}</span>
                  </div>
                  <h2 className="font-wordmark text-3xl font-bold text-[#3A2419] mt-1">
                    {language === 'ar' ? 'نفائس العود والعطور المختارة' : 'Featured Royal Selections'}
                  </h2>
                </div>
                {products.length > 0 && (
                  <button
                    onClick={() => {
                      setCurrentTab('catalog');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-[#8B5E3C] hover:text-[#3A2419] flex items-center gap-1.5"
                  >
                    <span>{language === 'ar' ? 'تصفح كافة المعروضات' : 'View Full Catalog'}</span>
                    {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>

              {/* 3 or 4-column Luxury Product Grid */}
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.slice(0, 8).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                      onBrandClick={(slug) => handleBrandSelect(slug)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center bg-white rounded-2xl border border-[#E6D8C3] space-y-2">
                  <p className="font-wordmark text-base font-bold text-[#3A2419]">
                    {language === 'ar' ? 'المتجر مهيأ بالكامل لاستقبال عطوركم' : 'The store is ready for catalog additions'}
                  </p>
                  <p className="text-xs text-[#8B5E3C]">
                    {language === 'ar'
                      ? 'يمكن للمشرف الضغط على (Ctrl+M) في أي وقت للدخول بكلمة السر abaq2010 وإضافة المنتجات والعروض.'
                      : 'Press (Ctrl+M) to log in with abaq2010 and add products and offers.'}
                  </p>
                </div>
              )}
            </section>

            {/* Olfactory Families Feature Cards */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-start">
              <div className="border-b border-[#E6D8C3] pb-4">
                <h2 className="font-wordmark text-2xl sm:text-3xl font-bold text-[#3A2419]">
                  {language === 'ar' ? 'العائلات العطرية وأصناف الطيب' : 'Olfactory Families & Resins'}
                </h2>
                <p className="text-xs text-[#3A2419]/70 mt-1">
                  {language === 'ar'
                    ? 'اكتشف الأصناف بحسب التصنيف العطري المفضل لديك'
                    : 'Discover creations grouped by their scent profile'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div
                  onClick={() => handleCategorySelect('perfumes')}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-[#E6D8C3] shadow-md"
                >
                  <img
                    src="/src/assets/images/category_royal_perfumes_1791722807080.jpg"
                    alt="Luxury Perfumes"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 start-4 end-4 text-white">
                    <h3 className="font-wordmark text-xl font-bold">العطور الفاخرة</h3>
                    <p className="text-xs text-[#DFC7AC] mt-0.5">Extraits de Parfum & Niche Scents</p>
                  </div>
                </div>

                <div
                  onClick={() => handleCategorySelect('oud-chips')}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-[#E6D8C3] shadow-md"
                >
                  <img
                    src="/src/assets/images/category_oud_incense_1791722796800.jpg"
                    alt="Oud Chips & Bakhoor"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 start-4 end-4 text-white">
                    <h3 className="font-wordmark text-xl font-bold">العود والبخور الملكي</h3>
                    <p className="text-xs text-[#DFC7AC] mt-0.5">Maroke Chips & Majlis Bakhoor</p>
                  </div>
                </div>

                <div
                  onClick={() => handleCategorySelect('perfume-oils')}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer border border-[#E6D8C3] shadow-md"
                >
                  <img
                    src="/src/assets/images/category_musk_oils_1791722817304.jpg"
                    alt="Attars & Pure Musk"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 start-4 end-4 text-white">
                    <h3 className="font-wordmark text-xl font-bold">أدهان العود والمسك</h3>
                    <p className="text-xs text-[#DFC7AC] mt-0.5">Aged Attars & Rare Tolas</p>
                  </div>
                </div>
              </div>
            </section>

          </div>
        )}

        {/* VIEW 2: COMPLETE CATALOG & SEARCH / FILTER */}
        {currentTab === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-start">
            
            {/* Header & Search Bar */}
            <div className="space-y-4">
              <div>
                <h1 className="font-wordmark text-3xl sm:text-4xl font-bold text-[#3A2419]">
                  {language === 'ar' ? 'كتالوج العطور والعود' : 'Fragrance & Agarwood Catalog'}
                </h1>
                <p className="text-xs sm:text-sm text-[#3A2419]/70 mt-1">
                  {totalCount} {t('resultsCount')}
                </p>
              </div>

              {/* Search & Sort Controls Toolbar */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Search Bar (8 cols) */}
                <div className="md:col-span-8 relative">
                  <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'start-3' : 'start-3'} w-4 h-4 text-[#8B5E3C]`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full text-xs sm:text-sm ps-9 pe-4 py-3 bg-white rounded-xl border border-[#E6D8C3] focus:border-[#B8906A] focus:outline-none shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute top-1/2 -translate-y-1/2 end-3 text-[#8B5E3C] hover:text-[#3A2419]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Dropdown (4 cols) */}
                <div className="md:col-span-4 flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full text-xs sm:text-sm px-3 py-3 bg-white rounded-xl border border-[#E6D8C3] focus:border-[#B8906A] focus:outline-none text-[#3A2419] font-medium"
                  >
                    <option value="featured">{t('sortFeatured')}</option>
                    <option value="newest">{t('sortNewest')}</option>
                    <option value="price_asc">{t('sortPriceAsc')}</option>
                    <option value="price_desc">{t('sortPriceDesc')}</option>
                  </select>
                </div>
              </div>

              {/* Filter Tabs / Quick Selectors */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {/* Brand Filter Dropdown */}
                <select
                  value={selectedBrandSlug}
                  onChange={(e) => {
                    setSelectedBrandSlug(e.target.value);
                    setPage(1);
                  }}
                  className="text-xs px-3 py-2 bg-white rounded-lg border border-[#E6D8C3] text-[#3A2419] font-medium"
                >
                  <option value="">{t('allBrands')}</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.slug}>
                      {language === 'ar' ? b.name_ar : b.name_en}
                    </option>
                  ))}
                </select>

                {/* Category Filter Dropdown */}
                <select
                  value={selectedCategorySlug}
                  onChange={(e) => {
                    setSelectedCategorySlug(e.target.value);
                    setPage(1);
                  }}
                  className="text-xs px-3 py-2 bg-white rounded-lg border border-[#E6D8C3] text-[#3A2419] font-medium"
                >
                  <option value="">{t('allCategories')}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {language === 'ar' ? c.name_ar : c.name_en}
                    </option>
                  ))}
                </select>

                {/* Reset button if filters active */}
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-[#8B5E3C] hover:text-[#3A2419] px-2.5 py-1.5 underline"
                  >
                    {t('resetFilters')} ({activeFiltersCount})
                  </button>
                )}
              </div>
            </div>

            {/* Product Grid Area */}
            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-[#B8906A] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#8B5E3C]">{language === 'ar' ? 'جاري تحميل المعروضات...' : 'Loading items...'}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-[#E6D8C3] p-8">
                <p className="font-wordmark text-lg font-bold text-[#3A2419]">
                  {t('noProductsFound')}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 text-xs font-semibold text-[#F7F2E9] bg-[#3A2419] rounded-lg hover:bg-[#2A1810]"
                >
                  {t('resetFilters')}
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onSelect={(p) => setSelectedProduct(p)}
                      onBrandClick={(slug) => handleBrandSelect(slug)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 pt-8 border-t border-[#E6D8C3]">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-[#E6D8C3] bg-white text-[#3A2419] disabled:opacity-40 hover:bg-[#E6D8C3]/30"
                    >
                      {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </button>
                    <span className="text-xs font-semibold text-[#8B5E3C] tabular-nums">
                      {page} / {totalPages}
                    </span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="p-2 rounded-lg border border-[#E6D8C3] bg-white text-[#3A2419] disabled:opacity-40 hover:bg-[#E6D8C3]/30"
                    >
                      {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </>
            )}

          </div>
        )}

        {/* VIEW 3: BRANDS DIRECTORY */}
        {currentTab === 'brands' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <BrandDirectory
              brands={brands}
              onSelectBrand={(slug) => handleBrandSelect(slug)}
            />
          </div>
        )}

        {/* VIEW 4: CATEGORIES LIST */}
        {currentTab === 'categories' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <CategoryList
              categories={categories}
              onSelectCategory={(slug) => handleCategorySelect(slug)}
            />
          </div>
        )}

        {/* VIEW 5: ABOUT ABAQ */}
        {currentTab === 'about' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-start">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8B5E3C]">
                {language === 'ar' ? 'هوية المتجر وفلسفتنا' : 'Store Identity & Philosophy'}
              </span>
              <h1 className="font-wordmark text-3xl sm:text-4xl font-bold text-[#3A2419]">
                {language === 'ar' ? 'عَبَق — جامع نفائس الطيب والعود' : 'ABAQ — The Multi-Brand Perfume Sanctuary'}
              </h1>
            </div>

            <div className="prose prose-stone text-sm text-[#3A2419]/85 leading-relaxed space-y-4">
              <p>
                انطلقت منصة <strong>عَبَق | ABAQ</strong> لتكون الرابط الموثوق بين عشاق العطور الشرقية الأصيلة وبين كبرى دور العطور العريقة في الخليج العربي. نحن نؤمن بأن كل دار عطرية تمتلك تاريخاً فريداً، وسراً في استخلاص الزيوت، وأسلوباً لا يتكرر في تعتيق خشب العود.
              </p>
              <p>
                من هذا المنطلق، لم نشأ أن نكون علامة تجارية أحادية تنافس الدور القائمة، بل فضاءً متكاملاً يتيح لك مقارنة واقتناء أندر خلطات عبدالصمد القرشي، وأرقى معمول الماجد للعود، وأحدث إصدارات الرصاصي وعطور الجزيرة وسويس أربيان، مع ضمان الأصالة الكاملة وسرعة الشحن.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-5 rounded-xl bg-white border border-[#E6D8C3] space-y-2">
                  <h3 className="font-wordmark text-base font-bold text-[#3A2419]">
                    {language === 'ar' ? 'طلب فوري ومباشر عبر واتساب' : 'Direct WhatsApp Orders'}
                  </h3>
                  <p className="text-xs text-[#3A2419]/70 leading-relaxed">
                    تتم المراسلة وتأكيد الطلب مباشرة على رقم كونسيرج عَبَق (+967718488431). لا نلزمك بإنشاء حساب ولا نقوم بتخزين تفاصيل بطاقتك الائتمانية.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-white border border-[#E6D8C3] space-y-2">
                  <h3 className="font-wordmark text-base font-bold text-[#3A2419]">
                    {language === 'ar' ? 'تحقق حي وموثوق من الأسعار' : 'Verified Live Pricing'}
                  </h3>
                  <p className="text-xs text-[#3A2419]/70 leading-relaxed">
                    قبل كل عملية إرسال، يتحقق النظام مباشرة من الخادم لضمان دقة السعر المحدث بالريال السعودي وتوفر الصنف قبل الشحن.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onBrandClick={(slug) => handleBrandSelect(slug)}
      />

      {/* Admin Console Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        brands={brands}
        categories={categories}
        products={products}
        settings={settings}
        isSupabaseConnected={isSupabaseConnected}
        onRefreshData={loadData}
      />

      {/* Informational Policy Modal */}
      <InfoPagesModal
        slug={infoPageSlug}
        onClose={() => setInfoPageSlug(null)}
      />

      {/* Footer */}
      <Footer
        onOpenPage={(slug) => setInfoPageSlug(slug)}
        settings={settings}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </LanguageProvider>
  );
}
