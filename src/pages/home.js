import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { fadeUpText, scaleFadeTitle } from "../utils/gsapAnimations.js";
import ThreeScene from "../utils/threeScene.js";

let ctx;
let three;
let plane;
let time = 0;

export function renderHome() {
  return `
    <section class="home">
      <div class="hero">
        <h1 class="hero-title"><span>Home</span></h1>
      </div>

      <div id="three-container" class="three-container"></div>

      <section class="process" id="process">
        <div class="process-inner">

          <div class="process-step" data-step="1">
            <div class="texts">
              <h2><span>Rencontre</span></h2>
              <h3><span>Discutons</span></h3>
              <p><span>Dans un premier temps il m’est important de vous rencontrer pour que nous discutions de votre projet et de vos besoins.</span></p>
            </div>
            <img src="assets/unsplash.avif" alt="Rencontre">
          </div>

          <div class="process-step" data-step="2">
            <div class="texts">
              <h2><span>Design</span></h2>
              <h3><span>Prototype</span></h3>
              <p><span>La réalisation de votre maquette est une étape importante pour visualiser le rendu final de votre site.</span></p>
            </div>
            <img src="assets/unsplash2.avif" alt="Design">
          </div>

          <div class="process-step" data-step="3">
            <div class="texts">
              <h2><span>Développement</span></h2>
              <h3><span>Réalisation</span></h3>
              <p><span>Finalisation du projet pendant laquelle je développe le site et prépare la mise en ligne.</span></p>
            </div>
            <img src="assets/unsplash3.avif" alt="Développement">
          </div>

        </div>
      </section>
    </section>
  `;
}

export function initHome() {
  gsap.registerPlugin(ScrollTrigger);

  function splitTextToSpans(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      const text = el.innerText;
      const letters = text.split("");
      el.innerHTML = letters
        .map((letter) => `<span>${letter === " " ? "&nbsp;" : letter}</span>`)
        .join("");
    });
  }

  ctx = gsap.context(() => {
    scaleFadeTitle(".hero-title");

    splitTextToSpans(".process-step h2 span, .process-step h3 span");

    const stepsContainer = document.querySelector(".process-inner");
    const steps = gsap.utils.toArray(".process-step");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stepsContainer,
        start: "top top",
        end: "+=" + window.innerHeight * steps.length * steps.length,
        scrub: true,
        pin: true,
      },
    });

    const stepDuration = 1.5;

    steps.forEach((step, i) => {
      const titleLetters = step.querySelectorAll("h2 span span, h3 span span");
      const paragraph = step.querySelector("p span");
      const img = step.querySelector("img");

      gsap.set(step, { autoAlpha: 0 });
      gsap.set(titleLetters, { yPercent: 100, opacity: 0 });
      gsap.set(paragraph, { yPercent: 100, opacity: 0 });
      gsap.set(img, { xPercent: 100 });

      tl.to(step, { autoAlpha: 1, duration: 0.1 })
        .to(
          titleLetters,
          {
            yPercent: 0,
            opacity: 1,
            stagger: 0.005,
            duration: 0.25 * stepDuration,
            ease: "power3.out",
          },
          "<"
        )
        .to(
          paragraph,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.25 * stepDuration,
            ease: "power3.out",
          },
          "<0.1"
        )
        .to(
          img,
          { xPercent: 0, duration: 0.3 * stepDuration, ease: "power3.out" },
          "<0.2"
        )
        .to(
          titleLetters,
          {
            yPercent: -100,
            opacity: 0,
            stagger: 0.005,
            duration: 0.2 * stepDuration,
            ease: "power3.in",
          },
          "+=0.2"
        )
        .to(
          paragraph,
          {
            yPercent: -100,
            opacity: 0,
            duration: 0.2 * stepDuration,
            ease: "power3.in",
          },
          "<"
        )
        .to(
          img,
          { xPercent: -100, duration: 0.3 * stepDuration, ease: "power3.inOut" },
          "<"
        )
        .to(step, { autoAlpha: 0, duration: 0.1 });
    });

    setTimeout(() => ScrollTrigger.refresh(), 200);
  });

  // === THREE.JS ===
  const container = document.querySelector("#three-container");

  three = new ThreeScene(container, (scene) => {
    const geometry = new THREE.PlaneGeometry(6, 3, 40, 20);
    const material = new THREE.MeshStandardMaterial({
      color: 0x00ffcc,
      wireframe: true,
      side: THREE.DoubleSide,
    });

    plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
  });

  three.start(() => {
    time += 0.02;
    const position = plane.geometry.attributes.position;
    const count = position.count;

    for (let i = 0; i < count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const wave =
        Math.sin(x * 1.5 + time) * 0.125 +
        Math.cos(y * 1.2 + time * 0.7) * 0.25;
      position.setZ(i, wave);
    }

    position.needsUpdate = true;
    plane.geometry.computeVertexNormals();
  });
}

export function destroyHome() {
  ctx?.revert();
  three?.dispose();
}
