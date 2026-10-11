import React, { useState } from 'react';
import { ShoppingBag, Check, Eye } from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onBrandClick?: (brandSlug: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect, onBrandClick }) => {
  const { language, formatCurrency, t, isRTL } = useLanguage();
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  const brandName = language === 'ar' ? product.brand?.name_ar : product.brand?.name_en;
  const productName = language === 'ar' ? product.name_ar : product.name_en;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Default to first variant if present, otherwise base product
    const defaultVariant = product.variants && product.variants.length > 0 ? product.variants[0] : undefined;
    addItem(product, defaultVariant, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  };

  const handleBrandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBrandClick && product.brand?.slug) {
      onBrandClick(product.brand.slug);
    }
  };

  return (
    <article
      onClick={() => onSelect(product)}
      className="group relative flex flex-col bg-[#F7F2E9] rounded-xl border border-[#E6D8C3] overflow-hidden hover:border-[#B8906A]/70 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* 65%-75% Visual Image Box with Fallback */}
      <div className="relative aspect-[4/3] sm:aspect-square w-full bg-[#E6D8C3]/30 overflow-hidden">
        <img
          src={product.primary_image_url}
          alt={productName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Elegant fallback to generated category image
            (e.target as HTMLImageElement).src = '/src/assets/images/category_royal_perfumes_1791722807080.jpg';
          }}
        />

        {/* Subtle Single Text Tag if Featured */}
        {product.is_featured && (
          <div className="absolute top-3 start-3 text-[11px] font-medium tracking-wide text-[#3A2419] bg-[#F7F2E9]/90 backdrop-blur-sm px-2.5 py-1 rounded shadow-xs border border-[#E6D8C3]">
            {language === 'ar' ? 'مختارات عَبَق' : 'ABAQ Curated'}
          </div>
        )}

        {/* Quick View Floating Hint */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F7F2E9]/95 text-[#3A2419] text-xs font-semibold shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-[#B8906A]" />
            {t('viewDetails')}
          </span>
        </div>
      </div>

      {/* Content & Metadata Area */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between">
        <div className="space-y-1.5 text-start">
          {/* Brand Kicker with link affordance */}
          <button
            onClick={handleBrandClick}
            className="text-xs font-medium uppercase tracking-wider text-[#8B5E3C] hover:text-[#3A2419] hover:underline transition-colors block truncate"
          >
            {brandName || 'عَبَق'}
          </button>

          {/* Product Title */}
          <h3 className="font-wordmark text-base sm:text-lg font-bold text-[#3A2419] group-hover:text-[#8B5E3C] transition-colors line-clamp-1">
            {productName}
          </h3>

          {/* Quiet Note Snip */}
          {product.notes_top_ar && (
            <p className="text-xs text-[#3A2419]/60 line-clamp-1">
              {language === 'ar' ? product.notes_top_ar : product.notes_top_en}
            </p>
          )}
        </div>

        {/* Price & Add to Cart Baseline */}
        <div className="mt-4 pt-3 border-t border-[#E6D8C3]/60 flex items-center justify-between gap-2">
          <div className="text-start">
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-[#3A2419] tabular-nums">
                {formatCurrency(product.price_sar)}
              </span>
              {product.compare_at_price_sar && product.compare_at_price_sar > product.price_sar && (
                <span className="text-xs line-through text-[#8B5E3C]/60 tabular-nums">
                  {formatCurrency(product.compare_at_price_sar)}
                </span>
              )}
            </div>
            {product.variants && product.variants.length > 1 && (
              <span className="block text-[11px] text-[#8B5E3C]">
                {language === 'ar' ? `${product.variants.length} خيارات متاحة` : `${product.variants.length} options`}
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className={`flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 ${
              justAdded
                ? 'bg-emerald-700 text-white shadow-sm'
                : 'bg-[#3A2419] hover:bg-[#8B5E3C] text-[#F7F2E9]'
            }`}
            title={t('addToCart')}
            aria-label={t('addToCart')}
          >
            {justAdded ? (
              <Check className="w-4 h-4 animate-in zoom-in-50" />
            ) : (
              <ShoppingBag className="w-4 h-4 text-[#B8906A]" />
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
