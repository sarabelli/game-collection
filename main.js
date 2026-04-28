/**
 * Chiave usata per salvare i giochi nel localStorage.
 * @constant {string}
 */
const CHIAVE_STORAGE = "game-collection-items";

/**
 * Form principale per aggiungere un gioco.
 * @type {HTMLFormElement}
 */
const modulo = document.querySelector("#game-form");

/**
 * Contenitore della lista giochi.
 * @type {HTMLElement}
 */
const lista = document.querySelector("#game-list");

/**
 * Elemento che mostra il conteggio dei giochi.
 * @type {HTMLElement}
 */
const conteggio = document.querySelector("#game-count");

/**
 * Select filtro piattaforma.
 * @type {HTMLSelectElement}
 */
const filtroPiattaforma = document.querySelector("#filter-platform");

/**
 * Select filtro genere.
 * @type {HTMLSelectElement}
 */
const filtroGenere = document.querySelector("#filter-genre");

/**
 * Select ordinamento.
 * @type {HTMLSelectElement}
 */
const ordine = document.querySelector("#sort-by");

/**
 * Input ricerca testuale.
 * @type {HTMLInputElement}
 */
const ricerca = document.querySelector("#search");

/**
 * Bottone reset filtri.
 * @type {HTMLButtonElement}
 */
const reset = document.querySelector("#reset-filters");

/**
 * Stato globale dei filtri applicati alla lista giochi.
 * @typedef {Object} Filtri
 * @property {string} ricerca
 * @property {string} piattaforma
 * @property {string} genere
 * @property {string} ordine
 */

/**
 * Filtri attivi correnti.
 * @type {Filtri}
 */
let filtri = {
  ricerca: "",
  piattaforma: "",
  genere: "",
  ordine: "title-asc"
};

/**
 * Crea un oggetto gioco a partire dai dati del form.
 *
 * @param {Object} d - dati del gioco
 * @param {string} d.title - titolo del gioco
 * @param {string} d.platform - piattaforma
 * @param {string} d.genre - genere
 * @param {number|string} d.year - anno di uscita
 * @param {string} d.studio - studio di sviluppo
 * @returns {Object} gioco normalizzato con id unico
 */
function crea(d) {
  return {
    id: crypto.randomUUID(),
    titolo: d.title,
    piattaforma: d.platform,
    genere: d.genre,
    anno: d.year,
    studio: d.studio
  };
}

/**
 * Restituisce la lista giochi filtrata e ordinata secondo i filtri attivi.
 *
 * @returns {Array<Object>} lista filtrata e ordinata dei giochi
 */
function filtrati() {
  return giochi
    .filter(g => {
      const r = filtri.ricerca.toLowerCase();

      return (
        (!filtri.piattaforma || g.piattaforma === filtri.piattaforma) &&
        (!filtri.genere || g.genere === filtri.genere) &&
        (!r || g.titolo.toLowerCase().includes(r))
      );
    })
    .sort((a, b) => {
      if (filtri.ordine === "title-desc")
        return b.titolo.localeCompare(a.titolo);

      if (filtri.ordine === "year-asc")
        return (a.anno || 0) - (b.anno || 0);

      if (filtri.ordine === "year-desc")
        return (b.anno || 0) - (a.anno || 0);

      return a.titolo.localeCompare(b.titolo);
    });
}

/**
 * Renderizza la lista giochi nel DOM e aggiorna il conteggio.
 */
function render() {
  const list = filtrati();

  lista.innerHTML = list.length
    ? list.map(g => `
      <article class="game-card">
        <h3>${g.titolo}</h3>
        <p>${g.piattaforma}</p>
        <button data-id="${g.id}">Rimuovi</button>
      </article>
    `).join("")
    : "<p>Nessun gioco</p>";

  conteggio.textContent = `${list.length} giochi`;
}

/**
 * Gestisce il submit del form aggiungendo un nuovo gioco.
 */
modulo.addEventListener("submit", (e) => {
  e.preventDefault();

  const d = new FormData(modulo);

  giochi.unshift(crea({
    title: d.get("title"),
    platform: d.get("platform"),
    genre: d.get("genre"),
    year: d.get("year"),
    studio: d.get("studio")
  }));

  salva();
  render();
  modulo.reset();
});

/**
 * Gestisce la rimozione di un gioco tramite click sul bottone.
 */
lista.addEventListener("click", (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  giochi = giochi.filter(g => g.id !== id);
  salva();
  render();
});

/**
 * Aggiorna filtro piattaforma.
 */
filtroPiattaforma.onchange = e => {
  filtri.piattaforma = e.target.value;
  render();
};

/**
 * Aggiorna filtro genere.
 */
filtroGenere.onchange = e => {
  filtri.genere = e.target.value;
  render();
};

/**
 * Aggiorna criterio di ordinamento.
 */
ordine.onchange = e => {
  filtri.ordine = e.target.value;
  render();
};

/**
 * Aggiorna ricerca testuale.
 */
ricerca.oninput = e => {
  filtri.ricerca = e.target.value;
  render();
};

/**
 * Reset completo dei filtri.
 */
reset.onclick = () => {
  filtri = {
    ricerca: "",
    piattaforma: "",
    genere: "",
    ordine: "title-asc"
  };

  modulo.reset();
  render();
};

/**
 * Render iniziale della lista.
 */
render();