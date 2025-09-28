// --- GSAP Plugin Registration (MUST be done once at the top) ---
// Ensure ScrollToPlugin and ScrollTrigger are registered
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin); 

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Collapsible Accordion Toggle Functionality ---
    const toggleElements = document.querySelectorAll('.story-toggle');
    toggleElements.forEach(toggleElement => {
        toggleElement.addEventListener('click', function() {
            
            // Find all currently active/open toggles
            const currentlyActiveToggles = document.querySelectorAll('.story-toggle.active');
            
            // Close other open toggles (for single-open accordion)
            currentlyActiveToggles.forEach(activeToggle => {
                if (activeToggle !== this) {
                    activeToggle.classList.remove('active');
                }
            });

            // Toggle the 'active' class on the clicked element
            this.classList.toggle('active');
        });
    });
    
    // --- 2. Scroll Highlight and Smooth Scroll Animation ---
    const allScrollLinks = document.querySelectorAll('.scroll-link');
    const allNavLinks = document.querySelectorAll('.purple-sub-links a'); 
    
    // A. Smooth Scroll Click Animation
    allScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); 
            const targetID = this.getAttribute('href'); 
            
            gsap.to(window, {
                duration: 1.0, 
                scrollTo: {
                    y: targetID, 
                    // Adjust offset for sticky navbar if present
                    offsetY: document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 0 
                },
                ease: "power2.inOut"
            });
        });
    });

    // B. ScrollTrigger Link Highlighting (REPLACES REDUNDANT BLOCK)
    allNavLinks.forEach(link => {
        const targetID = link.getAttribute('href');
        const targetSection = document.querySelector(targetID);

        if (targetSection) {
            ScrollTrigger.create({
                trigger: targetSection,
                start: "top center", 
                end: "bottom center", 
                toggleClass: {
                    targets: link,
                    className: "is-active"
                },
                scrub: false, 
            });
        }
    });


    // --- 3. Content Hover Swap Functionality ---
    const serviceItems = document.querySelectorAll('#serviceMenu li');
    // NOTE: Added checks for element existence in case they are null
    const contentTextElement = document.getElementById('content-text');
    const currentImageElement = document.getElementById('current-image');
    
    const initialText = contentTextElement ? contentTextElement.innerText : '';
    const initialImageSrc = currentImageElement ? currentImageElement.src : ''; 

    serviceItems.forEach(item => {
        const targetId = item.getAttribute('data-target');
        const hiddenDataBlock = document.querySelector(`#hidden-data div[data-id="${targetId}"]`);

        // Mouse Over (Hover) Event
        item.addEventListener('mouseover', () => {
            serviceItems.forEach(li => li.classList.remove('active'));
            item.classList.add('active');

            if (hiddenDataBlock && contentTextElement && currentImageElement) {
                const newText = hiddenDataBlock.querySelector('.text') ? hiddenDataBlock.querySelector('.text').innerText : initialText;
                const newImageSrc = hiddenDataBlock.querySelector('img') ? hiddenDataBlock.querySelector('img').src : initialImageSrc;

                // Swap Text with cross-fade
                gsap.to(contentTextElement, { opacity: 0, duration: 0.15, onComplete: () => {
                    contentTextElement.innerText = newText;
                    gsap.to(contentTextElement, { opacity: 1, duration: 0.15 });
                }});

                // Swap Image with cross-fade
                gsap.to(currentImageElement, { opacity: 0, duration: 0.15, onComplete: () => {
                    currentImageElement.src = newImageSrc;
                    gsap.to(currentImageElement, { opacity: 1, duration: 0.15 });
                }});
            }
        });
    });

    // Set the initial/default item as 'active' on page load
    const defaultItem = document.querySelector('.service-list li[data-target="strategy"]');
    if(defaultItem) {
        defaultItem.classList.add('active');
    }
});