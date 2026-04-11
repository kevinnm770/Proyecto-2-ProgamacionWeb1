let battle_leave_MyPokemon = false, battle_leave_RivalPokemon = false;
let debounceTimer = null;
const btn_battle = document.querySelector("#btn_inicio");

const colores_tipos_pokemones = {
    "normal":   { "background": "#A8A878", "text_color": "#000000" },
    "fire":     { "background": "#F08030", "text_color": "#000000" },
    "water":    { "background": "#6890F0", "text_color": "#ffffff" },
    "electric": { "background": "#F8D030", "text_color": "#000000" },
    "grass":    { "background": "#78C850", "text_color": "#000000" },
    "ice":      { "background": "#98D8D8", "text_color": "#000000" },
    "fighting": { "background": "#C03028", "text_color": "#ffffff" },
    "poison":   { "background": "#A040A0", "text_color": "#ffffff" },
    "ground":   { "background": "#E0C068", "text_color": "#000000" },
    "flying":   { "background": "#A890F0", "text_color": "#000000" },
    "psychic":  { "background": "#F85888", "text_color": "#ffffff" },
    "bug":      { "background": "#A8B820", "text_color": "#000000" },
    "rock":     { "background": "#B8A038", "text_color": "#000000" },
    "ghost":    { "background": "#705898", "text_color": "#ffffff" },
    "dragon":   { "background": "#316AAC", "text_color": "#ffffff" },
    "dark":     { "background": "#705848", "text_color": "#ffffff" },
    "steel":    { "background": "#B8B8D0", "text_color": "#000000" },
    "fairy":    { "background": "#EE99AC", "text_color": "#000000" }
};

async function CargarMyPokemon(pokemon_name) {
    const namePokemon = document.querySelector("#namePokemon");
    const info = document.querySelector("#info_MyPokemon");
    const img = document.querySelector("#MyPokemon_img");
    const ul_stats = document.querySelector("#stats_myPokemon");
    const tipos_pokemon = document.querySelector("#tipos_pokemon");
    const ul_moves = document.querySelector("#moves_myPokemon");

    try {
        const pokemon = await fetchPokemon(pokemon_name, "MyPokemon");
        const types = pokemon.types;

        namePokemon.innerText = pokemon_name.toUpperCase();

        tipos_pokemon.innerHTML = "";
        types.forEach(type => {
            const span_type = document.createElement("span");
            tipos_pokemon.appendChild(span_type);
            span_type.innerText = type.type.name;
            span_type.style.backgroundColor = colores_tipos_pokemones[type.type.name].background;
            span_type.style.color = colores_tipos_pokemones[type.type.name].text_color;
        });
        tipos_pokemon.style.display = "";

        img.src = pokemon.sprites.front_default;

        ul_stats.innerHTML = "";
        pokemon.stats.forEach(stat => {
            const li_stat = document.createElement("li");
            ul_stats.appendChild(li_stat);
            li_stat.innerHTML = `
                <h6>${stat.stat.name.toUpperCase()}</h6> <span>${stat.base_stat}</span>
                <div class="barra_container"><div class="level_bar" style="background-color:${colores_tipos_pokemones[types[0].type.name].background};color:${colores_tipos_pokemones[types[0].type.name].text_color};width:${stat.base_stat/255*100}%;"></div></div>
            `;
        });

        const moves = pokemon.moves.slice(0, 4);
        ul_moves.innerHTML = "";
        moves.forEach(move => {
            const li_move = document.createElement("li");
            const h5_move = document.createElement("h5");
            ul_moves.appendChild(li_move);
            li_move.appendChild(h5_move);
            h5_move.innerText = move.move.name.toUpperCase();
        });

        const li_move = document.createElement("li");
        const h5_move = document.createElement("h5");
        li_move.id = "specialMove";
        ul_moves.appendChild(li_move);
        li_move.appendChild(h5_move);
        h5_move.innerText = TRAINER.definitiveMoveName;

        ul_moves.style.display = "";
        info.style.display = "";
        battle_leave_MyPokemon = true;
        btn_battle.disabled = false;
    } catch(e) {
        console.error(e);
        info.style.display = "none";
        battle_leave_MyPokemon = false;
        btn_battle.disabled = true;
    }
}

