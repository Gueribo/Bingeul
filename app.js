const TMDB_API_KEY = "15d2ea6d0dc1d476efbca3eba2b9bbfb"; 
const APP_VERSION = "1.4.0";

let dramas = JSON.parse(localStorage.getItem('tvtime_modal_kdrama_data')) || [];

// Migration : les séries ajoutées avant l'introduction du tri "Récemment
// ajouté" n'ont pas de champ addedAt. On le déduit de leur id, qui est
// justement l'horodatage exact de leur ajout — pour éviter que le tri
// ne retombe sur updatedAt (donc sur "Récemment mis à jour").
let addedAtMigrated = false;
dramas.forEach(d => {
  if (!d.addedAt) {
    d.addedAt = d.id || d.updatedAt || Date.now();
    addedAtMigrated = true;
  }
});
if (addedAtMigrated) {
  localStorage.setItem('tvtime_modal_kdrama_data', JSON.stringify(dramas));
}
let activeModalDramaId = null;
let currentFilter = localStorage.getItem('tvtime_filter') || 'all';
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
    optAdded: "Recently Added",
    optTitle: "Title (A-Z)",
    optRating: "My Rating",
    optProgress: "Progress %",
    resultsTitle: "Tap a show to add:",
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
    noShowsFound: "No shows found.",
    previewAdd: "Add to my list",
    previewMarkWatched: "Mark as watched",
    completedLabel: "Completed",
    previewRemove: "Remove from my list",
    inListBadge: "In List",
    unrated: "Unrated",
    noOverview: "No summary available.",
    trailerLabel: "Watch trailer",
    trailerFallback: "Watch on YouTube",
    presentLabel: "Present",
    koreanOnlyLabel: "K-dramas only",
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
    refreshAllFailed: "Failed:",
    searchLibraryPlaceholder: "Search in my list...",
    upcomingTitle: "Coming up",
    undoLabel: "Undo",
    deletedToast: "removed from your list",
    settingStatsLabel: "Statistics",
    btnBilan: "My recap",
    settingInstallLabel: "Installation",
    btnInstall: "Install the app",
    bilanTitle: "My recap",
    bilanSub: "A snapshot of your K-drama journey",
    bilanShows: "Shows",
    bilanEpisodes: "Episodes watched",
    bilanTime: "Time watched",
    bilanCompleted: "Completed",
    bilanFavorites: "Favorites",
    bilanAvgRating: "Average rating",
    bilanGenresTitle: "Top genres",
    bilanNoData: "Add a few shows to see your recap!",
    actorFilmographyTitle: "Known for",
    actorNoBio: "No biography available.",
    actorLoadFailed: "Couldn't load this person's info.",
    bornLabel: "Born"
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
    optAdded: "Récemment ajouté",
    optTitle: "Titre (A-Z)",
    optRating: "Ma Note",
    optProgress: "Progression %",
    resultsTitle: "Appuyez sur une série pour l'ajouter :",
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
    noShowsFound: "Aucune série trouvée.",
    previewAdd: "Ajouter à ma liste",
    previewMarkWatched: "Marquer comme vu",
    completedLabel: "Terminé",
    previewRemove: "Retirer de ma liste",
    inListBadge: "Dans la liste",
    unrated: "Non noté",
    noOverview: "Aucun résumé disponible.",
    trailerLabel: "Voir la bande-annonce",
    trailerFallback: "Regarder sur YouTube",
    presentLabel: "Présent",
    koreanOnlyLabel: "K-dramas uniquement",
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
    refreshAllFailed: "Échecs :",
    searchLibraryPlaceholder: "Rechercher dans ma liste...",
    upcomingTitle: "Prochainement",
    undoLabel: "Annuler",
    deletedToast: "retirée de ta liste",
    settingStatsLabel: "Statistiques",
    btnBilan: "Mon bilan",
    settingInstallLabel: "Installation",
    btnInstall: "Installer l'application",
    bilanTitle: "Mon bilan",
    bilanSub: "Un aperçu de ton parcours K-drama",
    bilanShows: "Séries",
    bilanEpisodes: "Épisodes vus",
    bilanTime: "Temps passé",
    bilanCompleted: "Terminées",
    bilanFavorites: "Favoris",
    bilanAvgRating: "Note moyenne",
    bilanGenresTitle: "Genres favoris",
    bilanNoData: "Ajoute quelques séries pour voir ton bilan !",
    actorFilmographyTitle: "Connu(e) pour",
    actorNoBio: "Aucune biographie disponible.",
    actorLoadFailed: "Impossible de charger les infos de cette personne.",
    bornLabel: "Naissance"
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
  document.getElementById('library-search-input').placeholder = t.searchLibraryPlaceholder;
  document.getElementById('ui-upcoming-title').textContent = t.upcomingTitle;
  document.getElementById('undo-toast-btn').textContent = t.undoLabel;
  document.getElementById('ui-setting-stats-label').textContent = t.settingStatsLabel;
  document.getElementById('ui-btn-bilan').textContent = t.btnBilan;
  document.getElementById('ui-setting-install-label').textContent = t.settingInstallLabel;
  document.getElementById('ui-btn-install').textContent = t.btnInstall;
  document.getElementById('ui-bilan-title').textContent = t.bilanTitle;
  document.getElementById('ui-bilan-sub').textContent = t.bilanSub;
  document.getElementById('ui-bilan-genres-title').textContent = t.bilanGenresTitle;
  document.getElementById('ui-actor-filmography-title').textContent = t.actorFilmographyTitle;
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
  document.getElementById('opt-added').textContent = t.optAdded;
  document.getElementById('opt-title').textContent = t.optTitle;
  document.getElementById('opt-rating').textContent = t.optRating;
  document.getElementById('opt-progress').textContent = t.optProgress;

  document.getElementById('ui-results-title').textContent = t.resultsTitle;

  document.getElementById('ui-rewatched-label').textContent = t.rewatchedLabel;
  document.getElementById('ui-progress-label').textContent = t.progressLabel;
  document.getElementById('ui-overview-title').textContent = t.overviewTitle;
  document.getElementById('ui-cast-title').textContent = t.castTitle;
  document.getElementById('ui-recommendations-title').textContent = t.recommendationsTitle;
  document.getElementById('ui-trailer-label').textContent = t.trailerLabel;
  document.getElementById('trailer-fallback-link').textContent = t.trailerFallback;
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

  renderDashboard();

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

