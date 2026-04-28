import promptSync from "prompt-sync";
import {
  addGame,
  removeGame,
  listGames,
  filterByPlatform,
  filterByGenre,
  searchGame,
  sortByTitle,
  sortByYear
} from "./gameManager.js";

const prompt = promptSync();

function menu() {
  console.log("\n=== GAME COLLECTION ===");
  console.log("1. Add game");
  console.log("2. Remove game");
  console.log("3. List all games");
  console.log("4. Filter by platform");
  console.log("5. Filter by genre");
  console.log("6. Search game");
  console.log("7. Sort by title");
  console.log("8. Sort by year");
  console.log("9. Exit");

  const choice = prompt("Choose option: ");

  switch (choice) {
    case "1": {
      const title = prompt("Title: ");
      const platform = prompt("Platform: ");
      const year = Number(prompt("Year: "));
      const genre = prompt("Genre: ");

      addGame(title, platform, year, genre);
      console.log("Game added!");
      menu();
      break;
    }

    case "2": {
      const id = Number(prompt("Game ID to remove: "));
      removeGame(id);
      console.log("Game removed!");
      menu();
      break;
    }

    case "3":
      console.log(listGames());
      menu();
      break;

    case "4": {
      const platform = prompt("Platform: ");
      console.log(filterByPlatform(platform));
      menu();
      break;
    }

    case "5": {
      const genre = prompt("Genre: ");
      console.log(filterByGenre(genre));
      menu();
      break;
    }

    case "6": {
      const text = prompt("Search title: ");
      console.log(searchGame(text));
      menu();
      break;
    }

    case "7":
      console.log(sortByTitle());
      menu();
      break;

    case "8":
      console.log(sortByYear());
      menu();
      break;

    case "9":
      console.log("Bye!");
      break;

    default:
      console.log("Invalid option");
      menu();
  }
}

menu();