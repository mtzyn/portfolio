/*
  Código modular con IIFE para encapsular:
  - Animaciones de fondo con p5.js.
  - Interacciones de la UI (menú, scroll suave, cambio de tema y fondo).
  - Se ha eliminado el sistema de filtrado y el formulario de contacto, ya que ahora se muestran datos fijos.
*/
(() => {
  // Variables globales para el fondo y partículas
  let bgStyle = localStorage.getItem('bgStyle') || "particles";
  let particles = [];
  
  // Preferencia de tema
  const themeToggle = document.getElementById('theme-toggle');
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.textContent = 'Modo Oscuro';
  }
  
  // p5.js: Fondo y partículas
  class Particle {
    constructor() {
      this.x = random(width);
      this.y = random(height);
      this.size = random(2, 6);
      this.speedX = random(-1, 1);
      this.speedY = random(-1, 1);
      this.darkColor = color(243, 156, 18, random(100, 255));
      this.lightColor = color(52, 152, 219, random(100, 255));
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > width) this.speedX *= -1;
      if (this.y < 0 || this.y > height) this.speedY *= -1;
    }
    
    show() {
      noStroke();
      fill(document.body.classList.contains('light-theme') ? this.lightColor : this.darkColor);
      ellipse(this.x, this.y, this.size);
    }
  }
  
  window.setup = function() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('canvas-container');
    if (bgStyle === "particles") {
      for (let i = 0; i < 150; i++) {
        particles.push(new Particle());
      }
    }
  };
  
  window.draw = function() {
    if (bgStyle === "particles") {
      if (document.body.classList.contains('light-theme')) {
        background(240, 240, 240, 20);
      } else {
        background(17, 17, 17, 20);
      }
      particles.forEach(p => {
        p.update();
        p.show();
      });
    } else if (bgStyle === "lines") {
      if (document.body.classList.contains('light-theme')) {
        background(240, 240, 240, 20);
        stroke(0, 0, 0, 100);
      } else {
        background(17, 17, 17, 20);
        stroke(255, 255, 255, 100);
      }
      noFill();
      beginShape();
      for (let x = 0; x <= width; x += 10) {
        let y = height / 2 + 50 * sin(x / 50 + frameCount / 20);
        vertex(x, y);
      }
      endShape();
    } else if (bgStyle === "noise") {
      if (document.body.classList.contains('light-theme')) {
        background(240, 240, 240);
      } else {
        background(17, 17, 17);
      }
      let scl = 20;
      noStroke();
      for (let x = 0; x < width; x += scl) {
        for (let y = 0; y < height; y += scl) {
          let n = noise(x * 0.01, y * 0.01, frameCount * 0.01);
          let col = map(n, 0, 1, 50, 200);
          fill(col, col, col, 100);
          rect(x, y, scl, scl);
        }
      }
    }
  };
  
  window.windowResized = function() {
    resizeCanvas(windowWidth, windowHeight);
  };
  
  // Interacciones de la UI
  document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const bgSelect = document.getElementById('bg-select');
    bgSelect.value = bgStyle;
  
    // Toggle del menú móvil
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  
    // Smooth scroll utilizando GSAP ScrollToPlugin
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetEl = document.getElementById(targetId);
        gsap.to(window, { duration: 1, scrollTo: { y: targetEl.offsetTop - 70 } });
        navLinks.classList.remove('active');
      });
    });
  
    // Alternar tema y guardar preferencia
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      themeToggle.textContent = isLight ? 'Modo Oscuro' : 'Modo Claro';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  
    // Cambiar estilo de fondo y guardar preferencia
    bgSelect.addEventListener('change', e => {
      bgStyle = e.target.value;
      localStorage.setItem('bgStyle', bgStyle);
      particles = [];
      if (bgStyle === "particles") {
        for (let i = 0; i < 150; i++) {
          particles.push(new Particle());
        }
      }
    });
  
    // Observer para animar secciones al entrar en vista
    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });
    sections.forEach(section => observer.observe(section));
  });
})();