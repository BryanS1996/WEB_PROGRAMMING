const input = document.getElementById("pokemonInput");
const btn = document.getElementById("buscarBtn");

const name1 = document.getElementById("pokemonName");
const desc1 = document.getElementById("pokemonDesc");
const img1 = document.getElementById("pokemonImg");

const abilitiesEl = document.getElementById("pokemonAbilities");
const habitatEl = document.getElementById("pokemonHabitat");

btn.addEventListener("click", async () => {
  const nombre = input.value.trim().toLowerCase();
  if (!nombre) return alert("Escribe un nombre de Pokémon");

  try {
    // 1️⃣ Pide datos al backend (descripción)
    const res = await fetch(`/api/pokemon/${nombre}`);
    const data = await res.json();

    if (data.error) {
      alert(data.error);
      return;
    }

    name1.textContent = data.nombre;
    desc1.textContent = data.descripcion;

    // 2️⃣ Pide datos directos de la PokeAPI
    const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombre}`);
    const pokeData = await pokeRes.json();

    // Imagen y habilidades
    img1.src = pokeData.sprites.other["official-artwork"].front_default || pokeData.sprites.front_default;
    const abilities = pokeData.abilities.map(a => a.ability.name).join(", ");
    abilitiesEl.textContent = abilities;

    // 3️⃣ Datos de hábitat desde species
    const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nombre}`);
    const speciesData = await speciesRes.json();
    habitatEl.textContent = speciesData.habitat ? speciesData.habitat.name : "Desconocido";

  } catch (err) {
    console.error(err);
    alert("Error al buscar el Pokémon");
  }
});
