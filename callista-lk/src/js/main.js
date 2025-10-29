// ===== PRELOADER =====
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 1000);
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');
// navToggle/navMenu may not exist on every page (some pages use different markup)
const navToggle = document.getElementById('navToggle') || document.querySelector('.nav-toggle');
const navMenu = document.getElementById('navMenu') || document.querySelector('.nav-menu');

if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== MOBILE MENU TOGGLE =====
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
} else {
    // If navToggle/navMenu are missing, avoid throwing errors when binding events
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            // attempt best-effort safe removal if elements exist
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
}

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== HERO SLIDER =====
class HeroSlider {
    constructor() {
        this.slides = document.querySelectorAll('.hero-slide');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.hero-control.prev');
        this.nextBtn = document.querySelector('.hero-control.next');
        this.currentSlide = 0;
        this.autoplayInterval = null;
        this.isPaused = false;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }
    
    init() {
        // Set up prev/next buttons
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.previousSlide());
        }
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.goToNextSlide());
        }
        
        // Set up indicators
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Pause on hover
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            heroSection.addEventListener('mouseenter', () => this.pauseAutoplay());
            heroSection.addEventListener('mouseleave', () => this.resumeAutoplay());
        }
        
        // Start autoplay
        this.startAutoplay();
    }
    
    goToSlide(index) {
        // Remove active class from current slide and indicator
        this.slides[this.currentSlide].classList.remove('active');
        this.indicators[this.currentSlide].classList.remove('active');
        
        // Update current slide
        this.currentSlide = index;
        
        // Add active class to new slide and indicator
        this.slides[this.currentSlide].classList.add('active');
        this.indicators[this.currentSlide].classList.add('active');
    }
    
    goToNextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.slides.length;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
        this.goToSlide(prevIndex);
    }
    
    startAutoplay() {
        this.autoplayInterval = setInterval(() => {
            if (!this.isPaused) {
                this.goToNextSlide();
            }
        }, 5000); // Change slide every 5 seconds
    }
    
    pauseAutoplay() {
        this.isPaused = true;
    }
    
    resumeAutoplay() {
        this.isPaused = false;
    }
    
    stopAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
        }
    }
}

// Initialize hero slider
let heroSlider;
if (document.querySelector('.hero-slider')) {
    heroSlider = new HeroSlider();
}

// ===== PRODUCT FILTER =====
const filterButtons = document.querySelectorAll('.tab-btn');
const productCards = document.querySelectorAll('.product-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        // Filter products
        productCards.forEach(card => {
            if (filter === 'all' || card.classList.contains(filter)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 1.0s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===== CART FUNCTIONALITY =====
class ShoppingCart {
    constructor() {
        // Use a consistent localStorage key for the site cart
        this.storageKey = 'callista-cart';
        this.items = JSON.parse(localStorage.getItem(this.storageKey)) || [];
        this.updateCartCount();
        this.bindEvents();
    }
    
    bindEvents() {
        document.querySelectorAll('.product-action').forEach(button => {
            if (button.title === 'Add to Cart') {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.addToCart(this.getProductData(e.target));
                });
            }
        });
    }
    
    getProductData(button) {
        const card = button.closest('.product-card');
        return {
            id: Date.now(),
            title: card.querySelector('.product-title').textContent,
            price: card.querySelector('.price-current').textContent,
            image: card.querySelector('.product-image img').src,
            quantity: 1
        };
    }
    
    addToCart(product) {
        const existingItem = this.items.find(item => item.title === product.title);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.items.push(product);
        }
        
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Product added to cart!');
    }
    
    removeFromCart(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveCart();
        this.updateCartCount();
    }
    
    saveCart() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.items));
    }
    
    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.cart-count').textContent = count;
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            box-shadow: var(--shadow-large);
            z-index: 10000;
            animation: slideIn 0.5s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.5s ease';
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }
}

// Initialize shopping cart
const cart = new ShoppingCart();
// Expose a global reference so other scripts (marketplace.js, cart.js) can delegate
window.siteCart = cart;

// Make nav cart buttons navigate to the cart page (works from root or /pages/)
document.querySelectorAll('.cart-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        const inPages = window.location.pathname.includes('/pages/');
        const target = inPages ? 'cart.html' : 'pages/cart.html';
        window.location.href = target;
    });
});

