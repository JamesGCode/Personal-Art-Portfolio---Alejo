import { animateIntro } from "./animations/intro.js";
import { initSideLabel, updateSideLabel } from "./animations/sideLabel.js";
import { images } from "./data/images.js";

// ── DOM ───────────────────────────────────────────────────────────────────────
const container = document.querySelector(".container");
const minimap = document.querySelector(".minimap");
const itemsEl = document.querySelector("#minimap-items");
const indicator = document.querySelector(".indicator");
const digitTens = document.querySelector("#digit-tens");
const digitUnits = document.querySelector("#digit-units");
const totalCount = document.querySelector(".total-count");
const imgPreview = document.querySelector("#img-preview");
const imgBehind = document.querySelector("#img-behind");
const imgTop = document.querySelector("#img-top");
const smudgeSVG = document.querySelector(".smudge-revealer");
const smudgeBlobs = document.querySelector(".smudge-blobs");
const metaCategory = document.querySelector("#meta-category");
const metaTags = document.querySelector("#meta-tags");

// ── Build minimap from images array ──────────────────────────────────────────
function buildMinimap(data) {
  itemsEl.innerHTML = "";
  data.forEach((entry) => {
    const div = document.createElement("div");
    div.className = "item";
    const img = document.createElement("img");
    img.src = entry.main;
    img.alt = entry.title ?? "Image item";
    div.appendChild(img);
    itemsEl.appendChild(div);
  });
}
buildMinimap(images);

let itemElements = document.querySelectorAll(".item");
let itemImages = document.querySelectorAll(".item img");
totalCount.textContent = String(itemElements.length).padStart(2, "0");

const currentYear = new Date().getFullYear();
document.querySelectorAll(".current-year").forEach((el) => {
  el.textContent = currentYear;
});

// ── Smudge config (mirrors Codegrid reference exactly) ───────────────────────
// const config = {
//   smoothing: 0.1, // lerp factor for smooth pointer
//   movementThreshold: 0.5, // min speed before stamping a blob
//   sizeFromSpeed: 0.6, // radius = speed × this
//   minRadius: 18, // floor so slow moves still leave a mark
//   expandMultiplier: 2.2, // blob grows to radius × this
//   expandTime: 1.8, // seconds to reach full size
//   expandEase: "power1.inOut",
//   dissolveStart: 1.6, // seconds after stamp when shrink begins
//   dissolveTime: 2.8, // seconds to shrink to 0
//   dissolveEase: "power3.in",
// };
const config = {
  smoothing: 0.1,
  movementThreshold: 0.5,
  sizeFromSpeed: 0.6,
  minRadius: 18,

  expandMultiplier: 1,

  dissolveStart: 0,
  dissolveTime: 1.5,
  dissolveEase: "power3.in",
};

// ── Pointer state ─────────────────────────────────────────────────────────────
// Coordinates are relative to the imgPreview box (not the page)
const pointer = { x: 0, y: 0 };
const smoothPointer = { x: 0, y: 0 };
let hasStarted = false;

function onPointerMove(x, y) {
  // x, y are already relative to imgPreview
  if (!hasStarted) {
    pointer.x = smoothPointer.x = x;
    pointer.y = smoothPointer.y = y;
    hasStarted = true;
    return;
  }
  pointer.x = x;
  pointer.y = y;
}

// ── Size the SVG to cover the preview box exactly ─────────────────────────────
function matchSVGToPreview() {
  const rect = imgPreview.getBoundingClientRect();
  smudgeSVG.style.width = rect.width + "px";
  smudgeSVG.style.height = rect.height + "px";
}
matchSVGToPreview();
window.addEventListener("resize", matchSVGToPreview);

// ── Stamp a smudge blob (direct port of Codegrid stampSmudgeAt) ───────────────
function stampSmudgeAt(x, y, radius) {
  const circle = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle",
  );
  circle.setAttribute("cx", x);
  circle.setAttribute("cy", y);
  circle.setAttribute("r", radius);
  circle.setAttribute("fill", "#fff");
  smudgeBlobs.prepend(circle);

  const animated = { current: radius };

  const tl = gsap.timeline({
    onUpdate() {
      circle.setAttribute("r", Math.max(0, animated.current));
    },
    onComplete() {
      tl.kill();
      circle.remove();
    },
  });

  // Phase 1 — expand
  tl.to(animated, {
    current: radius * config.expandMultiplier,
    duration: config.expandTime,
    ease: config.expandEase,
  });

  // Phase 2 — dissolve (starts at dissolveStart seconds from timeline beginning)
  tl.to(
    animated,
    {
      current: 0,
      duration: config.dissolveTime,
      ease: config.dissolveEase,
    },
    config.dissolveStart,
  );
}

