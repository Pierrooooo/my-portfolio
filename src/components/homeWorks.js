import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";
import { splitText } from "../utils/splitText";

export function renderHomeWorks() {
  const projects = [
    // {
    //   title: "Tubik UX Dribbble",
    //   year: "2026",
    //   image: "/assets/tubik.jpg",
    //   url: "https://tubik.8pier.re",
    //   description: "Integration, Dribbble Design"
    // },
    {
      title: "Nicolas CAILLET",
      year: "2026",
      image: "/assets/ncaillet.jpg",
      url: "https://nico-portfolio.8pier.re/",
      description: "Site Photographe"
    },
    {
      title: "La p'tite taverne",
      year: "2025",
      image: "/assets/tavern.jpg",
      url: "https://laptitetaverne.fr/",
      description: "Site Restaurant"
    },
    {
      title: "Kiffeur ou Kiffher",
      year: "2024",
      image: "/assets/kiffeur.jpg",
      url: "https://kiffeur.8pier.re",
      description: "Dev Test"
    },
    {
      title: "Things",
      year: "2024",
      image: "/assets/things.jpg",
      url: "https://things.8pier.re",
      description: "Dev Test"
    },
    {
      title: "Intersection Observer API",
      year: "2024",
      image: "/assets/io-api.jpg",
      url: "https://io-api.8pier.re/",
      description: "Dev Test"
    },
  ];

  return `
    <section class="home-works">
      <div class="home-works__grid">
        ${projects.map((project, index) => `
          <a 
            href="${project.url}" 
            class="home-works__item" 
            target="_blank"
            rel="noopener noreferrer"
            data-project="${index}"
          >
            <div class="home-works__image" style="background-image: url('${project.image}')"></div>
            <div class="home-works__content">
              <span class="home-works__year">${project.year}</span>
              <h3 class="home-works__title">${project.title}</h3>
              <p class="home-works__description">${project.description}</p>
            </div>
          </a>
        `).join('')}
      </div>
    </section>
  `;
}

export function initHomeWorks() {
  gsap.registerPlugin(ScrollTrigger);
  
  const items = document.querySelectorAll('.home-works__item');
  
  items.forEach((item, index) => {
    const yearEl = item.querySelector('.home-works__year');
    const titleEl = item.querySelector('.home-works__title');
    const descEl = item.querySelector('.home-works__description');
    const imageEl = item.querySelector('.home-works__image');
    
    const splitResult = splitText(titleEl, { 
      type: 'words, letters',
      letterClass: 'title-letter',
      wordClass: 'title-word'
    });
    
    const titleSpans = splitResult.letters || splitResult.words || [];
    
    gsap.set([yearEl, descEl, imageEl], {
      opacity: 0,
      y: 40
    });
    
    gsap.set(titleSpans, {
      opacity: 0,
      y: 70,
      rotateX: -90,
      transformOrigin: "top center"
    });
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: "top 85%",
        end: "top 60%",
        toggleActions: "play none none reverse",
      }
    });
    
    tl
      .to(titleSpans, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.5,
        stagger: {
          amount: 0.4,
          from: "start",
          ease: "power2.out"
        },
        ease: "back.out(0.4)"
      })
      .to(descEl, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.2")
      .to(imageEl, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "back.out(0.6)"
      }, "-=0.2")
      .to(yearEl, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.3");
    
    item.addEventListener('click', (e) => {
      console.log(`Project clicked: ${index}`);
    });
  });
  
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 100);
}

export function destroyHomeWorks() {
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.trigger && trigger.vars.trigger.closest('.home-works__item')) {
      trigger.kill();
    }
  });
  
  const items = document.querySelectorAll('.home-works__item');
  items.forEach(item => {
    item.removeEventListener('click', () => {});
  });
}