// ===== SEARCH FUNCTIONALITY =====
const searchBtn = document.querySelector('.search-btn');
const searchModal = document.createElement('div');
searchModal.className = 'search-modal';
searchModal.innerHTML = `
    <div class="search-container">
        <input type="text" placeholder="Search for products..." class="search-input">
        <button class="search-close">&times;</button>
    </div>
`;

searchBtn.addEventListener('click', () => {
    document.body.appendChild(searchModal);
    searchModal.style.display = 'flex';
    searchModal.querySelector('.search-input').focus();
});

searchModal.querySelector('.search-close')?.addEventListener('click', () => {
    searchModal.style.display = 'none';
});

// ===== NEWSLETTER FORM =====
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        // Simulate API call
        setTimeout(() => {
            alert(`Thank you for subscribing with email: ${email}`);
            newsletterForm.reset();
        }, 500);
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
});

// ===== AOS INITIALIZATION =====
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// ===== PRODUCT QUICK VIEW =====
class QuickView {
    constructor() {
        this.modal = this.createModal();
        this.bindEvents();
    }
    
    createModal() {
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                <div class="modal-body">
                    <div class="product-images">
                        <img src="" alt="Product" class="main-image">
                    </div>
                    <div class="product-details">
                        <h2 class="product-name"></h2>
                        <div class="product-rating"></div>
                        <div class="product-price"></div>
                        <p class="product-description"></p>
                        <div class="product-options">
                            <div class="quantity-selector">
                                <button class="qty-minus">-</button>
                                <input type="number" value="1" min="1" class="qty-input">
                                <button class="qty-plus">+</button>
                            </div>
                            <button class="btn btn-primary add-to-cart">
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        return modal;
    }
    
    bindEvents() {
        // Quick view buttons
        document.querySelectorAll('.product-action').forEach(button => {
            if (button.title === 'Quick View') {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openModal(this.getProductData(e.target));
                });
            }
        });
        
        // Close modal
        this.modal.querySelector('.modal-close').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Quantity controls
        this.modal.querySelector('.qty-minus').addEventListener('click', () => {
            const input = this.modal.querySelector('.qty-input');
            if (input.value > 1) input.value--;
        });
        
        this.modal.querySelector('.qty-plus').addEventListener('click', () => {
            const input = this.modal.querySelector('.qty-input');
            input.value++;
        });
    }
    
    getProductData(button) {
        const card = button.closest('.product-card');
        return {
            name: card.querySelector('.product-title').textContent,
            price: card.querySelector('.price-current').textContent,
            image: card.querySelector('.product-image img').src,
            rating: card.querySelector('.product-rating').innerHTML,
            description: 'Premium quality furniture with modern design and exceptional comfort.'
        };
    }
    
    openModal(product) {
        this.modal.querySelector('.main-image').src = product.image;
        this.modal.querySelector('.product-name').textContent = product.name;
        this.modal.querySelector('.product-rating').innerHTML = product.rating;
        this.modal.querySelector('.product-price').textContent = product.price;
        this.modal.querySelector('.product-description').textContent = product.description;
        
        this.modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Initialize quick view
new QuickView();

// ===== WISHLIST FUNCTIONALITY =====
class Wishlist {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.bindEvents();
    }
    
    bindEvents() {
        document.querySelectorAll('.product-action').forEach(button => {
            if (button.title === 'Add to Wishlist') {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleWishlist(e.target);
                });
            }
        });
    }
    
    toggleWishlist(button) {
        const card = button.closest('.product-card');
        const productId = card.dataset.productId || Date.now();
        const icon = button.querySelector('i');
        
        if (this.items.includes(productId)) {
            this.items = this.items.filter(id => id !== productId);
            icon.classList.remove('fas');
            icon.classList.add('far');
        } else {
            this.items.push(productId);
            icon.classList.remove('far');
            icon.classList.add('fas');
        }
        
        this.saveWishlist();
    }
    
    saveWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(this.items));
    }
}

// Initialize wishlist
new Wishlist();

