const TMDB_API_KEY = "15d2ea6d0dc1d476efbca3eba2b9bbfb"; 

let dramas = JSON.parse(localStorage.getItem('tvtime_modal_kdrama_data')) || [];
let activeModalDramaId = null;
let currentFilter = 'all';
let currentLang = localStorage.getItem('tvtime_lang') || 'en';
let koreanOnlySearch = localStorage.getItem('tvtime_korean_only') !== '0';
const activeBlobUrls = new Map(); 

const i18n = {
  en: {
    subtitle: "Le carnet du binge-watching",
    searchPlaceholder: "Search title (e.g. Vincenzo)...",
    btnSearch: "Search",
    btnBackup: "Backup",
    btnRestore: "Restore",
    btnRecs: "Recommendations",
    dataLabel: "Data",
    recsModalTitle: "Recommended for you",
    recsModalSub: "Based on your favorites and top-rated shows",
    noRecsSource: "Add favorites or rate some shows first to get recommendations.",
    dashCompleted: "Completed",
    dashEpisodes: "Episodes",
    dashHours: "Time Spent",
    tabAll: "All",
    tabWatching: "Watching",
    tabCompleted: "Completed",
    tabPlan: "Plan to Watch",
    tabFavorites: "♥ Favorites",
    optUpdated: "Recently Updated",
    optTitle: "Title (A-Z)",
    optRating: "My Rating",
    optProgress: "Progress %",
    resultsTitle: "Tap a show to add:",
    btnCloseResults: "✕",
    rewatchedLabel: "Rewatched:",
    progressLabel: "Progress",
    overviewTitle: "Overview",
    castTitle: "Cast & Actors",
    recommendationsTitle: "Recommendations",
    posterModalTitle: "Select Poster Artwork",
    posterModalSub: "Choose your preferred cover design",
    settingsTitle: "Parameters",
    settingsSub: "Customize app preferences",
    appearanceLabel: "Appearance",
    languageLabel: "Language",
    themeNight: "🌙 Night",
    themePastel: "🌸 Pastel",
    markAll: "Mark All",
    unmarkAll: "Finished",
    noShowsFound: "No shows found.",
    alreadyInList: "is already in your list!",
    previewAdd: "Add to my list",
    previewMarkWatched: "Mark as watched",
    previewRemove: "Remove from my list",
    inListBadge: "In List",
    unrated: "Unrated",
    noOverview: "No summary available.",
    trailerLabel: "Watch trailer",
    presentLabel: "Present",
    koreanOnlyLabel: "🇰🇷 K-dramas only",
    statusReturning: "Ongoing",
    statusEnded: "Completed",
    statusCanceled: "Canceled",
    statusInProduction: "In production",
    statusPlanned: "Planned",
    statusPilot: "Pilot",
    menuFav: "Add to favorites",
    menuUnfav: "Remove from favorites",
    menuPoster: "Change poster",
    menuDelete: "Delete",
    loadingCast: "Loading cast...",
    noCast: "No cast information available.",
    noCastFound: "No cast details found.",
    failedCast: "Failed to load cast.",
    loadingRecs: "Loading...",
    noRecs: "No recommendations available.",
    noRecsFound: "No recommendations found.",
    failedRecs: "Failed to load recommendations.",
    loadingArt: "Loading artwork options...",
    noTmdbLink: "No TMDB link found for this show.",
    noAltPosters: "No alternate posters available.",
    failedPosters: "Failed to load posters.",
    confirmDelete: "Are you sure you want to remove",
    emptyCollection: "Collection is empty!",
    enterBackupName: "Enter a name for your backup file:",
    restoreSuccess: "Restored successfully!",
    invalidFile: "Invalid file format.",
    metaSuccess: "Show structure updated!",
    metaNoDetails: "No season details found on TMDB.",
    metaNoId: "Cannot refresh: missing TMDB ID.",
    metaFailed: "Failed to refresh show metadata.",
    refreshAllLabel: "Refresh all shows",
    maintenanceLabel: "Maintenance",
    refreshingProgress: "Refreshing",
    refreshAllDone: "Shows updated:",
    refreshAllFailed: "Failed:"
  },
  fr: {
    subtitle: "Le carnet du binge-watching",
    searchPlaceholder: "Rechercher un titre (ex. Vincenzo)...",
    btnSearch: "Chercher",
    btnBackup: "Sauvegarde",
    btnRestore: "Importer",
    btnRecs: "Recommandations",
    dataLabel: "Données",
    recsModalTitle: "Recommandé pour toi",
    recsModalSub: "Basé sur tes favoris et séries les mieux notées",
    noRecsSource: "Ajoute des favoris ou note quelques séries pour obtenir des recommandations.",
    dashCompleted: "Terminés",
    dashEpisodes: "Épisodes",
    dashHours: "Temps Passé",
    tabAll: "Tous",
    tabWatching: "En cours",
    tabCompleted: "Terminés",
    tabPlan: "À voir",
    tabFavorites: "♥ Favoris",
    optUpdated: "Récemment mis à jour",
    optTitle: "Titre (A-Z)",
    optRating: "Ma Note",
    optProgress: "Progression %",
    resultsTitle: "Appuyez sur une série pour l'ajouter :",
    btnCloseResults: "✕",
    rewatchedLabel: "Revu :",
    progressLabel: "Progression",
    overviewTitle: "Aperçu",
    castTitle: "Casting & Acteurs",
    recommendationsTitle: "Recommandations",
    posterModalTitle: "Choisir l'affiche",
    posterModalSub: "Sélectionnez votre visuel préféré",
    settingsTitle: "Paramètres",
    settingsSub: "Personnaliser les préférences de l'application",
    appearanceLabel: "Apparence",
    languageLabel: "Langue",
    themeNight: "🌙 Mode Nuit",
    themePastel: "🌸 Mode Pastel",
    markAll: "Marquer comme vu",
    unmarkAll: "Terminé",
    noShowsFound: "Aucune série trouvée.",
    alreadyInList: "est déjà dans votre liste !",
    previewAdd: "Ajouter à ma liste",
    previewMarkWatched: "Marquer comme vu",
    previewRemove: "Retirer de ma liste",
    inListBadge: "Dans la liste",
    unrated: "Non noté",
    noOverview: "Aucun résumé disponible.",
    trailerLabel: "Voir la bande-annonce",
    presentLabel: "Présent",
    koreanOnlyLabel: "🇰🇷 K-dramas uniquement",
    statusReturning: "En cours",
    statusEnded: "Terminée",
    statusCanceled: "Annulée",
    statusInProduction: "En production",
    statusPlanned: "Prévue",
    statusPilot: "Pilote",
    menuFav: "Ajouter aux favoris",
    menuUnfav: "Retirer des favoris",
    menuPoster: "Changer l'affiche",
    menuDelete: "Supprimer",
    loadingCast: "Chargement du casting...",
    noCast: "Aucune information de casting disponible.",
    noCastFound: "Aucun détail de casting trouvé.",
    failedCast: "Échec du chargement du casting.",
    loadingRecs: "Chargement...",
    noRecs: "Aucune recommandation disponible.",
    noRecsFound: "Aucune recommandation trouvée.",
    failedRecs: "Échec du chargement des recommandations.",
    loadingArt: "Chargement des visuels...",
    noTmdbLink: "Lien TMDB introuvable pour cette série.",
    noAltPosters: "Aucune autre affiche disponible.",
    failedPosters: "Échec du chargement des affiches.",
    confirmDelete: "Êtes-vous sûr de vouloir supprimer",
    emptyCollection: "La collection est vide !",
    enterBackupName: "Entrez un nom pour votre fichier de sauvegarde :",
    restoreSuccess: "Restauration réussie !",
    invalidFile: "Format de fichier invalide.",
    metaSuccess: "Structure de la série mise à jour !",
    metaNoDetails: "Aucun détail de saison trouvé sur TMDB.",
    metaNoId: "Impossible de rafraîchir : ID TMDB manquant.",
    metaFailed: "Échec du rafraîchissement des métadonnées.",
    refreshAllLabel: "Tout rafraîchir",
    maintenanceLabel: "Maintenance",
    refreshingProgress: "Rafraîchissement",
    refreshAllDone: "Séries mises à jour :",
    refreshAllFailed: "Échecs :"
  }
};

