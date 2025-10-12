import { setPageClass } from "../router.js";
import gsap from "gsap";
import { fadeUpText } from "../utils/gsapAnimations.js";

let ctx;

export function renderWorks() {
  return `
    <section class="works">
      <h1 class="works-title">My Works</h1>
      <p class="works-subtitle">This page is currently in construction</p>
      
    </section>
  `;
}

export function initWorks() {
  setPageClass("works");

  ctx = gsap.context(() => {
    fadeUpText(".works-title");
    fadeUpText(".works-subtitle");
  });
}

export function destroyWorks() {
  ctx?.revert();
}
