let games = [];

export function addGame(title, platform){
  games.push({ title, platform });
}

export function removeGame(title){
  games = games.filter(game => game.title !== title);
}

export function listGames(){
  return games;
}