/**
 * Enhanced Smart Filter System for Marketplace
 * Implements modern UI/UX patterns with progressive disclosure and clear visual hierarchy
 */

class SmartFilterSystem {
    constructor() {
        this.filters = {
            category: 'all',
            priceMin: 0,
            priceMax: 500000,
            rating: 'all',
            features: {
                inStock: true,
                customizable: false,
                onSale: false,
                freeShipping: false
            },
            sort: 'default'
        };
        
        this.products = [];
        this.filteredProducts = [];
        this.activeFilters = new Map();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadProducts();
        this.setupPriceSlider();
        this.updateResultsCount();
    }

    setupEventListeners() {
        // Mobile filter toggle
        const filterToggle = document.getElementById('filterToggle');
        const filterPanel = document.getElementById('filterPanel');
        
        if (filterToggle && filterPanel) {
            filterToggle.addEventListener('click', () => {
                const isExpanded = filterToggle.getAttribute('aria-expanded') === 'true';
                filterToggle.setAttribute('aria-expanded', !isExpanded);
                filterPanel.classList.toggle('expanded', !isExpanded);
            });
        }

        // Advanced filters toggle
        const advancedToggle = document.getElementById('advancedToggle');
        const advancedPanel = document.getElementById('advancedPanel');
        
        if (advancedToggle && advancedPanel) {
            advancedToggle.addEventListener('click', () => {
                const isExpanded = advancedToggle.getAttribute('aria-expanded') === 'true';
                advancedToggle.setAttribute('aria-expanded', !isExpanded);
                advancedPanel.classList.toggle('expanded', !isExpanded);
            });
        }

        // Category pills
        document.querySelectorAll('.category-pill').forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleCategoryChange(pill);
            });
        });

        // Sort select
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sort = e.target.value;
                this.updateActiveFilter('sort', this.getSortDisplayName(e.target.value));
                this.applyFilters();
            });
        }

        // Rating filters
        document.querySelectorAll('input[name="rating"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.filters.rating = e.target.value;
                this.updateActiveFilter('rating', this.getRatingDisplayName(e.target.value));
                this.applyFilters();
            });
        });

        // Feature checkboxes
        document.querySelectorAll('.feature-checkbox input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const featureName = e.target.id;
                this.filters.features[featureName] = e.target.checked;
                
                if (e.target.checked) {
                    this.updateActiveFilter(`feature-${featureName}`, this.getFeatureDisplayName(featureName));
                } else {
                    this.removeActiveFilter(`feature-${featureName}`);
                }
                this.applyFilters();
            });
        });

        // Reset buttons
        document.getElementById('quickReset')?.addEventListener('click', () => {
            this.resetAllFilters();
        });

        document.getElementById('clearAllFilters')?.addEventListener('click', () => {
            this.resetAllFilters();
        });

        // Search input (if exists)
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }
    }

    setupPriceSlider() {
        const priceMin = document.getElementById('priceMin');
        const priceMax = document.getElementById('priceMax');
        const minInput = document.getElementById('minPrice');
        const maxInput = document.getElementById('maxPrice');
        const sliderTrack = document.querySelector('.slider-track');

        if (!priceMin || !priceMax || !minInput || !maxInput || !sliderTrack) return;

        const updateSliderTrack = () => {
            const minPercent = (priceMin.value / priceMin.max) * 100;
            const maxPercent = (priceMax.value / priceMax.max) * 100;
            
            sliderTrack.style.left = minPercent + '%';
            sliderTrack.style.width = (maxPercent - minPercent) + '%';
        };

        const updateFilters = () => {
            this.filters.priceMin = parseInt(priceMin.value);
            this.filters.priceMax = parseInt(priceMax.value);
            
            minInput.value = this.filters.priceMin;
            maxInput.value = this.filters.priceMax;
            
            this.updateActiveFilter('price', `Rs. ${this.formatPrice(this.filters.priceMin)} - Rs. ${this.formatPrice(this.filters.priceMax)}`);
            this.applyFilters();
        };

        [priceMin, priceMax].forEach(slider => {
            slider.addEventListener('input', () => {
                if (parseInt(priceMin.value) > parseInt(priceMax.value)) {
                    if (slider === priceMin) {
                        priceMax.value = priceMin.value;
                    } else {
                        priceMin.value = priceMax.value;
                    }
                }
                updateSliderTrack();
                updateFilters();
            });
        });

        [minInput, maxInput].forEach(input => {
            input.addEventListener('change', () => {
                const min = Math.max(0, Math.min(parseInt(minInput.value) || 0, 500000));
                const max = Math.max(min, Math.min(parseInt(maxInput.value) || 500000, 500000));
                
                priceMin.value = min;
                priceMax.value = max;
                minInput.value = min;
                maxInput.value = max;
                
                updateSliderTrack();
                updateFilters();
            });
        });

        updateSliderTrack();
    }

    handleCategoryChange(clickedPill) {
        // Update active pill
        document.querySelectorAll('.category-pill').forEach(pill => {
            pill.classList.remove('active');
            pill.setAttribute('aria-selected', 'false');
        });
        
        clickedPill.classList.add('active');
        clickedPill.setAttribute('aria-selected', 'true');
        
        // Update filter
        this.filters.category = clickedPill.dataset.filter;
        
        if (this.filters.category === 'all') {
            this.removeActiveFilter('category');
        } else {
            this.updateActiveFilter('category', clickedPill.querySelector('.pill-text').textContent);
        }
        
        this.applyFilters();
    }

    handleSearch(query) {
        this.searchQuery = query.toLowerCase().trim();
        
        if (this.searchQuery) {
            this.updateActiveFilter('search', `"${query}"`);
        } else {
            this.removeActiveFilter('search');
        }
        
        this.applyFilters();
    }

    loadProducts() {
        // Get products from the page
        const productCards = document.querySelectorAll('.product-card');
        this.products = Array.from(productCards).map(card => {
            const priceText = card.querySelector('.price-current')?.textContent || '';
            const price = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
            
            const ratingStars = card.querySelectorAll('.product-rating .fas.fa-star').length;
            
            return {
                element: card,
                category: this.getProductCategory(card),
                price: price,
                rating: ratingStars,
                title: card.querySelector('.product-title')?.textContent || '',
                badge: card.querySelector('.product-badge')?.textContent || '',
                inStock: !card.classList.contains('out-of-stock'),
                customizable: card.querySelector('.product-badge')?.textContent.toLowerCase().includes('custom'),
                onSale: card.querySelector('.price-original') !== null,
                freeShipping: Math.random() > 0.5 // Random for demo
            };
        });
        
        this.filteredProducts = [...this.products];
    }

    getProductCategory(card) {
        const classes = card.className;
        if (classes.includes('living-room')) return 'living-room';
        if (classes.includes('bedroom-sets')) return 'bedroom-sets';
        if (classes.includes('tables')) return 'tables';
        if (classes.includes('chairs')) return 'chairs';
        if (classes.includes('custom')) return 'custom';
        return 'other';
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.category !== 'all' && product.category !== this.filters.category) {
                return false;
            }

            // Price filter
            if (product.price < this.filters.priceMin || product.price > this.filters.priceMax) {
                return false;
            }

            // Rating filter
            if (this.filters.rating !== 'all') {
                const minRating = parseInt(this.filters.rating.replace('+', ''));
                if (product.rating < minRating) {
                    return false;
                }
            }

            // Feature filters
            if (this.filters.features.inStock && !product.inStock) return false;
            if (this.filters.features.customizable && !product.customizable) return false;
            if (this.filters.features.onSale && !product.onSale) return false;
            if (this.filters.features.freeShipping && !product.freeShipping) return false;

            // Search filter
            if (this.searchQuery) {
                const searchableText = (product.title + ' ' + product.badge).toLowerCase();
                if (!searchableText.includes(this.searchQuery)) {
                    return false;
                }
            }

            return true;
        });

        this.sortProducts();
        this.renderProducts();
        this.updateResultsCount();
        this.updateFilterCount();
    }

    sortProducts() {
        const sortMap = {
            'default': () => 0,
            'price-low': (a, b) => a.price - b.price,
            'price-high': (a, b) => b.price - a.price,
            'rating': (a, b) => b.rating - a.rating,
            'newest': () => Math.random() - 0.5, // Random for demo
            'popular': () => Math.random() - 0.5 // Random for demo
        };

        if (sortMap[this.filters.sort]) {
            this.filteredProducts.sort(sortMap[this.filters.sort]);
        }
    }

    renderProducts() {
        const productsGrid = document.getElementById('featured-products');
        const noResults = document.getElementById('no-results');

        if (!productsGrid) return;

        // Hide all products first
        this.products.forEach(product => {
            product.element.style.display = 'none';
        });

        if (this.filteredProducts.length === 0) {
            noResults?.classList.add('show');
        } else {
            noResults?.classList.remove('show');
            
            // Show filtered products with staggered animation
            this.filteredProducts.forEach((product, index) => {
                product.element.style.display = 'block';
                product.element.style.animationDelay = `${index * 0.1}s`;
            });
        }
    }

    updateActiveFilter(key, value) {
        this.activeFilters.set(key, value);
        this.renderActiveFilters();
    }

    removeActiveFilter(key) {
        this.activeFilters.delete(key);
        this.renderActiveFilters();
    }

    renderActiveFilters() {
        const activeFiltersDisplay = document.getElementById('activeFiltersDisplay');
        const activeFiltersList = document.getElementById('activeFiltersList');

        if (!activeFiltersDisplay || !activeFiltersList) return;

        if (this.activeFilters.size === 0) {
            activeFiltersDisplay.classList.remove('show');
            return;
        }

        activeFiltersDisplay.classList.add('show');
        activeFiltersList.innerHTML = '';

        this.activeFilters.forEach((value, key) => {
            const tag = document.createElement('div');
            tag.className = 'active-filter-tag';
            tag.innerHTML = `
                <span>${value}</span>
                <button class="remove-filter" data-filter="${key}" title="Remove ${value} filter">
                    <i class="fas fa-times"></i>
                </button>
            `;

            tag.querySelector('.remove-filter').addEventListener('click', () => {
                this.removeSpecificFilter(key);
            });

            activeFiltersList.appendChild(tag);
        });
    }

    removeSpecificFilter(key) {
        // Reset the specific filter and update UI
        switch (key) {
            case 'category':
                this.filters.category = 'all';
                document.querySelector('.category-pill[data-filter="all"]')?.click();
                break;
            case 'price':
                this.filters.priceMin = 0;
                this.filters.priceMax = 500000;
                document.getElementById('priceMin').value = 0;
                document.getElementById('priceMax').value = 500000;
                document.getElementById('minPrice').value = 0;
                document.getElementById('maxPrice').value = 500000;
                break;
            case 'rating':
                this.filters.rating = 'all';
                document.querySelector('input[name="rating"][value="all"]').checked = true;
                break;
            case 'sort':
                this.filters.sort = 'default';
                document.getElementById('sortSelect').value = 'default';
                break;
            case 'search':
                this.searchQuery = '';
                document.getElementById('searchInput').value = '';
                break;
            default:
                if (key.startsWith('feature-')) {
                    const featureName = key.replace('feature-', '');
                    this.filters.features[featureName] = false;
                    document.getElementById(featureName).checked = false;
                }
        }

        this.removeActiveFilter(key);
        this.applyFilters();
    }

    resetAllFilters() {
        // Reset all filter values
        this.filters = {
            category: 'all',
            priceMin: 0,
            priceMax: 500000,
            rating: 'all',
            features: {
                inStock: true,
                customizable: false,
                onSale: false,
                freeShipping: false
            },
            sort: 'default'
        };

        this.searchQuery = '';
        this.activeFilters.clear();

        // Reset UI elements
        document.querySelector('.category-pill[data-filter="all"]')?.click();
        document.getElementById('sortSelect').value = 'default';
        document.querySelector('input[name="rating"][value="all"]').checked = true;
        
        // Reset checkboxes
        Object.keys(this.filters.features).forEach(feature => {
            const checkbox = document.getElementById(feature);
            if (checkbox) {
                checkbox.checked = this.filters.features[feature];
            }
        });

        // Reset price inputs
        document.getElementById('priceMin').value = 0;
        document.getElementById('priceMax').value = 500000;
        document.getElementById('minPrice').value = 0;
        document.getElementById('maxPrice').value = 500000;

        // Reset search
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = '';

        this.applyFilters();
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) {
            resultsCount.textContent = this.filteredProducts.length;
        }
    }

    updateFilterCount() {
        const filterCount = document.getElementById('filterCount');
        if (filterCount) {
            filterCount.textContent = this.activeFilters.size;
            filterCount.style.display = this.activeFilters.size > 0 ? 'flex' : 'none';
        }
    }

    // Helper methods for display names
    getSortDisplayName(value) {
        const sortNames = {
            'default': 'Recommended',
            'price-low': 'Price: Low to High',
            'price-high': 'Price: High to Low',
            'rating': 'Highest Rated',
            'newest': 'Newest First',
            'popular': 'Most Popular'
        };
        return sortNames[value] || value;
    }

    getRatingDisplayName(value) {
        return value === 'all' ? 'All Ratings' : `${value} Stars & Up`;
    }

    getFeatureDisplayName(feature) {
        const featureNames = {
            'inStock': 'In Stock',
            'customizable': 'Customizable',
            'onSale': 'On Sale',
            'freeShipping': 'Free Shipping'
        };
        return featureNames[feature] || feature;
    }

    formatPrice(price) {
        return price.toLocaleString('en-IN');
    }
}

// Initialize the smart filter system when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SmartFilterSystem();
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartFilterSystem;
}