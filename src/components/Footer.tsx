import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
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
                        <li><a href="mailto:contact@djilali.com">Contact</a></li>
                    </ul>
                </div>
                <div className="footer-col social-col">
                    <h4 className="footer-heading">SUIVEZ-MOI</h4>
                    <div className="social-icons">
                        <a href="#" className="social-icon" aria-label="X (Twitter)">&#120143;</a>
                        <a href="#" className="social-icon" aria-label="Facebook">f</a>
                        <a href="#" className="social-icon" aria-label="YouTube">&#9654;</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
