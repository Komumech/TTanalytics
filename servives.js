gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: ".new",
  start: "center-=50 center", // starts 50px above the center of the viewport
  end: "+=100",
  pin: true,
  pinSpacing: false,
  markers: true
});

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.create({
  trigger: ".new2",
  start: "center-=50 center", // when the top of .content-display hits the top of viewport
  end: "+=100",     // pin for 300px of scroll
  pin: true,
  pinSpacing: false // prevents extra space after pinning
});