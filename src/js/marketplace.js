
// ============================================
// FEATURED PRODUCTS MARKETPLACE FUNCTIONALITY
// ============================================

// Sample product data for the marketplace
let products = [
    {
        id: 1,
        name: "Modern Dining Table",
        category: "tables",
        price: 45000,
        originalPrice: 52000,
        image: "../assets/sofa.png",
        badge: "Popular",
        rating: 4.2,
        seller: "Elite Furniture Co.",
        location: "Colombo 07"
    },
    {
        id: 2,
        name: "Ergonomic Office Chair",
        category: "chairs",
        price: 15000,
        image: "../assets/bed.png",
        badge: "Bestseller",
        rating: 4.8,
        seller: "ComfortSeats Ltd.",
        location: "Kandy"
    },
    {
        id: 3,
        name: "Luxury Sofa Set",
        category: "living-room",
        price: 75000,
        originalPrice: 85000,
        image: "../assets/funi (1).jpeg",
        badge: "Featured",
        rating: 4.5,
        seller: "Premium Living",
        location: "Galle"
    },
    {
        id: 4,
        name: "Complete Bedroom Set",
        category: "bedroom-sets",
        price: 95000,
        image: "../assets/funi (2).jpeg",
        badge: "Customizable",
        rating: 4.3,
        seller: "Dream Bedrooms",
        location: "Colombo 03"
    },
    {
        id: 5,
        name: "Designer Coffee Table",
        category: "tables",
        price: 25000,
        originalPrice: 30000,
        image: "../assets/sofa.png",
        badge: "New",
        rating: 5.0,
        seller: "Modern Designs",
        location: "Negombo"
    },
    {
        id: 6,
        name: "Dining Chairs Set (4)",
        category: "chairs",
        price: 35000,
        image: "../assets/bed.png",
        badge: "Trending",
        rating: 4.1,
        seller: "Chair Masters",
        location: "Matara"
    },
    {
        id: 7,
        name: "Custom Built Wardrobe",
        category: "custom",
        price: 65000,
        image: "../assets/funi (1).jpeg",
        badge: "Custom",
        rating: 4.9,
        seller: "Bespoke Furniture",
        location: "Colombo 05"
    },
    {
        id: 8,
        name: "Modern Entertainment Unit",
        category: "living-room",
        price: 55000,
        originalPrice: 65000,
        image: "../assets/funi (2).jpeg",
        badge: "Sale",
        rating: 4.4,
        seller: "Entertainment Plus",
        location: "Kurunegala"
    }
];

// Current filter and search state
let currentCategory = 'all';
let currentSearchTerm = '';
let currentPriceRange = 'all-price';
let currentRating = 'all-rating';
let currentSort = 'default';
let filterOptions = {
    inStock: true,
    customizable: false,
    onSale: false
};
let cart = JSON.parse(localStorage.getItem('callista-cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('callista-wishlist') || '[]');

// ============================================
// MODERN FILTER SYSTEM
// ============================================

function setupModernFilters() {
    console.log('🔧 Setting up modern filter system...');
    
    // Setup category filters
    const categoryFilters = document.querySelectorAll('.filter-btn[data-type="category"]');
    categoryFilters.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from category filters
            categoryFilters.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentCategory = this.dataset.filter;
            console.log(`📂 Category filter: ${currentCategory}`);
            updateActiveFilters();
            loadProducts();
        });
    });
    
    // Setup price range filters
    const priceFilters = document.querySelectorAll('.filter-btn[data-type="price"]');
    priceFilters.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from price filters
            priceFilters.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentPriceRange = this.dataset.filter;
            console.log(`💰 Price filter: ${currentPriceRange}`);
            updateActiveFilters();
            loadProducts();
        });
    });
    
    // Setup rating filters
    const ratingFilters = document.querySelectorAll('.filter-btn[data-type="rating"]');
    ratingFilters.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from rating filters
            ratingFilters.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentRating = this.dataset.filter;
            console.log(`⭐ Rating filter: ${currentRating}`);
            updateActiveFilters();
            loadProducts();
        });
    });
    
    // Setup sort dropdown
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            console.log(`🔀 Sort: ${currentSort}`);
            updateActiveFilters();
            loadProducts();
        });
    }
    
    // Setup checkbox filters
    const checkboxes = document.querySelectorAll('.checkbox-filter input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            filterOptions[this.id] = this.checked;
            console.log(`✅ ${this.id}: ${this.checked}`);
            updateActiveFilters();
            loadProducts();
        });
    });
    
    // Setup reset button
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllFilters);
    }
    
    console.log('✅ Modern filter system initialized');
}

