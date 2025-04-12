(() => {
  if (!localStorage.getItem('theme')) {
    localStorage.setItem('theme', 'light');
  }
  
  let bgStyle = localStorage.getItem('bgStyle') || "lines";
  let particles = [];
  
  const themeToggle = document.getElementById('theme-toggle');
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-theme');
    themeToggle.textContent = 'Modo Oscuro';
  } else {
    themeToggle.textContent = 'Modo Claro';
  }
  
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
  
  document.addEventListener("DOMContentLoaded", () => {
    gsap.from("header", { duration: 1, y: -50, opacity: 0, ease: "power2.out" });
    gsap.from(".nav-links li", { duration: 1, y: -20, opacity: 0, stagger: 0.1, delay: 0.5 });
    
    const menuToggle = document.querySelector('.menu-toggle');
    const navContent = document.querySelector('.nav-content');
    const bgSelect = document.getElementById('bg-select');
    bgSelect.value = bgStyle;
  
    menuToggle.addEventListener('click', () => {
      navContent.classList.toggle('active');
    });
  
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetEl = document.getElementById(targetId);
        gsap.to(window, { duration: 1, scrollTo: { y: targetEl.offsetTop - 70 } });
        navContent.classList.remove('active');
      });
    });
  
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const isLight = document.body.classList.contains('light-theme');
      themeToggle.textContent = isLight ? 'Modo Oscuro' : 'Modo Claro';
      localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
  
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