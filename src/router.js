import { renderHome, initHome, destroyHome } from "./pages/home.js";
import { renderWorks, initWorks, destroyWorks } from "./pages/works.js";
import { renderSandbox, initSandbox, destroySandbox } from "./pages/sandbox.js"; // if it exists

let currentPage = null;

const routes = {
  "/": { render: renderHome, init: initHome, destroy: destroyHome },
  "/works": { render: renderWorks, init: initWorks, destroy: destroyWorks },
  "/sandbox": {
    render: renderSandbox,
    init: initSandbox,
    destroy: destroySandbox,
  },
};

export function renderRoute() {
  const path = window.location.pathname;
  const route = routes[path] || routes["/"];

  if (currentPage && currentPage.destroy) currentPage.destroy();

  const app = document.querySelector("#app");
  app.innerHTML = route.render();

  route.init();
  currentPage = route;
}

export function setPageClass(pageName) {
  document.body.className = "";
  document.body.classList.add(`${pageName}_page`);
}

export function navigateTo(path) {
  window.history.pushState({}, "", path);
  renderRoute();
}

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