// ── Mouse / touch events on the preview box ───────────────────────────────────
imgPreview.addEventListener("mousemove", (e) => {
  const rect = imgPreview.getBoundingClientRect();
  onPointerMove(e.clientX - rect.left, e.clientY - rect.top);
});

imgPreview.addEventListener("mouseleave", () => {
  // Reset so next mouseenter doesn't produce a huge jump
  hasStarted = false;
});

imgPreview.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    const rect = imgPreview.getBoundingClientRect();
    onPointerMove(
      e.touches[0].clientX - rect.left,
      e.touches[0].clientY - rect.top,
    );
  },
  { passive: false },
);

imgPreview.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    const rect = imgPreview.getBoundingClientRect();
    onPointerMove(
      e.touches[0].clientX - rect.left,
      e.touches[0].clientY - rect.top,
    );
  },
  { passive: false },
);

// ── Minimap state ─────────────────────────────────────────────────────────────
let isHorizontal = window.matchMedia("(max-width: 768px)").matches;
let dimensions = { itemSize: 0, containerSize: 0, indicatorSize: 0 };
let maxTranslate = 0,
  currentTranslate = 0,
  targetTranslate = 0;
let isClickMove = false,
  currentImageIndex = 0;

// ── Counter animation ─────────────────────────────────────────────────────────
function animateDigit(container, newValue, direction) {
  const active = container.querySelector(".active");
  if (!active) {
    container.innerHTML = "";
    const span = document.createElement("span");
    span.classList.add("active");
    span.textContent = newValue;
    container.appendChild(span);
    return;
  }
  if (active.textContent === String(newValue)) return;
  gsap.killTweensOf(container.children);
  container.querySelectorAll("span:not(.active)").forEach((el) => el.remove());
  const next = document.createElement("span");
  next.textContent = newValue;
  next.classList.add("incoming");
  gsap.set(next, { yPercent: direction > 0 ? 100 : -100 });
  container.appendChild(next);
  gsap.to(active, {
    yPercent: direction > 0 ? -100 : 100,
    duration: 0.35,
    ease: "power2.out",
  });
  gsap.to(next, {
    yPercent: 0,
    duration: 0.35,
    ease: "power2.out",
    onComplete() {
      active.remove();
      next.classList.remove("incoming");
      next.classList.add("active");
      gsap.set(next, { clearProps: "all" });
      container.querySelectorAll("span").forEach((el) => {
        if (el !== next) el.remove();
      });
    },
  });
}

function updateCounter(index, previousIndex = 0) {
  const cv = String(index + 1).padStart(2, "0");
  const pv = String(previousIndex + 1).padStart(2, "0");
  const dir = index > previousIndex ? 1 : -1;
  if (cv[0] !== pv[0]) animateDigit(digitTens, cv[0], dir);
  if (cv[1] !== pv[1]) animateDigit(digitUnits, cv[1], dir);
}

// ── Meta update ───────────────────────────────────────────────────────────────
// function updateMeta(index) {
//   const entry = images[index];
//   if (!entry) return;
//   if (metaCategory) metaCategory.textContent = entry.category ?? "";
//   if (metaTags) {
//     metaTags.innerHTML = "";
//     (entry.tags ?? []).forEach((tag) => {
//       const span = document.createElement("span");
//       span.textContent = tag;
//       metaTags.appendChild(span);
//     });
//   }
// }

// ── Preview image swap ────────────────────────────────────────────────────────
const activeItemOpacity = 0.3;

function updatePreviewImage(index) {
  if (currentImageIndex === index) return;
  const previousIndex = currentImageIndex;
  currentImageIndex = index;
  const entry = images[index];
  if (!entry) return;

  imgBehind.src = entry.behind;
  imgTop.src = entry.main;

  // Kill all active blobs so new image starts fresh
  smudgeBlobs.innerHTML = "";
  gsap.killTweensOf(".smudge-blobs circle");
  hasStarted = false;

  updateCounter(index, previousIndex);
  // updateMeta(index);
  itemImages.forEach((img) => (img.style.opacity = 1));
  itemImages[index].style.opacity = activeItemOpacity;
}

// ── Minimap dimensions ────────────────────────────────────────────────────────
function lerp(a, b, t) {
  return a + (b - a) * t;
}