function applyLanguage(lang) {
  currentLang = i18n[lang] ? lang : 'en';
  localStorage.setItem('tvtime_lang', currentLang);
  const t = i18n[currentLang];

  document.getElementById('ui-subtitle').textContent = t.subtitle;
  document.getElementById('show-query').placeholder = t.searchPlaceholder;
  document.getElementById('ui-btn-search').textContent = t.btnSearch;
  document.getElementById('ui-btn-backup').textContent = t.btnBackup;
  document.getElementById('ui-btn-restore').textContent = t.btnRestore;
  document.getElementById('ui-btn-recs').textContent = t.btnRecs;
  document.getElementById('ui-setting-data-label').textContent = t.dataLabel;
  document.getElementById('ui-setting-maintenance-label').textContent = t.maintenanceLabel;
  document.getElementById('ui-btn-refresh-all').textContent = t.refreshAllLabel;
  document.getElementById('ui-recs-modal-title').textContent = t.recsModalTitle;
  document.getElementById('ui-recs-modal-sub').textContent = t.recsModalSub;
  
  document.getElementById('ui-dash-completed').textContent = t.dashCompleted;
  document.getElementById('ui-dash-episodes').textContent = t.dashEpisodes;
  document.getElementById('ui-dash-hours').textContent = t.dashHours;

  document.getElementById('tab-all').textContent = t.tabAll;
  document.getElementById('tab-watching').textContent = t.tabWatching;
  document.getElementById('tab-completed').textContent = t.tabCompleted;
  document.getElementById('tab-plan').textContent = t.tabPlan;
  document.getElementById('tab-favorites').textContent = t.tabFavorites;

  document.getElementById('opt-updated').textContent = t.optUpdated;
  document.getElementById('opt-title').textContent = t.optTitle;
  document.getElementById('opt-rating').textContent = t.optRating;
  document.getElementById('opt-progress').textContent = t.optProgress;

  document.getElementById('ui-results-title').textContent = t.resultsTitle;
  document.getElementById('ui-btn-close-results').textContent = t.btnCloseResults;

  document.getElementById('ui-rewatched-label').textContent = t.rewatchedLabel;
  document.getElementById('ui-progress-label').textContent = t.progressLabel;
  document.getElementById('ui-overview-title').textContent = t.overviewTitle;
  document.getElementById('ui-cast-title').textContent = t.castTitle;
  document.getElementById('ui-recommendations-title').textContent = t.recommendationsTitle;
  document.getElementById('ui-trailer-label').textContent = t.trailerLabel;
  document.getElementById('ui-korean-only').textContent = t.koreanOnlyLabel;

  document.getElementById('ui-poster-modal-title').textContent = t.posterModalTitle;
  document.getElementById('ui-poster-modal-sub').textContent = t.posterModalSub;

  document.getElementById('ui-settings-title').textContent = t.settingsTitle;
  document.getElementById('ui-settings-sub').textContent = t.settingsSub;
  document.getElementById('ui-setting-appearance-label').textContent = t.appearanceLabel;
  document.getElementById('ui-setting-language-label').textContent = t.languageLabel;
  
  document.getElementById('btn-theme-night').textContent = t.themeNight;
  document.getElementById('btn-theme-pastel').textContent = t.themePastel;

  document.getElementById('btn-lang-en').classList.toggle('active', currentLang === 'en');
  document.getElementById('btn-lang-fr').classList.toggle('active', currentLang === 'fr');

  if (activeModalDramaId !== null) renderModalContent(activeModalDramaId);
}

function onLanguageSelectChange(lang) {
  applyLanguage(lang);
}

function toggleClearButton() {
  const input = document.getElementById('show-query');
  const clearBtn = document.getElementById('clear-search-btn');
  clearBtn.style.display = input.value.trim().length > 0 ? 'flex' : 'none';
}

function clearSearchInput() {
  const input = document.getElementById('show-query');
  input.value = '';
  toggleClearButton();
  hideResults();
  input.focus();
}

function applyTheme(theme) {
  if (theme === 'pastel') {
    document.documentElement.setAttribute('data-theme', 'pastel');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  localStorage.setItem('tvtime_theme', theme);
  
  const nightBtn = document.getElementById('btn-theme-night');
  const pastelBtn = document.getElementById('btn-theme-pastel');
  if (nightBtn && pastelBtn) {
    nightBtn.classList.toggle('active', theme !== 'pastel');
    pastelBtn.classList.toggle('active', theme === 'pastel');
  }
}

function onThemeSelectChange(theme) {
  applyTheme(theme);
}

const savedTheme = localStorage.getItem('tvtime_theme') || 'night';
applyTheme(savedTheme);

function openSettingsModal() {
  applyTheme(localStorage.getItem('tvtime_theme') || 'night');
  applyLanguage(currentLang);
  document.getElementById('settings-modal').classList.add('active');
}

function closeSettingsModal() {
  document.getElementById('settings-modal').classList.remove('active');
}

function closeSettingsModalOnBackdrop(e) {
  if (e.target.id === 'settings-modal') closeSettingsModal();
}

function openPosterDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('DramaPostersDB', 1);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('posters')) db.createObjectStore('posters');
    };
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = () => reject('DB Error');
  });
} 

async function storePosterBlob(dramaId, blob) {
  const db = await openPosterDB();
  return new Promise((resolve) => {
    const tx = db.transaction('posters', 'readwrite');
    tx.objectStore('posters').put(blob, dramaId);
    tx.oncomplete = () => resolve();
  });
} 

async function downloadAndStorePosterBlob(dramaId, imageUrl) {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    await storePosterBlob(dramaId, blob);
  } catch (err) {}
} 

