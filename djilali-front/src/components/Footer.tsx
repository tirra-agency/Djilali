import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanity/client';
import { useLanguage } from '../contexts/LanguageProvider';
import { t } from '../utils/i18n';

const Footer: React.FC = () => {
    const [settings, setSettings] = useState<any>(null);
    const { lang } = useLanguage();

    useEffect(() => {
        client.fetch(`*[_type == "siteSettings"][0]`)
            .then((data) => {
                setSettings(data);
            })
            .catch(console.error);
    }, []);

    return (
        <footer className="main-footer bg-dark">
            <div className="container footer-grid">
                <div className="footer-col brand-col">
                    <Link to={`/${lang}`}>
                        <img src="/assets/images/Djilali_Logo_light.png" alt="Soufiane Djilali Logo" className="footer-logo" />
                    </Link>
                    <p className="footer-desc">{t('footer_desc', lang)}</p>
                </div>
                <div className="footer-col links-col">
                    <h4 className="footer-heading">{t('quick_links', lang)}</h4>
                    <ul>
                        <li><Link to={`/${lang}/biography`}>{t('biography', lang)}</Link></li>
                        <li><Link to={`/${lang}/writings`}>{t('writings', lang)}</Link></li>
                        <li><Link to={`/${lang}/videos`}>{t('videos', lang)}</Link></li>
                        <li><Link to={`/${lang}/books`}>{t('books', lang)}</Link></li>
                        <li><Link to={`/${lang}/contact`}>{t('contact', lang)}</Link></li>
                    </ul>
                </div>
                <div className="footer-col social-col">
                    <h4 className="footer-heading">{t('follow_me', lang)}</h4>
                    <div className="social-icons">
                        {settings?.twitterUrl && (
                            <a href={settings.twitterUrl} className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                            </a>
                        )}
                        {settings?.facebookUrl && (
                            <a href={settings.facebookUrl} className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                            </a>
                        )}
                        {settings?.youtubeUrl && (
                            <a 
                                href={settings.youtubeUrl} 
                                className="social-icon" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                aria-label="YouTube"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                </svg>
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
