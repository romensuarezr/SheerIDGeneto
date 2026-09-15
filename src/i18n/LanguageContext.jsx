import React, { createContext, useContext, useState, useCallback } from 'react';
import { translations } from './translations';

const STORAGE_KEY = 'sheerid-lang';
const CURRENCY_STORAGE_KEY = 'sheerid-currency';
export const SUPPORTED_LANGS = ['en', 'es'];
export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP'];
export const DEFAULT_CURRENCY = 'USD';

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

  const [currency, setCurrencyState] = useState(() => {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem(CURRENCY_STORAGE_KEY) : null;
    return SUPPORTED_CURRENCIES.includes(stored) ? stored : DEFAULT_CURRENCY;
  });

  const setCurrency = useCallback((next) => {
    if (!SUPPORTED_CURRENCIES.includes(next)) return;
    setCurrencyState(next);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, next);
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

  // Single formatting entry point for every monetary amount in the app.
  // Uses the active UI locale and the user-selected currency, so switching
  // either one re-renders all amounts instantly without regenerating data.
  const formatMoney = useCallback(
    (amount) => {
      const n = typeof amount === 'number' ? amount : Number(amount);
      if (!Number.isFinite(n)) return '';
      const tag = (translations[lang] && translations[lang].localeTag) || translations.en.localeTag;
      return new Intl.NumberFormat(tag, { style: 'currency', currency }).format(n);
    },
    [lang, currency]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, currency, setCurrency, formatMoney }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
};
