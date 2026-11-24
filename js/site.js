(function () {
  const WHATSAPP = "263785340515";
  const PHONE_DISPLAY = "+263 78 534 0515";
  const EMAIL = "smartmecmotors@gmail.com";
  const ADDRESS = "47 Leyland Road, New Ardbennie, Southerton, Harare, Zimbabwe";

  const icon = {
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.4c.9.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2z"/></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.5 3.5A11 11 0 0 0 2.1 17.1L1 23l6.1-1.1A11 11 0 1 0 20.5 3.5zm-8.6 17a9.1 9.1 0 0 1-4.6-1.3l-.3-.2-3.6.7.7-3.5-.2-.3a9.1 9.1 0 1 1 8 4.6zm5-6.8c-.3-.1-1.6-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.6.1s-1.2-.4-2.3-1.5c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5s-.6-1.4-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.1.7 2.8.6.4-.1 1.6-.7 1.8-1.3.2-.6.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z"/></svg>'
  };

  function brand(href) {
    return `<a class="brand" href="${href}">
      <img class="brand-logo" src="${(document.body.dataset.root || "")}logo/20251101_211010_0000.png" alt="SMARTMEC Service Motors" width="64" height="64">
      <span class="brand-text"><b>SMARTMEC</b><small>SERVICE MOTORS</small></span>
    </a>`;
  }

  function isActive(page, key) {
    return page === key ? "active" : "";
  }

  function renderChrome() {
    const page = document.body.dataset.page || "home";
    const root = document.body.dataset.root || "";

    const topbar = document.getElementById("site-topbar");
    if (topbar) {
      topbar.innerHTML = `<div class="container topbar-inner">
        <span class="topbar-item">${icon.phone}<a href="tel:+263785340515">${PHONE_DISPLAY}</a></span>
        <span class="topbar-item">${icon.mail}<a href="mailto:${EMAIL}">${EMAIL}</a></span>
        <span class="topbar-item">${icon.pin} Southerton, Harare</span>
        <div class="topbar-social" aria-label="Social media">
          <a href="#" aria-label="Facebook" title="Facebook"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z"/></svg></a>
          <a href="#" aria-label="Instagram" title="Instagram"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.8 6.2a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1z"/></svg></a>
          <a href="#" aria-label="LinkedIn" title="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.5 9H3.7v11.5h2.8zm-1.4-4.5a1.65 1.65 0 1 0 0 3.3 1.65 1.65 0 0 0 0-3.3zM20.3 13c0-2.6-1.4-4.3-3.8-4.3a3.4 3.4 0 0 0-3 1.6V9H10.7v11.5h2.8v-6.2c0-1.6.3-3.2 2.3-3.2s2 1.7 2 3.3v6.1h2.8z"/></svg></a>
        </div>
      </div>`;
    }

    const header = document.getElementById("site-header");
    if (header) {
      header.innerHTML = `<div class="container nav-wrap">
        ${brand(root + "index.html")}
        <button class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false">☰</button>
        <nav class="nav" id="nav" aria-label="Primary">
          <a class="${isActive(page, "home")}" href="${root}index.html">Home</a>
          <a class="${isActive(page, "about")}" href="${root}about.html">About</a>
          <details class="nav-drop ${["mechanical","autobody","additional"].includes(page) ? "active" : ""}">
            <summary>Services</summary>
            <div class="nav-menu">
              <a href="${root}mechanical.html">Mechanical Services</a>
              <a href="${root}autobody.html">Autobody Services</a>
              <a href="${root}additional.html">Additional Services</a>
            </div>
          </details>
          <a class="${isActive(page, "insurance")}" href="${root}insurance.html">Insurance</a>
          <a class="${isActive(page, "gallery")}" href="${root}gallery.html">Gallery</a>
          <a class="${isActive(page, "contact")}" href="${root}contact.html">Contact</a>
          <a class="nav-cta" href="${root}quote.html">Request a Quote →</a>
        </nav>
      </div>`;
    }

    const footer = document.getElementById("site-footer");
    if (footer) {
      footer.innerHTML = `<div class="container footer-grid footer-grid--contact">
        <div>
          ${brand(root + "index.html").replace('class="brand"', 'class="brand footer-brand"')}
        </div>
        <div>
          <h3>Address</h3>
          <span>${ADDRESS}</span>
        </div>
        <div>
          <h3>Phone</h3>
          <a href="tel:+263785340515">${PHONE_DISPLAY}</a>
        </div>
        <div>
          <h3>Email</h3>
          <a href="mailto:${EMAIL}">${EMAIL}</a>
          <a href="https://www.smartmecmotors.co.zw" target="_blank" rel="noopener" style="margin-top:10px;display:block">www.smartmecmotors.co.zw</a>
        </div>
      </div>
      <div class="footer-bottom">
        <div class="container">
          <span>© <span id="yearNow"></span> Smartmec Service Motors. All rights reserved.</span>
          <a href="${root}quote.html">Request a Quote →</a>
        </div>
      </div>`;
    }

    if (!document.querySelector(".floating-wa")) {
      const wa = document.createElement("a");
      wa.className = "floating-wa";
      wa.href = `https://wa.me/${WHATSAPP}`;
      wa.target = "_blank";
      wa.rel = "noopener";
      wa.setAttribute("aria-label", "Chat on WhatsApp");
      wa.innerHTML = icon.wa;
      document.body.appendChild(wa);
    }

    const year = document.getElementById("yearNow");
    if (year) year.textContent = new Date().getFullYear();

    const toggle = document.getElementById("menuToggle");
    const nav = document.getElementById("nav");
    if (toggle && nav) {
      toggle.addEventListener("click", () => {
        const open = nav.classList.toggle("open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
      nav.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => {
          nav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        })
      );
    }

    // Close services dropdown when clicking outside (desktop)
    document.addEventListener("click", (e) => {
      document.querySelectorAll(".nav-drop[open]").forEach((d) => {
        if (!d.contains(e.target)) d.removeAttribute("open");
      });
    });

  }

  function initHeroCarousel() {
    const root = document.querySelector("[data-hero-carousel]");
    if (!root) return;

    const track = root.querySelector(".hero-track");
    const slides = Array.from(root.querySelectorAll(".hero-slide"));
    if (!track || slides.length < 2) return;

    const dotsWrap = root.querySelector(".hero-dots");
    const prevBtn = root.querySelector(".hero-arrow--prev");
    const nextBtn = root.querySelector(".hero-arrow--next");
    let index = 0;
    let timer = null;
    const INTERVAL = 5500;

    if (dotsWrap) {
      dotsWrap.innerHTML = slides
        .map((_, i) => `<button class="hero-dot${i === 0 ? " is-active" : ""}" type="button" aria-label="Go to slide ${i + 1}"></button>`)
        .join("");
    }
    const dots = Array.from(root.querySelectorAll(".hero-dot"));

    function goTo(i) {
      index = ((i % slides.length) + slides.length) % slides.length;
      track.style.transform = `translate3d(-${index * 100}%, 0, 0)`;
      slides.forEach((slide, n) => {
        const on = n === index;
        slide.classList.toggle("is-active", on);
        slide.setAttribute("aria-hidden", on ? "false" : "true");
      });
      dots.forEach((dot, n) => {
        dot.classList.toggle("is-active", n === index);
      });
      root.dataset.activeTheme = slides[index].getAttribute("data-theme") || "dark";
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() {
      stop();
      timer = window.setInterval(next, INTERVAL);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (nextBtn) nextBtn.addEventListener("click", (e) => { e.preventDefault(); next(); start(); });
    if (prevBtn) prevBtn.addEventListener("click", (e) => { e.preventDefault(); prev(); start(); });
    dots.forEach((dot, i) => {
      dot.addEventListener("click", (e) => { e.preventDefault(); goTo(i); start(); });
    });

    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);

    // Touch / swipe
    let startX = 0;
    let deltaX = 0;
    root.addEventListener("touchstart", (e) => {
      startX = e.changedTouches[0].clientX;
      deltaX = 0;
      stop();
    }, { passive: true });
    root.addEventListener("touchmove", (e) => {
      deltaX = e.changedTouches[0].clientX - startX;
    }, { passive: true });
    root.addEventListener("touchend", () => {
      if (Math.abs(deltaX) > 40) {
        if (deltaX < 0) next();
        else prev();
      }
      start();
    });

    goTo(0);
    start();
  }

  document.addEventListener("DOMContentLoaded", initHeroCarousel);

  window.SMARTMEC = {
    WHATSAPP,
    PHONE_DISPLAY,
    EMAIL,
    ADDRESS,
    openWhatsApp(text) {
      const url = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text || "")}`;
      window.open(url, "_blank", "noopener");
    },
    downloadText(filename, text) {
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    escapeHtml(str) {
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
    }
  };

  document.addEventListener("DOMContentLoaded", renderChrome);
})();
