class interactionPersonalized {

    constructor(character, settings, interactor) {
        this.character = character;
        this.settings = settings;
    }

    async execute() {
        await eval(this.settings.code)();
        userInterface.close();
    }
}