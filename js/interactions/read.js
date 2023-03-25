class Read{
    async interact(x, y, stage) {
        var structure = structures.getComposition(x, y, stage);

        userInterface.open(UiChat);
        userInterface.divInterface.appendChild(userInterface.ui.createDiv(structure.Read.msg, structure.Read.author));

        await userInterface.ui.response;
        
        userInterface.close();
    }
}