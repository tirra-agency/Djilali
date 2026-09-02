import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
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
                <div className="hero-image-wrapper">
                    <motion.img 
                        src="/assets/images/hero.png" 
                        alt="Portrait de Soufiane Djilali" 
                        className="hero-portrait"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.2 }}
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
