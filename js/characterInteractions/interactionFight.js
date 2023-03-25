class interactionFight{

    constructor(character, settings, interactor) {
        this.character = character;
        this.settings = settings;
        this.interactor = interactor;
    }

    async execute() {
        if (weather.time-this.settings.lastFight<=1200) {
            userInterface.open(UiChat);
            userInterface.divInterface.appendChild(userInterface.ui.createDiv("Reviens demain si tu veux faire un combat.", this.character.name));
            await userInterface.ui.response;
            userInterface.close();
            return;
        }

        for (const key in this.character.pokemons.pokemons) {
            var pokemon = this.character.getPokemon(key);
            pokemon.editLife(pokemon.getLife);
            var attacks = pokemon.getAttacks
            for (const i in attacks) {
                attacks[i].addPp(attacks[i].ppMax);
            }
        }

        userInterface.open(UiChat);
        for (const message of this.settings.messages[0]) {
            userInterface.divInterface.appendChild(userInterface.ui.createDiv(message, this.character.name));
            await userInterface.ui.response;
        }
        userInterface.close();

        fight.start([this.interactor], [this.character], null, this.settings.type);

        var rep = await fight.response;

        if (rep === true) {
            this.settings.lastFight = weather.time;
            userInterface.requestUi(UiChat);
            for (const message of this.settings.messages[1]) {
                userInterface.divInterface.appendChild(userInterface.ui.createDiv(message, this.character.name));
                await userInterface.ui.response;
            }
            userInterface.close();
        } else if (rep === false) {
            userInterface.requestUi(UiChat);
            for (const message of this.settings.messages[2]) {
                userInterface.divInterface.appendChild(userInterface.ui.createDiv(message, this.character.name));
                await userInterface.ui.response;
            }
            userInterface.close();
        }
    }
}