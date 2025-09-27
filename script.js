let prevScrollPos = window.pageYOffset;
let mouseX = 0, mouseY = 0; // Global variables for mouse position

window.onscroll = function() {
    let currentScrollPos = window.pageYOffset;
    const navbar = document.getElementById("navbar");
    if (navbar) {
        if (prevScrollPos > currentScrollPos) {
            navbar.style.top = "0";
        } else {
            navbar.style.top = "-80px";
        }
    }
    prevScrollPos = currentScrollPos;
};

// Store all sections in an ordered array for easy lookup
const sections = document.querySelectorAll('.sect4, .main-container, .sect2, .sect3, .sect5');

function scrollToNextSection() {
    const currentScrollPos = window.scrollY;
    let nextSectionIndex = -1;

    for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop > currentScrollPos + 50) {
            nextSectionIndex = i;
            break;
        }
    }

    if (nextSectionIndex !== -1) {
        sections[nextSectionIndex].scrollIntoView({ behavior: 'smooth' });
    } else {
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

function initStarfield() {
    const container = document.getElementById('starfield-container');
    if (!container) return;

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
        const x = THREE.MathUtils.randFloatSpread(starDistance * 4);
        const y = THREE.MathUtils.randFloatSpread(starDistance * 4);
        const z = THREE.MathUtils.randFloatSpread(starDistance * 2);
        starVertices.push(x, y, z);
        starSizes.push(Math.random() * 2 + 1);
        starColors.push(1.0, 1.0, 1.0);
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
    
    const starTextureCanvas = document.createElement('canvas');
    starTextureCanvas.width = 64;
    starTextureCanvas.height = 64;
    const starContext = starTextureCanvas.getContext('2d');
    
    const gradient = starContext.createRadialGradient(
        starTextureCanvas.width / 2, starTextureCanvas.height / 2, 0, 
        starTextureCanvas.width / 2, starTextureCanvas.height / 2, starTextureCanvas.width / 2
    );
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    starContext.fillStyle = gradient;
    starContext.fillRect(0, 0, starTextureCanvas.width, starTextureCanvas.height);

    const starTexture = new THREE.CanvasTexture(starTextureCanvas);

    const starMaterial = new THREE.PointsMaterial({
        size: 7, 
        map: starTexture, 
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });
    stars = new THREE.Points(starGeometry, starMaterial);
    starScene.add(stars);

    window.addEventListener('resize', onStarfieldResize, false);
    animateStarfield();

    gsap.to(starCamera.position, {
        z: -starDistance,
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: self => {
                const progress = self.progress;
                const z = starDistance - (progress * starDistance * 2);
                starCamera.position.z = z;
                
                const positions = stars.geometry.attributes.position.array;
                for (let i = 0; i < positions.length; i += 3) {
                    if (positions[i + 2] < starCamera.position.z - starDistance) {
                        positions[i + 2] += starDistance * 2;
                    } else if (positions[i + 2] > starCamera.position.z + starDistance) {
                        positions[i + 2] -= starDistance * 2;
                    }
                }
                stars.geometry.attributes.position.needsUpdate = true;
            }
        }
    });
}

function onStarfieldResize() {
    const container = document.getElementById('starfield-container');
    if (!container) return;
    starCamera.aspect = window.innerWidth / window.innerHeight;
    starCamera.updateProjectionMatrix();
    starRenderer.setSize(window.innerWidth, window.innerHeight);
}

function animateStarfield() {
    requestAnimationFrame(animateStarfield);
    
    const rotationFactor = 0.0005; 
    if (stars) {
        stars.rotation.y += (mouseX * rotationFactor - stars.rotation.y) * 0.02;
        stars.rotation.x += (mouseY * rotationFactor - stars.rotation.x) * 0.02;
    }

    if (starRenderer) {
        starRenderer.render(starScene, starCamera);
    }
}

