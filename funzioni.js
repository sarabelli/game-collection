"use strict";

let videogiochi = [];

function aggiungiVideogioco(titolo, piattaforma, genere, anno, sviluppatore) {
    if (!titolo || !piattaforma) {
        console.log("❌ Titolo e piattaforma sono obbligatori.");
        return;
    }

    videogiochi.push({ titolo, piattaforma, genere, anno, sviluppatore });
    console.log(`✅ "${titolo}" aggiunto!`);
}

function rimuoviVideogioco(titolo) {
    const prima = videogiochi.length;
    videogiochi = videogiochi.filter(v => v.titolo.toLowerCase() !== titolo.toLowerCase());

    if (videogiochi.length < prima) {
        console.log(`✅ "${titolo}" rimosso!`);
    } else {
        console.log(`❌ "${titolo}" non trovato.`);
    }
}

function visualizzaVideogiochi() {
    if (videogiochi.length === 0) {
        console.log("\n📭 Nessun videogioco nella collezione.\n");
        return;
    }

    console.log(`\n🎮 COLLEZIONE (${videogiochi.length} giochi)\n`);

    videogiochi.forEach((v, i) => {
        console.log(`#${i + 1} ${v.titolo}`);
        console.log(`   Piattaforma  : ${v.piattaforma}`);
        console.log(`   Genere       : ${v.genere       || "—"}`);
        console.log(`   Anno         : ${v.anno         || "—"}`);
        console.log(`   Sviluppatore : ${v.sviluppatore || "—"}`);
        console.log("");
    });
}

function cercaVideogiochi(testo) {
    const risultati = videogiochi.filter(v =>
        v.titolo.toLowerCase().includes(testo.toLowerCase()) ||
        (v.sviluppatore || "").toLowerCase().includes(testo.toLowerCase())
    );

    if (risultati.length === 0) {
        console.log("📭 Nessun risultato.");
    } else {
        risultati.forEach((v, i) => {
            console.log(`#${i + 1} ${v.titolo} — ${v.piattaforma}`);
        });
    }
}

function ordinaVideogiochi(criterio) {
    if (criterio === "titolo") {
        videogiochi.sort((a, b) => a.titolo.localeCompare(b.titolo, "it"));
    } else if (criterio === "anno") {
        videogiochi.sort((a, b) => (a.anno || 0) - (b.anno || 0));
    } else {
        console.log("❌ Criterio non valido. Usa: titolo oppure anno.");
        return;
    }

    console.log(`✅ Collezione ordinata per ${criterio}.`);
}

module.exports = {
    aggiungiVideogioco,
    rimuoviVideogioco,
    visualizzaVideogiochi,
    cercaVideogiochi,
    ordinaVideogiochi
};