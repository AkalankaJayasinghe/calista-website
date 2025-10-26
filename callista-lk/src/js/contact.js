// Contact Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const faqItems = document.querySelectorAll('.faq-item');
    
    // FAQ Functionality
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
    
    // Contact Form Submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = contactForm.querySelector('.btn-full');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner"></i> Sending...';
            contactForm.classList.add('loading');
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Simulate form submission (replace with actual submission logic)
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                contactForm.classList.remove('loading');
                submitBtn.innerHTML = originalText;
                
                // Show success message
                showFormMessage('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
                
                // In a real implementation, you would send the data to your server:
                // fetch('/submit-contact-form', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(formObject)
                // })
                // .then(response => response.json())
                // .then(data => {
                //     if (data.success) {
                //         showFormMessage('Thank you! Your message has been sent successfully.', 'success');
                //         contactForm.reset();
                //     } else {
                //         showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
                //     }
                // })
                // .catch(error => {
                //     showFormMessage('Sorry, there was an error sending your message. Please try again.', 'error');
                // })
                // .finally(() => {
                //     contactForm.classList.remove('loading');
                //     submitBtn.innerHTML = originalText;
                // });
                
            }, 2000); // Simulate network delay
        });
    }
    
    // Form validation
    const formInputs = contactForm.querySelectorAll('input[required], select[required], textarea[required]');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
    
    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        // Remove existing error styling
        field.classList.remove('error');
        
        if (!value) {
            field.classList.add('error');
            return false;
        }
        
        // Email validation
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                field.classList.add('error');
                return false;
            }
        }
        
        return true;
    }
    
    function clearFieldError(e) {
        e.target.classList.remove('error');
    }
    
    function showFormMessage(message, type) {
        // Remove existing message
        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type} show`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Insert message at the top of the form
        contactForm.insertBefore(messageDiv, contactForm.firstChild);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageDiv.classList.remove('show');
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, 5000);
        
        // Scroll to top of form to show message
        contactForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 6) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            } else if (value.length >= 3) {
                value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
            }
            e.target.value = value;
        });
    }
});

// Add error styling to CSS
const style = document.createElement('style');
style.textContent = `
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
`;
document.head.appendChild(style);