// ===================================
// CONTACT PAGE JAVASCRIPT
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize AOS
    AOS.init({
        duration: 800,
        offset: 100,
        once: true,
        easing: 'ease-in-out'
    });

    // ===================================
    // PRELOADER
    // ===================================
    window.addEventListener('load', function() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 300);
            }, 500);
        }
    });

    // ===================================
    // NAVIGATION
    // ===================================
    const navbar = document.querySelector('.navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;

    // Sticky Navbar
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/Show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 500) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Mobile Menu Toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            body.classList.toggle('menu-open');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });

    // Close menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            body.classList.remove('menu-open');
        });
    });

    // ===================================
    // CONTACT FORM HANDLING
    // ===================================
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (!validateForm(data)) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            contactForm.classList.add('form-loading');
            
            try {
                // Simulate API call (replace with your actual API endpoint)
                await simulateFormSubmission(data);
                
                // Show success message
                showFormMessage('success', 'Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.');
                
                // Reset form
                contactForm.reset();
                
                // Track conversion (Google Analytics example)
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'form_submission', {
                        'event_category': 'Contact',
                        'event_label': 'Contact Form',
                        'value': data.projectType
                    });
                }
                
                // Confetti effect
                createConfetti();
                
            } catch (error) {
                // Show error message
                showFormMessage('error', 'Oops! Something went wrong. Please try again or contact us directly.');
                console.error('Form submission error:', error);
            } finally {
                // Reset button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                contactForm.classList.remove('form-loading');
            }
        });
    }

    // Form Validation
    function validateForm(data) {
        const errors = [];
        
        // Required fields
        if (!data.firstName || data.firstName.trim() === '') {
            errors.push('First name is required');
        }
        
        if (!data.lastName || data.lastName.trim() === '') {
            errors.push('Last name is required');
        }
        
        if (!data.email || !isValidEmail(data.email)) {
            errors.push('Valid email address is required');
        }
        
        if (!data.projectType) {
            errors.push('Please select a project type');
        }
        
        if (!data.projectDescription || data.projectDescription.trim().length < 20) {
            errors.push('Please provide a detailed project description (minimum 20 characters)');
        }
        
        if (errors.length > 0) {
            showFormMessage('error', errors.join('<br>'));
            return false;
        }
        
        return true;
    }

    // Email validation
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Show form message
    function showFormMessage(type, message) {
        let messageDiv = contactForm.querySelector('.form-message');
        
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.className = 'form-message';
            contactForm.appendChild(messageDiv);
        }
        
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i> ${message}`;
        
        // Scroll to message
        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    // Simulate form submission (replace with actual API call)
    function simulateFormSubmission(data) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success
                resolve({ success: true, message: 'Form submitted successfully' });
                
                // For testing error state:
                // reject(new Error('Submission failed'));
            }, 2000);
        });
    }

    // ===================================
    // FAQ ACCORDION
    // ===================================
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all items
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ===================================
    // NEWSLETTER FORM
    // ===================================
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const emailInput = document.getElementById('emailInput');
            const email = emailInput.value;
            const messageDiv = this.querySelector('.form-message');
            const submitBtn = this.querySelector('.subscribe-btn');
            const originalBtnText = submitBtn.innerHTML;
            
            if (!isValidEmail(email)) {
                showNewsletterMessage('error', 'Please enter a valid email address');
                return;
            }
            
            // Show loading
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                showNewsletterMessage('success', 'Successfully subscribed!');
                emailInput.value = '';
                
                // Track subscription
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'newsletter_signup', {
                        'event_category': 'Newsletter',
                        'event_label': 'Footer Newsletter'
                    });
                }
                
            } catch (error) {
                showNewsletterMessage('error', 'Subscription failed. Please try again.');
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    function showNewsletterMessage(type, message) {
        const messageDiv = newsletterForm.querySelector('.form-message');
        messageDiv.className = `form-message ${type}`;
        messageDiv.innerHTML = message;
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 4000);
    }

    // ===================================
    // BACK TO TOP BUTTON
    // ===================================
    const backToTop = document.getElementById('backToTop');
    
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ===================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ===================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ===================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach(section => {
        observer.observe(section);
    });

    // ===================================
    // CONFETTI EFFECT (Success Animation)
    // ===================================
    function createConfetti() {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.opacity = '1';
            confetti.style.zIndex = '10000';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            
            document.body.appendChild(confetti);
            
            const duration = Math.random() * 3 + 2;
            const xMovement = (Math.random() - 0.5) * 200;
            
            confetti.animate([
                { transform: 'translateY(0) translateX(0) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${window.innerHeight}px) translateX(${xMovement}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: duration * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => {
                confetti.remove();
            };
        }
    }

    // ===================================
    // FORM INPUT ANIMATIONS
    // ===================================
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    
    formInputs.forEach(input => {
        // Add floating label effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if input has value on load
        if (input.value !== '') {
            input.parentElement.classList.add('focused');
        }
    });

    // ===================================
    // SOCIAL MEDIA INTERACTIONS
    // ===================================
    const socialCards = document.querySelectorAll('.social-card');
    
    socialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click analytics (replace with actual tracking)
        const socialBtn = card.querySelector('.social-btn');
        if (socialBtn) {
            socialBtn.addEventListener('click', function(e) {
                e.preventDefault();
                const platform = card.getAttribute('data-platform');
                console.log(`User clicked ${platform} social link`);
                
                // Add click animation
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Simulate social media link (replace with actual URLs)
                const socialUrls = {
                    facebook: 'https://facebook.com/callistalk',
                    instagram: 'https://instagram.com/callistalk',
                    youtube: 'https://youtube.com/@callistalk',
                    linkedin: 'https://linkedin.com/company/callistalk',
                    pinterest: 'https://pinterest.com/callistalk',
                    tiktok: 'https://tiktok.com/@callistalk'
                };
                
                if (socialUrls[platform]) {
                    setTimeout(() => {
                        window.open(socialUrls[platform], '_blank');
                    }, 200);
                }
            });
        }
    });

    // Newsletter form in social section
    const socialNewsletterForm = document.querySelector('.social-media-section .newsletter-form');
    if (socialNewsletterForm) {
        const subscribeBtn = socialNewsletterForm.querySelector('.subscribe-btn');
        const emailInput = socialNewsletterForm.querySelector('input[type="email"]');
        
        socialNewsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!isValidEmail(emailInput.value)) {
                showSocialMessage('Please enter a valid email address', 'error');
                return;
            }
            
            const originalContent = subscribeBtn.innerHTML;
            subscribeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
            subscribeBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                subscribeBtn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                emailInput.value = '';
                showSocialMessage('Successfully subscribed to our newsletter!', 'success');
                
                setTimeout(() => {
                    subscribeBtn.innerHTML = originalContent;
                    subscribeBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
    
    function showSocialMessage(message, type) {
        const notification = document.createElement('div');
        notification.className = `social-notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : '#f44336'};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // ===================================
    // LOCATION CARDS INTERACTION
    // ===================================
    const locationCards = document.querySelectorAll('.location-card');
    
    locationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.querySelector('.location-image img').style.transform = 'scale(1.1) rotate(2deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.querySelector('.location-image img').style.transform = 'scale(1) rotate(0deg)';
        });
    });

    // ===================================
    // CURRENT YEAR IN FOOTER
    // ===================================
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ===================================
    // SEARCH FUNCTIONALITY
    // ===================================
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            // Implement search modal or redirect
            console.log('Search clicked');
        });
    }

    // ===================================
    // CART FUNCTIONALITY
    // ===================================
    const cartBtn = document.querySelector('.cart-btn');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', function() {
            // Implement cart modal or redirect
            console.log('Cart clicked');
        });
    }

    // ===================================
    // USER ACCOUNT
    // ===================================
    const userBtn = document.querySelector('.user-btn');
    
    if (userBtn) {
        userBtn.addEventListener('click', function() {
            // Implement user modal or redirect
            console.log('User account clicked');
        });
    }

    // ===================================
    // TYPEWRITER EFFECT (Optional Enhancement)
    // ===================================
    function typeWriter(element, text, speed = 50) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // ===================================
    // CONSOLE MESSAGE (Easter Egg)
    // ===================================
    console.log(
        '%c👋 Hello Developer! ',
        'font-size: 20px; font-weight: bold; color: #667eea;'
    );
    console.log(
        '%cInterested in how we built this? We\'re hiring! Check out our careers page.',
        'font-size: 14px; color: #764ba2;'
    );

    // ===================================
    // PERFORMANCE MONITORING
    // ===================================
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = window.performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Page Load Time: ${pageLoadTime}ms`);
            }, 0);
        });
    }
});

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Debounce function for performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

// Keyboard navigation for FAQ
document.addEventListener('keydown', function(e) {
    const faqQuestions = document.querySelectorAll('.faq-question');
    const activeElement = document.activeElement;
    
    if (activeElement.classList.contains('faq-question')) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            activeElement.click();
        }
    }
});

// Focus trap for mobile menu
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        }
    });
}