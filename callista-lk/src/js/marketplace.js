
// ============================================
// CREATE PRODUCT CARD
// ============================================
function createProductCard(product, index) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.style.animationDelay = `${index * 0.1}s`;
    
    const isInWishlist = wishlist.includes(product.id);
    const heartClass = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
    const heartColor = isInWishlist ? '#e11d48' : '#6b7280';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='../assets/placeholder-furniture.jpg'">
            <div class="product-badge badge-${product.badge}">${product.badge}</div>
            <button class="wishlist-btn" data-product-id="${product.id}">
                <i class="${heartClass}" style="color: ${heartColor}"></i>
            </button>
        </div>
        <div class="product-info">
            <div class="product-category">${formatCategory(product.category)}</div>
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">LKR ${formatPrice(product.price)}</div>
            <div class="product-location">
                <i class="fas fa-map-marker-alt"></i>
                <span>${product.seller} • ${product.location}</span>
            </div>
            <button class="add-to-cart-btn" data-product-id="${product.id}">
                <i class="fas fa-shopping-cart"></i>
                <span>Add to Cart</span>
            </button>
        </div>
    `;
    
    // Add event listeners
    const wishlistBtn = card.querySelector('.wishlist-btn');
    const cartBtn = card.querySelector('.add-to-cart-btn');
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product.id);
        });
    }
    
    if (cartBtn) {
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product.id);
        });
    }
    
    return card;
}

// ============================================
// SETUP CATEGORY FILTERS
// ============================================
function setupCategoryFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update category
            currentCategory = this.dataset.category || 'all';
            console.log(`📂 Category set to: ${currentCategory}`);
            
            // Load products
            loadProducts();
        });
    });
}

// ============================================
// SETUP SEARCH
// ============================================
function setupSearch() {
    const searchInput = document.getElementById('searchInput');

    if (!searchInput) return;

    // Small UX improvements and defensive guards
    searchInput.setAttribute('autocomplete', 'off');
    let timeout;

    const doSearch = () => {
        currentSearchTerm = (searchInput.value || '').toLowerCase().trim();
        console.log(`🔍 Search: ${currentSearchTerm}`);
        if (typeof loadProducts === 'function') loadProducts();
    };

    // Debounced input
    searchInput.addEventListener('input', function () {
        clearTimeout(timeout);
        timeout = setTimeout(doSearch, 300);
    });

    // Trigger search immediately on Enter
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            clearTimeout(timeout);
            doSearch();
        }
    });

    // Some browsers/firefox expose a 'search' event for input[type=search]
    searchInput.addEventListener('search', function () {
        clearTimeout(timeout);
        doSearch();
    });
}


// ============================================
// RESET FILTERS
// ============================================
function resetFilters() {
    currentCategory = 'all';
    currentSearchTerm = '';
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => btn.classList.remove('active'));
    const allBtn = document.querySelector('.category-btn[data-category="all"]');
    if (allBtn) allBtn.classList.add('active');
    
    loadProducts();
}

// ============================================
// CART & WISHLIST FUNCTIONS
// ============================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return showNotification('Product not found', 'error');
    // If the main site exposes a ShoppingCart instance, delegate to it
    if (window.siteCart && typeof window.siteCart.addToCart === 'function') {
        // Convert product to the shape expected by ShoppingCart.addToCart
        const cartProduct = {
            id: product.id,
            title: product.name,
            price: `LKR ${formatPrice(product.price)}`,
            image: product.image || '',
            quantity: 1
        };
        window.siteCart.addToCart(cartProduct);
        return;
    }

    // Fallback: maintain a simple array in localStorage
    const existingCart = JSON.parse(localStorage.getItem('callista-cart') || '[]');
    const existing = existingCart.find(item => item.id === productId);
    if (existing) {
        existing.quantity += 1;
        showNotification(`+1 ${product.name}`, 'success');
    } else {
        existingCart.push({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 });
        showNotification(`${product.name} added!`, 'success');
    }

    localStorage.setItem('callista-cart', JSON.stringify(existingCart));
    // Update any visible cart badges
    updateCartCount();
}

function toggleWishlist(productId) {
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(productId);
        showNotification('Added to wishlist', 'success');
    }
    
    localStorage.setItem('callista-wishlist', JSON.stringify(wishlist));
    updateWishlistIcons();
}

function updateWishlistIcons() {
    document.querySelectorAll('.wishlist-btn').forEach(btn => {
        const id = parseInt(btn.dataset.productId);
        const icon = btn.querySelector('i');
        const active = wishlist.includes(id);
        icon.className = active ? 'fas fa-heart' : 'far fa-heart';
        icon.style.color = active ? '#e11d48' : '#6b7280';
    });
}

function updateCartCount() {
    const badge = document.querySelector('.cart-count');
    if (!badge) return;
    
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = total;
    badge.style.display = total > 0 ? 'flex' : 'none';
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function formatCategory(category) {
    return category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function formatPrice(price) {
    return typeof price === 'string' ? price : price.toLocaleString('en-LK');
}

// ============================================
// NOTIFICATIONS
// ============================================
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container') || createNotificationContainer();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const colors = { success: '#10b981', error: '#ef4444', info: '#3b82f6', warning: '#f59e0b' };
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle', warning: 'fa-exclamation-circle' };
    
    notification.innerHTML = `
        <i class="fas ${icons[type]}" style="color: ${colors[type]}; font-size: 20px;"></i>
        <span style="color: #1f2937; font-weight: 500;">${message}</span>
        <button onclick="this.parentElement.remove()" style="margin-left: auto; background: none; border: none; cursor: pointer; color: #6b7280; font-size: 18px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    notification.style.cssText = `
        background: white; padding: 16px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex; align-items: center; gap: 12px; min-width: 300px; animation: slideIn 0.3s ease;
        border-left: 4px solid ${colors[type]};
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = 'position:fixed;top:20px;right:20px;z-index:10000;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(container);
    return container;
}

