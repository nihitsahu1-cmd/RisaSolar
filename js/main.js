(() => {
  "use strict";
  const data = window.SOLAR_DATA || {};
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];

  $$("[data-brand]").forEach(el => el.textContent = data.brand || "Risa Energy");
  $$("[data-tagline]").forEach(el => el.textContent = data.tagline || "");
  $("#footerArea").textContent = data.serviceArea || "";
  document.querySelectorAll("[data-address]").forEach(el => el.textContent = data.address || "");
  $("#year").textContent = new Date().getFullYear();

  const themeToggle = $("#themeToggle");
  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = theme;
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", `Switch to ${isDark ? "light" : "dark"} mode`);
    themeToggle.title = `Switch to ${isDark ? "light" : "dark"} mode`;
    themeToggle.firstElementChild.textContent = isDark ? "☀" : "☾";
  }
  applyTheme(document.documentElement.dataset.theme);
  themeToggle.addEventListener("click", () => {
    const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem("risa-theme", theme);
    applyTheme(theme);
  });

  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");
  menuToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach(link => link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  }));

  // Hero image slider
  const slidesRoot = $("#heroSlides");
  const dotsRoot = $("#slideDots");
  const images = (data.sliderImages || []).filter(item => item && item.src);
  let current = 0;
  let timer = null;
  const slideEls = [];
  const dotEls = [];

  function showSlide(index) {
    if (!slideEls.length) return;
    current = (index + slideEls.length) % slideEls.length;
    slideEls.forEach((el, i) => el.classList.toggle("active", i === current));
    dotEls.forEach((el, i) => {
      el.classList.toggle("active", i === current);
      el.setAttribute("aria-current", i === current ? "true" : "false");
    });
  }
  function startSlider() {
    window.clearInterval(timer);
    if (slideEls.length > 1) timer = window.setInterval(() => showSlide(current + 1), Number(data.sliderIntervalMs) || 5000);
  }
  images.forEach((item, index) => {
    const slide = document.createElement("div");
    slide.className = "hero-slide" + (index === 0 ? " active" : "");
    slide.style.backgroundImage = `url("${item.src}")`;
    slide.setAttribute("role", "img");
    slide.setAttribute("aria-label", item.alt || "Solar project photo");
    slidesRoot.appendChild(slide);
    slideEls.push(slide);
    const dot = document.createElement("button");
    dot.className = "slide-dot" + (index === 0 ? " active" : "");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show photo ${index + 1}`);
    dot.addEventListener("click", () => { showSlide(index); startSlider(); });
    dotsRoot.appendChild(dot);
    dotEls.push(dot);
  });
  $("#prevSlide").addEventListener("click", () => { showSlide(current - 1); startSlider(); });
  $("#nextSlide").addEventListener("click", () => { showSlide(current + 1); startSlider(); });
  startSlider();

  // Project gallery from config
  const gallery = $("#projectGallery");
  (data.galleryImages || []).forEach(item => {
    const card = document.createElement("div");
    card.className = "gallery-item";
    const img = document.createElement("img");
    img.src = item.src;
    img.alt = item.alt || "Solar installation";
    img.loading = "lazy";
    img.onerror = () => { card.style.display = "none"; };
    const label = document.createElement("span");
    label.textContent = item.label || "Solar Project";
    card.append(img, label);
    gallery.appendChild(card);
  });

  // Contact actions
  const phone = String(data.phoneLink || "").replace(/[^\d+]/g, "");
  const whatsapp = String(data.whatsappNumber || "").replace(/\D/g, "");
  $("#callButton").href = phone ? `tel:${phone}` : "#contact";
  $("#whatsappButton").href = whatsapp ? `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello Risa Energy, I would like to know more about solar installation.")}` : "#contact";
  $("#floatingCallButton").href = phone ? `tel:${phone}` : "#contact";
  $("#floatingWhatsappButton").href = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hello Risa Energy, I would like to know more about solar installation.")}`
    : "#contact";

  // Form opens WhatsApp with the selected details; no data is sent to a server.
  $("#savingsForm").addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#contactName").value.trim();
    const address = $("#contactAddress").value.trim();
    const landmark = $("#landmark").value.trim();
    const mobile = $("#contactMobile").value.trim();
    const email = $("#contactEmail").value.trim();
    const bill = $("#monthlyBill").value;
    const property = $("#propertyType").value;
    const pin = $("#postalCode").value.trim();
    const message = `Hello ${data.brand || "Risa Energy"}, I would like a solar estimate.\n` +
      `Name: ${name}\nAddress: ${address}\nLandmark: ${landmark}\nMobile: ${mobile}\nEmail: ${email}\n` +
      `Monthly electricity bill: ${bill}\nProperty type: ${property}\nPIN code: ${pin}`;
    if (whatsapp) {
      window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    } else {
      alert("Please add the WhatsApp number in js/config.js.");
    }
  });
})();
