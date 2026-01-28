// Contact Page Functionality
document.addEventListener('DOMContentLoaded', function () {
    const faqModal = document.getElementById('faq-modal');
    const faqModalContent = faqModal ? faqModal.querySelector('.bg-white') : null;
    const openFaqModalBtn = document.getElementById('open-faq-modal');
    const closeFaqModalBtn = document.getElementById('close-faq-modal');
    const faqModalBackdrop = document.getElementById('faq-modal-backdrop');

    // Function to open FAQ modal
    function openFaqModal() {
        if (!faqModal) return;
        
        // Show modal
        faqModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Animation
        setTimeout(() => {
            if (faqModalContent) {
                faqModalContent.classList.remove('scale-95', 'opacity-0');
                faqModalContent.classList.add('scale-100', 'opacity-100');
            }
        }, 10);

        // Set aria attributes
        faqModal.setAttribute('aria-hidden', 'false');

        // Set focus to the modal
        if (closeFaqModalBtn) {
            closeFaqModalBtn.focus();
        }
    }

    // Function to close FAQ modal
    function closeFaqModal() {
        if (!faqModal) return;
        
        // Animation
        if (faqModalContent) {
            faqModalContent.classList.remove('scale-100', 'opacity-100');
            faqModalContent.classList.add('scale-95', 'opacity-0');
        }

        setTimeout(() => {
            faqModal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);

        // Set aria attributes
        faqModal.setAttribute('aria-hidden', 'true');

        // Return focus to the button that opened the modal
        if (openFaqModalBtn) {
            openFaqModalBtn.focus();
        }
    }

    // Event listeners for FAQ modal
    if (openFaqModalBtn) {
        openFaqModalBtn.addEventListener('click', openFaqModal);
    }
    
    if (closeFaqModalBtn) {
        closeFaqModalBtn.addEventListener('click', closeFaqModal);
    }
    
    if (faqModalBackdrop) {
        faqModalBackdrop.addEventListener('click', closeFaqModal);
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && faqModal && !faqModal.classList.contains('hidden')) {
            closeFaqModal();
        }
    });

    // Trap focus inside modal
    if (faqModal) {
        faqModal.addEventListener('keydown', function (event) {
            if (event.key === 'Tab') {
                const focusableElements = faqModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                // If shift+tab and focus is on first element, move to last element
                if (event.shiftKey && document.activeElement === firstElement) {
                    event.preventDefault();
                    lastElement.focus();
                }
                // If tab and focus is on last element, move to first element
                else if (!event.shiftKey && document.activeElement === lastElement) {
                    event.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }

    // Map loading functionality
    const loadMapBtn = document.getElementById('load-map-btn');
    if (loadMapBtn) {
        loadMapBtn.addEventListener('click', function () {
            const mapContainer = this.closest('.relative');
            mapContainer.innerHTML = `
                <div class="absolute inset-0 bg-neutral-200 flex items-center justify-center">
                    <p class="text-neutral-600">Map loaded! (In a real implementation, this would be a Google Maps embed)</p>
                </div>
            `;
        });
    }
});
