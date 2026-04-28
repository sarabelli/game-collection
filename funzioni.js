let videogiochi = [];

function aggiungiVideogioco(titolo, piattaforma, genere, anno, sviluppatore) {
    const gioco = {
        id: Date.now(),
        titolo,
        piattaforma,
        genere,
        anno,
        sviluppatore
    };

    videogiochi.push(gioco);
    return gioco;
}

function rimuoviVideogioco(identificativo) {
    const lunghezzaIniziale = videogiochi.length;

    videogiochi = videogiochi.filter(v =>
        v.id != identificativo &&
        v.titolo.toLowerCase() !== identificativo.toLowerCase()
    );

    return videogiochi.length < lunghezzaIniziale;
}

function visualizzaVideogiochi() {
    console.clear();

    if (videogiochi.length === 0) {
        console.log("\n📭 Nessun videogioco nella collezione.\n");
        return;
    }

    console.log("\n🎮 ===== COLLEZIONE VIDEOGIOCHI ===== 🎮\n");

    videogiochi.forEach((v, index) => {
        console.log(`🕹️  #${index + 1}`);
        console.log(`📌 Titolo       : ${v.titolo}`);
        console.log(`💻 Piattaforma  : ${v.piattaforma}`);
        console.log(`🎯 Genere       : ${v.genere}`);
        console.log(`📅 Anno         : ${v.anno}`);
        console.log(`🏢 Sviluppatore : ${v.sviluppatore}`);
        console.log(`──────────────────────────────────────\n`);
    });
}

function filtraVideogiochi(chiave, valore) {
    return videogiochi.filter(v =>
        v[chiave] && v[chiave].toLowerCase() === valore.toLowerCase()
    );
}

function ordinaVideogiochi(criterio) {
    const ordinati = [...videogiochi];

    if (criterio === "titolo") {
        ordinati.sort((a, b) => a.titolo.localeCompare(b.titolo));
    }

    if (criterio === "anno") {
        ordinati.sort((a, b) => a.anno - b.anno);
    }

    return ordinati;
}

function cercaVideogiochi(testo) {
    return videogiochi.filter(v =>
        v.titolo.toLowerCase().includes(testo.toLowerCase()) ||
        v.sviluppatore.toLowerCase().includes(testo.toLowerCase())
    );
}

module.exports = {
    aggiungiVideogioco,
    rimuoviVideogioco,
    visualizzaVideogiochi,
    filtraVideogiochi,
    ordinaVideogiochi,
    cercaVideogiochi
};