/* ModVault — main.js */

// ── THEME ──────────────────────────────────────────────────────────────────
const html = document.documentElement;
const themeBtn = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("mv-theme") || "dark";
html.setAttribute("data-theme", savedTheme);

themeBtn?.addEventListener("click", () => {
  const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("mv-theme", next);
});

// ── I18N — traduction côté client ─────────────────────────────────────────
const I18N = window.I18N || {};

function applyLangBlocks(lang) {
  document.querySelectorAll("[data-lang-block]").forEach((el) => {
    el.style.display = el.dataset.langBlock === lang ? "" : "none";
  });
}

function applyLang(lang) {
  const t = I18N[lang];
  if (!t) return;

  html.setAttribute("lang", lang);
  html.setAttribute("data-lang", lang);

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  document.querySelectorAll("option[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  applyLangBlocks(lang);
  localStorage.setItem("mv-lang", lang);
}

const savedLang = localStorage.getItem("mv-lang") || "fr";
applyLang(savedLang);

const langBtn = document.getElementById("langToggle");
langBtn?.addEventListener("click", () => {
  const current = html.getAttribute("data-lang") || "fr";
  const next = current === "fr" ? "en" : "fr";
  applyLang(next);
});

// ── MOBILE NAV ─────────────────────────────────────────────────────────────
const burger = document.getElementById("navBurger");
const navLinks = document.getElementById("navLinks");
burger?.addEventListener("click", () => navLinks?.classList.toggle("open"));
document.addEventListener("click", (e) => {
  if (!burger?.contains(e.target) && !navLinks?.contains(e.target)) {
    navLinks?.classList.remove("open");
  }
});

// ── SEARCH + FILTER + SORT ─────────────────────────────────────────────────
(function () {
  const grid = document.querySelector(".mods-grid");
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll(".mod-card"));
  const searchInput = document.getElementById("modSearch");
  const filterBtns = document.querySelectorAll(".filter-btn");
  const sortSelect = document.getElementById("modSort");
  const noResults = document.getElementById("noResults");

  let activeGame = "all";
  let activeTags = new Set();
  let searchTerm = "";
  let sortMode = "date";

  function applyFilters() {
    let visible = [];

    cards.forEach((card) => {
      const title    = card.dataset.title    || "";
      const game     = card.dataset.game     || "";
      const category = card.dataset.category || "";
      const tags     = card.dataset.tags     || "";
      const date     = card.dataset.date     || "0";

      const matchGame   = activeGame === "all" || game === activeGame;
      const matchSearch = !searchTerm ||
        title.includes(searchTerm) ||
        tags.includes(searchTerm) ||
        category.includes(searchTerm);
      const matchTags = activeTags.size === 0 ||
        [...activeTags].every(t => tags.includes(t));

      if (matchGame && matchSearch && matchTags) {
        card.classList.remove("hidden");
        visible.push({ card, date, title });
      } else {
        card.classList.add("hidden");
      }
    });

    visible.sort((a, b) => {
      if (sortMode === "date") return b.date.localeCompare(a.date);
      if (sortMode === "name") return a.title.localeCompare(b.title);
      return 0;
    });
    visible.forEach(({ card }) => grid.appendChild(card));

    if (noResults) {
      noResults.classList.toggle("hidden", visible.length > 0);
    }
  }

  searchInput?.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    applyFilters();
  });

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.filterType;
      const val  = btn.dataset.filterValue;

      if (type === "game") {
        activeGame = val;
        document.querySelectorAll('[data-filter-type="game"]')
          .forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
      }

      if (type === "tag") {
        if (btn.classList.contains("active")) {
          btn.classList.remove("active");
          activeTags.delete(val);
        } else {
          btn.classList.add("active");
          activeTags.add(val);
        }
      }

      applyFilters();
    });
  });

  sortSelect?.addEventListener("change", (e) => {
    sortMode = e.target.value;
    applyFilters();
  });
})();

// ── STAGGERED CARD ANIMATION ───────────────────────────────────────────────
document.querySelectorAll(".mod-card").forEach((card, i) => {
  card.style.animationDelay = `${i * 45}ms`;
});
