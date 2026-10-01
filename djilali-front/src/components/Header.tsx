import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { client } from '../sanity/client';
import { useLanguage } from '../contexts/LanguageProvider';
import { hasCategoryArabic, getLocalizedCategory } from '../utils/localization';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);
    const { lang, setLang } = useLanguage();

    useEffect(() => {
        client.fetch(`*[_type == "category"] | order(title asc){_id, title, title_ar, slug}`)
            .then(setCategories)
            .catch(console.error);
    }, []);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // In Arabic mode, only show categories that have an Arabic translation in Sanity
    const displayedCategories = lang === 'ar'
        ? categories.filter(hasCategoryArabic)
        : categories;

    return (
        <header className="main-header">
            <div className="container header-inner">
                <div className="logo">
                    <img src="/assets/images/Djilali_Logo.svg" alt="Soufiane Djilali Logo" />
                </div>
                <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li><NavLink to="/" end>{lang === 'ar' ? 'الرئيسية' : 'ACCUEIL'}</NavLink></li>
                        <li><NavLink to="/biography">{lang === 'ar' ? 'السيرة' : 'BIOGRAPHIE'}</NavLink></li>
                        <li className="dropdown-container">
                            <NavLink to="/writings">{lang === 'ar' ? 'المقالات' : 'ÉCRITS'}</NavLink>
                            {displayedCategories.length > 0 && (
                                <ul className="dropdown-menu">
                                    {displayedCategories.map((cat) => (
                                        <li key={cat._id}>
                                            <Link to={`/writings?category=${cat.slug?.current}`} onClick={() => setIsMenuOpen(false)}>
                                                {getLocalizedCategory(cat, lang)}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                        <li><NavLink to="/videos">{lang === 'ar' ? 'فيديوهات' : 'VIDÉOS'}</NavLink></li>
                        <li><NavLink to="/books">{lang === 'ar' ? 'كتب' : 'LIVRES'}</NavLink></li>
                        <li><NavLink to="/contact">{lang === 'ar' ? 'اتصل' : 'CONTACT'}</NavLink></li>
                        <li className="lang-switcher">
                            {lang === 'fr' ? (
                                <button
                                    className="lang-btn-ar"
                                    onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); setLang('ar'); }}
                                    aria-label="Passer en arabe"
                                >
                                    العربية
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => { e.preventDefault(); setIsMenuOpen(false); setLang('fr'); }}
                                    aria-label="Passer en français"
                                >
                                    FR
                                </button>
                            )}
                        </li>
                    </ul>
                </nav>
                <button 
                    className={`mobile-menu-toggle ${isMenuOpen ? 'active' : ''}`} 
                    aria-label="Toggle Menu"
                    onClick={toggleMenu}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