function resetAllFilters() {
    console.log('🔄 Resetting all filters...');
    
    // Reset filter states
    currentCategory = 'all';
    currentPriceRange = 'all-price';
    currentRating = 'all-rating';
    currentSort = 'default';
    currentSearchTerm = '';
    filterOptions = {
        inStock: true,
        customizable: false,
        onSale: false
    };
    
    // Reset UI elements
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.filter-btn[data-filter="all"], .filter-btn[data-filter="all-price"], .filter-btn[data-filter="all-rating"]')
        .forEach(btn => btn.classList.add('active'));
    
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) sortSelect.value = 'default';
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    // Reset checkboxes
    document.getElementById('inStock').checked = true;
    document.getElementById('customizable').checked = false;
    document.getElementById('onSale').checked = false;
    
    // Update active filters display and reload products
    updateActiveFilters();
    loadProducts();
    
    console.log('✅ All filters reset');
}

function updateActiveFilters() {
    const activeFiltersContainer = document.getElementById('activeFilters');
    const activeFiltersList = document.querySelector('.active-filters-list');
    
    if (!activeFiltersContainer || !activeFiltersList) return;
    
    const activeFilters = [];
    
    // Category filter
    if (currentCategory !== 'all') {
        activeFilters.push({
            type: 'category',
            value: currentCategory,
            label: formatCategory(currentCategory)
        });
    }
    
    // Price filter
    if (currentPriceRange !== 'all-price') {
        const priceLabels = {
            'under-50k': 'Under Rs. 50K',
            '50k-100k': 'Rs. 50K - 100K',
            '100k-200k': 'Rs. 100K - 200K',
            'over-200k': 'Over Rs. 200K'
        };
        activeFilters.push({
            type: 'price',
            value: currentPriceRange,
            label: priceLabels[currentPriceRange]
        });
    }
    
    // Rating filter
    if (currentRating !== 'all-rating') {
        const ratingLabels = {
            '4-plus': '4+ Stars',
            '3-plus': '3+ Stars'
        };
        activeFilters.push({
            type: 'rating',
            value: currentRating,
            label: ratingLabels[currentRating]
        });
    }
    
    // Sort filter
    if (currentSort !== 'default') {
        const sortLabels = {
            'price-low': 'Price: Low to High',
            'price-high': 'Price: High to Low',
            'rating': 'Highest Rated',
            'newest': 'Newest First',
            'popular': 'Most Popular'
        };
        activeFilters.push({
            type: 'sort',
            value: currentSort,
            label: sortLabels[currentSort]
        });
    }
    
    // Checkbox filters
    Object.keys(filterOptions).forEach(key => {
        if (filterOptions[key]) {
            const labels = {
                inStock: 'In Stock',
                customizable: 'Customizable',
                onSale: 'On Sale'
            };
            activeFilters.push({
                type: 'option',
                value: key,
                label: labels[key]
            });
        }
    });
    
    // Search filter
    if (currentSearchTerm) {
        activeFilters.push({
            type: 'search',
            value: currentSearchTerm,
            label: `Search: "${currentSearchTerm}"`
        });
    }
    
    // Update display
    if (activeFilters.length > 0) {
        activeFiltersList.innerHTML = activeFilters.map(filter => `
            <div class="active-filter-tag">
                ${filter.label}
                <button class="remove-filter" onclick="removeFilter('${filter.type}', '${filter.value}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
        activeFiltersContainer.classList.add('show');
    } else {
        activeFiltersContainer.classList.remove('show');
    }
}

function removeFilter(type, value) {
    console.log(`🗑️ Removing filter: ${type} = ${value}`);
    
    switch (type) {
        case 'category':
            currentCategory = 'all';
            document.querySelectorAll('.filter-btn[data-type="category"]').forEach(btn => btn.classList.remove('active'));
            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
            break;
        case 'price':
            currentPriceRange = 'all-price';
            document.querySelectorAll('.filter-btn[data-type="price"]').forEach(btn => btn.classList.remove('active'));
            document.querySelector('.filter-btn[data-filter="all-price"]').classList.add('active');
            break;
        case 'rating':
            currentRating = 'all-rating';
            document.querySelectorAll('.filter-btn[data-type="rating"]').forEach(btn => btn.classList.remove('active'));
            document.querySelector('.filter-btn[data-filter="all-rating"]').classList.add('active');
            break;
        case 'sort':
            currentSort = 'default';
            const sortSelect = document.getElementById('sortSelect');
            if (sortSelect) sortSelect.value = 'default';
            break;
        case 'option':
            filterOptions[value] = false;
            const checkbox = document.getElementById(value);
            if (checkbox) checkbox.checked = false;
            break;
        case 'search':
            currentSearchTerm = '';
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.value = '';
            break;
    }
    
    updateActiveFilters();
    loadProducts();
}

// ============================================
// ENHANCED LOAD PRODUCTS WITH ALL FILTERS
// ============================================
// Handle URL hash for category filtering and cart integration
function handleURLHash() {
    const hash = window.location.hash;
    if (hash.startsWith('#category-')) {
        const category = hash.replace('#category-', '');
        console.log(`🔗 URL hash detected: filtering by category "${category}"`);
        
        // Set the current category
        currentCategory = category;
        
        // Update active tab button
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => btn.classList.remove('active'));
        
        const targetBtn = document.querySelector(`.tab-btn[data-filter="${category}"]`);
        if (targetBtn) {
            targetBtn.classList.add('active');
        } else {
            // If category not found in tabs, activate "All"
            const allBtn = document.querySelector('.tab-btn[data-filter="all"]');
            if (allBtn) allBtn.classList.add('active');
            currentCategory = 'all';
        }
        
        // Load filtered products
        loadProducts();
        
        // Scroll to marketplace section with a slight delay for better UX
        const marketplaceSection = document.getElementById('marketplace-section') || document.getElementById('featured-products');
        if (marketplaceSection) {
            setTimeout(() => {
                marketplaceSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                
                // Show a subtle notification about the filter being applied
                showNotification(`Showing ${formatCategory(category)} products`, 'info');
            }, 500);
        }
    } else if (hash === '#featured-products' || hash === '#marketplace-section') {
        // Direct navigation to products section
        const productsSection = document.getElementById('featured-products') || document.getElementById('marketplace-section');
        if (productsSection) {
            setTimeout(() => {
                productsSection.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                showNotification('Welcome to our marketplace!', 'success');
            }, 300);
        }
    }
}

// ============================================
// ENHANCED LOAD PRODUCTS WITH ALL FILTERS
// ============================================
function loadProducts() {
    const productsContainer = document.getElementById('featured-products');
    const noResultsContainer = document.getElementById('no-results');
    
    if (!productsContainer) {
        console.error('Products container not found!');
        return;
    }

    // Filter products based on all criteria
    let filteredProducts = products.filter(product => {
        // Category filter
        const matchesCategory = currentCategory === 'all' || product.category === currentCategory;
        
        // Search filter
        const matchesSearch = currentSearchTerm === '' || 
            product.name.toLowerCase().includes(currentSearchTerm) ||
            product.category.toLowerCase().includes(currentSearchTerm) ||
            product.seller.toLowerCase().includes(currentSearchTerm);
        
        // Price range filter
        const matchesPrice = filterByPriceRange(product.price, currentPriceRange);
        
        // Rating filter
        const matchesRating = filterByRating(product.rating, currentRating);
        
        // Checkbox filters
        const matchesStock = !filterOptions.inStock || product.inStock !== false; // Assume in stock if not specified
        const matchesCustomizable = !filterOptions.customizable || product.badge === 'Customizable' || product.badge === 'Custom';
        const matchesOnSale = !filterOptions.onSale || product.originalPrice; // Has originalPrice means on sale
        
        return matchesCategory && matchesSearch && matchesPrice && matchesRating && 
               matchesStock && matchesCustomizable && matchesOnSale;
    });

    // Apply sorting
    filteredProducts = sortProducts(filteredProducts, currentSort);

    // Clear existing products
    productsContainer.innerHTML = '';

    if (filteredProducts.length === 0) {
        // Show no results message
        if (noResultsContainer) {
            noResultsContainer.classList.add('show');
        }
        return;
    } else {
        // Hide no results message
        if (noResultsContainer) {
            noResultsContainer.classList.remove('show');
        }
    }

    // Create and append product cards
    filteredProducts.forEach((product, index) => {
        const productCard = createFeaturedProductCard(product, index);
        productsContainer.appendChild(productCard);
    });

    console.log(`✅ Loaded ${filteredProducts.length} products with filters applied`);
}

function filterByPriceRange(price, range) {
    switch (range) {
        case 'under-30k':
            return price < 30000;
        case '30k-60k':
            return price >= 30000 && price <= 60000;
        case '60k-100k':
            return price >= 60000 && price <= 100000;
        case 'over-100k':
            return price > 100000;
        case 'all-price':
        default:
            return true;
    }
}

function filterByRating(rating, filter) {
    switch (filter) {
        case '4-plus':
            return rating >= 4.0;
        case '3-plus':
            return rating >= 3.0;
        case 'all-rating':
        default:
            return true;
    }
}

function sortProducts(products, sortType) {
    const sorted = [...products]; // Create a copy
    
    switch (sortType) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'newest':
            return sorted.sort((a, b) => b.id - a.id); // Assuming higher ID = newer
        case 'popular':
            return sorted.sort((a, b) => {
                // Sort by badge priority: Popular > Bestseller > Featured > Others
                const badgePriority = { 'Popular': 4, 'Bestseller': 3, 'Featured': 2 };
                const priorityA = badgePriority[a.badge] || 1;
                const priorityB = badgePriority[b.badge] || 1;
                return priorityB - priorityA;
            });
        case 'default':
        default:
            return sorted; // Return original order
    }
}

// ============================================
// CREATE FEATURED PRODUCT CARD
// ============================================
function createFeaturedProductCard(product, index) {
    const card = document.createElement('div');
    card.className = `product-card ${product.category}`;
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', `${index * 100}`);
    
    const isInWishlist = wishlist.includes(product.id);
    const heartClass = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
    
    // Generate star rating
    const stars = generateStarRating(product.rating);
    
    // Price display
    const priceDisplay = product.originalPrice ? 
        `<span class="price-current">Rs. ${formatPrice(product.price)}</span>
         <span class="price-original">Rs. ${formatPrice(product.originalPrice)}</span>` :
        `<span class="price-current">Rs. ${formatPrice(product.price)}</span>`;
    
    card.innerHTML = `
        <div class="product-badge">${product.badge}</div>
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='../assets/placeholder-furniture.jpg'">
            <div class="product-overlay">
                <button class="product-action wishlist-btn" data-product-id="${product.id}" title="Add to Wishlist">
                    <i class="${heartClass}"></i>
                </button>
                <button class="product-action" title="Quick View" onclick="quickView(${product.id})">
                    <i class="far fa-eye"></i>
                </button>
                <button class="product-action add-to-cart-btn" data-product-id="${product.id}" title="Add to Cart">
                    <i class="fas fa-shopping-cart"></i>
                </button>
            </div>
        </div>
        <div class="product-info">
            <div class="product-rating">
                ${stars}
                <span>(${product.rating})</span>
            </div>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-price">
                ${priceDisplay}
            </div>
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
// SETUP TAB FILTERS (Featured Products Style)
// ============================================
function setupTabFilters() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update category
            currentCategory = this.dataset.filter || 'all';
            console.log(`📂 Tab filter set to: ${currentCategory}`);
            
            // Load products
            loadProducts();
        });
    });
}

