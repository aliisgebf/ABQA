import React from 'react';
import { Category } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { Layers, ArrowLeft, ArrowRight } from 'lucide-react';

interface CategoryListProps {
  categories: Category[];
  onSelectCategory: (categorySlug: string) => void;
}

export const CategoryList: React.FC<CategoryListProps> = ({ categories, onSelectCategory }) => {
  const { language, isRTL } = useLanguage();

  return (
    <div className="space-y-10 py-6 text-start">
      {/* Intro */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8B5E3C] uppercase tracking-wider">
          <Layers className="w-4 h-4 text-[#B8906A]" />
          <span>{language === 'ar' ? 'تصنيفات وعائلات الطيب' : 'Fragrance Families'}</span>
        </div>
        <h2 className="font-wordmark text-3xl sm:text-4xl font-bold text-[#3A2419]">
          {language === 'ar' ? 'العائلات العطرية وأصناف البخور' : 'Olfactory Families & Incense'}
        </h2>
        <p className="text-sm text-[#3A2419]/80 leading-relaxed">
          {language === 'ar'
            ? 'اكتشف مجموعاتنا المصنفة بعناية من العطور المركزة، خشب العود البري، البخور المعمول، وأندر أدهان المسك والعنبر.'
            : 'Explore our finely curated classifications from niche perfumes and wild agarwood chips to royal bakhoor and pure attars.'}
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const catName = language === 'ar' ? cat.name_ar : cat.name_en;
          const description = language === 'ar' ? cat.description_ar : cat.description_en;

          return (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className="group relative rounded-xl overflow-hidden bg-[#F7F2E9] border border-[#E6D8C3] hover:border-[#B8906A] shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Category Imagery */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#E6D8C3]/30">
                <img
                  src={cat.image_url || '/src/assets/images/category_royal_perfumes_1791722807080.jpg'}
                  alt={catName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <h3 className="absolute bottom-3 start-4 end-4 font-wordmark text-lg font-bold text-white drop-shadow-xs">
                  {catName}
                </h3>
              </div>

              {/* Description & Action */}
              <div className="p-4 flex flex-col justify-between flex-1 space-y-4">
                <p className="text-xs text-[#3A2419]/75 line-clamp-2 leading-relaxed">
                  {description}
                </p>

                <div className="pt-2 border-t border-[#E6D8C3] flex items-center justify-between text-xs font-semibold text-[#8B5E3C] group-hover:text-[#3A2419]">
                  <span>{language === 'ar' ? 'تصفح الأصناف' : 'Browse Items'}</span>
                  {isRTL ? (
                    <ArrowLeft className="w-3.5 h-3.5 text-[#B8906A] group-hover:-translate-x-1 transition-transform" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-[#B8906A] group-hover:translate-x-1 transition-transform" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