// Add notification styles
if (!document.getElementById('notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
        @keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(400px); opacity: 0; } }
    `;
    document.head.appendChild(style);
}
// ============================================
// SHOP BY CATEGORY - ATTRACTIVE JS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 Category Section Initialized');
    
    const categoryCards = document.querySelectorAll('.category-card');
    const productsGrid = document.getElementById('featured-products');
    
    if (categoryCards.length === 0) {
        console.warn('No category cards found');
        return;
    }
    
    console.log(`✅ Found ${categoryCards.length} category cards`);
    
    // 1. Entrance Animation
    categoryCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150);
    });
    
    // 2. Click to Filter Products
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            console.log(`🖱️ Category clicked: ${category}`);
            
            // Remove active class from all
            categoryCards.forEach(c => c.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            
            // Filter products (integrate with your marketplace JS)
            filterProductsByCategory(category);
            
            // Smooth scroll to products
            if (productsGrid) {
                productsGrid.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
    
    // 3. Hover Effects Enhancement
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // 4. Ripple Effect on Click
    categoryCards.forEach(card => {
        card.addEventListener('click', function(e) {
            createRipple(e, this);
        });
    });
});

// Filter Products Function (Connect to your marketplace)
function filterProductsByCategory(category) {
    console.log(`🔄 Filtering products by category: ${category}`);
    
    // Call your existing marketplace filter function
    if (typeof window.loadProducts === 'function') {
        // If you have a global loadProducts function
        window.currentCategory = category;
        window.loadProducts();
    } else {
        // Direct integration with marketplace section
        const marketplaceSection = document.getElementById('marketplace-section');
        if (marketplaceSection) {
            // Trigger custom event for marketplace to listen
            marketplaceSection.dispatchEvent(new CustomEvent('categoryFilter', { 
                detail: { category: category } 
            }));
        }
    }
    
    // Update URL hash for bookmarking
    window.history.replaceState(null, null, `#category-${category}`);
}

