class interactionDiscussions {

    constructor(character, settings, interactor) {
        this.character = character;
        this.settings = settings;
    }

    async execute() {

        userInterface.open(UiChat);
        for (const read of this.settings) {
            userInterface.divInterface.appendChild(userInterface.ui.createDiv(read, this.character.name));

            await userInterface.ui.response;
            
        }
        userInterface.close();
    }
}