import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { currentTarget, clientX, clientY } = e;
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        
        const x = clientX - left;
        const y = clientY - top;
        
        // Use percentages for better responsiveness in CSS
        const xPercent = (x / width) * 100;
        const yPercent = (y / height) * 100;
        
        currentTarget.style.setProperty('--mouse-x', `${xPercent}%`);
        currentTarget.style.setProperty('--mouse-y', `${yPercent}%`);
    };

    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.currentTarget.style.setProperty('--hover-opacity', '1');
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.currentTarget.style.setProperty('--hover-opacity', '0');
    };

    return (
        <section className="hero-section">
            <div className="container">
                <motion.h1 
                    className="hero-title"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    Quelle <br />
                    <span className="italic-part">modernité</span><br />
                    pour l'Algérie ?
                </motion.h1>
                <div 
                    className="hero-image-wrapper"
                    onMouseMove={handleMouseMove}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <motion.img 
                        src="/assets/images/hero.png" 
                        alt="Portrait de Soufiane Djilali" 
                        className="hero-portrait"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
                    />
                    <img 
                        src="/assets/images/hero_portrait.png" 
                        alt="Portrait de Soufiane Djilali en couleur" 
                        className="hero-portrait-color"
                    />
                    <div className="hero-image-fade"></div>
                </div>

                <motion.p 
                    className="hero-footer-text"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    Réflexions sur l'Algérie de demain et les enjeux contemporains
                </motion.p>
                <div className="scroll-indicator"></div>
            </div>
        </section>
    );
};

export default Hero;
