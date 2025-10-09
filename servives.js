gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: ".new",
  start: "top top", // when the top of .content-display hits the top of viewport
  end: "+=300",     // pin for 300px of scroll
  pin: true,
  pinSpacing: false // prevents extra space after pinning
});