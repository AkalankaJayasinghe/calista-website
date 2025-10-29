// Interior Design Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeInteriorPage();
}); 

function initializeInteriorPage() {
    setupPortfolioFilters();
    setupConsultationForm();
    setupFAQ(); 
    setupPortfolioModal();
    setupHeroButtons();
}

// Portfolio filtering
function setupPortfolioFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Consultation form handling
function setupConsultationForm() {
    const form = document.getElementById('consultationForm'); 
    
    if (form) {
        form.addEventListener('submit', function(e) { 
            e.preventDefault();
            
            if (validateConsultationForm()) {
                submitConsultationForm();
            }
        });
        
        // Set minimum date to today
        const dateInput = document.getElementById('preferredDate'); 
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }
    }
}

function validateConsultationForm() {
    const form = document.getElementById('consultationForm'); 
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }
    });
    
    // Email validation
    const email = document.getElementById('email'); 
    if (email.value && !isValidEmail(email.value)) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation
    const phone = document.getElementById('phone'); 
    if (phone.value && !isValidPhone(phone.value)) {
        showFieldError(phone, 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    
    let errorElement = field.parentNode.querySelector('.field-error'); 
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 4px;
        `;
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.style.borderColor = 'var(--border-color)';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function submitConsultationForm() {
    const form = document.getElementById('consultationForm'); 
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking Consultation...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    }, 2000);
}

function showSuccessMessage() {
    const message = document.createElement('div'); 
    message.className = 'success-message';
    message.style.cssText = `
        background: #d1fae5;
        border: 1px solid #a7f3d0;
        color: #065f46;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 24px;
        position: fixed;
        top: 100px;
        right: 24px;
        max-width: 400px;
        z-index: 10000;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    `;
    
    message.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-check-circle" style="color: #059669; font-size: 20px;"></i>
            <div>
                <strong>Consultation Booked Successfully!</strong>
                <p style="margin: 4px 0 0; font-size: 14px;">Thank you for booking a consultation. Our design team will contact you within 24 hours to confirm your appointment and discuss your project details.</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(message);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        message.style.opacity = '0';
        message.style.transition = 'opacity 0.3s ease';
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300);
    }, 8000);
}

// FAQ accordion functionality
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Portfolio modal functionality
function setupPortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    
    // Close modal when clicking overlay or close button
    if (modal) {
        const overlay = modal.querySelector('.modal-overlay');
        const closeBtn = modal.querySelector('.modal-close');
        
        if (overlay) {
            overlay.addEventListener('click', closePortfolioModal);
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closePortfolioModal);
        }
        
        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closePortfolioModal();
            }
        });
    }
}

function openPortfolioModal(projectId) {
    const modal = document.getElementById('portfolioModal');
    if (!modal) return;
    
    // Portfolio data
    const portfolioData = {
        1: {
            title: 'Modern Living Room',
            description: 'A contemporary living room design featuring minimalist furniture, neutral color palette, and statement lighting. This project showcases how less can be more, with carefully selected pieces that create a harmonious and sophisticated space.',
            image: '../images/portfolio/modern-living-room.jpg',
            category: 'Residential',
            date: 'September 2024'
        },
        2: {
            title: 'Executive Office',
            description: 'Professional workspace designed for productivity and style. Features luxury finishes, ergonomic furniture, and smart storage solutions. The design balances professionalism with comfort, creating an environment that inspires excellence.',
            image: '../images/portfolio/office-space.jpg',
            category: 'Commercial',
            date: 'August 2024'
        },
        3: {
            title: 'Luxury Bedroom Suite',
            description: 'An elegant master bedroom with custom furnishings, plush textiles, and a carefully curated color scheme. This sanctuary combines comfort with luxury, featuring a walk-in closet and spa-inspired ensuite bathroom.',
            image: '../images/portfolio/luxury-bedroom.jpg',
            category: 'Residential',
            date: 'July 2024'
        },
        4: {
            title: 'Modern Kitchen',
            description: 'Complete kitchen renovation featuring a large island, custom cabinetry, and top-of-the-line appliances. The design optimizes workflow while creating a beautiful space perfect for cooking and entertaining.',
            image: '../images/portfolio/kitchen-renovation.jpg',
            category: 'Renovation',
            date: 'June 2024'
        },
        5: {
            title: 'Boutique Retail Store',
            description: 'A modern retail space with custom display units, strategic lighting, and an inviting layout. The design creates an immersive shopping experience that showcases products while maintaining brand identity.',
            image: '../images/portfolio/retail-store.jpg',
            category: 'Commercial',
            date: 'May 2024'
        },
        6: {
            title: 'Elegant Dining Area',
            description: 'A sophisticated dining space featuring statement lighting, custom furniture, and luxurious materials. Perfect for both intimate family dinners and entertaining guests, this design creates memorable dining experiences.',
            image: '../images/portfolio/dining-area.jpg',
            category: 'Residential',
            date: 'April 2024'
        }
    };
    
    const project = portfolioData[projectId];
    if (!project) return;
    
    // Update modal content
    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalTitle').textContent = project.title;
    document.getElementById('modalDescription').textContent = project.description;
    document.getElementById('modalCategory').textContent = project.category;
    document.getElementById('modalDate').textContent = project.date;
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePortfolioModal() {
    const modal = document.getElementById('portfolioModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Hero buttons functionality
function setupHeroButtons() {
    const bookConsultationBtns = document.querySelectorAll('.hero-actions .btn-primary, .hero-content .btn-primary');
    const viewPortfolioBtns = document.querySelectorAll('.hero-actions .btn-outline, .hero-content .btn-outline');
    
    bookConsultationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const bookingSection = document.querySelector('.consultation-booking');
            if (bookingSection) {
                bookingSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    viewPortfolioBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const portfolioSection = document.querySelector('.portfolio-showcase');
            if (portfolioSection) {
                portfolioSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}