class interactionEvents {

    constructor(character, settings, interactor) {
        this.character = character;
        this.settings = settings;
        this.interactor = interactor;
    }

    async execute() {
        if (this.interactor) {userInterface.close();return}
        eval(this.settings.code)();
    }
}