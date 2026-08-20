import React from 'react';
import BookCard from '../components/BookCard';

const Books: React.FC = () => {
    return (
        <main>
            <section className="section ouvrages">
                <div className="container">
                    <div className="section-heading">
                        <h2>Bibliothèque</h2>
                        <hr />
                    </div>
                    <div className="cards-grid" style={{ marginTop: '40px', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                        <BookCard id="1" image="/assets/images/book_1.png" title="La modernité" year="2019" />
                        <BookCard id="2" image="/assets/images/book_2.png" title="L'Algérie en Questions" year="2021" />
                        <BookCard id="3" image="/assets/images/book_3.png" title="L'Algérie : une nation en chantier" year="2023" />
                        <BookCard id="4" image="/assets/images/book_4.png" title="La société algérienne" year="2024" />
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Books;