function toggleLibrarySearchClear() {
  const input = document.getElementById('library-search-input');
  const clearBtn = document.getElementById('library-search-clear-btn');
  clearBtn.style.display = input.value.trim().length > 0 ? 'flex' : 'none';
}

function clearLibrarySearch() {
  const input = document.getElementById('library-search-input');
  input.value = '';
  toggleLibrarySearchClear();
  renderPosters();
  input.focus();
}

function applyTheme(theme) {
  if (theme === 'pastel') {
    document.documentElement.setAttribute('data-theme', 'pastel');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  // Signal précis (pas juste "dark light") pour empêcher le navigateur
  // de recolorer automatiquement le thème Pastel en sombre quand le
  // téléphone est en mode nuit système (vu sur Samsung Internet).
  document.documentElement.style.colorScheme = theme === 'pastel' ? 'light' : 'dark';
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
  renderUpcoming();
  if (activeModalDramaId !== null) renderModalContent(activeModalDramaId);
} 

function formatShortDate(dateStr) {
  try {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'short' });
  } catch (e) { return dateStr; }
}

async function renderUpcoming() {
  const section = document.getElementById('upcoming-section');
  const scroll = document.getElementById('upcoming-scroll');

  const todayStr = new Date().toISOString().slice(0, 10);
  const upcoming = dramas
    .filter(d => d.nextEpisodeDate && d.nextEpisodeDate >= todayStr)
    .sort((a, b) => a.nextEpisodeDate.localeCompare(b.nextEpisodeDate));

  if (upcoming.length === 0) {
    section.style.display = 'none';
    scroll.innerHTML = '';
    return;
  }

  section.style.display = 'block';
  scroll.innerHTML = '';

  for (const drama of upcoming) {
    let imageSrc = activeBlobUrls.get(drama.id);
    if (!imageSrc) {
      const blobUrl = await getPosterBlobUrl(drama.id);
      imageSrc = blobUrl || drama.selectedPosterUrl || drama.fallbackPoster;
      if (blobUrl) activeBlobUrls.set(drama.id, blobUrl);
    }

    const card = document.createElement('div');
    card.className = 'upcoming-card';
    card.onclick = () => openModal(drama.id);
    card.innerHTML = `
      <img src="${imageSrc}" alt="${drama.title}">
      <div class="upcoming-date">${formatShortDate(drama.nextEpisodeDate)}</div>
      <div class="upcoming-ep">${drama.title}${drama.nextSeasonNumber && drama.nextEpisodeNumber ? ` · S${drama.nextSeasonNumber}E${drama.nextEpisodeNumber}` : ''}</div>
    `;
    scroll.appendChild(card);
  }
}

