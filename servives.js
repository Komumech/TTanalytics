  const serviceItems = document.querySelectorAll('#serviceMenu li');
    const contentTextElement = document.getElementById('content-text');
    const currentImageElement = document.getElementById('current-image');
    
    // CRITICAL SAFETY CHECK: Only proceed if the main display elements are found
    if (contentTextElement && currentImageElement) {

        const initialText = contentTextElement.innerText;
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

        // Set the initial/default item as 'active' and load its content on page load
        const defaultItem = document.querySelector('.service-list li[data-target="strategy"]');
        if(defaultItem) {
            defaultItem.classList.add('active');
            
            // Manually set the content for the default item from hidden data
            const initialTargetId = defaultItem.getAttribute('data-target');
            const initialHiddenData = document.querySelector(`#hidden-data div[data-id="${initialTargetId}"]`);

            if (initialHiddenData) {
                contentTextElement.innerText = initialHiddenData.querySelector('.text').innerText;
                currentImageElement.src = initialHiddenData.querySelector('img').src;
            }
        }
    } else {
        console.error("CRITICAL ERROR: Service content display elements (#content-text or #current-image) not found.");
    }
});
