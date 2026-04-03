class Footer extends HTMLElement {
  connectedCallback() {
    this.render();

    requestAnimationFrame(() => {
      const spans = this.querySelectorAll(".footer_title span");
      spans.forEach((el) => {
        const letters = el.textContent.split("");
        el.innerHTML = letters
          .map(
            (l, i) =>
              `<b style="animation-delay:${i * 0.008}s">${
                l === " " ? "&nbsp;" : l
              }</b>`
          )
          .join("");
      });
    });
  }

  render() {
    const path = window.location.pathname;

    this.innerHTML = `
      <footer class="site-footer">
        <p class="footer_title">
          <span>Pierre CAILLET</span>
          <span>Front End Dev</span>
          <span>Creative Dev</span>
        </p>

        <div class="footer_lists">

          <div class="footer_list">
            <ul class="footer_social_list_links">
              <li class="footer_list_link">
                <a href="https://www.linkedin.com/in/pierre-caillet-447b8a203/" target="_blank" class="footer_list_link">Linkedin</a>
              </li>
              <li class="footer_list_link">
                <a href="https://github.com/Pierrooooo" target="_blank" class="footer_list_link">GitHub</a>
              </li>
            </ul>
          </div>
        </div>

        <p class="footer_bottom_text">8PIER.RE</p>
      </footer>
    `;
  }
}

customElements.define("site-footer", Footer);
