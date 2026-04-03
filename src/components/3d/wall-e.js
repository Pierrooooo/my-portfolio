import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import wall_e from "/assets/3D/wall-e/wall_e.glb?url";

export function initWallE(container) {
  container.innerHTML = `
    <section class="canvas-section">
      <canvas id="canvas-regular"></canvas>
      <canvas id="canvas-wireframe"></canvas>
    </section>
  `;

  const canvasSection = container.querySelector('.canvas-section');
  
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Regular Canvas
  const canvasRegular = document.getElementById("canvas-regular");
  const rendererRegular = new THREE.WebGLRenderer({ 
    canvas: canvasRegular, 
    antialias: true 
  });
  rendererRegular.setSize(width, height);

  const sceneRegular = new THREE.Scene();
  sceneRegular.background = new THREE.Color(0xffffffde);

  const camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 1000);
  camera.position.set(8, 7, 10);

  const controls = new OrbitControls(camera, rendererRegular.domElement);
  controls.enableRotate = false;
  controls.enableZoom = false;

  sceneRegular.add(new THREE.AmbientLight(0xffffff, 1));

  let modelRegular;
  const gltfLoader = new GLTFLoader();
  
  gltfLoader.load(wall_e, (gltf) => {
    modelRegular = gltf.scene;
    modelRegular.scale.set(2, 2, 2);
    modelRegular.position.set(0, -5, 0);
    sceneRegular.add(modelRegular);
  });

  // Wireframe Canvas
  const canvasWire = document.getElementById("canvas-wireframe");
  const rendererWire = new THREE.WebGLRenderer({ 
    canvas: canvasWire, 
    antialias: true, 
    alpha: true 
  });
  rendererWire.setSize(width, height);

  const sceneWire = new THREE.Scene();
  sceneWire.background = new THREE.Color(0x0a0a0a);
  sceneWire.add(new THREE.AmbientLight(0xffffff, 1));

  let modelWire;
  gltfLoader.load(wall_e, (gltf) => {
    modelWire = gltf.scene;
    modelWire.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshBasicMaterial({
          color: 0xffffff,
          wireframe: true,
        });
      }
    });
    modelWire.scale.set(2, 2, 2);
    modelWire.position.set(0, -5, 0);
    sceneWire.add(modelWire);
  });

  const handleResize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    rendererRegular.setSize(w, h);
    rendererWire.setSize(w, h);
  };

  window.addEventListener("resize", handleResize);

  let lastMouseMove = Date.now();
  let clipRatio = 0;
  let direction = 1;

  const handleMouseMove = (e) => {
    lastMouseMove = Date.now();
    const rect = canvasSection.getBoundingClientRect();
    clipRatio = (e.clientX - rect.left) / rect.width;
    updateClipPath(clipRatio);
  };

  canvasSection.addEventListener("mousemove", handleMouseMove);

  function updateClipPath(ratio) {
    const percent = Math.max(0, Math.min(1, ratio)) * 100;
    canvasWire.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
  }

  function animate() {
    requestAnimationFrame(animate);
    controls.update();

    if (modelRegular) modelRegular.rotation.y += 0.001;
    if (modelWire) modelWire.rotation.y += 0.001;

    const now = Date.now();
    if (now - lastMouseMove > 1000) {
      clipRatio += direction * (1 / 480);
      if (clipRatio >= 1) {
        clipRatio = 1;
        direction = -1;
      } else if (clipRatio <= 0) {
        clipRatio = 0;
        direction = 1;
      }
      updateClipPath(clipRatio);
    }

    rendererRegular.render(sceneRegular, camera);
    rendererWire.render(sceneWire, camera);
  }

  animate();

  return () => {
    window.removeEventListener("resize", handleResize);
    canvasSection.removeEventListener("mousemove", handleMouseMove);
    
    if (rendererRegular) rendererRegular.dispose();
    if (rendererWire) rendererWire.dispose();
    
    // Nettoyer les scènes
    while(sceneRegular.children.length > 0) { 
      sceneRegular.remove(sceneRegular.children[0]); 
    }
    while(sceneWire.children.length > 0) { 
      sceneWire.remove(sceneWire.children[0]); 
    }
  };
}