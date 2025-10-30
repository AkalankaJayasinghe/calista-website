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
// OPTIMIZED FOOTER FEATURES
// ===================================

function initFooterFeatures() {
    // 1. SIMPLE FADE-IN ANIMATION (Optimized)
    const fadeInElements = document.querySelectorAll('.fade-in-section');
    
    if (fadeInElements.length > 0) {
        const fadeInObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Stop observing to improve performance
                    fadeInObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        fadeInElements.forEach(element => {
            fadeInObserver.observe(element);
        });
    }

    // 2. OPTIMIZED NEWSLETTER FORM
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value.trim();
            
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showSimpleMessage('Please enter a valid email address');
                return;
            }
            
            const submitBtn = this.querySelector('.subscribe-btn');
            const originalHTML = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                showSimpleMessage('Successfully subscribed!');
                this.reset();
                submitBtn.innerHTML = originalHTML;
                submitBtn.disabled = false;
            }, 1500);
        });
    }

    // 3. SIMPLE BACK TO TOP BUTTON
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        let ticking = false;
        
        function updateBackToTop() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateBackToTop);
                ticking = true;
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // 4. SIMPLE SOCIAL ICON EFFECTS
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });

    // 5. AUTO-UPDATE CURRENT YEAR
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Simple message function
    function showSimpleMessage(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }
}

// Run footer features efficiently
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

// ===== USER ACCOUNT FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const userAccountBtn = document.getElementById('userAccountBtn');
    const userDropdown = document.getElementById('userDropdown');
    const userAuthSection = document.getElementById('userAuthSection');
    const userProfileSection = document.getElementById('userProfileSection');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Check if user is logged in (simulate with localStorage)
    let isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    let userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    // Toggle dropdown visibility
    if (userAccountBtn && userDropdown) {
        userAccountBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
            userAccountBtn.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!userDropdown.contains(e.target) && e.target !== userAccountBtn) {
                userDropdown.classList.remove('active');
                userAccountBtn.classList.remove('active');
            }
        });
        
        // Prevent dropdown from closing when clicking inside
        userDropdown.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // Update UI based on login status
    function updateUserInterface() {
        if (isLoggedIn && userData.name) {
            // Show logged in state
            if (userAuthSection) userAuthSection.style.display = 'none';
            if (userProfileSection) {
                userProfileSection.style.display = 'block';
                
                // Update user info
                const userName = document.getElementById('userName');
                const userEmail = document.getElementById('userEmail');
                const userAvatarFallback = document.querySelector('.user-avatar-fallback');
                
                if (userName) userName.textContent = userData.name;
                if (userEmail) userEmail.textContent = userData.email;
                if (userAvatarFallback) {
                    userAvatarFallback.textContent = userData.name.split(' ')
                        .map(n => n[0]).join('').toUpperCase();
                }
            }
        } else {
            // Show logged out state
            if (userAuthSection) userAuthSection.style.display = 'block';
            if (userProfileSection) userProfileSection.style.display = 'none';
        }
    }
    
    // Handle logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear user data
            localStorage.removeItem('userLoggedIn');
            localStorage.removeItem('userData');
            
            // Update state
            isLoggedIn = false;
            userData = {};
            
            // Update UI
            updateUserInterface();
            
            // Close dropdown
            userDropdown.classList.remove('active');
            userAccountBtn.classList.remove('active');
            
            // Show logout message
            showNotification('Successfully logged out!', 'success');
        });
    }
    
    // Simulate login for demo (you can remove this in production)
    function simulateLogin(name, email) {
        userData = { name, email };
        isLoggedIn = true;
        
        localStorage.setItem('userLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify(userData));
        
        updateUserInterface();
        showNotification(`Welcome back, ${name}!`, 'success');
    }
    
    // Initialize user interface
    updateUserInterface();
    
    // Demo: Double-click on user button to simulate login (for testing)
    if (userAccountBtn) {
        let clickCount = 0;
        userAccountBtn.addEventListener('dblclick', function() {
            if (!isLoggedIn) {
                simulateLogin('Amara Mendis', 'amara.mendis@email.com');
            }
        });
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Cart count update functionality
    function updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
        
        if (cartCount) {
            cartCount.textContent = cartItems.length;
            cartCount.style.display = cartItems.length > 0 ? 'flex' : 'none';
        }
    }
    
    // Initialize cart count
    updateCartCount();
    
    // Listen for cart updates
    window.addEventListener('storage', function(e) {
        if (e.key === 'cartItems') {
            updateCartCount();
        }
    });
    
    console.log('User account functionality initialized');
});