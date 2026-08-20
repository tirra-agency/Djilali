import React from 'react';
import ArticleCard from '../components/ArticleCard';

const Writings: React.FC = () => {
    return (
        <main>
            <section className="section articles">
                <div className="container">
                    <div className="section-heading">
                        <h2>Tous les Articles</h2>
                        <hr />
                    </div>
                    <div className="cards-grid" style={{ marginTop: '40px' }}>
                        <ArticleCard 
                            id="1"
                            image="/assets/images/article_chaos.png"
                            date="8 JANVIER 2025"
                            title="Le Monde et le Chaos"
                            excerpt="Dans le langage courant, le chaos désigne un état de désordre total. L'absence de sens et la perte de la raison d'être collectif sont souvent au fondement de l'exacerbation des contradictions,..."
                        />
                        <ArticleCard 
                            id="2"
                            image="/assets/images/article_empires.png"
                            date="2 JANVIER 2025"
                            title="Empires et Résistances"
                            excerpt="Depuis l'antiquité, plusieurs Empires se sont constitués, imprégnant mentalement leurs peuples fondateurs. Parfois, même longtemps après qu'ils se soient effondrés, les Etats qui en ont été les héritiers gardent la même pulsion"
                        />
                        <ArticleCard 
                            id="3"
                            image="/assets/images/article_mosaic.png"
                            date="20 DÉCEMBRE 2024"
                            title="Guerres et paix au Maghreb"
                            excerpt="Les peuples du Maghreb sont comme une fratrie. Génétiquement et ethniquement très proches, procédant des mêmes parents mais individualisés avec des personnalités différentes."
                        />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Writings;
