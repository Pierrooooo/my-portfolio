export function renderHomeWorks() {
  const projects = [
    {
      title: "Tubik UX Dribbble",
      year: "2026",
      image: "/assets/tubik.jpg",
      url: "https://chicago-dribbble-9nel.vercel.app/",
      description: "Integration, Dribbble Design"
    },
    {
      title: "Nicolas CAILLET",
      year: "2026",
      image: "/assets/ncaillet.jpg",
      url: "https://testnico-ruby.vercel.app/",
      description: "Site Photographe"
    },
    {
      title: "La p'tite taverne",
      year: "2025",
      image: "/assets/tavern.jpg",
      url: "https://www.laptitetaverne.fr/",
      description: "Site Restaurant"
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
  const items = document.querySelectorAll('.home-works__item');
  
  items.forEach((item, index) => {
    item.addEventListener('click', (e) => {
      // Analytics tracking
      console.log(`Project clicked: ${index}`);
    });
  });
}

export function destroyHomeWorks() {
  const items = document.querySelectorAll('.home-works__item');
  items.forEach(item => {
    item.removeEventListener('mouseenter', () => {});
    item.removeEventListener('mouseleave', () => {});
    item.removeEventListener('click', () => {});
  });
}