function updateDimensions() {
  isHorizontal = window.matchMedia("(max-width: 768px)").matches;
  dimensions = isHorizontal
    ? {
        itemSize: itemElements[0].getBoundingClientRect().width,
        containerSize: itemsEl.scrollWidth,
        indicatorSize: indicator.getBoundingClientRect().width,
      }
    : {
        itemSize: itemElements[0].getBoundingClientRect().height,
        containerSize: itemsEl.getBoundingClientRect().height,
        indicatorSize: indicator.getBoundingClientRect().height,
      };
  return dimensions;
}

dimensions = updateDimensions();
initSideLabel(isHorizontal);
maxTranslate = dimensions.containerSize - dimensions.indicatorSize;

function getItemInIndicator() {
  const center = Math.abs(currentTranslate) + dimensions.indicatorSize / 2;
  const selectedIndex = Math.min(
    Math.floor(center / dimensions.itemSize),
    itemElements.length - 1,
  );
  itemImages.forEach((img) => (img.style.opacity = 1));
  itemImages[selectedIndex].style.opacity = activeItemOpacity;
  return selectedIndex;
}

// ── Main RAF loop ─────────────────────────────────────────────────────────────
function update() {
  // --- Minimap scroll lerp ---
  const lerpFactor = isClickMove ? 0.15 : 0.2;
  currentTranslate = lerp(currentTranslate, targetTranslate, lerpFactor);
  if (Math.abs(currentTranslate - targetTranslate) > 0.01) {
    itemsEl.style.transform = isHorizontal
      ? `translateX(${currentTranslate}px)`
      : `translateY(${currentTranslate}px)`;
    updatePreviewImage(getItemInIndicator());
  } else {
    currentTranslate = targetTranslate;
    isClickMove = false;
  }

  // --- Smudge pointer smoothing + stamp (direct port of Codegrid update()) ---
  if (hasStarted) {
    smoothPointer.x += (pointer.x - smoothPointer.x) * config.smoothing;
    smoothPointer.y += (pointer.y - smoothPointer.y) * config.smoothing;

    const speed = Math.hypot(
      pointer.x - smoothPointer.x,
      pointer.y - smoothPointer.y,
    );

    if (speed > config.movementThreshold) {
      const radius = Math.max(config.minRadius, speed * config.sizeFromSpeed);
      stampSmudgeAt(smoothPointer.x, smoothPointer.y, radius);
    }
  }

  updateSideLabel();
  requestAnimationFrame(update);
}

// ── Wheel ─────────────────────────────────────────────────────────────────────
container.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    isClickMove = false;
    const v = Math.min(Math.max(e.deltaY * 1.2, -50), 30);
    targetTranslate = Math.min(Math.max(targetTranslate - v, -maxTranslate), 0);
  },
  { passive: false },
);

// ── Touch minimap ─────────────────────────────────────────────────────────────
let touchStartX = 0,
  touchStartY = 0;
minimap.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  },
  { passive: false },
);
minimap.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault();
    e.stopPropagation();
    const tx = e.touches[0].clientX,
      ty = e.touches[0].clientY;
    const delta = isHorizontal ? touchStartX - tx : touchStartY - ty;
    const v = Math.min(Math.max(delta * 1.2, -50), 30);
    targetTranslate = Math.min(Math.max(targetTranslate - v, -maxTranslate), 0);
    touchStartX = tx;
    touchStartY = ty;
  },
  { passive: false },
);

// ── Minimap click ─────────────────────────────────────────────────────────────
itemElements.forEach((item, index) => {
  item.addEventListener("click", () => {
    isClickMove = true;
    targetTranslate =
      -index * dimensions.itemSize +
      (dimensions.indicatorSize - dimensions.itemSize) / 2;
    targetTranslate = Math.max(Math.min(targetTranslate, 0), -maxTranslate);
  });
});

// ── Resize ────────────────────────────────────────────────────────────────────
window.addEventListener("resize", () => {
  dimensions = updateDimensions();
  maxTranslate = dimensions.containerSize - dimensions.indicatorSize;
  targetTranslate = Math.min(Math.max(targetTranslate, -maxTranslate), 0);
  currentTranslate = targetTranslate;
  itemsEl.style.transform = isHorizontal
    ? `translateX(${currentTranslate}px)`
    : `translateY(${currentTranslate}px)`;
  initSideLabel(isHorizontal);
  matchSVGToPreview();
  smudgeBlobs.innerHTML = "";
  hasStarted = false;
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────
itemImages[0].style.opacity = activeItemOpacity;
updatePreviewImage(0);
// updateMeta(0);
digitTens.innerHTML = `<span class="active">0</span>`;
digitUnits.innerHTML = `<span class="active">1</span>`;
updateCounter(0);
requestAnimationFrame(update);
animateIntro(isHorizontal);
