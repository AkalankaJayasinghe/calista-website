// Cart Page JavaScript
const CART_STORAGE_KEY = 'callista-cart';

document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
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
