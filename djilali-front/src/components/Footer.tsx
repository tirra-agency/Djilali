import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { client } from '../sanity/client';

const Footer: React.FC = () => {
    const [settings, setSettings] = useState<any>(null);

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
                    <img src="/assets/images/Djilali_Logo_light.png" alt="Soufiane Djilali Logo" className="footer-logo" />
                    <p className="footer-desc">Réflexions sur l'Algérie contemporaine et les enjeux de la modernité.</p>
                </div>
                <div className="footer-col links-col">
                    <h4 className="footer-heading">LIENS RAPIDES</h4>
                    <ul>
                        <li><Link to="/biography">Biographie</Link></li>
                        <li><Link to="/writings">Écrits</Link></li>
                        <li><Link to="/videos">Vidéos</Link></li>
                        <li><Link to="/books">Livres</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                    </ul>
                </div>
                <div className="footer-col social-col">
                    <h4 className="footer-heading">SUIVEZ-MOI</h4>
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
                        {/* Fallback si aucun lien n'est configuré (optionnel, on peut le laisser vide pour que l'admin comprenne qu'il doit ajouter les liens) */}
                        {!settings?.twitterUrl && !settings?.facebookUrl && !settings?.youtubeUrl && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Liens à configurer</span>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
