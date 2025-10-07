// src/pages/works.js
import gsap from "gsap";
import { scaleFadeTitle, staggerText } from "../utils/gsapAnimations.js";

let ctx;

export function renderWorks() {
  return `
    <section class="works">
      <h1 class="works-title">My Works</h1>
      <ul class="works-list">
        <li>1. Interactive 3D Portfolio</li>
        <li>2. Product Showcase Animation</li>
        <li>3. WebGL Sandbox Experiment</li>
        <li>4. Minimalist Landing Page</li>
        <li>5. Creative Agency Website</li>
      </ul>
    </section>
  `;
}

export function initWorks() {
  ctx = gsap.context(() => {
    // Animate title and list using your shared utils
    scaleFadeTitle(".works-title");
    staggerText(".works-list li", { delay: 0.3 });
  });
}

export function destroyWorks() {
  ctx?.revert();
}
