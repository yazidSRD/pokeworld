class Charge{

    constructor(attack) {
        this.attack = attack;
    }

    async execute(targets) {
        var chat = new UiChat();

        userInterface.divInterface.appendChild(chat.createDiv(`${this.attack.pokemon.nickname} utilise Charge!`));

        await chat.response;
        chat.destructor();
                
        const audio = new Audio('sounds/attacks/Charge.mp3');
        audio.play();

        await new Animation001().start(this.attack.pokemon, targets);

        var damage = this.attack.damageCalculator(targets[0]);
        targets[0].editLife(-damage);
    }
}