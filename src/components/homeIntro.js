import gsap from "gsap";

export function renderHomeIntro() {
  return `
    <div class="intro">
      <h1 class="intro__title">
        <span class="intro__firstname">Pierre</span>
        <span class="intro__photo">
          <img src="assets/me.jpg" alt="Pierre Caillet">
        </span>
        <span class="intro__lastname">CAILLET</span>
      </h1>

      <h2 class="intro__subtitle">
        FRONT END<br>DEVELOPPEUR
      </h2>

      <p class="intro__text">
        J’ai pour but de devenir Creative Front End Developpeur, ce qui signifie qu’à terme je souhaite créer non seulement des sites web élégants, UX friendly, mais aussi des expériences qui sortent de l’ordinaire.
      </p>

      <div class="go-scroll"><span></span></div>
    </div>
  `;
}

export function initHomeIntro() {
  function splitTextToSpans(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      const text = el.innerText;
      const letters = text.split("");
      el.innerHTML = letters
        .map((letter) => `<span>${letter === " " ? "&nbsp;" : letter}</span>`)
        .join("");
    });
  }

  splitTextToSpans(".intro__firstname");
  splitTextToSpans(".intro__lastname");
  splitTextToSpans(".intro__subtitle");

  const introTl = gsap.timeline({ delay: 0.3, paused: true });

  const firstLetters = document.querySelectorAll(".intro__firstname span");
  const lastLetters = document.querySelectorAll(".intro__lastname span");
  const subtitleLetters = document.querySelectorAll(".intro__subtitle span");
  const introText = document.querySelectorAll(".intro__text");
  const goScroll = document.querySelectorAll(".go-scroll");

  introTl.to(".intro__photo", {
    scale: 1,
    rotation: 4,
    duration: 1.2,
    ease: "power3.out",
  });

  introTl.to(
    firstLetters,
    {
      y: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: "power3.out",
    },
    "-=1"
  );

  introTl.to(
    lastLetters,
    {
      y: 0,
      stagger: 0.05,
      duration: 0.6,
      ease: "power3.out",
    },
    "-=0.9"
  );

  introTl.to(
    [subtitleLetters, introText, goScroll],
    {
      opacity: 1,
      y: 0,
      stagger: 0.03,
      duration: 0.8,
      ease: "power2.out",
    },
    "-=0.4"
  );

  setTimeout(() => introTl.play(), 300);
}
