import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

import statueURL from "/assets/3D/immersive/statue.obj?url";
import landscapeURL from "/assets/3D/immersive/landscape.obj?url";
import marbleBlue from "/assets/3D/immersive/marble-bleu.jpg";

export function initImmersive(container) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x110000);

  const camera = new THREE.PerspectiveCamera(
    115,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 7, 12);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth , window.innerHeight - 56);
  container.appendChild(renderer.domElement);

  // Lumières
  scene.add(new THREE.AmbientLight(0xffffff, 1));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(5, 10, 7.5);
  scene.add(dirLight);

  // HDRI
  const rgbeLoader = new RGBELoader();
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  rgbeLoader.load("/assets/3D/immersive/HDR_multi_nebulae.hdr", (texture) => {
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    scene.environment = envMap;
    scene.background = envMap;
    texture.dispose();
    pmremGenerator.dispose();
  });

  // Matériaux
  const textureLoader = new THREE.TextureLoader();
  const marbleBlueTexture = textureLoader.load(marbleBlue);

  const marbleMaterial = new THREE.MeshStandardMaterial({
    map: marbleBlueTexture,
    metalness: 1,
    roughness: 0.8,
  });

  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
  });

  // === Particules ===
  const particlesCount = 300;
  const positions = new Float32Array(particlesCount * 3);
  const speeds = new Float32Array(particlesCount);
  const phases = new Float32Array(particlesCount);

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    speeds[i] = 0.3 + Math.random() * 0.2;
    phases[i] = Math.random() * Math.PI * 2;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  function createCircleTexture() {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.15,
    map: createCircleTexture(),
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, particleMaterial);
  scene.add(particles);

  // === Contrôles ===
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = false;
  controls.enableZoom = false;

  // === Chargement des modèles ===
  const objLoader = new OBJLoader();

  objLoader.load(statueURL, (obj) => {
    obj.scale.set(0.03, 0.03, 0.03);
    obj.traverse((c) => (c.isMesh ? (c.material = marbleMaterial) : null));
    scene.add(obj);
  });

  objLoader.load(landscapeURL, (obj) => {
    obj.scale.set(100, 100, 100);
    obj.position.set(-10, -10, 0);
    obj.traverse((c) => (c.isMesh ? (c.material = material) : null));
    scene.add(obj);
  });

  // === Animation ===
  let targetX = 0,
    targetY = 0,
    mouseX = 0,
    mouseY = 0;

  window.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth)  - 1;
    targetY = -(e.clientY / window.innerHeight) + 1;
  });

  window.addEventListener("resize", () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  });

  function animate() {
    requestAnimationFrame(animate);

    mouseX += (targetX - mouseX) * 0.05;
    mouseY += (targetY - mouseY) * 0.05;

    const parallax = 3;
    controls.target.x = mouseX * parallax;
    controls.target.y = mouseY * parallax;

    const camStrength = 0.5;
    camera.position.x = mouseX * camStrength;
    camera.position.y = 7 + mouseY * camStrength;

    const posAttr = geometry.getAttribute("position");
    const time = performance.now() * 0.001;

    for (let i = 0; i < particlesCount; i++) {
      posAttr.array[i * 3 + 0] += Math.sin(time * speeds[i] + phases[i]) * 0.05;
      posAttr.array[i * 3 + 1] += Math.sin(time * speeds[i] + phases[i]) * 0.05;
    }

    posAttr.needsUpdate = true;
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  return () => {
    container.innerHTML = "";
    renderer.dispose();
  };
}