function changeSortOrder() {
  localStorage.setItem('tvtime_sort', document.getElementById('sort-selector').value);
  saveDramas();
}

function setFilter(filter, btn) {
  currentFilter = filter;
  localStorage.setItem('tvtime_filter', filter);
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
  const dayUnit = currentLang === 'fr' ? 'j' : 'd';

  let timeString = `${totalHours}h`;
  if (days > 0) {
    timeString = `${days}${dayUnit} ${remainingHours}h`;
  }

  document.getElementById('dash-completed').textContent = completed;
  document.getElementById('dash-episodes').textContent = totalEpWatched;
  document.getElementById('dash-hours').textContent = timeString;
}

function openBilanModal() {
  renderBilan();
  document.getElementById('bilan-modal').classList.add('active');
}
function closeBilanModal() {
  document.getElementById('bilan-modal').classList.remove('active');
}
function closeBilanModalOnBackdrop(e) {
  if (e.target.id === 'bilan-modal') closeBilanModal();
}

function renderBilanBars(containerId, counts, total) {
  const container = document.getElementById(containerId);
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (entries.length === 0) {
    container.innerHTML = `<p style="font-size:0.8rem; color:var(--text-muted); font-style:italic;">—</p>`;
    return;
  }

  container.innerHTML = entries.map(([label, count]) => {
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;
    return `
      <div class="bilan-bar-row">
        <div class="bilan-bar-label"><span>${label}</span><span>${count}</span></div>
        <div class="bilan-bar-track"><div class="bilan-bar-fill" style="width:${pct}%;"></div></div>
      </div>
    `;
  }).join('');
}

