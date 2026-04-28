let games = [];
let id = 1;

export function addGame(title, platform) {
  games.push({ id: id++, title, platform });
}

export function removeGame(gameId) {
  games = games.filter(game => game.id !== gameId);
}

export function listGames() {
  return games;
}