async function getPosterBlob(dramaId) {
  try {
    const db = await openPosterDB();
    return new Promise((resolve) => {
      const tx = db.transaction('posters', 'readonly');
      const request = tx.objectStore('posters').get(dramaId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch (e) { return null; }
} 

async function getPosterBlobUrl(dramaId) {
  const blob = await getPosterBlob(dramaId);
  return blob ? URL.createObjectURL(blob) : null;
} 

async function deletePosterBlob(dramaId) {
  try {
    const db = await openPosterDB();
    const tx = db.transaction('posters', 'readwrite');
    tx.objectStore('posters').delete(dramaId);
  } catch (e) {}
} 

function blobToBase64(blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });
} 

function base64ToBlob(base64Data) {
  const parts = base64Data.split(';base64,');
  const contentType = parts[0].split(':')[1];
  const raw = window.atob(parts[1]);
  const uInt8Array = new Uint8Array(raw.length); 
  for (let i = 0; i < raw.length; ++i) uInt8Array[i] = raw.charCodeAt(i);
  return new Blob([uInt8Array], { type: contentType });
} 

async function exportAppData() {
  const t = i18n[currentLang];
  if (dramas.length === 0) return alert(t.emptyCollection);
  
  const defaultFileName = `bingeul_backup_${Date.now()}`;
  const customFileName = prompt(t.enterBackupName, defaultFileName);
  if (customFileName === null) return;

  const finalFileName = customFileName.trim() !== '' ? customFileName.trim() : defaultFileName;

  const exportedPosters = {};
  for (const drama of dramas) {
    const blob = await getPosterBlob(drama.id);
    if (blob) exportedPosters[drama.id] = await blobToBase64(blob);
  } 
  const exportPayload = { dramas, posters: exportedPosters, exportDate: new Date().toISOString() };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload));
  const a = document.createElement('a');
  a.setAttribute("href", dataStr);
  a.setAttribute("download", `${finalFileName.replace(/\.json$/i, '')}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
} 

async function importAppData(event) {
  const t = i18n[currentLang];
  const file = event.target.files[0];
  if (!file) return; 
  const reader = new FileReader();
  reader.onload = async function(e) {
    try {
      const importedData = JSON.parse(e.target.result); 
      if (importedData.dramas) {
        dramas = importedData.dramas; 
        if (importedData.posters) {
          for (const [dramaId, base64String] of Object.entries(importedData.posters)) {
            try {
              const blob = base64ToBlob(base64String);
              await storePosterBlob(Number(dramaId), blob);
            } catch (err) {}
          }
        } 
        activeBlobUrls.clear();
        saveDramas();
        alert(t.restoreSuccess);
      }
    } catch (err) { alert(t.invalidFile); }
  };
  reader.readAsText(file);
} 

function saveDramas() {
  localStorage.setItem('tvtime_modal_kdrama_data', JSON.stringify(dramas));
  renderDashboard();
  renderPosters();
  if (activeModalDramaId !== null) renderModalContent(activeModalDramaId);
} 

function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderPosters();
}

function renderDashboard() {
  let completed = 0;
  let totalEpWatched = 0;

  dramas.forEach(d => {
    const watched = d.watchedEp.length;
    totalEpWatched += watched;
    if (watched === d.totalEp && d.totalEp > 0) completed++;
  });

  const totalHours = Math.round(totalEpWatched * 1.0);
  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;

  let timeString = `${totalHours}h`;
  if (days > 0) {
    timeString = `${days}d ${remainingHours}h`;
  }

  document.getElementById('dash-completed').textContent = completed;
  document.getElementById('dash-episodes').textContent = totalEpWatched;
  document.getElementById('dash-hours').textContent = timeString;
}

function hideResults() {
  document.getElementById('search-results-modal').classList.remove('active');
} 

function closeSearchResultsOnBackdrop(e) {
  if (e.target.id === 'search-results-modal') hideResults();
}

function levenshtein(a, b) {
  a = (a || '').toLowerCase();
  b = (b || '').toLowerCase();
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,      // suppression
        dp[i][j - 1] + 1,      // insertion
        dp[i - 1][j - 1] + cost // substitution
      );
    }
  }
  return dp[m][n];
}

function saveKoreanOnlyPref() {
  koreanOnlySearch = document.getElementById('korean-only-checkbox').checked;
  localStorage.setItem('tvtime_korean_only', koreanOnlySearch ? '1' : '0');
}

function filterKoreanOnly(shows) {
  if (!koreanOnlySearch) return shows;
  return shows.filter(s =>
    (s.origin_country && s.origin_country.includes('KR')) || s.original_language === 'ko'
  );
}

async function tmdbSearchTv(q) {
  const response = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}`);
  const data = await response.json();
  return data.results || [];
}

// Recherche tolérante aux fautes de frappe : si la requête telle quelle
// ne renvoie rien, on tente des variantes (ponctuation retirée, mots
// pris séparément, derniers caractères tronqués) puis on fusionne et on
// trie tous les résultats obtenus par proximité (distance de Levenshtein)
// avec le texte tapé, pour faire remonter la meilleure correspondance.
async function fuzzySearchShows(query) {
  const tried = new Set();
  const pool = new Map();

  async function tryQuery(q) {
    q = (q || '').trim();
    if (!q || tried.has(q.toLowerCase())) return;
    tried.add(q.toLowerCase());
    try {
      (await tmdbSearchTv(q)).forEach(s => pool.set(s.id, s));
    } catch (e) {}
  }

  await tryQuery(query);

  if (pool.size === 0) {
    await tryQuery(query.replace(/[^\p{L}\p{N}\s]/gu, ''));
  }

  if (pool.size === 0) {
    const words = query.split(/\s+/).filter(Boolean);
    if (words.length > 1) {
      const longest = words.reduce((a, b) => (b.length > a.length ? b : a));
      await tryQuery(longest);
      await tryQuery(words[0]);
    }
  }

  if (pool.size === 0 && query.length > 3) {
    await tryQuery(query.slice(0, -1));
    await tryQuery(query.slice(0, -2));
  }

  const candidates = Array.from(pool.values());
  candidates.sort((a, b) => levenshtein(query, a.name) - levenshtein(query, b.name));
  return candidates.slice(0, 20);
}

document.getElementById('search-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = document.getElementById('show-query').value.trim();
  if (!query) return; 

  try {
    const results = await fuzzySearchShows(query);
    renderSearchResults(filterKoreanOnly(results));
  } catch (err) { alert("Connection error."); }
}); 

function renderSearchResults(shows) {
  const t = i18n[currentLang];
  const resultsGrid = document.getElementById('results-grid');
  resultsGrid.innerHTML = ''; 

  if (shows.length === 0) {
    resultsGrid.innerHTML = `<p style="color:var(--text-muted); grid-column: 1/-1;">${t.noShowsFound}</p>`;
  } else {
    shows.forEach(show => {
      const posterUrl = show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : 'https://via.placeholder.com/300x450';
      const airYear = show.first_air_date ? show.first_air_date.split('-')[0] : 'N/A';
      const existingDrama = dramas.find(d => d.tmdbId === show.id || d.title.toLowerCase() === show.name.toLowerCase());

      const card = document.createElement('div');
      card.className = `result-card ${existingDrama ? 'in-list' : ''}`; 
      card.onclick = () => {
        if (existingDrama) {
          hideResults();
          openModal(existingDrama.id);
        } else {
          openPreviewModal(show.id, show.name, posterUrl, show.overview);
        }
      };

      card.innerHTML = `
        ${existingDrama ? `<div class="in-list-badge">${t.inListBadge}</div>` : ''}
        <img src="${posterUrl}" alt="${show.name}">
        <div class="show-name">${show.name}</div>
        <div class="show-date">${airYear}</div>
      `;
      resultsGrid.appendChild(card);
    });
  }
  document.getElementById('search-results-modal').classList.add('active');
} 

