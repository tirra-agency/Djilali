import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type Lang = 'fr' | 'ar';

type ContextValue = {
  lang: Lang;
  setLang: (l: Lang, targetSlug?: string) => void;
  alternateSlug: string | null;
  setAlternateSlug: (slug: string | null) => void;
};

const LanguageContext = createContext<ContextValue>({
  lang: 'fr',
  setLang: () => {},
  alternateSlug: null,
  setAlternateSlug: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine initial language from path, then localStorage, then default to 'fr'
  const getInitialLang = (): Lang => {
    if (location.pathname.startsWith('/ar')) return 'ar';
    if (location.pathname.startsWith('/fr')) return 'fr';
    try {
      const saved = localStorage.getItem('site-lang') as Lang | null;
      if (saved === 'ar' || saved === 'fr') return saved;
    } catch {}
    return 'fr';
  };

  const [lang, setLangState] = useState<Lang>(getInitialLang);
  const [alternateSlug, setAlternateSlug] = useState<string | null>(null);

  // Sync state whenever the URL prefix changes
  useEffect(() => {
    if (location.pathname.startsWith('/ar') && lang !== 'ar') {
      setLangState('ar');
    } else if (location.pathname.startsWith('/fr') && lang !== 'fr') {
      setLangState('fr');
    }
  }, [location.pathname, lang]);

  // Keep DOM, title and localStorage updated
  useEffect(() => {
    try {
      localStorage.setItem('site-lang', lang);
    } catch {}

    document.documentElement.lang = lang;
    if (lang === 'ar') {
      document.body.classList.add('rtl');
      document.documentElement.dir = 'rtl';
      document.title = 'سفيان جيلالي | الموقع الرسمي';
    } else {
      document.body.classList.remove('rtl');
      document.documentElement.dir = 'ltr';
      document.title = 'Soufiane Djilali | Site Officiel';
    }
  }, [lang]);

  // Clear alternate slug on route navigation (unless it's an article detail reload)
  useEffect(() => {
    if (!location.pathname.includes('/writings/')) {
      setAlternateSlug(null);
    }
  }, [location.pathname]);

  const setLang = useCallback(
    (newLang: Lang, targetSlug?: string) => {
      setLangState(newLang);
      try {
        localStorage.setItem('site-lang', newLang);
      } catch {}

      // Check if currently on an article detail route: /fr/writings/:slug or /ar/writings/:slug
      const articleMatch = location.pathname.match(/^\/(?:fr|ar)\/writings\/([^/?#]+)/);
      if (articleMatch) {
        const slugToUse = targetSlug || alternateSlug || articleMatch[1];
        navigate(`/${newLang}/writings/${slugToUse}`);
        return;
      }

      // Check other detail routes or general pages
      const cleanPath = location.pathname.replace(/^\/(?:fr|ar)(?=\/|$)/, '') || '';
      const nextPath = cleanPath === '' || cleanPath === '/' ? `/${newLang}` : `/${newLang}${cleanPath}`;
      navigate(`${nextPath}${location.search}${location.hash}`);
    },
    [location.pathname, location.search, location.hash, alternateSlug, navigate]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, alternateSlug, setAlternateSlug }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageProvider;
