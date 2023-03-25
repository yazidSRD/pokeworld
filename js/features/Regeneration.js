class Regeneration{

    constructor(item) {
        this.item = item;

        this.pokemon = null;
    }

    async execute() {
        this.pokemon = null;
        if (!this.iCan()) return false;

        await this.settings();
        return await this.use();
    }

    async settings() {
        this.pokemon = null;
        if (!this.iCan()) return false;

        var request = {};
        request.uiPokemon_inInfoBase = ["use"];
        request.uiPokemons_close = "close";
        request.uiPokemons_test = this.testPokemon;
        var ui = new UiPokemons(request);

        userInterface.divInterface.appendChild(ui.createDiv());
        
        var response = await ui.response;
        
        ui.destructor();

        switch (Object.keys(response)[0]) {
            case "uiPokemon_inInfoBase":
                this.pokemon = response.uiPokemon_inInfoBase[1];
                return true;
            case "uiPokemons_close":
            default:
                return false;
        }

        return false;
    }

    iCan() {
        for (let i = 0; i < this.item.owner.pokemons.pokemons.length; i++) {
            const pokemon = new Pokemon(this.item.owner.pokemons.pokemons[i]);
            if (pokemon.life != 0 && pokemon.life < pokemon.getLife) {
                return true;
            }
        }
        return false;
    }

    testPokemon(pokemon) {
        if (pokemon.life != 0 && pokemon.life < pokemon.getLife) return true;
        return false;
    }

    use() {
        if (this.pokemon)
        if (!this.testPokemon(this.pokemon)) return false;
        this.pokemon.reload();
        this.pokemon.editLife(this.item.features.Regeneration.points)
        this.pokemon = null;
        return true;
    }
}