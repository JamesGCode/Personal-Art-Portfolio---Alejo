const navToggle      = document.querySelector(".nav-toggle");
const navToggleLabel = document.querySelector(".nav-toggle-label");
const menu           = document.querySelector(".menu");
const menuBg         = document.getElementById("menu-path");
const menuBgSvg      = document.querySelector(".menu-bg-svg");
const menuInfoItems  = document.querySelectorAll(
  ".menu-artist-name, .menu-artist-role, .menu-artist-desc, .menu-contact p, .menu-contact h3, .menu-contact h6, .menu-img-wrapper"
);

const svgWidth   = menuBgSvg.viewBox.baseVal.width;
const svgHeight  = menuBgSvg.viewBox.baseVal.height;
const svgCenterX = svgWidth / 2;

const OPEN_HIDDEN  = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,0 L${svgWidth},0 Z`;
const OPEN_BULGE   = `M${svgWidth},345 Q${svgCenterX},620 0,345 L0,0 L${svgWidth},0 Z`;
const OPEN_FULL    = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,0 L${svgWidth},0 Z`;
const CLOSE_START  = `M${svgWidth},0 Q${svgCenterX},0 0,0 L0,${svgHeight} L${svgWidth},${svgHeight} Z`;
const CLOSE_BULGE  = `M${svgWidth},350 Q${svgCenterX},130 0,350 L0,${svgHeight} L${svgWidth},${svgHeight} Z`;
const CLOSE_HIDDEN = `M${svgWidth},${svgHeight} Q${svgCenterX},${svgHeight} 0,${svgHeight} L0,${svgHeight} L${svgWidth},${svgHeight} Z`;

gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } });
gsap.set(menuInfoItems, { opacity: 0, y: 100 });

let isOpen      = false;
let isAnimating = false;

navToggle.addEventListener("click", () => {
  if (isAnimating) return;
  isAnimating = true;
  isOpen = !isOpen;
  isOpen ? openMenu() : closeMenu();
});

function popToggle(newText) {
  gsap.timeline()
    .to(navToggle, {
      scale: 0.8,
      duration: 0.12,
      ease: "power2.in",
    })
    .call(() => { navToggleLabel.textContent = newText; })
    .to(navToggle, {
      scale: 1.1,
      duration: 0.2,
      ease: "power2.out",
    })
    .to(navToggle, {
      scale: 1,
      duration: 0.15,
      ease: "power2.inOut",
    });
}

function openMenu() {
  menu.classList.add("is-open");
  navToggle.classList.add("is-open");
  popToggle("Close");

  const tl = gsap.timeline({ onComplete: () => { isAnimating = false; } });

  tl.to(menuBg, { duration: 0.5, attr: { d: OPEN_BULGE }, ease: "power4.in" })
    .to(menuBg, { duration: 0.5, attr: { d: OPEN_FULL  }, ease: "power4.out" })
    .to(menuInfoItems, {
      duration: 0.75,
      opacity: 1,
      y: 0,
      ease: "power3.out",
      stagger: 0.075,
    }, "-=0.35");
}

function closeMenu() {
  gsap.set(menuBg, { attr: { d: CLOSE_START } });
  navToggle.classList.remove("is-open");
  popToggle("Bio");

  const tl = gsap.timeline({
    onComplete: () => {
      menu.classList.remove("is-open");
      gsap.set(menuBg, { attr: { d: OPEN_HIDDEN } });
      gsap.set(menuInfoItems, { opacity: 0, y: 100 });
      isAnimating = false;
    },
  });

  tl.to(menuInfoItems, { duration: 0.3, opacity: 0 })
    .to(menuBg, { duration: 0.5, attr: { d: CLOSE_BULGE  }, ease: "power3.in"  }, "<")
    .to(menuBg, { duration: 0.5, attr: { d: CLOSE_HIDDEN }, ease: "power3.out" });
}