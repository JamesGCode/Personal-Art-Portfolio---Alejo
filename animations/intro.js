function createLoader(imgSrc) {
  const overlay = document.createElement("div");
  overlay.id = "loader-overlay";
  overlay.innerHTML = `
    <div class="ldr-line ldr-h ldr-top"></div>
    <div class="ldr-line ldr-h ldr-bot"></div>
    <div class="ldr-corner ldr-tl">Alejo — 2026</div>
    <div class="ldr-corner ldr-tr">Portfolio</div>
    <div class="ldr-corner ldr-bl">Bogotá · CO</div>
    <div class="ldr-corner ldr-br">Illustrator</div>
    <div class="ldr-center">
      <div class="ldr-label-top">Loading</div>
      <div class="ldr-box" id="ldr-box">
        <img id="ldr-img" src="${imgSrc}" alt="" />
        <div class="ldr-track"><div class="ldr-fill" id="ldr-fill"></div></div>
      </div>
      <div class="ldr-kata">イラスト</div>
    </div>
    <div class="ldr-pct" id="ldr-pct">000</div>
  `;

  const style = document.createElement("style");
  style.textContent = `
    #loader-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: "Epoch", sans-serif;
      overflow: hidden;
      padding: 60px 20px;
      box-sizing: border-box;
    }

    .ldr-line { position: absolute; background: rgba(255,255,255,0.07); }
    .ldr-h    { height: 1px; left: 0; right: 0; }
    .ldr-top  { top: 44px; }
    .ldr-bot  { bottom: 44px; }

    .ldr-corner {
      position: absolute;
      font-size: 10px;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.3);
      white-space: nowrap;
    }
    .ldr-tl { top: 18px; left: 20px; }
    .ldr-tr { top: 18px; right: 20px; }
    .ldr-bl { bottom: 18px; left: 20px; }
    .ldr-br { bottom: 18px; right: 20px; }

    .ldr-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      position: relative;
      z-index: 1;
    }

    .ldr-label-top {
      font-size: 9px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.2);
    }

    .ldr-box {
      position: relative;
      width: clamp(90px, 30vw, 160px);
      aspect-ratio: 2 / 3;
      overflow: hidden;
      flex-shrink: 0;
      background: #111;
    }

    #ldr-img {
      position: absolute !important;
      inset: 0 !important;
      width: 100% !important;
      height: 100% !important;
      object-fit: cover !important;
      display: block !important;
      transform: none !important;
      transition: none !important;
    }

    .ldr-track {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      height: 1px;
      background: rgba(255,255,255,0.08);
      z-index: 2;
    }
    .ldr-fill {
      height: 100%; width: 0%;
      background: rgba(255,255,255,0.6);
      transition: width 0.05s linear;
    }

    .ldr-kata {
      font-family: "Epoch", sans-serif;
      font-size: clamp(10px, 2vw, 13px);
      letter-spacing: 0.45em;
      color: rgba(255,255,255,0.15);
      text-align: center;
      white-space: nowrap;
    }

    .ldr-pct {
      position: absolute;
      bottom: 18px; right: 20px;
      font-size: 10px;
      letter-spacing: 0.12em;
      color: rgba(255,255,255,0.2);
      white-space: nowrap;
    }
  `;
  document.head.appendChild(style);
  return overlay;
}

