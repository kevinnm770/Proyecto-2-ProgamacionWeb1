async function fetchPokemon(pokemon_name, rol) {
    const cached = localStorage.getItem(pokemon_name);
    if (cached) return JSON.parse(cached);

    const response = await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemon_name);
    if (!response.ok) throw new Error('No encontrado');

    const pokemon = await response.json();
    localStorage.setItem(rol, JSON.stringify(pokemon));
    return pokemon;
}