class PokeRegeneration{
    async interact(x, y, stage, character) {
        this.structure = structures.getComposition(x, y, stage);
        
        userInterface.open(uiPokeRegeneration);

        setTimeout(async () => {
            while (character.etat == 'inMenu') {
                await new Promise(r => setTimeout(r, 5));
            }
            character.etat = 'inMenu';
            this.running();
        }, 0);
    }
    
    async running() {
        while (true) {

            this.structure.PokeRegeneration.pokemons.forEach(pokemonInfo => {
                var pokemon = new Pokemon(pokemonInfo[0]);

                var hp = Math.floor((weather.time - pokemonInfo[1])/this.structure.PokeRegeneration.tickHp);
                var pp = Math.floor((weather.time - pokemonInfo[1])/this.structure.PokeRegeneration.tickPp);
                pokemonInfo[1] = weather.time;

                pokemon.editLife(hp);
                pokemon.getAttacks.forEach(attack => {
                    attack.addPp(pp);
                });

            });


            userInterface.ui.destructor();
            userInterface.divInterface.appendChild(userInterface.ui.createDiv(player.pokemons.pokemons, this.structure.PokeRegeneration));

            var response = await userInterface.ui.response;
            
            switch (Object.keys(response)[0]) {
                case "uiPokeRegeneration_pokemons":
                    switch (response.uiPokeRegeneration_pokemons[0]) {
                        case "moreInfo":
                            userInterface.ui.destructor();
                            
                            var request = {};
                            request.uiPokemon_close = true;

                            var uiPokemon = new UiPokemon(player.getPokemon(response.uiPokeRegeneration_pokemons[1]), request)
                            userInterface.divInterface.appendChild(uiPokemon.createDiv());

                            await uiPokemon.response;

                            break;
                        case "depose":
                            if (this.structure.PokeRegeneration.max <= this.structure.PokeRegeneration.pokemons.length) {
                                msgAlert(`Il y a plus de place.`);
                                break;
                            }
                            var pokemon = player.removePokemon(response.uiPokeRegeneration_pokemons[1]);
                            this.structure.PokeRegeneration.pokemons.push([pokemon, weather.time]);
                            break;
                    }
                    break;
                case "uiPokeRegeneration_pokemonsInMachine":
                    switch (response.uiPokeRegeneration_pokemonsInMachine[0]) {
                        case "moreInfo":
                            userInterface.ui.destructor();
                            
                            var request = {};
                            request.uiPokemon_close = true;

                            var uiPokemon = new UiPokemon(new Pokemon(this.structure.PokeRegeneration.pokemons[response.uiPokeRegeneration_pokemonsInMachine[1]][0]), request)
                            userInterface.divInterface.appendChild(uiPokemon.createDiv());

                            await uiPokemon.response;

                            break;
                        case "depose":
                            var pokemon = this.structure.PokeRegeneration.pokemons[response.uiPokeRegeneration_pokemonsInMachine[1]][0];
                            if (player.givePokemon(pokemon)) {
                                this.structure.PokeRegeneration.pokemons.splice(response.uiPokeRegeneration_pokemonsInMachine[1], 1);
                            } else {
                                msgAlert(`Il y a plus de place.`);
                            }
                            break;
                    }
                    break;
                case "uiPokeRegeneration_close":
                default:
                    userInterface.close();
                    return;
            }
        }
    }
}