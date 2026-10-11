import React, { useState } from 'react';
import { X, ShoppingBag, Check, MessageCircle, ShieldCheck, Sparkles, Droplets, Wind, Flame } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBrandClick?: (brandSlug: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose, onBrandClick }) => {
  const { language, formatCurrency, t, isRTL } = useLanguage();
  const { addItem, setIsCartOpen } = useCart();

  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(() => {
    return product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
  });

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product.primary_image_url);
  const [added, setAdded] = useState(false);

  const brandName = language === 'ar' ? product.brand?.name_ar : product.brand?.name_en;
  const productName = language === 'ar' ? product.name_ar : product.name_en;
  const description = language === 'ar' ? product.description_ar : product.description_en;

  const currentPrice = selectedVariant ? selectedVariant.price_sar : product.price_sar;
  const currentCompareAt = selectedVariant ? selectedVariant.compare_at_price_sar : product.compare_at_price_sar;
  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;

  const allImages = [product.primary_image_url, ...(product.images || [])].filter(
    (val, idx, arr) => arr.indexOf(val) === idx
  );

  const handleAddToCart = () => {
    addItem(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
      setIsCartOpen(true);
    }, 400);
  };

  const handleDirectWhatsApp = () => {
    const isAr = language === 'ar';
    const variantName = selectedVariant ? (isAr ? selectedVariant.name_ar : selectedVariant.name_en) : '';
    
    let text = isAr
      ? `السلام عليكم، أود الاستفسار والطلب لعطر *${product.name_ar}* من دار *${brandName || 'عَبَق'}*:\n`
      : `Hello, I would like to inquire about *${product.name_en}* by *${brandName || 'ABAQ'}*:\n`;
    
    if (variantName) {
      text += isAr ? `• الخيار/الحجم: ${variantName}\n` : `• Option: ${variantName}\n`;
    }
    text += isAr ? `• رمز المنتج: ${currentSku}\n` : `• SKU: ${currentSku}\n`;
    text += isAr ? `• الكمية: ${quantity}\n` : `• Quantity: ${quantity}\n`;
    text += isAr ? `• السعر: ${formatCurrency(currentPrice)}\n` : `• Price: ${formatCurrency(currentPrice)}\n`;
    text += isAr ? `هل المنتج متاح للشحن الفوري؟` : `Is this ready for immediate shipping?`;

    const url = `https://wa.me/967718488431?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-[#F7F2E9] rounded-2xl shadow-2xl border border-[#E6D8C3] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 z-10 p-2 text-[#3A2419] bg-[#E6D8C3]/80 hover:bg-[#E6D8C3] rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8">
          
          {/* Gallery Column */}
          <div className="space-y-4">
            <div className="aspect-[4/3] sm:aspect-square rounded-xl overflow-hidden bg-[#E6D8C3]/30 border border-[#E6D8C3]">
              <img
                src={selectedImage}
                alt={productName}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Thumbnail selector */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImage === img ? 'border-[#B8906A] shadow-xs' : 'border-[#E6D8C3] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* House Authenticity Seal */}
            <div className="p-4 rounded-xl bg-[#E6D8C3]/40 border border-[#E6D8C3] text-xs text-[#3A2419] flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[#8B5E3C] shrink-0" />
              <div>
                <span className="font-semibold block">{language === 'ar' ? 'ضمان الأصالة 100%' : '100% Guaranteed Authenticity'}</span>
                <span className="text-[#3A2419]/70">
                  {language === 'ar'
                    ? 'جميع أصناف العود والزيوت أصلية ومستوردة مباشرة من مصادرها الرسمية.'
                    : 'All fragrances and oud oils are authentic, sealed directly from official houses.'}
                </span>
              </div>
            </div>
          </div>

          {/* Contiguous Purchase Module & Olfactory Pyramid */}
          <div className="flex flex-col justify-between space-y-6 text-start">
            <div className="space-y-4">
              {/* Brand Affiliation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (onBrandClick && product.brand?.slug) {
                      onClose();
                      onBrandClick(product.brand.slug);
                    }
                  }}
                  className="text-xs font-semibold uppercase tracking-widest text-[#8B5E3C] hover:text-[#3A2419] hover:underline transition-colors"
                >
                  {brandName || 'عَبَق'}
                </button>
                <span className="text-xs text-[#8B5E3C]/70 tabular-nums">
                  {t('skuLabel')}: {currentSku}
                </span>
              </div>

              {/* Title */}
              <h2 className="font-wordmark text-2xl sm:text-3xl font-bold text-[#3A2419] leading-tight">
                {productName}
              </h2>

              {/* Price Row */}
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#3A2419] tabular-nums">
                  {formatCurrency(currentPrice)}
                </span>
                {currentCompareAt && currentCompareAt > currentPrice && (
                  <span className="text-sm line-through text-[#8B5E3C]/70 tabular-nums">
                    {formatCurrency(currentCompareAt)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-[#3A2419]/80 leading-relaxed">
                {description}
              </p>

              {/* Olfactory Pyramid (If available) */}
              {(product.notes_top_ar || product.notes_heart_ar || product.notes_base_ar) && (
                <div className="pt-2 border-t border-[#E6D8C3] space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B5E3C] flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-[#B8906A]" />
                    {t('fragranceNotes')}
                  </h4>
                  <div className="grid grid-cols-1 gap-1.5 text-xs">
                    {product.notes_top_ar && (
                      <div className="flex items-start gap-2">
                        <span className="text-[#8B5E3C] font-medium shrink-0">{t('topNotes')}:</span>
                        <span className="text-[#3A2419]/80">{language === 'ar' ? product.notes_top_ar : product.notes_top_en}</span>
                      </div>
                    )}
                    {product.notes_heart_ar && (
                      <div className="flex items-start gap-2">
                        <span className="text-[#8B5E3C] font-medium shrink-0">{t('heartNotes')}:</span>
                        <span className="text-[#3A2419]/80">{language === 'ar' ? product.notes_heart_ar : product.notes_heart_en}</span>
                      </div>
                    )}
                    {product.notes_base_ar && (
                      <div className="flex items-start gap-2">
                        <span className="text-[#8B5E3C] font-medium shrink-0">{t('baseNotes')}:</span>
                        <span className="text-[#3A2419]/80">{language === 'ar' ? product.notes_base_ar : product.notes_base_en}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-[#E6D8C3]">
                  <label className="block text-xs font-semibold text-[#8B5E3C]">
                    {t('selectVariant')}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-2 text-xs rounded-lg border transition-all text-start ${
                          selectedVariant?.id === v.id
                            ? 'bg-[#3A2419] text-[#F7F2E9] border-[#3A2419] shadow-xs'
                            : 'bg-[#E6D8C3]/50 text-[#3A2419] border-[#E6D8C3] hover:border-[#B8906A]'
                        }`}
                      >
                        <span className="font-semibold block">{language === 'ar' ? v.name_ar : v.name_en}</span>
                        <span className="text-[11px] opacity-80 tabular-nums">{formatCurrency(v.price_sar)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-semibold text-[#8B5E3C]">
                  {language === 'ar' ? 'الكمية:' : 'Quantity:'}
                </span>
                <div className="flex items-center border border-[#E6D8C3] bg-[#E6D8C3]/30 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-sm font-bold text-[#3A2419] hover:bg-[#E6D8C3] transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold text-[#3A2419] tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-sm font-bold text-[#3A2419] hover:bg-[#E6D8C3] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Cart + Instant WhatsApp */}
            <div className="space-y-2.5 pt-4 border-t border-[#E6D8C3]">
              <button
                onClick={handleAddToCart}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-semibold text-[#F7F2E9] bg-[#3A2419] hover:bg-[#2A1810] shadow-md transition-all active:scale-[0.99]"
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5 text-emerald-400" />
                    <span>{t('addedToCart')}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-[#B8906A]" />
                    <span>{t('addToCart')} — {formatCurrency(currentPrice * quantity)}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDirectWhatsApp}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-xs font-semibold text-[#3A2419] bg-[#E6D8C3]/70 hover:bg-[#E6D8C3] border border-[#B8906A]/40 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>{language === 'ar' ? 'طلب فوري ومباشر لهذا العطر عبر واتساب' : 'Direct WhatsApp Inquiry for this Scent'}</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
