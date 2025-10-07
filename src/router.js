// src/router.js
import { renderHome, initHome, destroyHome } from "./pages/home.js";
import { renderWorks, initWorks, destroyWorks } from "./pages/works.js";
import { renderSandbox, initSandbox, destroySandbox } from "./pages/sandbox.js"; // if it exists

let currentPage = null;

// Define routes as objects { render, init, destroy }
const routes = {
  "/": { render: renderHome, init: initHome, destroy: destroyHome },
  "/works": { render: renderWorks, init: initWorks, destroy: destroyWorks },
  "/sandbox": {
    render: renderSandbox,
    init: initSandbox,
    destroy: destroySandbox,
  },
};

// Render the correct route
export function renderRoute() {
  const path = window.location.pathname;
  const route = routes[path] || routes["/"];

  // Clean up previous page
  if (currentPage && currentPage.destroy) currentPage.destroy();

  // Inject HTML
  const app = document.querySelector("#app");
  app.innerHTML = route.render();

  // Initialize new page
  route.init();
  currentPage = route;
}

// Navigate without reloading
export function navigateTo(path) {
  window.history.pushState({}, "", path);
  renderRoute();
}

// Initialize router and handle <a data-link> clicks
export function initRouter() {
  document.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.getAttribute("href"));
    }
  });

  window.addEventListener("popstate", renderRoute);
  renderRoute();
}
