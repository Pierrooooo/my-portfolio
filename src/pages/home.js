import gsap from "gsap";
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
      <h1 class="works-title">Works</h1>
      <div id="three-container" class="three-container"></div>
    </section>
  `;
}

export function initHome() {
  ctx = gsap.context(() => {});

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
