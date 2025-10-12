import { setPageClass } from "../router.js";
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
      <div class="intro">
          <h1 class="intro__title">
            <span class="intro__firstname">Pierre</span>
            <span class="intro__photo">
              <img src="assets/me.jpg" alt="Pierre Caillet">
            </span>
            <span class="intro__lastname">CAILLET</span>
          </h1>
          <h2 class="intro__subtitle">
            FRONT END<br>DEVELOPPEUR
          </h2>
          <p class="intro__text">
            J’ai pour but de devenir Creative Front End Developpeur, ce qui signifie qu’à terme je souhaite créer non seulement des sites web élégants, UX friendly, mais aussi des expériences qui sortent de l’ordinaire.
          </p>
          <div class="go-scroll"><span></span></div>
        </div>

        <div class="three-container">
          <canvas></canvas>
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
  setPageClass("home");

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

  splitTextToSpans(".intro__firstname");
  splitTextToSpans(".intro__lastname");
  splitTextToSpans(".intro__subtitle");

  const introTl = gsap.timeline({ delay: 0.3, paused: true });

  const firstLetters = document.querySelectorAll(".intro__firstname span");
  const lastLetters = document.querySelectorAll(".intro__lastname span");
  const subtitleLetters = document.querySelectorAll(".intro__subtitle span");
  const introText = document.querySelectorAll(".intro__text");
  const goScroll = document.querySelectorAll(".go-scroll");

//   introTl.set(firstLetters, { y: 100 });
//   introTl.set(lastLetters, { y: -100 });
//   introTl.set(subtitleLetters, { opacity: 0, y: 40 });
//   introTl.set(introText, { opacity: 0, y: 40 });
//   introTl.set(".intro__photo", { scale: 3, rotation: 15 });

  introTl.to(".intro__photo", {
    scale: 1,
    rotation: 4,
    duration: 1.2,
    ease: "power3.out",
  });

  introTl.to(
    firstLetters,
    {
      y: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: "power3.out",
    },
    "-=1"
  );

  introTl.to(
    lastLetters,
    {
      y: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: "power3.out",
    },
    "-=0.9"
  );

  introTl.to(
    subtitleLetters,
    {
      opacity: 1,
      y: 0,
      stagger: 0.03,
      duration: 0.8,
      ease: "power2.out",
    },
    "-=0.4"
  );
  introTl.to(
    introText,
    {
      opacity: 1,
      y: 0,
      stagger: 0.03,
      duration: 0.8,
      ease: "power2.out",
    },
    "-=0.4"
  );
  introTl.to(
    goScroll,
    {
      opacity: 1,
      y: 0,
      stagger: 0.03,
      duration: 0.8,
      ease: "power2.out",
    },
    "-=0.4"
  );

  setTimeout(() => introTl.play(), 300);

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
          {
            xPercent: -100,
            duration: 0.3 * stepDuration,
            ease: "power3.inOut",
          },
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
