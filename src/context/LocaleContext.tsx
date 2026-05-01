import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { type Locale } from "@/lib/i18n";

type Bilingual = { readonly en: string; readonly ar: string };

interface LocaleCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (entry: Bilingual) => string;
}

const LocaleContext = createContext<LocaleCtx | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");

  const t = useCallback(
    (entry: Bilingual) => (locale === "ar" ? entry.ar : entry.en),
    [locale]
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
