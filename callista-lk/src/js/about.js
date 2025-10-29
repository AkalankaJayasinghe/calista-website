document.addEventListener('DOMContentLoaded', () => {

    // --- 1. PRELOADER ---
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
    }

    // --- 2. AOS INITIALIZATION ---
    AOS.init({
        duration: 800,
        once: true,
        offset: 50,
    });

    // --- 3. MOBILE NAVIGATION TOGGLE ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // --- 4. BACK TO TOP BUTTON ---
    const backToTopButton = document.getElementById('backToTop');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 5. ANIMATED COUNTER ON SCROLL ---
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200; // Lower is faster

    const startCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        let current = 0;

        const updateCount = () => {
            const increment = target / speed;
            current += increment;

            if (current < target) {
                counter.innerText = Math.ceil(current);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // --- 6. ACTIVE NAVIGATION LINK ON SCROLL ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu .nav-link');

    const activateNavOnScroll = () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 150) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            // Check if the link's href contains the current section ID
            if (link.getAttribute('href').includes(currentSection)) {
                link.classList.add('active');
            }
        });
    };
    
    // Add scroll event listener only if there are sections to track
    if (sections.length > 0 && navLinks.length > 0) {
         window.addEventListener('scroll', activateNavOnScroll);
    }
   

});