// ============================================
// HELPER FUNCTIONS
// ============================================
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function quickView(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        showNotification(`Quick view for ${product.name}`, 'info');
        // Add your quick view modal logic here
    }
}

function viewProductDetails(productId) {
    console.log('Viewing details for product:', productId);
    // TODO: Navigate to product detail page or show detailed modal
    showNotification('Product details feature coming soon!', 'info');
}

// ============================================
// RESET FILTERS
// ============================================
function resetFilters() {
    currentCategory = 'all';
    currentSearchTerm = '';
    
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));
    const allBtn = document.querySelector('.tab-btn[data-filter="all"]');
    if (allBtn) allBtn.classList.add('active');
    
    loadProducts();
}

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

// Marketplace UI initialization: wire up filters, search, and UI badges







// Marketplace UI initialization: wire up filters, search, and UI badges

// Setup gallery thumbnails
function setupGalleryThumbnails(products) {
    const thumbnailsContainer = document.querySelector('.thumbnails-container');
    if (!thumbnailsContainer) return;

    thumbnailsContainer.innerHTML = '';
    
    products.forEach((product, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = `thumbnail-item ${index === 0 ? 'active' : ''}`;
        thumbnail.innerHTML = `<img src="${product.image}" alt="${product.name}">`;
        
        thumbnail.addEventListener('click', () => {
            const event = new CustomEvent('thumbnailClick', { detail: { index } });
            document.dispatchEvent(event);
        });
        
        thumbnailsContainer.appendChild(thumbnail);
    });
}

