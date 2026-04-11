let tiempoRecarga = 4000, retraso_rival = Math.floor(Math.random() * 3)*1000, esperaAtaqueRival = 600; //ms
let hp_MyPokemon = 0, hp_MyPokemon_actual = 0, hp_rival = 0, hp_rival_actual = 0;
let did_use_SpecialAttack = false;
let stop_game = false;
let stat_attack_PokemonRival = 0;
const btn_modal = document.querySelector("#modal_result");
const modal_title = document.querySelector("#title_result");
const btn_specialAttack = document.querySelector("#specialAttack");
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

function mensajes_registro(text, type){
    const mensaje_span = document.querySelector("#mensajes_registro");
    mensaje_span.style.display = "";
    mensaje_span.className = type;
    mensaje_span.innerText = text;
}

function agregar_registro(text, type){
    const registro = document.querySelector("#registro");
    const nuevo_span = document.createElement("span");
    nuevo_span.className = type;
    nuevo_span.innerText = text;
    registro.appendChild(nuevo_span);
}

function Recarga(contador, cargas_div){
    if(stop_game) return;

    setTimeout(() => {
        contador += 1000;
        cargas_div.forEach(div => {
            div.style.width = (contador/tiempoRecarga*100) + "%";
        });

        if(contador>=tiempoRecarga){
            cargas_div.forEach(div => {
                div.style.opacity = "0";
                div.style.transition = "none";
                div.parentNode.disabled = false;
            });
        }else{
            setTimeout(Recarga(contador,cargas_div), 1000);
        }
    }, 1000);
}

function Atacar(){
    if(stop_game) return;

    const pts_ataque = Math.floor ( 60 * 0.3 ) + Math.floor ( Math.random () * 60 * 0.4 );
    hp_rival_actual -= pts_ataque;

    mensajes_registro("Daño ocasionado al rival de "+pts_ataque+" hp","success");
    agregar_registro("Daño ocasionado al rival de "+pts_ataque+" hp","success");

    if(hp_rival_actual<=0){
        mensajes_registro("Ganaste la batalla :)","success");
        agregar_registro("Ganaste la batalla :)","success");
        stop_game = true;
        btn_modal.style.display = "";
        modal_title.innerText = "Ganaste la batalla !!";
        modal_title.className = "success";
        
        document.querySelector("#value_HP_Rival").innerText = `0/${hp_rival}`;
        document.querySelector("#bar_HP_Rival").style.width = `0%`;
    }else{
        document.querySelector("#value_HP_Rival").innerText = `${hp_rival_actual}/${hp_rival}`;
        document.querySelector("#bar_HP_Rival").style.width = `${hp_rival_actual / hp_rival * 100}%`;
    }
}

function AtaqueRival(){
    if(stop_game) return;

    setTimeout(() => {
        retraso_rival = Math.floor(Math.random() * 3)*1000;
        const celdaAtaque = Math.floor(Math.random() * 3);
        const celdas = document.querySelectorAll(".celda");
        const bar_HP_MyPokemon = document.querySelector("#bar_HP_MyPokemon");

        // Se limpian las celdas
        celdas.forEach(celda => {
            celda.classList.remove('rival_attack_celda');
        });

        // Se señala el ataque
        celdas[celdaAtaque].classList.add('rival_attack_celda');

        mensajes_registro("Esquiva el ataque del rival","warning");

        // Se realiza el ataque
        setTimeout(() => {
            celdas[celdaAtaque].classList.remove('rival_attack_celda');
            let pts_ataque = Math.floor ( stat_attack_PokemonRival * 0.4 ) + Math.floor ( Math.random () * 20 );

            if(pts_ataque<0){
                pts_ataque=0;
            }

            if(hp_MyPokemon_actual-pts_ataque>0){
                if(celdas[celdaAtaque].className.includes("active")){
                    hp_MyPokemon_actual -= pts_ataque;
                    bar_HP_MyPokemon.style.width = (hp_MyPokemon_actual/hp_MyPokemon*100) + "%";
                    document.querySelector("#value_HP_MyPokemon").innerText = `${hp_MyPokemon_actual}/${hp_MyPokemon}`;
                    
                    mensajes_registro("Daño ocasionado de "+pts_ataque+" hp","danger");
                    agregar_registro("Daño ocasionado de "+pts_ataque+" hp","danger");
                }else{
                    mensajes_registro("Ataque del rival esquivado","success");
                    agregar_registro("Ataque del rival esquivado","success");
                }
                AtaqueRival();
            }else{
                mensajes_registro("Pediste la batalla :(","danger");
                agregar_registro("Pediste la batalla :(","danger");
                stop_game = true;
                btn_modal.style.display = "";
                modal_title.innerText = "Perdiste la batalla !!";
                modal_title.className = "danger";

                document.querySelector("#value_HP_MyPokemon").innerText = `0/${hp_MyPokemon}`;
                bar_HP_MyPokemon.style.width = `0%`;
            }

        }, esperaAtaqueRival);
    }, retraso_rival);
}

