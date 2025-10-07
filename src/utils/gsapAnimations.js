// src/utils/gsapAnimations.js
import gsap from "gsap";

/**
 * Animation simple d’apparition de texte (depuis le bas)
 * @param {string} target - sélecteur ou élément
 * @param {object} options - options GSAP (facultatif)
 */
export function fadeUpText(target, options = {}) {
  return gsap.from(target, {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: "power3.out",
    ...options,
  });
}

/**
 * Animation de texte “stagger” — effet d’entrée en cascade
 * @param {string} target - sélecteur des éléments (ex. ".works-list li")
 * @param {object} options - options GSAP (facultatif)
 */
export function staggerText(target, options = {}) {
  return gsap.from(target, {
    opacity: 0,
    y: 30,
    stagger: 0.15,
    duration: 0.8,
    ease: "power2.out",
    ...options,
  });
}

/**
 * Animation de titre avec léger scale + fade
 * @param {string} target - sélecteur du titre
 * @param {object} options - options GSAP
 */
export function scaleFadeTitle(target, options = {}) {
  return gsap.from(target, {
    scale: 0.9,
    opacity: 0,
    duration: 1,
    ease: "power4.out",
    ...options,
  });
}