// Setup gallery overlay
function setupGalleryOverlay(products) {
    const overlay = document.getElementById('gallery-overlay');
    const overlayClose = document.getElementById('overlay-close');
    
    if (!overlay || !overlayClose) return;

    overlayClose.addEventListener('click', () => {
        overlay.classList.remove('active');
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.classList.remove('active');
        }
    });

    // Handle view details clicks
    document.addEventListener('click', (e) => {
        if (e.target.closest('.view-btn') || e.target.closest('.btn-view-details')) {
            const productId = parseInt(e.target.closest('[data-id]').dataset.id);
            const product = products.find(p => p.id === productId);
            if (product) {
                showProductOverlay(product);
            }
        }
    });
}

// Show product in overlay
function showProductOverlay(product) {
    const overlay = document.getElementById('gallery-overlay');
    const overlayImg = document.getElementById('overlay-img');
    const overlayTitle = document.getElementById('overlay-title');
    const overlayDescription = document.getElementById('overlay-description');
    const overlayPrice = document.getElementById('overlay-price');

    if (overlay && overlayImg && overlayTitle && overlayDescription && overlayPrice) {
        overlayImg.src = product.image;
        overlayImg.alt = product.name;
        overlayTitle.textContent = product.name;
        overlayDescription.textContent = product.description;
        overlayPrice.textContent = `Rs. ${product.price.toLocaleString()}`;
        
        overlay.classList.add('active');
    }
}

    prevBtn.addEventListener('click', () => {
        stopAutoPlay();
        prevSlide();
        if (isPlaying) setTimeout(startAutoPlay, 2000); // Resume after 2 seconds
    });

    // Dot navigation
    dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('slideshow-dot')) {
            const slideIndex = parseInt(e.target.getAttribute('data-slide'));
            stopAutoPlay();
            goToSlide(slideIndex);
            if (isPlaying) setTimeout(startAutoPlay, 2000);
        }
    });

