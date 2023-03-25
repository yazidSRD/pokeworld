class RandomItem{
    async interact(x, y, stage, character) {
        var structure = structures.getComposition(x, y, stage);
        var item = Math.floor(Math.random() * dataItems.length);
        if (character.giveItem(new itemGenerator(item))) {
            structures.deleteStructureInstances(x, y, stage);
            const audio = new Audio('sounds/jingles/Found Item.mp3');
            audio.play();
            msgAlert(`Vous venez de ramasser un(e) ${dataItems[item].name}.`);
        }
    }
}