let activePreview = null;

function bookmarkIconSVG(filled) {
  return filled
    ? `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 2h12a1 1 0 0 1 1 1v18l-7-4-7 4V3a1 1 0 0 1 1-1z"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M6 2h12a1 1 0 0 1 1 1v18l-7-4-7 4V3a1 1 0 0 1 1-1z"/></svg>`;
}

async function openPreviewModal(tmdbId, title, posterUrl, overview) {
  activeModalDramaId = null;
  activePreview = { tmdbId, title, posterUrl, overview };

  hideResults();
  document.getElementById('modal-menu-btn').style.display = 'none';
  document.getElementById('modal-menu-dropdown').classList.remove('open');
  document.getElementById('owner-only-sections').style.display = 'none';

  // Affichage immédiat avec ce qu'on a déjà (titre/poster/résumé du
  // résultat de recherche), le reste (genres, casting, note, bande-annonce)
  // arrive une fois le détail TMDB récupéré.
  populateSharedModalFields({ title, backdropUrl: null, posterUrl, overview, status: null, yearStart: null, yearEnd: null, runtime: null, network: null, genres: [], voteAverage: null, voteCount: null, trailerKey: null });
  renderPrimaryActionBar(false, null);
  loadCast(tmdbId);
  loadRecommendations(tmdbId);

  document.getElementById('drama-modal').classList.add('active');
  document.body.style.overflow = 'hidden';

  let meta = null;
  try { meta = await fetchTmdbShowDetails(tmdbId); } catch (e) {}
  if (!activePreview || activePreview.tmdbId !== tmdbId) return; // fermé/changé entre-temps

  if (meta) {
    activePreview.overview = meta.overview || overview;
    populateSharedModalFields({
      title, backdropUrl: meta.backdropUrl, posterUrl, overview: activePreview.overview,
      status: meta.status, yearStart: meta.yearStart, yearEnd: meta.yearEnd,
      runtime: meta.runtime, network: meta.network, genres: meta.genres,
      voteAverage: meta.voteAverage, voteCount: meta.voteCount, trailerKey: meta.trailerKey
    });
  }
}

function closePreviewModal() {
  closeModal();
}

function closePreviewModalOnBackdrop(e) {
  closeModalOnBackdrop(e);
}

async function addFromPreview() {
  if (!activePreview) return;
  const { tmdbId, title, posterUrl, overview } = activePreview;
  const dramaId = await addShowToLibrary(tmdbId, title, posterUrl, overview);
  activeModalDramaId = dramaId;
  activePreview = null;
  document.getElementById('modal-menu-btn').style.display = '';
  document.getElementById('owner-only-sections').style.display = '';
  renderModalContent(dramaId);
}

function markAllFromPreview(dramaId) {
  markAll(dramaId);
}

async function removeFromPreview(dramaId) {
  await removeShowCore(dramaId);
  closeModal();
}

async function fetchTrailerKey(tmdbId) {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/videos?api_key=${TMDB_API_KEY}`);
  const data = await res.json();
  const videos = data.results || [];
  const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer')
    || videos.find(v => v.site === 'YouTube' && v.type === 'Teaser')
    || videos.find(v => v.site === 'YouTube');
  return trailer ? trailer.key : null;
}

// Récupère et normalise les détails TMDB d'une série (partagé entre
// l'ajout, le rafraîchissement, et l'aperçu avant ajout).
async function fetchTmdbShowDetails(tmdbId) {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${TMDB_API_KEY}`);
  const details = await res.json();

  let totalEp = 0;
  const seasonsData = (details.seasons || [])
    .filter(s => s.season_number > 0)
    .map(s => {
      totalEp += s.episode_count;
      return {
        season_number: s.season_number,
        name: s.name || `Season ${s.season_number}`,
        episode_count: s.episode_count
      };
    });

  let trailerKey = null;
  try { trailerKey = await fetchTrailerKey(tmdbId); } catch (e) {}

  return {
    overview: details.overview || '',
    genres: (details.genres || []).map(g => g.name),
    status: details.status || null,
    seasons: seasonsData,
    totalEp,
    trailerKey,
    backdropUrl: details.backdrop_path ? `https://image.tmdb.org/t/p/w780${details.backdrop_path}` : null,
    runtime: (details.episode_run_time && details.episode_run_time[0]) || null,
    network: (details.networks && details.networks[0] && details.networks[0].name) || null,
    yearStart: details.first_air_date ? details.first_air_date.slice(0, 4) : null,
    yearEnd: details.last_air_date ? details.last_air_date.slice(0, 4) : null,
    voteAverage: typeof details.vote_average === 'number' ? details.vote_average : null,
    voteCount: typeof details.vote_count === 'number' ? details.vote_count : null
  };
}

async function addShowToLibrary(tmdbId, title, fallbackPosterUrl, overview = '') {
  const isAlreadyInList = dramas.some(
    d => d.tmdbId === tmdbId || d.title.toLowerCase() === title.toLowerCase()
  );
  if (isAlreadyInList) {
    const existing = dramas.find(d => d.tmdbId === tmdbId || d.title.toLowerCase() === title.toLowerCase());
    return existing ? existing.id : null;
  }

  let meta = null;
  try { meta = await fetchTmdbShowDetails(tmdbId); } catch (e) {}

  let totalEp = meta ? meta.totalEp : 0;
  let seasonsData = meta ? meta.seasons : [];
  if (seasonsData.length === 0) {
    totalEp = 16;
    seasonsData = [{ season_number: 1, name: "Season 1", episode_count: 16 }];
  }

  const dramaId = Date.now(); 
  if (fallbackPosterUrl && !fallbackPosterUrl.includes('placeholder')) {
    await downloadAndStorePosterBlob(dramaId, fallbackPosterUrl);
  } 

  dramas.push({ 
    id: dramaId, 
    tmdbId, 
    title, 
    fallbackPoster: fallbackPosterUrl, 
    selectedPosterUrl: fallbackPosterUrl,
    totalEp, 
    seasons: seasonsData,
    showStatus: meta ? meta.status : null,
    trailerKey: meta ? meta.trailerKey : null,
    backdropUrl: meta ? meta.backdropUrl : null,
    runtime: meta ? meta.runtime : null,
    network: meta ? meta.network : null,
    yearStart: meta ? meta.yearStart : null,
    yearEnd: meta ? meta.yearEnd : null,
    voteAverage: meta ? meta.voteAverage : null,
    voteCount: meta ? meta.voteCount : null,
    watchedEp: [], 
    overview: (meta && meta.overview) || overview || '', 
    rating: 0,
    favorite: false,
    rewatches: 0,
    genres: meta ? meta.genres : [],
    updatedAt: Date.now()
  });
  saveDramas(); 
  return dramaId;
}

