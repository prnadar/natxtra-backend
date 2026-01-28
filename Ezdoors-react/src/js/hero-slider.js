// Hero Slider Functionality
document.addEventListener('DOMContentLoaded', function () {
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    let currentIndex = 0;
    let autoplayInterval;

    function goToSlide(index) {
        // Ensure index is within bounds
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        currentIndex = index;

        // Update transform to show current slide
        sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Update active dot
        dots.forEach((dot, i) => {
            if (i === currentIndex) {
                dot.classList.add('bg-white');
                dot.classList.remove('bg-white/40');
            } else {
                dot.classList.remove('bg-white');
                dot.classList.add('bg-white/40');
            }
        });
    }

    // Set up event listeners for controls
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoplay();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoplay();
        });
    }

    // Add click events to dots
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetAutoplay();
        });
    });

    // Set up autoplay
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoplayInterval);
        startAutoplay();
    }

    // Initialize slider
    if (slides.length > 0) {
        goToSlide(0);
        startAutoplay();
    }

    // Add swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    function checkSwipeDirection() {
        if (touchEndX < touchStartX - 50) {
            // Swiped left, go to next slide
            goToSlide(currentIndex + 1);
            resetAutoplay();
        }
        if (touchEndX > touchStartX + 50) {
            // Swiped right, go to previous slide
            goToSlide(currentIndex - 1);
            resetAutoplay();
        }
    }

    if (sliderWrapper) {
        sliderWrapper.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });

        sliderWrapper.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            checkSwipeDirection();
        });
    }
});