function renderBilan() {
  const t = i18n[currentLang];

  if (dramas.length === 0) {
    document.getElementById('bilan-stats-grid').innerHTML = `<p style="font-size:0.85rem; color:var(--text-muted); grid-column: 1/-1; text-align:center;">${t.bilanNoData}</p>`;
    document.getElementById('bilan-genres-list').innerHTML = '';
    return;
  }

  let totalEpWatched = 0;
  let totalMinutesWatched = 0;
  let completed = 0;
  let favoritesCount = 0;
  let ratedCount = 0;
  let ratingSum = 0;
  const genreCounts = {};

  dramas.forEach(d => {
    const watched = d.watchedEp.length;
    totalEpWatched += watched;
    totalMinutesWatched += watched * (d.runtime || 60);

    if (watched === d.totalEp && d.totalEp > 0) completed++;
    if (d.favorite) favoritesCount++;
    if (d.rating > 0) { ratedCount++; ratingSum += d.rating; }

    (d.genres || []).forEach(g => { genreCounts[g] = (genreCounts[g] || 0) + 1; });
  });

  const totalHours = Math.round(totalMinutesWatched / 60);
  const days = Math.floor(totalHours / 24);
  const remainingHours = totalHours % 24;
  const dayUnit = currentLang === 'fr' ? 'j' : 'd';
  const timeString = days > 0 ? `${days}${dayUnit} ${remainingHours}h` : `${totalHours}h`;
  const avgRating = ratedCount > 0 ? (ratingSum / ratedCount).toFixed(1) : '—';

  document.getElementById('bilan-stats-grid').innerHTML = `
    <div class="bilan-stat-card"><div class="bilan-stat-value">${dramas.length}</div><div class="bilan-stat-label">${t.bilanShows}</div></div>
    <div class="bilan-stat-card"><div class="bilan-stat-value">${totalEpWatched}</div><div class="bilan-stat-label">${t.bilanEpisodes}</div></div>
    <div class="bilan-stat-card"><div class="bilan-stat-value">${timeString}</div><div class="bilan-stat-label">${t.bilanTime}</div></div>
    <div class="bilan-stat-card"><div class="bilan-stat-value">${completed}</div><div class="bilan-stat-label">${t.bilanCompleted}</div></div>
    <div class="bilan-stat-card"><div class="bilan-stat-value">${favoritesCount}</div><div class="bilan-stat-label">${t.bilanFavorites}</div></div>
    <div class="bilan-stat-card"><div class="bilan-stat-value">${avgRating}${ratedCount > 0 ? ' / 5' : ''}</div><div class="bilan-stat-label">${t.bilanAvgRating}</div></div>
  `;

  renderBilanBars('bilan-genres-list', genreCounts, dramas.length);
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

function toggleKoreanOnly() {
  koreanOnlySearch = !koreanOnlySearch;
  localStorage.setItem('tvtime_korean_only', koreanOnlySearch ? '1' : '0');
  document.getElementById('korean-only-btn').classList.toggle('active', koreanOnlySearch);
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
          openPreviewModal(show.id, show.name, posterUrl, show.overview, 'search');
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

let modalReturnTo = null; // null | 'search' | 'recommendations'

function openTrailerPlayer(event) {
  event.preventDefault();
  const trailerKey = event.currentTarget.dataset.trailerKey;
  if (!trailerKey) return;

  const overlay = document.getElementById('trailer-player-overlay');
  const iframe = document.getElementById('trailer-iframe');
  iframe.src = `https://www.youtube.com/embed/${trailerKey}?autoplay=1&playsinline=1`;
  document.getElementById('trailer-fallback-link').href = `https://www.youtube.com/watch?v=${trailerKey}`;
  overlay.style.display = 'flex';

  // Plein écran automatique : le clic qui a mené ici compte comme un
  // vrai geste utilisateur, donc le navigateur autorise la demande.
  const request = overlay.requestFullscreen || overlay.webkitRequestFullscreen;
  if (request) request.call(overlay).catch(() => {});
}

function closeTrailerPlayer() {
  const overlay = document.getElementById('trailer-player-overlay');
  document.getElementById('trailer-iframe').src = '';
  overlay.style.display = 'none';
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
}

document.addEventListener('fullscreenchange', () => {
  const overlay = document.getElementById('trailer-player-overlay');
  if (!document.fullscreenElement && overlay.style.display === 'flex') {
    document.getElementById('trailer-iframe').src = '';
    overlay.style.display = 'none';
  }
});

async function openPreviewModal(tmdbId, title, posterUrl, overview, returnTo = null) {
  activeModalDramaId = null;
  activePreview = { tmdbId, title, posterUrl, overview };
  modalReturnTo = returnTo;

  hideResults();
  closeGlobalRecommendations();
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
      voteAverage: meta.voteAverage, voteCount: meta.voteCount, trailerKey: meta.trailerKey, logoUrl: meta.logoUrl
    });
  }
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
  const t = i18n[currentLang];
  const drama = dramas.find(d => d.id === dramaId);

  let posterBlob = null;
  try { posterBlob = await getPosterBlob(dramaId); } catch (e) {}
  const snapshot = drama ? JSON.parse(JSON.stringify(drama)) : null;

  await removeShowCore(dramaId, { skipCloseModal: true });

  if (!snapshot) {
    closeModal();
    return;
  }

  lastDeletedSnapshot = { drama: snapshot, posterBlob };
  showUndoToast(`"${snapshot.title}" ${t.deletedToast}`);

  // On reste sur la fiche plutôt que de fermer le modal : elle bascule
  // simplement en mode aperçu ("pas encore ajoutée"), comme avant l'ajout.
  activeModalDramaId = null;
  activePreview = {
    tmdbId: snapshot.tmdbId,
    title: snapshot.title,
    posterUrl: snapshot.selectedPosterUrl || snapshot.fallbackPoster,
    overview: snapshot.overview
  };
  document.getElementById('modal-menu-btn').style.display = 'none';
  document.getElementById('modal-menu-dropdown').classList.remove('open');
  document.getElementById('owner-only-sections').style.display = 'none';
  renderPrimaryActionBar(false, null);
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

  let logoUrl = null;
  try { logoUrl = await fetchBestLogo(tmdbId); } catch (e) {}

  return {
    overview: details.overview || '',
    genres: (details.genres || []).map(g => g.name),
    status: details.status || null,
    seasons: seasonsData,
    totalEp,
    trailerKey,
    logoUrl,
    backdropUrl: details.backdrop_path ? `https://image.tmdb.org/t/p/w780${details.backdrop_path}` : null,
    runtime: (details.episode_run_time && details.episode_run_time[0]) || null,
    network: (details.networks && details.networks[0] && details.networks[0].name) || null,
    yearStart: details.first_air_date ? details.first_air_date.slice(0, 4) : null,
    yearEnd: details.last_air_date ? details.last_air_date.slice(0, 4) : null,
    voteAverage: typeof details.vote_average === 'number' ? details.vote_average : null,
    voteCount: typeof details.vote_count === 'number' ? details.vote_count : null,
    nextEpisodeDate: details.next_episode_to_air ? details.next_episode_to_air.air_date : null,
    nextEpisodeNumber: details.next_episode_to_air ? details.next_episode_to_air.episode_number : null,
    nextSeasonNumber: details.next_episode_to_air ? details.next_episode_to_air.season_number : null
  };
}

