/**
 * @fileoverview CLI per gestione collezione videogiochi
 */

"use strict";

const prompt = require("prompt-sync")({ sigint: true });

const {
    aggiungiVideogioco,
    rimuoviVideogioco,
    visualizzaVideogiochi,
    cercaVideogiochi,
    ordinaVideogiochi
} = require("./funzioni");

// ─── Utility ─────────────────────────────────────────────

function pausa() {
    prompt("\n⏸️ Premi INVIO per continuare...");
}

function chiedi(domanda, obbligatorio = false) {
    let valore;

    do {
        valore = (prompt(domanda) || "").trim();

        if (obbligatorio && !valore) {
            console.log("⚠️ Campo obbligatorio, riprova.");
        }
    } while (obbligatorio && !valore);

    return valore;
}

function separatore() {
    console.log("\n" + "─".repeat(40) + "\n");
}

// ─── Menu ───────────────────────────────────────────────

function mostraMenu() {
    console.clear();
    console.log("╔════════════════════════════╗");
    console.log("║ 🎮 GESTIONE VIDEOGIOCHI   ║");
    console.log("╠════════════════════════════╣");
    console.log("║ 1 - Aggiungi gioco        ║");
    console.log("║ 2 - Rimuovi gioco         ║");
    console.log("║ 3 - Visualizza collezione ║");
    console.log("║ 4 - Cerca gioco           ║");
    console.log("║ 5 - Ordina (titolo/anno)  ║");
    console.log("║ 0 - Esci                  ║");
    console.log("╚════════════════════════════╝");

    return (prompt("\n👉 Scelta: ") || "").trim();
}

// ─── Azioni ─────────────────────────────────────────────

function azioneAggiungi() {
    console.clear();
    console.log("── AGGIUNGI VIDEOGIOCO ──\n");

    const titolo = chiedi("🎮 Titolo: ", true);
    const piattaforma = chiedi("💻 Piattaforma: ", true);
    const genere = chiedi("🎯 Genere: ");
    const annoStr = chiedi("📅 Anno: ");
    const sviluppatore = chiedi("🏢 Sviluppatore: ");

    const anno = annoStr ? parseInt(annoStr, 10) : null;

    aggiungiVideogioco(titolo, piattaforma, genere, anno, sviluppatore);

    pausa();
}

function azioneRimuovi() {
    console.clear();
    console.log("── RIMUOVI VIDEOGIOCO ──\n");

    const titolo = chiedi("🎮 Titolo da rimuovere: ", true);

    rimuoviVideogioco(titolo);

    pausa();
}

function azioneVisualizza() {
    console.clear();
    visualizzaVideogiochi();
    pausa();
}

function azioneCerca() {
    console.clear();
    console.log("── CERCA VIDEOGIOCO ──\n");

    const testo = chiedi("🔎 Cerca: ", true);

    cercaVideogiochi(testo);

    pausa();
}

function azioneOrdina() {
    console.clear();
    console.log("── ORDINA COLLEZIONE ──\n");

    console.log("Opzioni: titolo | anno\n");

    const criterio = chiedi("📊 Ordina per: ", true);

    ordinaVideogiochi(criterio);

    pausa();
}

// ─── Loop principale ────────────────────────────────────

function menu() {
    while (true) {
        const scelta = mostraMenu();

        switch (scelta) {
            case "1":
                azioneAggiungi();
                break;

            case "2":
                azioneRimuovi();
                break;

            case "3":
                azioneVisualizza();
                break;

            case "4":
                azioneCerca();
                break;

            case "5":
                azioneOrdina();
                break;

            case "0":
                console.log("\n👋 Ciao!\n");
                process.exit(0);

            default:
                console.log("\n❌ Scelta non valida.");
                pausa();
        }
    }
}

menu();