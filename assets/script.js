

(function () {
  "use strict";

  const TG_BOT_URL = "https://t.me/sorajimarobot";
  const THEME_STORAGE_KEY = "sorajima-theme";
  const htmlRoot = document.documentElement;

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  function getStoredTheme() {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === "dark" || saved === "light") {
        return saved;
      }
    } catch (e) {}
    return null;
  }

  function getEffectiveTheme() {
    return getStoredTheme() || getSystemTheme();
  }

  function updateThemeToggleButtons(theme) {
    const buttons = document.querySelectorAll("#theme-toggle-btn, #btn-theme-toggle");
    buttons.forEach((btn) => {
      btn.setAttribute(
        "aria-label",
        theme === "dark" ? "Переключить на светлую тему" : "Переключить на темную тему"
      );
      btn.setAttribute("title", theme === "dark" ? "Светлая тема" : "Темная тема");

      const iconSun = btn.querySelector(".icon-sun, .theme-icon-sun");
      const iconMoon = btn.querySelector(".icon-moon, .theme-icon-moon");

      if (iconSun && iconMoon) {
        if (theme === "dark") {
          iconSun.style.display = "block";
          iconMoon.style.display = "none";
        } else {
          iconSun.style.display = "none";
          iconMoon.style.display = "block";
        }
      }
    });
  }

  function applyTheme(theme, persist = false) {
    htmlRoot.setAttribute("data-theme", theme);

    if (persist) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
      } catch (e) {}
    }

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "dark" ? "#141414" : "#cddbe9");
    }

    updateThemeToggleButtons(theme);
  }

  const initialTheme = getEffectiveTheme();
  applyTheme(initialTheme, false);

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#theme-toggle-btn, #btn-theme-toggle");
    if (btn) {
      e.preventDefault();
      const current = htmlRoot.getAttribute("data-theme") || "dark";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next, true);
    }
  });

  if (window.matchMedia) {
    const systemMedia = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = (e) => {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? "dark" : "light", false);
      }
    };

    if (systemMedia.addEventListener) {
      systemMedia.addEventListener("change", handleSystemChange);
    } else if (systemMedia.addListener) {
      systemMedia.addListener(handleSystemChange);
    }
  }

  window.addEventListener("storage", (e) => {
    if (e.key === THEME_STORAGE_KEY) {
      if (e.newValue === "dark" || e.newValue === "light") {
        applyTheme(e.newValue, false);
      } else if (!e.newValue) {
        applyTheme(getSystemTheme(), false);
      }
    }
  });

  const dateTextEl = document.getElementById("header-date-text");
  const timeTextEl = document.getElementById("header-time-text");

  if (dateTextEl || timeTextEl) {
    function updateClock() {
      const now = new Date();
      
      const utcHours = now.getUTCHours() + 3;
      const hours = (utcHours % 24).toString().padStart(2, "0");
      const minutes = now.getUTCMinutes().toString().padStart(2, "0");
      const seconds = now.getUTCSeconds().toString().padStart(2, "0");

      if (timeTextEl) {
        timeTextEl.textContent = `${hours}:${minutes}:${seconds}`;
      }

      if (dateTextEl) {
        const monthsRu = [
          "января", "февраля", "марта", "апреля", "мая", "июня",
          "июля", "августа", "сентября", "октября", "ноября", "декабря"
        ];
        const day = now.getUTCDate().toString().padStart(2, "0");
        const month = monthsRu[now.getUTCMonth()];
        dateTextEl.textContent = `${day} ${month}`;
      }
    }

    updateClock();
    setInterval(updateClock, 1000);
  }

  const mobileToggle = document.getElementById("mobile-toggle");
  const mobileDrawer = document.getElementById("mobile-drawer");
  const mobileBackdrop = document.getElementById("mobile-drawer-backdrop");
  const mobileCloseBtn = document.getElementById("mobile-drawer-close");

  function openMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.add("open");
    if (mobileBackdrop) mobileBackdrop.classList.add("open");
    if (mobileToggle) {
      mobileToggle.classList.add("active");
      mobileToggle.setAttribute("aria-expanded", "true");
    }
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    if (mobileDrawer) mobileDrawer.classList.remove("open");
    if (mobileBackdrop) mobileBackdrop.classList.remove("open");
    if (mobileToggle) {
      mobileToggle.classList.remove("active");
      mobileToggle.setAttribute("aria-expanded", "false");
    }
    document.body.style.overflow = "";
  }

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener("click", () => {
      const isOpen = mobileDrawer.classList.contains("open");
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (mobileCloseBtn) {
      mobileCloseBtn.addEventListener("click", closeMobileMenu);
    }

    if (mobileBackdrop) {
      mobileBackdrop.addEventListener("click", closeMobileMenu);
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileDrawer.classList.contains("open")) {
        closeMobileMenu();
      }
    });

    mobileDrawer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });
  }

  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-trigger");
    if (trigger) {
      trigger.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        faqItems.forEach((i) => i.classList.remove("active"));
        if (!isActive) {
          item.classList.add("active");
        }
      });
    }
  });

  document.querySelectorAll("[data-tg-bot]").forEach((el) => {
    el.setAttribute("href", TG_BOT_URL);
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener noreferrer");
  });
})();
