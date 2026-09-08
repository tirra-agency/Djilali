import React, {createContext, useContext, useEffect, useState} from 'react'

type Lang = 'fr' | 'ar'

type ContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
}

const LanguageContext = createContext<ContextValue>({lang: 'fr', setLang: () => {}})

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('site-lang') as Lang | null
      return saved || 'fr'
    } catch {
      return 'fr'
    }
  })

  useEffect(() => {
    try { localStorage.setItem('site-lang', lang) } catch {}
    // set document attributes for accessibility, RTL and document title
    document.documentElement.lang = lang === 'fr' ? 'fr' : 'ar'
    if (lang === 'ar') {
      document.body.classList.add('rtl')
      document.documentElement.dir = 'rtl'
      document.title = 'سفيان جيلالي | الموقع الرسمي'
    } else {
      document.body.classList.remove('rtl')
      document.documentElement.dir = 'ltr'
      document.title = 'Soufiane Djilali | Site Officiel'
    }
  }, [lang])

  const setLang = (l: Lang) => setLangState(l)

  return (
    <LanguageContext.Provider value={{lang, setLang}}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)

export default LanguageProvider