async function CargarPokemonRival(pokemon_name) {
    const info = document.querySelector("#info_pokemon");
    const img = document.querySelector("#pokemon_rival");
    const mensaje = document.querySelector("#mensaje");
    const espera = document.querySelector("#espera");
    const ul_stats = document.querySelector("#stats_rival");
    const tipos_pokemon_rival = document.querySelector("#tipos_pokemon_rival");
    const ul_moves = document.querySelector("#moves_rival");

    tipos_pokemon_rival.style.display = "none";
    mensaje.style.display = "none";
    espera.style.display = "";

    try {
        const pokemon = await fetchPokemon(pokemon_name, "RivalPokemon");
        const types = pokemon.types;

        tipos_pokemon_rival.innerHTML = "";
        types.forEach(type => {
            const span_type = document.createElement("span");
            tipos_pokemon_rival.appendChild(span_type);
            span_type.innerText = type.type.name;
            span_type.style.backgroundColor = colores_tipos_pokemones[type.type.name].background;
            span_type.style.color = colores_tipos_pokemones[type.type.name].text_color;
        });
        tipos_pokemon_rival.style.display = "";

        img.src = pokemon.sprites.front_default;

        ul_stats.innerHTML = "";
        pokemon.stats.forEach(stat => {
            const li_stat = document.createElement("li");
            ul_stats.appendChild(li_stat);
            li_stat.innerHTML = `
                <h6>${stat.stat.name.toUpperCase()}</h6> <span>${stat.base_stat}</span>
                <div class="barra_container"><div class="level_bar" style="background-color:${colores_tipos_pokemones[types[0].type.name].background};color:${colores_tipos_pokemones[types[0].type.name].text_color};width:${stat.base_stat/255*100}%;"></div></div>
            `;
        });

        const moves = pokemon.moves.slice(0, 4);
        ul_moves.innerHTML = "";
        moves.forEach(move => {
            const li_move = document.createElement("li");
            const h5_move = document.createElement("h5");
            ul_moves.appendChild(li_move);
            li_move.appendChild(h5_move);
            h5_move.innerText = move.move.name.toUpperCase();
        });

        ul_moves.style.display = "";
        info.style.display = "";
        btn_battle.disabled = false;
        battle_leave_RivalPokemon = true;
    } catch(e) {
        console.error(e);
        mensaje.childNodes[1].innerText = "Pokémon no encontrado";
        mensaje.style.display = "";
        info.style.display = "none";
        battle_leave_RivalPokemon = false;
        btn_battle.disabled = true;
    } finally {
        espera.style.display = "none";
    }
}

function IniciarBatalla(){
    if(battle_leave_MyPokemon && battle_leave_RivalPokemon){
        window.location.href='../stage-2/battle.html';
    }else{
        alert("Seleccione sus pokémons para la batalla");
        return;
    }
}

document.querySelector("#pokemon_name_rival").addEventListener("input", function() {
    clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(() => {
        CargarPokemonRival(this.value);
    }, 300);
});

document.addEventListener("DOMContentLoaded", () => {
    const nameTrainer = document.querySelector("#nameTrainer");
    const cityTrainer = document.querySelector("#cityTrainer");
    const PokemonNameTrainer = document.querySelector("#PokemonNameTrainer");
    const phrase_trainer = document.querySelector("#phrase_trainer");
    const name_MoveMain = document.querySelector("#name_MoveMain");

    nameTrainer.innerText=TRAINER.name;
    cityTrainer.innerHTML=`<span>DE</span> ${TRAINER.hometown}`;
    phrase_trainer.innerHTML=`<p>"${TRAINER.catchphrase}"</p>`;
    PokemonNameTrainer.innerHTML=`<span>POKÉMON</span> ${TRAINER.nickname}`;
    name_MoveMain.innerText=TRAINER.definitiveMoveName;

    CargarMyPokemon(TRAINER.favoritePokemon);
    if(localStorage.getItem("RivalPokemon")){
        CargarPokemonRival(localStorage.getItem("RivalPokemon").name);
    }
});