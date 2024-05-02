const pokemonContainer = document.getElementById("pokemonContainer");
let page = null;

document.addEventListener("DOMContentLoaded", async () => {
    const pageQuery = document.location.search;
    const searchParams = new URLSearchParams(pageQuery);
    let offset = null; // offset to use within the api url link
    let fetchIdx = null; // This is to help make sure the data fetched matches to the current page index
    let fetchURL = null; // This is the api url to use

    // See if a query of 'page' exists in the url
    if (searchParams.has("page")) {
        page = parseInt(searchParams.get("page"));
        fetchIdx = page - 1; // Page and fetchIdx are off by one
        offset = fetchIdx * 20;
    }

    if (!searchParams.has("page")) {
        page = 1;
        fetchURL = 'https://pokeapi.co/api/v2/pokemon'
    } else {
        fetchURL = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=20`
    }

    try {
        // Fetch data from API
        let response = await fetch(fetchURL);
        let data = await response.json();

        console.log(data);
        // Use data to display items onto the browser
        const pokemon_results = data.results;
        displayPokemon(pokemon_results);
        setupPagination(data);

    } catch (err) {
        console.log("err", err);
    }
});

/*
    This function displays the pokemon information onto the page
*/
async function displayPokemon(pokemon_results) {
    for (let pokemon of pokemon_results) {
        // Fetching each pokemon's data
        let pokemon_res = await fetch(pokemon.url);
        let pokemon_data = await pokemon_res.json();

        // Create HTML elements
        const pokemonCard = document.createElement("div");
        const pokemonImg = document.createElement("img");
        const pokemonName = document.createElement("p");
        const pokemonTypesContainer = document.createElement("div");

        pokemonCard.className = "pokemon_card";
        pokemonTypesContainer.className = "pokemon_types_container";

        // Populating image tag with pokemon image url from api data
        pokemonImg.src = pokemon_data.sprites.front_default;
        pokemonName.innerText = pokemon_data.name;

        // Creating span elements for each type within a pokemon's data
        for (let pokemonType of pokemon_data.types) {
            const pokemonTypeSpan = document.createElement("span");
            pokemonTypeSpan.innerText = pokemonType.type.name;
            pokemonTypeSpan.className = "pokemon_type";
            pokemonTypesContainer.appendChild(pokemonTypeSpan);
        }

        // Add elements to pokemon card
        pokemonCard.appendChild(pokemonImg);
        pokemonCard.appendChild(pokemonName);
        pokemonCard.appendChild(pokemonTypesContainer);

        // Using existing pokemon container. Adding JS created HTML elements to pokemonContainer
        // pokemonContainer already exists on the page
        pokemonContainer.appendChild(pokemonCard);
    }
}

// This function setups the pagination
function setupPagination(pokemon_data) {
    const { next, previous } = pokemon_data;

    // Gather HTML elements for pagination
    const paginationCollection = document.getElementsByClassName("pagination_item");
    const previousPaginationBtn = document.getElementsByClassName("pagination_item")[0];
    const previousPaginationIdx = document.getElementsByClassName("pagination_item")[1];
    const nextPaginationBtn = document.getElementsByClassName("pagination_item")[paginationCollection.length - 1];
    const nextPaginationIdx = document.getElementsByClassName("pagination_item")[paginationCollection.length - 2];
    const currentPaginationIndex = document.getElementById("pagination_current_idx");

    // If previous is falsey => undefined/null/""/false
    if (!previous) {
        previousPaginationBtn.style.display = "none";
        previousPaginationIdx.style.display = "none";
    }

    // If next is falsey => undefined/null/""/false
    if (!next) {
        nextPaginationBtn.style.display = "none";
        nextPaginationIdx.style.display = "none";
    }

    // Current Idx
    currentPaginationIndex.innerText = page;

    // If next is truthy
    if (next) {
        const nextPaginationIdx = document.getElementById("pagination_next_idx");
        const nextPaginationBtn = document.getElementById("pagination_next");

        // Use url search params on next url link
        const url = new URL(next);
        const query = url.search;
        const searchParams = new URLSearchParams(query);

        const offset = parseInt(searchParams.get("offset"));

        // Setup next index to display on page and within url
        let nextIdx = offset / 20 + 1;

        // Use nextIdx to populate text and url for next pagination items
        nextPaginationIdx.innerText = nextIdx;
        nextPaginationIdx.href = `/index.html?page=${nextIdx}`;
        nextPaginationBtn.href = `/index.html?page=${nextIdx}`;
    }

    if (previous) {
        const previousPaginationIdx = document.getElementById("pagination_previous_idx");
        const previousPaginationBtn = document.getElementById("pagination_previous");

        // Use url search params on previous url link
        const url = new URL(previous);
        const query = url.search;
        const searchParams = new URLSearchParams(query);

        const offset = parseInt(searchParams.get("offset"));

        // Setup previous index to display on page and within url
        let previousIdx = offset / 20 + 1;

        // Use previousIdx to populate text and url for previous pagination items
        previousPaginationIdx.innerText = previousIdx;
        previousPaginationIdx.href = `/index.html?page=${previousIdx}`;
        previousPaginationBtn.href = `/index.html?page=${previousIdx}`;
    }
}