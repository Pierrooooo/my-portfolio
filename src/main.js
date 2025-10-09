import "./styles/styles.scss";
import "./components/NavBar.js";
import "./components/Footer.js";
import { initRouter } from "./router.js";
import { initSmoothScroll } from "./utils/smoothScroll.js";

window.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initRouter();
});

document.querySelector("#app").innerHTML = `
  <div>
    <h1>Hello Vite!</h1>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
  <site-footer></site-footer>
`;