// Ripple Effect Function
function createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(139, 69, 19, 0.4);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
        z-index: 10;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add Ripple Animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Listen for Category Filter Events (For Marketplace Integration)
document.addEventListener('categoryFilter', function(e) {
    console.log('📡 Marketplace received category filter:', e.detail.category);
    // Your marketplace filtering logic here
    if (typeof loadProducts === 'function') {
        currentCategory = e.detail.category;
        loadProducts();
    }
});

console.log('🎨 Category Section JS Loaded Successfully!');
// ============================================
// FEATURED COLLECTION CAROUSEL
// ============================================
function setupFeaturedCollection() {
    console.log('✨ Setting up Featured Collection Carousel...');

    // Selectors
    const grid = document.getElementById('featured-collection-grid');
    const prevBtn = document.getElementById('featured-prev');
    const nextBtn = document.getElementById('featured-next');

    // Check if elements exist
    if (!grid || !prevBtn || !nextBtn) {
        console.warn('Featured collection elements not found. Carousel setup skipped.');
        return;
    }

    // 1. Load Featured Products
    const featuredProducts = products.filter(p => p.badge === 'featured');

    if (featuredProducts.length === 0) {
        grid.innerHTML = '<p>No featured products available at the moment.</p>';
        return;
    }

    // Use the existing createProductCard function to populate the grid
    featuredProducts.forEach((product, index) => {
        grid.appendChild(createProductCard(product, index));
    });

    console.log(`✅ Loaded ${featuredProducts.length} featured products.`);

    // 2. Carousel Logic
    let currentIndex = 0;
    let itemsPerView = getItemsPerView();

    function getItemsPerView() {
        if (window.innerWidth <= 768) return 2;
        if (window.innerWidth <= 1200) return 3;
        return 4;
    }

    function updateCarousel() {
        const totalItems = featuredProducts.length;
        const cardWidth = grid.querySelector('.product-card').offsetWidth;
        const gap = 24; // Corresponds to the gap in your CSS
        const moveDistance = (cardWidth + gap) * currentIndex;

        // Apply transform to slide the grid
        grid.style.transform = `translateX(-${moveDistance}px)`;

        // Update button states
        prevBtn.disabled = currentIndex === 0;
        nextBtn.disabled = currentIndex >= totalItems - itemsPerView;
    }

    // Event Listeners
    nextBtn.addEventListener('click', () => {
        const totalItems = featuredProducts.length;
        if (currentIndex < totalItems - itemsPerView) {
            currentIndex++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    // Responsive updates
    window.addEventListener('resize', () => {
        itemsPerView = getItemsPerView();
        // Reset index if it becomes invalid
        if (currentIndex >= featuredProducts.length - itemsPerView) {
            currentIndex = Math.max(0, featuredProducts.length - itemsPerView);
        }
        updateCarousel();
    });

    // Initial setup
    updateCarousel();
}

// Add this line inside your main DOMContentLoaded event listener
document.addEventListener('DOMContentLoaded', function() {
    // ... your existing code ...
    
    // Initialize the featured collection
    if (typeof products !== 'undefined' && typeof createProductCard === 'function') {
        setupFeaturedCollection();
    }
});

// Marketplace UI initialization: wire up filters, search, and UI badges
document.addEventListener('DOMContentLoaded', function () {
    // Setup category filter buttons (if present)
    if (typeof setupCategoryFilters === 'function') {
        try { setupCategoryFilters(); } catch (e) { console.warn('setupCategoryFilters failed', e); }
    }

    // Setup search input handler
    if (typeof setupSearch === 'function') {
        try { setupSearch(); } catch (e) { console.warn('setupSearch failed', e); }
    }

    // Refresh wishlist/cart UI badges
    try { if (typeof updateWishlistIcons === 'function') updateWishlistIcons(); } catch (e) { /* ignore */ }
    try { if (typeof updateCartCount === 'function') updateCartCount(); } catch (e) { /* ignore */ }
});