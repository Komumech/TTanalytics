gsap.registerPlugin(ScrollTrigger);

// Create a GSAP timeline to sequence the animations
const tl = gsap.timeline({
    scrollTrigger: {
        trigger: ".sect2",
        start: "top bottom",
        end: "bottom top", // Use a longer end point to create more scroll time
        scrub: 1,
        //markers: true
    }
});

// Add the tweens to the timeline
tl.to(".sect2", { 
    x: 270, // Move halfway across
    ease: "none"
})
.to(".sect2", { // The pause
    x: 270, // Stay at the halfway point
    ease: "none"
})
.to(".sect2", { 
    x: 1000, // Complete the animation
    ease: "none"
});