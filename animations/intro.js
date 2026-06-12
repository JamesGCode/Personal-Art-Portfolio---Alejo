export function animateIntro(isHorizontal) {
  const tl = gsap.timeline();

  tl.from(".side-label span", {
    x: !isHorizontal ? -300 : 0,
    y: isHorizontal ? -150 : 0,
    rotate: 3,
    filter: "blur(20px)",
    opacity: 0,
    duration: 1.8,
    ease: "power4.out",
  });

  tl.from(
    ".img-preview",
    {
      scale: 0.95,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    },
    "-=1.2",
  );

  tl.from(
    ".counter",
    {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    },
    "-=0.8",
  );

  tl.from(
    ".minimap",
    {
      x: 40,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
    },
    "-=0.8",
  );

  tl.from(
    ".top-info",
    {
      y: -20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    },
    "-=0.6",
  );
  
  tl.from(
    ".bottom-info",
    {
      y: 20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    },
    "-=0.6",
  );

  tl.from(
    ".contact-link",
    {
      y: -20,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    },
    "<",
  );
}
