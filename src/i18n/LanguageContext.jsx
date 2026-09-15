import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from './translations';

const STORAGE_KEY = 'sheerid-lang';
export const SUPPORTED_LANGS = ['en', 'es'];

const LanguageContext = createContext(null);

const resolvePath = (obj, path) => {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return undefined;
    cur = cur[k];
  }
  return cur;
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    return SUPPORTED_LANGS.includes(stored) ? stored : 'en';
  });

  const setLang = useCallback((next) => {
    if (!SUPPORTED_LANGS.includes(next)) return;
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // localStorage unavailable: keep in-memory only
    }
  }, []);

  // t('ui.mode') -> translated string; falls back to English, then to the key itself.
  const t = useCallback(
    (path) => {
      const val = resolvePath(translations[lang], path);
      if (val !== undefined) return val;
      const fallback = resolvePath(translations.en, path);
      return fallback !== undefined ? fallback : path;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
};