export function animateIntro(isHorizontal) {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  // ── En móvil: skip loader, revelar página directamente ──
  if (isMobile) {
    const pageEls = [
      ".side-label span",
      ".img-preview",
      ".counter",
      ".minimap",
      ".top-info",
      ".nav-toggle",
      ".bottom-info",
      ".jp-label",
    ];
    gsap.set(pageEls, { opacity: 0, visibility: "hidden" });
    revealPage(isHorizontal);
    return;
  }

  // ── Desktop: loader completo ──
  const imgSrc = document.querySelector("#img-top")?.src ?? "";

  const pageEls = [
    ".side-label span",
    ".img-preview",
    ".counter",
    ".minimap",
    ".top-info",
    ".nav-toggle",
    ".bottom-info",
    ".jp-label",
  ];
  gsap.set(pageEls, { opacity: 0, visibility: "hidden" });

  const overlay = createLoader(imgSrc);
  document.body.appendChild(overlay);

  const box = overlay.querySelector("#ldr-box");
  const fill = overlay.querySelector("#ldr-fill");
  const pct = overlay.querySelector("#ldr-pct");
  const kata = overlay.querySelector(".ldr-kata");
  const corners = overlay.querySelectorAll(".ldr-corner");
  const labelT = overlay.querySelector(".ldr-label-top");
  const center = overlay.querySelector(".ldr-center");

  gsap.set([box, corners, labelT, kata, pct, center], { opacity: 0 });
  gsap.set(box, { scale: 0.88 });

  // ── Fase 1: entrada ──
  const intro = gsap.timeline();
  intro
    .to(center, { opacity: 1, duration: 0.01 })
    .to(box, { scale: 1, opacity: 1, duration: 0.7, ease: "power3.out" })
    .to(labelT, { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.3")
    .to(corners, { opacity: 1, stagger: 0.08, duration: 0.4 }, "-=0.2")
    .to(kata, { opacity: 1, duration: 0.5, ease: "power2.out" }, "-=0.2")
    .to(pct, { opacity: 1, duration: 0.4 }, "-=0.3");

  // ── Fase 2: progreso ──
  let progress = 0;
  const tick = setInterval(() => {
    progress += Math.random() * 5 + 2;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      setTimeout(startReveal, 200);
    }
    fill.style.width = progress + "%";
    pct.textContent = String(Math.floor(progress)).padStart(3, "0");
  }, 70);

  // ── Fase 3: reveal ──
  function startReveal() {
    const previewEl = document.querySelector(".img-preview");
    const jpLabelEl = document.querySelector(".jp-label");
    const previewR = previewEl.getBoundingClientRect();
    const boxR = box.getBoundingClientRect();

    const deltaX =
      previewR.left + previewR.width / 2 - (boxR.left + boxR.width / 2);
    const deltaY =
      previewR.top + previewR.height / 2 - (boxR.top + boxR.height / 2);

    const reveal = gsap.timeline({
      onComplete() {
        overlay.remove();
        revealPage(isHorizontal);
      },
    });

    reveal
      .to([corners, labelT, kata, pct], {
        opacity: 0,
        duration: 0.25,
        stagger: 0.03,
        ease: "power2.in",
      })
      .to(
        box,
        {
          x: deltaX,
          y: deltaY,
          width: previewR.width,
          height: previewR.height,
          duration: 1.05,
          ease: "power4.inOut",
        },
        "-=0.05",
      )
      .to(
        overlay,
        {
          backgroundColor: "#ffffff",
          duration: 0.65,
          ease: "power2.inOut",
        },
        "-=0.55",
      )
      .call(
        () => {
          gsap.set(previewEl, { visibility: "visible", opacity: 1 });
          gsap.set(jpLabelEl, { visibility: "visible", opacity: 1 });
        },
        null,
        "-=0.28",
      )
      .to(overlay, {
        opacity: 0,
        duration: 0.28,
        ease: "power2.inOut",
      });
  }
  // function startReveal() {
  //   const previewEl = document.querySelector(".img-preview");
  //   const jpLabelEl = document.querySelector(".jp-label");
  //   const previewR = previewEl.getBoundingClientRect();
  //   const boxR = box.getBoundingClientRect();

  //   // Delta original — funciona porque box sigue dentro del overlay
  //   const deltaX =
  //     previewR.left + previewR.width / 2 - (boxR.left + boxR.width / 2);
  //   const deltaY =
  //     previewR.top + previewR.height / 2 - (boxR.top + boxR.height / 2);

  //   // ── Canvas negro detrás de todo ──
  //   const canvas = document.createElement("canvas");
  //   const W = window.innerWidth;
  //   const H = window.innerHeight;
  //   canvas.width = W;
  //   canvas.height = H;
  //   // Object.assign(canvas.style, {
  //   //   position: "fixed",
  //   //   inset: "0",
  //   //   zIndex: "9998", // debajo del overlay (9999)
  //   //   pointerEvents: "none",
  //   // });
  //   Object.assign(canvas.style, {
  //     position: "fixed",
  //     inset: "0",
  //     zIndex: "9998",
  //     pointerEvents: "none",
  //     opacity: "1",
  //     willChange: "opacity",
  //   });
  //   document.body.appendChild(canvas);
  //   const ctx = canvas.getContext("2d");
  //   ctx.fillStyle = "#000";
  //   ctx.fillRect(0, 0, W, H);

  //   const COLS = 28;
  //   const ROWS = 18;
  //   const blockW = W / COLS;
  //   const blockH = H / ROWS;

  //   const blocks = [];
  //   for (let r = 0; r < ROWS; r++) {
  //     for (let c = 0; c < COLS; c++) {
  //       blocks.push({
  //         x: c * blockW,
  //         y: r * blockH,
  //         w: blockW + 1,
  //         h: blockH + 1,
  //         row: r,
  //       });
  //     }
  //   }

  //   const totalDuration = 1.2;
  //   const burnDuration = 0.5;
  //   const stagger = totalDuration / ROWS;

  //   blocks.forEach((b) => {
  //     const rowFromBottom = ROWS - 1 - b.row;
  //     const noise = (Math.random() - 0.5) * stagger * 1.2;
  //     b.appearAt = rowFromBottom * stagger * 0.55 + Math.max(0, noise);
  //   });

  //   const maxEnd = Math.max(...blocks.map((b) => b.appearAt + burnDuration));

  //   let startTime = null;
  //   let rafId;

  //   function lerp(a, b, t) {
  //     return a + (b - a) * Math.max(0, Math.min(1, t));
  //   }

  //   function drawFrame(ts) {
  //     if (!startTime) startTime = ts;
  //     const elapsed = (ts - startTime) / 1000;

  //     ctx.fillStyle = "#000";
  //     ctx.fillRect(0, 0, W, H);

  //     blocks.forEach((b) => {
  //       if (elapsed < b.appearAt) return;
  //       const t = Math.min((elapsed - b.appearAt) / burnDuration, 1);
  //       const v = Math.round(lerp(0, 255, t));
  //       ctx.fillStyle = `rgb(${v},${v},${v})`;
  //       ctx.fillRect(b.x, b.y, b.w, b.h);
  //     });

  //     if (elapsed >= maxEnd) {
  //       cancelAnimationFrame(rafId);

  //       gsap.set(previewEl, {
  //         visibility: "visible",
  //         opacity: 1,
  //       });

  //       gsap.set(jpLabelEl, {
  //         visibility: "visible",
  //         opacity: 1,
  //       });

  //       revealPage(isHorizontal);

  //       gsap.to(canvas, {
  //         opacity: 0,
  //         duration: 0.35,
  //         ease: "power2.out",
  //         onComplete() {
  //           canvas.remove();
  //         },
  //       });

  //       return;
  //     }

  //     rafId = requestAnimationFrame(drawFrame);
  //   }

  //   // const exit = gsap.timeline();

  //   // exit
  //   //   .to([corners, labelT, kata, pct], {
  //   //     opacity: 0, duration: 0.2, stagger: 0.02, ease: "power2.in",
  //   //   })
  //   //   // El fondo del overlay se vuelve transparente pero NO su opacidad
  //   //   // así box sigue visible y los deltas siguen siendo válidos
  //   //   .call(() => {
  //   //     overlay.style.background = "transparent";
  //   //     overlay.style.pointerEvents = "none";
  //   //   })
  //   //   // Canvas y vuelo de la caja arrancan al mismo tiempo
  //   //   .to(box, {
  //   //     x: deltaX,
  //   //     y: deltaY,
  //   //     width:  previewR.width,
  //   //     height: previewR.height,
  //   //     duration: 1.05, ease: "power4.inOut",
  //   //     onComplete() {
  //   //       overlay.remove();
  //   //     },
  //   //   })
  //   //   .call(() => {
  //   //     rafId = requestAnimationFrame(drawFrame);
  //   //   }, null, "<");
  //   const exit = gsap.timeline();

  //   exit
  //     .to([corners, labelT, kata, pct], {
  //       opacity: 0,
  //       duration: 0.2,
  //       stagger: 0.02,
  //       ease: "power2.in",
  //     })
  //     // Canvas ya visible ANTES de tocar el overlay
  //     .call(() => {
  //       ctx.fillStyle = "#000";
  //       ctx.fillRect(0, 0, W, H);
  //     })
  //     .call(
  //       () => {
  //         overlay.style.background = "transparent";
  //         overlay.style.pointerEvents = "none";
  //       },
  //       null,
  //       "+=0.02",
  //     )
  //     // Ahora sí el overlay se vuelve transparente — el canvas negro lo reemplaza sin gap
  //     .call(() => {
  //       overlay.style.background = "transparent";
  //       overlay.style.pointerEvents = "none";
  //     })
  //     .to(box, {
  //       x: deltaX,
  //       y: deltaY,
  //       width: previewR.width,
  //       height: previewR.height,
  //       duration: 1.05,
  //       ease: "power4.inOut",
  //       onComplete() {
  //         overlay.remove();
  //       },
  //     })
  //     .call(
  //       () => {
  //         rafId = requestAnimationFrame(drawFrame);
  //       },
  //       null,
  //       "<",
  //     );
  // }
}

function revealPage(isHorizontal) {
  const tl = gsap.timeline();
  tl.to(".side-label span", {
    visibility: "visible",
    opacity: 1,
    x: 0,
    y: 0,
    filter: "blur(0px)",
    duration: 1.2,
    ease: "power4.out",
    onStart() {
      gsap.set(".side-label span", {
        visibility: "visible",
        x: !isHorizontal ? -300 : 0,
        y: isHorizontal ? -150 : 0,
        filter: "blur(20px)",
      });
    },
  })
    .to(
      ".img-preview",
      {
        visibility: "visible",
        opacity: 1,
        scale: 1,
        duration: 0.9,
        ease: "power3.out",
        onStart() {
          gsap.set(".img-preview", { visibility: "visible", scale: 0.96 });
        },
      },
      "<",
    )
    .to(
      ".counter",
      {
        visibility: "visible",
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        onStart() {
          gsap.set(".counter", { visibility: "visible", y: 20 });
        },
      },
      "-=0.8",
    )
    .to(
      ".minimap",
      {
        visibility: "visible",
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        onStart() {
          gsap.set(".minimap", {
            visibility: "visible",
            x: isHorizontal ? 0 : 40,
            y: isHorizontal ? 0 : 0,
          });
        },
      },
      "<",
    )
    .to(
      ".top-info",
      {
        visibility: "visible",
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        onStart() {
          gsap.set(".top-info", { visibility: "visible", y: -20 });
        },
      },
      "-=0.6",
    )
    .to(
      ".bottom-info",
      {
        visibility: "visible",
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        onStart() {
          gsap.set(".bottom-info", { visibility: "visible", y: 20 });
        },
      },
      "<",
    )
    .to(
      ".jp-label",
      {
        // visibility: "visible",
        // opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        onStart() {
          gsap.set(".jp-label", { visibility: "visible" });
        },
      },
      "<",
    )
    .to(
      ".nav-toggle",
      {
        visibility: "visible",
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(2)",
        onStart() {
          gsap.set(".nav-toggle", { visibility: "visible", scale: 0 });
        },
      },
      "-=0.3",
    )
    .call(() => {
      gsap.set(".menu", { opacity: 1 }); // restaura el menú para cuando se abra
    });
}
