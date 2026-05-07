import gsap from "gsap";

export function renderHomeIntro() {
  return `
    <div class="home-intro">
      <div class="home-intro__content">
        <div class="home-intro__main">
          <div class="home-intro__left">
            <h1 class="home-intro__description">Developpeur web</h1>
            <p class="home-intro__title">
              <span data-cursor-text="Développeur Front End junior qui souhaite faire ses preuves sur des projets sobres comme créatifs">Développeur Front End</span>
              <span data-cursor-text="J'ai 1.5 an d'expérience en tant que développeur de thème shopify">Shopify E commerce</span>
              <span data-cursor-text="Je donne vie à votre business / association via un site vitrine">Site Vitrine</span>
              <span data-cursor-text="Je réalise des audits de sites web Seo - UX">Audit</span>
            </p>
          </div>
          <div class="home-intro__right">
            <div class="home-intro__image">
              <img src="/assets/photo-of-myself.jpeg" alt="Pierre CAILLET">
            </div>
            <a data-cursor-text="email" href="mailto:pierre.caillet@ik.me" class="home-intro__button" aria-label="Me contacter par email">
            <span class="texte">Me contacter</span>
            <span class="background"></span>
            </a>
          </div>
        </div>

        <p class="home-intro__meta"><span>Basé à Paris</span><span id="paris-time"></span></p>
        <div class="home-intro__name">
          <img src="/assets/pierrecaillet.png" alt="Pierre CAILLET">
        </div>
        <div class="home-intro__name--mobile">
          <img src="/assets/pierrecaillet-mobile.png" alt="Pierre CAILLET">
        </div>
      </div>
    </div>
  `;
}

function updateParisTime() {
  const el = document.getElementById("paris-time");
  if (!el) return;

  const now = new Date();
  const time = now.toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
  });

  el.textContent = time;
}

export function initHomeIntro() {
  updateParisTime();
  setInterval(updateParisTime, 1000);

  animateHomeIntro();
}

function animateHomeIntro() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  gsap.set(".home-intro__content", { autoAlpha: 0 });
  gsap.set(".home-intro__description", { y: 30, autoAlpha: 0 });
  gsap.set(".home-intro__title span", { y: 20, autoAlpha: 0 });
  gsap.set(".home-intro__button", { y: 16, autoAlpha: 0 });
  gsap.set(".home-intro__image", {
    clipPath: "inset(100% 0% 0% 0%)",
    autoAlpha: 1,
  });
  gsap.set(".home-intro__image img", { scale: 1.5 });
  gsap.set(".home-intro__meta span", { y: 10, autoAlpha: 0 });
  gsap.set([".home-intro__name", ".home-intro__name--mobile"], {
    y: 24,
    autoAlpha: 0,
  });

  tl.to(".home-intro__content", {
    autoAlpha: 1,
    duration: 0.1,
  });

  tl.to(
    ".home-intro__description",
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.7,
    },
    0.1,
  );

  tl.to(
    ".home-intro__title span",
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.55,
      stagger: 0.12,
    },
    0.3,
  );

  tl.to(
    ".home-intro__image",
    {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 0.4,
      ease: "power4.inOut",
    },
    0.5,
  );

  tl.to(
    ".home-intro__button",
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.5,
    },
    0.55,
  );

  tl.to(
    ".home-intro__image img",
    {
      scale: 1.1,
      duration: 1.1,
      ease: "power3.out",
    },
    0.5,
  );

  tl.to(
    ".home-intro__meta span",
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.45,
      stagger: 0.12,
      ease: "power2.out",
    },
    0.85,
  );

  // 7. Le grand nom en bas glisse vers le haut — point final de la séquence
  tl.to(
    [".home-intro__name", ".home-intro__name--mobile"],
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.75,
      ease: "power3.out",
    },
    0.95,
  );

  return tl;
}
