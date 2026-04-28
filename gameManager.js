let games = [];
let id = 1;

export function addGame(title, platform, year, genre) {
  games.push({
    id: id++,
    title,
    platform,
    year,
    genre
  });
}

export function removeGame(gameId) {
  games = games.filter(game => game.id !== gameId);
}

export function listGames() {
  return games;
}

export function filterByPlatform(platform) {
  return games.filter(g => g.platform.toLowerCase() === platform.toLowerCase());
}

export function filterByGenre(genre) {
  return games.filter(g => g.genre.toLowerCase() === genre.toLowerCase());
}

export function searchGame(text) {
  return games.filter(g =>
    g.title.toLowerCase().includes(text.toLowerCase())
  );
}

export function sortByTitle() {
  return [...games].sort((a, b) => a.title.localeCompare(b.title));
}

export function sortByYear() {
  return [...games].sort((a, b) => a.year - b.year);
}