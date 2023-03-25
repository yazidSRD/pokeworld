class UiGame{
    
    #divUiGame;

    constructor() {
        this.#createElements();
        this.refresh();
    }

    #createElements() {
        this.#divUiGame = document.createElement("div");

        var divBasicBottons = document.createElement("div");
        divBasicBottons.setAttribute("id", "iuGame-BasicBottons");

        var divBotton = document.createElement("div");
        divBotton.style.backgroundImage = `url(textures/ui/uiGame/inventory.png)`;
        divBotton.setAttribute("onClick", "userInterface.requestUi(UiInventory);");
        divBasicBottons.appendChild(divBotton);

        // var divBotton = document.createElement("div");
        // divBotton.style.backgroundImage = `url(textures/ui/uiGame/pokedex.png)`;
        // divBasicBottons.appendChild(divBotton);

        // var divBotton = document.createElement("div");
        // divBotton.style.backgroundImage = `url(textures/ui/uiGame/badge.png)`;
        // divBasicBottons.appendChild(divBotton);

        this.#divUiGame.appendChild(divBasicBottons);
        userInterface.divInterface.appendChild(this.#divUiGame);
    }

    refresh() {
        try {
            document.getElementById(`iuGame-pokemons`).remove();
        } catch {}
        
        var divPokemons = document.createElement("div");
        divPokemons.setAttribute("id", "iuGame-pokemons");

        for (let index = 0; index < player.pokemons.pokemons.length; index++) {
            const pokemon = player.getPokemon(index);
            var divPokemon = document.createElement("div");
            divPokemon.setAttribute("onClick", `userInterface.ui.openUipokemon(${index});`);
            
            let imgPokemon = document.createElement("div");
            
            pokemon.getIcon().then((url) => {
                imgPokemon.style.backgroundImage = `url(${url})`;
            });
            divPokemon.appendChild(imgPokemon);
            
            var divHpBar = document.createElement("div");
            divHpBar.innerHTML = `<div style="width: ${(pokemon.life/pokemon.getLife)*40}px;"></div>`;
            divPokemon.appendChild(divHpBar);

            divPokemons.appendChild(divPokemon);
        }
        
        this.#divUiGame.appendChild(divPokemons);
    }

    async openUipokemon(i) {
        userInterface.requestUi(UiPokemons);
        try {
            userInterface.ui.moreInfo(i);
        } catch {}
    }
}