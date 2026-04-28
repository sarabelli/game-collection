const STORAGE_KEY = "game-collection-items";

const form = document.querySelector("#game-form");
const gameList = document.querySelector("#game-list");
const gameCount = document.querySelector("#game-count");
const platformFilter = document.querySelector("#filter-platform");
const genreFilter = document.querySelector("#filter-genre");
const sortBy = document.querySelector("#sort-by");
const searchInput = document.querySelector("#search");

let games = loadGames();
let filters = {
  search: "",
  platform: "",
  genre: "",
  sort: "title-asc"
};

function loadGames() {
  const savedGames = localStorage.getItem(STORAGE_KEY);

  if (!savedGames) {
    return [];
  }

  try {
    const parsedGames = JSON.parse(savedGames);
    return Array.isArray(parsedGames) ? parsedGames : [];
  } catch (error) {
    return [];
  }
}

function saveGames() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

function removeGame(gameId) {
  games = games.filter((game) => game.id !== gameId);
  saveGames();
  renderGames();
}

function createGame(data) {
  return {
    id: crypto.randomUUID(),
    title: data.title.trim(),
    platform: data.platform,
    genre: data.genre.trim(),
    year: data.year.trim(),
    studio: data.studio.trim()
  };
}

function renderGames() {
  gameList.innerHTML = "";

  if (games.length === 0) {
    gameList.innerHTML = "<p>Nessun gioco salvato.</p>";
    gameCount.textContent = "0 giochi";
    return;
  }

  games.forEach((game) => {
    const card = document.createElement("article");
    card.className = "game-card";
    card.innerHTML = `
      <h3>${game.title}</h3>
      <p>Piattaforma: ${game.platform}</p>
      <p>Genere: ${game.genre || "-"}</p>
      <p>Anno: ${game.year || "-"}</p>
      <p>Studio: ${game.studio || "-"}</p>
      <button type="button" data-id="${game.id}">Rimuovi</button>
    `;
    gameList.appendChild(card);
  });

  gameCount.textContent = `${games.length} giochi`;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const newGame = createGame({
    title: formData.get("title") || "",
    platform: formData.get("platform") || "",
    genre: formData.get("genre") || "",
    year: formData.get("year") || "",
    studio: formData.get("studio") || ""
  });

  games.unshift(newGame);
  saveGames();
  renderGames();
  form.reset();
});

gameList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");

  if (!button) {
    return;
  }

  removeGame(button.dataset.id);
});

renderGames();
