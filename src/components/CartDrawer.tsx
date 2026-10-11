import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, AlertTriangle, Check, Copy, ArrowRight, ArrowLeft, MapPin, Navigation, CreditCard, Banknote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { CustomerDeliveryDetails } from '../types';

export const CartDrawer: React.FC = () => {
  const { language, formatCurrency, currency, t, isRTL } = useLanguage();
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
    confirmOrderAndDispatch,
    generateWhatsAppLink,
  } = useCart();

  const [step, setStep] = useState<'cart' | 'review'>('cart');
  
  // Mandatory delivery details state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [cityAndAddress, setCityAndAddress] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank_transfer'>('cod');
  const [notes, setNotes] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isCartOpen) return null;

  const handleProceedToReview = async () => {
    const verified = await verifyCart();
    if (verified) {
      setStep('review');
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setValidationError(language === 'ar' ? 'خدمة تحديد الموقع غير مدعومة في هذا المتصفح' : 'Geolocation is not supported by this browser');
      return;
    }
    setIsLocating(true);
    setValidationError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const url = `https://maps.google.com/?q=${pos.coords.latitude},${pos.coords.longitude}`;
        setGoogleMapsUrl(url);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocating(false);
        setValidationError(
          language === 'ar'
            ? 'تعذر الوصول للموقع التلقائي. يرجى تفعيل إذن الموقع أو نسخ رابط موقعك يدوياً من تطبيق خرائط جوجل.'
            : 'Could not access location automatically. Please enable permission or paste your Google Maps link manually.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const getDeliveryData = (): CustomerDeliveryDetails | null => {
    if (!fullName.trim()) {
      setValidationError(language === 'ar' ? 'يرجى إدخال الاسم بالكامل' : 'Please enter your full name');
      return null;
    }
    if (!phone.trim()) {
      setValidationError(language === 'ar' ? 'يرجى إدخال رقم الهاتف للتواصل' : 'Please enter your contact phone');
      return null;
    }
    if (!cityAndAddress.trim()) {
      setValidationError(language === 'ar' ? 'يرجى كتابة المدينة والعنوان بالتفصيل' : 'Please enter your detailed address');
      return null;
    }
    if (!googleMapsUrl.trim()) {
      setValidationError(language === 'ar' ? 'يرجى تحديد موقعك من خرائط جوجل أو الضغط على زر تحديد الموقع' : 'Please provide your Google Maps location link');
      return null;
    }

    setValidationError('');
    return {
      fullName: fullName.trim(),
      phone: phone.trim(),
      cityAndAddress: cityAndAddress.trim(),
      googleMapsUrl: googleMapsUrl.trim(),
      paymentMethod,
      notes: notes.trim() || undefined,
    };
  };

  const currencySymbol = currency === 'YER' ? (language === 'ar' ? 'ر.ي' : 'YER') : (language === 'ar' ? 'ر.س' : 'SAR');

  const handleLaunchWhatsApp = () => {
    const data = getDeliveryData();
    if (!data) return;

    // confirmOrderAndDispatch opens WhatsApp link and immediately empties the cart per requirement
    confirmOrderAndDispatch(data, currencySymbol, language);
  };

  const handleCopyText = () => {
    const data = getDeliveryData();
    if (!data) return;

    const linkData = generateWhatsAppLink(data, currencySymbol, language);
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
          /* STEP 2: MANDATORY DELIVERY DETAILS & PAYMENT OPTIONS */
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-start">
            {/* Validation Error Banner */}
            {validationError && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-300 text-red-900 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-semibold">{validationError}</span>
              </div>
            )}

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

            {/* Verified Items Summary */}
            <div className="bg-[#E6D8C3]/30 rounded-xl p-3.5 border border-[#E6D8C3] space-y-1.5 text-xs">
              <span className="font-semibold text-[#8B5E3C] block uppercase tracking-wider">
                {language === 'ar' ? 'ملخص الأصناف:' : 'Items Summary:'}
              </span>
              {verificationResult?.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-baseline border-b border-[#E6D8C3]/40 pb-1 last:border-0 last:pb-0">
                  <div className="truncate max-w-[240px]">
                    <span className="font-bold text-[#3A2419]">{item.productNameAr}</span>
                    {item.variantNameAr && <span className="text-[#8B5E3C] mx-1">({item.variantNameAr})</span>}
                    <span className="text-[#3A2419]/70 mx-1">×{item.quantity}</span>
                  </div>
                  <span className="font-semibold tabular-nums text-[#3A2419] shrink-0">
                    {formatCurrency(item.lineTotalSar)}
                  </span>
                </div>
              ))}
            </div>

            {/* MANDATORY CUSTOMER DETAILS */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#B8906A]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#3A2419]">
                  {t('mandatoryDeliveryTitle')}
                </h4>
              </div>
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#3A2419] mb-1">
                  {t('fullNameRequired')}
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  placeholder={language === 'ar' ? 'الاسم الثلاثي أو اللقب...' : 'Your full name...'}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-[#E6D8C3] focus:border-[#B8906A] focus:outline-none"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-[#3A2419] mb-1">
                  {t('phoneRequired')}
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  placeholder={language === 'ar' ? 'مثال: 771234567 أو 0501234567' : 'Phone number...'}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-[#E6D8C3] focus:border-[#B8906A] focus:outline-none"
                  required
                />
              </div>

              {/* City & Address */}
              <div>
                <label className="block text-xs font-semibold text-[#3A2419] mb-1">
                  {t('cityAndAddressRequired')}
                </label>
                <input
                  type="text"
                  value={cityAndAddress}
                  onChange={(e) => {
                    setCityAndAddress(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  placeholder={language === 'ar' ? 'مثال: صنعاء - حي حدة - جوار مسجد...' : 'City, neighborhood, street...'}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-[#E6D8C3] focus:border-[#B8906A] focus:outline-none"
                  required
                />
              </div>

              {/* Google Maps Location */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#3A2419]">
                    {t('googleMapsLocation')}
                  </label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8B5E3C] hover:text-[#3A2419] transition-colors"
                  >
                    <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
                    <span>{isLocating ? (language === 'ar' ? 'جاري التحديد...' : 'Locating...') : t('getCurrentLocation')}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={googleMapsUrl}
                  onChange={(e) => {
                    setGoogleMapsUrl(e.target.value);
                    if (validationError) setValidationError('');
                  }}
                  placeholder={language === 'ar' ? 'https://maps.google.com/?q=... أو رابط الموقع' : 'Paste Google Maps link or click auto-detect'}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-[#E6D8C3] focus:border-[#B8906A] focus:outline-none font-mono text-[11px]"
                  required
                />
              </div>

              {/* Payment Method Selector */}
              <div className="pt-1">
                <label className="block text-xs font-semibold text-[#3A2419] mb-1.5">
                  {t('paymentMethod')}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs text-start transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#3A2419] bg-[#3A2419] text-[#F7F2E9] shadow-xs'
                        : 'border-[#E6D8C3] bg-white text-[#3A2419] hover:bg-[#E6D8C3]/20'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-[#B8906A] shrink-0" />
                    <div>
                      <span className="font-bold block">{language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
                      <span className="text-[10px] opacity-80">{language === 'ar' ? 'تسليم نقدي للمندوب' : 'Pay when received'}</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs text-start transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#3A2419] bg-[#3A2419] text-[#F7F2E9] shadow-xs'
                        : 'border-[#E6D8C3] bg-white text-[#3A2419] hover:bg-[#E6D8C3]/20'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#B8906A] shrink-0" />
                    <div>
                      <span className="font-bold block">{language === 'ar' ? 'إيداع / تحويل بنكي' : 'Bank Transfer'}</span>
                      <span className="text-[10px] opacity-80">{language === 'ar' ? 'إرسال السند بالواتساب' : 'Via WhatsApp receipt'}</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Optional Notes */}
              <div>
                <label className="block text-xs font-semibold text-[#3A2419] mb-1">
                  {t('customerNotes')}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'ar' ? 'أي تعليمات للتغليف كهدية أو وقت التوصيل...' : 'Special gifting or delivery notes...'}
                  className="w-full text-xs px-3 py-2 bg-white rounded-lg border border-[#E6D8C3] focus:border-[#B8906A] focus:outline-none resize-none"
                />
              </div>
            </div>

            <p className="text-[11px] text-[#3A2419]/70 bg-[#E6D8C3]/20 p-2.5 rounded-lg border border-[#E6D8C3]/50">
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
                    <span>{language === 'ar' ? 'متابعة بيانات الاستلام والدفع' : 'Proceed to Delivery & Payment'}</span>
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
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-medium text-[#3A2419] bg-[#E6D8C3]/60 hover:bg-[#E6D8C3] border border-[#B8906A]/30 transition-colors"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t('orderCopied') : t('copyOrderSummary')}</span>
                  </button>

                  <button
                    onClick={() => setStep('cart')}
                    className="py-2 px-3 rounded-lg text-xs font-medium text-[#8B5E3C] hover:text-[#3A2419] hover:bg-[#E6D8C3]/40 transition-colors"
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
