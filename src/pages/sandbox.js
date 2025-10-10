import { setPageClass } from "../router.js";
import gsap from "gsap";
import * as THREE from "three";
import { fadeUpText } from "../utils/gsapAnimations.js";
import ThreeScene from "../utils/threeScene.js";

let ctx;
let three;
let sphere;

export function renderSandbox() {
  return `
    <section class="sandbox">
      <h1 class="sandbox-title">Sandbox</h1>
      <div id="sandbox-container" class="three-container"></div>
    </section>
  `;
}

export function initSandbox() {
  setPageClass("sandbox");

  ctx = gsap.context(() => {
    fadeUpText(".sandbox-title");
    fadeUpText(".sandbox-subtitle", { delay: 0.2 });
  });

  const container = document.querySelector("#sandbox-container");

  three = new ThreeScene(container, (scene) => {
    const geometry = new THREE.SphereGeometry(0.8, 32, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff4488,
      roughness: 0.3,
      metalness: 0.6,
    });
    sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
  });

  three.start(() => {
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.015;
  });
}

export function destroySandbox() {
  ctx?.revert();
  three?.dispose();
}
