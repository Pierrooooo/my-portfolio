import "./styles/styles.scss";
import "./components/NavBar.js";
import "./components/Footer.js";
import { initRouter, setCursorInstance } from "./router.js";
import { initSmoothScroll } from "./utils/smoothScroll.js";
import { initCustomCursor } from "./components/CustomCursor.js";

window.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();

  const cursor = initCustomCursor();
  setCursorInstance(cursor);

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

console.log(`
______ _                     
| ___ (_)                    
| |_/ /_  ___ _ __ _ __ ____
|  __/| |/ _  | '__| '__/ _ | 
| |   | |  __/ |  | | | (_) |
|_|   |_|____|_|  |_| |____/

https://github.com/Pierrooooo
`);