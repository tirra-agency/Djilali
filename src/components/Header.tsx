import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="main-header">
            <div className="container header-inner">
                <div className="logo">
                    <img src="/assets/images/Djilali_Logo.svg" alt="Soufiane Djilali Logo" />
                </div>
                <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
                    <ul>
                        <li><NavLink to="/" end>ACCUEIL</NavLink></li>
                        <li><NavLink to="/biography">BIOGRAPHIE</NavLink></li>
                        <li><NavLink to="/writings">ÉCRITS</NavLink></li>
                        <li><NavLink to="/videos">VIDÉOS</NavLink></li>
                        <li><NavLink to="/books">LIVRES</NavLink></li>
                        <li><a href="mailto:contact@djilali.com">CONTACT</a></li>
                        <li className="lang-switcher">
                            <a href="#" className="active">FR</a>
                            <span className="lang-separator">|</span>
                            <a href="#">EN</a>
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
