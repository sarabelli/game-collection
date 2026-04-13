/**
 * @fileoverview Gestione della collezione di videogiochi.
 */

/**
 * @typedef {Object} Game
 * @property {number} id - Identificativo univoco del gioco
 * @property {string} title - Titolo del gioco
 * @property {string} platform - Piattaforma (PC, PS5, Xbox, Switch, Altro)
 * @property {string} genre - Genere del gioco (RPG, FPS, ecc.)
 * @property {string} dev - Studio di sviluppo
 * @property {number|null} year - Anno di uscita
 */

/**
 * Salva la collezione nel localStorage del browser.
 * @returns {void}
 */
function saveToStorage() {
  localStorage.setItem("games", JSON.stringify(games));
  localStorage.setItem("nextId", nextId);
}

/**
 * Carica la collezione dal localStorage del browser.
 * @returns {void}
 */
function loadFromStorage() {
  const saved = localStorage.getItem("games");
  if (saved) {
    games = JSON.parse(saved);
    nextId = parseInt(localStorage.getItem("nextId")) || games.length + 1;
  }
}

/** @type {Game[]} */
let games = [];

/** @type {number} */
let nextId = 1;

/** @type {string|null} */
let sortKey = null;

/** @type {number} */
let sortDir = 1;

/**
 * Aggiunge un nuovo gioco alla collezione.
 * @returns {void}
 */
function addGame() {
  const title    = document.getElementById("inp-title").value.trim();
  const platform = document.getElementById("inp-platform").value;
  const genre    = document.getElementById("inp-genre").value;
  const dev      = document.getElementById("inp-dev").value.trim();
  const year     = document.getElementById("inp-year").value;
  const errEl    = document.getElementById("err");

  if (!title || !platform) {
    errEl.textContent = "Titolo e Piattaforma sono obbligatori.";
    errEl.style.display = "block";
    return;
  }
  errEl.style.display = "none";

  games.push({
    id: nextId++,
    title,
    platform,
    genre,
    dev,
    year: year ? parseInt(year) : null,
  });

  ["inp-title", "inp-platform", "inp-genre", "inp-dev", "inp-year"].forEach(id => {
    document.getElementById(id).value = "";
  });

  saveToStorage();
  render();
}

/**
 * Rimuove un gioco dalla collezione tramite il suo id.
 * @param {number} id - L'id del gioco da rimuovere
 * @returns {void}
 */
function removeGame(id) {
  games = games.filter(g => g.id !== id);
  saveToStorage();
  render();
}

/**
 * Gestisce l'ordinamento della lista per una chiave specifica.
 * @param {string} key - La proprietà per cui ordinare ('title' o 'year')
 * @returns {void}
 */
function toggleSort(key) {
  if (sortKey === key) {
    sortDir *= -1;
  } else {
    sortKey = key;
    sortDir = 1;
  }
  render();
}

/**
 * Filtra la lista dei giochi in base ai criteri attivi.
 * @param {string} query - Testo di ricerca
 * @param {string} platform - Piattaforma selezionata nel filtro
 * @param {string} genre - Genere selezionato nel filtro
 * @returns {Game[]} Lista dei giochi filtrati
 */
function filterGames(query, platform, genre) {
  return games.filter(g => {
    const matchQ = !query || g.title.toLowerCase().includes(query) || (g.dev && g.dev.toLowerCase().includes(query));
    const matchP = !platform || g.platform === platform;
    const matchG = !genre || g.genre === genre;
    return matchQ && matchP && matchG;
  });
}

/**
 * Ordina una lista di giochi in base a sortKey e sortDir attivi.
 * @param {Game[]} list - Lista da ordinare
 * @returns {Game[]} Lista ordinata
 */
function sortGames(list) {
  if (!sortKey) return list;
  return [...list].sort((a, b) => {
    let av = a[sortKey] ?? "";
    let bv = b[sortKey] ?? "";
    if (typeof av === "string") return av.localeCompare(bv) * sortDir;
    return (av - bv) * sortDir;
  });
}

/**
 * Aggiorna le frecce di ordinamento nella intestazione della tabella.
 * @returns {void}
 */
function updateSortArrows() {
  document.getElementById("s-title").textContent = sortKey === "title" ? (sortDir === 1 ? "↑" : "↓") : "";
  document.getElementById("s-year").textContent  = sortKey === "year"  ? (sortDir === 1 ? "↑" : "↓") : "";
}

/**
 * Aggiorna le statistiche in cima alla pagina.
 * @returns {void}
 */
function updateStats() {
  const plats  = new Set(games.map(g => g.platform)).size;
  const genres = new Set(games.filter(g => g.genre).map(g => g.genre)).size;
  document.getElementById("st-total").textContent = games.length;
  document.getElementById("st-plat").textContent  = plats;
  document.getElementById("st-genre").textContent = genres;
}

/**
 * Renderizza la tabella con i giochi filtrati e ordinati.
 * @returns {void}
 */
function render() {
  const q  = document.getElementById("search").value.toLowerCase();
  const fp = document.getElementById("filter-plat").value;
  const fg = document.getElementById("filter-genre").value;

  const list = sortGames(filterGames(q, fp, fg));

  updateSortArrows();

  const tbody = document.getElementById("tbody");
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">Nessun gioco trovato.</td></tr>`;
  } else {
    tbody.innerHTML = list.map(g => `
      <tr>
        <td style="font-weight:500">${g.title}</td>
        <td><span class="badge badge-${g.platform}">${g.platform}</span></td>
        <td>${g.genre || "—"}</td>
        <td style="color:#666">${g.dev || "—"}</td>
        <td>${g.year || "—"}</td>
        <td><button class="btn btn-danger" onclick="removeGame(${g.id})">Rimuovi</button></td>
      </tr>`).join("");
  }

  updateStats();
}

loadFromStorage();
render();