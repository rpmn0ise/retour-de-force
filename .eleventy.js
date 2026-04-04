const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  // Passthrough copies
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy("CNAME");

  // Markdown
  const md = markdownIt({ html: true, linkify: true, typographer: true });
  eleventyConfig.setLibrary("md", md);

  // Collections
  eleventyConfig.addCollection("mods", (api) =>
    api.getFilteredByGlob("content/**/*.md")
       .filter(m => !m.inputPath.includes("_TEMPLATE"))
       .sort((a, b) => (b.data.date || 0) - (a.data.date || 0))
  );

  eleventyConfig.addCollection("beamng", (api) =>
    api.getFilteredByGlob("content/beamng/*.md")
       .filter(m => !m.inputPath.includes("_TEMPLATE"))
       .sort((a, b) => (b.data.date || 0) - (a.data.date || 0))
  );

  eleventyConfig.addCollection("assetto", (api) =>
    api.getFilteredByGlob("content/assetto/*.md")
       .filter(m => !m.inputPath.includes("_TEMPLATE"))
       .sort((a, b) => (b.data.date || 0) - (a.data.date || 0))
  );

  // Mods des 7 derniers jours — calculé au moment du build
  eleventyConfig.addCollection("recent", (api) => {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return api.getFilteredByGlob("content/**/*.md")
      .filter(m => !m.inputPath.includes("_TEMPLATE"))
      .filter(m => {
        if (!m.data.date) return false;
        return new Date(m.data.date).getTime() >= cutoff;
      })
      .sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
  });

  // Auteurs — dédupliqués avec leurs mods
  eleventyConfig.addCollection("auteurs", (api) => {
    const mods = api.getFilteredByGlob("content/**/*.md")
      .filter(m => !m.inputPath.includes("_TEMPLATE"));
    const map = {};
    mods.forEach(mod => {
      const author = mod.data.author;
      if (!author) return;
      if (!map[author]) {
        map[author] = {
          name: author,
          slug: author.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, ""),
          mods: [],
        };
      }
      map[author].mods.push(mod);
    });
    Object.values(map).forEach(a => {
      a.mods.sort((x, y) => (y.data.date || 0) - (x.data.date || 0));
    });
    return Object.values(map).sort((a, b) => a.name.localeCompare(b.name));
  });

  // Filters
  eleventyConfig.addFilter("dateFormat", (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR", {
      year: "numeric", month: "short", day: "numeric",
    });
  });

  eleventyConfig.addFilter("jsonify", (data) => JSON.stringify(data));

  eleventyConfig.addFilter("slugifyAuthor", (str) =>
    (str || "").toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );

  return {
    pathPrefix: "/retour-de-force/",
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
