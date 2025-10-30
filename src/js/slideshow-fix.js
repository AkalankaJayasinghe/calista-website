// DIRECT SLIDESHOW FIX - FORCE OVERRIDE
// This will definitely work

console.log('🔧 Direct slideshow fix starting...');

let slideshowFixed = false;

function forceFixSlideshow() {
    console.log('🎯 Attempting slideshow fix...');
    
    const slidesTrack = document.getElementById('slidesTrack');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('featuredPrev');
    const nextBtn = document.getElementById('featuredNext');
    
    console.log('Elements check:', {
        slidesTrack: !!slidesTrack,
        slides: slides.length,
        dots: dots.length,
        prevBtn: !!prevBtn,
        nextBtn: !!nextBtn
    });
    
    if (!slidesTrack || slides.length === 0) {
        console.log('❌ Elements not found, retrying in 500ms...');
        return false;
    }
    
    let currentIndex = 0;
    let autoInterval = null;
    
    // Force show slide function
    function forceShowSlide(index) {
        console.log(`🎯 Force showing slide ${index}`);
        
        // Remove all active classes
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.visibility = 'hidden';
            slide.style.zIndex = '1';
        });
        
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
        });
        
        // Show current slide
        if (slides[index]) {
            slides[index].classList.add('active');
            slides[index].style.opacity = '1';
            slides[index].style.visibility = 'visible';
            slides[index].style.zIndex = '2';
        }
        
        if (dots[index]) {
            dots[index].classList.add('active');
        }
        
        console.log(`✅ Slide ${index} is now visible`);
    }
    
    // Initialize first slide
    forceShowSlide(0);
    
    // Next slide
    function goNext() {
        currentIndex = (currentIndex + 1) % slides.length;
        forceShowSlide(currentIndex);
        console.log(`➡️ Next slide: ${currentIndex}`);
    }
    
    // Previous slide
    function goPrev() {
        currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
        forceShowSlide(currentIndex);
        console.log(`⬅️ Previous slide: ${currentIndex}`);
    }
    
    // Auto slideshow
    function startAuto() {
        stopAuto();
        autoInterval = setInterval(() => {
            console.log('⏰ Auto advancing...');
            goNext();
        }, 4000);
        console.log('✅ Auto slideshow started (4 second intervals)');
    }
    
    function stopAuto() {
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
            console.log('⏸️ Auto slideshow paused');
        }
    }
    
    // Event listeners
    if (nextBtn) {
        nextBtn.onclick = function(e) {
            e.preventDefault();
            console.log('👆 Next button clicked');
            stopAuto();
            goNext();
            startAuto();
        };
        console.log('✅ Next button connected');
    }
    
    if (prevBtn) {
        prevBtn.onclick = function(e) {
            e.preventDefault();
            console.log('👆 Previous button clicked');
            stopAuto();
            goPrev();
            startAuto();
        };
        console.log('✅ Previous button connected');
    }
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.onclick = function(e) {
            e.preventDefault();
            console.log(`👆 Dot ${index} clicked`);
            stopAuto();
            currentIndex = index;
            forceShowSlide(currentIndex);
            startAuto();
        };
    });
    console.log(`✅ ${dots.length} dots connected`);
    
    // Hover pause/resume
    if (slidesTrack) {
        slidesTrack.onmouseenter = stopAuto;
        slidesTrack.onmouseleave = startAuto;
        console.log('✅ Hover events connected');
    }
    
    // Start auto slideshow
    startAuto();
    
    console.log('🎉 SLIDESHOW FIX COMPLETED SUCCESSFULLY!');
    return true;
}

// Try to fix immediately
setTimeout(() => {
    if (forceFixSlideshow()) {
        slideshowFixed = true;
    }
}, 100);

// Retry until successful
let retryCount = 0;
const maxRetries = 10;

const retryInterval = setInterval(() => {
    if (slideshowFixed || retryCount >= maxRetries) {
        clearInterval(retryInterval);
        if (slideshowFixed) {
            console.log('✅ Slideshow is working!');
        } else {
            console.log('❌ Failed to fix slideshow after 10 attempts');
        }
        return;
    }
    
    retryCount++;
    console.log(`🔄 Retry attempt ${retryCount}/${maxRetries}`);
    
    if (forceFixSlideshow()) {
        slideshowFixed = true;
    }
}, 500);

// Also try when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!slideshowFixed) {
            console.log('🔄 DOM ready - final attempt...');
            forceFixSlideshow();
        }
    }, 1000);
});