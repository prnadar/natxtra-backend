// Consultation Modal Functionality
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('consultationModal');
    const modalOverlay = modal ? modal.querySelector('#modalOverlay') : null;
    const closeModalBtn = modal ? modal.querySelector('#closeModal') : null;
    let lastFocusedElement = null;

    // Function to open modal
    function openModal() {
        if (!modal) return;
        
        lastFocusedElement = document.activeElement;
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        // Focus trap
        setTimeout(() => {
            if (closeModalBtn) closeModalBtn.focus();
        }, 100);
    }

    // Function to close modal
    function closeModal() {
        if (!modal) return;
        
        modal.classList.add('hidden');
        document.body.style.overflow = '';

        // Return focus to element that opened the modal
        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    // Add click event to consultation buttons
    document.querySelectorAll('.bg-red-600').forEach(button => {
        if (button.textContent.includes('Consultation')) {
            button.addEventListener('click', openModal);
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
