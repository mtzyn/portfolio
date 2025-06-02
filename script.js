(() => {
  // Configuración de fondo de ondas (p5.js)
  let cfg = {
    layers: 3,
    baseAmp: 70,
    baseSpeed: 0.015,
    maxStroke: 6,
  };
  let phase = 0;

  window.setup = function() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    strokeCap(ROUND);
  };

  window.draw = function() {
    // Detectar modo claro/oscuro en el body
    const isLight = document.body.classList.contains('light-theme');
    // Fondo según el tema
    if (isLight) {
      background(255); // blanco modo claro
    } else {
      background(17);  // #111 modo oscuro
    }

    // Dibuja las ondas con color de línea según tema
    for (let layer = 0; layer < cfg.layers; layer++) {
      const alpha = 90 - layer * 25;
      const strokeW = cfg.maxStroke - layer * 2;
      const amp = cfg.baseAmp - layer * 12;

      if (isLight) {
        stroke(0, alpha);    // negro modo claro
      } else {
        stroke(255, alpha);  // blanco modo oscuro
      }
      strokeWeight(strokeW);
      noFill();
      beginShape();
      for (let x = 0; x <= width; x += 4) {
        const theta = phase + x * 0.015 + layer;
        const y = height / 2 + sin(theta) * amp;
        vertex(x, y);
      }
      endShape();
    }
    phase += cfg.baseSpeed;
  };

  window.windowResized = function() {
    resizeCanvas(windowWidth, windowHeight);
  };

  // ---- Lógica de UI/menú y navegación ----

  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'light');
  }

  let bgStyle = localStorage.getItem('bgStyle') || "lines"; // no se usa pero se conserva por compatibilidad
  let particles = []; // no se usa

  const themeToggle = document.getElementById('theme-toggle');
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.textContent = 'Modo Oscuro';
  } else {
    themeToggle.textContent = 'Modo Claro';
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Animación de header y enlaces
    gsap.from("header", { duration: 1, y: -50, opacity: 0, ease: "power2.out" });
    gsap.from(".nav-links li", { duration: 1, y: -20, opacity: 0, stagger: 0.1, delay: 0.5 });

    const menuToggle = document.querySelector('.menu-toggle');
    const navContent = document.querySelector('.nav-content');
    const backdrop = document.querySelector('.nav-backdrop');

    // --- Animación GSAP al abrir el menú móvil ---
    const navTl = gsap.timeline({ paused: true, defaults: { ease: "power2.out" } });
    navTl
      .from(".nav-links a", { y: 60, opacity: 0, stagger: 0.08 })
      .from(".nav-controls button", { y: 40, opacity: 0, stagger: 0.1 }, "<");

    // Evento para abrir/cerrar menú móvil con animación
    menuToggle.addEventListener('click', () => {
      const isOpen = navContent.classList.toggle('active');
      menuToggle.classList.toggle('active', isOpen);
      document.body.classList.toggle('nav-open', isOpen);

      if (isOpen) {
        navTl.restart();
      } else {
        navTl.reverse();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        navContent.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    }

    // Smooth scroll en los enlaces del menú
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetEl = document.getElementById(targetId);
        gsap.to(window, { duration: 1, scrollTo: { y: targetEl.offsetTop - 70 } });
        // Cerrar menú al hacer clic en un enlace
        navContent.classList.remove('active');
        menuToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
      });
    });

    // Botón de alternar tema
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      themeToggle.textContent = isLight ? 'Modo Oscuro' : 'Modo Claro';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });

    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sectionMap = {};
    navLinks.forEach(link => {
      const id = link.getAttribute('href').slice(1);
      sectionMap[id] = link;
    });

    // Observador para animar secciones en scroll
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // marcar enlace activo
          navLinks.forEach(l => l.classList.remove('active'));
          const activeLink = sectionMap[entry.target.id];
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { threshold: 0.2 });
    sections.forEach(section => observer.observe(section));
  });
})();