class Character{

    #expression;

    constructor(loadPlayer, player=false, noSave=false) {
        this.player = player;
        this.name = loadPlayer.name;
        this.etat = loadPlayer.etat;
        this.position = loadPlayer.position;
        this.chunk = loadPlayer.chunk;
        this.conveyance = loadPlayer.conveyance;
        this.lookIn = loadPlayer.lookIn;
        this.stage = loadPlayer.stage;
        this.speed = !isNaN(loadPlayer.speed)?loadPlayer.speed:40;
        this.inventory = loadPlayer.inventory;
        this.pokemons = loadPlayer.pokemons;
        this.skin = loadPlayer.skin;
        this.interactions = loadPlayer.interactions;

        this.divPlayer = document.createElement("div");
        this.divPlayer.setAttribute("class",`player`);
        this.divPlayer.appendChild(document.createElement("img"));
        this.divPlayer.appendChild(document.createElement("img"));
        document.getElementById('characters').appendChild(this.divPlayer);

        this.teleport(this.position.x, this.position.y, this.stage, false);
        this.toBreathe();

        if (!player && noSave !== true) {
            setTimeout(async () => {
                while (!world.getChunk(this.chunk.x, this.chunk.y)) await new Promise(r => setTimeout(r, 100));
                world.getChunk(this.chunk.x, this.chunk.y).allCharacterInstances.push(this);
                console.log(this);
            },0)
        }
        if (loadPlayer.interactions) if (loadPlayer.interactions.interactionEvents) new interactionEvents(this, this.interactions.interactionEvents).execute();
    }

    get biome() {
        return world.getChunk(this.chunk.x, this.chunk.y).biome;
    }

    toBreathe() {
        var nAnim = 1;
        var char = this;
        setInterval(function(){
            if (char.etat == "static" || char.etat == "fight") char.divPlayer.getElementsByTagName('img')[0].setAttribute("src",`textures/characters/${char.skin}/${char.conveyance}/static/${char.lookIn}/${nAnim}.png`);
            if (nAnim == 4) {
                nAnim = 1;
            } else nAnim++;
        }, 300);
    }

    getObject() {
        return world;
    }
    
    async move(direction, sens) {
        if (this.etat != "static") return false;
        this.etat = "walk"
        this.lookIn = {
            "y":{
                "-1":"nord",
                "1":"sud"
            },
            "x":{
                "1":"est",
                "-1":"ouest"
            }
        }[direction][sens]
        this.position[direction] += sens;
        var structure = structures.getStructure(this.position.x, this.position.y, this.stage)
        var features = structures.getFeatures(this.position.x, this.position.y, this.stage)
        if (features.EnterOrLeave && this.player) {
            await this.#EnterOrLeave(direction, sens);
            this.etat = "static";
            return false;
        }
        if (!this.iCanMove(this.position.x, this.position.y)) {
            this.position[direction] -= sens;
            this.etat = "static";
            return false;
        }
        
        if (this.player) {
            var newPosition = coordinateConverter(this.position.x, this.position.y);
            if (this.chunk.x != newPosition.chunk.x || this.chunk.y != newPosition.chunk.y) {
                this.chunk = newPosition.chunk;
                world.unloadingChunks();
                world.loadingChunks();
            }
        }
        
        //var initialPos = world.divWorld[`offset${{"y":"Top","x":"Left"}[direction]}`]-(8*sens);
        if (this.player) {
            weather.move(direction, sens);
        }
        var initialPos = Number(this.divPlayer.style[{"y":"top","x":"left"}[direction]].replace("px",""))+(8*sens);
        var xx = 2;
        for (var newPos = initialPos; newPos != initialPos+(64*sens); newPos+= (8*sens)) {
            await new Promise(resolve => setTimeout(resolve, this.speed));
            this.divPlayer.getElementsByTagName('img')[0].setAttribute("src",`textures/characters/${this.skin}/${this.conveyance}/${this.etat}/${this.lookIn}/${Math.trunc(xx++/2)}.png`)
            this.divPlayer.style[{"y":"top","x":"left"}[direction]] = `${newPos}px`;
            if (this.player) {
                world.divWorld.style[{"y":"top","x":"left"}[direction]] = `${world.divWorld[`offset${{"y":"Top","x":"Left"}[direction]}`]-(8*sens)}px`;
            }
            if (xx == 6) {
                if (this.player) {
                    document.querySelector("svg").style.zIndex = this.position.y+50
                }
                var roof = true;
                var char = this;
                structures.getStructures(this.position.x, this.position.y).some(function(structure) {
                    var features3 = structures.getFeatures(char.position.x, char.position.y, structure.stage)
                    if (features3.Roof && structure.stage > char.stage) {
                        roof = false;
                        return;
                    }
                });
                if (roof) this.divPlayer.style.zIndex = this.position.y+1;
                else this.divPlayer.style.zIndex = this.position.y;
                if (features.Effect3D) {
                    this.divPlayer.getElementsByTagName('img')[1].setAttribute("src",`textures/objects/${structure.type}/effect3D${this.lookIn}.png`);
                } else {
                    this.divPlayer.getElementsByTagName('img')[1].setAttribute("src",``);
                }
            }
        }
        if (features.RandomFight && Math.random() < 0.05) {
            fight.randomFight(this, pokemonGenerator(Math.floor(Math.random()*listOfpokemons.length)));
            return true;
        }
        this.etat = "static";
        return true;
    }