async function CargarMyPokemon(){
    const data = localStorage.getItem("MyPokemon");

    if (!data) {
        console.error("No se encontró el Pokémon en localStorage");
        return;
    }

    const pokemon = JSON.parse(data);

    const types = pokemon.types;

    // Tipos
    const tipos_my = document.querySelector("#types_MyPokemon");
    tipos_my.innerHTML = "";
    types.forEach(type => {
        const span = document.createElement("span");
        span.innerText = type.type.name;
        span.style.backgroundColor = colores_tipos_pokemones[type.type.name].background;
        span.style.color = colores_tipos_pokemones[type.type.name].text_color;
        tipos_my.appendChild(span);
    });

    // Ataques
    const moves = pokemon.moves.splice(0, 4);
    let num_ataque = 1;

    moves.forEach(move => {
        const btn_attact = document.querySelector("#attack" + num_ataque).parentNode;

        document.querySelector("#attack" + num_ataque).innerText = move.move.name.toUpperCase();
        num_ataque++;

        btn_attact.addEventListener("click", function () {
            Atacar();

            let contador = 1000;
            const cargas_div = document.querySelectorAll(".carga");

            cargas_div.forEach(div => {
                div.parentNode.disabled = true;
                div.style.width = "0%";
                div.style.opacity = "0.1";
                div.style.transition = "all ease-in .5s";
            });

            Recarga(contador, cargas_div);
        });
    });

    // Nombre
    document.querySelector("#name_MyPokemon").innerText = pokemon.name.toUpperCase();

    // HP (formato XX/XX)
    const hp = pokemon.stats[0].base_stat;
    document.querySelector("#value_HP_MyPokemon").innerText = `${hp}/${hp}`;

    // Barra HP
    document.querySelector("#bar_HP_MyPokemon").style.width = `${hp / hp * 100}%`;
    hp_MyPokemon = hp;
    hp_MyPokemon_actual = hp;

    // Imagen
    document.querySelector("#MyPokemon_img").src = pokemon.sprites.front_default;
    document.querySelector("#MyPokemon_img_moves").src = pokemon.sprites.back_default;
}

async function CargarPokemonRival(){
    const data = localStorage.getItem("RivalPokemon");

    if (!data) {
        console.error("No se encontró el Pokémon en localStorage");
        return;
    }

    const pokemon = JSON.parse(data);
    const types = pokemon.types;

    // Contenedor
    const pokemon_descrip = document.querySelector("#types_pokemonRival").parentNode.parentNode;
    pokemon_descrip.style.borderTop = "5px solid " + colores_tipos_pokemones[types[0].type.name].background;

    // Tipos
    const tipos_rival = document.querySelector("#types_pokemonRival");
    tipos_rival.innerHTML = "";
    types.forEach(type => {
        const span = document.createElement("span");
        span.innerText = type.type.name;
        span.style.backgroundColor = colores_tipos_pokemones[type.type.name].background;
        span.style.color = colores_tipos_pokemones[type.type.name].text_color;
        tipos_rival.appendChild(span);
    });

    // Nombre
    document.querySelector("#name_pokemonRival").innerText = pokemon.name.toUpperCase();

    // HP (formato XX/XX)
    const hp = pokemon.stats[0].base_stat;
    document.querySelector("#value_HP_Rival").innerText = `${hp}/${hp}`;

    // Barra HP
    document.querySelector("#bar_HP_Rival").style.width = `${hp / hp * 100}%`;
    document.querySelector("#bar_HP_Rival").style.backgroundColor = colores_tipos_pokemones[types[0].type.name].background;
    hp_rival = hp;
    hp_rival_actual = hp;
    stat_attack_PokemonRival = pokemon.stats[1].base_stat;

    // Imagen
    document.querySelector("#pokemon_rival_img").src = pokemon.sprites.front_default;
}

