import gsap from "gsap";

export function initCustomCursor() {
  const cursor = document.createElement("div");
  cursor.classList.add("custom-cursor");
  cursor.innerHTML = `<span class="custom-cursor__text"></span>`;
  document.body.appendChild(cursor);
  gsap.set(cursor, { width: 24, height: 24, scale: 1 });

  const cursorText = cursor.querySelector(".custom-cursor__text");

  let mouse = { x: 0, y: 0 };
  let pos = { x: 0, y: 0 };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function loop() {
    pos.x = lerp(pos.x, mouse.x, 0.1);
    pos.y = lerp(pos.y, mouse.y, 0.1);

    gsap.set(cursor, {
      x: pos.x,
      y: pos.y,
    });

    requestAnimationFrame(loop);
  }

  loop();

  function bindHoverElements() {
    const hoverEls = document.querySelectorAll("[data-cursor-text]");

    hoverEls.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        const text = el.getAttribute("data-cursor-text");

        gsap.killTweensOf(cursorText);
        gsap.killTweensOf(cursor);

        cursorText.textContent = text;

        const MAX_WIDTH = 250;

        const ghost = document.createElement("span");
        ghost.style.cssText = `
            position: fixed;
            visibility: hidden;
            pointer-events: none;
            font-size: 0.7rem;
            letter-spacing: 0.08em;
            white-space: nowrap;
            padding: 0.5rem 0.75rem;
            line-height: 1.5;
            display: block;
            font-family: "Syne", sans-serif;
            `;
        ghost.textContent = text;
        document.body.appendChild(ghost);

        if (ghost.offsetWidth > MAX_WIDTH) {
          ghost.style.whiteSpace = "normal";
          ghost.style.wordBreak = "break-word";
          ghost.style.width = MAX_WIDTH + "px";
        }

        const naturalWidth = ghost.offsetWidth;
        const naturalHeight = ghost.offsetHeight;
        ghost.remove();

        gsap.to(cursor, {
          width: naturalWidth,
          height: naturalHeight,
          scale: 1,
          duration: 0.4,
          ease: "power3.out",
        });

        gsap.fromTo(
          cursorText,
          { opacity: 0, y: 6 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", delay: 0.025 },
        );
      });

      el.addEventListener("mouseleave", () => {
        gsap.killTweensOf(cursorText);

        gsap.to(cursorText, {
          opacity: 0,
          y: 4,
          duration: 0.2,
          ease: "power2.in",
          onComplete: () => {
            cursorText.textContent = "";
            gsap.to(cursor, {
              width: 24,
              height: 24,
              duration: 0.35,
              ease: "power3.out",
            });
          },
        });
      });
    });
  }

  bindHoverElements();

  return { bindHoverElements };
}
