// Cart Page JavaScript
const CART_STORAGE_KEY = 'callista-cart';

document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    setupMarketplaceIntegration();
});

function getCartFromStorage() {
    try {
        return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
    } catch (e) {
        return [];
    }
}

function saveCartToStorage(items) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
}

function initializeCart() {
    renderCart();
    setupPromoCode();
    setupClearCart();
    setupCheckoutButton();
}

function renderCart() {
    const items = getCartFromStorage();
    const container = document.querySelector('.cart-items-section');
    const summarySection = document.querySelector('.cart-summary-section');

    if (!container) return;

    // Preserve the section title element
    const titleEl = container.querySelector('.section-title');
    // Clear everything then re-append the title
    container.innerHTML = '';
    if (titleEl) container.appendChild(titleEl);

    if (!items || items.length === 0) {
        container.innerHTML += `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <a href="marketplace.html" class="btn btn-primary">
                    <i class="fas fa-store"></i> Start Shopping
                </a>
            </div>
        `;
        if (summarySection) summarySection.style.display = 'none';
        updateCartCount();
        return;
    }

    // Recreate cart item elements
    items.forEach(item => {
        const el = createCartItemElement(item);
        container.appendChild(el);
    });

    // Continue shopping button
    const continueHtml = document.createElement('div');
    continueHtml.className = 'continue-shopping';
    continueHtml.innerHTML = `
        <a href="marketplace.html" class="btn btn-outline">
            <i class="fas fa-arrow-left"></i> Continue Shopping
        </a>
    `;
    container.appendChild(continueHtml);

    // Wire up controls for the newly created DOM
    setupQuantityControls();
    setupRemoveButtons();
    updateCartTotals();
    if (summarySection) summarySection.style.display = '';
}

function createCartItemElement(item) {
    const wrapper = document.createElement('div');
    wrapper.className = 'cart-item';
    wrapper.dataset.itemId = item.id;

    wrapper.innerHTML = `
        <div class="item-image">
            <img src="${item.image || '../assets/images/placeholder.jpg'}" alt="${item.title || item.name || ''}" onerror="this.src='../assets/images/placeholder.jpg'">
            ${item.badge ? `<span class="item-badge">${item.badge}</span>` : ''}
        </div>
        <div class="item-details">
            <h3 class="item-name">${item.title || item.name || ''}</h3>
            <p class="item-category"><i class="fas fa-tag"></i> ${item.category || ''}</p>
            <p class="item-description">${item.description || ''}</p>
            <div class="item-specs">
                ${item.color ? `<span><i class="fas fa-palette"></i> Color: ${item.color}</span>` : ''}
                ${item.size ? `<span><i class="fas fa-ruler-combined"></i> Size: ${item.size}</span>` : ''}
            </div>
        </div>
        <div class="item-actions">
            <div class="item-price">
                <span class="current-price">LKR ${formatNumber(item.price)}</span>
                ${item.originalPrice ? `<span class="original-price">LKR ${formatNumber(item.originalPrice)}</span>` : ''}
            </div>
            <div class="quantity-control">
                <button class="qty-btn minus" data-item-id="${item.id}"><i class="fas fa-minus"></i></button>
                <input type="number" class="qty-input" value="${item.quantity || 1}" min="1" max="99" data-item-id="${item.id}">
                <button class="qty-btn plus" data-item-id="${item.id}"><i class="fas fa-plus"></i></button>
            </div>
            <button class="btn-remove" data-item-id="${item.id}"><i class="fas fa-trash-alt"></i> Remove</button>
        </div>
    `;

    return wrapper;
}

function formatNumber(n) {
    if (n == null) return '0';
    const num = typeof n === 'number' ? n : parseFloat(String(n).replace(/[^0-9.-]+/g, '')) || 0;
    return num.toLocaleString();
}

// Quantity Controls
function setupQuantityControls() {
    const minusBtns = document.querySelectorAll('.qty-btn.minus');
    const plusBtns = document.querySelectorAll('.qty-btn.plus');
    const qtyInputs = document.querySelectorAll('.qty-input');

    minusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const input = document.querySelector(`.qty-input[data-item-id="${itemId}"]`);
            let value = parseInt(input.value);
            
            if (value > 1) {
                input.value = value - 1;
                updateCartTotals();
            }
        });
    });

    plusBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const input = document.querySelector(`.qty-input[data-item-id="${itemId}"]`);
            let value = parseInt(input.value);
            const max = parseInt(input.max);
            
            if (value < max) {
                input.value = value + 1;
                updateCartTotals();
            }
        });
    });

    qtyInputs.forEach(input => {
        input.addEventListener('change', function() {
            let value = parseInt(this.value);
            const min = parseInt(this.min);
            const max = parseInt(this.max);
            
            if (value < min) this.value = min;
            if (value > max) this.value = max;
            
            updateCartTotals();
        });
    });
}

