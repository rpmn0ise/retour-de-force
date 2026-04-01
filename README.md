# ModVault — Guide de mise en route

Site statique de référencement de mods pour **BeamNG.drive** et **Assetto Corsa**.  
Stack : Eleventy (11ty) · GitHub Pages · Markdown · Zéro base de données.

---

## Structure du projet

```
modvault/
├── .github/
│   └── workflows/
│       └── deploy.yml          ← déploiement auto GitHub Actions
├── _data/
│   ├── i18n.json               ← traductions FR / EN
│   └── site.json               ← config globale (nom, catégories...)
├── _includes/
│   ├── layouts/
│   │   ├── base.njk            ← layout HTML global (header, footer)
│   │   └── mod.njk             ← layout page détail d'un mod
│   └── partials/
│       └── mod-card.njk        ← composant carte mod (grid)
├── assets/
│   ├── css/main.css            ← tous les styles (dark mode, grid, cards...)
│   ├── js/main.js              ← search, filtres, tri, theme toggle
│   └── icons/favicon.svg
├── content/
│   ├── _TEMPLATE.md            ← template à copier pour chaque nouveau mod
│   ├── beamng/                 ← un .md par mod BeamNG
│   └── assetto/                ← un .md par mod Assetto Corsa
├── index.njk                   ← page d'accueil (tous les mods)
├── beamng.njk                  ← listing BeamNG uniquement
├── assetto.njk                 ← listing Assetto Corsa uniquement
├── about.njk                   ← page à propos
├── .eleventy.js                ← config Eleventy
├── .gitignore
└── package.json
```

---

## 1. Installation locale

```bash
# Cloner le repo
git clone https://github.com/TON-USERNAME/modvault.git
cd modvault

# Installer les dépendances
npm install

# Lancer en dev (hot reload sur http://localhost:8080)
npm start

# Build de production (génère le dossier _site/)
npm run build
```

---

## 2. Déploiement GitHub Pages

### Première fois

1. Créer un repo GitHub (ex: `modvault`)
2. Pusher le code sur la branche `main`
3. Aller dans **Settings → Pages**
4. Source : **GitHub Actions**
5. Le workflow `.github/workflows/deploy.yml` se déclenche automatiquement à chaque push sur `main`

### URL du site

Par défaut : `https://TON-USERNAME.github.io/modvault/`

Si tu veux un sous-domaine custom, ajouter un fichier `CNAME` à la racine :
```
mods.ton-domaine.fr
```

### ⚠️ Adapter la base URL

Dans `_data/site.json`, mettre à jour :
```json
"base_url": "https://TON-USERNAME.github.io/modvault"
```

---

## 3. Ajouter un mod

### Copier le template

```bash
cp content/_TEMPLATE.md content/beamng/nom-du-mod.md
# ou
cp content/_TEMPLATE.md content/assetto/nom-du-mod.md
```

### Remplir le frontmatter

```yaml
---
layout: layouts/mod.njk

title: "Nom du mod"
game: beamng          # beamng | assetto
category: "Véhicule"  # voir liste ci-dessous
author: "NomAuteur"

version: "1.0.0"
date: 2024-03-15      # YYYY-MM-DD — utilisé pour le tri par date

image: "https://i.imgur.com/XXXXXXX.jpg"   # URL image 16:9
download: "https://lien-telechargement.com"
source: "Discord #mods-beamng"

tags:
  - drift
  - JDM
---

Contenu markdown libre ici...
```

### Catégories disponibles

| BeamNG | Assetto Corsa |
|--------|--------------|
| Véhicule | Voiture |
| Map | Circuit |
| Scénario | Skin |
| Config | App |
| Utilitaire | Config |

Pour ajouter une catégorie, l'éditer dans `_data/site.json`.

### Images

Héberger les images sur **Imgur**, **Cloudinary**, ou tout CDN public.  
Format recommandé : 16:9, minimum 800×450px, JPEG ou WebP.

---

## 4. i18n (FR / EN)

Les traductions sont dans `_data/i18n.json`.  
L'utilisateur switche la langue via le bouton **FR/EN** dans la navbar — la préférence est sauvegardée en `localStorage`.

Pour ajouter une langue :
1. Ajouter une clé dans `i18n.json`
2. Mettre à jour `langBtn` dans `assets/js/main.js`

---

## 5. Personnaliser le design

Toutes les variables CSS sont dans `assets/css/main.css` au début du fichier :

```css
:root {
  --c-accent: #e8f048;     /* couleur d'accentuation principale */
  --c-beamng: #f97316;     /* orange BeamNG */
  --c-assetto: #3b82f6;    /* bleu Assetto */
  --font-display: 'Syne';  /* police titres */
  --font-mono: 'DM Mono';  /* police mono / labels */
  ...
}
```

---

## 6. Renommer le site

Remplacer `ModVault` par ton nom dans :
- `_data/site.json` → `"site_name"`
- `_data/i18n.json` → `"site_name"` (FR et EN)
- `assets/icons/favicon.svg` (optionnel)

---

## Stack & dépendances

| Package | Rôle |
|---------|------|
| `@11ty/eleventy` | Générateur de site statique |
| `markdown-it` | Rendu markdown |
| `gray-matter` | Parsing frontmatter |

Pas de framework JS côté client. Pas de CSS framework. Zéro dépendance runtime.
