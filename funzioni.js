// Collezione videogiochi
let videogiochi = [];

// Aggiungi videogioco
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

// Rimuovi videogioco (per id o titolo)
function rimuoviVideogioco(identificativo) {
    const lunghezzaIniziale = videogiochi.length;

    videogiochi = videogiochi.filter(v =>
        v.id != identificativo &&
        v.titolo.toLowerCase() !== identificativo.toLowerCase()
    );

    return videogiochi.length < lunghezzaIniziale;
}

// Visualizza collezione
function visualizzaVideogiochi() {
    return videogiochi;
}

// Filtra per piattaforma o genere
function filtraVideogiochi(chiave, valore) {
    return videogiochi.filter(v =>
        v[chiave] && v[chiave].toLowerCase() === valore.toLowerCase()
    );
}

// Ordina videogiochi
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

// Ricerca videogiochi (titolo o sviluppatore)
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