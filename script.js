(function() {
  "use strict";

  // Telegram bot link
  const TELEGRAM_BOT_URL = "https://t.me/sorajimarobot";

  // Apply Telegram bot link to all CTA elements
  document.querySelectorAll("[data-tg-bot]").forEach(el => {
    el.setAttribute("href", TELEGRAM_BOT_URL);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });

  // Sakura petals canvas animation
  const canvas = document.getElementById("sakura-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = window.innerWidth;
    let height = window.innerHeight;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }
    window.addEventListener("resize", resize);
    resize();

    const petalCount = 42;
    const petals = [];

    function createPetal(randomY) {
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : -20 - Math.random() * 80,
        size: 7 + Math.random() * 8,
        speedY: 0.8 + Math.random() * 1.3,
        speedX: (Math.random() - 0.35) * 0.7,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 1.8,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.015 + Math.random() * 0.02,
        swayWidth: 20 + Math.random() * 30,
        opacity: 0.25 + Math.random() * 0.45,
        flip: Math.random() * Math.PI,
        flipSpeed: 0.02 + Math.random() * 0.03
      };
    }

    for (let i = 0; i < petalCount; i++) {
      petals.push(createPetal(true));
    }

    function drawPetal(p) {
      ctx.save();
      const currentX = p.x + Math.sin(p.sway) * p.swayWidth;
      ctx.translate(currentX, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      const scaleY = Math.cos(p.flip);
      ctx.scale(1, scaleY);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-p.size * 0.5, -p.size * 0.6, -p.size * 0.7, -p.size * 1.3, 0, -p.size * 1.6);
      ctx.bezierCurveTo(p.size * 0.7, -p.size * 1.3, p.size * 0.5, -p.size * 0.6, 0, 0);
      ctx.fillStyle = "rgba(223, 126, 151, " + p.opacity + ")";
      ctx.fill();
      ctx.restore();
    }

    function update() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.y += p.speedY;
        p.x += p.speedX;
        p.sway += p.swaySpeed;
        p.rotation += p.rotationSpeed;
        p.flip += p.flipSpeed;
        if (p.x < -60) p.x = width + 40;
        else if (p.x > width + 60) p.x = -40;
        if (p.y > height + 30) {
          petals[i] = createPetal(false);
        }
        drawPetal(p);
      }
      requestAnimationFrame(update);
    }
    update();
  }

  // FAQ Accordion
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const questionBtn = item.querySelector(".faq-question");
    if (questionBtn) {
      questionBtn.addEventListener("click", () => {
        const isOpen = item.classList.contains("active");
        faqItems.forEach(other => other.classList.remove("active"));
        if (!isOpen) {
          item.classList.add("active");
        }
      });
    }
  });

  // Navbar scroll background change
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.style.background = "rgba(10, 13, 20, 0.92)";
      navbar.style.boxShadow = "0 8px 30px rgba(0, 0, 0, 0.4)";
    } else {
      navbar.style.background = "rgba(12, 15, 23, 0.75)";
      navbar.style.boxShadow = "none";
    }
  });

  // Mobile drawer toggle
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileDrawer = document.getElementById("mobile-drawer");
  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener("click", () => {
      mobileDrawer.classList.toggle("active");
    });

    mobileDrawer.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mobileDrawer.classList.remove("active");
      });
    });
  }
})();