async function selectShowAndSave(tmdbId, title, fallbackPosterUrl, overview = '') {
  const t = i18n[currentLang];
  const isAlreadyInList = dramas.some(
    d => d.tmdbId === tmdbId || d.title.toLowerCase() === title.toLowerCase()
  );
  if (isAlreadyInList) {
    alert(`"${title}" ${t.alreadyInList}`);
    return;
  }
  const dramaId = await addShowToLibrary(tmdbId, title, fallbackPosterUrl, overview);
  hideResults();
  clearSearchInput();
  openModal(dramaId);
} 

async function removeShowCore(dramaId) {
  await deletePosterBlob(dramaId);
  if (activeBlobUrls.has(dramaId)) {
    URL.revokeObjectURL(activeBlobUrls.get(dramaId));
    activeBlobUrls.delete(dramaId);
  }
  dramas = dramas.filter(d => d.id !== dramaId);

  if (activeModalDramaId === dramaId) {
    closeModal();
  }
  saveDramas();
}



async function refreshShowMetadataCore(drama) {
  if (!drama.tmdbId) return false;

  try {
    const meta = await fetchTmdbShowDetails(drama.tmdbId);
    if (!meta.seasons || meta.seasons.length === 0) return false;

    if ((!drama.seasons || drama.seasons.length <= 1) && meta.seasons.length > 1) {
      const remappedWatched = [];
      drama.watchedEp.forEach(epKey => {
        const match = String(epKey).match(/E(\d+)/i);
        if (!match) return;
        let epNum = parseInt(match[1], 10);
        for (const s of meta.seasons) {
          if (epNum <= s.episode_count) {
            remappedWatched.push(`S${s.season_number}E${epNum}`);
            break;
          }
          epNum -= s.episode_count;
        }
      });
      drama.watchedEp = remappedWatched;
    }

    drama.seasons = meta.seasons;
    drama.totalEp = meta.totalEp;
    if (meta.overview) drama.overview = meta.overview;
    if (meta.genres) drama.genres = meta.genres;
    if (meta.status) drama.showStatus = meta.status;
    if (meta.trailerKey) drama.trailerKey = meta.trailerKey;
    if (meta.backdropUrl) drama.backdropUrl = meta.backdropUrl;
    if (meta.runtime) drama.runtime = meta.runtime;
    if (meta.network) drama.network = meta.network;
    if (meta.yearStart) drama.yearStart = meta.yearStart;
    if (meta.yearEnd) drama.yearEnd = meta.yearEnd;
    if (meta.voteAverage != null) drama.voteAverage = meta.voteAverage;
    if (meta.voteCount != null) drama.voteCount = meta.voteCount;
    drama.updatedAt = Date.now();
    return true;
  } catch (err) {
    return false;
  }
}

async function refreshAllShows() {
  const t = i18n[currentLang];
  const btn = document.getElementById('btn-refresh-all');
  const label = document.getElementById('ui-btn-refresh-all');
  const eligible = dramas.filter(d => d.tmdbId);

  if (eligible.length === 0) return alert(t.metaNoId);

  const originalText = label.textContent;
  btn.disabled = true;

  let success = 0, failed = 0;
  for (let i = 0; i < eligible.length; i++) {
    label.textContent = `${t.refreshingProgress} ${i + 1}/${eligible.length}`;
    const ok = await refreshShowMetadataCore(eligible[i]);
    if (ok) success++; else failed++;
  }

  saveDramas();
  btn.disabled = false;
  label.textContent = originalText;

  alert(`${t.refreshAllDone} ${success}.${failed > 0 ? ' ' + t.refreshAllFailed + ' ' + failed + '.' : ''}`);
}

function openPosterModal() {
  if (activeModalDramaId === null) return;
  const drama = dramas.find(d => d.id === activeModalDramaId);
  if (!drama) return;

  loadPosterOptions(drama);
  document.getElementById('poster-picker-modal').classList.add('active');
}

function closePosterModal() {
  document.getElementById('poster-picker-modal').classList.remove('active');
}

function closePosterModalOnBackdrop(e) {
  if (e.target.id === 'poster-picker-modal') closePosterModal();
}

async function loadPosterOptions(drama) {
  const t = i18n[currentLang];
  const container = document.getElementById('modal-poster-picker');
  container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted); grid-column: 1/-1; text-align: center;">${t.loadingArt}</span>`;

  if (!drama.tmdbId) {
    container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted); grid-column: 1/-1; text-align: center;">${t.noTmdbLink}</span>`;
    return;
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/tv/${drama.tmdbId}/images?api_key=${TMDB_API_KEY}&include_image_language=en,ko,null`);
    const data = await res.json();
    container.innerHTML = '';

    if (!data.posters || data.posters.length === 0) {
      container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted); grid-column: 1/-1; text-align: center;">${t.noAltPosters}</span>`;
      return;
    }

    const currentUrl = drama.selectedPosterUrl || drama.fallbackPoster;

    data.posters.slice(0, 24).forEach(poster => {
      const fullUrl = `https://image.tmdb.org/t/p/w500${poster.file_path}`;
      const isSelected = currentUrl === fullUrl;

      const card = document.createElement('div');
      card.className = `poster-option-card ${isSelected ? 'selected' : ''}`;
      card.onclick = () => changeDramaPoster(drama.id, fullUrl);

      card.innerHTML = `<img src="${fullUrl}" alt="Poster Option">`;
      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted); grid-column: 1/-1; text-align: center;">${t.failedPosters}</span>`;
  }
}

function closeGlobalRecommendations() {
  document.getElementById('recommendations-modal').classList.remove('active');
}
function closeGlobalRecommendationsOnBackdrop(e) {
  if (e.target.id === 'recommendations-modal') closeGlobalRecommendations();
}