// ============================================
// SIMPLE SLIDESHOW FUNCTIONALITY
// ============================================

let currentSlide = 0;
let slideInterval;

// Initialize simple slideshow
function initFeaturedShowcase() {
    console.log('🎨 Initializing simple slideshow...');
    
    const slidesTrack = document.getElementById('slidesTrack');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('featuredPrev');
    const nextBtn = document.getElementById('featuredNext');
    
    if (!slidesTrack) {
        console.log('❌ Slides track not found');
        return;
    }
    
    // Get all slides
    const slideElements = slidesTrack.querySelectorAll('.slide');
    console.log(`Found ${slideElements.length} slides`);
    
    if (slideElements.length === 0) {
        console.log('❌ No slides found');
        return;
    }
    
    // Setup navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Previous button clicked');
            stopSlideshow();
            previousSlide();
            startSlideshow();
        });
        console.log('✅ Previous button setup');
    } else {
        console.log('❌ Previous button not found');
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Next button clicked');
            stopSlideshow();
            nextSlide();
            startSlideshow();
        });
        console.log('✅ Next button setup');
    } else {
        console.log('❌ Next button not found');
    }
    
    // Setup dots navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            console.log(`Dot ${index} clicked`);
            stopSlideshow();
            goToSlide(index);
            startSlideshow();
        });
    });
    console.log(`✅ ${dots.length} dots setup`);
    
    // Start auto slideshow
    startSlideshow();
    
    // Pause on hover
    const showcaseSection = document.querySelector('.featured-showcase');
    if (showcaseSection) {
        showcaseSection.addEventListener('mouseenter', stopSlideshow);
        showcaseSection.addEventListener('mouseleave', startSlideshow);
        console.log('✅ Hover events setup');
    }
    
    console.log('✅ Simple slideshow initialized');
}

