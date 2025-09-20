 let prevScrollPos = window.pageYOffset;

    window.onscroll = function() {
        let currentScrollPos = window.pageYOffset;

        if (prevScrollPos > currentScrollPos) {
            // User is scrolling up, show the navbar
            document.getElementById("navbar").style.top = "0";
        } else {
            // User is scrolling down, hide the navbar by moving it up
            document.getElementById("navbar").style.top = "-80px"; // Adjust this value to the navbar's height
        }
        prevScrollPos = currentScrollPos;
    }

    // Store all sections in an ordered array for easy lookup
    // The querySelectorAll will automatically grab both `.sect4` elements in the correct order.
    const sections = document.querySelectorAll('.sect4, .main-container, .sect2, .sect3, .sect5');

    function scrollToNextSection() {
        // Find the current scroll position
        const currentScrollPos = window.scrollY;

        // Find the index of the first section that is below the current viewport
        let nextSectionIndex = -1;
        for (let i = 0; i < sections.length; i++) {
            // Check if the section's top is below or near the current scroll position
            // Adding a small buffer (e.g., 50) to account for slight scrolling variations
            if (sections[i].offsetTop > currentScrollPos + 50) {
                nextSectionIndex = i;
                break;
            }
        }

        // If a next section is found, scroll to it
        if (nextSectionIndex !== -1) {
            sections[nextSectionIndex].scrollIntoView({ behavior: 'smooth' });
        } else {
            // If we are at the last section, scroll back to the top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    gsap.registerPlugin(ScrollTrigger);
    
    // --- Three.js Starfield Background ---
    let starScene, starCamera, starRenderer, stars;
    const numStars = 50000;
    const starDistance = 2000;
    const scrollFactor = 2; // How fast the stars move on scroll

    function initStarfield() {
        const container = document.getElementById('starfield-container');
        starScene = new THREE.Scene();
        starCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
        starCamera.position.z = starDistance;

        starRenderer = new THREE.WebGLRenderer({ alpha: true });
        starRenderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(starRenderer.domElement);

        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        const starColors = [];
        const starSizes = [];
        
        for (let i = 0; i < numStars; i++) {
            // Increased the range for x and y to make the stars appear more widespread
            const x = THREE.MathUtils.randFloatSpread(starDistance * 4);
            const y = THREE.MathUtils.randFloatSpread(starDistance * 4);
            const z = THREE.MathUtils.randFloatSpread(starDistance * 2);

            starVertices.push(x, y, z);
            starSizes.push(Math.random() * 2 + 1); // Random size between 1 and 3

            // Set all stars to white by pushing R, G, B values of 1.0, 1.0, 1.0
            starColors.push(1.0, 1.0, 1.0);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
        starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
        
        // --- Create a custom texture for the stars to make them "shapeless" ---
        const starTextureCanvas = document.createElement('canvas');
        starTextureCanvas.width = 64;
        starTextureCanvas.height = 64;
        const starContext = starTextureCanvas.getContext('2d');
        
        const gradient = starContext.createRadialGradient(
            starTextureCanvas.width / 2,
            starTextureCanvas.height / 2,
            0,
            starTextureCanvas.width / 2,
            starTextureCanvas.height / 2,
            starTextureCanvas.width / 2
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        starContext.fillStyle = gradient;
        starContext.fillRect(0, 0, starTextureCanvas.width, starTextureCanvas.height);

        const starTexture = new THREE.CanvasTexture(starTextureCanvas);

        const starMaterial = new THREE.PointsMaterial({
            size: 7, // Increased size to make the fuzzy texture more visible
            map: starTexture, // Apply the custom texture
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });
        stars = new THREE.Points(starGeometry, starMaterial);
        starScene.add(stars);

        window.addEventListener('resize', onStarfieldResize, false);
        animateStarfield();

        // GSAP and ScrollTrigger for the starfield zoom effect
        gsap.to(starCamera.position, {
            z: -starDistance, // Move camera to create zoom effect
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom bottom",
                scrub: true,
                onUpdate: self => {
                    // Loop the zoom effect
                    const progress = self.progress;
                    const z = starDistance - (progress * starDistance * 2);
                    starCamera.position.z = z;
                    
                    // Check if stars have passed the camera and reposition them
                    const positions = stars.geometry.attributes.position.array;
                    for (let i = 0; i < positions.length; i += 3) {
                        // If the star moves past the camera's far-z plane (when scrolling down), move it back
                        if (positions[i + 2] < starCamera.position.z - starDistance) {
                            positions[i + 2] += starDistance * 2;
                        }
                        // If the star moves past the camera's near-z plane (when scrolling up), move it forward
                        else if (positions[i + 2] > starCamera.position.z + starDistance) {
                            positions[i + 2] -= starDistance * 2;
                        }
                    }
                    stars.geometry.attributes.position.needsUpdate = true;
                }
            }
        });
    }

    function onStarfieldResize() {
        starCamera.aspect = window.innerWidth / window.innerHeight;
        starCamera.updateProjectionMatrix();
        starRenderer.setSize(window.innerWidth, window.innerHeight);
    }

    function animateStarfield() {
        requestAnimationFrame(animateStarfield);
        
        // Adjust starfield rotation based on mouse position
        const rotationFactor = 0.0005; 
        stars.rotation.y += (mouseX * rotationFactor - stars.rotation.y) * 0.02;
        stars.rotation.x += (mouseY * rotationFactor - stars.rotation.x) * 0.02;

        starRenderer.render(starScene, starCamera);
    }

    ScrollTrigger.matchMedia({

        // Desktop animation (for screens wider than 768px)
        "(min-width: 769px)": function() {
            console.log("Desktop Animation Active"); // For debugging
            gsap.utils.toArray(".sect3-img").forEach(img => {
                gsap.to(img, {
                    scale: 0.5, // Shrink to 50% of original size
                    x: -300, // Move the image 250 pixels to the left
                    transformOrigin: "center center",
                    ease: "none",
                    scrollTrigger: {
                        trigger: img,
                        start: "top top",
                        scrub: 1,
                        end: "+=100", // Animation lasts for 900px of scrolling after the start point. (Note: changed from -=900 which is invalid in most cases for 'end')
                        pin: true,
                        //markers: true, // Keep markers for debugging desktop
                    }
                });
            });
        },

        // Mobile animation (for screens up to 768px)
        "(max-width: 768px)": function() {
            console.log("Mobile Animation Active"); // For debugging
            gsap.utils.toArray(".sect3-img").forEach(img => {
                gsap.fromTo(
                    img,
                    { scale: 3 },
                    {
                        scale: 1,
                        x: 20, // Optional: keep slight horizontal movement
                        transformOrigin: "center center",
                        ease: "none",
                        scrollTrigger: {
                            trigger: img.parentElement, // Trigger on the parent section for better control
                            start: "+=20%", // Start the animation when the section enters the bottom 20% of the viewport
                            end: "center top", // End the animation when the section leaves the top of the viewport
                            scrub: 0.01,
                            pin: true,
                            //markers: true, // Uncomment for debugging
                        }
                    }
                );
            });
        },

        // "all" breakpoint for anything that should run regardless of screen size
        "all": function() {
            // You could put common setup here if needed
            // For example, if you wanted transformOrigin to always be center center for all breakpoints,
            // you could set it with gsap.set(".sect3-img", { transformOrigin: "center center" });
        }

    }); // <-- This is the crucial closing brace and parenthesis for ScrollTrigger.matchMedia()



    // Global variables for scene, camera, and renderer
    let scene, camera, renderer;
    let textMesh;
    let mouseX = 0, mouseY = 0;

    // The text content for the 3D model
    const textContent = "";

    // Define the colors from the provided theme for interpolation
    const lightBlue = new THREE.Color(0x0055ff); 
    const darkBlue = new THREE.Color(0x2552ac); 
    const accentColor = new THREE.Color(0x003cff); 

    // --- Initialization function ---
    function init() {
        const container = document.getElementById('canvas-container');

        // 1. Create the scene
        scene = new THREE.Scene();
        
        // 2. Create the camera
        camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.z = 6;

        // 3. Create the renderer
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        // Set a transparent background for the renderer
        renderer.setClearColor(0x000000, 0); 
        container.appendChild(renderer.domElement);

        // 4. Add multiple lights for a more beautiful effect
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0xff00ff, 1.5);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x00ffff, 1.5);
        pointLight2.position.set(-5, -5, -5);
        scene.add(pointLight2);

        // 5. Load the font and create the 3D text
        const fontLoader = new THREE.FontLoader();
        fontLoader.load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/gentilis_regular.typeface.json', function (font) {
            const textGeometry = new THREE.TextGeometry(textContent, {
                font: font,
                size: 2,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.1,
                bevelSize: 0.08,
                bevelOffset: 0,
                bevelSegments: 10 // Increased segments for smoother edges
            });

            textGeometry.center();

            const textMaterial = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.4,
                metalness: 0.2
            });
            textMesh = new THREE.Mesh(textGeometry, textMaterial);
            scene.add(textMesh);
        });

        // 6. Handle window resizing
        window.addEventListener('resize', onWindowResize, false);

        // 7. Handle mouse movement for interaction
        document.addEventListener('mousemove', onDocumentMouseMove, false);

        // Start the animation loop
        animate();
    }

    // --- Resizing handler ---
    function onWindowResize() {
        const container = document.getElementById('canvas-container');
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    // --- Mouse movement handler ---
    function onDocumentMouseMove(event) {
        const container = document.getElementById('canvas-container');
        const rect = container.getBoundingClientRect();

        // Normalize mouse position relative to the container div
        mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    // --- Animation loop ---
    function animate() {
        requestAnimationFrame(animate);

        if (textMesh) {
            // Adjust text rotation based on mouse position for a slight tilt effect
            const tiltFactor = 0.05; // Reduced tilt factor for a smoother transition
            textMesh.rotation.y += (mouseX * tiltFactor - textMesh.rotation.y) * 0.02;
            textMesh.rotation.x += (mouseY * tiltFactor - textMesh.rotation.x) * 0.02;

            // Create a temporary color object for interpolation
            const tempColor = new THREE.Color();

            // Interpolate between the two blue colors based on mouseX
            tempColor.lerpColors(lightBlue, darkBlue, (mouseX + 1) / 2);

            // Interpolate this result with the accent color based on mouseY
            textMesh.material.color.lerpColors(tempColor, accentColor, (mouseY + 1) / 2);
        }

        renderer.render(scene, camera);
    }

    // Start the application when the window loads
    window.onload = function() {
        init();
        initStarfield();
        startAutoScroll();
    };

    const scrollContainer = document.querySelector('.sect2b');
    const scrollAmount = 18 * 18; // 16rem to pixels (assuming 1rem = 16px)
    let scrollTarget = 0;
    let currentScroll = 0;
    let isScrolling = false;
    let scrollInterval;

    function autoScroll() {
        isScrolling = true;
        const targetScrollLeft = scrollTarget;
        const animationDuration = 1000; // 1 second for the animation
        let startTime = null;

        function animateScroll(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsedTime = timestamp - startTime;
            const progress = Math.min(elapsedTime / animationDuration, 1);

            // Linear interpolation for smooth movement
            const newScrollLeft = currentScroll + (targetScrollLeft - currentScroll) * progress;
            scrollContainer.scrollLeft = newScrollLeft;

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                currentScroll = scrollContainer.scrollLeft;
                isScrolling = false;
            }
        }
        requestAnimationFrame(animateScroll);
    }

    function startAutoScroll() {
        scrollInterval = setInterval(() => {
            if (isScrolling) return; // Prevent new scroll if already animating

            const atEnd = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1; // Subtract 1 for minor floating point issues

            if (atEnd) {
                // If at the end, set the target back to the start
                scrollTarget = 0;
            } else {
                // Otherwise, increment the target
                scrollTarget += scrollAmount;
            }

            autoScroll(); // Start the new animation
        }, 5000); // 5000 milliseconds = 5 seconds
    }

    function stopAutoScroll() {
        clearInterval(scrollInterval);
    }
    
    // Optional: Stop scrolling on user interaction
    scrollContainer.addEventListener('mouseenter', stopAutoScroll);
    scrollContainer.addEventListener('mouseleave', startAutoScroll);
