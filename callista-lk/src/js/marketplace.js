// Marketplace JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeMarketplace();
});

// Sample product data
const products = [
    {
        id: 1,
        name: "Modern Dining Table",
        category: "tables",
        price: 125000,
        image: "../images/products/dining-table-modern.jpg",
        seller: "Colombo Furniture Co.",
        location: "Colombo 7",
        badge: "popular",
        description: "Beautiful modern dining table for 6 people with premium teak wood finish"
    },
    {
        id: 2,
        name: "Luxury Bedroom Set",
        category: "bedroom-sets",
        price: 285000,
        image: "../images/products/bedroom-luxury.jpg",
        seller: "Elite Interiors",
        location: "Kandy",
        badge: "bestseller",
        description: "Complete bedroom set with wardrobe, bed, and side tables"
    },
    {
        id: 3,
        name: "Contemporary Office Desk",
        category: "tables",
        price: 95000,
        image: "../images/products/office-desk-contemporary.jpg",
        seller: "Urban Living",
        location: "Galle",
        badge: "featured",
        description: "Sleek contemporary office desk with built-in storage"
    },
    {
        id: 4,
        name: "Custom Workshop",
        category: "custom",
        price: "Quote Based",
        image: "../images/products/custom-workshop.jpg",
        seller: "Custom Crafters",
        location: "Nationwide",
        badge: "customizable",
        description: "Professional custom furniture crafting service"
    },
    {
        id: 5,
        name: "Modern Living Room Set",
        category: "living-room",
        price: 195000,
        image: "../images/products/living-room-modern.jpg",
        seller: "Home Essence",
        location: "Colombo 3",
        badge: "featured",
        description: "Complete modern living room furniture set"
    },
    {
        id: 6,
        name: "Executive Office Chair",
        category: "chairs",
        price: 45000,
        image: "../images/products/office-chair-executive.jpg",
        seller: "Office Pro",
        location: "Colombo 2",
        badge: "popular",
        description: "Ergonomic executive office chair with leather finish"
    }
];

// Initialize marketplace
function initializeMarketplace() {
    loadFeaturedProducts();
    loadFeaturedCollection();
    setupCategoryFilters();
    setupCartFunctionality();
    updateCartCount();
}

// Load featured products
function loadFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    const featuredProducts = products.slice(0, 3);
    container.innerHTML = '';
    
    featuredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Load featured collection
function loadFeaturedCollection() {
    const container = document.getElementById('featured-collection');
    if (!container) return;
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createFeaturedCard(product);
        container.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='../images/placeholder-furniture.jpg'">
            <div class="product-badge badge-${product.badge}">${product.badge}</div>
            <button class="wishlist-btn" onclick="toggleWishlist(${product.id})">
                <i class="far fa-heart"></i>
            </button>
        </div>
        <div class="product-info">
            <div class="product-category">${product.category.replace('-', ' ')}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">LKR ${typeof product.price === 'number' ? product.price.toLocaleString() : product.price}</div>
            <div class="product-location">
                <i class="fas fa-map-marker-alt"></i>
                ${product.seller} • ${product.location}
            </div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
            </button>
        </div>
    `;
    return card;
}

// Create featured card (smaller version)
function createFeaturedCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card featured-card';
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='../images/placeholder-furniture.jpg'">
            <div class="product-badge badge-${product.badge}">${product.badge}</div>
        </div>
        <div class="product-info">
            <div class="product-category">${product.category.replace('-', ' ')}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">LKR ${typeof product.price === 'number' ? product.price.toLocaleString() : product.price}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                <i class="fas fa-shopping-cart"></i>
            </button>
        </div>
    `;
    return card;
}

// Setup category filters
function setupCategoryFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter products
            const category = this.dataset.category;
            filterProducts(category);
        });
    });
}

// Filter products by category
function filterProducts(category) {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    let filteredProducts = products;
    
    if (category !== 'all') {
        filteredProducts = products.filter(product => product.category === category);
    }
    
    container.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<p class="no-products">No products found in this category.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Shopping cart functionality
let cart = JSON.parse(localStorage.getItem('callista-cart')) || [];

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    localStorage.setItem('callista-cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

function setupCartFunctionality() {
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            // Navigate to cart page
            window.location.href = 'cart.html';
        });
    }
}

// Wishlist functionality
let wishlist = JSON.parse(localStorage.getItem('callista-wishlist')) || [];

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist');
    }
    
    localStorage.setItem('callista-wishlist', JSON.stringify(wishlist));
    updateWishlistIcons();
}

function updateWishlistIcons() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    wishlistBtns.forEach(btn => {
        const productId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
        const icon = btn.querySelector('i');
        
        if (wishlist.includes(productId)) {
            icon.className = 'fas fa-heart';
            icon.style.color = '#e11d48';
        } else {
            icon.className = 'far fa-heart';
            icon.style.color = '#6b7280';
        }
    });
}

// Notification system
function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: #3d7c47;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out
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

// Search functionality
function setupSearch() {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterProductsBySearch(searchTerm);
        });
    }
}

function filterProductsBySearch(searchTerm) {
    const container = document.getElementById('featured-products');
    if (!container) return;
    
    let filteredProducts = products;
    
    if (searchTerm) {
        filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    container.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<p class="no-products">No products found matching your search.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Initialize everything when page loads
updateWishlistIcons();
setupSearch();