async function openGlobalRecommendations() {
  const t = i18n[currentLang];
  document.getElementById('recommendations-modal').classList.add('active');
  const container = document.getElementById('global-recs-grid');
  container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted); grid-column: 1/-1; text-align: center;">${t.loadingRecs}</span>`;

  const existingTmdbIds = new Set(dramas.map(d => d.tmdbId).filter(Boolean));

  let sourceShows = dramas.filter(d => d.favorite && d.tmdbId);
  if (sourceShows.length === 0) sourceShows = dramas.filter(d => (d.rating || 0) >= 4 && d.tmdbId);
  if (sourceShows.length === 0) sourceShows = dramas.filter(d => d.tmdbId && d.totalEp > 0 && d.watchedEp.length === d.totalEp);
  if (sourceShows.length === 0) sourceShows = dramas.filter(d => d.tmdbId);

  sourceShows = sourceShows
    .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
    .slice(0, 6);

  if (sourceShows.length === 0) {
    container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted); grid-column: 1/-1; text-align: center;">${t.noRecsSource}</span>`;
    return;
  }

  const pool = new Map();
  for (const show of sourceShows) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/tv/${show.tmdbId}/recommendations?api_key=${TMDB_API_KEY}`);
      const data = await res.json();
      (data.results || []).forEach(r => {
        if (!existingTmdbIds.has(r.id) && !pool.has(r.id)) pool.set(r.id, r);
      });
    } catch (e) {}
  }

  const results = Array.from(pool.values())
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
    .slice(0, 24);

  if (results.length === 0) {
    container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted); grid-column: 1/-1; text-align: center;">${t.noRecsFound}</span>`;
    return;
  }

  container.innerHTML = '';
  results.forEach(show => {
    const posterUrl = show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : '';
    const card = document.createElement('div');
    card.className = 'poster-option-card';
    card.title = show.name;
    card.innerHTML = posterUrl
      ? `<img src="${posterUrl}" alt="${show.name}">`
      : `<span style="position:absolute; inset:0; font-size:0.7rem; color:var(--text-muted); display:flex; align-items:center; justify-content:center; text-align:center; padding: 0.3rem;">${show.name}</span>`;
    card.onclick = () => {
      closeGlobalRecommendations();
      openPreviewModal(show.id, show.name, posterUrl, show.overview);
    };
    container.appendChild(card);
  });
}

async function changeDramaPoster(dramaId, newPosterUrl) {
  const drama = dramas.find(d => d.id === dramaId);
  if (!drama) return;

  drama.selectedPosterUrl = newPosterUrl;
  drama.fallbackPoster = newPosterUrl;
  drama.updatedAt = Date.now();

  await downloadAndStorePosterBlob(drama.id, newPosterUrl);

  if (activeBlobUrls.has(drama.id)) {
    URL.revokeObjectURL(activeBlobUrls.get(drama.id));
    activeBlobUrls.delete(drama.id);
  }

  saveDramas();
  closePosterModal();
}

function getAllEpisodeKeys(drama) {
  const keys = [];
  if (drama.seasons && drama.seasons.length > 0) {
    drama.seasons.forEach(s => {
      for (let i = 1; i <= s.episode_count; i++) {
        keys.push(`S${s.season_number}E${i}`);
      }
    });
  } else {
    for (let i = 1; i <= drama.totalEp; i++) {
      keys.push(`S1E${i}`);
    }
  }
  return keys;
}

function toggleEpisode(dramaId, epKey) {
  const drama = dramas.find(d => d.id === dramaId);
  if (!drama) return; 

  const strKey = String(epKey);
  const index = drama.watchedEp.indexOf(strKey);

  if (index > -1) {
    drama.watchedEp.splice(index, 1);
  } else {
    drama.watchedEp.push(strKey);
    // Coche aussi les épisodes précédents de la même saison
    // (ex. cocher E6 coche automatiquement E1 à E5).
    const match = strKey.match(/^S(\d+)E(\d+)$/i);
    if (match) {
      const seasonNum = match[1];
      const epNum = parseInt(match[2], 10);
      for (let i = 1; i < epNum; i++) {
        const prevKey = `S${seasonNum}E${i}`;
        if (!drama.watchedEp.includes(prevKey)) drama.watchedEp.push(prevKey);
      }
    }
  }
  drama.updatedAt = Date.now();
  saveDramas();
} 

function markAll(dramaId) {
  const drama = dramas.find(d => d.id === dramaId);
  if (!drama) return; 

  const allKeys = getAllEpisodeKeys(drama);

  if (drama.watchedEp.length === drama.totalEp) {
    drama.watchedEp = [];
  } else {
    drama.watchedEp = allKeys;
  }
  drama.updatedAt = Date.now();
  saveDramas();
} 

function markSeason(dramaId, seasonNumber) {
  const drama = dramas.find(d => d.id === dramaId);
  if (!drama) return;

  const season = (drama.seasons || []).find(s => s.season_number === seasonNumber);
  if (!season) return;

  const seasonKeys = [];
  for (let i = 1; i <= season.episode_count; i++) seasonKeys.push(`S${seasonNumber}E${i}`);

  const alreadyFullyWatched = seasonKeys.every(k => drama.watchedEp.includes(k));

  if (alreadyFullyWatched) {
    drama.watchedEp = drama.watchedEp.filter(k => !seasonKeys.includes(k));
  } else {
    const merged = new Set([...drama.watchedEp, ...seasonKeys]);
    drama.watchedEp = Array.from(merged);
  }
  drama.updatedAt = Date.now();
  saveDramas();
} 

function toggleFavorite(dramaId) {
  const drama = dramas.find(d => d.id === dramaId);
  if (!drama) return;
  drama.favorite = !drama.favorite;
  drama.updatedAt = Date.now();
  saveDramas();
}

function setRating(ratingValue) {
  if (activeModalDramaId === null) return;
  const drama = dramas.find(d => d.id === activeModalDramaId);
  if (!drama) return;
  drama.rating = (drama.rating === ratingValue) ? 0 : ratingValue;
  drama.updatedAt = Date.now();
  saveDramas();
}

function adjustRewatch(delta) {
  if (activeModalDramaId === null) return;
  const drama = dramas.find(d => d.id === activeModalDramaId);
  if (!drama) return;
  drama.rewatches = Math.max(0, (drama.rewatches || 0) + delta);
  drama.updatedAt = Date.now();
  saveDramas();
}

async function deleteDrama(dramaId) {
  const t = i18n[currentLang];

  const drama = dramas.find(d => d.id === dramaId);
  const showTitle = drama ? drama.title : 'this show';

  if (!confirm(`${t.confirmDelete} "${showTitle}"?`)) return;

  await removeShowCore(dramaId);
} 

/* --- CLEAN POSTER RENDER LOGIC --- */
async function renderPosters() {
  const currentScrollY = window.scrollY;

  const grid = document.getElementById('posters-grid');
  grid.innerHTML = ''; 

  const sortBy = document.getElementById('sort-selector').value;

  let filtered = dramas.filter(drama => {
    const count = drama.watchedEp.length;
    if (currentFilter === 'watching') return count > 0 && count < drama.totalEp;
    if (currentFilter === 'completed') return count === drama.totalEp && drama.totalEp > 0;
    if (currentFilter === 'plan') return count === 0;
    if (currentFilter === 'favorites') return drama.favorite;
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'progress') {
      const pctA = (a.watchedEp.length / a.totalEp) || 0;
      const pctB = (b.watchedEp.length / b.totalEp) || 0;
      return pctB - pctA;
    }
    return (b.updatedAt || 0) - (a.updatedAt || 0);
  });

  for (const drama of filtered) {
    const watchedCount = drama.watchedEp.length;
    const progressPct = Math.round((watchedCount / drama.totalEp) * 100) || 0; 
    const isCompleted = watchedCount === drama.totalEp && drama.totalEp > 0;
    const isOngoingShow = ['Returning Series', 'In Production', 'Planned', 'Pilot'].includes(drama.showStatus);
    const statusClass = isCompleted ? (isOngoingShow ? 'completed-ongoing' : 'completed-ended') : '';

    const card = document.createElement('div');
    card.className = `poster-card ${statusClass}`;
    card.onclick = () => openModal(drama.id); 

    let imageSrc = activeBlobUrls.get(drama.id);
    if (!imageSrc) {
      const blobUrl = await getPosterBlobUrl(drama.id);
      if (blobUrl) {
        imageSrc = blobUrl;
        activeBlobUrls.set(drama.id, blobUrl);
      } else {
        imageSrc = drama.selectedPosterUrl || drama.fallbackPoster;
      }
    } 

    const favDot = drama.favorite ? `<div class="fav-dot" title="Favorite"></div>` : '';

    card.innerHTML = `
      ${favDot}
      <img src="${imageSrc}" alt="${drama.title}">
      <div class="poster-overlay">
        <div class="overlay-title">${drama.title}</div>
      </div>
      <div class="poster-mini-progress-track">
        <div class="poster-mini-progress-fill" style="width: ${progressPct}%;"></div>
      </div>
    `;
    grid.appendChild(card);
  }

  window.scrollTo(0, currentScrollY);
} 

