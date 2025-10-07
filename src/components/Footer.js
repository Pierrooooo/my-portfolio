class Footer extends HTMLElement {
connectedCallback() {
this.render();
document.addEventListener('routeChange', () => this.render());
}


render() {
const path = window.location.pathname;
const year = new Date().getFullYear();
const message = path === '/works'
? "Envie de collaborer ? Contacte-moi 👋"
: "Merci de ta visite — à bientôt 👋";


this.innerHTML = `
<footer class="site-footer">
<p>FOOTER</p>
<div class="container">
<p>${message}</p>
<small>© ${year} — Mon Portfolio</small>
</div>
</footer>
`;
}
}


customElements.define('site-footer', Footer);