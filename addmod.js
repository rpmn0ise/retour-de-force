#!/usr/bin/env node
// ─────────────────────────────────────────────
// Retour de Force — addmod.js
// Génère un fichier .md prêt à l'emploi dans
// content/beamng/ ou content/assetto/
// Usage : node addmod.js
// ─────────────────────────────────────────────

const inquirer = require("inquirer");
const fs       = require("fs");
const path     = require("path");

// ── Chemin vers le repo (dossier parent du script) ──────────────────────────
const REPO_ROOT = path.resolve(__dirname);
const CONTENT   = path.join(REPO_ROOT, "content");

// ── Slugify manuel (pas de dépendance externe nécessaire) ───────────────────
function slugify(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Date du jour au format YYYY-MM-DD ───────────────────────────────────────
function today() {
  return new Date().toISOString().split("T")[0];
}

// ── Instructions d'installation selon le jeu ────────────────────────────────
function installInstructions(game) {
  if (game === "beamng") {
    return `## Installation

1. Télécharger le fichier \`.zip\`
2. Ouvrir **BeamNG.drive** → aller dans le **Repository** (icône carton)
3. Glisser-déposer le fichier \`.zip\` dans la fenêtre
4. Activer le mod dans la liste, puis redémarrer le jeu

> Compatible BeamNG.drive 0.30+`;
  } else {
    return `## Installation

1. Télécharger le fichier \`.zip\`
2. Extraire le contenu dans le dossier correspondant :
   - **Voiture** → \`Assetto Corsa/content/cars/\`
   - **Circuit** → \`Assetto Corsa/content/tracks/\`
   - **Skin** → \`Assetto Corsa/content/cars/NOM_VOITURE/skins/\`
3. Lancer **Content Manager** → vérifier que le mod apparaît
4. (Optionnel) Vérifier l'intégrité depuis Content Manager

> Compatible Assetto Corsa 1.16+ · Custom Shaders Patch recommandé`;
  }
}

// ── Template markdown complet ────────────────────────────────────────────────
function generateMarkdown({ title, game, category, author, version, date, image, download, source, tags, description }) {
  const tagList = tags.map(t => `  - ${t.trim()}`).join("\n");

  return `---
layout: layouts/mod.njk
title: "${title}"
game: ${game}
category: "${category}"
author: "${author}"
version: "${version}"
date: ${date}
image: "${image}"
download: "${download}"
source: "${source}"
tags:
${tagList}
description: "${description}"
---

## Description

${description}

${installInstructions(game)}

## Notes de version

- **v${version}** — Version initiale

## Crédits

Créé par **${author}**. Vérifié et validé par l'équipe Retour de Force.
`;
}

// ── Catégories disponibles par jeu ──────────────────────────────────────────
const CATEGORIES = {
  beamng:  ["Véhicule", "Map", "Scénario", "Config", "Utilitaire"],
  assetto: ["Voiture", "Circuit", "Skin", "App", "Config"],
};

// ── Questions CLI ────────────────────────────────────────────────────────────
async function main() {
  console.log("\n┌─────────────────────────────────────┐");
  console.log("│   Retour de Force — Ajout de mod    │");
  console.log("└─────────────────────────────────────┘\n");

  const { game } = await inquirer.prompt([
    {
      type: "list",
      name: "game",
      message: "Jeu :",
      choices: [
        { name: "BeamNG.drive", value: "beamng" },
        { name: "Assetto Corsa", value: "assetto" },
      ],
    },
  ]);

  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Titre du mod :",
      validate: v => v.trim().length > 0 || "Le titre est obligatoire",
    },
    {
      type: "list",
      name: "category",
      message: "Catégorie :",
      choices: CATEGORIES[game],
    },
    {
      type: "input",
      name: "author",
      message: "Auteur :",
      validate: v => v.trim().length > 0 || "L'auteur est obligatoire",
    },
    {
      type: "input",
      name: "version",
      message: "Version :",
      default: "1.0.0",
    },
    {
      type: "input",
      name: "date",
      message: "Date de mise à jour (YYYY-MM-DD) :",
      default: today(),
      validate: v => /^\d{4}-\d{2}-\d{2}$/.test(v) || "Format attendu : YYYY-MM-DD",
    },
    {
      type: "input",
      name: "image",
      message: "URL image de preview (Imgur, etc.) :",
      default: "",
    },
    {
      type: "input",
      name: "download",
      message: "URL de téléchargement :",
      validate: v => v.trim().length > 0 || "Le lien de téléchargement est obligatoire",
    },
    {
      type: "input",
      name: "source",
      message: "Source (ex: Discord #mods-beamng, Google Drive...) :",
      default: "Discord",
    },
    {
      type: "input",
      name: "tags",
      message: "Tags (séparés par des virgules) :",
      default: "",
      filter: v => v.split(",").map(t => t.trim()).filter(Boolean),
    },
    {
      type: "input",
      name: "description",
      message: "Description courte (une phrase pour le SEO) :",
      validate: v => v.trim().length > 0 || "La description est obligatoire",
    },
  ]);

  const data = { game, ...answers };
  const slug = slugify(data.title);
  const filename = `${slug}.md`;
  const destDir  = path.join(CONTENT, game);
  const destFile = path.join(destDir, filename);

  // Créer le dossier si besoin
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Vérifier si le fichier existe déjà
  if (fs.existsSync(destFile)) {
    const { overwrite } = await inquirer.prompt([
      {
        type: "confirm",
        name: "overwrite",
        message: `⚠️  Le fichier ${filename} existe déjà. Écraser ?`,
        default: false,
      },
    ]);
    if (!overwrite) {
      console.log("\n❌ Annulé. Aucun fichier modifié.\n");
      process.exit(0);
    }
  }

  const content = generateMarkdown(data);
  fs.writeFileSync(destFile, content, "utf8");

  console.log("\n✅ Fichier créé avec succès :");
  console.log(`   ${path.relative(process.cwd(), destFile)}`);
  console.log("\n📝 Prochaines étapes :");
  console.log("   1. Ouvrir le fichier pour compléter la description si besoin");
  console.log("   2. git add . && git commit -m \"feat: " + data.title + "\"");
  console.log("   3. git push\n");
}

main().catch(err => {
  console.error("\n❌ Erreur :", err.message);
  process.exit(1);
});
