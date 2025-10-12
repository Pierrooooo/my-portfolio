import { setPageClass } from "../router.js";
import gsap from "gsap";
import { fadeUpText } from "../utils/gsapAnimations.js";

let ctx;

export function renderSandbox() {
  return `
    <section class="sandbox">
      <h1 class="sandbox-title">Sandbox</h1>
      <p class="sandbox-subtitle">This page is currently in construction</p>
    </section>
  `;
}

export function initSandbox() {
  setPageClass("sandbox");

  ctx = gsap.context(() => {
    fadeUpText(".sandbox-title");
    fadeUpText(".sandbox-subtitle", { delay: 0.2 });
  });
}

export function destroySandbox() {
  ctx?.revert();
}
