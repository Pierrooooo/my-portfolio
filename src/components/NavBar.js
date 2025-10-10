import { navigateTo } from "../router.js";

class NavBar extends HTMLElement {
  constructor() {
    super();
    this.onRouteChange = this.onRouteChange.bind(this);
  }

  connectedCallback() {
    this.render();
    document.addEventListener("routeChange", this.onRouteChange);
  }

  disconnectedCallback() {
    document.removeEventListener("routeChange", this.onRouteChange);
  }

  onRouteChange() {
    this.render();
  }

  render() {
    const path = window.location.pathname;
    this.innerHTML = `
    <header class="site-header">
    <nav class="nav" aria-label="Navigation principale">
    <a href="/" data-link class="nav__link ${
        path === "/" ? "active" : ""
        }">Accueil</a>
    <a href="/sandbox" data-link class="nav__link ${
        path === "/sandbox" ? "active" : ""
        }">Sandbox</a>
    <a href="/works" data-link class="nav__link ${
        path === "/works" ? "active" : ""
        }">Works</a>
    </nav>
    </header>
`;
  }
}

customElements.define("nav-bar", NavBar);