// Choisit le meilleur logo dispo : langue de l'app > version sans texte
// (générique) > anglais > aucun (on garde alors le titre en texte).
async function fetchBestLogo(tmdbId) {
  const res = await fetch(`https://api.themoviedb.org/3/tv/${tmdbId}/images?api_key=${TMDB_API_KEY}&include_image_language=en,null`);
  const data = await res.json();
  const logos = data.logos || [];
  if (logos.length === 0) return null;

  const byLang = (lang) => logos.filter(l => l.iso_639_1 === lang).sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))[0];
  const best = byLang('en') || byLang(null);
  if (!best) return null;
  // TMDB ne redimensionne pas les logos vectoriels : seule la taille
  // "original" fonctionne pour les .svg, sinon l'image ne charge pas.
  const size = best.file_path.endsWith('.svg') ? 'original' : 'w500';
  return `https://image.tmdb.org/t/p/${size}${best.file_path}`;
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
    logoUrl: meta ? meta.logoUrl : null,
    backdropUrl: meta ? meta.backdropUrl : null,
    runtime: meta ? meta.runtime : null,
    network: meta ? meta.network : null,
    yearStart: meta ? meta.yearStart : null,
    yearEnd: meta ? meta.yearEnd : null,
    voteAverage: meta ? meta.voteAverage : null,
    voteCount: meta ? meta.voteCount : null,
    nextEpisodeDate: meta ? meta.nextEpisodeDate : null,
    nextEpisodeNumber: meta ? meta.nextEpisodeNumber : null,
    nextSeasonNumber: meta ? meta.nextSeasonNumber : null,
    watchedEp: [], 
    overview: (meta && meta.overview) || overview || '', 
    rating: 0,
    favorite: false,
    rewatches: 0,
    genres: meta ? meta.genres : [],
    addedAt: Date.now(),
    updatedAt: Date.now()
  });
  saveDramas(); 
  return dramaId;
}

