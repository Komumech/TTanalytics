 // Wait for the DOM to be fully loaded before running the script
      document.addEventListener('DOMContentLoaded', () => {
        const animatedElement = document.querySelector('.circle');

        // Create a new IntersectionObserver
        const observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach(entry => {
              // Check if the element is visible on the screen
              if (entry.isIntersecting) {
                // Add the 'show' class to trigger the animation
                entry.target.classList.add('show');
                // Optional: Stop observing the element after it has animated once
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.2 } // Triggers when 20% of the element is visible
        );

        // Tell the observer to watch your element
        if (animatedElement) {
          observer.observe(animatedElement);
        }
      });