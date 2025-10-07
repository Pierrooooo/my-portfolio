// src/utils/threeScene.js
import * as THREE from "three";

export default class ThreeScene {
  constructor(container, setupCallback) {
    this.container = container;
    this.width = container.clientWidth;
    this.height = container.clientHeight;

    // === Base ===
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    this.camera.position.set(0, 0, 3);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // === Lumière basique ===
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    this.scene.add(light);

    // === Callback custom ===
    if (setupCallback && typeof setupCallback === "function") {
      setupCallback(this.scene, this.camera, this.renderer);
    }

    // === Resize + RAF ===
    this._onResize = this.onResize.bind(this);
    window.addEventListener("resize", this._onResize);
    this._running = false;
  }

  // === Start animation loop ===
  start(updateCallback) {
    if (this._running) return;
    this._running = true;

    const loop = () => {
      if (!this._running) return;

      // User-defined update (ex: rotate cube)
      if (updateCallback && typeof updateCallback === "function") {
        updateCallback();
      }

      this.renderer.render(this.scene, this.camera);
      this._raf = requestAnimationFrame(loop);
    };

    this._raf = requestAnimationFrame(loop);
  }

  // === Stop ===
  stop() {
    this._running = false;
    cancelAnimationFrame(this._raf);
  }

  // === Resize ===
  onResize() {
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  // === Dispose ===
  dispose() {
    this.stop();
    window.removeEventListener("resize", this._onResize);

    this.scene.traverse(obj => {
      if (obj.isMesh) {
        obj.geometry?.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
          else obj.material.dispose();
        }
      }
    });

    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}
