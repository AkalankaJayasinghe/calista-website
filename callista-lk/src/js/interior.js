// Interior Design Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeInteriorPage();
});

function initializeInteriorPage() {
    setupPortfolioFilters();
    setupConsultationForm();
    setupFAQ();
    setupPortfolioModal();
    updateCartCount();
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
    field.style.borderColor = var(--border-color);
    
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
        setTimeout(() => {
            if (message.parentNode) {
                message.parentNode.removeChild(message);
            }
        }, 300