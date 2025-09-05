document.addEventListener('DOMContentLoaded', () => {
    // Select all the elements you want to animate
    const circle1 = document.querySelector('.circle');
    const circle2 = document.querySelector('.circle2');
    const headline = document.querySelector('.headline');

    if (!circle1 || !circle2 || !headline) return;

    // --- Define common animation properties ---
    const totalAnimationRange = window.innerHeight * 3; 
    const scaleRange = window.innerHeight * 2; 
    const fadeRange = window.innerHeight; 

    // --- Main scroll event listener ---
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // --- 1. Calculate and apply the scaling animation for both circles ---
        let scaleProgress = scrollY / scaleRange;
        scaleProgress = Math.max(0, Math.min(1, scaleProgress));

        // Circle 1 animation (scales from 0.4 to 0.8)
        const scaleValue1 = 0.4 + (scaleProgress * 0.4);
        circle1.style.transform = `translate(0%, 0%) scale(${scaleValue1})`;

        // Circle 2 animation (scales from 0.5 to 1)
        const scaleValue2 = 0.5 + (scaleProgress * 0.5);
        circle2.style.transform = `translate(0%, 0%) scale(${scaleValue2})`;

              // --- 2. Calculate and apply the fade-out for both circles ---
        let opacityCircleValue = 1;
        if (scrollY > scaleRange) {
            let fadeProgress = (scrollY - scaleRange) / fadeRange;
            fadeProgress = Math.max(0, Math.min(1, fadeProgress));
            opacityCircleValue = 1 - fadeProgress;
        }
        circle1.style.opacity = 0.1;
        circle2.style.opacity = 0.1;

        // --- 3. Calculate and apply the fade-out for the headline ---
        const headlineFadeEnd = window.innerHeight; 
        let headlineOpacityProgress = scrollY / headlineFadeEnd;
        headlineOpacityProgress = Math.max(0, Math.min(1, headlineOpacityProgress));

        const headlineOpacityValue = 1 - headlineOpacityProgress;
        headline.style.opacity = headlineOpacityValue;
    });
});


//Import the THREE.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// To allow for the camera to move around the scene
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// To allow for importing the .gltf file
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Create a Three.JS Scene
const scene = new THREE.Scene();
//create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep track of the mouse position, so we can make the eye move
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'eye';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the file
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    //If the file is loaded, add it to the scene
    object = gltf.scene;
    scene.add(object);
  },
  function (xhr) {
    //While it is loading, log the progress
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  },
  function (error) {
    //If there is an error, log it
    console.error(error);
  }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true allows for the transparent background
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender === "dino" ? 25 : 500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

//This adds controls to the camera, so we can rotate / zoom it with the mouse
if (objToRender === "dino") {
  controls = new OrbitControls(camera, renderer.domElement);
}

//Render the scene
function animate() {
  requestAnimationFrame(animate);
  //Here we could add some code to update the scene, adding some automatic movement

  //Make the eye move
  if (object && objToRender === "eye") {
    //I've played with the constants here until it looked good 
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }
  renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

//add mouse position listener, so we can make the eye move
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Start the 3D rendering
animate();