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

// ── LANG ───────────────────────────────────────────────────────────────────
const langBtn = document.getElementById("langToggle");
const currentLang = localStorage.getItem("mv-lang") || "fr";

// If the page doesn't match saved lang, redirect to /en/ or /fr/ equivalent
// Simple approach: store pref and reload with ?lang= param
langBtn?.addEventListener("click", () => {
  const next = currentLang === "fr" ? "en" : "fr";
  localStorage.setItem("mv-lang", next);
  const url = new URL(window.location.href);
  url.searchParams.set("lang", next);
  window.location.href = url.toString();
});

// ── MOBILE NAV ─────────────────────────────────────────────────────────────
const burger = document.getElementById("navBurger");
const navLinks = document.querySelector(".nav-links");
burger?.addEventListener("click", () => navLinks?.classList.toggle("open"));

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

  function getCardData(card) {
    return {
      title: (card.dataset.title || "").toLowerCase(),
      game: card.dataset.game || "",
      category: card.dataset.category || "",
      tags: (card.dataset.tags || "").toLowerCase(),
      date: card.dataset.date || "0",
      name: (card.dataset.title || "").toLowerCase(),
    };
  }

  function applyFilters() {
    let visible = [];

    cards.forEach((card) => {
      const d = getCardData(card);
      const matchGame = activeGame === "all" || d.game === activeGame;
      const matchSearch =
        !searchTerm ||
        d.title.includes(searchTerm) ||
        d.tags.includes(searchTerm) ||
        d.category.toLowerCase().includes(searchTerm);
      const matchTags =
        activeTags.size === 0 ||
        [...activeTags].every((t) => d.tags.includes(t));

      if (matchGame && matchSearch && matchTags) {
        card.classList.remove("hidden");
        visible.push(card);
      } else {
        card.classList.add("hidden");
      }
    });

    // Sort
    visible.sort((a, b) => {
      const da = getCardData(a);
      const db = getCardData(b);
      if (sortMode === "date") return db.date.localeCompare(da.date);
      if (sortMode === "name") return da.name.localeCompare(db.name);
      return 0;
    });

    // Re-order in DOM
    visible.forEach((card) => grid.appendChild(card));

    // No results
    if (noResults) {
      noResults.classList.toggle("hidden", visible.length > 0);
    }
  }

  // Search
  searchInput?.addEventListener("input", (e) => {
    searchTerm = e.target.value.trim().toLowerCase();
    applyFilters();
  });

  // Filter buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.filterType;
      const val = btn.dataset.filterValue;

      if (type === "game") {
        activeGame = val;
        document
          .querySelectorAll('[data-filter-type="game"]')
          .forEach((b) => b.classList.remove("active"));
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

  // Sort
  sortSelect?.addEventListener("change", (e) => {
    sortMode = e.target.value;
    applyFilters();
  });
})();

// ── STAGGERED CARD ANIMATION ───────────────────────────────────────────────
document.querySelectorAll(".mod-card").forEach((card, i) => {
  card.style.animationDelay = `${i * 40}ms`;
});
