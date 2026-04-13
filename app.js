let games = [];
let nextId = 1;

function addGame() {
  const title    = document.getElementById("inp-title").value.trim();
  const platform = document.getElementById("inp-platform").value;
  const genre    = document.getElementById("inp-genre").value;
  const dev      = document.getElementById("inp-dev").value.trim();
  const year     = document.getElementById("inp-year").value;
  const errEl    = document.getElementById("err");

  if (!title || !platform) {
    errEl.textContent = "Titolo e Piattaforma sono obbligatori.";
    errEl.style.display = "block";
    return;
  }
  errEl.style.display = "none";

  games.push({
    id: nextId++,
    title,
    platform,
    genre,
    dev,
    year: year ? parseInt(year) : null,
  });

  ["inp-title", "inp-platform", "inp-genre", "inp-dev", "inp-year"].forEach(id => {
    document.getElementById(id).value = "";
  });

  render();
}

function removeGame(id) {
  games = games.filter(g => g.id !== id);
  render();
}

function render() {
  const tbody = document.getElementById("tbody");

  if (!games.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">Nessun gioco nella collezione.</td></tr>`;
  } else {
    tbody.innerHTML = games.map(g => `
      <tr>
        <td style="font-weight:500">${g.title}</td>
        <td><span class="badge badge-${g.platform}">${g.platform}</span></td>
        <td>${g.genre || "—"}</td>
        <td style="color:#666">${g.dev || "—"}</td>
        <td>${g.year || "—"}</td>
        <td><button class="btn btn-danger" onclick="removeGame(${g.id})">Rimuovi</button></td>
      </tr>`).join("");
  }

  const plats  = new Set(games.map(g => g.platform)).size;
  const genres = new Set(games.filter(g => g.genre).map(g => g.genre)).size;
  document.getElementById("st-total").textContent = games.length;
  document.getElementById("st-plat").textContent  = plats;
  document.getElementById("st-genre").textContent = genres;
}

render();