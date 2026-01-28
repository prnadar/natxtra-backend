// Customer Reviews Star Rating Functionality
document.addEventListener('DOMContentLoaded', function () {
    // Star rating functionality
    const ratingButtons = document.querySelectorAll('#customer-reviews form button');

    ratingButtons.forEach((button, index) => {
        button.addEventListener('click', function (e) {
            e.preventDefault(); // Prevent form submission
            
            // Check if this is a star rating button (contains SVG)
            if (button.querySelector('svg')) {
                // Reset all stars
                ratingButtons.forEach(btn => {
                    if (btn.querySelector('svg')) {
                        btn.classList.remove('text-yellow-400');
                        btn.classList.add('text-neutral-300');
                    }
                });

                // Fill in stars up to the clicked one
                let starIndex = 0;
                ratingButtons.forEach((btn, i) => {
                    if (btn.querySelector('svg')) {
                        if (starIndex <= index) {
                            btn.classList.remove('text-neutral-300');
                            btn.classList.add('text-yellow-400');
                        }
                        starIndex++;
                    }
                });
            }
        });
    });
});
