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
