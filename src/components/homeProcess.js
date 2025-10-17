import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function renderHomeProcess() {
  return `
    <section class="process" id="process">
      <div class="process-inner">

        <div class="process-step" data-step="1">
          <div class="texts">
            <h2><span>Rencontre</span></h2>
            <h3><span>Discutons</span></h3>
            <p><span>Dans un premier temps il m’est important de vous rencontrer pour que nous discutions de votre projet et de vos besoins.</span></p>
          </div>
          <img src="assets/meet.avif" alt="Rencontre">
        </div>

        <div class="process-step" data-step="2">
          <div class="texts">
            <h2><span>Design</span></h2>
            <h3><span>Prototype</span></h3>
            <p><span>La réalisation de votre maquette est une étape importante pour visualiser le rendu final de votre site.</span></p>
          </div>
          <img src="assets/figma.avif" alt="Design">
        </div>

        <div class="process-step" data-step="3">
          <div class="texts">
            <h2><span>Développement</span></h2>
            <h3><span>Réalisation</span></h3>
            <p><span>Finalisation du projet pendant laquelle je développe le site et prépare la mise en ligne.</span></p>
          </div>
          <img src="assets/dev.avif" alt="Développement">
        </div>

      </div>
    </section>
  `;
}

export function initHomeProcess() {
  gsap.registerPlugin(ScrollTrigger);

  function splitTextToSpans(selector) {
    document.querySelectorAll(selector).forEach((el) => {
      const text = el.innerText;
      const letters = text.split("");
      el.innerHTML = letters
        .map((letter) => `<span>${letter === " " ? "&nbsp;" : letter}</span>`)
        .join("");
    });
  }

  splitTextToSpans(".process-step h2 span, .process-step h3 span");

  const stepsContainer = document.querySelector(".process-inner");
  const steps = gsap.utils.toArray(".process-step");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: stepsContainer,
      start: "top top",
      end: "+=" + window.innerHeight * steps.length * steps.length,
      scrub: true,
      pin: true,
    },
  });

  const stepDuration = 1.5;

  steps.forEach((step) => {
    const titleLetters = step.querySelectorAll("h2 span span, h3 span span");
    const paragraph = step.querySelector("p span");
    const img = step.querySelector("img");

    gsap.set(step, { autoAlpha: 0 });
    gsap.set(titleLetters, { yPercent: 100, opacity: 0 });
    gsap.set(paragraph, { yPercent: 100, opacity: 0 });
    gsap.set(img, { xPercent: 100 });

    tl.to(step, { autoAlpha: 1, duration: 0.1 })
      .to(
        titleLetters,
        {
          yPercent: 0,
          opacity: 1,
          stagger: 0.005,
          duration: 0.25 * stepDuration,
          ease: "power3.out",
        },
        "<"
      )
      .to(
        paragraph,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.25 * stepDuration,
          ease: "power3.out",
        },
        "<0.1"
      )
      .to(
        img,
        { xPercent: 0, duration: 0.3 * stepDuration, ease: "power3.out" },
        "<0.2"
      )
      .to(
        titleLetters,
        {
          yPercent: -100,
          opacity: 0,
          stagger: 0.005,
          duration: 0.2 * stepDuration,
          ease: "power3.in",
        },
        "+=0.2"
      )
      .to(
        paragraph,
        {
          yPercent: -100,
          opacity: 0,
          duration: 0.2 * stepDuration,
          ease: "power3.in",
        },
        "<"
      )
      .to(
        img,
        {
          xPercent: -100,
          duration: 0.3 * stepDuration,
          ease: "power3.inOut",
        },
        "<"
      )
      .to(step, { autoAlpha: 0, duration: 0.1 });
  });

  setTimeout(() => ScrollTrigger.refresh(), 200);
}