// ===== CSS ANIMATION CLASSES =====
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
        }
        to {
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
        }
        to {
            transform: translateX(100%);
        }
    }
    
    .search-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        align-items: center;
        justify-content: center;
    }
    
    .search-container {
        width: 90%;
        max-width: 600px;
        position: relative;
    }
    
    .search-input {
        width: 100%;
        padding: 1.5rem;
        font-size: 1.2rem;
        border: none;
        border-radius: 50px;
    }
    
    .search-close {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
    }
    
    .quick-view-modal {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        align-items: center;
        justify-content: center;
    }
    
    .modal-content {
        background: white;
        width: 90%;
        max-width: 900px;
        max-height: 90vh;
        overflow: auto;
        border-radius: 20px;
        position: relative;
    }
    
    .modal-close {
        position: absolute;
        top: 20px;
        right: 20px;
        background: none;
        border: none;
        font-size: 2rem;
        cursor: pointer;
        z-index: 1;
    }
    
    .modal-body {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        padding: 2rem;
    }
    
    .product-images img {
        width: 100%;
        border-radius: 10px;
    }
    
    .product-options {
        display: flex;
        gap: 1rem;
        margin-top: 2rem;
    }
    
    .quantity-selector {
        display: flex;
        align-items: center;
        border: 2px solid #e0e0e0;
        border-radius: 50px;
    }
    
    .quantity-selector button {
        background: none;
        border: none;
        padding: 0.5rem 1rem;
        font-size: 1.2rem;
        cursor: pointer;
    }
    
    .qty-input {
        width: 50px;
        text-align: center;
        border: none;
        font-size: 1rem;
    }
    
    @media (max-width: 768px) {
        .modal-body {
            grid-template-columns: 1fr;
        }
    }
