/* Sunora Solar — calculator, dynamic data and contact interactions */
(() => {
  "use strict";
  const CONFIG = window.SOLAR_DATA;
  const $ = (id) => document.getElementById(id);
  const money = (amount) => new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR", maximumFractionDigits: 0
  }).format(Number.isFinite(amount) ? amount : 0);

  function whatsappUrl(message) {
    const number = String(CONFIG.whatsappNumber || "").replace(/\D/g, "");
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }

  function openWhatsApp(message) {
    const number = String(CONFIG.whatsappNumber || "").replace(/\D/g, "");
    if (number.length < 10) {
      showToast("Please add a valid WhatsApp number in data/data.js.");
      return;
    }
    // Opens WhatsApp with a prepared message. The customer must press Send.
    window.open(whatsappUrl(message), "_blank", "noopener,noreferrer");
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 3600);
  }

  function applyBusinessData() {
    document.title = `${CONFIG.brand} | Clean Energy, Made Simple`;
    document.querySelectorAll(".brand-logo").forEach((logo) => {
      logo.alt = CONFIG.brand;
    });
    $("copyrightBrand").textContent = CONFIG.brand;
    $("serviceAreaTop").textContent = `Serving ${CONFIG.serviceArea}`;
    $("serviceArea").textContent = CONFIG.serviceArea;
    $("footerArea").textContent = CONFIG.serviceArea;
    $("businessAddress").textContent = CONFIG.address;
    $("footerAddress").textContent = CONFIG.address;
    $("heroImage").src = CONFIG.heroImage;
    $("headerPhone").href = `tel:${CONFIG.phoneLink}`;
    $("headerPhone").querySelector("b").textContent = CONFIG.phoneDisplay;
    $("contactPhone").href = `tel:${CONFIG.phoneLink}`;
    $("contactPhone").querySelector("b").textContent = CONFIG.phoneDisplay;
    $("contactEmail").href = `mailto:${CONFIG.email}`;
    $("contactEmail").querySelector("b").textContent = CONFIG.email;
    $("footerPhone").href = `tel:${CONFIG.phoneLink}`;
    $("footerPhone").textContent = CONFIG.phoneDisplay;
    $("footerEmail").href = `mailto:${CONFIG.email}`;
    $("footerEmail").textContent = CONFIG.email;
    $("year").textContent = new Date().getFullYear();

    $("floatingCall").href = `tel:${CONFIG.phoneLink}`;
    const float = $("floatingWhatsApp");
    float.href = whatsappUrl(`Hello ${CONFIG.brand}, I would like to enquire about solar installation.`);
  }

  function renderPackages() {
    const grid = $("packageCards");
    grid.innerHTML = CONFIG.packages.map((pkg) => `
      <article class="package-card ${pkg.featured ? "featured" : ""}">
        ${pkg.featured ? '<span class="popular-label">MOST POPULAR</span>' : ""}
        <div class="package-top"><span class="package-icon">☼</span><span class="package-kw">${pkg.kw} kW SYSTEM</span></div>
        <h3>${pkg.name}</h3>
        <p class="package-desc">${pkg.description}</p>
        <div class="package-price">${money(pkg.price)} <small>/ sample estimate</small></div>
        <div class="package-note">Indicative price • Final quote may vary</div>
        <div class="package-divider"></div>
        <ul class="package-features">${pkg.features.map((feature) => `<li>${feature}</li>`).join("")}</ul>
        <button class="btn ${pkg.featured ? "btn-primary" : "btn-outline"}" type="button" data-package="${pkg.kw}" data-price="${pkg.price}">Enquire about ${pkg.kw} kW <span>↗</span></button>
      </article>
    `).join("");

    grid.querySelectorAll("[data-package]").forEach((button) => {
      button.addEventListener("click", () => {
        $("systemKw").value = button.dataset.package;
        $("systemCost").value = button.dataset.price;
        $("customerSystem").value = `${button.dataset.package} kW`;
        calculate();
        $("contact").scrollIntoView({ behavior: "smooth" });
      });
    });
  }

  function calculate() {
    const cost = Math.max(0, Number($("systemCost").value) || 0);
    const down = Math.max(0, Number($("downPayment").value) || 0);
    const rate = Math.max(0, Math.min(36, Number($("interestRate").value) || 0));
    const years = Math.max(1, Number($("tenure").value) || 1);
    const bill = Math.max(0, Number($("monthlyBill").value) || 0);
    const kw = Math.max(1, Number($("systemKw").value) || 1);
    const principal = Math.max(0, cost - down);
    const months = years * 12;
    const monthlyRate = rate / 1200;
    const emi = principal === 0 ? 0 : monthlyRate === 0
      ? principal / months
      : principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
        (Math.pow(1 + monthlyRate, months) - 1);
    const interest = Math.max(0, emi * months - principal);
    const expectedGeneration = kw * CONFIG.calculator.estimatedUnitsPerKwMonthly;
    const estimatedSavings = Math.min(bill, expectedGeneration * CONFIG.calculator.sampleElectricityRate);
    const paybackYears = estimatedSavings > 0 ? cost / (estimatedSavings * 12) : 0;

    $("emiValue").textContent = money(emi);
    $("loanValue").textContent = money(principal);
    $("interestValue").textContent = money(interest);
    $("savingsValue").textContent = money(estimatedSavings);
    $("paybackValue").textContent = paybackYears > 0 ? `${paybackYears.toFixed(1)} years` : "—";
  }

  function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);
    $("themeGlyph").textContent = isDark ? "☀" : "☾";
    $("themeLabel").textContent = isDark ? "Day" : "Night";
    $("themeToggle").setAttribute("aria-label", isDark ? "Switch to day mode" : "Switch to night mode");
  }

  function bindEvents() {
    applyTheme(false);
    $("themeToggle").addEventListener("click", () => {
      applyTheme(!document.body.classList.contains("dark-mode"));
    });

    ["systemKw", "systemCost", "downPayment", "interestRate", "tenure", "monthlyBill"].forEach((id) => {
      $(id).addEventListener("input", calculate);
      $(id).addEventListener("change", calculate);
    });
    $("calculateBtn").addEventListener("click", calculate);

    $("emiEnquiry").addEventListener("click", () => {
      const message = [
        `Hello ${CONFIG.brand}, I would like to discuss this solar estimate.`,
        `System size: ${$("systemKw").value} kW`,
        `Estimated system cost: ${money(Number($("systemCost").value) || 0)}`,
        `Down payment: ${money(Number($("downPayment").value) || 0)}`,
        `Loan tenure: ${$("tenure").value} years`,
        `Annual interest rate: ${$("interestRate").value}%`,
        `Estimated EMI: ${$("emiValue").textContent}`,
        `Monthly electricity bill: ${money(Number($("monthlyBill").value) || 0)}`,
        "Please share a personalised quotation."
      ].join("\n");
      openWhatsApp(message);
    });

    $("enquiryForm").addEventListener("submit", (event) => {
      event.preventDefault();
      const form = $("enquiryForm");
      if (!form.reportValidity()) return;

      const phone = $("customerPhone").value.trim();
      const digits = phone.replace(/\D/g, "");
      if (digits.length < 10 || digits.length > 15) {
        showToast("Please enter a valid mobile number.");
        $("customerPhone").focus();
        return;
      }

      const message = [
        `🌞 *New Solar Enquiry — ${CONFIG.brand}*`,
        "",
        `*Name:* ${$("customerName").value.trim()}`,
        `*Mobile:* ${phone}`,
        `*City / area:* ${$("customerCity").value.trim()}`,
        `*Monthly electricity bill:* ${$("customerBill").value}`,
        `*Interested system size:* ${$("customerSystem").value}`,
        `*Message:* ${$("customerMessage").value.trim() || "Not provided"}`,
        "",
        "Please contact me about solar installation, pricing and available financing."
      ].join("\n");
      openWhatsApp(message);
    });

    const mobileToggle = $("mobileToggle");
    mobileToggle.addEventListener("click", () => {
      const isOpen = $("navLinks").classList.toggle("open");
      mobileToggle.setAttribute("aria-expanded", String(isOpen));
      mobileToggle.textContent = isOpen ? "×" : "☰";
    });
    $("navLinks").querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        $("navLinks").classList.remove("open");
        mobileToggle.setAttribute("aria-expanded", "false");
        mobileToggle.textContent = "☰";
      });
    });
  }

  applyBusinessData();
  renderPackages();
  bindEvents();
  calculate();
})();
