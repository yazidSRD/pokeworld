class UseItem{

    constructor(attack) {
        this.attack = attack;
    }

    async execute(targets) {
        
        var chat = new UiChat();

        userInterface.divInterface.appendChild(chat.createDiv(`${this.attack.pokemon.trainer.name}, utilise ${this.attack.item.name}!`));
        
        await chat.response;
        chat.destructor();

        await this.attack.item.use();
        
        for (const i in this.attack.pokemon.trainer.inventory.items) {
            if (this.attack.item.data == this.attack.pokemon.trainer.inventory.items[i]) {
                this.attack.pokemon.trainer.removeItem(i);
                break;
            }
        }
    }
}