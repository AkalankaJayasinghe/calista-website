// Authentication Pages JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
});

function initializeAuth() {
    setupPasswordToggle();
    setupLoginForm();
    setupRegisterForm();
    setupPasswordStrength();
}

// Password Toggle
function setupPasswordToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-password');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

// Login Form
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const remember = document.getElementById('remember').checked;
            
            // Validate
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            if (password.length < 6) {
                showNotification('Password must be at least 6 characters', 'error');
                return;
            }
            
            // Show loading
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
            
            // Simulate API call
            setTimeout(() => {
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Success
                showNotification('Login successful! Redirecting...', 'success');
                
                // Store user data (demo)
                localStorage.setItem('userEmail', email);
                if (remember) {
                    localStorage.setItem('rememberMe', 'true');
                }
                
                // Redirect
                setTimeout(() => {
                    const urlParams = new URLSearchParams(window.location.search);
                    const redirect = urlParams.get('redirect');
                    window.location.href = redirect ? `${redirect}.html` : 'dashboard.html';
                }, 1500);
            }, 2000);
        });
    }
}

// Register Form
function setupRegisterForm() {
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstName = document.getElementById('firstName').value;
            const lastName = document.getElementById('lastName').value;
            const email = document.getElementById('registerEmail').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const terms = document.getElementById('terms').checked;
            
            // Validation
            if (!firstName || !lastName) {
                showNotification('Please enter your full name', 'error');
                return;
            }
            
            if (!validateEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            if (!validatePhone(phone)) {
                showNotification('Please enter a valid phone number', 'error');
                return;
            }
            
            if (password.length < 8) {
                showNotification('Password must be at least 8 characters', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            if (!terms) {
                showNotification('Please agree to the Terms of Service', 'error');
                return;
            }
            
            // Show loading
            const submitBtn = registerForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            
            // Simulate API call
            setTimeout(() => {
                // Reset button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                
                // Success
                showNotification('Account created successfully! Redirecting...', 'success');
                
                // Store user data (demo)
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', `${firstName} ${lastName}`);
                
                // Redirect
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
            }, 2000);
        });
    }
}

// Password Strength Indicator
function setupPasswordStrength() {
    const passwordInput = document.getElementById('registerPassword');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strengthContainer = this.closest('.form-group').querySelector('.password-strength');
            
            if (!strengthContainer) return;
            
            const strength = calculatePasswordStrength(password);
            
            strengthContainer.className = 'password-strength';
            if (strength > 0) {
                if (strength <= 2) {
                    strengthContainer.classList.add('weak');
                } else if (strength <= 4) {
                    strengthContainer.classList.add('medium');
                } else {
                    strengthContainer.classList.add('strong');
                }
            }
        });
    }
}

function calculatePasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    
    return strength;
}

// Email Validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone Validation
function validatePhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Show Notification
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 24px;
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
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Social Login (Demo)
document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const provider = this.classList.contains('google') ? 'Google' : 'Facebook';
        showNotification(`${provider} login will be implemented soon`, 'success');
    });
});

// Animation styles
const style = document.createElement('style');
style.textContent = `
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
`;
document.head.appendChild(style);
