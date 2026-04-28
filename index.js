import promptSync from "prompt-sync";
import { addGame, removeGame, listGames } from "./gameManager.js";

const prompt = promptSync();

function menu() {
  console.log("\n--- GAME COLLECTION ---");
  console.log("1. Add game");
  console.log("2. Remove game");
  console.log("3. List games");
  console.log("4. Exit");

  const choice = prompt("Choose option: ");

  switch (choice) {
    case "1": {
      const title = prompt("Title: ");
      const platform = prompt("Platform: ");
      addGame(title, platform);
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

    case "4":
      console.log("Bye!");
      break;

    default:
      console.log("Invalid option");
      menu();
  }
}

menu();