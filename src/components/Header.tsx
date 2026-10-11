import React from 'react';
import { ShoppingBag, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const { language, setLanguage, t } = useLanguage();
  const { totalItems, setIsCartOpen } = useCart();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F7F2E9]/95 backdrop-blur-md border-b border-[#E6D8C3] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element with luxury bilingual lockup) */}
        <button
          onClick={() => setCurrentTab('home')}
          className="text-start whitespace-nowrap shrink-0 group focus:outline-none"
        >
          <div className="flex items-baseline gap-2.5">
            <span className="font-wordmark text-3xl font-bold tracking-tight text-[#3A2419] group-hover:text-[#B8906A] transition-colors">
              عَبَق
            </span>
            <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#8B5E3C]">
              ABAQ
            </span>
          </div>
        </button>

        {/* Zone 2: 4–5 single-line navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#3A2419]">
          <button
            onClick={() => setCurrentTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#B8906A] ${
              currentTab === 'home' ? 'text-[#8B5E3C] font-semibold border-b-2 border-[#B8906A]' : 'text-[#3A2419]/80'
            }`}
          >
            {t('navHome')}
          </button>
          <button
            onClick={() => setCurrentTab('catalog')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#B8906A] ${
              currentTab === 'catalog' ? 'text-[#8B5E3C] font-semibold border-b-2 border-[#B8906A]' : 'text-[#3A2419]/80'
            }`}
          >
            {t('navCatalog')}
          </button>
          <button
            onClick={() => setCurrentTab('brands')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#B8906A] ${
              currentTab === 'brands' ? 'text-[#8B5E3C] font-semibold border-b-2 border-[#B8906A]' : 'text-[#3A2419]/80'
            }`}
          >
            {t('navBrands')}
          </button>
          <button
            onClick={() => setCurrentTab('categories')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#B8906A] ${
              currentTab === 'categories' ? 'text-[#8B5E3C] font-semibold border-b-2 border-[#B8906A]' : 'text-[#3A2419]/80'
            }`}
          >
            {t('navCategories')}
          </button>
          <button
            onClick={() => setCurrentTab('about')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-[#B8906A] ${
              currentTab === 'about' ? 'text-[#8B5E3C] font-semibold border-b-2 border-[#B8906A]' : 'text-[#3A2419]/80'
            }`}
          >
            {t('navAbout')}
          </button>
        </nav>

        {/* Zone 3: Primary Action & Utilities (Admin Shield Hidden, accessible only via Ctrl+M) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#3A2419] bg-[#E6D8C3]/50 hover:bg-[#E6D8C3] rounded-md transition-colors whitespace-nowrap shrink-0"
            title="تغيير اللغة / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#8B5E3C]" />
            <span>{language === 'ar' ? 'English' : 'العربية'}</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#F7F2E9] bg-[#3A2419] hover:bg-[#2A1810] rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <ShoppingBag className="w-4 h-4 text-[#B8906A]" />
            <span className="hidden sm:inline">{t('cartTitle')}</span>
            {totalItems > 0 && (
              <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-bold text-[#3A2419] bg-[#B8906A] rounded-full tabular-nums">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
