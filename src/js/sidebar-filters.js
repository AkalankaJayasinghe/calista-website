/**
 * Sidebar Filter System
 * Simplified filtering for marketplace products
 */

class SidebarFilters {
    constructor() {
        this.products = document.querySelectorAll('.product-card');
        this.categoryFilters = document.querySelectorAll('input[name="category"]');
        this.priceMin = document.getElementById('priceMin');
        this.priceMax = document.getElementById('priceMax');
        this.ratingFilters = document.querySelectorAll('input[name="rating"]');
        this.featureFilters = document.querySelectorAll('input[name="features"]');
        this.resultsCount = document.querySelector('.results-count');
        
        this.init();
    }

    init() {
        // Add event listeners
        this.categoryFilters.forEach(filter => {
            filter.addEventListener('change', () => this.applyFilters());
        });

        this.ratingFilters.forEach(filter => {
            filter.addEventListener('change', () => this.applyFilters());
        });

        this.featureFilters.forEach(filter => {
            filter.addEventListener('change', () => this.applyFilters());
        });

        // Price filter with debounce
        let priceTimeout;
        [this.priceMin, this.priceMax].forEach(input => {
            if (input) {
                input.addEventListener('input', () => {
                    this.validatePriceInputs();
                    clearTimeout(priceTimeout);
                    priceTimeout = setTimeout(() => this.applyFilters(), 500);
                });
                
                input.addEventListener('blur', () => {
                    this.validatePriceInputs();
                });
            }
        });

        // Clear filters button
        const clearBtn = document.getElementById('clearFilters');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearAllFilters());
        }
    }

    applyFilters() {
        let visibleCount = 0;
        
        this.products.forEach(product => {
            const matchesFilters = this.checkProductMatches(product);
            
            if (matchesFilters) {
                product.style.display = 'block';
                product.classList.remove('hidden');
                visibleCount++;
            } else {
                product.style.display = 'none';
                product.classList.add('hidden');
            }
        });

        this.updateResultsCount(visibleCount);
        this.animateResults();
    }

    checkProductMatches(product) {
        // Check category filter
        if (!this.checkCategoryMatch(product)) return false;
        
        // Check price range
        if (!this.checkPriceMatch(product)) return false;
        
        // Check rating filter
        if (!this.checkRatingMatch(product)) return false;
        
        // Check feature filters
        if (!this.checkFeatureMatch(product)) return false;

        return true;
    }

    checkCategoryMatch(product) {
        const selectedCategory = document.querySelector('input[name="category"]:checked');
        if (!selectedCategory || selectedCategory.value === 'all') return true;
        
        const productCategory = product.dataset.category;
        return productCategory === selectedCategory.value;
    }

    checkPriceMatch(product) {
        const minPrice = parseFloat(this.priceMin?.value) || 0;
        const maxPrice = parseFloat(this.priceMax?.value) || Infinity;
        
        // If both inputs are empty, show all products
        if (!this.priceMin?.value && !this.priceMax?.value) return true;
        
        // Validate price range
        if (minPrice > maxPrice && maxPrice !== Infinity) return false;
        
        const priceText = product.querySelector('.product-price')?.textContent;
        if (!priceText) return true;
        
        // Extract price number from text (handles various formats like $1,234.50, Rs. 1234, etc.)
        const productPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));
        
        // Check if product price falls within range
        return productPrice >= minPrice && productPrice <= maxPrice;
    }

    checkRatingMatch(product) {
        const selectedRating = document.querySelector('input[name="rating"]:checked');
        if (!selectedRating || selectedRating.value === 'all') return true;
        
        const minRating = parseFloat(selectedRating.value);
        const productRating = parseFloat(product.dataset.rating) || 0;
        
        return productRating >= minRating;
    }

    checkFeatureMatch(product) {
        const selectedFeatures = Array.from(document.querySelectorAll('input[name="features"]:checked'))
            .map(input => input.value);
        
        if (selectedFeatures.length === 0) return true;
        
        const productFeatures = (product.dataset.features || '').split(',').map(f => f.trim());
        
        return selectedFeatures.some(feature => productFeatures.includes(feature));
    }

    updateResultsCount(count) {
        if (this.resultsCount) {
            this.resultsCount.textContent = `${count} product${count !== 1 ? 's' : ''} found`;
        }
    }

    animateResults() {
        // Add subtle animation to visible products
        const visibleProducts = document.querySelectorAll('.product-card:not(.hidden)');
        visibleProducts.forEach((product, index) => {
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                product.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                product.style.opacity = '1';
                product.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }

    validatePriceInputs() {
        const minValue = parseFloat(this.priceMin?.value) || 0;
        const maxValue = parseFloat(this.priceMax?.value) || 0;
        
        // Remove any existing error classes
        if (this.priceMin) this.priceMin.classList.remove('error');
        if (this.priceMax) this.priceMax.classList.remove('error');
        
        // Validate min price
        if (this.priceMin?.value && minValue < 0) {
            this.priceMin.classList.add('error');
            this.priceMin.value = '0';
        }
        
        // Validate max price
        if (this.priceMax?.value && maxValue < 0) {
            this.priceMax.classList.add('error');
            this.priceMax.value = '0';
        }
        
        // Check if min is greater than max
        if (this.priceMin?.value && this.priceMax?.value && minValue > maxValue) {
            this.priceMin.classList.add('error');
            this.priceMax.classList.add('error');
        }
    }

    clearAllFilters() {
        // Reset category to "All Categories"
        const allCategoryRadio = document.querySelector('input[name="category"][value="all"]');
        if (allCategoryRadio) allCategoryRadio.checked = true;

        // Clear price inputs
        if (this.priceMin) this.priceMin.value = '';
        if (this.priceMax) this.priceMax.value = '';

        // Reset rating to "All Ratings"
        const allRatingRadio = document.querySelector('input[name="rating"][value="all"]');
        if (allRatingRadio) allRatingRadio.checked = true;

        // Uncheck all feature filters
        this.featureFilters.forEach(filter => {
            filter.checked = false;
        });

        // Apply filters to show all products
        this.applyFilters();
    }
}

// Sorting functionality
class ProductSorter {
    constructor() {
        this.sortSelect = document.getElementById('sortProducts');
        this.productsContainer = document.querySelector('.products-grid');
        
        if (this.sortSelect) {
            this.sortSelect.addEventListener('change', () => this.sortProducts());
        }
    }

    sortProducts() {
        const sortValue = this.sortSelect.value;
        const products = Array.from(document.querySelectorAll('.product-card'));
        
        products.sort((a, b) => {
            switch (sortValue) {
                case 'price-low':
                    return this.getPrice(a) - this.getPrice(b);
                case 'price-high':
                    return this.getPrice(b) - this.getPrice(a);
                case 'rating':
                    return this.getRating(b) - this.getRating(a);
                case 'name':
                    return this.getName(a).localeCompare(this.getName(b));
                default: // 'newest'
                    return 0; // Keep original order
            }
        });

        // Reorder DOM elements
        products.forEach(product => {
            this.productsContainer.appendChild(product);
        });
    }

    getPrice(product) {
        const priceText = product.querySelector('.product-price')?.textContent || '0';
        return parseFloat(priceText.replace(/[^\d.]/g, ''));
    }

    getRating(product) {
        return parseFloat(product.dataset.rating) || 0;
    }

    getName(product) {
        return product.querySelector('.product-name')?.textContent || '';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SidebarFilters();
    new ProductSorter();
});

// Mobile filter toggle
document.addEventListener('DOMContentLoaded', () => {
    const filterToggle = document.querySelector('.mobile-filter-toggle');
    const filterSidebar = document.querySelector('.filter-sidebar');
    const filterOverlay = document.querySelector('.filter-overlay');

    if (filterToggle && filterSidebar) {
        filterToggle.addEventListener('click', () => {
            filterSidebar.classList.toggle('active');
            document.body.classList.toggle('filter-open');
        });
    }

    if (filterOverlay) {
        filterOverlay.addEventListener('click', () => {
            filterSidebar.classList.remove('active');
            document.body.classList.remove('filter-open');
        });
    }
});