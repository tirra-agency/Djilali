import React from 'react';
import { useLanguage } from '../contexts/LanguageProvider';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
    const { lang } = useLanguage();

    return (
        <section className="hero-section">
            <div className="container">
                <motion.h1 
                    className="hero-title"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    {lang === 'ar' ? (
                        <>
                            <span className="arabic-main italic-part">أي حداثة</span>
                            <span className="arabic-main arabic-last">تليق بالجزائر؟</span>
                        </>
                    ) : (
                        <>
                            <span>Quelle</span>
                            <span className="italic-part">modernité</span>
                            <span>pour l'Algérie ?</span>
                        </>
                    )}
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
                    {lang === 'ar' ? 'تأملات حول جزائر الغد والقضايا المعاصرة' : 'Réflexions sur l\'Algérie de demain et les enjeux contemporains'}
                </motion.p>
                <div className="scroll-indicator"></div>
            </div>
        </section>
    );
};

export default Hero;
