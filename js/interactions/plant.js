class Plant{
    async interact(x, y, stage, character) {
        var structure = structures.getComposition(x, y, stage);
        if (weather.time - structure.Plant.lastHarvest >= structure.Plant.growingTime) {
            if (character.giveItem(new itemGenerator(structure.Plant.item))) {
                structure.Plant.lastHarvest = weather.time;
                msgAlert(`Vous venez de récolter un(e) ${dataItems[structure.Plant.item].name}.`);
            }
        }
    }
}