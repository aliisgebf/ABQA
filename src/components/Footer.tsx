import React from 'react';
import { MessageCircle, Shield, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { InfoPageSlug } from './InfoPagesModal';

interface FooterProps {
  onOpenPage: (slug: InfoPageSlug) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPage, onOpenAdmin }) => {
  const { t, language, isRTL } = useLanguage();

  return (
    <footer className="bg-[#3A2419] text-[#F7F2E9] border-t border-[#8B5E3C]/30 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 text-start">
          
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-baseline gap-2.5">
              <span className="font-wordmark text-3xl font-bold tracking-tight text-[#E6D8C3]">
                عَبَق
              </span>
              <span className="text-xs uppercase tracking-[0.25em] font-medium text-[#B8906A]">
                ABAQ
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#E6D8C3]/80 leading-relaxed max-w-sm">
              {t('footerTagline')}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://wa.me/967718488431"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#8B5E3C]/40 hover:bg-[#8B5E3C] text-xs font-semibold text-[#E6D8C3] transition-colors border border-[#B8906A]/30"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>+967 718 488 431</span>
              </a>
            </div>
          </div>

          {/* Catalog & Houses Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#B8906A]">
              {language === 'ar' ? 'أقسام المتجر' : 'Collections'}
            </h4>
            <ul className="space-y-2 text-xs text-[#E6D8C3]/80">
              <li>
                <button onClick={() => onOpenPage('about')} className="hover:text-white transition-colors">
                  {t('navAbout')}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPage('shipping')} className="hover:text-white transition-colors">
                  {t('shippingReturns')}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPage('contact')} className="hover:text-white transition-colors">
                  {t('contactUs')}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Policies (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#B8906A]">
              {language === 'ar' ? 'السياسات والأمان' : 'Trust & Policies'}
            </h4>
            <ul className="space-y-2 text-xs text-[#E6D8C3]/80">
              <li>
                <button onClick={() => onOpenPage('privacy')} className="hover:text-white transition-colors">
                  {t('privacyPolicy')}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPage('terms')} className="hover:text-white transition-colors">
                  {t('termsConditions')}
                </button>
              </li>
              <li>
                <button onClick={() => onOpenPage('returns')} className="hover:text-white transition-colors">
                  {language === 'ar' ? 'ضمان نقاوة العود والاسترجاع' : 'Oud Purity Guarantee & Returns'}
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-[#B8906A] hover:underline flex items-center gap-1.5 pt-1">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'بوابة إدارة المنصة' : 'Management Console'}</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 border-t border-[#8B5E3C]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E6D8C3]/60">
          <p>© {new Date().getFullYear()} {t('rightsReserved')}.</p>
          <div className="flex items-center gap-2 text-[11px] text-[#B8906A]">
            <span>{t('demoNotice')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
