import React from 'react';
import { X, ShieldCheck, Truck, RotateCcw, FileText, Phone, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export type InfoPageSlug = 'about' | 'shipping' | 'returns' | 'privacy' | 'terms' | 'contact';

interface InfoPagesModalProps {
  slug: InfoPageSlug | null;
  onClose: () => void;
}

export const InfoPagesModal: React.FC<InfoPagesModalProps> = ({ slug, onClose }) => {
  const { language, isRTL } = useLanguage();

  if (!slug) return null;

  const contentMap: Record<
    InfoPageSlug,
    { titleAr: string; titleEn: string; icon: React.ReactNode; bodyAr: React.ReactNode; bodyEn: React.ReactNode }
  > = {
    about: {
      titleAr: 'عن منصة عَبَق للأطياب والعود',
      titleEn: 'About ABAQ Fine Fragrances',
      icon: <Sparkles className="w-5 h-5 text-[#B8906A]" />,
      bodyAr: (
        <div className="space-y-4 text-xs sm:text-sm text-[#3A2419]/80 leading-relaxed text-start">
          <p>
            تأسست <strong>عَبَق | ABAQ</strong> كمنصة متخصصة تجمع تحت سقف واحد أندر وأفخم إبداعات دور العطور الشرقية المرموقة، متجاوزين مفهوم المتجر التقليدي لنكون وجهة عشاق العود الملكي، البخور الطبيعي، والزيوت العطرية النقية.
          </p>
          <p>
            نحن لسنا صانعاً أحادياً، بل منتقياً خبيراً يتعامل مع أعرق البيوت (مثل عبدالصمد القرشي، الماجد للعود، الرصاصي، عطور الجزيرة، وسويس أربيان)، محتفظين بالهوية المستقلة لكل دار ومعايير جودتها الصارمة.
          </p>
          <div className="p-4 bg-[#E6D8C3]/40 rounded-xl border border-[#E6D8C3]">
            <strong className="block text-[#3A2419] font-bold mb-1">فلسفتنا في التجارة المباشرة:</strong>
            نعتمد آلية الطلب المباشر عبر واتساب لضمان خدمة عملاء شخصية، والتأكد من توفر الدفعات المعتقة قبل إتمام أي عملية، مع الحفاظ التام على خصوصية العميل دون تخزين بطاقات أو بيانات مصرفية.
          </div>
        </div>
      ),
      bodyEn: (
        <div className="space-y-4 text-xs sm:text-sm text-[#3A2419]/80 leading-relaxed text-start">
          <p>
            <strong>ABAQ | عَبَق</strong> was conceived as a premier multi-brand sanctuary unifying the rarest artisanal perfumes and authentic agarwood distillations across Arabia.
          </p>
          <p>
            Rather than a single brand, ABAQ serves as an esteemed curator for independent legacy houses, honoring their individual origins and timeless craftsmanship.
          </p>
        </div>
      ),
    },
    shipping: {
      titleAr: 'الشحن والتوصيل',
      titleEn: 'Shipping & Delivery',
      icon: <Truck className="w-5 h-5 text-[#B8906A]" />,
      bodyAr: (
        <div className="space-y-4 text-xs sm:text-sm text-[#3A2419]/80 leading-relaxed text-start">
          <p>
            نوفر شحناً آمناً وسريعاً لكافة المدن في اليمن والمملكة العربية السعودية ودول مجلس التعاون الخليجي:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>صنعاء وعدن:</strong> توصيل خلال 24 - 48 ساعة بواسطة مندوب مباشر.</li>
            <li><strong>باقي المحافظات:</strong> من 2 إلى 4 أيام عمل عبر شركات الشحن المعتمدة.</li>
            <li><strong>المملكة العربية السعودية ودول الخليج:</strong> شحن دولي مبرد وسريع خلال 4 إلى 7 أيام عمل.</li>
          </ul>
          <p>
            يتم تغليف قوارير العود والبخور بأعلى معايير الحماية لضمان وصول النفائس الزجاجية سليمة وبأعلى درجات الأمان.
          </p>
        </div>
      ),
      bodyEn: (
        <div className="space-y-4 text-xs sm:text-sm text-[#3A2419]/80 leading-relaxed text-start">
          <p>
            We offer specialized, climate-conscious courier delivery across Yemen, Saudi Arabia, and GCC countries.
          </p>
        </div>
      ),
    },
    returns: {
      titleAr: 'سياسة الاستبدال والاسترجاع',
      titleEn: 'Returns & Exchange Policy',
      icon: <RotateCcw className="w-5 h-5 text-[#B8906A]" />,
      bodyAr: (
        <div className="space-y-4 text-xs sm:text-sm text-[#3A2419]/80 leading-relaxed text-start">
          <p>
            حرصاً على سلامة وجودة المنتجات العطرية وحساسيتها:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>يحق للعميل استبدال أو استرجاع المنتجات المغلقة بغلاف المصنع الأصلي خلال 3 أيام من الاستلام.</li>
            <li>دهن العود والمسك: يشترط عدم ملامسة الميل الزجاجي للجلد للمحافظة على نقاوة الزيت العطري.</li>
            <li>رقائق العود: يمكن تجربة كسر يسير جداً (أقل من نصف غرام) للتأكد من جودة النكهة والدخان.</li>
          </ul>
        </div>
      ),
      bodyEn: (
        <div className="space-y-4 text-xs sm:text-sm text-[#3A2419]/80 leading-relaxed text-start">
          <p>
            Due to the hygienic nature of luxury attars and flacons, unopened items in original cellophaned boxes may be exchanged within 3 days of delivery.
          </p>
        </div>
      ),
    },
    privacy: {
      titleAr: 'سياسة الخصوصية وأمان البيانات',
      titleEn: 'Privacy & Data Security',
      icon: <ShieldCheck className="w-5 h-5 text-[#B8906A]" />,
      bodyAr: (
        <div className="space-y-4 text-xs sm:text-sm text-[#3A2419]/80 leading-relaxed text-start">
          <p>
            تطبق منصة <strong>عَبَق</strong> نهج الخصوصية الصارمة (Privacy by Design):
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>عدم تخزين الطلبات:</strong> لا نقوم بحفظ سجلات طلباتك أو رسائل المحادثة في قواعد بيانات خارجية.</li>
            <li><strong>عدم تخزين البطاقات:</strong> لا يتم جمع أرقام بطاقات ائتمانية أو بيانات دفع على موقعنا إطلاقاً.</li>
            <li><strong>تواصل مشفر:</strong> محادثاتك عبر واتساب مشفرة بالكامل بين الطرفين (End-to-End Encryption).</li>
          </ul>
        </div>
      ),
      bodyEn: (
        <div className="space-y-4 text-xs sm:text-sm text-[#3A2419]/80 leading-relaxed text-start">
          <p>
            ABAQ operates on a zero-retention checkout policy. No orders, messages, or payment cards are stored on our servers.
          </p>
        </div>
      ),
    },
    terms: {
      titleAr: 'الشروط والأحكام',
      titleEn: 'Terms of Service',
      icon: <FileText className="w-5 h-5 text-[#B8906A]" />,
      bodyAr: (
        <div className="space-y-4 text-xs sm:text-sm text-[#3A2419]/80 leading-relaxed text-start">
          <p>
            باستخدامك لمنصة عَبَق، فإنك تقر بأن الأسعار المعروضة بالريال السعودي (SAR)، وأن الطلب يتم تأكيده عبر إرسال رسالة واتساب رسمية إلى خدمة عملاء المتجر.
          </p>
          <p>
            نحتفظ بحق تعديل أو تحديث أسعار المنتجات حسب أحدث قوائم الموردين الرسميين، ويتم إخطار العميل بأي فرق سعري فوراً قبل الشحن.
          </p>
        </div>
      ),
      bodyEn: (
        <div className="space-y-4 text-xs sm:text-sm text-[#3A2419]/80 leading-relaxed text-start">
          <p>
            By accessing ABAQ, you acknowledge prices are in Saudi Riyal (SAR) and order fulfillment is finalized via direct WhatsApp concierge communication.
          </p>
        </div>
      ),
    },
    contact: {
      titleAr: 'تواصل مع كونسيرج عَبَق',
      titleEn: 'Contact ABAQ Concierge',
      icon: <Phone className="w-5 h-5 text-[#B8906A]" />,
      bodyAr: (
        <div className="space-y-4 text-xs sm:text-sm text-[#3A2419]/80 leading-relaxed text-start">
          <p>
            فريق كونسيرج عَبَق في خدمتكم يومياً لتقديم الاستشارات العطرية وتجهيز طلبات الهدايا والمناسبات:
          </p>
          <div className="space-y-2 bg-[#E6D8C3]/30 p-4 rounded-xl border border-[#E6D8C3]">
            <div><strong>واتساب الطلبات والاستفسارات:</strong> +967718488431</div>
            <div><strong>البريد الإلكتروني:</strong> concierge@abaq-perfumes.com</div>
            <div><strong>ساعات الخدمة:</strong> يومياً من 9:00 صباحاً حتى 11:00 مساءً بتوقيت مكة المكرمة</div>
          </div>
          <button
            onClick={() => window.open('https://wa.me/967718488431', '_blank')}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>فتح محادثة فورية على واتساب</span>
          </button>
        </div>
      ),
      bodyEn: (
        <div className="space-y-4 text-xs sm:text-sm text-[#3A2419]/80 leading-relaxed text-start">
          <p>
            Our dedicated concierge is ready to assist with custom blends, gifting, and immediate orders:
          </p>
          <p>WhatsApp: +967718488431</p>
        </div>
      ),
    },
  };

  const current = contentMap[slug];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-[#F7F2E9] rounded-2xl shadow-2xl border border-[#E6D8C3] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-[#E6D8C3] bg-[#E6D8C3]/20">
          <div className="flex items-center gap-2.5">
            {current.icon}
            <h3 className="font-wordmark text-xl font-bold text-[#3A2419]">
              {language === 'ar' ? current.titleAr : current.titleEn}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8B5E3C] hover:text-[#3A2419] rounded-lg hover:bg-[#E6D8C3]/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          {language === 'ar' ? current.bodyAr : current.bodyEn}
        </div>

        <div className="p-4 border-t border-[#E6D8C3] bg-[#E6D8C3]/20 text-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-[#F7F2E9] bg-[#3A2419] rounded-lg hover:bg-[#2A1810] transition-colors"
          >
            {language === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
