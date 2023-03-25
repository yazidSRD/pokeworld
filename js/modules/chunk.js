class Chunk{

    allBlockInstances = [];
    allCharacterInstances = [];
    
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.loading();
    }

    get biome() {
        return world.world[this.y][this.x].biome;
    }

    getBlock(x, y) {
        return this.allBlockInstances.find(instance => instance.x == x && instance.y == y)
    }

    loadingBlock(x, y) {
        if (this.getBlock(x, y)) return;
        var block = new Block(x, y, this);
        this.allBlockInstances.push(block);
    }

    loadingAllBlock() {
        for (const y in world.world[this.y][this.x].world) {
            for (const x in world.world[this.y][this.x].world[y]) {
                this.loadingBlock(x, y);
            }
        }

        // for (var y = 0; y < 16; y++) {
        //     for (var x = 0; x < 16; x++) {
        //         console.log(x, y);
        //         this.loadingBlock(x, y);
        //     }
        // }
    }

    loadingAllStructures() {
        for (const y in world.world[this.y][this.x].world) {
            for (const x in world.world[this.y][this.x].world[y]) {
                var structuresInBlock = world.getStructuresInBlock((this.x*16)+Number(x), (this.y*16)+Number(y));
                if (structuresInBlock === undefined) continue;
                structuresInBlock.forEach(structure => {
                    if (structure[0] !== undefined)
                    structures.loadStructure(structure[0], (this.x*16)+Number(x), (this.y*16)+Number(y), structure[1], structure[2], structure[3], structure[4], structure[5], structure[6]);
                });
            }
        }
        // for (let y = 0; y < 16; y++) {
        //     for (let x = 0; x < 16; x++) {
        //         var structuresInBlock = world.getStructuresInBlock((this.x*16)+x, (this.y*16)+y);
        //         if (structuresInBlock.length == 0) continue;
        //         structuresInBlock.forEach(structure => {
        //             if (structure[0] !== undefined)
        //             structures.loadStructure(structure[0], structure[1], structure[2], structure[3], structure[4], structure[5], structure[6], structure[7], structure[8]);
        //         });
        //     }
        // }
    }

    unloadingAllStructures() {
        for (let y = 0; y < 16; y++) {
            for (let x = 0; x < 16; x++) {
                var structureInstances = structures.getStructures((this.x*16)+x, (this.y*16)+y)
                if (structureInstances.length == 0) continue;
                structureInstances.forEach(structure => {
                    structures.unloadingStructure(structure.x, structure.y, structure.stage)
                });
                structures.deleteDivStructures((this.x*16)+x, (this.y*16)+y);
            }
        }
    }

    loading() {
        this.divChunk = document.createElement("div");
        this.divChunk.setAttribute("class",`chunks`);
        this.divChunk.style.backgroundSize = "cover"
        this.divChunk.style.margin = "0px";
        this.divChunk.style.position = "absolute";
        this.divChunk.style.top = `${this.y*1024}px`;
        this.divChunk.style.left =`${this.x*1024}px`;
        document.getElementById('chunks').appendChild(this.divChunk);

        this.loadingAllBlock();
        this.loadingAllStructures();
        this.loadingAllCharacters();
    }

    loadingAllCharacters() {
        if (!world.world[this.y][this.x].characters) return;
        for (let key = world.world[this.y][this.x].characters.length-1; key >= 0; key--) {
            new Character(world.world[this.y][this.x].characters[key]);
            world.world[this.y][this.x].characters.splice(key, 1);
        }
    }

    unloadingAllCharacters() {
        if (!world.world[this.y][this.x].characters) world.world[this.y][this.x].characters = [];
        for (let key = this.allCharacterInstances.length-1; key >= 0; key--) {
            world.world[this.y][this.x].characters.push(this.allCharacterInstances[key].unload());
            this.allCharacterInstances.splice(key, 1);
        }

        // for (var character in world.allCharacterInstances) {
            
            
        // }
        // for (let key = world.allCharacterInstances.length-1; key >= 0; key--) {
        //     if (world.allCharacterInstances[key].chunk.x == this.x && world.allCharacterInstances[key].chunk.y == this.y) {
        //         if (!characters[this.y]) characters[this.y] = [];
        //         if (!characters[this.y][this.x]) characters[this.y][this.x] = [];
        //         characters[this.y][this.x].push(world.allCharacterInstances[key].unload());
        //         world.allCharacterInstances.splice(key, 1);
        //     }
        // }
    }

    unloading() {
        this.divChunk.remove();
        this.unloadingAllStructures();
        this.unloadingAllCharacters();
    }
}