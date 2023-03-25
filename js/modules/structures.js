class Structures{

    allStructureInstances = [];
    allComposition = [];

    constructor() {
        this.divStructures = document.getElementById("structures");
        this.refreshes();
    }

    loadStructure(nStructure, x, y, stage, name, size, center, composition, inside) {
        if (this.getStructure(x, y, stage)) return;
        var structure = new Structure(nStructure, x, y, stage, name, size, center, composition, inside);
        this.allStructureInstances.push(structure);
    }

    creationStructure(nStructure, x, y, stage, name, size, center, composition, inside) {
        if (this.nStructure != 0 ) {
            var structure = structuredClone(saveStructures[nStructure]);
            name = structure.name;
            size = structure.size;
            center = structure.center;
            composition = structure.composition;
            inside = structure.inside;
        }
        if (composition) {
            for (const y in composition) {
                for (const x in composition[y]) {
                    if (!composition[y][x].features) continue;
                    if (composition[y][x].features.includes("Plant")) {
                        composition[y][x].Plant.lastHarvest = weather.time;
                    }
                }
            }
        }
        var structure = new Structure(nStructure, x, y, stage, name, size, center, composition, inside);
        this.allStructureInstances.push(structure);
    }

    removeComposition(x, y, stage) {
        if (!this.getComposition(x, y, stage)) return;
        this.allComposition[y][x].splice(stage, 1);
        var flag = true;
        for (const keyX in this.allComposition[y]) {
            for (const keyStage in this.allComposition[y][keyX]) {
                if (this.allComposition[y][keyX][keyStage][2] == keyStage) {
                    flag = false;
                }
            }
        }
        if (flag) this.allComposition[y] = undefined;
    }

    getDivStructures(x, y) {
        return document.getElementById(`structures${y}/${x}`);
    }

    deleteDivStructures(x, y) {
        var divStructures = document.getElementById(`structures${y}/${x}`);
        if (divStructures === null) return;
        divStructures.remove();
    }

    createDivStructures(x, y) {
        //var chunk = coordinateConverter(x, y).chunk;
        //console.log(chunk);
        //var divChunk = world.getChunk(chunk.x, chunk.y).divChunk;

        var divStructures = document.createElement("div");
        divStructures.setAttribute("id",`structures${y}/${x}`);
        divStructures.style.zIndex =  y;
        divStructures.style.position =  "absolute";
        this.divStructures.appendChild(divStructures);
        return divStructures;
    }

    getStructure(x, y, stage) {
        return this.allStructureInstances.find(instance => instance.x == x && instance.y == y && instance.stage == stage)
    }

    getStructures(x, y) {
        return this.allStructureInstances.filter(instance => instance.x == x && instance.y == y)
    }

    addComposition(x, y, stage, origineX, origineY, origineStage) {
        if (this.allComposition[y] === undefined) this.allComposition[y] = [];
        if (this.allComposition[y][x] === undefined) this.allComposition[y][x] = [];
        this.allComposition[y][x][stage] = [origineX, origineY, origineStage];
    }

    getComposition(x, y, stage) {
        if (this.allComposition[y] === undefined) return undefined;
        if (this.allComposition[y][x] === undefined) return undefined;
        if (this.allComposition[y][x][stage] === undefined) return undefined;
        var composition = this.allComposition[y][x][stage]
        var structure = this.getStructure(composition[0], composition[1], composition[2])
        return structure.composition[y-composition[1]+structure.center.y][x-composition[0]+structure.center.x];
    }

    getStructureByComposition(x, y, stage) {
        if (this.allComposition[y] === undefined) return undefined;
        if (this.allComposition[y][x] === undefined) return undefined;
        if (this.allComposition[y][x][stage] === undefined) return undefined;
        var composition = this.allComposition[y][x][stage]
        return this.getStructure(composition[0], composition[1], composition[2])
    }

    async getInteraction(x, y, stage, character) {
        var composition = this.getComposition(x, y, stage);
        if (!composition) return false;
        if (composition.interaction === false) return false;
        try {
            await eval(`new ${composition.interaction}()`).interact(x, y, stage, character);
            return true;
        } catch (error) {
            console.log(error);
            inProgress();
            return false;
        }
    }

    getFeatures(x, y, stage) {
        var structure = this.getComposition(x, y, stage);
        var features = {};
        if (structure === undefined) return features;
        structure.features.forEach(feature => {
            try {
                features[feature] = eval(`structures.info${feature}(${x}, ${y}, ${stage});`);
            } catch (error) {
            }
            
        });
        return features;
    }

    infoInvisibleWall(x, y, stage) {
        var info = {};
        return info;
    }

    infoEffect3D(x, y, stage) {
        var info = {};
        return info;
    }

    infoBridge(x, y, stage) {
        var info = {};
        return info;
    }

    infoStair(x, y, stage) {
        var info = {};
        return info;
    }

    infoRoof(x, y, stage) {
        var info = {};
        return info;
    }

    infoPlant(x, y, stage) {
        var info = this.getComposition(x, y, stage).Plant;
        return info;
    }
    
    infoEnterOrLeave(x, y, stage) {
        var info = this.getComposition(x, y, stage).EnterOrLeave;
        return info;
    }

    infoExit(x, y, stage) {
        var info = {};
        return info;
    }

    infoRandomFight(x, y, stage) {
        var info = {};
        return info;
    }

    infoPokeRegeneration(x, y, stage) {
        var info = this.getComposition(x, y, stage).PokeRegeneration;
        return info;
    }

    unloadingStructure(x, y, stage) {
        var structure = this.getStructure(x, y, stage)
        if (structure === undefined) return;
        structure.unloading();
        structure.save();
        var index = this.allStructureInstances.findIndex(instance => instance.x == x && instance.y == y && instance.stage == stage)
        if (index == -1) return;
        this.allStructureInstances.splice(index, 1)
    }

    deleteStructureInstances(x, y, stage) {
        var index = this.allStructureInstances.findIndex(instance => instance.x == x && instance.y == y && instance.stage == stage)
        this.allStructureInstances[index].unloading();
        if (index == -1) return;
        this.allStructureInstances.splice(index, 1)
    }

    unloadingAllStructure() {

        for (let i = this.allStructureInstances.length-1; i > -1; i--) {
            this.allStructureInstances[i].unloading();
            this.allStructureInstances[i].save();
            this.deleteStructureInstances(this.allStructureInstances[i].x, this.allStructureInstances[i].y, this.allStructureInstances[i].stage)
        }
    }

    loadTextures() {
        this.allStructureInstances.forEach(element => {
            element.loadTexture();
        });
    }

    refreshes() {
        setInterval(function(){
            if (fight.inProgress) return;
            structures.allStructureInstances.some(function(structure) {
                for (const y in structure.composition) {
                    for (const x in structure.composition[y]) {
                        var features = structures.getFeatures(structure.x+Number(x)-structure.center.x, structure.y+Number(y)-structure.center.y, structure.stage+structure.composition[y][x].stage);
                        if (features.Plant) {
                            if (weather.time - features.Plant.lastHarvest >= features.Plant.growingTime) {
                                structure.divObject.style.backgroundImage = `url(textures/objects/${structure.type}/1.png)`;
                            } else structure.divObject.style.backgroundImage = `url(textures/objects/${structure.type}/0.png)`;
                        }
                    }
                }
            });
            // structures.allComposition.some(function(compositions) {
            //     if (!compositions) return;
            //     compositions.some(function(composition) {
            //         if (!composition) return;
            //         console.log(composition);
            //     });
            // });
        }, 1000);
    }
}