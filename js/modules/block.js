class Block{

    constructor(x, y, chunk) {
        this.x = x;
        this.y = y;
        
        this.absoluteX = (chunk.x*16)+Number(x);
        this.absoluteY = (chunk.y*16)+Number(y);

        this.setType();
        this.setStage();

        this.divBlock = document.createElement("div");
        this.divBlock.setAttribute("class",`blocks`);
        this.divBlock.style.backgroundSize = "cover"
        this.divBlock.style.position = "absolute";
        this.divBlock.style.width = "64px";
        this.divBlock.style.height = "64px";
        this.divBlock.style.top = `${y*64}px`;
        this.divBlock.style.left =`${x*64}px`;
        this.divBlock.style.margin = "0px";
        chunk.divChunk.appendChild(this.divBlock);
    }

    save() {
        var block = [this.type, this.stage]
        world.saveBlock(this.absoluteX, this.absoluteY, block)
    }

    setType(type) {
        if (type) {
            this.type = type
        } else {
            var coordinate = coordinateConverter(this.absoluteX, this.absoluteY)
            this.type = world.world[coordinate.chunk.y][coordinate.chunk.x].world[coordinate.block.y][coordinate.block.x][0][0]
        }
        return this;
    }

    setStage(stage) {
        if (stage) {
            this.stage = stage
        } else {
            var coordinate = coordinateConverter(this.absoluteX, this.absoluteY)
            this.stage = world.world[coordinate.chunk.y][coordinate.chunk.x].world[coordinate.block.y][coordinate.block.x][0][1]
        }
        return this;
    }

    loadTexture() {
        var transaction = 0;
        
        var situation = [];
        if (this.stage%1 == 0.5) {
            this.stage+=0.5;
        }
        for (var y=this.absoluteY-1; y<this.absoluteY+2; y++) {
            for (var x=this.absoluteX-1; x<this.absoluteX+2; x++) {
                var block = getBlockInstance(x, y);
                if (!block) {
                    this.divBlock.style.backgroundImage = `url(textures/tileset/${this.type}/0.png)`
                    return;
                }
                if (block.stage%1 == 0.5) {
                    situation.push(block.stage+0.5)
                } else situation.push(block.stage)
            }
        }
        for (const i1 in tileset[this.type].stageTransactions) {
            var flag = true
            for (const i2 in tileset[this.type].stageTransactions[i1]) {
                if (
                    tileset[this.type].stageTransactions[i1][i2] === true || 
                    (tileset[this.type].stageTransactions[i1][i2] === null && (situation[i2] == this.stage || situation[i2] > this.stage)) ||
                    (tileset[this.type].stageTransactions[i1][i2] === false && situation[i2] < this.stage)
                ) continue;
                flag = false;
                break;
            }
            if (flag) {
                transaction = Number(i1)+1;
                break;
            }
        }
        if (transaction) {
            if (this.stage%1 != 0.5) {
                this.stage-=0.5
            }
            this.divBlock.style.backgroundImage = `url(textures/tileset/${this.type}/stageTransactions/${transaction}.png)`
            return;
        }

        ////////////////////////////////////

        situation = [];
        for (var y=this.absoluteY-1; y<this.absoluteY+2; y++) {
            for (var x=this.absoluteX-1; x<this.absoluteX+2; x++) {
                var block = getBlockInstance(x, y);
                if (block) {
                    situation.push(block.type)
                } else situation.push(null)
            }
        }
        for (const i1 in tileset[this.type].transactions) {
            var flag = true
            for (const i2 in tileset[this.type].transactions[i1]) {
                if (tileset[this.type].transactions[i1][i2] === true || tileset[this.type].transactions[i1][i2] == situation[i2]) continue;
                flag = false;
                break;
            }
            if (flag) {
                transaction = Number(i1)+1;
                break;
            }
        }
        
        this.divBlock.style.backgroundImage = `url(textures/tileset/${this.type}/${transaction}.png)`
        return;
    }

    get walkable() {
        return tileset[this.type].walkable
    }

}