// Navigate to specific slide
function goToSlide(slideIndex) {
    const slideElements = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    
    if (slideElements.length === 0) {
        console.log('❌ No slides found in goToSlide');
        return;
    }
    
    console.log(`Going to slide ${slideIndex} from ${currentSlide}`);
    
    // Remove active class from current slide and dot
    slideElements[currentSlide]?.classList.remove('active');
    dots[currentSlide]?.classList.remove('active');
    
    // Update current slide index
    currentSlide = slideIndex;
    
    // Add active class to new slide and dot
    slideElements[currentSlide]?.classList.add('active');
    dots[currentSlide]?.classList.add('active');
    
    console.log(`✅ Slide ${currentSlide} is now active`);
}

// Next slide
function nextSlide() {
    const slideElements = document.querySelectorAll('.slide');
    if (slideElements.length === 0) return;
    
    const nextIndex = (currentSlide + 1) % slideElements.length;
    goToSlide(nextIndex);
}

// Previous slide
function previousSlide() {
    const slideElements = document.querySelectorAll('.slide');
    if (slideElements.length === 0) return;
    
    const prevIndex = currentSlide === 0 ? slideElements.length - 1 : currentSlide - 1;
    goToSlide(prevIndex);
}

// Start automatic slideshow
function startSlideshow() {
    stopSlideshow(); // Clear any existing interval
    slideInterval = setInterval(() => {
        console.log('Auto advancing slide');
        nextSlide();
    }, 4000); // Change slide every 4 seconds
    console.log('✅ Auto slideshow started');
}

// Stop automatic slideshow
function stopSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
        console.log('⏸️ Auto slideshow stopped');
    }
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const showcaseSection = document.querySelector('.featured-showcase');
    if (!showcaseSection) return;
    
    const rect = showcaseSection.getBoundingClientRect();
    const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (isVisible) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            stopSlideshow();
            previousSlide();
            startSlideshow();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            stopSlideshow();
            nextSlide();
            startSlideshow();
        }
    }
});
        const swipeThreshold = 50;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > swipeThreshold) {
            if (swipeDistance > 0) {
                prevSlide();
            } else {
                nextSlide();
            }
// Marketplace UI initialization: wire up filters, search, and UI badges
document.addEventListener('DOMContentLoaded', function () {
    console.log('🚀 Marketplace JavaScript Loaded!');
    
    // Handle URL hash for category filtering
    handleURLHash();
    
    // Initialize modern filter system
    setupModernFilters();
    
    // Initialize featured products marketplace
    loadProducts();
    setupTabFilters();
    setupSearch();
    setupCategoryFilters(); // For backward compatibility
    
    // Initialize featured showcase
    initFeaturedShowcase();
    
    // Update cart count on page load
    updateCartCount();
    
    // Initialize category section
    if (typeof filterProductsByCategory === 'function') {
        console.log('🎨 Category Section Initialized');
    }
    
    console.log('✅ All marketplace features initialized successfully!');
});

// Listen for hash changes (in case user uses back/forward buttons)
window.addEventListener('hashchange', function() {
    handleURLHash();
});

// ===== CART INTEGRATION TRACKING ===== //

// Track where users came from (cart page integration)
function trackReferrerSource() {
    const referrer = document.referrer;
    const currentPage = window.location.pathname;
    
    if (referrer.includes('cart.html') && currentPage.includes('marketplace.html')) {
        console.log('📊 User navigated from cart to marketplace');
        
        // Show welcome message for cart users
        setTimeout(() => {
            showNotification('Welcome back! Continue shopping for more great products.', 'success');
        }, 1000);
        
        // Track this for analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'navigation', {
                'event_category': 'cart_integration',
                'event_label': 'cart_to_marketplace'
            });
        }
    }
}

