import { navigateTo } from "../router.js";

class NavBar extends HTMLElement {
  constructor() {
    super();
    this.onRouteChange = this.onRouteChange.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  connectedCallback() {
    this.render();
    document.addEventListener("routeChange", this.onRouteChange);

    this.querySelector(".burger-btn").addEventListener("click", this.toggleMenu);
    this.querySelector(".overlay").addEventListener("click", this.toggleMenu);
    this.querySelectorAll(".fullscreen-menu a").forEach(link =>
      link.addEventListener("click", () => this.closeMenu())
    );

    this.querySelectorAll(".fullscreen-menu a").forEach(link => {
      const text = link.textContent.trim();
      link.innerHTML = text
        .split("")
        .map(
          (char, i) =>
            `<span class="letter" style="--i:${i}">${
              char === " " ? "&nbsp;" : char
            }</span>`
        )
        .join("");
    });
  }

  disconnectedCallback() {
    document.removeEventListener("routeChange", this.onRouteChange);
  }

  onRouteChange() {
    this.render();
  }

  toggleMenu() {
    const menu = this.querySelector(".fullscreen-menu");
    const overlay = this.querySelector(".overlay");
    const burger = this.querySelector(".burger-btn");
    menu.classList.toggle("open");
    overlay.classList.toggle("open");
    burger.classList.toggle("open");
  }

  closeMenu() {
    const menu = this.querySelector(".fullscreen-menu");
    const overlay = this.querySelector(".overlay");
    const burger = this.querySelector(".burger-btn");
    menu.classList.remove("open");
    overlay.classList.remove("open");
    burger.classList.remove("open");
  }

  render() {
    const path = window.location.pathname;
    this.innerHTML = `
      <div class="site-header">
        <div class="burger-btn">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav class="nav" aria-label="Navigation principale">
          <a href="/" data-link class="nav__link ${path === "/" ? "active" : ""}">Accueil</a>
          <a href="/sandbox" data-link class="nav__link ${path === "/sandbox" ? "active" : ""}">Sandbox</a>
          <a href="/works" data-link class="nav__link ${path === "/works" ? "active" : ""}">Works</a>
        </nav>

        <div class="fullscreen-menu">
          <a href="/" data-link class="${path === "/" ? "active" : ""}">Accueil</a>
          <a href="/sandbox" data-link class="${path === "/sandbox" ? "active" : ""}">Sandbox</a>
          <a href="/works" data-link class="${path === "/works" ? "active" : ""}">Works</a>
        </div>

        <div class="overlay"></div>
      </div>
    `;
  }
}

customElements.define("nav-bar", NavBar);
