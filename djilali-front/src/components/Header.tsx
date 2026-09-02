import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { client } from '../sanity/client';

const Header: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        client.fetch(`*[_type == "category"] | order(title asc)`)
            .then(setCategories)
            .catch(console.error);
    }, []);

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
                        <li className="dropdown-container">
                            <NavLink to="/writings">THÈMES</NavLink>
                            {categories.length > 0 && (
                                <ul className="dropdown-menu">
                                    {categories.map((cat) => (
                                        <li key={cat._id}>
                                            <Link to={`/writings?category=${cat.slug?.current}`} onClick={() => setIsMenuOpen(false)}>
                                                {cat.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                        <li><NavLink to="/videos">VIDÉOS</NavLink></li>
                        <li><NavLink to="/books">LIVRES</NavLink></li>
                        <li><NavLink to="/contact">CONTACT</NavLink></li>
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
