export type Locale = "en" | "ar";

export const i18n = {
  errors: {
    login: {
      en: "We couldn't sign you in. Please check your username and password.",
      ar: "ما قدرنا نسجّل دخولك. تأكد من اسم المستخدم وكلمة المرور.",
    },
  },
  empty: {
    beneficiary: {
      en: "No meals are available right now. New meals are posted throughout the day, so check back soon!",
      ar: "لا توجد وجبات متاحة الآن. يتم نشر وجبات جديدة طوال اليوم، شيك معنا بعد شوي!",
    },
  },
  error: {
    activeClaim: {
      en: "You already have one active reservation. Please collect it first to ensure food reaches everyone.",
      ar: "عندك حجز نشط حالياً. نرجو استلامه أولاً لضمان وصول الطعام للجميع.",
    },
  },
  fallback: {
    camera: {
      en: "Camera blocked? Enter the 4-digit PIN below.",
      ar: "الكاميرا معطلة؟ أدخل الرمز المكون من ٤ أرقام بالأسفل.",
    },
  },
} as const;