function syncQuantityToStorage(itemId, quantity) {
    const items = getCartFromStorage();
    const idx = items.findIndex(i => String(i.id) === String(itemId));
    if (idx > -1) {
        items[idx].quantity = quantity;
        saveCartToStorage(items);
    }
}

// Remove Item
function setupRemoveButtons() {
    const removeBtns = document.querySelectorAll('.btn-remove');

    removeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const itemId = this.dataset.itemId;
            const cartItem = this.closest('.cart-item');

            if (confirm('Are you sure you want to remove this item from your cart?')) {
                cartItem.style.animation = 'slideOutRight 0.3s ease';

                setTimeout(() => {
                    // Remove from DOM
                    cartItem.remove();
                    // Remove from storage
                    let items = getCartFromStorage();
                    items = items.filter(i => String(i.id) !== String(itemId));
                    saveCartToStorage(items);

                    updateCartTotals();
                    updateCartCount();
                    if (items.length === 0) checkEmptyCart();
                }, 300);
            }
        });
    });
}

// Promo Code
function setupPromoCode() {
    const applyBtn = document.querySelector('.btn-apply');
    const promoInput = document.getElementById('promoCode');
    const promoMessage = document.querySelector('.promo-message');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            const code = promoInput.value.trim().toUpperCase();
            
            // Valid promo codes (demo)
            const validCodes = {
                'SAVE10': 10,
                'SAVE20': 20,
                'WELCOME': 15
            };
            
            if (code && validCodes[code]) {
                const discount = validCodes[code];
                promoMessage.textContent = `✓ Promo code applied! ${discount}% discount`;
                promoMessage.className = 'promo-message success';
                promoMessage.style.display = 'block';
                promoInput.disabled = true;
                applyBtn.disabled = true;
                applyBtn.textContent = 'Applied';
                
                // Apply discount
                applyDiscount(discount);
            } else if (code) {
                promoMessage.textContent = '✗ Invalid promo code. Please try again.';
                promoMessage.className = 'promo-message error';
                promoMessage.style.display = 'block';
            }
        });
        
        // Enter key support
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                applyBtn.click();
            }
        });
    }
}

function applyDiscount(percentage) {
    const subtotalElement = document.querySelector('.subtotal-amount');
    const discountElement = document.querySelector('.discount-amount');
    const totalElement = document.querySelector('.total-amount');
    
    const subtotal = parseFloat(subtotalElement.textContent.replace(/[^0-9.]/g, ''));
    const deliveryFee = 1500;
    
    const discountAmount = (subtotal * percentage) / 100;
    const total = subtotal - discountAmount + deliveryFee;
    
    discountElement.textContent = `- LKR ${discountAmount.toLocaleString()}`;
    totalElement.textContent = `LKR ${total.toLocaleString()}`;
    
    // Update savings badge
    const savingsBadge = document.querySelector('.savings-badge');
    savingsBadge.innerHTML = `<i class="fas fa-check-circle"></i> You're saving LKR ${discountAmount.toLocaleString()}!`;
}

// Clear Cart
function setupClearCart() {
    const clearBtn = document.querySelector('.clear-cart');

    if (clearBtn) {
        clearBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to clear your entire cart?')) {
                // Clear storage
                saveCartToStorage([]);
                // Re-render
                renderCart();
                updateCartCount();
            }
        });
    }
}

