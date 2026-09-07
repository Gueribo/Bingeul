# Bingeul (빙글) — K-Drama Tracker 🇰🇷

**Bingeul** is a fast, lightweight, mobile-first Progressive Web App (PWA) designed for tracking Korean dramas. 
Built with vanilla HTML5, modern CSS custom properties, and modular JavaScript, Bingeul provides a seamless native app-like experience with offline support and custom theme engine integration.

---

### Why "Bingeul"?

The name **Bingeul** is a portmanteau of two concepts:
* **Binge** (from *binge-watching*): The act of watching multiple episodes of a series in rapid succession.
* **Geul / 글** (from *Hangeul*): The Korean word for *writing*, *text*, or *entry* (as in a journal or notebook).

Together, **Bingeul** translates to a **"notebook of K-drama binge-watching"** — your personal logbook for tracking everything you've watched or plan to play.

---

## 💡 Inspiration & Motivation

Bingeul was created following the shutdown of **TV Time**. Needing a reliable replacement that didn't depend entirely on third-party cloud services or unstable servers, Bingeul was built with an **offline-first philosophy**. 

By leveraging browser `localStorage` and Service Worker caching, all your watch history and list data remain 100% personal, locally stored, and fully accessible even without an active internet connection.

---

## ✨ Features

- 📱 **Mobile-First & App-Like:** Optimized touch targets, smooth modal transitions, and responsive grid layouts.
- 🌙 **Adaptive Themes:** Built-in **Dark** (`#0b0e14`) and **Pastel** (`#f4effa`) color palettes with dynamic CSS variables.
- ⚡ **Offline-Ready PWA:** Fully functional offline state via Service Worker caching (App Shell architecture).
- 🎬 **Rich Media Data:** Powered by the **TMDB API** for posters, episode counts, synopsis, cast, and recommendations.
- 🇰🇷 **Smart Filtering:** Quick toggle to filter content for K-dramas only.
- 💾 **Local Persistence:** Progress and watchlist saved directly to browser `localStorage` — no login required.
- 🌐 **Multilingual Ready:** Built-in i18n support (French, English).

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Custom Variables, Flexbox, Grid), JavaScript (ES6 Modules)
- **Data Source:** [TMDB API](https://www.themoviedb.org/documentation/api) *(Optionally expanding to [RAWG API](https://rawg.io/apidocs) for game tracking)*
- **PWA Capabilities:** Web App Manifest, Service Worker (`sw.js` with Stale-While-Revalidate caching)

---

## 📁 Project Structure

```
bingeul/
├── index.html            # Main HTML document with defer script loading
├── styles.css            # Custom layout grid, animations, and theme variables
├── app.js                # Application logic, TMDB API integration, and DOM updates
├── sw.js                 # Service Worker managing offline App Shell cache
├── manifest.json         # PWA installation and display configuration
├── icon-192.png          # Standard icon (192x192)
├── icon-512.png          # High-resolution icon (512x512)
├── icon-512-maskable.png # Android maskable icon
└── apple-touch-icon.png  # iOS Safari home screen icon (180x180)
