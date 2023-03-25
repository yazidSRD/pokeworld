class PokemonSwitch{

    constructor(attack) {
        this.attack = attack;
    }

    async execute(targets) {

        var chat = new UiChat();

        userInterface.divInterface.appendChild(chat.createDiv(`${this.attack.pokemon.nickname}, on change! Reviens!`));
        
        await chat.response;
        
        fight.PokemonSwitch(targets[0], this.attack.pokemon)

        userInterface.divInterface.appendChild(chat.createDiv(`${targets[0].nickname}, Go!`));
        await chat.response;
        
        chat.destructor();
    }
}