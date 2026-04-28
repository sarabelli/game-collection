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

function getUniqueValues(key) {
  return [...new Set(games.map((game) => game[key]).filter(Boolean))].sort();
}

function updateFilterOptions() {
  const platforms = getUniqueValues("platform");
  const genres = getUniqueValues("genre");

  platformFilter.innerHTML = '<option value="">Tutte le piattaforme</option>';
  genreFilter.innerHTML = '<option value="">Tutti i generi</option>';

  platforms.forEach((platform) => {
    platformFilter.innerHTML += `<option value="${platform}">${platform}</option>`;
  });

  genres.forEach((genre) => {
    genreFilter.innerHTML += `<option value="${genre}">${genre}</option>`;
  });

  platformFilter.value = filters.platform;
  genreFilter.value = filters.genre;
}

function getVisibleGames() {
  const filteredGames = games.filter((game) => {
    const searchValue = filters.search.toLowerCase();
    const matchesPlatform = !filters.platform || game.platform === filters.platform;
    const matchesGenre = !filters.genre || game.genre === filters.genre;
    const matchesSearch =
      !searchValue ||
      game.title.toLowerCase().includes(searchValue) ||
      game.studio.toLowerCase().includes(searchValue);

    return matchesPlatform && matchesGenre && matchesSearch;
  });

  return filteredGames.sort((firstGame, secondGame) => {
    if (filters.sort === "title-desc") {
      return secondGame.title.localeCompare(firstGame.title);
    }

    if (filters.sort === "year-asc") {
      return Number(firstGame.year || 0) - Number(secondGame.year || 0);
    }

    if (filters.sort === "year-desc") {
      return Number(secondGame.year || 0) - Number(firstGame.year || 0);
    }

    return firstGame.title.localeCompare(secondGame.title);
  });
}

function renderGames() {
  const visibleGames = getVisibleGames();
  gameList.innerHTML = "";
  updateFilterOptions();

  if (visibleGames.length === 0) {
    gameList.innerHTML = "<p>Nessun gioco salvato.</p>";
    gameCount.textContent = "0 giochi";
    return;
  }

  visibleGames.forEach((game) => {
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

  gameCount.textContent = `${visibleGames.length} giochi`;
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

platformFilter.addEventListener("change", () => {
  filters.platform = platformFilter.value;
  renderGames();
});

genreFilter.addEventListener("change", () => {
  filters.genre = genreFilter.value;
  renderGames();
});

sortBy.addEventListener("change", () => {
  filters.sort = sortBy.value;
  renderGames();
});

searchInput.addEventListener("input", () => {
  filters.search = searchInput.value.trim();
  renderGames();
});

renderGames();
