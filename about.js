// --- GSAP Plugin Registration (MUST be done once at the top) ---
// Ensure all necessary plugins are registered
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin); 

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Collapsible Accordion Toggle Functionality (Single Open) ---
    const toggleElements = document.querySelectorAll('.story-toggle');
    toggleElements.forEach(toggleElement => {
        toggleElement.addEventListener('click', function() {
            
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
            
            // FIX: Prevent scrolling if href is empty or just '#'
            if (!targetID || targetID === '#') return;

            gsap.to(window, {
                duration: 1.0, 
                scrollTo: {
                    y: targetID, 
                    offsetY: document.getElementById('navbar') ? document.getElementById('navbar').offsetHeight : 0 
                },
                ease: "power2.inOut"
            });
        });
    });

    // B. ScrollTrigger Link Highlighting (Fixes the Uncaught SyntaxError)
    allNavLinks.forEach(link => {
        const targetID = link.getAttribute('href');
        
        // FIX: Ensure targetID is a valid selector before using it
        if (!targetID || targetID === '#') return;

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


    // --- 3. Content Hover Swap Functionality (Services List) ---
    const serviceItems = document.querySelectorAll('#serviceMenu li');
    const contentTextElement = document.getElementById('content-text');
    const currentImageElement = document.getElementById('current-image');
    
    // CRITICAL SAFETY CHECK: Only proceed if the main display elements are found
    if (contentTextElement && currentImageElement) {

        const initialText = contentTextElement.innerHTML;
        const initialImageSrc = currentImageElement.src; 

        serviceItems.forEach(item => {
            const targetId = item.getAttribute('data-target');
            const hiddenDataBlock = document.querySelector(`#hidden-data div[data-id="${targetId}"]`);

            // Mouse Over (Hover) Event
            item.addEventListener('mouseover', () => {
                // List item activation
                serviceItems.forEach(li => li.classList.remove('active'));
                item.classList.add('active');

                if (hiddenDataBlock) {
                    const newText = hiddenDataBlock.querySelector('.text') ? hiddenDataBlock.querySelector('.text').innerHTML : initialText;
                    const newImageSrc = hiddenDataBlock.querySelector('img') ? hiddenDataBlock.querySelector('img').src : initialImageSrc;

                    // Swap Text with cross-fade
                    gsap.to(contentTextElement, { opacity: 0, duration: 0.15, onComplete: () => {
                        contentTextElement.innerHTML = newText;
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

        // Set the initial/default item as 'active' and load its content on page load
        const defaultItem = document.querySelector('.service-list li[data-target="strategy"]');
        if(defaultItem) {
            defaultItem.classList.add('active');
            
            // Manually set the content for the default item from hidden data
            const initialTargetId = defaultItem.getAttribute('data-target');
            const initialHiddenData = document.querySelector(`#hidden-data div[data-id="${initialTargetId}"]`);

            if (initialHiddenData) {
                contentTextElement.innerHTML = initialHiddenData.querySelector('.text').innerHTML;
                currentImageElement.src = initialHiddenData.querySelector('img').src;
            }
        }
    } else {
        console.error("CRITICAL ERROR: Service content display elements (#content-text or #current-image) not found.");
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // --- Interactive Section 2 Functionality ---
    const serviceItems2 = document.querySelectorAll('#serviceMenu2 li');
    const contentTextElement2 = document.getElementById('content-text2');
    const currentImageElement2 = document.getElementById('current-image2');

    if (contentTextElement2 && currentImageElement2) {
        const initialText2 = contentTextElement2.innerHTML;
        const initialImageSrc2 = currentImageElement2.src;

        serviceItems2.forEach(item => {
            const targetId = item.getAttribute('data-target');
            const hiddenDataBlock = document.querySelector(`#hidden-data2 div[data-id="${targetId}"]`);

            item.addEventListener('mouseover', () => {
                serviceItems2.forEach(li => li.classList.remove('active'));
                item.classList.add('active');

                if (hiddenDataBlock) {
                    const newText = hiddenDataBlock.querySelector('.text') ? hiddenDataBlock.querySelector('.text').innerHTML : initialText2;
                    const newImageSrc = hiddenDataBlock.querySelector('img') ? hiddenDataBlock.querySelector('img').src : initialImageSrc2;

                    contentTextElement2.innerHTML = newText;
                    currentImageElement2.src = newImageSrc;
                }
            });
        });

        // Set the initial/default item as 'active' and load its content on page load
        const defaultItem2 = document.querySelector('#serviceMenu2 li[data-target="consulting2"]');
        if (defaultItem2) {
            defaultItem2.classList.add('active');
            const initialTargetId2 = defaultItem2.getAttribute('data-target');
            const initialHiddenData2 = document.querySelector(`#hidden-data2 div[data-id="${initialTargetId2}"]`);
            if (initialHiddenData2) {
                contentTextElement2.innerHTML = initialHiddenData2.querySelector('.text').innerHTML;
                currentImageElement2.src = initialHiddenData2.querySelector('img').src;
            }
        }
    }
});