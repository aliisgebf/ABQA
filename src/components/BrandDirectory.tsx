import React from 'react';
import { Brand } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Compass, Sparkles, MapPin, ArrowLeft, ArrowRight } from 'lucide-react';

interface BrandDirectoryProps {
  brands: Brand[];
  onSelectBrand: (brandSlug: string) => void;
}

export const BrandDirectory: React.FC<BrandDirectoryProps> = ({ brands, onSelectBrand }) => {
  const { language, t, isRTL } = useLanguage();

  return (
    <div className="space-y-10 py-6 text-start">
      {/* Intro Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">
          <Compass className="w-4 h-4 text-[#B8906A]" />
          <span>{language === 'ar' ? 'دور العطور والشراكات المستقلة' : 'Independent Fragrance Houses'}</span>
        </div>
        <h2 className="font-wordmark text-3xl sm:text-4xl font-bold text-[#3A2419]">
          {language === 'ar' ? 'دور العطور ونخبة صُنّاع الطيب' : 'Curated Fragrance Houses'}
        </h2>
        <p className="text-sm text-[#3A2419]/80 leading-relaxed">
          {language === 'ar'
            ? 'تلتزم منصة عَبَق بجمع الإبداعات الأصلية من أعرق دور العطور والعود في الخليج والعالم، محتفظين بالهوية الخاصة لكل دار وتاريخها العريق في صناعة العطر.'
            : 'ABAQ proudly curates genuine creations from the most esteemed perfume and agarwood houses, preserving the independent heritage and craftsmanship of each master distiller.'}
        </p>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {brands.map((brand) => {
          const brandName = language === 'ar' ? brand.name_ar : brand.name_en;
          const description = language === 'ar' ? brand.description_ar : brand.description_en;

          return (
            <div
              key={brand.id}
              onClick={() => onSelectBrand(brand.slug)}
              className="group bg-[#F7F2E9] rounded-xl border border-[#E6D8C3] p-6 hover:border-[#B8906A] hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Brand Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-wordmark text-xl font-bold text-[#3A2419] group-hover:text-[#8B5E3C] transition-colors">
                      {brandName}
                    </h3>
                    {brand.country_of_origin && (
                      <div className="flex items-center gap-1.5 text-xs text-[#8B5E3C] mt-1">
                        <MapPin className="w-3 h-3 text-[#B8906A]" />
                        <span>{brand.country_of_origin}</span>
                      </div>
                    )}
                  </div>
                  {brand.is_featured && (
                    <span className="text-[11px] font-medium text-[#B8906A] bg-[#E6D8C3]/40 px-2 py-0.5 rounded border border-[#E6D8C3]">
                      {language === 'ar' ? 'دار مميزة' : 'Featured House'}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-[#3A2419]/75 leading-relaxed line-clamp-3">
                  {description}
                </p>
              </div>

              {/* Action baseline */}
              <div className="mt-6 pt-4 border-t border-[#E6D8C3] flex items-center justify-between text-xs font-semibold text-[#8B5E3C] group-hover:text-[#3A2419]">
                <span>{language === 'ar' ? 'عرض مقتنيات الدار' : 'Explore Creations'}</span>
                {isRTL ? (
                  <ArrowLeft className="w-4 h-4 text-[#B8906A] group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-[#B8906A] group-hover:translate-x-1 transition-transform" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
