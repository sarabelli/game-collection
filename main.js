const CHIAVE_STORAGE="game-collection-items";

const modulo=document.querySelector("#game-form");
const listaGiochi=document.querySelector("#game-list");
const conteggioGiochi=document.querySelector("#game-count");
const filtroPiattaforma=document.querySelector("#filter-platform");
const filtroGenere=document.querySelector("#filter-genre");
const ordinamento=document.querySelector("#sort-by");
const ricercaInput=document.querySelector("#search");
const bottoneResetFiltri=document.querySelector("#reset-filters");

let giochi=caricaGiochi();
let filtri={
  ricerca:"",
  piattaforma:"",
  genere:"",
  ordine:"title-asc"
};

function caricaGiochi(){
  const giochiSalvati=localStorage.getItem(CHIAVE_STORAGE);

  if(!giochiSalvati){
    return[];
  }

  try{
    const giochiParsi=JSON.parse(giochiSalvati);
    return Array.isArray(giochiParsi)?giochiParsi:[];
  }catch(error){
    return[];
  }
}

function salvaGiochi(){
  localStorage.setItem(CHIAVE_STORAGE,JSON.stringify(giochi));
}

function rimuoviGioco(idGioco){
  giochi=giochi.filter((gioco)=>gioco.id!==idGioco);
  salvaGiochi();
  renderGiochi();
}

function creaGioco(dati){
  return{
    id:crypto.randomUUID(),
    titolo:dati.title.trim(),
    piattaforma:dati.platform,
    genere:dati.genre.trim(),
    anno:dati.year.trim(),
    studio:dati.studio.trim()
  };
}

function valoriUnici(chiave){
  return[...new Set(giochi.map((gioco)=>gioco[chiave]).filter(Boolean))].sort();
}

function aggiornaOpzioniFiltri(){
  const piattaforme=valoriUnici("piattaforma");
  const generi=valoriUnici("genere");

  filtroPiattaforma.innerHTML='<option value="">Tutte le piattaforme</option>';
  filtroGenere.innerHTML='<option value="">Tutti i generi</option>';

  piattaforme.forEach((piattaforma)=>{
    filtroPiattaforma.innerHTML+=`<option value="${piattaforma}">${piattaforma}</option>`;
  });

  generi.forEach((genere)=>{
    filtroGenere.innerHTML+=`<option value="${genere}">${genere}</option>`;
  });

  filtroPiattaforma.value=filtri.piattaforma;
  filtroGenere.value=filtri.genere;
}

function giochiVisibili(){
  const filtrati=giochi.filter((gioco)=>{
    const valoreRicerca=filtri.ricerca.toLowerCase();

    const matchPiattaforma=!filtri.piattaforma||gioco.platform===filtri.piattaforma;
    const matchGenere=!filtri.genere||gioco.genre===filtri.genere;

    const matchRicerca=
      !valoreRicerca||
      gioco.titolo.toLowerCase().includes(valoreRicerca)||
      gioco.studio.toLowerCase().includes(valoreRicerca);

    return matchPiattaforma&&matchGenere&&matchRicerca;
  });

  return filtrati.sort((a,b)=>{
    if(filtri.ordine==="title-desc"){
      return b.titolo.localeCompare(a.titolo);
    }

    if(filtri.ordine==="year-asc"){
      return Number(a.anno||0)-Number(b.anno||0);
    }

    if(filtri.ordine==="year-desc"){
      return Number(b.anno||0)-Number(a.anno||0);
    }

    return a.titolo.localeCompare(b.titolo);
  });
}

function renderGiochi(){
  const giochiVisibiliLista=giochiVisibili();
  listaGiochi.innerHTML="";
  aggiornaOpzioniFiltri();

  if(giochiVisibiliLista.length===0){
    listaGiochi.innerHTML=
      giochi.length===0
        ?"<p>Nessun gioco salvato.</p>"
        :"<p>Nessun risultato con i filtri attivi.</p>";

    conteggioGiochi.textContent="0 giochi";
    return;
  }

  giochiVisibiliLista.forEach((gioco)=>{
    const card=document.createElement("article");
    card.className="game-card";

    card.innerHTML=`
      <h3>${gioco.titolo}</h3>
      <p>Piattaforma: ${gioco.platform}</p>
      <p>Genere: ${gioco.genere||"-"}</p>
      <p>Anno: ${gioco.anno||"-"}</p>
      <p>Studio: ${gioco.studio||"-"}</p>
      <button type="button" data-id="${gioco.id}">Rimuovi</button>
    `;

    listaGiochi.appendChild(card);
  });

  conteggioGiochi.textContent=`${giochiVisibiliLista.length} giochi`;
}

modulo.addEventListener("submit",(evento)=>{
  evento.preventDefault();

  const datiForm=new FormData(modulo);

  const nuovoGioco=creaGioco({
    title:datiForm.get("title")||"",
    platform:datiForm.get("platform")||"",
    genre:datiForm.get("genre")||"",
    year:datiForm.get("year")||"",
    studio:datiForm.get("studio")||""
  });

  giochi.unshift(nuovoGioco);
  salvaGiochi();
  renderGiochi();
  modulo.reset();
});

listaGiochi.addEventListener("click",(evento)=>{
  const bottone=evento.target.closest("button[data-id]");

  if(!bottone)return;

  rimuoviGioco(bottone.dataset.id);
});

filtroPiattaforma.addEventListener("change",()=>{
  filtri.piattaforma=filtroPiattaforma.value;
  renderGiochi();
});

filtroGenere.addEventListener("change",()=>{
  filtri.genere=filtroGenere.value;
  renderGiochi();
});

ordinamento.addEventListener("change",()=>{
  filtri.ordine=ordinamento.value;
  renderGiochi();
});

ricercaInput.addEventListener("input",()=>{
  filtri.ricerca=ricercaInput.value.trim();
  renderGiochi();
});

bottoneResetFiltri.addEventListener("click",()=>{
  filtri={
    ricerca:"",
    piattaforma:"",
    genere:"",
    ordine:"title-asc"
  };

  ricercaInput.value="";
  filtroPiattaforma.value="";
  filtroGenere.value="";
  ordinamento.value="title-asc";

  renderGiochi();
});

renderGiochi();