    iCanMove(x, y) {
        var features = structures.getFeatures(x, y, this.stage);
        var features2 = structures.getFeatures(x, y, this.stage +1);
        var blockInstance = getBlockInstance(x, y);
        
        if (blockInstance === undefined) {
            return false;
        }

        if (this.stage === true && blockInstance.stage%1 != 0.5) {
            this.stage = blockInstance.stage;
        }

        if (features.Stair) {
            this.stage = true
        } else if (features2.Stair) {
            this.stage = true
        }

        if (blockInstance.stage != this.stage && !features.Bridge) {
            if (this.stage === true) {
                if ((features.Stair === undefined && features2.Stair === undefined) && blockInstance.stage%1 == 0.5) {
                    return false;
                }
            } else {
                return false;
            }
        }

        if (features.InvisibleWall) {
            return false;
        }

        if (blockInstance.walkable != this.conveyance && !features.Bridge) {
            return false;
        }
        
        if (world.getChunk(this.chunk.x, this.chunk.y).allCharacterInstances.find(character => character != this && character.position.x == x && character.position.y == y) && this.player) {
            return false
        }

        return true;
    }

    async interaction() {
        if (this.etat != 'static') return;
        this.etat = "interaction";

        var vector = {
            "nord":["y",-1],
            "sud":["y",1],
            "est":["x",1],
            "ouest":["x",-1]
        }[this.lookIn];
        var pPos = {x:this.position.x, y:this.position.y};
        pPos[vector[0]] += vector[1];

        if (await structures.getInteraction(pPos.x, pPos.y, this.stage, this) == false) {
            var character = world.getChunk(this.chunk.x, this.chunk.y).allCharacterInstances.find(character => character.position.x == pPos.x && character.position.y == pPos.y);
            if (character) {
                //in progress
                // console.log(character.interactions);
                // console.log("----- interactions");
                // ["discussions", "fight"].forEach(interaction => {
                //     if (character.interactions[interaction]) console.log("-- "+interaction);
                // })
                // if (character.pokemons.pokemons.length) {
                //     fight.start(this, character)
                // } else await chat.read(`...`, character.name);
                for (const interaction in character.interactions) {
                    if (character.interactions[interaction]) {
                        try {
                            var i = eval(interaction);
                            i = new i(character, character.interactions[interaction], this);
                            i.execute();
                            return;
                        } catch {}
                    }
                }
            }
        }
        this.etat = 'static';
        return;
    }

    giveItem(item) {
        if (this.inventory.max < this.inventory.count + item.count) return false;
        for (let i = 0; i < this.inventory.items.length; i++) {
            if (this.inventory.items[i].id == item.id) {
                if (dataItems[this.inventory.items[i].id].max >= this.inventory.items[i].count + item.count) {
                    this.inventory.items[i].count += item.count;
                    this.inventory.count += item.count;
                    return true
                } else {
                    return false;
                }
            }
        }
        if (item instanceof Item) this.inventory.items.push(item.data);
        else this.inventory.items.push(item);
        this.inventory.count += item.count;
        return true;
    }

    removeItem(i) {
        if (!this.inventory.items[i]) return false;
        this.inventory.count--;
        if (this.inventory.items[i].count == 1) {
            return this.inventory.items.splice(i, 1)[0];
        } else {
            this.inventory.items[i].count--;
            var item = structuredClone(this.inventory.items[i]);
            item.count = 1;
            return item;
        }
    }

    getItem(i) {
        if (!this.inventory.items[i]) return;
        return new Item(player.inventory.items[i], this);
    }

    getPokemon(i) {
        if (!this.pokemons.pokemons[i]) return;
        return new Pokemon(this.pokemons.pokemons[i], this);
    }

    givePokemon(pokemon) {
        if (this.pokemons.max <= this.pokemons.pokemons.length) return false;
        this.pokemons.pokemons.push(pokemon);
        userInterface.refresh();
        return true;
    }

