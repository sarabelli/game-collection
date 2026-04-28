const CHIAVE_STORAGE="game-collection-items";

const modulo=document.querySelector("#game-form");
const lista=document.querySelector("#game-list");
const conteggio=document.querySelector("#game-count");

const filtroPiattaforma=document.querySelector("#filter-platform");
const filtroGenere=document.querySelector("#filter-genre");
const ordine=document.querySelector("#sort-by");
const ricerca=document.querySelector("#search");
const reset=document.querySelector("#reset-filters");

let giochi=JSON.parse(localStorage.getItem(CHIAVE_STORAGE))||[];

let filtri={
  ricerca:"",
  piattaforma:"",
  genere:"",
  ordine:"title-asc"
};

function salva(){
  localStorage.setItem(CHIAVE_STORAGE,JSON.stringify(giochi));
}

function crea(d){
  return{
    id:crypto.randomUUID(),
    titolo:d.title,
    piattaforma:d.platform,
    genere:d.genre,
    anno:d.year,
    studio:d.studio
  };
}

function filtrati(){
  return giochi
    .filter(g=>{
      const r=filtri.ricerca.toLowerCase();

      return(
        (!filtri.piattaforma||g.piattaforma===filtri.piattaforma)&&
        (!filtri.genere||g.genere===filtri.genere)&&
        (!r||g.titolo.toLowerCase().includes(r))
      );
    })
    .sort((a,b)=>{
      if(filtri.ordine==="title-desc") return b.titolo.localeCompare(a.titolo);
      if(filtri.ordine==="year-asc") return (a.anno||0)-(b.anno||0);
      if(filtri.ordine==="year-desc") return (b.anno||0)-(a.anno||0);
      return a.titolo.localeCompare(b.titolo);
    });
}

function render(){
  const list=filtrati();

  lista.innerHTML=list.length
    ?list.map(g=>`
      <article class="game-card">
        <h3>${g.titolo}</h3>
        <p>${g.piattaforma}</p>
        <button data-id="${g.id}">Rimuovi</button>
      </article>
    `).join("")
    :"<p>Nessun gioco</p>";

  conteggio.textContent=`${list.length} giochi`;
}

modulo.addEventListener("submit",(e)=>{
  e.preventDefault();

  const d=new FormData(modulo);

  giochi.unshift(crea({
    title:d.get("title"),
    platform:d.get("platform"),
    genre:d.get("genre"),
    year:d.get("year"),
    studio:d.get("studio")
  }));

  salva();
  render();
  modulo.reset();
});

lista.addEventListener("click",(e)=>{
  const id=e.target.dataset.id;
  if(!id)return;

  giochi=giochi.filter(g=>g.id!==id);
  salva();
  render();
});

filtroPiattaforma.onchange=e=>{
  filtri.piattaforma=e.target.value;
  render();
};

filtroGenere.onchange=e=>{
  filtri.genere=e.target.value;
  render();
};

ordine.onchange=e=>{
  filtri.ordine=e.target.value;
  render();
};

ricerca.oninput=e=>{
  filtri.ricerca=e.target.value;
  render();
};

reset.onclick=()=>{
  filtri={ricerca:"",piattaforma:"",genere:"",ordine:"title-asc"};
  modulo.reset();
  render();
};

render();