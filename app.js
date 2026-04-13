let games = [];
let nextId = 1;
let sortKey = null;
let sortDir = 1;

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

function toggleSort(key) {
  if (sortKey === key) {
    sortDir *= -1;
  } else {
    sortKey = key;
    sortDir = 1;
  }
  render();
}

function render() {
  const q  = document.getElementById("search").value.toLowerCase();
  const fp = document.getElementById("filter-plat").value;
  const fg = document.getElementById("filter-genre").value;

  let list = games.filter(g => {
    const matchQ = !q || g.title.toLowerCase().includes(q) || (g.dev && g.dev.toLowerCase().includes(q));
    const matchP = !fp || g.platform === fp;
    const matchG = !fg || g.genre === fg;
    return matchQ && matchP && matchG;
  });

  if (sortKey) {
    list.sort((a, b) => {
      let av = a[sortKey] ?? "";
      let bv = b[sortKey] ?? "";
      if (typeof av === "string") return av.localeCompare(bv) * sortDir;
      return (av - bv) * sortDir;
    });
  }

  document.getElementById("s-title").textContent = sortKey === "title" ? (sortDir === 1 ? "↑" : "↓") : "";
  document.getElementById("s-year").textContent  = sortKey === "year"  ? (sortDir === 1 ? "↑" : "↓") : "";

  const tbody = document.getElementById("tbody");

  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty">Nessun gioco trovato.</td></tr>`;
  } else {
    tbody.innerHTML = list.map(g => `
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