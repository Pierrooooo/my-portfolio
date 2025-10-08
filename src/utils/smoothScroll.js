import gsap from "gsap";
import { ScrollTrigger, ScrollSmoother } from "gsap/all";

export function initSmoothScroll() {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.2,
    effects: true,
    normalizeScroll: true,
  });

  window.addEventListener("resize", () => {
    ScrollTrigger.refresh();
  });

  return smoother;
}