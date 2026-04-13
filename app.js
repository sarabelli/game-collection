let games = [];
let nextId = 1;
let sortKey = null;
let sortDir = 1;
let searchTimeout = null;

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

/**
 * Tenta la fetch tramite più proxy in sequenza.
 * Se uno fallisce passa automaticamente al successivo.
 * @param {string} url - URL da fetchare
 * @returns {Promise<Object>} Dati JSON della risposta
 */
async function fetchWithFallback(url) {
  const proxies = [
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://proxy.cors.sh/${url}`,
  ];

  for (const proxy of proxies) {
    try {
      const res = await fetch(proxy);
      if (!res.ok) continue;
      const json = await res.json();
      const text = json.contents ?? json;
      return typeof text === "string" ? JSON.parse(text) : text;
    } catch {
      continue;
    }
  }
  throw new Error("Tutti i proxy hanno fallito");
}

/**
 * Cerca un gioco su Steam in base al testo inserito nel campo titolo.
 * Usa un debounce di 200ms per evitare troppe chiamate API.
 * @returns {void}
 */
function searchSteam() {
  const query = document.getElementById("inp-title").value.trim();
  const resultsEl = document.getElementById("steam-results");

  if (searchTimeout) clearTimeout(searchTimeout);

  if (query.length < 2) {
    resultsEl.innerHTML = "";
    return;
  }

  resultsEl.innerHTML = `<div style="font-size:13px;color:#999;margin-top:8px;">Ricerca in corso...</div>`;

  searchTimeout = setTimeout(async () => {
    try {
      const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query.toLowerCase())}&l=italian&cc=IT`;
      const data = await fetchWithFallback(url);

      if (!data.items || data.items.length === 0) {
        resultsEl.innerHTML = `<div style="font-size:13px;color:#999;margin-top:8px;">Nessun risultato su Steam.</div>`;
        return;
      }

      const top5 = data.items.slice(0, 5);
      resultsEl.innerHTML = top5.map(game => `
        <div class="steam-suggestion" onclick="selectSteamGame(${game.id}, '${game.name.replace(/'/g, "\\'")}', '${game.tiny_image}')">
          <img src="${game.tiny_image}" alt="${game.name}" />
          <div class="steam-suggestion-info">
            <div class="steam-suggestion-title">${game.name}</div>
            <div class="steam-suggestion-meta">App ID: ${game.id}</div>
          </div>
        </div>
      `).join("");

    } catch (err) {
      resultsEl.innerHTML = `<div style="font-size:13px;color:#999;margin-top:8px;">Errore nella ricerca Steam.</div>`;
    }
  }, 200);
}

/**
 * Seleziona un gioco dai suggerimenti Steam e recupera i dettagli completi.
 * Compila automaticamente i campi del form.
 * @param {number} appId - L'App ID del gioco su Steam
 * @param {string} name - Il nome del gioco
 * @param {string} image - L'URL dell'immagine del gioco
 * @returns {Promise<void>}
 */
async function selectSteamGame(appId, name, image) {
  document.getElementById("inp-title").value = name;
  document.getElementById("steam-results").innerHTML = `<div style="font-size:13px;color:#666;margin-top:8px;">Caricamento dettagli...</div>`;

  try {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=italian&cc=IT`;
    const data = await fetchWithFallback(url);
    const details = data[appId]?.data;

    if (details) {
      document.getElementById("inp-platform").value = "PC";

      if (details.developers && details.developers.length > 0) {
        document.getElementById("inp-dev").value = details.developers[0];
      }

      if (details.release_date?.date) {
        const year = details.release_date.date.split(" ").pop();
        if (!isNaN(year) && year.length === 4) {
          document.getElementById("inp-year").value = year;
        }
      }

      if (details.genres && details.genres.length > 0) {
        const steamGenre = details.genres[0].description;
        const genreMap = {
          "Giochi di ruolo": "RPG",
          "RPG": "RPG",
          "Sparatutto": "FPS",
          "Action": "Action",
          "Azione": "Action",
          "Avventura": "Adventure",
          "Adventure": "Adventure",
          "Sport": "Sport",
          "Strategia": "Strategy",
          "Strategy": "Strategy",
          "Horror": "Horror",
        };
        const mapped = genreMap[steamGenre] || "Altro";
        document.getElementById("inp-genre").value = mapped;
      }
    }

    document.getElementById("steam-results").innerHTML = `<div style="font-size:13px;color:#27500A;margin-top:8px;">✓ Dati compilati da Steam! Controlla e clicca Aggiungi.</div>`;

  } catch (err) {
    document.getElementById("steam-results").innerHTML = `<div style="font-size:13px;color:#999;margin-top:8px;">Dati parziali, compila i campi mancanti.</div>`;
  }
}

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

  document.getElementById("steam-results").innerHTML = "";
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
    tbody.innerHTML = `<tr><td colspan="6" class="empty">Nessun gioco nella collezione.</td></tr>`;
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