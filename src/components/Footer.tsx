import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { InfoPageSlug } from './InfoPagesModal';
import { StoreSettings } from '../types';

interface FooterProps {
  onOpenPage: (slug: InfoPageSlug) => void;
  settings?: StoreSettings;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPage, settings, onOpenAdmin }) => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-[#3A2419] text-[#F7F2E9] border-t border-[#8B5E3C]/30 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 text-start">
          
          {/* Brand Info & Social Media Links (5 cols) */}
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

            {/* Direct WhatsApp Concierge Button */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${(settings?.whatsapp_number || '+967718488431').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#8B5E3C]/40 hover:bg-[#8B5E3C] text-xs font-semibold text-[#E6D8C3] transition-colors border border-[#B8906A]/30"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>{settings?.whatsapp_number || '+967 718 488 431'}</span>
              </a>
            </div>

            {/* Social Media Links (Instagram, TikTok, Facebook) */}
            <div className="pt-2">
              <span className="block text-[11px] uppercase tracking-wider text-[#B8906A] mb-2 font-semibold">
                {language === 'ar' ? 'تابعونا على منصات التواصل:' : 'Follow Us:'}
              </span>
              <div className="flex items-center gap-2.5">
                {/* Instagram */}
                <a
                  href={settings?.instagram_url || 'https://instagram.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#8B5E3C]/30 hover:bg-[#B8906A] text-[#E6D8C3] hover:text-[#3A2419] flex items-center justify-center transition-all border border-[#8B5E3C]/40 text-xs font-bold"
                  title="Instagram"
                  aria-label="Instagram"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* TikTok */}
                <a
                  href={settings?.tiktok_url || 'https://tiktok.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#8B5E3C]/30 hover:bg-[#B8906A] text-[#E6D8C3] hover:text-[#3A2419] flex items-center justify-center transition-all border border-[#8B5E3C]/40 text-xs font-bold"
                  title="TikTok"
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31 0 2.6.43 3.66 1.23a6.83 6.83 0 0 0 3.82 1.34v3.52a8.87 8.87 0 0 1-3.83-1.04v7.71c0 4.14-3.37 7.5-7.52 7.5a7.51 7.51 0 0 1-7.51-7.5 7.5 7.5 0 0 1 6.85-7.46v3.6a3.9 3.9 0 0 0-3.25 3.86 3.9 3.9 0 0 0 3.9 3.9 3.9 3.9 0 0 0 3.9-3.9V0h-.02z"/>
                  </svg>
                </a>

                {/* Facebook */}
                <a
                  href={settings?.facebook_url || 'https://facebook.com'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-[#8B5E3C]/30 hover:bg-[#B8906A] text-[#E6D8C3] hover:text-[#3A2419] flex items-center justify-center transition-all border border-[#8B5E3C]/40 text-xs font-bold"
                  title="Facebook"
                  aria-label="Facebook"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
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
            </ul>
          </div>

        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 border-t border-[#8B5E3C]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E6D8C3]/60">
          <p>© {new Date().getFullYear()} {t('rightsReserved')}.</p>
          <div className="flex items-center gap-4 text-[11px] text-[#B8906A]">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hover:text-white transition-colors underline underline-offset-4 flex items-center gap-1"
              >
                <span>{language === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'}</span>
              </button>
            )}
            <span>عَبَق — متجر العطور والعود الأصيل</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
