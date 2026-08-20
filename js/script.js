document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
    }

    // Scroll Animations
    const animatedElements = document.querySelectorAll('.section, .hero-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Optional: only animate once
            }
        });
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });

    // Books Carousel
    const booksGrid = document.querySelector('.books-grid');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    if (booksGrid && prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const cardWidth = booksGrid.querySelector('.book-card').offsetWidth;
            const gap = 32; // var(--spacing-md) is 2rem = 32px
            const scrollAmount = cardWidth + gap;
            booksGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            const cardWidth = booksGrid.querySelector('.book-card').offsetWidth;
            const gap = 32;
            const scrollAmount = cardWidth + gap;
            booksGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }
});
