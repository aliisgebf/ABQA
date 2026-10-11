import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, ProductVariant, CartVerificationResult, CustomerDeliveryDetails } from '../types';
import { verifyCartWithServer } from '../services/catalogService';

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId?: string, quantity?: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isVerifying: boolean;
  verificationResult: CartVerificationResult | null;
  verifyCart: () => Promise<CartVerificationResult | null>;
  generateWhatsAppLink: (
    details: CustomerDeliveryDetails,
    currencySymbol: string,
    language?: 'ar' | 'en'
  ) => { url: string; message: string } | null;
  confirmOrderAndDispatch: (
    details: CustomerDeliveryDetails,
    currencySymbol: string,
    language?: 'ar' | 'en'
  ) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('abaq_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<CartVerificationResult | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('abaq_cart', JSON.stringify(items));
    } catch {
      // storage quota or incognito
    }
  }, [items]);

  const addItem = (product: Product, variant?: ProductVariant, quantity = 1) => {
    const unitPrice = variant ? variant.price_sar : product.price_sar;
    const variantId = variant?.id;

    setItems(prev => {
      const existingIndex = prev.findIndex(
        i => i.productId === product.id && i.variantId === variantId
      );

      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }

      return [
        ...prev,
        {
          productId: product.id,
          variantId,
          quantity,
          product,
          selectedVariant: variant,
          storedPrice: unitPrice,
        },
      ];
    });

    setVerificationResult(null);
    setIsCartOpen(true);
  };

  const removeItem = (productId: string, variantId?: string) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.variantId === variantId)));
    setVerificationResult(null);
  };

  const updateQuantity = (productId: string, variantId?: string, quantity = 1) => {
    if (quantity <= 0) {
      removeItem(productId, variantId);
      return;
    }

    setItems(prev =>
      prev.map(i => {
        if (i.productId === productId && i.variantId === variantId) {
          return { ...i, quantity: Math.min(99, quantity) };
        }
        return i;
      })
    );
    setVerificationResult(null);
  };

  const clearCart = () => {
    setItems([]);
    setVerificationResult(null);
    try {
      localStorage.removeItem('abaq_cart');
    } catch {}
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => {
    const price = item.selectedVariant ? item.selectedVariant.price_sar : item.product.price_sar;
    return sum + price * item.quantity;
  }, 0);

  const verifyCart = async (): Promise<CartVerificationResult | null> => {
    if (items.length === 0) return null;
    setIsVerifying(true);
    try {
      const result = await verifyCartWithServer(items);
      setVerificationResult(result);

      if (result.hasPriceDiscrepancy) {
        setItems(prev =>
          prev.map(item => {
            const verified = result.items.find(
              v => v.productId === item.productId && v.variantId === item.variantId
            );
            if (verified && verified.unitPriceSar !== item.storedPrice) {
              return {
                ...item,
                storedPrice: verified.unitPriceSar,
                product: {
                  ...item.product,
                  price_sar: item.variantId ? item.product.price_sar : verified.unitPriceSar,
                },
                selectedVariant: item.selectedVariant
                  ? { ...item.selectedVariant, price_sar: verified.unitPriceSar }
                  : undefined,
              };
            }
            return item;
          })
        );
      }
      return result;
    } catch (err) {
      console.error('Cart verification error:', err);
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  const generateWhatsAppLink = (
    details: CustomerDeliveryDetails,
    currencySymbol: string,
    lang: 'ar' | 'en' = 'ar'
  ) => {
    if (items.length === 0) return null;

    const targetPhone = verificationResult?.storeWhatsApp || '+967718488431';
    const cleanPhone = targetPhone.replace(/[^0-9]/g, '');

    const isAr = lang === 'ar';
    const verifiedItems = verificationResult?.items;

    let message = '';

    const paymentLabel = details.paymentMethod === 'cod'
      ? (isAr ? 'الدفع عند الاستلام (COD)' : 'Cash on Delivery (COD)')
      : (isAr ? 'إيداع / تحويل بنكي عبر الواتساب' : 'Bank Transfer via WhatsApp');

    if (isAr) {
      message += `السلام عليكم ورحمة الله وبركاته،\n`;
      message += `أود تأكيد طلب العطور التالي من متجر *عَبَق للأطياب والبخور | ABAQ*:\n\n`;
      
      message += `📍 *بيانات المستلم والتوصيل (مؤكدة):*\n`;
      message += `• *الاسم بالكامل:* ${details.fullName}\n`;
      message += `• *رقم الهاتف للتواصل:* ${details.phone}\n`;
      message += `• *المدينة والعنوان:* ${details.cityAndAddress}\n`;
      if (details.googleMapsUrl) {
        message += `• *موقع خرائط جوجل (Google Maps):* ${details.googleMapsUrl}\n`;
      }
      message += `• *طريقة الدفع المحددة:* ${paymentLabel}\n`;
      if (details.notes) {
        message += `• *ملاحظات خاصة:* ${details.notes}\n`;
      }
      message += `\n`;

      message += `📋 *قائمة المقتنيات:*\n`;

      items.forEach((item, index) => {
        const verified = verifiedItems?.find(
          v => v.productId === item.productId && v.variantId === item.variantId
        );
        const unitPrice = verified ? verified.unitPriceSar : item.storedPrice;
        const lineTotal = unitPrice * item.quantity;
        const brandName = verified ? verified.brandNameAr : (item.product.brand?.name_ar || 'عَبَق');
        const variantText = verified?.variantNameAr || item.selectedVariant?.name_ar;

        message += `${index + 1}. *${item.product.name_ar}*\n`;
        message += `   • الدار: ${brandName}\n`;
        if (variantText) message += `   • الحجم / الخيار: ${variantText}\n`;
        message += `   • رمز المنتج SKU: ${item.selectedVariant?.sku || item.product.sku}\n`;
        message += `   • الكمية: ${item.quantity}\n`;
        message += `   • السعر الإفرادي: ${unitPrice.toLocaleString('ar-SA')} ${currencySymbol}\n`;
        message += `   • الإجمالي: ${lineTotal.toLocaleString('ar-SA')} ${currencySymbol}\n\n`;
      });

      const totalAmount = verificationResult ? verificationResult.subtotalSar : subtotal;
      message += `💰 *المجموع الإجمالي المطلوب:* ${totalAmount.toLocaleString('ar-SA')} ${currencySymbol}\n\n`;
      message += `أرجو تأكيد استلام الطلب وتزويدي ببيانات الشحن / التحويل. شكراً لكم!`;
    } else {
      message += `Hello, I would like to confirm my fragrance order with *ABAQ Fine Fragrances*:\n\n`;
      
      message += `📍 *Delivery & Contact Details:*\n`;
      message += `• *Full Name:* ${details.fullName}\n`;
      message += `• *Phone Number:* ${details.phone}\n`;
      message += `• *Address:* ${details.cityAndAddress}\n`;
      if (details.googleMapsUrl) {
        message += `• *Google Maps Location:* ${details.googleMapsUrl}\n`;
      }
      message += `• *Payment Method:* ${paymentLabel}\n`;
      if (details.notes) {
        message += `• *Special Notes:* ${details.notes}\n`;
      }
      message += `\n`;

      message += `📋 *Selected Items:*\n`;

      items.forEach((item, index) => {
        const verified = verifiedItems?.find(
          v => v.productId === item.productId && v.variantId === item.variantId
        );
        const unitPrice = verified ? verified.unitPriceSar : item.storedPrice;
        const lineTotal = unitPrice * item.quantity;
        const brandName = verified ? verified.brandNameEn : (item.product.brand?.name_en || 'ABAQ');
        const variantText = verified?.variantNameEn || item.selectedVariant?.name_en;

        message += `${index + 1}. *${item.product.name_en}*\n`;
        message += `   • House: ${brandName}\n`;
        if (variantText) message += `   • Option: ${variantText}\n`;
        message += `   • SKU: ${item.selectedVariant?.sku || item.product.sku}\n`;
        message += `   • Qty: ${item.quantity}\n`;
        message += `   • Unit Price: ${unitPrice.toLocaleString('en-US')} ${currencySymbol}\n`;
        message += `   • Line Total: ${lineTotal.toLocaleString('en-US')} ${currencySymbol}\n\n`;
      });

      const totalAmount = verificationResult ? verificationResult.subtotalSar : subtotal;
      message += `💰 *Total Amount:* ${totalAmount.toLocaleString('en-US')} ${currencySymbol}\n\n`;
      message += `Please confirm order receipt and dispatch / payment details. Thank you!`;
    }

    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encoded}`;

    return { url, message };
  };

  const confirmOrderAndDispatch = (
    details: CustomerDeliveryDetails,
    currencySymbol: string,
    lang: 'ar' | 'en' = 'ar'
  ): boolean => {
    const link = generateWhatsAppLink(details, currencySymbol, lang);
    if (!link) return false;

    // Trigger anchor navigation safely in iframes
    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Automatically empty the cart after order confirmation per user requirement
    clearCart();
    setIsCartOpen(false);
    return true;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        setIsCartOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isVerifying,
        verificationResult,
        verifyCart,
        generateWhatsAppLink,
        confirmOrderAndDispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
