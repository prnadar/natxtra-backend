// Design Gallery Filter Functionality
document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('#design-gallery button');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('bg-red-600', 'text-white');
                btn.classList.add('bg-white', 'text-neutral-700');
            });

            // Add active class to clicked button
            this.classList.remove('bg-white', 'text-neutral-700');
            this.classList.add('bg-red-600', 'text-white');

            // Filter logic would go here in a real implementation
            // For now, just console log the selected filter
            console.log('Selected filter:', this.textContent.trim());
            
            // You can add filtering logic here to show/hide gallery items
            // based on the selected filter category
        });
    });
});
