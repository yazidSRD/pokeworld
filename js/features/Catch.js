class Catch{

    constructor(item) { //arguments
        this.item = item;
    }

    async execute() {
        if (!this.iCan()) return false;

        await this.settings();
        return await this.use();
    }

    async settings() {
        return true;
    }

    iCan() {
        if (this.item.owner.etat != "fight") return false
        if (this.item.owner.pokemons.max <= this.item.owner.pokemons.pokemons.length) return false
        if (fight.teams[1].pokemons.length > 1) return false
        if (fight.teams[1].characters[0].name != null) return false
        return true;
    }

    async use() {
        var a = (1-(2/3)*(fight.teams[1].pokemons[0].life/Math.floor(((fight.teams[1].pokemons[0].stats.hp.iv+(2*fight.teams[1].pokemons[0].getStatsBase.hp)+(fight.teams[1].pokemons[0].stats.hp.ev/4))*fight.teams[1].pokemons[0].lvl/100)+fight.teams[1].pokemons[0].lvl+10)))*listOfpokemons[fight.teams[1].pokemons[0].id].catchRate*1*1
        if (a < 255) {
            var b = Math.pow((65535*4*Math.sqrt(a/255)+1)/65535, 4)
            var x = Math.random()
            if (x > b) {
                var chat = new UiChat();
                userInterface.divInterface.appendChild(chat.createDiv(`c'était pas loin!`));
                await chat.response;
                chat.destructor();
                return;
            }
        }

        this.item.owner.givePokemon(structuredClone(fight.teams[1].pokemons[0].data));
        
        var chat = new UiChat();
        userInterface.divInterface.appendChild(chat.createDiv(`${fight.teams[1].pokemons[0].nickname} est attrapé!`));
        await chat.response;
        chat.destructor();
        
        fight.stop();
    }
}