    removePokemon(i) {
        if (!this.pokemons.pokemons[i]) return false;
        return this.pokemons.pokemons.splice(i, 1)[0];
    }

    async anim(direction, sens) {
        
    }

    teleport(x=this.position.x, y=this.position.y, stage=this.stage, reload=true) {
        var newPos = coordinateConverter(x, y);
        this.position = {x:x, y:y};
        this.chunk = newPos.chunk;
        this.stage = stage;
        this.divPlayer.style.left = `${this.position.x*64}px`;
        this.divPlayer.style.top =`${this.position.y*64}px`;
        this.divPlayer.style.zIndex = this.position.y+1;
        if (this.player) {
            if (reload) {
                world.unloadingAllChunks();
                world.loadingChunks();
            }
            world.divWorld.style.top = `${-(this.position.y-8)*64}px`;
            world.divWorld.style.left = `${-(this.position.x-15)*64}px`;
            document.querySelector("svg").style.zIndex = this.position.y+50
        }
    }

    async #EnterOrLeave(direction, sens) {
        await weather.anim(direction, sens);

        var features = structures.getFeatures(this.position.x, this.position.y, this.stage)
        var structure = structures.getStructure(this.position.x, this.position.y, this.stage)
        
        var newPos;
        if (structure.inside) {
            loadWorld(structure.inside, "inside", structure.x, structure.y);
            newPos = coordinateConverter(features.EnterOrLeave.x, features.EnterOrLeave.y);
            this.position = {x:features.EnterOrLeave.x, y:features.EnterOrLeave.y};
        } else {
            newPos = coordinateConverter(world.x, world.y);
            this.position = {x:world.x, y:world.y};
            this.chunk = newPos.chunk;
            loadWorld(saveWorld);
            world.loadingChunks();
            structure = structures.getStructure(this.position.x, this.position.y, this.stage)
            newPos = coordinateConverter(this.position.x+features.EnterOrLeave.x-structure.center.x, this.position.y+features.EnterOrLeave.y-structure.center.y);
            this.position = {x:this.position.x+features.EnterOrLeave.x-structure.center.x, y:this.position.y+features.EnterOrLeave.y-structure.center.y};
            this.chunk = newPos.chunk;
            world.unloadingAllChunks();
        }
        this.chunk = newPos.chunk;
        this.teleport();
        return
        world.loadingChunks();
        world.divWorld.style.top = `${-this.position.y*64}px`;
        world.divWorld.style.left = `${-this.position.x*64}px`;
        this.divPlayer.style.zIndex = this.position.y;
        this.divPlayer.style.left = `${(this.position.y-1)*64}px`;
        this.divPlayer.style.top =`${(this.position.x-1)*64}px`;
    }

    unload() {
        this.divPlayer.remove();
        return {
            name: this.name,
            etat: "static",
            position: {
                x: this.position.x,
                y: this.position.y
            },
            chunk: {
                x: this.chunk.x,
                y: this.chunk.y
            },
            conveyance: this.conveyance,
            lookIn: this.lookIn,
            stage: this.stage,
            inventory: {
                max: this.inventory.max,
                items: this.inventory.items
            },
            pokemons: {
                max: this.pokemons.max,
                pokemons: this.pokemons.pokemons
            },
            interactions: this.interactions,
            skin: this.skin
        }
    }

    async getImage(direction) {
        let url = `textures/characters/${this.skin}/fight/${direction}/0.png`;
        try {
            return await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = () => resolve(`textures/characters/${this.skin}/0/static/sud/1.png`)
                img.src = url;
            });
        } catch (error) {
            return `textures/characters/${this.skin}/0/static/sud/1.png`;
        }
    }

    async expression(expression) {
        while (this.#expression) return;
        this.#expression = true;
        var divExpression = document.createElement("img");
        divExpression.style.height = "0px"
        divExpression.style.width = "0px"
        divExpression.setAttribute("src",`textures/expressions/${expression}.png`);
        this.divPlayer.appendChild(divExpression);

        const audio = new Audio(`sounds/expressions/${expression}.mp3`);
        audio.play();

        for (let index = 0; index < 76; index+=2) {
            divExpression.style.height = index+"px"
            divExpression.style.width = index+"px"
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        for (let index = 75; index > 64; index--) {
            divExpression.style.height = index+"px"
            divExpression.style.width = index+"px"
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        await new Promise(resolve => setTimeout(resolve, 1000));

        for (let index = 64; index >= 0; index-=4) {
            divExpression.style.height = index+"px"
            divExpression.style.width = index+"px"
            await new Promise(resolve => setTimeout(resolve, 0));
        }

        divExpression.remove();
        this.#expression = false;
    }
}