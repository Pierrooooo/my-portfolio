import { setPageClass } from "../router.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import ThreeScene from "../utils/threeScene.js";

import { renderHomeIntro, initHomeIntro } from "../components/homeIntro.js";
import { renderHomeWorks, initHomeWorks } from "../components/homeWorks.js";

let ctx;
let three;
let plane;
let time = 0;

export function renderHome() {
  return `
    <section class="home">
      ${renderHomeIntro()}
      ${renderHomeWorks()}
    </section>
  `;
}

export function initHome() {
  setPageClass("home");
  gsap.registerPlugin(ScrollTrigger);

  initHomeIntro();

  ctx = gsap.context(() => {
    initHomeWorks();
  });

  let container = document.querySelector("#three-container");
  
  if (!container) {
    container = document.createElement("div");
    container.id = "three-container";
    container.className = "three-container";
    document.body.prepend(container);
  }

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
  
  const container = document.querySelector("#three-container");
  if (container) {
    container.remove();
  }
}