# రక్షాబంధన్ — ఒక దారం చెప్పే మాట
### *Raksha Bandhan — A 3D Cinematic Digital Storybook*

[![Language: Telugu](https://img.shields.io/badge/Language-Telugu-orange.svg)](#)
[![Tech: HTML5 / Vanilla JS / Three.js](https://img.shields.io/badge/Tech-HTML5%20%7C%20Three.js-blue.svg)](#)
[![Author: Suresh Thota](https://img.shields.io/badge/Author-Suresh%20Thota-green.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey.svg)](#)

> **"బంధం అంటే రక్షించడం మాత్రమే కాదు… తోడుగా ఉండడం."**  
> An emotional, cinematic 26-page digital storybook exploring the deeper philosophical meaning of Raksha Bandhan across family, distance, soldiers at the border, national unity, and spiritual wisdom.

---

## ✨ Key Features

- 📖 **26 Storybook Pages & 5 Thematic Chapters**: Complete authentic Telugu manuscript by Suresh Thota.
  - **Chapter 1**: కుటుంబం & అనుబంధం (*Family & Sibling Bond*)
  - **Chapter 2**: దూరం & జ్ఞాపకాలు (*Distance & Memories*)
  - **Chapter 3**: సైనికుల రక్ష & త్యాగం (*Soldiers & Sacrifice*)
  - **Chapter 4**: జాతి సమైక్యత & కృతజ్ఞత (*Nation & Gratitude*)
  - **Chapter 5**: దివ్య సత్యం & ముగింపు (*Wisdom & Conclusion*)
- 🌌 **Three.js Cinematic 3D Engine**: Ambient golden dust particles, depth parallax, and smooth lighting.
- 🎧 **Audio & Ambience**: Page-by-page background musical moods and audio narration integration.
- 🎨 **3D AI Prompt Inspector**: Built-in modal to view and copy high-fidelity 3D animation prompts and negative prompt presets for Midjourney / Flux.
- 📱 **Full Mobile & Touch Support**: Intuitive swipe navigation, touch feedback, and responsive viewport sizing.
- ⌨️ **Keyboard Navigation**: Fast page-turning and accessibility controls.
- 🚀 **Zero Build Step Required**: Clean Vanilla JavaScript, CSS3, and HTML5 that runs directly in any modern browser.

---

## 📁 Project Structure

```text
├── index.html               # Main standalone storybook web application
├── server.js                # Lightweight Node.js local streaming server
├── server.ps1               # Lightweight PowerShell static HTTP server
├── vercel.json              # Vercel deployment and caching configuration
├── build_package.ps1        # Script to create production deployment ZIP
├── assets/
│   ├── images/              # High-resolution 3D illustrations (page_1 to page_26)
│   └── audio/               # Ambient soundtracks and narration audio files
├── js/
│   ├── app.js               # Application coordinator & state management
│   ├── data/
│   │   └── bookData.js      # Complete 26-page Telugu text, prompts & metadata
│   ├── components/          # Modular UI components (Book, Hero, Nav, Modals)
│   └── visual/              # Three.js particle and background visual systems
└── styles/
    ├── main.css             # Design tokens, typography & base styling
    ├── book.css             # 3D book spread, pages & card layout
    ├── mobile.css           # Responsive breakpoints and mobile enhancements
    └── visual.css           # Animation keyframes and particle canvas styles
```

---

## 🚀 Getting Started

You can run the storybook locally using any of the methods below:

### Method 1: Node.js (Recommended)
```bash
node server.js
```
Open your browser and visit: **`http://localhost:3000`**

### Method 2: PowerShell
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
Open your browser and visit: **`http://localhost:3000`**

### Method 3: Direct File / Live Server
Simply open `index.html` directly in your browser or run via VS Code **Live Server**.

---

## 🎮 Navigation & Controls

| Action | Shortcut / Gesture |
| :--- | :--- |
| **Next Page** | `Right Arrow (→)`, `Spacebar`, or **Swipe Left** |
| **Previous Page** | `Left Arrow (←)` or **Swipe Right** |
| **First Page (Cover)** | `Home` key |
| **Last Page** | `End` key |
| **Close Modals / TOC** | `Escape` key |
| **Inspect 3D Prompt** | Click the **"🔍 ప్రాంప్ట్ చూడండి"** button on any page |
| **Table of Contents** | Click the **"📑 విషయ సూచిక"** icon in the navigation bar |

---

## 🌐 Deployment

### Deploy to Vercel
This repository includes a pre-configured `vercel.json`. You can deploy directly with:
```bash
npx vercel
```

### Create Distribution ZIP
Run the automated packaging script to generate `raksha_bandhan_storybook.zip`:
```powershell
powershell -ExecutionPolicy Bypass -File .\build_package.ps1
```

---

## 👨‍💻 Author & Credits

- **Story & Concept**: Suresh Thota (మీ సురేష్ తోట)
- **Design & Experience**: 3D Cinematic Telugu Digital Storybook Engine
- **Fonts**: *Noto Serif Telugu*, *Noto Sans Telugu*, *Cinzel*, *Outfit* (Google Fonts)
