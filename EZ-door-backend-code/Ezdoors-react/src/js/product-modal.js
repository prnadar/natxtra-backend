// Product Quick View Modal Functionality
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('quickViewModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModal');
    const productCards = document.querySelectorAll('#bestsellers .bg-white');
    let lastFocusedElement = null;

    // Function to open modal
    function openModal() {
        lastFocusedElement = document.activeElement;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Focus trap
        setTimeout(() => {
            closeModalBtn.focus();
        }, 100);
    }

    // Function to close modal
    function closeModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = '';

        // Return focus to element that opened the modal
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    // Add click event to product cards
    productCards.forEach(card => {
        const addToCartBtn = card.querySelector('button');

        // Quick view on image click
        const imageContainer = card.querySelector('.relative');
        if (imageContainer) {
            imageContainer.addEventListener('click', function (e) {
                e.preventDefault();
                openModal();
            });
        }

        // Prevent modal opening when clicking add to cart
        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                // Add to cart logic would go here
            });
        }
    });

    // Close modal events
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Close modal on ESC key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Focus trap within modal
    if (modal) {
        modal.addEventListener('keydown', function (e) {
            if (e.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }
});
