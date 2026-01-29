// Main JavaScript file for EZ-Doors website
// This file contains common functionality used across the site

// Header Scripts functionality
document.addEventListener('DOMContentLoaded', function () {
    // This script tag will be replaced with actual scripts.head content
    if (window.scripts && window.scripts.head) {
        const headerScripts = document.getElementById('header-scripts');
        if (headerScripts) {
            headerScripts.outerHTML = window.scripts.head;
        }
    }
});

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', function () {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Utility function for focus trapping in modals
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function (e) {
        if (e.key === 'Tab') {
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

// Common modal functionality
class Modal {
    constructor(modalId, openBtnId, closeBtnId, backdropId = null) {
        this.modal = document.getElementById(modalId);
        this.openBtn = document.getElementById(openBtnId);
        this.closeBtn = document.getElementById(closeBtnId);
        this.backdrop = backdropId ? document.getElementById(backdropId) : null;
        this.lastFocusedElement = null;
        
        this.init();
    }
    
    init() {
        if (!this.modal) return;
        
        // Event listeners
        if (this.openBtn) {
            this.openBtn.addEventListener('click', () => this.open());
        }
        
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        if (this.backdrop) {
            this.backdrop.addEventListener('click', () => this.close());
        }
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.close();
            }
        });
        
        // Focus trap
        trapFocus(this.modal);
    }
    
    open() {
        this.lastFocusedElement = document.activeElement;
        this.modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        this.modal.setAttribute('aria-hidden', 'false');
        
        // Focus on close button
        setTimeout(() => {
            if (this.closeBtn) this.closeBtn.focus();
        }, 100);
    }
    
    close() {
        this.modal.classList.add('hidden');
        document.body.style.overflow = '';
        this.modal.setAttribute('aria-hidden', 'true');
        
        // Return focus
        if (this.lastFocusedElement) {
            this.lastFocusedElement.focus();
        }
    }
}