ScrollTrigger.matchMedia({
    "(min-width: 769px)": function() {
        console.log("Desktop Animation Active");
        gsap.utils.toArray(".sect3-img").forEach(img => {
            gsap.to(img, {
                scale: 0.5,
                x: -300,
                transformOrigin: "center center",
                ease: "none",
                scrollTrigger: {
                    trigger: img,
                    start: "top top",
                    scrub: 1,
                    end: "+=100",
                    pin: true,
                }
            });
        });
    },
    "(max-width: 768px)": function() {
        console.log("Mobile Animation Active");
        gsap.utils.toArray(".sect3-img").forEach(img => {
            gsap.fromTo(
                img,
                { scale: 3 },
                {
                    scale: 1,
                    x: 20,
                    transformOrigin: "center center",
                    ease: "none",
                    scrollTrigger: {
                        trigger: img.parentElement,
                        start: "+=20%",
                        end: "center top",
                        scrub: 0.01,
                        pin: true,
                    }
                }
            );
        });
    },
    "all": function() {
        // Common setup
    }
});

// Global variables for scene, camera, and renderer for 3D Text
let scene, camera, renderer, textMesh;
const textContent = "";
const lightBlue = new THREE.Color(0x0055ff);
const darkBlue = new THREE.Color(0x2552ac);
const accentColor = new THREE.Color(0x003cff);

function initText() {
    const container = document.getElementById('canvas-container');
    if (!container) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 6;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff00ff, 1.5);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00ffff, 1.5);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

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
            bevelSegments: 10
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

    window.addEventListener('resize', onWindowResize, false);
    animateText();
}

function onWindowResize() {
    const container = document.getElementById('canvas-container');
    if (!container) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Unified mouse movement handler for all animations
function onDocumentMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -((event.clientY / window.innerHeight) * 2 - 1); // Flipped Y-axis for standard 3D rotation
}

function animateText() {
    requestAnimationFrame(animateText);
    if (textMesh) {
        const tiltFactor = 0.05;
        textMesh.rotation.y += (mouseX * tiltFactor - textMesh.rotation.y) * 0.02;
        textMesh.rotation.x += (mouseY * tiltFactor - textMesh.rotation.x) * 0.02;
        const tempColor = new THREE.Color();
        tempColor.lerpColors(lightBlue, darkBlue, (mouseX + 1) / 2);
        textMesh.material.color.lerpColors(tempColor, accentColor, (mouseY + 1) / 2);
    }
    if (renderer) {
        renderer.render(scene, camera);
    }
}

window.onload = function() {
    initStarfield();
    const scrollContainer = document.querySelector('.sect2b');
    if (scrollContainer) {
        startAutoScroll();
        scrollContainer.addEventListener('mouseenter', stopAutoScroll);
        scrollContainer.addEventListener('mouseleave', startAutoScroll);
    }
    document.addEventListener('mousemove', onDocumentMouseMove, false);

    // Call initText if the element exists
    if (document.getElementById('canvas-container')) {
        initText();
    }
};

const scrollAmount = 18 * 18;
let scrollTarget = 0;
let currentScroll = 0;
let isScrolling = false;
let scrollInterval;

function autoScroll() {
    const scrollContainer = document.querySelector('.sect2b');
    if (!scrollContainer) return;
    isScrolling = true;
    const targetScrollLeft = scrollTarget;
    const animationDuration = 1000;
    let startTime = null;

    function animateScroll(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;
        const progress = Math.min(elapsedTime / animationDuration, 1);
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
    const scrollContainer = document.querySelector('.sect2b');
    if (!scrollContainer) return;
    scrollInterval = setInterval(() => {
        if (isScrolling) return;
        const atEnd = scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 1;

        if (atEnd) {
            scrollTarget = 0;
        } else {
            scrollTarget += scrollAmount;
        }
        autoScroll();
    }, 5000);
}

function stopAutoScroll() {
    clearInterval(scrollInterval);
}