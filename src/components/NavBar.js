import { navigateTo } from "../router.js";

class NavBar extends HTMLElement {
  constructor() {
    super();
    this.toggleMenu = this.toggleMenu.bind(this);
    this.onRouteChange = this.onRouteChange.bind(this);
  }

  connectedCallback() {
    this.render();
    document.addEventListener("routeChange", this.onRouteChange);

    const burger = this.querySelector(".burger-btn");
    const overlay = this.querySelector(".overlay");

    // burger.addEventListener("click", this.toggleMenu);
    // overlay.addEventListener("click", this.toggleMenu);

    this.querySelectorAll("nav a").forEach(link =>
      link.addEventListener("click", () => this.closeMenu())
    );

    this.querySelectorAll("nav a").forEach(link => {
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
    this.classList.toggle("menu-open");
  }

  closeMenu() {
    this.classList.remove("menu-open");
  }

  render() {
    const path = window.location.pathname;

    this.innerHTML = `
      <div class="site-header">

        <nav class="main-nav" aria-label="Navigation principale">
          <a href="/" data-link class="${path === "/" ? "active" : ""}">Pierre CAILLET</a>
        </nav>

      </div>
    `;
  }
}

customElements.define("nav-bar", NavBar);
