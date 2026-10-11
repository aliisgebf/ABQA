import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, AlertTriangle, Check, Copy, ArrowRight, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const { language, formatCurrency, t, isRTL } = useLanguage();
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    isVerifying,
    verificationResult,
    verifyCart,
    generateWhatsAppLink,
  } = useCart();

  const [step, setStep] = useState<'cart' | 'review'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isCartOpen) return null;

  const handleProceedToReview = async () => {
    const verified = await verifyCart();
    if (verified) {
      setStep('review');
    }
  };

  const handleLaunchWhatsApp = () => {
    const linkData = generateWhatsAppLink(
      {
        name: customerName.trim() || undefined,
        phone: customerPhone.trim() || undefined,
        city: deliveryCity.trim() || undefined,
        notes: customerNotes.trim() || undefined,
      },
      language
    );

    if (linkData) {
      window.open(linkData.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyText = () => {
    const linkData = generateWhatsAppLink(
      {
        name: customerName.trim() || undefined,
        phone: customerPhone.trim() || undefined,
        city: deliveryCity.trim() || undefined,
        notes: customerNotes.trim() || undefined,
      },
      language
    );

    if (linkData) {
      navigator.clipboard.writeText(linkData.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={() => setIsCartOpen(false)} />

      <aside
        className={`absolute inset-y-0 ${
          isRTL ? 'start-0' : 'end-0'
        } max-w-full w-screen max-w-md bg-[#F7F2E9] shadow-2xl border-x border-[#E6D8C3] flex flex-col z-10 transition-transform duration-300`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E6D8C3] bg-[#F7F2E9]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8B5E3C]" />
            <h2 className="font-wordmark text-xl font-bold text-[#3A2419]">
              {step === 'cart' ? t('cartTitle') : t('checkoutViaWhatsApp')}
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#8B5E3C] hover:text-[#3A2419] rounded-lg hover:bg-[#E6D8C3]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#E6D8C3]/50 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-[#8B5E3C]/60" />
            </div>
            <h3 className="font-wordmark text-lg font-bold text-[#3A2419]">
              {t('cartEmpty')}
            </h3>
            <p className="text-xs text-[#3A2419]/70 max-w-xs">
              {t('cartEmptySubtitle')}
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-2 px-5 py-2.5 text-xs font-semibold text-[#F7F2E9] bg-[#3A2419] rounded-lg hover:bg-[#2A1810] transition-colors"
            >
              {t('continueShopping')}
            </button>
          </div>
        ) : step === 'cart' ? (
          /* STEP 1: CART REVIEW & QUANTITY */
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-[#E6D8C3]/60">
            {items.map((item) => {
              const productName = language === 'ar' ? item.product.name_ar : item.product.name_en;
              const brandName = language === 'ar' ? item.product.brand?.name_ar : item.product.brand?.name_en;
              const variantName = language === 'ar' ? item.selectedVariant?.name_ar : item.selectedVariant?.name_en;
              const unitPrice = item.selectedVariant ? item.selectedVariant.price_sar : item.product.price_sar;

              return (
                <div key={`${item.productId}-${item.variantId || 'base'}`} className="pt-4 first:pt-0 flex gap-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-[#E6D8C3]/30 border border-[#E6D8C3] shrink-0">
                    <img
                      src={item.product.primary_image_url}
                      alt={productName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between text-start">
                    <div>
                      <span className="text-[11px] font-medium uppercase tracking-wider text-[#8B5E3C]">
                        {brandName || 'عَبَق'}
                      </span>
                      <h4 className="text-sm font-bold text-[#3A2419] line-clamp-1">
                        {productName}
                      </h4>
                      {variantName && (
                        <span className="text-xs text-[#3A2419]/70 block">
                          {variantName}
                        </span>
                      )}
                      <span className="text-xs font-semibold text-[#3A2419] tabular-nums block mt-0.5">
                        {formatCurrency(unitPrice)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity stepper */}
                      <div className="flex items-center border border-[#E6D8C3] rounded-md bg-[#E6D8C3]/20">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs font-bold text-[#3A2419] hover:bg-[#E6D8C3]"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-medium tabular-nums text-[#3A2419]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs font-bold text-[#3A2419] hover:bg-[#E6D8C3]"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="text-[#8B5E3C] hover:text-red-700 p-1 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* STEP 2: TRUSTED PRICE VERIFICATION & VOLUNTARY INFO */
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-start">
            {/* Price change alert banner if detected */}
            {verificationResult?.hasPriceDiscrepancy && (
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{t('priceDiscrepancyNotice')}</span>
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {verificationResult.discrepancies.map((d, i) => (
                    <li key={i}>
                      {d.productTitle}: {formatCurrency(d.oldPrice)} ←{' '}
                      <strong className="text-amber-950 font-bold">{formatCurrency(d.newPrice)}</strong>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Verified Order Summary */}
            <div className="bg-[#E6D8C3]/30 rounded-xl p-4 border border-[#E6D8C3] space-y-2 text-xs">
              <span className="font-semibold text-[#8B5E3C] block uppercase tracking-wider">
                {language === 'ar' ? 'ملخص القائمة المعتمدة:' : 'Verified Items Summary:'}
              </span>
              {verificationResult?.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline border-b border-[#E6D8C3]/40 pb-1.5 last:border-0 last:pb-0">
                  <div>
                    <span className="font-bold text-[#3A2419]">{item.productNameAr}</span>
                    {item.variantNameAr && <span className="text-[#8B5E3C] mx-1">({item.variantNameAr})</span>}
                    <span className="text-[#3A2419]/70 mx-1">× {item.quantity}</span>
                  </div>
                  <span className="font-semibold tabular-nums text-[#3A2419]">
                    {formatCurrency(item.lineTotalSar)}
                  </span>
                </div>
              ))}
            </div>

            {/* Voluntary Customer Fields */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8B5E3C]">
                {t('voluntaryDetailsTitle')}
              </h4>
              
              <div>
                <label className="block text-xs font-medium text-[#3A2419] mb-1">
                  {t('customerName')}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: أبو عبدالله' : 'e.g. John Doe'}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-[#E6D8C3] focus:border-[#B8906A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#3A2419] mb-1">
                  {t('deliveryCity')}
                </label>
                <input
                  type="text"
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: صنعاء / الرياض / جدة' : 'e.g. Sanaa / Riyadh / Dubai'}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-[#E6D8C3] focus:border-[#B8906A] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#3A2419] mb-1">
                  {t('customerNotes')}
                </label>
                <textarea
                  rows={2}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder={language === 'ar' ? 'أي تعليمات للتغليف كهدية أو وقت التوصيل...' : 'Any gift packaging or delivery notes...'}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-[#E6D8C3] focus:border-[#B8906A] focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* WhatsApp Guarantee & Disclaimer */}
            <p className="text-[11px] text-[#3A2419]/70 bg-[#E6D8C3]/20 p-3 rounded-lg border border-[#E6D8C3]/50">
              {t('whatsAppDisclaimer')}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E6D8C3] bg-[#F7F2E9] space-y-3">
            {/* Total Row */}
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-[#8B5E3C]">
                {step === 'review' ? t('total') : t('subtotal')}:
              </span>
              <span className="text-xl font-bold text-[#3A2419] tabular-nums">
                {formatCurrency(verificationResult ? verificationResult.subtotalSar : subtotal)}
              </span>
            </div>

            {step === 'cart' ? (
              <button
                onClick={handleProceedToReview}
                disabled={isVerifying}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-[#F7F2E9] bg-[#3A2419] hover:bg-[#2A1810] shadow-md transition-all disabled:opacity-50"
              >
                {isVerifying ? (
                  <span>{t('verifyingPrices')}</span>
                ) : (
                  <>
                    <span>{t('checkoutViaWhatsApp')}</span>
                    {isRTL ? <ArrowLeft className="w-4 h-4 text-[#B8906A]" /> : <ArrowRight className="w-4 h-4 text-[#B8906A]" />}
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={handleLaunchWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-white bg-emerald-700 hover:bg-emerald-800 shadow-md transition-all"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                  <span>{t('sendOrderWhatsApp')}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={handleCopyText}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-medium text-[#3A2419] bg-[#E6D8C3]/60 hover:bg-[#E6D8C3] border border-[#B8906A]/30 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t('orderCopied') : t('copyOrderSummary')}</span>
                  </button>

                  <button
                    onClick={() => setStep('cart')}
                    className="py-2.5 px-4 rounded-lg text-xs font-medium text-[#8B5E3C] hover:text-[#3A2419] hover:bg-[#E6D8C3]/40 transition-colors"
                  >
                    {language === 'ar' ? 'تعديل السلة' : 'Edit Cart'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </aside>
    </div>
  );
};
