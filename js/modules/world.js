class World{
    
    allChunkInstances = [];
    allBlockInstances = [];
    #allCharacterInstances = [];

    constructor(save, type, x, y) {
        this.world = save;
        this.type = type;
        if (this.type == "inside") {
            this.x = x;
            this.y = y;
            weather.weather = false;
        } else {
            weather.weather = true;
        }
        this.divWorld = document.getElementById("world");
    }

    getChunk(x, y) {
        return this.allChunkInstances.find(instance => instance.x == x && instance.y == y)
    }

    deleteChunk(x, y) {
        var index = this.allChunkInstances.findIndex(instance => instance.x == x && instance.y == y)
        if (index == -1) return;
        this.allChunkInstances.splice(index, 1)
    }

    chunkExists(x, y) {
        if (!this.world[y]) return false;
        if (!this.world[y][x]) return false;
        return true;
    }

    loadingChunk(x, y) {
        if (this.getChunk(x, y)) return;
        if (!this.chunkExists(x, y)) return;
        var chunk = new Chunk(x, y);
        this.allChunkInstances.push(chunk);
    }

    loadingChunks(ray) {
        if (!ray) {
            if (this.type == "inside") {
                ray = 0;
            } else {
                ray = 1;
            }
        }
        for (var x=player.chunk.x-ray; x <= player.chunk.x+ray; x++) {
            for (var y=player.chunk.y-ray; y <= player.chunk.y+ray; y++) {
                this.loadingChunk(x, y);
            }
        }
        this.loadTextures();
        structures.loadTextures()
    }

    unloadingChunk(x, y) {
        var chunk = this.getChunk(x, y);
        if (!chunk) return;
        chunk.unloading();
        this.deleteChunk(x, y);
    }

    unloadingAllChunks() {
        for (let i = this.allChunkInstances.length-1; i >= 0; i--) {
            this.allChunkInstances[i].unloading();
            this.deleteChunk(this.allChunkInstances[i].x, this.allChunkInstances[i].y);
        }
    }

    unloadingChunks(ray) {
        if (!ray) {
            if (this.type == "inside") {
                ray = 1;
            } else {
                ray = 2;
            }
        }
        var y = player.chunk.y-ray;
        var x = player.chunk.x-ray;
        for (var i=0;i<=(2+ray);i++) {
            this.unloadingChunk(x+i, y);
        }
        x+=(2+ray);
        for (var i=1;i<=(2+ray);i++) {
            this.unloadingChunk(x, y+i);
        }
        y+=(2+ray);
        for (var i=1;i<=(2+ray);i++) {
            this.unloadingChunk(x-i, y);
        }
        x-=(2+ray);
        for (var i=1;i<(2+ray);i++) {
            this.unloadingChunk(x, y-i);
        }
    }

    loadTextures() {
        this.allChunkInstances.forEach(element => {
            element.allBlockInstances.forEach(element => {
                element.loadTexture();
            });
        });
    }

    getStructuresInBlock(x, y) {
        var coordinate = coordinateConverter(x, y)
        try {
            return this.world[coordinate.chunk.y][coordinate.chunk.x].world[coordinate.block.y][coordinate.block.x][1];
        } catch (error) {
            console.log(x, y, error);
            return undefined;
        }
    }

    saveStructure(x, y, stage, structure) {
        var coordinate = coordinateConverter(x, y);
        this.world[coordinate.chunk.y][coordinate.chunk.x].world[coordinate.block.y][coordinate.block.x][1][stage] = structure;
    }

    saveBlock(x, y, block) {
        var coordinate = coordinateConverter(x, y);
        this.world[coordinate.chunk.y][coordinate.chunk.x].world[coordinate.block.y][coordinate.block.x][0] = block;
    }

    save() {
        var text = JSON.stringify(world.world); 
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', "save.json");
    
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    }
}