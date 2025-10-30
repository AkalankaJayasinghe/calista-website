// Custom Furniture Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeCustomPage();
});

function initializeCustomPage() {
    setupFileUpload();
    setupFormValidation();
    setupFormSubmission();
}

// File Upload Functionality
function setupFileUpload() {
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('referenceImages');
    const uploadedFilesContainer = document.getElementById('uploadedFiles');
    
    if (!fileUploadArea || !fileInput) return;
    
    // Click to upload
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#3d7c47';
        fileUploadArea.style.background = '#f0fdf4';
    });
    
    fileUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#d1d5db';
        fileUploadArea.style.background = '#fafafa';
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#d1d5db';
        fileUploadArea.style.background = '#fafafa';
        
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFiles(files);
    });
    
    function handleFiles(files) {
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/');
            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
            
            if (!isValidType) {
                showNotification('Please upload only image files', 'error');
                return false;
            }
            
            if (!isValidSize) {
                showNotification('File size should be less than 10MB', 'error');
                return false;
            }
            
            return true;
        });
        
        validFiles.forEach(file => {
            addFileToList(file);
        });
    }
    
    function addFileToList(file) {
        const fileElement = document.createElement('div');
        fileElement.className = 'uploaded-file';
        fileElement.innerHTML = `
            <span><i class="fas fa-image"></i> ${file.name} (${formatFileSize(file.size)})</span>
            <button type="button" class="remove-file" onclick="removeFile(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        uploadedFilesContainer.appendChild(fileElement);
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Remove uploaded file
function removeFile(button) {
    button.closest('.uploaded-file').remove();
}

// Form Validation
function setupFormValidation() {
    const form = document.getElementById('customForm');
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', validateField);
        input.addEventListener('input', clearFieldError);
    });
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error
    clearFieldError(e);
    
    if (!value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (field.type === 'tel') {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.style.borderColor = '#ef4444';
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 14px;
            margin-top: 4px;
        `;
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(e) {
    const field = e.target;
    field.style.borderColor = '#d1d5db';
    
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

// Form Submission
function setupFormSubmission() {
    const form = document.getElementById('customForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
}

function validateForm() {
    const form = document.getElementById('customForm');
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function submitForm() {
    const form = document.getElementById('customForm');
    const submitBtn = document.querySelector('.submit-btn');
    const formData = new FormData(form);
    
    // Show loading state
    form.classList.add('loading');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Hide loading state
        form.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Request';
        
        // Show success message
        showSuccessMessage();
        
        // Reset form
        form.reset();
        document.getElementById('uploadedFiles').innerHTML = '';
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    }, 2000);
}

function showSuccessMessage() {
    // Remove existing success message
    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create success message
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message show';
    successMessage.innerHTML = `
        <div style="display: flex; align-items: center; gap: 12px;">
            <i class="fas fa-check-circle" style="color: #059669; font-size: 20px;"></i>
            <div>
                <strong>Request Submitted Successfully!</strong>
                <p style="margin: 4px 0 0;">Thank you for your custom furniture request. Our team will contact you within 24 hours to discuss your project details and provide a detailed quotation.</p>
            </div>
        </div>
    `;
    
    // Insert before form
    const formContainer = document.querySelector('.form-container');
    formContainer.parentNode.insertBefore(successMessage, formContainer);
    
    // Auto hide after 10 seconds
    setTimeout(() => {
        successMessage.style.opacity = '0';
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.parentNode.removeChild(successMessage);
            }
        }, 300);
    }, 10000);
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const colors = {
        info: '#3d7c47',
        error: '#ef4444',
        warning: '#f59e0b',
        success: '#10b981'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 24px;
        background: ${colors[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        max-width: 400px;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Smooth scrolling for internal links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Update cart count from localStorage
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('callista-cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Initialize cart count
updateCartCount();