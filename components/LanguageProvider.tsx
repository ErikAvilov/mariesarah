"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Lang } from "@/lib/data";

interface LanguageContextType {
  lang: Lang;
}

const LanguageContext = createContext<LanguageContextType>({ lang: "fr" });

export function useLanguage() {
  return useContext(LanguageContext);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("fr");

  useEffect(() => {
    const browserLang = navigator.language || "";
    if (browserLang.startsWith("en")) {
      setLang("en");
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang }}>
      {children}
    </LanguageContext.Provider>
  );
}
