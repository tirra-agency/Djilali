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
                            <a href={settings.twitterUrl} className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">&#120143;</a>
                        )}
                        {settings?.facebookUrl && (
                            <a href={settings.facebookUrl} className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
                        )}
                        {settings?.youtubeUrl && (
                            <a href={settings.youtubeUrl} className="social-icon" target="_blank" rel="noopener noreferrer" aria-label="YouTube">&#9654;</a>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