// Update Cart Totals
function updateCartTotals() {
    const items = getCartFromStorage();
    let subtotal = 0;
    let itemCount = 0;

    items.forEach(item => {
        const price = typeof item.price === 'number' ? item.price : parseFloat(String(item.price).replace(/[^0-9.]/g, '')) || 0;
        const qty = parseInt(item.quantity) || 1;
        subtotal += price * qty;
        itemCount += qty;
    });

    const deliveryFee = 1500;
    const discount = 0; // Default discount (promo applies separately)
    const total = subtotal - discount + deliveryFee;

    // Update UI (guard selectors)
    const subtotalEl = document.querySelector('.subtotal-amount');
    const totalEl = document.querySelector('.total-amount');
    const cartCountText = document.querySelector('.cart-count-text span');
    const cartItemCountEl = document.getElementById('cartItemCount');

    if (subtotalEl) subtotalEl.textContent = `LKR ${subtotal.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `LKR ${total.toLocaleString()}`;
    if (cartItemCountEl) cartItemCountEl.textContent = itemCount;
    if (cartCountText) cartCountText.textContent = itemCount;

    updateCartCount();
}

// Update Cart Count in Navigation
function updateCartCount() {
    const items = getCartFromStorage();
    const itemCount = items.reduce((sum, i) => sum + (parseInt(i.quantity) || 0), 0);
    const cartCountBadges = document.querySelectorAll('.cart-count');
    cartCountBadges.forEach(el => el.textContent = itemCount);
}

// Check if cart is empty
function checkEmptyCart() {
    const items = getCartFromStorage();
    if (!items || items.length === 0) {
        renderCart();
    }
}

// Checkout Button
function setupCheckoutButton() {
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            // Check if user is logged in (demo)
            const isLoggedIn = false; // Change this based on actual auth state
            
            if (isLoggedIn) {
                window.location.href = 'checkout.html';
            } else {
                // Show login prompt
                if (confirm('Please log in to proceed with checkout. Would you like to log in now?')) {
                    window.location.href = 'login.html?redirect=checkout';
                }
            }
        });
    }
}

// Add animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    .empty-cart {
        text-align: center;
        padding: 80px 40px;
        background: white;
        border-radius: 16px;
        border: 1px dashed var(--border-color);
    }
    
    .empty-cart i {
        font-size: 5rem;
        color: var(--gray-color);
        opacity: 0.3;
        margin-bottom: 24px;
    }
    
    .empty-cart h2 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--dark-color);
        margin-bottom: 12px;
    }
    
    .empty-cart p {
        font-size: 1.1rem;
        color: var(--gray-color);
        margin-bottom: 32px;
    }
`;
document.head.appendChild(style);

// Quick Add to Cart (for recommended products)
document.querySelectorAll('.quick-add').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        
        // Add animation
        this.innerHTML = '<i class="fas fa-check"></i>';
        this.style.background = 'var(--secondary-color)';
        this.style.color = 'white';
        
        // Show notification
        showNotification('Product added to cart!', 'success');
        
        // Reset button after 2 seconds
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-shopping-cart"></i>';
            this.style.background = '';
            this.style.color = '';
        }, 2000);
        
        // Add to storage-backed cart (or delegate to siteCart)
        try {
            // Try to extract product info from DOM card
            const card = this.closest('.product-card');
            const title = card.querySelector('h4')?.textContent || card.querySelector('.product-title')?.textContent || 'Product';
            const priceText = card.querySelector('.product-price')?.textContent || card.querySelector('.price-current')?.textContent || '';
            const price = parseFloat(String(priceText).replace(/[^0-9.]/g, '')) || 0;
            const image = card.querySelector('img')?.src || '';

            if (window.siteCart && typeof window.siteCart.addToCart === 'function') {
                window.siteCart.addToCart({ id: Date.now(), title, price: `LKR ${price.toLocaleString()}`, image, quantity: 1 });
            } else {
                const items = getCartFromStorage();
                // simple de-dup by title
                const existing = items.find(i => i.title === title);
                if (existing) existing.quantity = (existing.quantity || 1) + 1;
                else items.push({ id: Date.now(), title, price, image, quantity: 1 });
                saveCartToStorage(items);
                updateCartCount();
            }
        } catch (e) {
            console.warn('quick-add failed to add to cart', e);
        }
    });
});

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${type === 'success' ? '#d1fae5' : '#fee'};
        color: ${type === 'success' ? '#065f46' : '#dc2626'};
        padding: 16px 24px;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 500;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Animation for notification
