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
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MOBILE MENU TOGGLE =====
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
        this.slides = [
            {
                image: 'images/hero-1.jpg',
                title: 'Transform Your <span class="gradient-text">Living Space</span>',
                subtitle: 'Discover premium furniture and expert interior design solutions'
            },
            {
                image: 'images/hero-2.jpg',
                title: 'Luxury <span class="gradient-text">Furniture</span> Collection',
                subtitle: 'Handcrafted pieces that define elegance'
            },
            {
                image: 'images/hero-3.jpg',
                title: 'Custom <span class="gradient-text">Interior Design</span>',
                subtitle: 'Create your dream space with our expert designers'
            }
        ];
        this.currentSlide = 0;
        this.init();
    }
    
    init() {
        // Auto-play slider
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
    
    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }
    
    updateSlider() {
        // Update slider logic here
    }
}

// Initialize hero slider
// new HeroSlider();

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
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===== CART FUNCTIONALITY =====
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
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
        localStorage.setItem('cart', JSON.stringify(this.items));
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