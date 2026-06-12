let track;
let limit = 0;
let offset = 0;
const BASE_SPEED = 0.4;
let isHorizontalMode = false;

export function initSideLabel(isHorizontal) {
  track = document.querySelector(".side-track");
  if (!track) return;

  isHorizontalMode = isHorizontal;

  track.querySelectorAll(".side-track-clone").forEach((el) => el.remove());

  const rect = track.getBoundingClientRect();
  limit = isHorizontal ? rect.width : rect.height;

  const inner = track.innerHTML;
  const cloneWrapper = document.createElement("div");
  cloneWrapper.classList.add("side-track-clone");
  cloneWrapper.innerHTML = inner;
  cloneWrapper.style.cssText = isHorizontal
    ? "display:flex;flex-direction:row;flex-shrink:0;"
    : "display:flex;flex-direction:column;flex-shrink:0;";

  track.appendChild(cloneWrapper);
  track.style.flexDirection = isHorizontal ? "row" : "column";

  offset = 0;
  track.style.transform = "translate3d(0,0,0)";
}

export function boostSideLabel() {}

export function updateSideLabel() {
  if (!track || !limit) return;

  offset += BASE_SPEED;

  if (offset >= limit) {
    offset -= limit;
  }

  track.style.transform = isHorizontalMode
    ? `translate3d(${-offset}px, 0, 0)`
    : `translate3d(0, ${-offset}px, 0)`;
}