// Material Guide Modal Functionality
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('material-guide-modal');
    const modalContent = modal ? modal.querySelector('.bg-white') : null;
    const openModalBtn = document.getElementById('open-material-guide-modal');
    const closeModalBtn = document.getElementById('close-material-guide-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');

    // Function to open modal
    function openModal() {
        if (!modal) return;
        
        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Animation
        setTimeout(() => {
            if (modalContent) {
                modalContent.classList.remove('scale-95', 'opacity-0');
                modalContent.classList.add('scale-100', 'opacity-100');
            }
        }, 10);

        // Set aria attributes
        modal.setAttribute('aria-hidden', 'false');

        // Set focus to the modal
        if (closeModalBtn) {
            closeModalBtn.focus();
        }
    }

    // Function to close modal
    function closeModal() {
        if (!modal) return;
        
        // Animation
        if (modalContent) {
            modalContent.classList.remove('scale-100', 'opacity-100');
            modalContent.classList.add('scale-95', 'opacity-0');
        }

        setTimeout(() => {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }, 300);

        // Set aria attributes
        modal.setAttribute('aria-hidden', 'true');

        // Return focus to the button that opened the modal
        if (openModalBtn) {
            openModalBtn.focus();
        }
    }

    // Event listeners
    if (openModalBtn) {
        openModalBtn.addEventListener('click', openModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', closeModal);
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // Trap focus inside modal
    if (modal) {
        modal.addEventListener('keydown', function (event) {
            if (event.key === 'Tab') {
                const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
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
});
