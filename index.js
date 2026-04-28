const prompt = require("prompt-sync")();

const {
    aggiungiVideogioco,
    rimuoviVideogioco,
    visualizzaVideogiochi,
    filtraVideogiochi,
    ordinaVideogiochi,
    cercaVideogiochi
} = require("./funzioni");

function menu() {
    let uscita = false;

    while (!uscita) {
        const scelta = prompt(
`🎮 GESTIONE VIDEOGIOCHI

1 - Aggiungi videogioco
2 - Rimuovi videogioco
3 - Visualizza collezione
4 - Filtra videogiochi
5 - Ordina videogiochi
6 - Cerca videogioco
0 - Esci

Scegli un'opzione: `
        );

        switch (scelta) {
            case "1":
                const titolo = prompt("Titolo: ");
                const piattaforma = prompt("Piattaforma: ");
                const genere = prompt("Genere: ");
                const anno = parseInt(prompt("Anno: "));
                const sviluppatore = prompt("Sviluppatore: ");

                aggiungiVideogioco(titolo, piattaforma, genere, anno, sviluppatore);
                console.log("✔ Videogioco aggiunto!");
                break;

            case "2":
                const id = prompt("ID o Titolo da rimuovere: ");
                const rimosso = rimuoviVideogioco(id);
                console.log(rimosso ? "✔ Rimosso!" : "❌ Non trovato");
                break;

            case "3":
                console.table(visualizzaVideogiochi());
                break;

            case "4":
                const chiave = prompt("Filtra per 'piattaforma' o 'genere': ");
                const valore = prompt("Valore: ");
                console.table(filtraVideogiochi(chiave, valore));
                break;

            case "5":
                const criterio = prompt("Ordina per 'titolo' o 'anno': ");
                console.table(ordinaVideogiochi(criterio));
                break;

            case "6":
                const ricerca = prompt("Cerca titolo o sviluppatore: ");
                console.table(cercaVideogiochi(ricerca));
                break;

            case "0":
                uscita = true;
                console.log("👋 Uscita dal programma");
                break;

            default:
                console.log("Scelta non valida");
        }
    }
}

menu();