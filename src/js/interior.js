// Interior Design Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Clean up any existing cursor elements
    cleanupCursorElements();
    
    initializeInteriorPage();
}); 

function cleanupCursorElements() {
    // Remove any existing custom cursor elements
    const existingCursors = document.querySelectorAll('.custom-cursor');
    existingCursors.forEach(cursor => cursor.remove());
    
    // Remove any floating particles that might be causing issues
    const existingParticles = document.querySelectorAll('.floating-particles');
    existingParticles.forEach(particles => particles.remove());
}

function initializeInteriorPage() {
    setupPortfolioFilters();
    setupPortfolioSearch();
    setupConsultationForm();
    setupFAQ(); 
    setupPortfolioModal();
    setupHeroButtons();
    setupDesignProcess();
    setupAnimations();
    
    // Initialize optimized footer functionality
    setupFooterOptimizations();
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

// Portfolio search functionality
function setupPortfolioSearch() {
    const searchInput = document.getElementById('portfolioSearchInput');
    const clearBtn = document.getElementById('portfolioSearchClear');
    const searchWrapper = document.querySelector('.portfolio-search-wrapper');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    let searchTimeout;

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            // Show/hide clear button
            if (query.length > 0) {
                clearBtn.classList.add('active');
                searchWrapper.classList.add('typing');
            } else {
                clearBtn.classList.remove('active');
                searchWrapper.classList.remove('typing');
            }

            // Debounced search
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                performSearch(query);
                searchWrapper.classList.remove('typing');
            }, 300);
        });

        // Clear search
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                searchInput.value = '';
                clearBtn.classList.remove('active');
                searchWrapper.classList.remove('typing', 'has-results', 'no-results');
                showAllPortfolioItems();
            });
        }
    }
}

function performSearch(query) {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const searchWrapper = document.querySelector('.portfolio-search-wrapper');
    let visibleCount = 0;

    portfolioItems.forEach(item => {
        const title = item.querySelector('.portfolio-info h3')?.textContent.toLowerCase() || '';
        const description = item.querySelector('.portfolio-info p')?.textContent.toLowerCase() || '';
        const category = item.classList.toString().toLowerCase();

        if (query === '' || title.includes(query) || description.includes(query) || category.includes(query)) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.5s ease forwards';
            visibleCount++;
        } else {
            item.style.display = 'none';
        }
    });

    // Update search state
    searchWrapper.classList.remove('has-results', 'no-results');
    if (query.length > 0) {
        if (visibleCount > 0) {
            searchWrapper.classList.add('has-results');
        } else {
            searchWrapper.classList.add('no-results');
        }
    }

    // Show results counter
    updateResultsCounter(visibleCount, query);
}

function showAllPortfolioItems() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    portfolioItems.forEach(item => {
        item.style.display = 'block';
        item.style.animation = 'fadeInUp 0.5s ease forwards';
    });
}

function updateResultsCounter(count, query) {
    let counter = document.querySelector('.search-results-counter');
    
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'search-results-counter';
        document.querySelector('.portfolio-search-container').appendChild(counter);
    }

    if (query.length > 0) {
        counter.textContent = `${count} result${count !== 1 ? 's' : ''} found`;
        counter.classList.add('show');
    } else {
        counter.classList.remove('show');
    }
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

// // Design Process Interactive Functionality
// function setupDesignProcess() {
//     const processSteps = document.querySelectorAll('.process-step');
//     const timeline = document.querySelector('.process-timeline');
    
//     if (!timeline) return;
    
//     // Create progress indicator
//     const progressBar = document.createElement('div');
//     progressBar.className = 'process-progress-bar';
//     progressBar.innerHTML = '<div class="progress-fill"></div>';
//     timeline.appendChild(progressBar);
    
//     // Make steps clickable and interactive
//     processSteps.forEach((step, index) => {
//         const stepNumber = step.querySelector('.step-number');
//         const stepContent = step.querySelector('.step-content');
        
//         // Add click functionality
//         step.addEventListener('click', function() {
//             activateStep(index);
//         });
        
//         // Add hover effects
//         step.addEventListener('mouseenter', function() {
//             step.classList.add('hovered');
//             updateProgressBar(index + 1, true);
//         });
        
//         step.addEventListener('mouseleave', function() {
//             step.classList.remove('hovered');
//             updateProgressBar(getCurrentActiveStep());
//         });
        