// Enhanced cart functionality with marketplace context
function addToCartWithContext(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return showNotification('Product not found', 'error');

    // Add context about where the product was added from
    const productWithContext = {
        ...product,
        addedFrom: 'marketplace',
        addedAt: new Date().toISOString(),
        category: product.category
    };

    // Use existing cart function but with enhanced data
    if (window.siteCart && typeof window.siteCart.addToCart === 'function') {
        const cartProduct = {
            id: product.id,
            title: product.name,
            price: `LKR ${formatPrice(product.price)}`,
            image: product.image || '',
            quantity: 1,
            category: product.category
        };
        window.siteCart.addToCart(cartProduct);
    } else {
        const existingCart = JSON.parse(localStorage.getItem('callista-cart') || '[]');
        const existing = existingCart.find(item => item.id === productId);
        if (existing) {
            existing.quantity += 1;
            showNotification(`+1 ${product.name}`, 'success');
        } else {
            existingCart.push(productWithContext);
            showNotification(`${product.name} added!`, 'success');
        }
        localStorage.setItem('callista-cart', JSON.stringify(existingCart));
    }

    updateCartCount();
    
    // Show quick cart preview option
    showQuickCartOption();
}

function showQuickCartOption() {
    // Create a floating cart preview button
    const existingPreview = document.getElementById('quick-cart-preview');
    if (existingPreview) existingPreview.remove();
    
    const quickCartBtn = document.createElement('div');
    quickCartBtn.id = 'quick-cart-preview';
    quickCartBtn.innerHTML = `
        <button class="quick-cart-button">
            <i class="fas fa-shopping-cart"></i>
            <span>View Cart</span>
        </button>
    `;
    
    quickCartBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        animation: slideInUp 0.3s ease;
    `;
    
    const buttonStyle = `
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 25px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        transition: all 0.3s ease;
    `;
    
    const button = quickCartBtn.querySelector('.quick-cart-button');
    button.style.cssText = buttonStyle;
    
    button.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });
    
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'scale(1.05)';
        button.style.background = 'var(--secondary-color)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'scale(1)';
        button.style.background = 'var(--primary-color)';
    });
    
    document.body.appendChild(quickCartBtn);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (quickCartBtn && quickCartBtn.parentNode) {
            quickCartBtn.style.animation = 'slideOutDown 0.3s ease';
            setTimeout(() => quickCartBtn.remove(), 300);
        }
    }, 5000);
}

// Override the existing addToCart function to use enhanced version
const originalAddToCart = window.addToCart || addToCart;
window.addToCart = addToCartWithContext;

// Track marketplace usage
function trackMarketplaceInteraction(action, data = {}) {
    console.log(`📊 Marketplace interaction: ${action}`, data);
    
    // Send to analytics if available
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': 'marketplace',
            ...data
        });
    }
}

// Add animation styles for quick cart
const quickCartStyles = document.createElement('style');
quickCartStyles.textContent = `
    @keyframes slideInUp {
        from {
            transform: translateY(100px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(quickCartStyles);

// Initialize cart integration tracking
document.addEventListener('DOMContentLoaded', function() {
    trackReferrerSource();
});

console.log('🛒 Marketplace-Cart integration loaded successfully!');