**README.md** — remplace le contenu actuel sur GitHub :

# Retour de Force

Plateforme de référencement de mods vérifiés pour **BeamNG.drive** et **Assetto Corsa**.  
Chaque mod est validé manuellement via Discord avant d'être publié.

🔗 **Site en ligne** : [rpmn0ise.github.io/retour-de-force](https://rpmn0ise.github.io/retour-de-force/)

---

## Fonctionnalités

- Catalogue de mods en grille avec page détail pour chaque mod
- Filtres par jeu, catégorie et tags
- Recherche en temps réel
- Tri par date ou par nom
- Page de statistiques (répartition, top tags, dernier ajout)
- Dark mode / Light mode
- Bilingue FR / EN côté client

## Stack technique

| Outil | Rôle |
|---|---|
| [Eleventy (11ty)](https://www.11ty.dev/) | Générateur de site statique |
| GitHub Pages | Hébergement |
| GitHub Actions | Déploiement automatique |
| Markdown | Format de contenu |

Zéro base de données. Zéro CMS. Zéro dépendance runtime.

## Structure

retour-de-force/
├── content/
│   ├── beamng/        ← un .md par mod BeamNG
│   └── assetto/       ← un .md par mod Assetto Corsa
├── _includes/         ← layouts et composants Nunjucks
├── _data/             ← config, traductions i18n
├── assets/            ← CSS, JS, icônes
└── .github/workflows/ ← déploiement automatique


## Frontmatter d'un mod

```yaml
---
layout: layouts/mod.njk
title: "Nom du mod"
game: beamng          # beamng | assetto
category: "Véhicule"
author: "NomAuteur"
version: "1.0.0"
date: 2024-03-15
image: "https://i.imgur.com/XXXXXXX.jpg"
download: "https://lien.com"
source: "Discord #mods-beamng"
tags:
  - drift
  - JDM
---
```

---

*Tous les mods sont vérifiés via Discord avant publication.*

---

# Retour de Force (EN)

Verified mod listing platform for **BeamNG.drive** and **Assetto Corsa**.  
Every mod is manually reviewed through Discord before being published.

🔗 **Live site**: [rpmn0ise.github.io/retour-de-force](https://rpmn0ise.github.io/retour-de-force/)

---

## Features

- Mod catalogue with grid layout and individual detail pages
- Filters by game, category and tags
- Real-time search
- Sort by date or name
- Statistics page (breakdown, top tags, latest addition)
- Dark mode / Light mode
- Bilingual FR / EN client-side

## Tech stack

| Tool | Role |
|---|---|
| [Eleventy (11ty)](https://www.11ty.dev/) | Static site generator |
| GitHub Pages | Hosting |
| GitHub Actions | Automatic deployment |
| Markdown | Content format |

No database. No CMS. No runtime dependencies.


*All mods are Discord-verified before publication.*
