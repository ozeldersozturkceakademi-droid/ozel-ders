// ====================================================
// ÖZTÜRKÇE AKADEMİ — ORTAK SCRIPT
// ====================================================

// Mobil menü aç/kapat
function initMenuToggle() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  // Menüden bir linke tıklanınca otomatik kapansın
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });
}

// Scroll ile görünür olunca fade-up animasyonu
function initFadeUp() {
  const items = document.querySelectorAll(".fade-up");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
}

// SSS akordeon
function initFaq() {
  const items = document.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const question = item.querySelector(".faq-question");
    if (!question) return;
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      items.forEach((i) => i.classList.remove("open"));
      if (!isOpen) item.classList.add("open");
    });
  });
}

// WhatsApp hazır mesaj linki oluştur
function buildWhatsAppLink(phoneNumber, message) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encoded}`;
}

function initWhatsAppLinks() {
  const WHATSAPP_NUMBER = "905436443552";
  const DEFAULT_MESSAGE =
    "Merhaba.\nÖztürkçe Akademi'nin birebir akademik gelişim desteği hakkında bilgi almak istiyorum.\nÖğrencim .... sınıfta.\nBilgi verebilir misiniz?";

  document.querySelectorAll("[data-whatsapp]").forEach((el) => {
    el.href = buildWhatsAppLink(WHATSAPP_NUMBER, DEFAULT_MESSAGE);
    el.target = "_blank";
    el.rel = "noopener";
  });
}

// Aktif menü linkini işaretle
function markActiveNav() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[data-page]").forEach((link) => {
    if (link.dataset.page === current) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initMenuToggle();
  initFadeUp();
  initFaq();
  initWhatsAppLinks();
  markActiveNav();
});