const notificationStyle = document.createElement('style');
notificationStyle.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
`;
document.head.appendChild(notificationStyle);

// ===== MARKETPLACE INTEGRATION ===== //

function setupMarketplaceIntegration() {
    // Setup category links to navigate to marketplace with specific filters
    setupCategoryLinks();
    
    // Setup quick access navigation
    setupQuickAccessLinks();
    
    // Enhance navigation buttons
    enhanceNavigationButtons();
    
    // Setup cross-selling recommendations
    setupCrossSelling();
}

function setupCategoryLinks() {
    const categoryLinks = document.querySelectorAll('.category-link');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Track the category click (for analytics)
            console.log('Category navigation:', this.textContent);
        });
    });
}

function setupQuickAccessLinks() {
    const quickAccessItems = document.querySelectorAll('.quick-access-item');
    
    quickAccessItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.6);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Track quick access usage
            console.log('Quick access used:', this.textContent);
        });
    });
}

function enhanceNavigationButtons() {
    // Enhance "Continue Shopping" button
    const continueShoppingBtn = document.querySelector('.continue-shopping .btn-outline');
    if (continueShoppingBtn) {
        continueShoppingBtn.addEventListener('click', function(e) {
            // Add loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            // Simulate loading and then navigate
            setTimeout(() => {
                window.location.href = this.href;
            }, 500);
        });
    }
    
    // Enhance "Browse All Products" button
    const browseAllBtn = document.querySelector('.continue-shopping .btn-secondary');
    if (browseAllBtn) {
        browseAllBtn.addEventListener('click', function(e) {
            // Add pulse animation
            this.style.animation = 'pulse 0.3s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 300);
        });
    }
}

function setupCrossSelling() {
    // Smart product recommendations based on cart contents
    const cartItems = getCartFromStorage();
    const recommendedProducts = document.querySelectorAll('.recommended-products .product-card');
    
    if (cartItems.length > 0) {
        // Highlight complementary products
        recommendedProducts.forEach(product => {
            const category = product.dataset.category;
            if (shouldRecommendCategory(cartItems, category)) {
                const badge = document.createElement('div');
                badge.className = 'recommended-badge';
                badge.innerHTML = '<i class="fas fa-thumbs-up"></i> Recommended';
                badge.style.cssText = `
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    background: #10b981;
                    color: white;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    z-index: 5;
                `;
                
                const productImage = product.querySelector('.product-image');
                if (productImage) {
                    productImage.style.position = 'relative';
                    productImage.appendChild(badge);
                }
            }
        });
    }
}

function shouldRecommendCategory(cartItems, category) {
    // Smart recommendation logic
    const cartCategories = cartItems.map(item => item.category).filter(Boolean);
    
    // Recommend complementary categories
    const recommendations = {
        'living-room': ['tables', 'chairs'],
        'bedroom-sets': ['tables', 'chairs'],
        'tables': ['chairs', 'living-room'],
        'chairs': ['tables', 'living-room']
    };
    
    return cartCategories.some(cartCategory => 
        recommendations[cartCategory]?.includes(category)
    );
}

// Add ripple animation style
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Enhanced shopping cart integration with marketplace
function addMarketplaceProductToCart(productElement) {
    const productName = productElement.querySelector('h4').textContent;
    const productPrice = productElement.querySelector('.product-price').textContent;
    const productImage = productElement.querySelector('img').src;
    const category = productElement.dataset.category;
    
    const product = {
        id: Date.now(),
        title: productName,
        name: productName,
        price: productPrice,
        image: productImage,
        category: category,
        quantity: 1
    };
    
    // Add to cart using existing function
    if (window.siteCart && typeof window.siteCart.addToCart === 'function') {
        window.siteCart.addToCart(product);
    } else {
        const items = getCartFromStorage();
        const existing = items.find(item => item.title === product.title);
        if (existing) {
            existing.quantity += 1;
        } else {
            items.push(product);
        }
        saveCartToStorage(items);
        updateCartCount();
    }
    
    // Show enhanced notification
    showNotification(`${productName} added to cart!`, 'success');
    
    // Update page to reflect new cart state
    setTimeout(() => {
        updateCartTotals();
        renderCart();
    }, 500);
}

// Connect recommended products to cart functionality
document.querySelectorAll('.recommended-products .quick-add').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const productCard = this.closest('.product-card');
        addMarketplaceProductToCart(productCard);
        
        // Visual feedback
        this.innerHTML = '<i class="fas fa-check"></i>';
        this.style.background = '#10b981';
        this.style.color = 'white';
        
        setTimeout(() => {
            this.innerHTML = '<i class="fas fa-shopping-cart"></i>';
            this.style.background = '';
            this.style.color = '';
        }, 2000);
    });
});

console.log('✅ Cart page marketplace integration loaded successfully!');
