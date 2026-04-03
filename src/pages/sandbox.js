import { setPageClass } from "../router.js";

export function renderSandbox() {
  return `
    <section class="sandbox">
      <div class="sandbox__content">
        <div id="sandbox-display" class="sandbox__viewer">
          <p>Sélectionnez une catégorie ci-dessous 👇</p>
        </div>
      </div>

      <div class="sandbox__menu">
        <div class="menu-category" data-category="3d">
          <span>3D</span>
          <ul class="menu-list">
            <li>Wall-e</li>
            <li>Wave</li>
            <li>Immersive</li>
          </ul>
        </div>

        <div class="menu-category" data-category="scroll">
          <span>Scroll</span>
          <ul class="menu-list">
            <li>Parallax</li>
            <li>Pin Section</li>
            <li>Reveal Text</li>
          </ul>
        </div>

        <div class="menu-category" data-category="autres">
          <span>Autres</span>
          <ul class="menu-list">
            <li>Canvas</li>
            <li>Animation</li>
            <li>Expérience</li>
          </ul>
        </div>
      </div>
    </section>
  `;
}

/**
 * Initialise la sandbox
 * @param {Object} [options]
 * @param {string} [options.defaultCategory]
 * @param {string} [options.defaultItem]
 */
export function initSandbox(options = {}) {
  setPageClass("sandbox");

  const { defaultCategory, defaultItem } = options;
  const categories = document.querySelectorAll(".menu-category");
  const display = document.querySelector("#sandbox-display");

  categories.forEach((cat) => {
    const list = cat.querySelector(".menu-list");
    const trigger = cat.querySelector("span");

    trigger.addEventListener("click", () => {
      categories.forEach((c) => {
        if (c !== cat) c.querySelector(".menu-list").classList.remove("open");
      });
      list.classList.toggle("open");
    });

    list.querySelectorAll("li").forEach((item) => {
      item.addEventListener("click", async () => {
        const itemName = item.textContent.trim();
        const category = cat.dataset.category;
        list.classList.remove("open");
        await loadComponent(category, itemName, display);
      });
    });
  });

  if (defaultCategory && defaultItem) {
    loadComponent(defaultCategory, defaultItem, display);
  }
}

/**
 * Charge dynamiquement un composant
 * @param {string} category - catégorie (ex: "3d", "scroll", "autres")
 * @param {string} itemName - nom de l'item (ex: "Immersive", "Reveal Text")
 * @param {HTMLElement} container - conteneur d'affichage
 */
async function loadComponent(category, itemName, container) {
  container.innerHTML = `<div class="sandbox__viewer">Chargement de ${itemName}...</div>`;

  const fileName = itemName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-");

  const path = `../components/${category}/${fileName}.js`;

  try {
    const module = await import(path);
    if (
      typeof module[`init${capitalizeAndRemoveTiret(fileName)}`] === "function"
    ) {
      module[`init${capitalizeAndRemoveTiret(fileName)}`](container);
      let loadingText = container.querySelector(".sandbox__viewer");
      if (loadingText) {
        container.removeChild(loadingText);
      }
    } else if (typeof module.init === "function") {
      module.init(container);
    } else {
      container.innerHTML = `<p>${itemName}</p>`;
      console.warn(`⚠️ Aucun export init trouvé dans ${path}`);
    }
  } catch (err) {
    container.innerHTML = `<p>${itemName} en construction</p>`;
    console.warn(`❌ Impossible de charger ${path}`, err);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function capitalizeAndRemoveTiret(str) {
  // Supprime tous les tirets et capitalise chaque partie
  return str
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function destroySandbox() {}
