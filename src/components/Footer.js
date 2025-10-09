class Footer extends HTMLElement {
  connectedCallback() {
    this.render();
    document.addEventListener("routeChange", () => this.render());
  }

  render() {
    const path = window.location.pathname;
    const year = new Date().getFullYear();
    this.innerHTML = `
    <footer class="site-footer">
        <p class="footer-title">PIERRE CAILLET</p>
        <div class="container">
            <p>${message}</p>
        <small>© ${year} — Mon Portfolio</small>
        </div>
    </footer>
    `;
  }
}

customElements.define("site-footer", Footer);