`;

document.head.appendChild(style);

console.log('Callista LK - Main JavaScript Loaded Successfully!');
// ===================================
// FOOTER INTERACTIVE FEATURES
// ===================================

// Wrap footer interactive features so they run whether the script is loaded
// before or after DOMContentLoaded. This prevents animated sections (like
// `.fade-in-section`) from remaining hidden when the script is included at
// the end of the page.
function initFooterFeatures() {
    // 1. FADE-IN ON SCROLL ANIMATION
    // ===================================
    const fadeInElements = document.querySelectorAll('.fade-in-section');

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, index * 150); // Stagger animation
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    fadeInElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    // 2. NEWSLETTER FORM SUBMISSION
    // ===================================
    const newsletterForm = document.getElementById('newsletterForm');
    const emailInput = document.getElementById('emailInput');
    const formMessage = document.querySelector('.form-message');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = emailInput.value.trim();

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address', 'error');
                shakeElement(emailInput);
                return;
            }

            // Show loading state
            const submitBtn = newsletterForm.querySelector('.subscribe-btn');
            const btnText = submitBtn.querySelector('.btn-text');
            const originalText = btnText.textContent;

            btnText.textContent = 'Subscribing...';
            submitBtn.disabled = true;

            // Simulate API call (replace with actual API call)
            setTimeout(() => {
                showMessage('🎉 Successfully subscribed! Check your inbox.', 'success');
                emailInput.value = '';
                btnText.textContent = originalText;
                submitBtn.disabled = false;

                // Add confetti effect
                createConfetti();
            }, 1500);
        });
    }

    function showMessage(message, type) {
        if (!formMessage) return;
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;

        // Fade in
        formMessage.style.opacity = '0';
        setTimeout(() => {
            formMessage.style.transition = 'opacity 0.3s ease';
            formMessage.style.opacity = '1';
        }, 10);
    }

    function shakeElement(element) {
        if (!element) return;
        element.style.animation = 'shake 0.5s';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }

    // Add shake animation to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // 3. BACK TO TOP BUTTON
    // ===================================
    const backToTopBtn = document.getElementById('backToTop');

    if (backToTopBtn) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Smooth scroll to top
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Add bounce effect
            backToTopBtn.style.animation = 'bounceUp 0.6s';
            setTimeout(() => {
                backToTopBtn.style.animation = '';
            }, 600);
        });
    }

    // 4. SOCIAL ICONS ANIMATION
    // ===================================
    const socialIcons = document.querySelectorAll('.social-icon');

    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'socialPop 0.6s ease';
            }, 10);
        });

        icon.addEventListener('animationend', function() {
            this.style.animation = '';
        });

        // Click effect
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            createRipple(this, e);
        });
    });

    // Add social pop animation
    const socialStyle = document.createElement('style');
    socialStyle.textContent = `
        @keyframes socialPop {
            0% { transform: scale(1); }
            50% { transform: scale(1.3) rotate(10deg); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(socialStyle);

    // 5. CONTACT ITEMS HOVER EFFECT
    // ===================================
    const contactItems = document.querySelectorAll('.contact-item');

    contactItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';

        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        }, index * 100);

        // Click to copy functionality
        item.addEventListener('click', function() {
            const text = this.querySelector('span').textContent;
            copyToClipboard(text, this);
        });
    });

    // 6. FOOTER LINKS ANIMATION
    // ===================================
    const footerLinks = document.querySelectorAll('.footer-links-list a');

    footerLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const icon = this.querySelector('i');
            if (icon) {
                icon.style.animation = 'pulse 0.6s ease';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 600);
            }
        });
    });

    // 7. CURRENT YEAR AUTO-UPDATE
    // ===================================
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 8. PARALLAX EFFECT FOR DECORATION CIRCLES
    // ===================================
    const decorationCircles = document.querySelectorAll('.decoration-circle');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;

        decorationCircles.forEach((circle, index) => {
            const speed = (index + 1) * 0.1;
            circle.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });

    // 9. MOUSE MOVE EFFECT ON FOOTER
    // ===================================
    const footer = document.querySelector('.footer');

    if (footer) {
        footer.addEventListener('mousemove', (e) => {
            const rect = footer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            decorationCircles.forEach((circle, index) => {
                const speed = (index + 1) * 0.02;
                const moveX = (x - rect.width / 2) * speed;
                const moveY = (y - rect.height / 2) * speed;

                circle.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }

    // UTILITY FUNCTIONS (ripple, copy, confetti...) are unchanged — kept below
    // to avoid duplicating large blocks; they remain available in this scope.
    // (createRipple, copyToClipboard, createConfetti, etc.)

    // Ripple Effect
    function createRipple(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            top: ${y}px;
            left: ${x}px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    // Add ripple animation
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Copy to Clipboard
    function copyToClipboard(text, element) {
        if (!navigator.clipboard) return;
        navigator.clipboard.writeText(text).then(() => {
            // Show copied notification
            const notification = document.createElement('div');
            notification.textContent = '✓ Copied!';
            notification.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #4caf50;
                color: white;
                padding: 15px 30px;
                border-radius: 5px;
                font-weight: 600;
                z-index: 10000;
                animation: fadeInOut 2s ease;
            `;

            document.body.appendChild(notification);

            // Highlight element
            element.style.background = 'rgba(76, 175, 80, 0.2)';
            setTimeout(() => {
                element.style.background = '';
            }, 300);

            setTimeout(() => notification.remove(), 2000);
        });
    }

    const copyStyle = document.createElement('style');
    copyStyle.textContent = `
        @keyframes fadeInOut {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
            10%, 90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
    `;
    document.head.appendChild(copyStyle);

    // Confetti Effect
    function createConfetti() {
        const colors = ['#ffd700', '#ffed4e', '#ff6b6b', '#4ecdc4', '#45b7d1'];
        const confettiCount = 50;

        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: 50%;
                left: 50%;
                opacity: 1;
                border-radius: 50%;
                z-index: 10000;
                pointer-events: none;
                animation: confettiFall ${1 + Math.random() * 2}s ease-out forwards;
            `;

            confetti.style.setProperty('--tx', `${(Math.random() - 0.5) * 500}px`);
            confetti.style.setProperty('--ty', `${Math.random() * 500}px`);

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }
    }

    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        @keyframes confettiFall {
            to {
                transform: translate(var(--tx), var(--ty)) rotate(720deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(confettiStyle);

    // 10. TYPING EFFECT FOR FOOTER TAGLINE (Optional)
    const tagline = document.querySelector('.footer-brand p');
    if (tagline) {
        const text = tagline.textContent;
        tagline.textContent = '';
        tagline.style.opacity = '1';

        let index = 0;
        const typingSpeed = 30;

        function typeText() {
            if (index < text.length) {
                tagline.textContent += text.charAt(index);
                index++;
                setTimeout(typeText, typingSpeed);
            }
        }

        // Start typing when footer is in view
        const typingObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && index === 0) {
                    setTimeout(typeText, 500);
                }
            });
        }, { threshold: 0.5 });

        typingObserver.observe(tagline);
    }

    console.log('🎨 Elite Footer Enhanced with Interactive Features!');
}

// Ensure initFooterFeatures runs whether DOMContentLoaded has already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooterFeatures);
} else {
    initFooterFeatures();
}


// ===================================
// SMOOTH SCROLL FOR ALL FOOTER LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});