//         // Make step number pulse on scroll into view
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     setTimeout(() => {
//                         stepNumber.classList.add('pulse-animation');
//                     }, index * 200);
//                 }
//             });
//         }, { threshold: 0.5 });
        
//         observer.observe(step);
//     });
    
//     // Navigation buttons
//     const navContainer = document.createElement('div');
//     navContainer.className = 'process-navigation';
//     navContainer.innerHTML = `
//         <button class="process-nav-btn prev-btn" disabled>
//             <i class="fas fa-chevron-left"></i>
//             Previous
//         </button>
//         <button class="process-nav-btn next-btn">
//             Next
//             <i class="fas fa-chevron-right"></i>
//         </button>
//     `;
//     timeline.appendChild(navContainer);
    
//     const prevBtn = navContainer.querySelector('.prev-btn');
//     const nextBtn = navContainer.querySelector('.next-btn');
    
//     prevBtn.addEventListener('click', () => navigateStep(-1));
//     nextBtn.addEventListener('click', () => navigateStep(1));
    
//     // Initialize first step
//     activateStep(0);
// }

// function activateStep(stepIndex) {
//     const processSteps = document.querySelectorAll('.process-step');
//     const prevBtn = document.querySelector('.prev-btn');
//     const nextBtn = document.querySelector('.next-btn');
    
//     // Remove active class from all steps
//     processSteps.forEach(step => step.classList.remove('active'));
    
//     // Add active class to current step
//     if (processSteps[stepIndex]) {
//         processSteps[stepIndex].classList.add('active');
//         processSteps[stepIndex].scrollIntoView({ 
//             behavior: 'smooth', 
//             block: 'center' 
//         });
//     }
    
//     // Update progress bar
//     updateProgressBar(stepIndex + 1);
    
//     // Update navigation buttons
//     prevBtn.disabled = stepIndex === 0;
//     nextBtn.disabled = stepIndex === processSteps.length - 1;
    
//     // Store current step
//     window.currentProcessStep = stepIndex;
// }

// function navigateStep(direction) {
//     const currentStep = window.currentProcessStep || 0;
//     const newStep = currentStep + direction;
//     const maxSteps = document.querySelectorAll('.process-step').length;
    
//     if (newStep >= 0 && newStep < maxSteps) {
//         activateStep(newStep);
//     }
// }

// function getCurrentActiveStep() {
//     return window.currentProcessStep || 0;
// }

// function updateProgressBar(step, isHover = false) {
//     const progressFill = document.querySelector('.progress-fill');
//     if (!progressFill) return;
    
//     const maxSteps = document.querySelectorAll('.process-step').length;
//     const progressPercentage = (step / maxSteps) * 100;
    
//     progressFill.style.width = `${progressPercentage}%`;
    
//     if (isHover) {
//         progressFill.style.background = 'linear-gradient(135deg, #06b6d4, #8b5cf6)';
//     } else {
//         progressFill.style.background = 'linear-gradient(135deg, #8b4513, #3d7c47)';
//     }
// }

// Enhanced Animations and Background Effects
function setupAnimations() {
    // Initialize AOS (Animate On Scroll) with optimized settings
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 600,
            once: true,
            offset: 50,
            delay: 0,
            disable: 'mobile' // Disable on mobile for better performance
        });
    }
    
    // Use requestIdleCallback for non-critical animations
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            createFloatingParticles();
            setupParallaxEffects();
            setupAnimatedGradients();
        });
    } else {
        // Fallback with reduced animations
        setTimeout(() => {
            createFloatingParticles();
        }, 100);
    }
    
    setupOptimizedScrollAnimations();
    setupFooterOptimizations();
}

