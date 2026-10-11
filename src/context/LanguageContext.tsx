import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'ar' | 'en';
export type Currency = 'SAR' | 'YER';

interface Translations {
  [key: string]: {
    ar: string;
    en: string;
  };
}

export const DICTIONARY: Translations = {
  // Brand & Nav
  storeName: { ar: 'عَبَق', en: 'ABAQ' },
  storeSubtitle: { ar: 'أفخم دور العطور والعود', en: 'Fine Fragrances & Agarwood' },
  navHome: { ar: 'الرئيسية', en: 'Home' },
  navCatalog: { ar: 'المتجر والمنتجات', en: 'Catalog' },
  navBrands: { ar: 'الدور والعلامات', en: 'Brands' },
  navCategories: { ar: 'التصنيفات', en: 'Categories' },
  navAbout: { ar: 'عن عَبَق', en: 'About' },
  navAdmin: { ar: 'لوحة الإدارة', en: 'Admin' },
  
  // Hero
  heroKicker: { ar: 'منصة العطور والعود الفاخر', en: 'Haute Parfumerie & Pure Agarwood' },
  heroTitle: { ar: 'عبير الشرق بنفحات ملكية أصيلة', en: 'Authentic Royal Scents & Timeless Agarwood' },
  heroSubtitle: { ar: 'ملاذ يجمع أندر إبداعات أشهر بيوت العطور الشرقية، دهن العود المعتق، والبخور النادر تحت سقف واحد.', en: 'A curated sanctuary assembling the rarest distillations from iconic Arabian fragrance houses.' },
  exploreCatalog: { ar: 'استكشف المقتنيات', en: 'Explore Collection' },
  ourBrands: { ar: 'دور العطور الشريكة', en: 'Partner Houses' },

  // Catalog & Filter
  searchPlaceholder: { ar: 'ابحث باسم العطر، العلامة التجارية، المكونات، أو الرمز...', en: 'Search fragrance name, brand, notes, or SKU...' },
  allCategories: { ar: 'جميع التصنيفات', en: 'All Categories' },
  allBrands: { ar: 'جميع الدور', en: 'All Brands' },
  filterByPrice: { ar: 'نطاق السعر', en: 'Price Range' },
  sortBy: { ar: 'الترتيب حسب', en: 'Sort By' },
  sortNewest: { ar: 'الأحدث أولاً', en: 'Newest Arrivals' },
  sortPriceAsc: { ar: 'السعر: من الأقل للأعلى', en: 'Price: Low to High' },
  sortPriceDesc: { ar: 'السعر: من الأعلى للأقل', en: 'Price: High to Low' },
  sortFeatured: { ar: 'المميزة والمختارة', en: 'Featured Selection' },
  resetFilters: { ar: 'إعادة ضبط الفلاتر', en: 'Reset Filters' },
  noProductsFound: { ar: 'لا توجد منتجات معروضة حالياً.', en: 'No fragrances available at this moment.' },
  resultsCount: { ar: 'عنصر متاح', en: 'items available' },

  // Product Card & PDP
  addToCart: { ar: 'إضافة للسلة', en: 'Add to Cart' },
  addedToCart: { ar: 'تمت الإضافة', en: 'Added' },
  viewDetails: { ar: 'تفاصيل العطر', en: 'View Details' },
  sarCurrency: { ar: 'ر.س', en: 'SAR' },
  yerCurrency: { ar: 'ر.ي', en: 'YER' },
  brandLabel: { ar: 'الدار المصنعة', en: 'Fragrance House' },
  skuLabel: { ar: 'رمز المنتج SKU', en: 'SKU' },
  fragranceNotes: { ar: 'الهرم العطري', en: 'Olfactive Pyramid' },
  topNotes: { ar: 'القمة العطرية', en: 'Top Notes' },
  heartNotes: { ar: 'قلب العطر', en: 'Heart Notes' },
  baseNotes: { ar: 'قاعدة العطر', en: 'Base Notes' },
  selectVariant: { ar: 'اختر الحجم / التولة', en: 'Select Size / Volume' },
  inStock: { ar: 'متوفر', en: 'In Stock' },
  outOfStock: { ar: 'نفد من المخزون', en: 'Out of Stock' },

  // Cart & WhatsApp Checkout
  cartTitle: { ar: 'حقيبة التسوق', en: 'Shopping Bag' },
  cartEmpty: { ar: 'حقيبتك فارغة حالياً', en: 'Your shopping bag is currently empty' },
  cartEmptySubtitle: { ar: 'تصفح تشكيلتنا الفاخرة وأضف نفحاتك المفضلة', en: 'Browse our collection and curate your signature scent' },
  continueShopping: { ar: 'متابعة التسوق', en: 'Continue Shopping' },
  subtotal: { ar: 'المجموع الفرعي', en: 'Subtotal' },
  total: { ar: 'الإجمالي المطلوب', en: 'Total Amount' },
  checkoutViaWhatsApp: { ar: 'إتمام الطلب عبر واتساب', en: 'Order via WhatsApp' },
  whatsAppDisclaimer: { ar: 'يتم إرسال الطلب مباشرة عبر تطبيق واتساب دون الحاجة لبطاقة بنكية أو إنشاء حساب.', en: 'Your selection is sent directly via WhatsApp. No card required and no order data is stored on servers.' },
  verifyingPrices: { ar: 'جاري التحقق من أحدث الأسعار مع المتجر...', en: 'Verifying live prices and availability...' },
  priceDiscrepancyNotice: { ar: 'تنبيه: تم تحديث أسعار بعض المنتجات حسب أحدث قوائم المتجر، يرجى مراجعتها أدناه:', en: 'Notice: Some product prices have been updated to live store rates. Please review below:' },
  
  // Checkout Modal mandatory fields
  mandatoryDeliveryTitle: { ar: 'بيانات الاستلام (إلزامية لتأكيد الطلب)', en: 'Delivery & Contact Details (Required)' },
  fullNameRequired: { ar: 'الاسم بالكامل *', en: 'Full Name *' },
  phoneRequired: { ar: 'رقم الهاتف للتواصل واتساب *', en: 'Contact Phone Number *' },
  cityAndAddressRequired: { ar: 'المدينة والعنوان بالتفصيل *', en: 'City & Detailed Address *' },
  googleMapsLocation: { ar: 'موقع خرائط جوجل (رابط أو إحداثيات GPS) *', en: 'Google Maps Location Link *' },
  getCurrentLocation: { ar: 'تحديد موقعي الحالي من GPS', en: 'Auto-detect My GPS Location' },
  paymentMethod: { ar: 'طريقة الدفع المطلوبة *', en: 'Payment Method *' },
  paymentCod: { ar: 'الدفع عند الاستلام (Cash on Delivery)', en: 'Cash on Delivery (COD)' },
  paymentBank: { ar: 'إيداع / تحويل بنكي عبر الواتساب', en: 'Bank Transfer via WhatsApp' },
  customerNotes: { ar: 'ملاحظات إضافية أو إهداء (اختياري)', en: 'Special Requests / Gifting (Optional)' },
  sendOrderWhatsApp: { ar: 'إرسال وتأكيد الطلب عبر واتساب', en: 'Confirm & Send to WhatsApp' },
  copyOrderSummary: { ar: 'نسخ نص الطلب', en: 'Copy Order Text' },
  orderCopied: { ar: 'تم نسخ الطلب بنجاح', en: 'Order text copied!' },

  // Footer & Info
  footerTagline: { ar: 'عَبَق — المنصة المعتمدة لتسوق أفخر أصناف العود والبخور والعطور الملكية من أشهر الدور العربية.', en: 'ABAQ — The distinguished hub for authentic agarwood, incense, and haute perfumes.' },
  rightsReserved: { ar: 'جميع الحقوق محفوظة لمنصة عَبَق', en: 'All Rights Reserved. ABAQ Platform' },
  shippingReturns: { ar: 'الشحن والتوصيل', en: 'Shipping & Delivery' },
  privacyPolicy: { ar: 'سياسة الخصوصية', en: 'Privacy Policy' },
  termsConditions: { ar: 'الشروط والأحكام', en: 'Terms & Conditions' },
  contactUs: { ar: 'خدمة العملاء والواتساب', en: 'Concierge & WhatsApp' },
  specialOffers: { ar: 'العروض الخاصة والتخفيضات', en: 'Special Offers & Promotions' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  t: (key: keyof typeof DICTIONARY) => string;
  isRTL: boolean;
  formatCurrency: (amount: number) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('abaq_lang');
      return (saved === 'en' || saved === 'ar') ? saved : 'ar';
    } catch {
      return 'ar';
    }
  });

  const [currency, setCurrencyState] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem('abaq_currency');
      return (saved === 'YER' || saved === 'SAR') ? (saved as Currency) : 'SAR';
    } catch {
      return 'SAR';
    }
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    try {
      localStorage.setItem('abaq_lang', language);
    } catch {}
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  useEffect(() => {
    try {
      localStorage.setItem('abaq_currency', currency);
    } catch {}
  }, [currency]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
  };

  const t = (key: keyof typeof DICTIONARY): string => {
    const entry = DICTIONARY[key];
    if (!entry) return String(key);
    return entry[language] || entry.ar;
  };

  const formatCurrency = (amount: number): string => {
    const formatted = new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      maximumFractionDigits: 0,
    }).format(amount);

    if (currency === 'YER') {
      return language === 'ar' ? `${formatted} ر.ي` : `${formatted} YER`;
    }
    return language === 'ar' ? `${formatted} ر.س` : `${formatted} SAR`;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, currency, setCurrency, t, isRTL, formatCurrency }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
