import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ArticleCard from '../components/ArticleCard';
import VideoCard from '../components/VideoCard';
import BookCard from '../components/BookCard';

const Home: React.FC = () => {
    // Book carousel logic
    const booksGridRef = useRef<HTMLDivElement>(null);
    const [scrollAmount, setScrollAmount] = useState(0);

    useEffect(() => {
        const updateScrollAmount = () => {
            if (booksGridRef.current) {
                const bookCard = booksGridRef.current.querySelector('.book-card') as HTMLElement;
                if (bookCard) {
                    const cardWidth = bookCard.offsetWidth;
                    const gap = parseInt(window.getComputedStyle(booksGridRef.current).gap || '0', 10);
                    setScrollAmount(cardWidth + gap);
                }
            }
        };

        updateScrollAmount();
        window.addEventListener('resize', updateScrollAmount);
        return () => window.removeEventListener('resize', updateScrollAmount);
    }, []);

    const scrollNext = () => {
        if (booksGridRef.current) {
            booksGridRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const scrollPrev = () => {
        if (booksGridRef.current) {
            booksGridRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <main>
            <Hero />
            
            {/* À La Une Section */}
            <section className="section a-la-une">
                <div className="container">
                    <div className="section-heading">
                        <h2>À LA UNE</h2>
                        <hr />
                    </div>
                    <div className="une-grid">
                        <div className="une-image">
                            <img src="/assets/images/algeria_city.png" alt="Vue d'une ville en Algérie" />
                        </div>
                        <div className="une-content">
                            <span className="date">15 JANVIER 2025</span>
                            <h3 className="article-title-lg">Le dilemme de la modernité et de la tradition : Quel choix pour l'Algérie ?</h3>
                            <p className="excerpt">La modernité a été perçue, dès le XIXe siècle, par les premières élites intellectuelles du monde islamique, comme un challenge pour la restauration d'une certaine grandeur et d'un lustre historique, ...</p>
                            <Link to="/writings/1" className="read-more">Lire l'analyse complète</Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Section */}
            <section className="section articles">
                <div className="container">
                    <div className="section-heading">
                        <h2>Articles</h2>
                        <hr />
                    </div>
                    <div className="cards-grid">
                        <ArticleCard 
                            id="2"
                            image="/assets/images/article_chaos.png"
                            date="8 JANVIER 2025"
                            title="Le Monde et le Chaos"
                            excerpt="Dans le langage courant, le chaos désigne un état de désordre total. L'absence de sens et la perte de la raison d'être collectif sont souvent au fondement de l'exacerbation des contradictions,..."
                        />
                        <ArticleCard 
                            id="3"
                            image="/assets/images/article_empires.png"
                            date="2 JANVIER 2025"
                            title="Empires et Résistances"
                            excerpt="Depuis l'antiquité, plusieurs Empires se sont constitués, imprégnant mentalement leurs peuples fondateurs. Parfois, même longtemps après qu'ils se soient effondrés, les Etats qui en ont été les héritiers gardent la même pulsion"
                        />
                        <ArticleCard 
                            id="4"
                            image="/assets/images/article_mosaic.png"
                            date="20 DÉCEMBRE 2024"
                            title="Guerres et paix au Maghreb"
                            excerpt="Les peuples du Maghreb sont comme une fratrie. Génétiquement et ethniquement très proches, procédant des mêmes parents mais individualisés avec des personnalités différentes."
                        />
                    </div>
                    <div className="text-center mt-40">
                        <Link to="/writings" className="read-more">Voir tous les articles</Link>
                    </div>
                </div>
            </section>

            {/* Vidéos Section */}
            <section className="section videos bg-light">
                <div className="container">
                    <div className="section-heading">
                        <h2>Vidéos</h2>
                        <hr />
                    </div>
                    <div className="cards-grid">
                        <VideoCard 
                            id="1"
                            image="/assets/images/video_studio.png"
                            date="12 JANVIER 2025"
                            title="La jeune génération est plus décomplexée et porteuse d'espoir de changement"
                            excerpt="Une conversation sur les transformations nécessaires pour une Algérie démocratique."
                        />
                        <VideoCard 
                            id="2"
                            image="/assets/images/video_interview.png"
                            date="5 JANVIER 2025"
                            title="L'Algérie face à ses défis"
                            excerpt="Analyse des perspectives économiques et des réformes structurelles."
                        />
                        <VideoCard 
                            id="3"
                            image="/assets/images/video_stage.png"
                            date="28 DÉCEMBRE 2024"
                            title="Algérie : Quel chemin vers la deuxième République ?"
                            excerpt="Intervention sur les défis de la modernisation politique et sociale."
                        />
                    </div>
                    <div className="text-center mt-40">
                        <Link to="/videos" className="read-more">Voir toutes les vidéos</Link>
                    </div>
                </div>
            </section>

            {/* Ouvrages Section */}
            <section className="section ouvrages">
                <div className="container">
                    <div className="section-heading text-center">
                        <h2>Ouvrages</h2>
                        <hr className="mx-auto" />
                    </div>
                    <div className="books-carousel-wrapper">
                        <button className="carousel-btn prev-btn" aria-label="Previous" onClick={scrollPrev}>&lsaquo;</button>
                        <div className="books-grid" ref={booksGridRef}>
                            <BookCard id="1" image="/assets/images/book_1.png" title="La modernité" year="2019" />
                            <BookCard id="2" image="/assets/images/book_2.png" title="L'Algérie en Questions" year="2021" />
                            <BookCard id="3" image="/assets/images/book_3.png" title="L'Algérie : une nation en chantier" year="2023" />
                            <BookCard id="4" image="/assets/images/book_4.png" title="La société algérienne" year="2024" />
                            <BookCard id="5" image="/assets/images/book_1.png" title="La modernité (Edition Spéciale)" year="2025" />
                            <BookCard id="6" image="/assets/images/book_2.png" title="L'Algérie en Questions II" year="2025" />
                        </div>
                        <button className="carousel-btn next-btn" aria-label="Next" onClick={scrollNext}>&rsaquo;</button>
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="section newsletter">
                <div className="container text-center">
                    <h2 className="newsletter-title">Restez informé</h2>
                    <p className="newsletter-subtitle">Recevez les nouvelles publications par email</p>
                    <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
                        <input type="email" placeholder="Votre adresse email" required />
                        <button type="submit" className="btn-submit">S'inscrire</button>
                    </form>
                </div>
            </section>
        </main>
    );
};

export default Home;
