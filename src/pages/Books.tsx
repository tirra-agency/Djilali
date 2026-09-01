import React, { useEffect, useState } from 'react';
import BookCard from '../components/BookCard';
import { client, urlFor } from '../sanity/client';

const Books: React.FC = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        client.fetch(`*[_type == "book"] | order(publishedYear desc, publicationDate desc)`)
            .then((data) => {
                setBooks(data);
                setLoading(false);
            })
            .catch(console.error);
    }, []);

    return (
        <main>
            <section className="section ouvrages">
                <div className="container">
                    <div className="section-heading">
                        <h2>Bibliothèque</h2>
                        <hr />
                    </div>
                    {loading ? (
                        <p style={{ textAlign: 'center', marginTop: '20px' }}>Chargement en cours...</p>
                    ) : (
                        <div className="cards-grid" style={{ marginTop: '40px', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
                            {books.length > 0 ? (
                                books.map((book: any) => (
                                    <BookCard 
                                        key={book._id} 
                                        id={book._id} 
                                        image={book.coverImage ? urlFor(book.coverImage).width(500).url() : "/assets/images/book_1.png"} 
                                        title={book.title} 
                                        year={book.publishedYear || (book.publicationDate ? book.publicationDate.substring(0, 4) : '')} 
                                    />
                                ))
                            ) : (
                                <>
                                    <BookCard id="1" image="/assets/images/book_1.png" title="La modernité (Placeholder)" year="2019" />
                                    <BookCard id="2" image="/assets/images/book_2.png" title="L'Algérie en Questions (Placeholder)" year="2021" />
                                    <BookCard id="3" image="/assets/images/book_3.png" title="L'Algérie : une nation en chantier (Placeholder)" year="2023" />
                                    <BookCard id="4" image="/assets/images/book_4.png" title="La société algérienne (Placeholder)" year="2024" />
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
};

export default Books;