async function loadCast(tmdbId) {
  const t = i18n[currentLang];
  const container = document.getElementById('modal-cast');
  container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">${t.loadingCast}</span>`;
  if (!tmdbId) {
    container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">${t.noCast}</span>`;
    return;
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/credits?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    container.innerHTML = '';

    if (!data.cast || data.cast.length === 0) {
      container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">${t.noCastFound}</span>`;
      return;
    }

    data.cast.slice(0, 10).forEach(actor => {
      const profileUrl = actor.profile_path ? `https://image.tmdb.org/t/p/w185${actor.profile_path}` : 'https://via.placeholder.com/100x100?text=No+Photo';
      const card = document.createElement('div');
      card.className = 'actor-card';
      card.innerHTML = `
        <img src="${profileUrl}" alt="${actor.name}">
        <div class="actor-name">${actor.name}</div>
        <div class="character-name">${actor.character || ''}</div>
      `;
      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">${t.failedCast}</span>`;
  }
}

async function loadRecommendations(tmdbId) {
  const t = i18n[currentLang];
  const container = document.getElementById('modal-recommendations');
  container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">${t.loadingRecs}</span>`;
  if (!tmdbId) {
    container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">${t.noRecs}</span>`;
    return;
  }

  try {
    const res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/recommendations?api_key=${TMDB_API_KEY}`);
    const data = await res.json();
    container.innerHTML = '';

    if (!data.results || data.results.length === 0) {
      container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">${t.noRecsFound}</span>`;
      return;
    }

    data.results.slice(0, 8).forEach(show => {
      const posterUrl = show.poster_path ? `https://image.tmdb.org/t/p/w300${show.poster_path}` : 'https://via.placeholder.com/300x450';
      const isAlreadyAdded = dramas.some(d => d.tmdbId === show.id || d.title.toLowerCase() === show.name.toLowerCase());

      const card = document.createElement('div');
      card.className = 'trending-card';
      card.onclick = () => {
        const existing = dramas.find(d => d.tmdbId === show.id || d.title.toLowerCase() === show.name.toLowerCase());
        if (existing) {
          openModal(existing.id);
        } else {
          openPreviewModal(show.id, show.name, posterUrl, show.overview);
        }
      };
      
      card.innerHTML = `
        ${isAlreadyAdded ? `<div class="in-list-badge" style="font-size:0.55rem; padding:0.1rem;">${t.inListBadge}</div>` : ''}
        <img src="${posterUrl}" alt="${show.name}">
        <div class="title">${show.name}</div>
      `;
      container.appendChild(card);
    });
  } catch (e) {
    container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">${t.failedRecs}</span>`;
  }
}

function openModal(dramaId) {
  activeModalDramaId = dramaId;
  activePreview = null;
  document.getElementById('modal-menu-btn').style.display = '';
  document.getElementById('owner-only-sections').style.display = '';
  renderModalContent(dramaId);
  document.getElementById('drama-modal').classList.add('active');
  document.body.style.overflow = 'hidden';
} 

function closeModal() {
  document.getElementById('drama-modal').classList.remove('active');
  document.getElementById('modal-menu-dropdown').classList.remove('open');
  activeModalDramaId = null;
  activePreview = null;
  document.body.style.overflow = '';
} 

function closeModalOnBackdrop(e) {
  if (e.target.id === 'drama-modal') closeModal();
} 

function statusLabelFor(status, t) {
  switch (status) {
    case 'Returning Series': return t.statusReturning;
    case 'Ended': return t.statusEnded;
    case 'Canceled': return t.statusCanceled;
    case 'In Production': return t.statusInProduction;
    case 'Planned': return t.statusPlanned;
    case 'Pilot': return t.statusPilot;
    default: return '';
  }
}

function isOngoingStatus(status) {
  return ['Returning Series', 'In Production', 'Planned', 'Pilot'].includes(status);
}

function formatVoteCount(n) {
  return n == null ? '' : n.toLocaleString('fr-FR');
}

function buildInfoLine(t, meta) {
  const parts = [];
  if (meta.voteAverage) {
    parts.push(`★ ${meta.voteAverage.toFixed(1)}${meta.voteCount ? ' (' + formatVoteCount(meta.voteCount) + ')' : ''}`);
  }
  const statusLabel = statusLabelFor(meta.status, t);
  if (statusLabel) parts.push(statusLabel);
  if (meta.yearStart) {
    const ongoing = isOngoingStatus(meta.status);
    parts.push((ongoing || !meta.yearEnd || meta.yearEnd === meta.yearStart) ? `${meta.yearStart} - ${t.presentLabel}` : `${meta.yearStart} - ${meta.yearEnd}`);
  }
  if (meta.runtime) parts.push(`${meta.runtime} min`);
  if (meta.network) parts.push(meta.network);
  if (meta.genres && meta.genres.length) parts.push(meta.genres.join(', '));
  return parts.join(' · ');
}

function toggleModalMenu(e) {
  e.stopPropagation();
  document.getElementById('modal-menu-dropdown').classList.toggle('open');
}
function closeModalMenu() {
  document.getElementById('modal-menu-dropdown').classList.remove('open');
}
function renderModalMenu() {
  const t = i18n[currentLang];
  const drama = dramas.find(d => d.id === activeModalDramaId);
  if (!drama) return;
  const favBtn = document.getElementById('modal-menu-fav');
  favBtn.textContent = drama.favorite ? `♥ ${t.menuUnfav}` : `♡ ${t.menuFav}`;
  favBtn.classList.toggle('menu-fav-active', drama.favorite);
  document.getElementById('modal-menu-poster').textContent = `🖼 ${t.menuPoster}`;
  document.getElementById('modal-menu-delete').textContent = `🗑 ${t.menuDelete}`;
}

// Renseigne la bannière/titre/info-line/résumé/bande-annonce — commun
// à une série déjà en bibliothèque et à un aperçu avant ajout.
function populateSharedModalFields(meta) {
  const t = i18n[currentLang];

  document.getElementById('modal-banner-img').src = meta.backdropUrl || meta.posterUrl || '';
  document.getElementById('modal-drama-title').textContent = meta.title;
  document.getElementById('modal-info-line').textContent = buildInfoLine(t, meta);

  const overviewEl = document.getElementById('modal-overview-text');
  if (meta.overview && meta.overview.trim()) {
    overviewEl.textContent = meta.overview;
    overviewEl.classList.remove('muted');
  } else {
    overviewEl.textContent = t.noOverview;
    overviewEl.classList.add('muted');
  }

  const trailerRow = document.getElementById('modal-trailer-row');
  if (meta.trailerKey) {
    trailerRow.href = `https://www.youtube.com/watch?v=${meta.trailerKey}`;
    trailerRow.style.display = 'flex';
  } else {
    trailerRow.style.display = 'none';
  }
}

// Barre d'action primaire (pilule + cercle qui échangent de rôle
// selon que la série est déjà dans la bibliothèque ou non).
function renderPrimaryActionBar(isAdded, dramaId) {
  const t = i18n[currentLang];
  const btnA = document.getElementById('primary-btn-a');
  const btnB = document.getElementById('primary-btn-b');
  const drama = isAdded ? dramas.find(d => d.id === dramaId) : null;
  const isCompleted = drama && drama.totalEp > 0 && drama.watchedEp.length === drama.totalEp;

  if (isAdded) {
    btnA.className = 'action-morph role-bookmark';
    btnA.innerHTML = bookmarkIconSVG(true);
    btnA.setAttribute('aria-label', t.previewRemove);
    btnA.onclick = () => removeFromPreview(dramaId);

    // Toggle the .is-active class based on whether all episodes are completed
    btnB.className = `action-morph role-watched ${isCompleted ? 'is-active' : ''}`;
    btnB.innerHTML = `<span class="checkmark">✓</span> &nbsp; ${isCompleted ? t.unmarkAll : t.previewMarkWatched}`;
    btnB.onclick = () => markAllFromPreview(dramaId);
  } else {
    btnA.className = 'action-morph role-add';
    btnA.innerHTML = `${bookmarkIconSVG(false)} ${t.previewAdd}`;
    btnA.onclick = () => addFromPreview();

    btnB.className = 'action-morph role-check-empty';
    btnB.innerHTML = '✓';
    btnB.setAttribute('aria-label', t.previewAdd);
    btnB.onclick = () => addFromPreview();
  }
}



function renderEpisodesFeed(drama) {
  let epRowsHTML = '';
  const seasonsList = (drama.seasons && drama.seasons.length > 0)
    ? drama.seasons
    : [{ season_number: 1, name: "Season 1", episode_count: drama.totalEp }];

  seasonsList.forEach((season, index) => {
    const isOpenAttr = index === 0 ? 'open' : '';
    const seasonKeys = [];
    for (let i = 1; i <= season.episode_count; i++) seasonKeys.push(`S${season.season_number}E${i}`);
    const seasonFullyWatched = seasonKeys.length > 0 && seasonKeys.every(k => drama.watchedEp.includes(k));

    epRowsHTML += `
      <details class="season-block" ${isOpenAttr}>
        <summary class="season-header">
          <span>${season.name || `Season ${season.season_number}`}</span>
          <span style="font-size:0.7rem; color:var(--text-muted); margin-left: auto; margin-right: 0.5rem;">${season.episode_count} eps</span>
          <button type="button" class="season-check-btn ${seasonFullyWatched ? 'checked' : ''}" onclick="event.preventDefault(); event.stopPropagation(); markSeason(${drama.id}, ${season.season_number});" aria-label="Tout cocher">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
        </summary>
        <div class="season-episodes-list">
    `;

    for (let i = 1; i <= season.episode_count; i++) {
      const epKey = `S${season.season_number}E${i}`;
      const isWatched = drama.watchedEp.includes(epKey);

      epRowsHTML += `
        <div class="ep-row ${isWatched ? 'watched' : ''}">
          <div class="ep-info">
            <span class="ep-badge">E${i < 10 ? '0' + i : i}</span>
            <span class="ep-label">Episode ${i}</span>
          </div>
          <button class="check-btn ${isWatched ? 'checked' : ''}" onclick="toggleEpisode(${drama.id}, '${epKey}')">
            <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </button>
        </div>
      `;
    }

    epRowsHTML += `
        </div>
      </details>
    `;
  });

  document.getElementById('modal-episodes-feed').innerHTML = epRowsHTML;
}

async function renderModalContent(dramaId) {
  const t = i18n[currentLang];
  const drama = dramas.find(d => d.id === dramaId);
  if (!drama) return; 

  if (Array.isArray(drama.watchedEp) && drama.watchedEp.some(e => typeof e === 'number')) {
    drama.watchedEp = drama.watchedEp.map(e => typeof e === 'number' ? `S1E${e}` : String(e));
  }

  const watchedCount = drama.watchedEp.length;
  const progressPct = Math.round((watchedCount / drama.totalEp) * 100) || 0;
  const isCompleted = watchedCount === drama.totalEp && drama.totalEp > 0; 
  const isOngoingShow = isOngoingStatus(drama.showStatus);

  let imageSrc = activeBlobUrls.get(drama.id) || await getPosterBlobUrl(drama.id) || drama.selectedPosterUrl || drama.fallbackPoster; 

  populateSharedModalFields({
    title: drama.title,
    backdropUrl: drama.backdropUrl,
    posterUrl: imageSrc,
    overview: drama.overview,
    status: drama.showStatus,
    yearStart: drama.yearStart,
    yearEnd: drama.yearEnd,
    runtime: drama.runtime,
    network: drama.network,
    genres: drama.genres,
    voteAverage: drama.voteAverage,
    voteCount: drama.voteCount,
    trailerKey: drama.trailerKey
  });

  renderPrimaryActionBar(true, drama.id);
  renderModalMenu();

  document.getElementById('modal-progress-text').textContent = `${watchedCount} / ${drama.totalEp} ep (${progressPct}%)`;
  const fillEl = document.getElementById('modal-progress-fill');
  fillEl.style.width = `${progressPct}%`; 
  fillEl.classList.remove('completed-ended', 'completed-ongoing');
  if (isCompleted) fillEl.classList.add(isOngoingShow ? 'completed-ongoing' : 'completed-ended');

  document.getElementById('modal-rewatch-count').textContent = drama.rewatches || 0;

  const currentRating = drama.rating || 0;
  const starButtons = document.querySelectorAll('#modal-star-rating .star-btn');
  starButtons.forEach((btn, index) => {
    btn.classList.toggle('active', index < currentRating);
  });
  document.getElementById('modal-rating-text').textContent = currentRating > 0 ? `${currentRating} / 5` : t.unrated;

  renderEpisodesFeed(drama);

  loadCast(drama.tmdbId);
  loadRecommendations(drama.tmdbId);
} 

applyLanguage(currentLang);
document.getElementById('korean-only-checkbox').checked = koreanOnlySearch;
renderDashboard();
renderPosters();
