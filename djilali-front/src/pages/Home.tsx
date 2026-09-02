import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ArticleCard from '../components/ArticleCard';
import VideoCard from '../components/VideoCard';
import BookCard from '../components/BookCard';
import { client, urlFor } from '../sanity/client';

const Home: React.FC = () => {
    // Book carousel logic
    const booksGridRef = useRef<HTMLDivElement>(null);
    const [scrollAmount, setScrollAmount] = useState(0);

    // Data states
    const [posts, setPosts] = useState<any[]>([]);
    const [videos, setVideos] = useState<any[]>([]);
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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
    }, [books]); // Re-run when books change to get correct widths

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [fetchedPosts, fetchedVideos, fetchedBooks] = await Promise.all([
                    client.fetch(`*[_type == "post"] | order(publishedAt desc)[0...4]{..., categories[]->{title, slug}}`),
                    client.fetch(`*[_type == "video"] | order(publishedAt desc)[0...3]`),
                    client.fetch(`*[_type == "book"] | order(publishedYear desc, publicationDate desc)[0...10]`)
                ]);
                setPosts(fetchedPosts);
                setVideos(fetchedVideos);
                setBooks(fetchedBooks);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: 'numeric', month: 'long', year: 'numeric'
        }).toUpperCase();
    };

    const getExcerpt = (blocks: any[]) => {
        if (!blocks || blocks.length === 0) return '';
        const block = blocks.find((b: any) => b._type === 'block' && b.children);
        if (!block) return '';
        const text = block.children.map((child: any) => child.text).join('');
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    };

    const heroPost = posts.length > 0 ? posts[0] : null;
    // On affiche les 3 derniers articles dans la grille pour qu'elle ne soit pas vide
    // même s'il n'y a qu'un seul article (qui sera dupliqué dans À la Une)
    const otherPosts = posts.slice(0, 3);

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
                    {heroPost ? (
                        <div className="une-grid">
                            <div className="une-image">
                                <img src={heroPost.image ? urlFor(heroPost.image).width(800).url() : "/assets/images/algeria_city.png"} alt={heroPost.title} />
                            </div>
                            <div className="une-content">
                                <span className="date">{heroPost.publishedAt ? formatDate(heroPost.publishedAt) : ''}</span>
                                <h3 className="article-title-lg">{heroPost.title}</h3>
                                <p className="excerpt">{getExcerpt(heroPost.body)}</p>
                                <Link to={`/writings/${heroPost.slug?.current || heroPost._id}`} className="read-more">Lire l'analyse complète</Link>
                            </div>
                        </div>
                    ) : (
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
                    )}
                </div>
            </section>

            {/* Articles Section */}
            <section className="section articles">
                <div className="container">
                    <div className="section-heading">
                        <h2>Thèmes</h2>
                        <hr />
                    </div>
                    <div className="cards-grid">
                        {otherPosts.length > 0 ? (
                            otherPosts.map((post: any) => (
                                <ArticleCard 
                                    key={post._id}
                                    id={post.slug?.current || post._id}
                                    image={post.image ? urlFor(post.image).width(600).url() : "/assets/images/article_chaos.png"}
                                    date={post.publishedAt ? formatDate(post.publishedAt) : ''}
                                    title={post.title}
                                    excerpt={getExcerpt(post.body)}
                                    categories={post.categories?.map((c: any) => c.title) || []}
                                />
                            ))
                        ) : (
                            <p style={{ textAlign: 'center', width: '100%', gridColumn: '1 / -1', padding: '2rem 0', color: '#666' }}>
                                D'autres publications seront ajoutées prochainement.
                            </p>
                        )}
                    </div>
                    <div className="text-center mt-40">
                        <Link to="/writings" className="read-more">Voir tous les thèmes</Link>
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
                        {videos.length > 0 ? (
                            videos.map((video: any) => {
                                // Helper to get YouTube thumbnail from URL
                                const getYouTubeThumbnail = (url: string) => {
                                    if (!url) return '/assets/images/video_studio.png';
                                    let videoId = '';
                                    if (url.includes('youtube.com/watch?v=')) {
                                        videoId = url.split('v=')[1]?.split('&')[0];
                                    } else if (url.includes('youtu.be/')) {
                                        videoId = url.split('youtu.be/')[1]?.split('?')[0];
                                    }
                                    
                                    if (videoId) {
                                        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                                    }
                                    return '/assets/images/video_studio.png';
                                };

                                return (
                                    <VideoCard 
                                        key={video._id}
                                        id={video._id}
                                        image={getYouTubeThumbnail(video.videoUrl)}
                                        date={video.publishedAt ? formatDate(video.publishedAt) : ''}
                                        title={video.title}
                                        excerpt={video.description?.substring(0, 100) || ''}
                                    />
                                );
                            })
                        ) : (
                            <>
                                <VideoCard 
                                    id="1"
                                    image="/assets/images/video_studio.png"
                                    date="12 JANVIER 2025"
                                    title="La jeune génération est plus décomplexée et porteuse d'espoir de changement (Placeholder)"
                                    excerpt="Une conversation sur les transformations nécessaires pour une Algérie démocratique."
                                />
                                <VideoCard 
                                    id="2"
                                    image="/assets/images/video_interview.png"
                                    date="5 JANVIER 2025"
                                    title="L'Algérie face à ses défis (Placeholder)"
                                    excerpt="Analyse des perspectives économiques et des réformes structurelles."
                                />
                                <VideoCard 
                                    id="3"
                                    image="/assets/images/video_stage.png"
                                    date="28 DÉCEMBRE 2024"
                                    title="Algérie : Quel chemin vers la deuxième République ? (Placeholder)"
                                    excerpt="Intervention sur les défis de la modernisation politique et sociale."
                                />
                            </>
                        )}
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
                                    <BookCard id="5" image="/assets/images/book_1.png" title="La modernité (Edition Spéciale) (Placeholder)" year="2025" />
                                    <BookCard id="6" image="/assets/images/book_2.png" title="L'Algérie en Questions II (Placeholder)" year="2025" />
                                </>
                            )}
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
