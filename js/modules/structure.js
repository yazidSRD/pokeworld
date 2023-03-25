class Structure{

    constructor(nStructure, x, y, stage, name, size, center, composition, inside) {
        this.type = nStructure;
        this.x = x;
        this.y = y;
        this.stage = stage;
        this.name = name;
        this.size = size;
        this.center = center;
        this.composition = composition;
        this.inside = inside;

        this.loading();
    }

    save() {
        var structure = [this.type, this.stage, this.name, this.size, this.center, this.composition, this.inside]
        world.saveStructure(this.x, this.y, this.stage, structure)
    }

    unloading() {
        this.divObject.remove();
        for (const y in this.composition) {
            for (const x in this.composition[y]) {
                if (this.composition[y][x].features === undefined) continue;
                if (this.composition[y][x].features.includes("Lights")) {
                    this.composition[y][x].Lights.forEach(light => {
                        weather.destryLight(this.x+light.x-this.center.x, this.y+light.y-this.center.y)
                    });
                }
                structures.removeComposition(this.x+Number(x)-this.center.x, this.y+Number(y)-this.center.y, this.composition[y][x].stage+this.stage)
            }
        }
    }

    loading() {
        this.divObject = document.createElement("div");
        this.divObject.setAttribute("class",`structure`);
        this.divObject.style.backgroundSize = "cover"
        this.divObject.style.height = `${this.size.y*64}px`;
        this.divObject.style.width =`${this.size.x*64}px`;
        this.divObject.style.zIndex = this.stage//(co.chunk.y*16)+co.position.top;
        this.divObject.style.position = "absolute";
        this.divObject.style.top = `${this.y*64-this.center.y*64}px`;
        this.divObject.style.left =`${this.x*64-this.center.x*64}px`;

        var divStructures = structures.getDivStructures(this.x, this.y);
        if (!divStructures) {
            divStructures = structures.createDivStructures(this.x, this.y);
        }
        divStructures.appendChild(this.divObject);

        for (const y in this.composition) {
            for (const x in this.composition[y]) {
                if (this.composition[y][x].features === undefined) continue;                
                structures.addComposition(this.x+Number(x)-this.center.x, this.y+Number(y)-this.center.y, this.stage+this.composition[y][x].stage, this.x, this.y, this.stage)
                if (this.composition[y][x].features.includes("Lights")) {
                    this.composition[y][x].Lights.forEach(light => {
                        weather.addLight(this.x+light.x-this.center.x, this.y+light.y-this.center.y, light.ray, light.power)
                    });
                }
            }
        }
    }

    loadTexture() {
        if (saveStructures[this.type].transactions.length == 0) {
            this.divObject.style.backgroundImage = `url(textures/objects/${this.type}/0.png)`;
            return;
        }
        var transaction = 0;
        var situation = [];
        for (var y=this.y-1; y<this.y+2; y++) {
            for (var x=this.x-1; x<this.x+2; x++) {
                var structure = structures.getStructure(x, y, this.stage)
                var flagPush = null;
                if (structure && structure.type == this.type) {
                    flagPush = this.type;
                }
                situation.push(flagPush);
            }
        }

        for (const i1 in saveStructures[this.type].transactions) {
            var flag = true
            for (const i2 in saveStructures[this.type].transactions[i1]) {
                if (saveStructures[this.type].transactions[i1][i2] === null && this.type !== situation[i2]) continue;
                if (saveStructures[this.type].transactions[i1][i2] === true || saveStructures[this.type].transactions[i1][i2] == situation[i2]) continue;
                flag = false;
                break;
            }
            if (flag) {
                transaction = Number(i1)+1;
                break;
            }
        }
        this.divObject.style.backgroundImage = `url(textures/objects/${this.type}/${transaction}.png)`;
    }
}