function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'floating-particles';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    
    // Create multiple particles
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: radial-gradient(circle, 
                rgba(139, 92, 246, 0.6) 0%, 
                rgba(6, 182, 212, 0.4) 50%, 
                transparent 100%);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${15 + Math.random() * 20}s infinite linear;
            animation-delay: ${Math.random() * 20}s;
        `;
        particleContainer.appendChild(particle);
    }
    
    document.body.appendChild(particleContainer);
    
    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translateY(100vh) translateX(0px) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px) rotate(360deg);
                opacity: 0;
            }
        }
        
        .pulse-animation {
            animation: pulseGlow 2s infinite;
        }
        
        @keyframes pulseGlow {
            0%, 100% {
                transform: scale(1);
                box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
            }
            50% {
                transform: scale(1.05);
                box-shadow: 0 0 30px rgba(139, 92, 246, 0.8);
            }
        }
        
        .process-progress-bar {
            position: absolute;
            top: 32px;
            left: 0;
            right: 0;
            height: 4px;
            background: rgba(139, 92, 246, 0.2);
            border-radius: 2px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, #8b4513, #3d7c47);
            transition: width 0.5s ease, background 0.3s ease;
            border-radius: 2px;
            box-shadow: 0 0 10px rgba(139, 69, 19, 0.5);
        }
        
        .process-navigation {
            display: flex;
            justify-content: center;
            gap: 16px;
            margin-top: 48px;
        }
        
        .process-nav-btn {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: linear-gradient(135deg, #8b4513, #3d7c47);
            color: white;
            border: none;
            border-radius: 25px;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .process-nav-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(139, 69, 19, 0.3);
        }
        
        .process-nav-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .process-step.active .step-number {
            background: linear-gradient(135deg, #8b5cf6, #06b6d4);
            transform: scale(1.1);
            box-shadow: 0 0 25px rgba(139, 92, 246, 0.6);
        }
        
        .process-step.hovered .step-number {
            transform: scale(1.05);
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
        }
    `;
    document.head.appendChild(style);
}

function setupParallaxEffects() {
    const heroSection = document.querySelector('.interior-hero');
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        const scrollPercent = scrolled / heroHeight;
        
        if (scrollPercent <= 1) {
            heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
            heroSection.style.filter = `brightness(${1 - scrollPercent * 0.3})`;
        }
    });
}

function setupAnimatedGradients() {
    const sections = document.querySelectorAll('.services-overview, .portfolio-showcase, .design-process');
    
    sections.forEach((section, index) => {
        const gradientOverlay = document.createElement('div');
        gradientOverlay.className = 'animated-gradient-overlay';
        gradientOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                45deg,
                rgba(139, 92, 246, 0.05) 0%,
                rgba(6, 182, 212, 0.05) 25%,
                rgba(59, 130, 246, 0.05) 50%,
                rgba(147, 51, 234, 0.05) 75%,
                rgba(139, 92, 246, 0.05) 100%
            );
            background-size: 400% 400%;
            animation: gradientShift ${20 + index * 5}s ease infinite;
            pointer-events: none;
            z-index: 0;
        `;
        
        section.style.position = 'relative';
        section.style.overflow = 'hidden';
        section.insertBefore(gradientOverlay, section.firstChild);
    });
    
    // Add gradient animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
    `;
    document.head.appendChild(style);
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animations for different elements
                if (entry.target.classList.contains('service-card')) {
                    entry.target.style.animationDelay = `${Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1}s`;
                }
                
                if (entry.target.classList.contains('portfolio-item')) {
                    entry.target.style.animationDelay = `${Array.from(entry.target.parentNode.children).indexOf(entry.target) * 0.1}s`;
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    const animatedElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .testimonial-card, .faq-item, .process-step'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    // Add animation CSS
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: slideInUp 0.8s ease forwards;
        }
        
        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

function setupBreathingAnimations() {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'breathe 4s ease-in-out infinite';
    }
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes breathe {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.02);
            }
        }
    `;
    document.head.appendChild(style);
}

function setupOptimizedScrollAnimations() {
    // Throttled scroll handler for better performance
    const scrollElements = document.querySelectorAll('.fade-in-section, .service-card, .portfolio-item');
    
    const optimizedObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Stop observing once animated to improve performance
                optimizedObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    scrollElements.forEach(element => {
        optimizedObserver.observe(element);
    });
}

function setupFooterOptimizations() {
    // Optimized footer features with reduced complexity
    const footer = document.querySelector('.footer');
    if (!footer) return;
    
    // Simple back to top functionality
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        let ticking = false;
        
        function updateBackToTop() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
            ticking = false;
        }
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateBackToTop);
                ticking = true;
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Optimized newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                const btn = this.querySelector('.subscribe-btn');
                const originalText = btn.innerHTML;
                
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
                btn.disabled = true;
                
                setTimeout(() => {
                    btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
                    this.reset();
                    
                    setTimeout(() => {
                        btn.innerHTML = originalText;
                        btn.disabled = false;
                    }, 2000);
                }, 1000);
            }
        });
    }
    
    // Simple social icon animations
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Auto-update year
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}