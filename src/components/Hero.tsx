import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, Flame, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onExplore: () => void;
  onExploreBrands: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onExploreBrands }) => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-[#F7F2E9] border-b border-[#E6D8C3] py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content: 7 Columns on Desktop */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-start">
            
            {/* Unboxed Kicker with quiet typographic separator */}
            <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-[#8B5E3C]">
              <span>عَبَق للأطياب الفاخرة</span>
              <span aria-hidden="true">·</span>
              <span>ABAQ MULTI-BRAND SANCTUARY</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#B8906A]">100% أصيل</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-wordmark text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#3A2419] leading-[1.2] text-balance">
              {t('heroTitle')}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#3A2419]/80 font-normal leading-relaxed max-w-2xl">
              {t('heroSubtitle')}
            </p>

            {/* Editorial Features Strip (No static pill sandwiches, clean text markers) */}
            <div className="pt-2 grid grid-cols-3 gap-4 border-t border-[#E6D8C3] text-xs text-[#3A2419]">
              <div>
                <span className="block font-semibold text-[#8B5E3C] text-sm">دور مستقلة</span>
                <span className="text-[#3A2419]/70">أرقى بيوت العطور الشرقية</span>
              </div>
              <div>
                <span className="block font-semibold text-[#8B5E3C] text-sm">طلب مباشر</span>
                <span className="text-[#3A2419]/70">تأكيد فوري عبر واتساب</span>
              </div>
              <div>
                <span className="block font-semibold text-[#8B5E3C] text-sm">أصالة تامة</span>
                <span className="text-[#3A2419]/70">خلاصات نادرة معتمدة</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onExplore}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-[#F7F2E9] bg-[#3A2419] hover:bg-[#2A1810] rounded-lg transition-all shadow-md group"
              >
                <span>{t('exploreCatalog')}</span>
                {isRTL ? (
                  <ArrowLeft className="w-4 h-4 text-[#B8906A] group-hover:-translate-x-1 transition-transform" />
                ) : (
                  <ArrowRight className="w-4 h-4 text-[#B8906A] group-hover:translate-x-1 transition-transform" />
                )}
              </button>

              <button
                onClick={onExploreBrands}
                className="inline-flex items-center justify-center px-5 py-3.5 text-sm font-medium text-[#3A2419] bg-[#E6D8C3]/60 hover:bg-[#E6D8C3] rounded-lg transition-colors border border-[#B8906A]/30"
              >
                {t('ourBrands')}
              </button>
            </div>
          </div>

          {/* Hero Visual Showcase: 5 Columns on Desktop */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] rounded-2xl overflow-hidden border border-[#E6D8C3] shadow-xl bg-[#E6D8C3]/30">
              <img
                src="/src/assets/images/hero_abaq_fragrance_1791722781157.jpg"
                alt="ABAQ Haute Parfumerie & Oud Flacons on Stone Pedestal"
                className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 start-4 end-4 text-white text-xs flex items-center justify-between pointer-events-none">
                <span className="font-wordmark text-base font-semibold text-[#E6D8C3]">
                  نفائس العود والبخور المعتق
                </span>
                <span className="text-[#DFC7AC] font-medium">
                  مختارات حصرية 2026
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
