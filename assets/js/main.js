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

  // Tous les éléments avec data-i18n → textContent
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Inputs avec data-i18n-placeholder → placeholder
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.dataset.i18nPlaceholder;
    if (t[key] !== undefined) el.placeholder = t[key];
  });

  // Options de select avec data-i18n → textContent
  document.querySelectorAll("option[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });

  // Blocs de contenu long (about, etc.)
  applyLangBlocks(lang);

  localStorage.setItem("mv-lang", lang);
}

// Lire la langue sauvegardée ou défaut FR
const savedLang = localStorage.getItem("mv-lang") || "fr";
applyLang(savedLang);

// Bouton toggle
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


/* ── STATS PAGE ─────────────────────────────────────────────────────────── */
.stats-page {
  max-width: var(--max-w);
  margin: 0 auto;
  padding-bottom: 80px;
}

.stats-grid-top {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 16px;
  padding: 0 24px 40px;
}

.stat-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-card);
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  transition: transform var(--transition-slow), box-shadow var(--transition-slow);
}
.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-card-hover);
}

.stat-number {
  font-family: var(--font-display);
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
}
.stat-label {
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--c-text-muted);
}

.stat-card--total   .stat-number { color: var(--c-accent); }
.stat-card--beamng  .stat-number { color: var(--c-beamng); }
.stat-card--assetto .stat-number { color: var(--c-assetto); }
.stat-card--tags    .stat-number { color: var(--c-verified); }

.stats-section {
  padding: 0 24px 40px;
}
.stats-section-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: var(--c-text-muted);
  margin-bottom: 16px;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.1em;
}

/* Barre split BeamNG / Assetto */
.split-bar-wrap { padding: 4px 0; }
.split-bar {
  display: flex;
  height: 40px;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--c-surface-2);
}
.split-bar__beamng,
.split-bar__assetto {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 500;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 60px;
}
.split-bar__beamng  { background: var(--c-beamng);  color: #fff; }
.split-bar__assetto { background: var(--c-assetto); color: #fff; }

/* Barres par catégorie */
.category-list { display: flex; flex-direction: column; gap: 10px; }
.category-row {
  display: grid;
  grid-template-columns: 120px 1fr 32px;
  align-items: center;
  gap: 12px;
}
.category-name {
  font-size: 13px;
  color: var(--c-text-muted);
  text-align: right;
  font-family: var(--font-mono);
}
.category-bar-wrap {
  height: 8px;
  background: var(--c-surface-2);
  border-radius: 100px;
  overflow: hidden;
}
.category-bar {
  height: 100%;
  border-radius: 100px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 8px;
}
.category-bar--beamng  { background: var(--c-beamng); }
.category-bar--assetto { background: var(--c-assetto); }
.category-count {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--c-text-dim);
  text-align: right;
}

/* Tags cloud */
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag-stat {
  padding: 5px 12px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 100px;
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--c-text-muted);
}

/* Dernier mod */
.latest-mod-card {
  display: flex;
  gap: 20px;
  align-items: center;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--radius-card);
  padding: 16px;
  transition: border-color var(--transition), transform var(--transition-slow);
  max-width: 520px;
}
.latest-mod-card:hover {
  border-color: var(--c-border-hover);
  transform: translateY(-2px);
}
.latest-mod-img {
  width: 120px;
  height: 68px;
  object-fit: cover;
  border-radius: var(--radius);
  flex-shrink: 0;
}
.latest-mod-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.latest-mod-title {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--c-text);
}
.latest-mod-meta {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--c-text-dim);
}

@media (max-width: 480px) {
  .category-row { grid-template-columns: 90px 1fr 28px; }
  .latest-mod-card { flex-direction: column; }
  .latest-mod-img { width: 100%; height: auto; }
}