async function removeShowCore(dramaId, options = {}) {
  await deletePosterBlob(dramaId);
  if (activeBlobUrls.has(dramaId)) {
    URL.revokeObjectURL(activeBlobUrls.get(dramaId));
    activeBlobUrls.delete(dramaId);
  }
  dramas = dramas.filter(d => d.id !== dramaId);

  if (activeModalDramaId === dramaId && !options.skipCloseModal) {
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
    drama.logoUrl = meta.logoUrl;
    if (meta.backdropUrl) drama.backdropUrl = meta.backdropUrl;
    if (meta.runtime) drama.runtime = meta.runtime;
    if (meta.network) drama.network = meta.network;
    if (meta.yearStart) drama.yearStart = meta.yearStart;
    if (meta.yearEnd) drama.yearEnd = meta.yearEnd;
    if (meta.voteAverage != null) drama.voteAverage = meta.voteAverage;
    if (meta.voteCount != null) drama.voteCount = meta.voteCount;
    drama.nextEpisodeDate = meta.nextEpisodeDate;
    drama.nextEpisodeNumber = meta.nextEpisodeNumber;
    drama.nextSeasonNumber = meta.nextSeasonNumber;
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

// Certains navigateurs mobiles (Samsung Internet notamment, en particulier
// sur l'écran extérieur des téléphones pliables) ne calculent pas
// correctement le ratio d'affiche via CSS (aspect-ratio ou padding-top en
// pourcentage à l'intérieur d'une grille), ce qui fait apparaître des
// cartes carrées. On force donc la hauteur en pixels réels, mesurés,
// ce qui fonctionne quel que soit le moteur de rendu.
function fixPosterCardHeights(containerEl) {
  if (!containerEl) return;
  const cards = containerEl.querySelectorAll('.poster-option-card');
  cards.forEach(card => {
    const w = card.offsetWidth;
    if (w > 0) card.style.height = Math.round(w * 1.5) + 'px';
  });
}

window.addEventListener('resize', () => {
  fixPosterCardHeights(document.getElementById('modal-poster-picker'));
  fixPosterCardHeights(document.getElementById('global-recs-grid'));
});

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

    requestAnimationFrame(() => fixPosterCardHeights(container));
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
    .slice(0, 10);

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

  const similarResults = filterKoreanOnly(Array.from(pool.values()))
    .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));

  // Complète avec des séries populaires en général (pas forcément liées
  // à ta liste) si tu veux voir davantage de choix.
  const extra = new Map();
  for (let page = 1; page <= 3; page++) {
    try {
      const res = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${TMDB_API_KEY}&page=${page}`);
      const data = await res.json();
      (data.results || []).forEach(r => {
        if (!existingTmdbIds.has(r.id) && !pool.has(r.id) && !extra.has(r.id)) extra.set(r.id, r);
      });
    } catch (e) {}
  }
  const popularResults = filterKoreanOnly(Array.from(extra.values()))
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

  const results = [...similarResults, ...popularResults].slice(0, 60);

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
      ? `<img src="${posterUrl}" alt="${show.name}"><div class="poster-overlay"><div class="overlay-title">${show.name}</div></div>`
      : `<span style="position:absolute; inset:0; font-size:0.7rem; color:var(--text-muted); display:flex; align-items:center; justify-content:center; text-align:center; padding: 0.3rem;">${show.name}</span>`;
    card.onclick = () => {
      closeGlobalRecommendations();
      openPreviewModal(show.id, show.name, posterUrl, show.overview, 'recommendations');
    };
    container.appendChild(card);
  });

  requestAnimationFrame(() => fixPosterCardHeights(container));
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

let lastDeletedSnapshot = null;
let undoTimeoutId = null;

function showUndoToast(message) {
  const toast = document.getElementById('undo-toast');
  document.getElementById('undo-toast-message').textContent = message;
  toast.classList.add('show');
  clearTimeout(undoTimeoutId);
  undoTimeoutId = setTimeout(() => {
    toast.classList.remove('show');
    lastDeletedSnapshot = null;
  }, 6000);
}

function hideUndoToast() {
  document.getElementById('undo-toast').classList.remove('show');
  clearTimeout(undoTimeoutId);
}

async function undoDelete() {
  if (!lastDeletedSnapshot) return;
  const { drama, posterBlob } = lastDeletedSnapshot;
  dramas.push(drama);
  if (posterBlob) {
    try { await storePosterBlob(drama.id, posterBlob); } catch (e) {}
  }
  lastDeletedSnapshot = null;
  hideUndoToast();
  saveDramas();

  if (activePreview && activePreview.tmdbId === drama.tmdbId) {
    activePreview = null;
    activeModalDramaId = drama.id;
    document.getElementById('modal-menu-btn').style.display = '';
    document.getElementById('owner-only-sections').style.display = '';
    renderModalContent(drama.id);
  }
}

async function deleteDrama(dramaId) {
  const t = i18n[currentLang];

  const drama = dramas.find(d => d.id === dramaId);
  const showTitle = drama ? drama.title : 'this show';

  if (!confirm(`${t.confirmDelete} "${showTitle}"?`)) return;

  let posterBlob = null;
  try { posterBlob = await getPosterBlob(dramaId); } catch (e) {}
  const snapshot = drama ? JSON.parse(JSON.stringify(drama)) : null;

  await removeShowCore(dramaId);

  if (snapshot) {
    lastDeletedSnapshot = { drama: snapshot, posterBlob };
    showUndoToast(`"${showTitle}" ${t.deletedToast}`);
  }
} 

/* --- CLEAN POSTER RENDER LOGIC --- */
async function renderPosters() {
  const currentScrollY = window.scrollY;

  const grid = document.getElementById('posters-grid');
  grid.innerHTML = ''; 

  const sortBy = document.getElementById('sort-selector').value;
  const searchQuery = (document.getElementById('library-search-input').value || '').trim().toLowerCase();

  let filtered = dramas.filter(drama => {
    const count = drama.watchedEp.length;
    let matchesTab = true;
    if (currentFilter === 'watching') matchesTab = count > 0 && count < drama.totalEp;
    else if (currentFilter === 'completed') matchesTab = count === drama.totalEp && drama.totalEp > 0;
    else if (currentFilter === 'plan') matchesTab = count === 0;
    else if (currentFilter === 'favorites') matchesTab = drama.favorite;
    if (!matchesTab) return false;

    if (searchQuery) {
      const inTitle = drama.title.toLowerCase().includes(searchQuery);
      const inGenres = (drama.genres || []).some(g => g.toLowerCase().includes(searchQuery));
      if (!inTitle && !inGenres) return false;
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'added') return (b.addedAt || b.updatedAt || 0) - (a.addedAt || a.updatedAt || 0);
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
      card.onclick = () => openActorModal(actor.id);
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

function closeActorModal() {
  document.getElementById('actor-modal').classList.remove('active');
}
function closeActorModalOnBackdrop(e) {
  if (e.target.id === 'actor-modal') closeActorModal();
}

async function openActorModal(personId) {
  const t = i18n[currentLang];
  document.getElementById('actor-modal').classList.add('active');
  document.getElementById('actor-detail-photo').src = '';
  document.getElementById('actor-detail-name').textContent = '';
  document.getElementById('actor-detail-meta').textContent = '';
  document.getElementById('actor-detail-bio').textContent = '';
  document.getElementById('actor-filmography-scroll').innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">${t.loadingCast}</span>`;

  try {
    const [personRes, creditsRes] = await Promise.all([
      fetch(`https://api.themoviedb.org/3/person/${personId}?api_key=${TMDB_API_KEY}&language=${currentLang === 'fr' ? 'fr-FR' : 'en-US'}`),
      fetch(`https://api.themoviedb.org/3/person/${personId}/tv_credits?api_key=${TMDB_API_KEY}&language=${currentLang === 'fr' ? 'fr-FR' : 'en-US'}`)
    ]);
    const person = await personRes.json();
    const credits = await creditsRes.json();

    const photoUrl = person.profile_path ? `https://image.tmdb.org/t/p/w300${person.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Photo';
    document.getElementById('actor-detail-photo').src = photoUrl;
    document.getElementById('actor-detail-name').textContent = person.name || '';

    const metaParts = [];
    if (person.birthday) {
      const dateStr = new Date(person.birthday + 'T00:00:00').toLocaleDateString(currentLang === 'fr' ? 'fr-FR' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
      metaParts.push(`${t.bornLabel} : ${dateStr}`);
    }
    if (person.place_of_birth) metaParts.push(person.place_of_birth);
    document.getElementById('actor-detail-meta').textContent = metaParts.join(' · ');

    document.getElementById('actor-detail-bio').textContent = person.biography && person.biography.trim() ? person.biography : t.actorNoBio;

    const scroll = document.getElementById('actor-filmography-scroll');
    const filmography = (credits.cast || [])
      .filter(c => c.poster_path)
      .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
      .slice(0, 12);

    if (filmography.length === 0) {
      scroll.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">${t.noCastFound}</span>`;
    } else {
      scroll.innerHTML = '';
      filmography.forEach(show => {
        const posterUrl = `https://image.tmdb.org/t/p/w200${show.poster_path}`;
        const card = document.createElement('div');
        card.className = 'trending-card';
        card.onclick = () => {
          closeActorModal();
          const existing = dramas.find(d => d.tmdbId === show.id);
          if (existing) openModal(existing.id);
          else openPreviewModal(show.id, show.name, posterUrl, show.overview);
        };
        card.innerHTML = `<img src="${posterUrl}" alt="${show.name}"><div class="title">${show.name}</div>`;
        scroll.appendChild(card);
      });
    }
  } catch (e) {
    document.getElementById('actor-detail-bio').textContent = t.actorLoadFailed;
    document.getElementById('actor-filmography-scroll').innerHTML = '';
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

    const filteredResults = filterKoreanOnly(data.results || []);

    if (filteredResults.length === 0) {
      container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-muted);">${t.noRecsFound}</span>`;
      return;
    }

    filteredResults.slice(0, 8).forEach(show => {
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
  modalReturnTo = null;
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

  // Retour au modal précédent (recherche ou recommandations) plutôt
  // que de tout fermer d'un coup sur la page principale.
  if (modalReturnTo === 'search') {
    document.getElementById('search-results-modal').classList.add('active');
  } else if (modalReturnTo === 'recommendations') {
    document.getElementById('recommendations-modal').classList.add('active');
  }
  modalReturnTo = null;
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

  const titleEl = document.getElementById('modal-drama-title');
  const logoWrap = document.getElementById('banner-logo-wrap');
  const logoEl = document.getElementById('modal-banner-logo');
  if (meta.logoUrl) {
    logoEl.src = meta.logoUrl;
    logoEl.alt = meta.title;
    logoWrap.style.display = 'flex';
    titleEl.style.display = 'none';
  } else {
    logoWrap.style.display = 'none';
    logoEl.src = '';
    titleEl.style.display = '';
    titleEl.textContent = meta.title;
  }

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
    trailerRow.dataset.trailerKey = meta.trailerKey;
    trailerRow.style.display = 'flex';
  } else {
    trailerRow.style.display = 'none';
    delete trailerRow.dataset.trailerKey;
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

    btnB.className = 'action-morph role-watched' + (isCompleted ? ' is-done' : '');
    btnB.innerHTML = `✓ ${isCompleted ? t.completedLabel : t.previewMarkWatched}`;
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

  // Ouvre la saison actuellement en cours de visionnage — la première
  // qui n'est pas entièrement vue — ou la dernière si tout a été vu.
  let currentSeasonIndex = seasonsList.findIndex(season => {
    const keys = [];
    for (let i = 1; i <= season.episode_count; i++) keys.push(`S${season.season_number}E${i}`);
    return !(keys.length > 0 && keys.every(k => drama.watchedEp.includes(k)));
  });
  if (currentSeasonIndex === -1) currentSeasonIndex = seasonsList.length - 1;

  seasonsList.forEach((season, index) => {
    const isOpenAttr = index === currentSeasonIndex ? 'open' : '';
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
    trailerKey: drama.trailerKey,
    logoUrl: drama.logoUrl
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
document.getElementById('korean-only-btn').classList.toggle('active', koreanOnlySearch);
document.getElementById('app-version-footer').textContent = `Bingeul v${APP_VERSION}`;

const savedSort = localStorage.getItem('tvtime_sort');
if (savedSort) document.getElementById('sort-selector').value = savedSort;

document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
const savedTabBtn = document.getElementById('tab-' + currentFilter);
if (savedTabBtn) savedTabBtn.classList.add('active');

renderDashboard();
renderPosters();
renderUpcoming();

// Installation PWA : capte l'événement du navigateur pour proposer
// un vrai bouton "Installer" dans l'app plutôt que de compter sur un
// menu caché du navigateur. Ne fonctionne que sur Chrome/Edge/Samsung
// Internet — pas de support sur Firefox ni iOS/Safari.
let deferredInstallPrompt = null;

function isRunningStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  if (isRunningStandalone()) return; // sécurité : jamais dans l'app déjà installée
  deferredInstallPrompt = e;
  document.getElementById('install-app-group').style.display = 'block';
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt = null;
  document.getElementById('install-app-group').style.display = 'none';
});

async function installApp() {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  document.getElementById('install-app-group').style.display = 'none';
}

// Filet de sécurité supplémentaire : si jamais on tourne déjà en mode
// standalone au chargement, le bouton reste caché quoi qu'il arrive.
if (isRunningStandalone()) {
  document.getElementById('install-app-group').style.display = 'none';
}

// Écran de démarrage : le logo reste affiché un court instant, puis
// s'élève et rétrécit vers sa place dans l'en-tête (déjà rendu en
// dessous à ce stade) pendant que l'écran de démarrage s'efface.
const appSplash = document.getElementById('app-splash');
if (appSplash) {
  setTimeout(() => {
    const splashLogo = appSplash.querySelector('.splash-logo');
    const targetLogo = document.querySelector('header .app-logo');

    if (splashLogo && targetLogo && splashLogo.animate) {
      splashLogo.style.animation = 'none'; // stoppe la pulsation en boucle
      const from = splashLogo.getBoundingClientRect();
      const to = targetLogo.getBoundingClientRect();
      const scale = to.width / from.width;
      const dx = (to.left + to.width / 2) - (from.left + from.width / 2);
      const dy = (to.top + to.height / 2) - (from.top + from.height / 2);

      const anim = splashLogo.animate([
        { transform: 'translate(0px, 0px) scale(1)', opacity: 1, offset: 0 },
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 1, offset: 0.78 },
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0, offset: 1 }
      ], {
        duration: 700,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      });
      // Le fond plein écran s'efface en même temps que le logo, sur la
      // même dernière phase, pour un fondu global plutôt qu'une coupure
      // nette du fond après le logo.
      appSplash.animate([
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: 0.78 },
        { opacity: 0, offset: 1 }
      ], {
        duration: 700,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
        fill: 'forwards'
      });
      anim.onfinish = () => appSplash.remove();
      anim.oncancel = () => appSplash.remove();
    } else {
      // Repli si l'animation JS n'est pas disponible ou si la cible
      // n'a pas été trouvée : on retire l'écran directement.
      appSplash.remove();
    }
  }, 650);
}