function reboot(){
    did_use_SpecialAttack = false;
    stop_game = false;

    document.querySelectorAll(".carga").forEach(div => {
        div.style.opacity = "0";
        div.parentNode.disabled = false;
    });

    // Limpiar los listener que tienen los botones de ataques
    document.querySelectorAll(".attack").forEach(btn => {
        const clone = btn.cloneNode(true);
        btn.parentNode.replaceChild(clone, btn);
    });

    document.querySelector("#registro").innerHTML = "";
    document.querySelector("#mensajes_registro").style.display = "none";

    CargarMyPokemon();
    CargarPokemonRival();

    setTimeout(() => {
        AtaqueRival();
    }, 2000);

    btn_modal.style.display = "none";
}

document.addEventListener("DOMContentLoaded", () => {
    CargarMyPokemon();
    CargarPokemonRival();

    setTimeout(() => {
        AtaqueRival();
    }, 1000); // 1seg inicial en donde el rival espera
    
});

document.addEventListener("keyup", (e) => {
    const celdas = document.querySelectorAll(".celda, .celda.active");
    const todasLasCeldas = document.querySelectorAll(".celdas > div");
    const img = document.querySelector("#MyPokemon_img_moves");
    const key = e.key;

    if (key !== "ArrowLeft" && key !== "ArrowRight") return;

    // Encontrar la celda activa actual
    const celdaActiva = document.querySelector(".celda.active");
    const indexActual = Array.from(todasLasCeldas).indexOf(celdaActiva);

    let nuevoIndex;
    if (key === "ArrowLeft") nuevoIndex = indexActual - 1;
    if (key === "ArrowRight") nuevoIndex = indexActual + 1; 

    // Verificar que no se salga de los límites
    if (nuevoIndex < 0 || nuevoIndex >= todasLasCeldas.length) return;

    // Mover clase active y la imagen
    celdaActiva.classList.remove("active");
    celdaActiva.innerHTML = "";

    todasLasCeldas[nuevoIndex].classList.add("active");
    todasLasCeldas[nuevoIndex].appendChild(img);
});

btn_specialAttack.addEventListener("click", () =>{
    if(stop_game) return;

    this.disabled = true;

    const pts_ataque = hp_rival_actual;
    hp_rival_actual -= pts_ataque;

    mensajes_registro("Ataque especial "+pts_ataque+" hp","success");
    agregar_registro("Ataque especial "+pts_ataque+" hp","success");

    if(hp_rival_actual<=0){
        mensajes_registro("Ganaste la batalla :)","success");
        agregar_registro("Ganaste la batalla :)","success");
        stop_game = true;
        btn_modal.style.display = "";
        modal_title.innerText = "Ganaste la batalla !!";
        modal_title.className = "success";
        
        document.querySelector("#value_HP_Rival").innerText = `0/${hp_rival}`;
        document.querySelector("#bar_HP_Rival").style.width = `0%`;
    }else{
        document.querySelector("#value_HP_Rival").innerText = `${hp_rival_actual}/${hp_rival}`;
        document.querySelector("#bar_HP_Rival").style.width = `${hp_rival_actual / hp_rival * 100}%`;
    }

});