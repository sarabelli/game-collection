const prompt = require("prompt-sync")();

const {
    aggiungiVideogioco,
    rimuoviVideogioco,
    visualizzaVideogiochi,
    filtraVideogiochi,
    ordinaVideogiochi,
    cercaVideogiochi
} = require("./funzioni");

function pausa() {
    prompt("\n⏸️ Premi INVIO per continuare...");
}

function menu() {
    let uscita = false;

    while (!uscita) {
        console.clear();

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
                console.log("\n✔ Videogioco aggiunto!");
                pausa();
                break;

            case "2":
                const id = prompt("ID o Titolo da rimuovere: ");
                const rimosso = rimuoviVideogioco(id);

                console.log(rimosso ? "\n✔ Rimosso!" : "\n❌ Non trovato");
                pausa();
                break;

            case "3":
                visualizzaVideogiochi();
                pausa();
                break;

            case "4":
                const chiave = prompt("piattaforma o genere: ");
                const valore = prompt("Valore: ");
                console.table(filtraVideogiochi(chiave, valore));
                pausa();
                break;

            case "5":
                const criterio = prompt("titolo o anno: ");
                console.table(ordinaVideogiochi(criterio));
                pausa();
                break;

            case "6":
                const ricerca = prompt("Cerca: ");
                console.table(cercaVideogiochi(ricerca));
                pausa();
                break;

            case "0":
                uscita = true;
                console.log("\n👋 Uscita dal programma");
                break;

            default:
                console.log("\n❌ Scelta non valida");
                pausa();
        }
    }
}

menu();