import { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en';
import de from '../locales/de';
import tr from '../locales/tr';

const translations = { en, de, tr };

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  const t = translations[language] || translations.en;

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = t.dir;
    document.documentElement.lang = language;
  }, [language, t.dir]);

  const changeLanguage = (lang) => {
    if (translations[lang]) setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, dir: t.dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
