document.addEventListener("DOMContentLoaded", async () => {
    // Get 'pokemon' query from url search params
    let query = document.location.search;
    const searchParams = new URLSearchParams(query);
    const pokemon = searchParams.get("pokemon");

    try {
        // Fetch data about pokemon. This pokemon comes from our url search params
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
        let data = await response.json();
        console.log(data);

        // Using the data:
        const sprites = data.sprites;
        displayImage(sprites); // Display an image on the browser
        const types = data.types;
        displayTypes(types); // Display the pokemon types on the browser
        const moves = data.moves;
        displayMoves(moves) // Display the pokemon moves on the browser

    } catch (err) {
        console.log(err);
    }
})

function displayImage(sprite) {
    // Use the image in the html and fill in the src attribute using the data
    const pokemonImage = document.getElementById("pokemon_img");
    pokemonImage.src = sprite.front_default;
}

function displayTypes(types) {
    // Use the pokemon_types container in the html
    const typesContainer = document.getElementById("pokemon_types");

    // Loop through all pokemon types
    for (let pokemonType of types) {
        const type = pokemonType.type.name;

        // Create paragraph element to store pokemon type text
        const pokemonTypeParagraph = document.createElement("p");
        const pokemon_type = capitalizeFirstLetter(type);

        pokemonTypeParagraph.innerText = pokemon_type; //Fill in the 'p' tag text with the pokemon type text
        typesContainer.appendChild(pokemonTypeParagraph); //Add created 'p' tag to pokemon_types container
    }
}

function displayMoves(moves) {
    // Use the pokemon_moves container in the html
    const pokemonMoves = document.getElementById("pokemon_moves");

    // Loop through each pokemon move within the data
    for (let pokemonMove of moves) {
        const moveName = pokemonMove.move.name;
        // Create paragraph element to store the pokemon move text
        const pokemonMoveParagraph = document.createElement("p");

        // Some pokemon types have a '-' when using two words.
        const splittedName = moveName.split("-"); // Split the pokemon type at the '-' into two words. This will come back as an array
        let pokemonMoveNames = []; // Make an array to store our transformed piece of text
        for (let name of splittedName) {
            const pokemon_move = capitalizeFirstLetter(name); // Convert each pokemon move into Titlecase format
            pokemonMoveNames.push(pokemon_move); //Add the tranformeed pokemon move name into the pokemon move names array
        }

        // Put the pokemon move name as the text for each pokemon move paragraph html element
        pokemonMoveParagraph.innerText = pokemonMoveNames.join(" ");
        pokemonMoves.appendChild(pokemonMoveParagraph); // Add the pokemon move paragraph html element into the pokemonMoves container that already exists on the html
    }
}

// This function capitalizes the first letter of a piece of text
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}