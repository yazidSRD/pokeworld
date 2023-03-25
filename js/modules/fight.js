class Fight{
    
    #response;
    get response() {
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (this.#response) {
                    resolve(this.#response);
                    return;
                }
                if (!this.inProgress) {
                    resolve()
                    return;
                }
            }, 100);
        })
    }

    constructor() {
        this.inProgress = false;
    }

    randomFight(character, pokemon) {
        var team2 = [];
        team2[0] = new Character(characterGenerator(character.position, character.stage, null, null, null, null, {max:6,pokemons:[pokemon]}, null, null), false, true);
        team2[0].unload();
        this.start([character], team2, null, "0");
    }

    async start(team1, team2, nP, type="0", theme=player.biome) {
        this.teams = [
            {
                characters: team1,
                pokemons:[],
            },
            {
                characters: team2,
                pokemons:[],
            }
        ]

        if (nP) this.nP = np;
        else if (this.teams[0].characters.length == 1 && this.teams[0].characters.length < this.teams[1].characters.length) this.nP = this.teams[1].length;
        else if (this.teams[1].characters.length == 1 && this.teams[1].characters.length < this.teams[0].characters.length) this.nP = this.teams[0].length;
        else this.np = 1;

        if (this.inProgress) return;
        this.inProgress = true;
        this.theme = theme;
        this.round = 0;
        this.type = type;
        this.historic = [];
        this.#response = null;

        this.teams.forEach(team => {
            team.characters.forEach((character, nCharacter) => {
                character.etat = "fight";

                if (team.characters.length == this.np) {
                    for (const i in character.pokemons.pokemons) {
                        if (character.getPokemon(i).life != 0) {
                            team.pokemons[nCharacter] = character.getPokemon(i);
                            break;
                        }
                    }
                } else if (team.characters.length < this.np) {
                    for (let index = 0; index < this.np; index++) {
                        for (const i in character.pokemons.pokemons) {
                            if (character.getPokemon(i).life != 0) {
                                team.pokemons[index] = character.getPokemon(i);
                                break;
                            }
                        }
                    }
                }
            });
        });

        if (this.teams[0].pokemons.length == 0) {this.stop();return;}
        if (this.teams[1].pokemons.length == 0) {this.stop();return;}
        
        
        
        
        // userInterface.ui.refresh(this.theme, this.teams[0].pokemons, this.teams[1].pokemons);
        
        // if (this.teams[1].characters[0].name !== null) {
        //     //await new Promise(r => setTimeout(r, 5000));
        //     var anim = new UiFight_Animation_Fight_01();
        //     await anim
        // } else {
        //     var anim = new UiFight_Animation_Fight_01();
        //     await anim.start();
        // }
        

        

        // const audio = new Audio('sounds/jingles/Battle01.mp3');
        // audio.play();
        // audio.addEventListener('ended', () => {
        //     if (this.inProgress == true)
        //     audio.play();
        // });
        userInterface.open(UiFight);

        await new (eval(`UiFight_Animation_Fight_${this.type}`))().start();

        userInterface.ui.refresh = true;
        userInterface.ui.hideUiAll(true, true);
        
        await new UiFight_Animation_StartOpponent_01().start();

        userInterface.ui.hideUiAll(false);
        // var chat = new UiChat();
        // if (this.teams[1].characters[0].name !== null) {
            
            
        //     userInterface.divInterface.appendChild(chat.createDiv(`Un combat est lancé.`));
        //     await chat.response;
            
        //     this.teams[1].pokemons[0].playSound()
        //     userInterface.divInterface.appendChild(chat.createDiv(`${this.teams[1].pokemons[0].nickname} est envoyé par ${this.teams[1].characters[0].name}!`));
        //     await chat.response;
        // } else {
        //     var chat = new UiChat();
        //     this.teams[1].pokemons[0].playSound()
        //     userInterface.divInterface.appendChild(chat.createDiv(`Un ${this.teams[1].pokemons[0].nickname} sauvage apparaît!`));
        //     await chat.response;
        // }

        // this.teams[0].pokemons[0].playSound()
        // userInterface.divInterface.appendChild(chat.createDiv(`Go! ${this.teams[0].pokemons[0].nickname}!`));
        // await chat.response;

        // chat.destructor();
        // userInterface.ui.hideUiAll(false);

        this.#startRound();
    }

    async #startRound() {
        var action = await this.#choiceOfAction();
        
        this.#fight(action)
    }

    async #fight(actions) {
        this.actions = actions;
        
        this.historic[this.round] = {
            actions:[]
        };

        for (const action of this.actions) {
            if (action.attack.pokemon.life == 0) continue;
            this.historic[this.round].actions.push({
                attack:action.attack.name,
                pokemon:action.attack.pokemon.data
            });

            await action.attack.execute(action.targets);

            if (!this.inProgress) return;

            if (action.targets[0].life == 0) {
                //userInterface.ui.refresh(this.theme, this.teams[0].pokemons, this.teams[1].pokemons);
                var chat = new UiChat();

                userInterface.divInterface.appendChild(chat.createDiv(`${action.targets[0].nickname} est KO!`));
                
                await chat.response;
                chat.destructor();

                if (action.attack.pokemon.trainer.player) {
                    if (action.attack.pokemon.life != 0) {
                        var xp = this.calculXp(action.attack.pokemon, action.targets[0])
                        var chat = new UiChat();
                        userInterface.divInterface.appendChild(chat.createDiv(`${action.attack.pokemon.nickname} a gagné ${xp} points Exp.!`));
                        await chat.response;
                        chat.destructor();
                        await action.attack.pokemon.earnXp(xp);
                    }
                }
            }
            if (action.attack.pokemon.life == 0) {
                //userInterface.ui.refresh(this.theme, this.teams[0].pokemons, this.teams[1].pokemons);
                var chat = new UiChat();

                userInterface.divInterface.appendChild(chat.createDiv(`${action.attack.pokemon.nickname} est KO!`));
                
                await chat.response;
                chat.destructor();
            }

            

            for (let i = 0; i < this.teams.length; i++) {
                for (let x = 0; x < this.teams[i].pokemons.length; x++) {
                    this.teams[i].pokemons[x].reload();
                }
            }

            // userInterface.ui.refresh(this.theme, this.teams[0].pokemons, this.teams[1].pokemons);
        }

        this.#endRound()
    }

    async #endRound() {
        
        var end = false;

        for (let i = 0; i < this.teams.length; i++) {
            for (let x = 0; x < this.teams[i].pokemons.length; x++) {
                if (this.teams[i].pokemons[x].life == 0) {
                    if (this.teams[i].pokemons[x].trainer.player) {
                        var request = {};
                        request.uiPokemon_inInfoBase = ["envoyer"];
                        request.uiPokemons_close = "close";
                        request.uiPokemons_test = this.testPokemon;
                        
                        userInterface.ui.hideUiAll();
                        var ui = new UiPokemons(request);

                        userInterface.divInterface.appendChild(ui.createDiv());
                        
                        var response = await ui.response;
                        
                        ui.destructor();
                        userInterface.ui.hideUiAll(false);

                        switch (Object.keys(response)[0]) {
                            case "uiPokemon_inInfoBase":
                                this.PokemonSwitch(response.uiPokemon_inInfoBase[1], this.teams[i].pokemons[x])
                                //this.teams[i].pokemons[x] = response.uiPokemon_inInfoBase[1];
                                var chat = new UiChat();
                                userInterface.divInterface.appendChild(chat.createDiv(`${this.teams[i].pokemons[x].nickname}, Go!`));
                                await chat.response;
                                chat.destructor();
                                break;
                            case "uiPokemons_close":
                            default:
                                this.#response = false;
                                end = true;
                        }
                    } else {
                        //in progress
                        //this.teams[i].pokemons.splice(x, 1);
                        for (const key in this.teams[i].pokemons[x].trainer.pokemons.pokemons) {
                            if (this.teams[i].pokemons[x].trainer.pokemons.pokemons[key].life != 0) {
                                this.PokemonSwitch(this.teams[i].pokemons[x].trainer.getPokemon(key), this.teams[i].pokemons[x])
                                //this.teams[i].pokemons[x] = this.teams[i].pokemons[x].trainer.getPokemon(key);
                                var chat = new UiChat();
                                userInterface.divInterface.appendChild(chat.createDiv(`${this.teams[i].pokemons[x].nickname} est envoyé par ${this.teams[i].pokemons[x].trainer.name}!`));
                                await chat.response;
                                chat.destructor();
                                break;
                            }
                        }
                        if (this.teams[i].pokemons[x].life == 0) {
                            // const audio = new Audio('sounds/jingles/battleWin01.mp3');
                            // audio.play();
                            this.#response = true;
                            end = true;
                        }
                    }
                }
            }
        }

        if (end) {
            this.stop();
            return;
        }
        // userInterface.ui.refresh(this.theme, this.teams[0].pokemons, this.teams[1].pokemons);
        
        this.round++;
        this.#startRound();
    }

    async #choiceOfAction() {
        var action = []
        
        for (const nTeam in this.teams) {
            if (this.teams[nTeam].characters.length == 1) {
                for (let index = 0; index < this.np; index++) {
                    if (this.teams[nTeam].pokemons[index]) {
                        if (this.teams[nTeam].characters[0].player) {
                            action.push(await this.playerAction(this.teams[nTeam].characters[0], this.teams[nTeam].pokemons[index]));
                        } else {
                            action.push(this.ia(this.teams[nTeam].characters[0], this.teams[nTeam].pokemons[index]));
                        }
                    }
                }
            } else {
                this.teams[nTeam].characters.forEach(async (character, index) => {
                    if (this.teams[nTeam].pokemons[index]) {
                        if (character.player) {
                            action.push(await this.playerAction(this.teams[nTeam].characters[0], this.teams[nTeam].pokemons[index]));
                        } else {
                            action.push(this.ia(this.teams[nTeam].characters[0], this.teams[nTeam].pokemons[index]));
                        }
                    }
                });
            }
        }

        // await this.teams.forEach(async (team, nTeam) => {
        //     if (team.characters.length == 1) {
        //         for (let index = 0; index < this.np; index++) {
        //             if (team.pokemons[index]) {
        //                 if (team.characters[0].player) {
        //                     var requests = ["ATTAQUE", "POKÉMON", "SAC", "FUITE"]
        //                     userInterface.ui.menu(requests);

        //                     action[nTeam][index] = await userInterface.ui.response;
        //                 } else {
        //                     action[nTeam][index] = this.ia();
        //                 }
        //             }
        //         }
        //     } else {
        //         team.characters.forEach(async (character, index) => {
        //             if (team.pokemons[index]) {
        //                 if (character.player) {
        //                     var requests = ["ATTAQUE", "POKÉMON", "SAC", "FUITE"]
        //                     userInterface.ui.menu(requests);

        //                     action[nTeam][index] = await userInterface.ui.response;
        //                 } else {
        //                     action[nTeam][index] = this.ia();
        //                 }
        //             }
        //         });
        //     }
        // });
        console.log(action);
        action.sort((a, b) => {
            if (a.attack.priority !== b.attack.priority) {
              return b.attack.priority - a.attack.priority;
            }
            return b.attack.pokemon.getStats.speed - a.attack.pokemon.getStats.speed;
        });

        return action;
    }

    async stop() {
        if (!this.inProgress) return;
        if (this.#response === null) this.#response = false;
        this.inProgress = false;
        userInterface.close();
        this.teams.forEach(team => {
            team.characters.forEach(character => {
                character.etat = "static";
            });
        });
        this.historic = [];
        this.teams = undefined;
        this.round = 0;
    }

    async playerAction(character, pokemon) {
        var action;
        while (!action) {
            var requests = ["ATTAQUE", "POKÉMON", "SAC", "FUITE"]
            userInterface.ui.menu(requests);

            var response = await userInterface.ui.response;
            
            userInterface.ui.closeMenu();

            switch (response) {
                case "POKÉMON":
                    var nextP = await this.menuPokemons(character);
                    if (nextP) {
                        action = {};
                        action.attack = new Attack([2, -1], pokemon);
                        action.targets = [nextP];
                    }
                    break;
                case "SAC":
                    var item = await this.menuInvetory(character);
                    if (item) {
                        action = {};
                        action.attack = new Attack([3, -1], pokemon);
                        action.attack.item = item;
                        action.targets = [pokemon];
                    }
                    break;
                case "ATTAQUE":
                    action = await this.menuAttack(pokemon);
                    break;
                case "FUITE":
                    var fuite = await this.menuFuite();
                    if (fuite) {
                        action = {};
                        action.attack = new Attack([4, -1], pokemon);
                        action.targets = [pokemon];
                    }
                    break;
                default:
                    break;
            }
        }

        return action;
    }

    async menuPokemons(character) {
        var request = {};
        request.uiPokemon_inInfoBase = ["envoyer"];
        request.uiPokemons_close = "close";
        request.uiPokemons_test = this.testPokemon;
        // var ui = new UiPokemons(request);

        // userInterface.ui.open(ui.createDiv());
        
        // var response = await ui.response;
        
        // userInterface.ui.close();
        userInterface.ui.hideUiAll();
        var ui = new UiPokemons(request);

        userInterface.divInterface.appendChild(ui.createDiv());
        
        var response = await ui.response;
        
        ui.destructor();
        userInterface.ui.hideUiAll(false);

        switch (Object.keys(response)[0]) {
            case "uiPokemon_inInfoBase":
                return response.uiPokemon_inInfoBase[1];
                break;
            case "uiPokemons_close":
            default:
                return undefined;
        }
        return undefined;
    }

    async menuInvetory(character) {
        var request = {};
        request.uiInventory_use = "use";
        request.uiInventory_close = "close";
        // var ui = new UiInventory(request);

        // userInterface.ui.open(ui.createDiv());

        // var response = await ui.response;
        
        // userInterface.ui.close();

        userInterface.ui.hideUiAll();
        var ui = new UiInventory(request);

        userInterface.divInterface.appendChild(ui.createDiv());
        
        var response = await ui.response;
        
        ui.destructor();
        userInterface.ui.hideUiAll(false);

        switch (Object.keys(response)[0]) {
            case "uiItem_inInfoBase":
                var item = character.getItem(response.uiItem_inInfoBase[1])
                if (!item.iCanUse()) {
                    msgAlert("Impossible d'utiliser l'objet.");
                    await this.menuInvetory(character);
                    return undefined;
                }
                
                if (await item.settings()) {
                    return item;
                } else {
                    msgAlert("L'objet n'a pas été utilisé.");
                    return undefined;
                }
                break;
                case "uiInventory_close":
                default:
                    return undefined;
        }
        return undefined;
    }

    async menuAttack(pokemon) {

        var request = {};
        request.uiPokemon_moreInfoMove = ["use"];
        request.uiPokemon_close = "close";
        //request.uiPokemons_test = this.testPokemon;
        // var ui = new UiPokemon(pokemon, request);

        // userInterface.ui.open(ui.createDiv());
        
        // var response = await ui.response;
        
        // userInterface.ui.close();

        userInterface.ui.hideUiAll();
        var ui = new UiPokemon(pokemon, request);

        userInterface.divInterface.appendChild(ui.createDiv());
        
        var response = await ui.response;
        
        ui.destructor();
        userInterface.ui.hideUiAll(false);


        switch (Object.keys(response)[0]) {
            case "uiPokemon_moreInfoMove":
                var action = {};
                action.attack = pokemon.getAttacks[response.uiPokemon_moreInfoMove[1]];
                action.targets = [this.teams[1].pokemons[0]];
                return action;
            case "uiPokemon_close":
            default:
                return undefined;
        }
        return undefined;
    }

    async menuFuite() {

        var request = {};
        request.uiChat_responses = ["non","oui"];

        var chat = new UiChat();

        userInterface.divInterface.appendChild(chat.createDiv(`Êtes-vous sûr de vouloir fuir?`, null, request));
        
        var response = await chat.response;
        
        chat.destructor();
        if (response.uiChat_responses == "oui") {
            return true;
        }
        return false;
    }

    testPokemon(pokemonTest) {
        if (pokemonTest.life == 0) return false;
        for (const team of fight.teams) {
            for (const pokemon of team.pokemons) {
                if (pokemon.data == pokemonTest.data) return false;
            }
        }
        return true;
    }

    async PokemonSwitch(pokemon, target) {
        for (let i = 0; i < this.actions.length; i++) {
            for (let x = 0; x < this.actions[i].targets.length; x++) {
                if (this.actions[i].targets[x].data == target.data) {
                    this.actions[i].targets[x] = pokemon;
                }
            }
        }

        for (let i = 0; i < this.teams.length; i++) {
            for (let x = 0; x < this.teams[i].pokemons.length; x++) {
                if (this.teams[i].pokemons[x].data == target.data) {
                    if (this.teams[i].pokemons[x].divPokemon) {
                        if (this.teams[i].pokemons[x].life != 0) {
                            this.teams[i].pokemons[x].playSound();
                            for (let index = 50; index > -1; index--) {
                                this.teams[i].pokemons[x].divPokemon.children[1].style.backgroundSize = `${index}% ${index}%`;
                                await new Promise(r => setTimeout(r, 7));
                            }
                        }
                        this.teams[i].pokemons[x].divPokemon.remove();
                    }
                    this.teams[i].pokemons[x] = pokemon;
                    this.teams[i].pokemons[x].playSound();
                }
            }
        }
    }

    calculXp(pokemon, pokemonKO) {
        // https://www.pokepedia.fr/Exp%C3%A9rience
        var xpP1 = 2 * pokemonKO.lvl + 10;
        xpP1 /= (pokemonKO.lvl + pokemon.lvl + 10);
        xpP1 = Math.pow(xpP1,2.5);

        var xpP2 = listOfpokemons[pokemonKO.id].earnXp * pokemonKO.lvl * 1 * 1;
        xpP2 /= (5 * 1);

        var xp = (xpP2 * xpP1) * 1 * 1 * 1 * 1;
        return Number(xp.toFixed(0));
    }

    ia(character, pokemon) {
        var action = {};
        action.attack = pokemon.getAttacks[0];
        action.targets = [this.teams[0].pokemons[0]];
        return action;
    }
}

class UiFight_Animation_Fight_0 {
    async start() {
        if (!(userInterface.ui instanceof UiFight)) return
        
        fight.audio = new Audio(`sounds/ambiance/battle/0.mp3`);
        fight.audio.play();
        fight.audio.addEventListener('playing', async () => {
            var time = 31+43;
            while (fight.inProgress) {
                await new Promise(r => setTimeout(r, 1000));
                time--;
                if (time == 0) {
                    fight.audio.currentTime = 44;
                    time = 31;
                };
            }
        });

        fight.response.then((response) => {
            fight.audio.pause();
            if (response) {
                var audio = new Audio(`sounds/ambiance/victory/0.mp3`);
                audio.play()
                setTimeout(async () => {
                    for (let index = 1; index >= 0; index-=0.01) {
                        audio.volume = index;
                        await new Promise(r => setTimeout(r, 20));
                    }
                    audio.pause();
                }, 5000)
            }
        });

        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.height = "100%"
        div.style.width = "100%"
        div.style.backgroundColor = "rgba(255, 255, 255, 0)"
        userInterface.ui.divUiFight.children[0].appendChild(div);

        for (let index = 0; index < 2; index++) {
            for (let index = 0; index < 1; index+=0.01) {
                div.style.backgroundColor = `rgba(255, 255, 255, ${index})`;
                await new Promise(r => setTimeout(r, 1));
            }
    
            await new Promise(r => setTimeout(r, 20));
    
            for (let index = 1; index > 0; index-=0.05) {
                div.style.backgroundColor = `rgba(255, 255, 255, ${index})`;
                await new Promise(r => setTimeout(r, 10));
            }
            
            await new Promise(r => setTimeout(r, 20));
        }

        for (let index = 0; index < 1; index+=0.01) {
            div.style.backgroundColor = `rgba(255, 255, 255, ${index})`;
            await new Promise(r => setTimeout(r, 1));
        }

        setTimeout(async () => {
            while (userInterface.ui.refresh == false) {
                await new Promise(r => setTimeout(r, 100));
            }
            for (let index = 1; index > 0; index-=0.05) {
                div.style.backgroundColor = `rgba(255, 255, 255, ${index})`;
                await new Promise(r => setTimeout(r, 10));
            }
            div.remove();
        }, 0)
    }
}

class UiFight_Animation_Fight_1 {
    async start() {
        if (!(userInterface.ui instanceof UiFight)) return
        
        fight.audio = new Audio(`sounds/ambiance/battle/1.mp3`);
        fight.audio.play();
        fight.audio.addEventListener('playing', async () => {
            var time = 31+43;
            while (fight.inProgress) {
                await new Promise(r => setTimeout(r, 1000));
                time--;
                if (time == 0) {
                    fight.audio.currentTime = 44;
                    time = 31;
                };
            }
        });

        fight.response.then((response) => {
            fight.audio.pause();
            if (response) {
                var audio = new Audio(`sounds/ambiance/victory/1.mp3`);
                audio.play()
                setTimeout(async () => {
                    for (let index = 1; index >= 0; index-=0.01) {
                        audio.volume = index;
                        await new Promise(r => setTimeout(r, 20));
                    }
                    audio.pause();
                }, 5000)
            }
        });

        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.height = "100%"
        div.style.width = "100%"
        div.style.backgroundColor = "rgba(255, 255, 255, 0)"
        userInterface.ui.divUiFight.children[0].appendChild(div);

        for (let index = 0; index < 2; index++) {
            for (let index = 0; index < 1; index+=0.01) {
                div.style.backgroundColor = `rgba(255, 255, 255, ${index})`;
                await new Promise(r => setTimeout(r, 1));
            }
    
            await new Promise(r => setTimeout(r, 20));
    
            for (let index = 1; index > 0; index-=0.05) {
                div.style.backgroundColor = `rgba(255, 255, 255, ${index})`;
                await new Promise(r => setTimeout(r, 10));
            }
            
            await new Promise(r => setTimeout(r, 20));
        }

        for (let index = 0; index < 1; index+=0.01) {
            div.style.backgroundColor = `rgba(255, 255, 255, ${index})`;
            await new Promise(r => setTimeout(r, 1));
        }

        setTimeout(async () => {
            while (userInterface.ui.refresh == false) {
                await new Promise(r => setTimeout(r, 100));
            }
            for (let index = 1; index > 0; index-=0.05) {
                div.style.backgroundColor = `rgba(255, 255, 255, ${index})`;
                await new Promise(r => setTimeout(r, 10));
            }
            div.remove();
        }, 0)
    }
}

class UiFight_Animation_StartOpponent_01 {
    async start() {
        if (!(userInterface.ui instanceof UiFight)) return

        var div = document.createElement("div");
        div.style.position = "absolute";
        div.style.height = "100%"
        div.style.width = "100%"
        userInterface.ui.divUiFight.children[0].appendChild(div);

        let characterDiv = document.createElement("div");
        characterDiv.style.position = "absolute";
        characterDiv.style.height = "400px";
        characterDiv.style.width = "400px";
        characterDiv.style.bottom = "0px";
        characterDiv.style.left = "50px";
        characterDiv.style.backgroundSize = "80% 80%";
        characterDiv.style.backgroundRepeat = "no-repeat";
        characterDiv.style.backgroundPosition = "50% 100%";
        characterDiv.style.backgroundImage = `url("${await fight.teams[0].characters[0].getImage("back")}")`;
        div.appendChild(characterDiv);

        var chat = new UiChat();
        if (fight.teams[1].characters[0].name !== null) {
            let characterDiv = document.createElement("div");
            characterDiv.style.position = "absolute";
            characterDiv.style.height = "400px";
            characterDiv.style.width = "400px";
            characterDiv.style.top = "150px";
            characterDiv.style.left = "1300px";
            characterDiv.style.backgroundSize = "80% 80%";
            characterDiv.style.backgroundRepeat = "no-repeat";
            characterDiv.style.backgroundPosition = "50% 100%";
            characterDiv.style.backgroundImage = `url("${await fight.teams[1].characters[0].getImage("front")}")`;
            div.appendChild(characterDiv);

            userInterface.divInterface.appendChild(chat.createDiv(`Un combat est lancé.`));
            await chat.response;
            
            setTimeout(async () => {
                for (let index = 1; index < 130; index++) {
                    characterDiv.style.left = `${characterDiv.offsetLeft+7}px`;
                    await new Promise(r => setTimeout(r, 10));
                }
            }, 0)

            let pokemonDiv = document.createElement("div");
            pokemonDiv.style.position = "absolute";
            pokemonDiv.style.height = "400px";
            pokemonDiv.style.width = "400px";
            pokemonDiv.style.top = "200px";
            pokemonDiv.style.left = "1100px";
            pokemonDiv.style.backgroundSize = "0% 0%";
            pokemonDiv.style.backgroundRepeat = "no-repeat";
            pokemonDiv.style.backgroundPosition = "50% 100%";
            pokemonDiv.style.backgroundImage = `url("${await fight.teams[1].pokemons[0].getImage("front")}")`;
            div.appendChild(pokemonDiv);

            setTimeout(async () => {
                for (let index = 0; index < 50; index++) {
                    pokemonDiv.style.backgroundSize = `${index}% ${index}%`;
                    await new Promise(r => setTimeout(r, 10));
                }
            }, 0)

            fight.teams[1].pokemons[0].playSound()
            userInterface.divInterface.appendChild(chat.createDiv(`${fight.teams[1].pokemons[0].nickname} est envoyé par ${fight.teams[1].characters[0].name}!`));
            await chat.response;
        } else {
            let pokemonDiv = document.createElement("div");
            pokemonDiv.style.position = "absolute";
            pokemonDiv.style.height = "400px";
            pokemonDiv.style.width = "400px";
            pokemonDiv.style.top = "200px";
            pokemonDiv.style.left = "-400px";
            pokemonDiv.style.backgroundSize = "50% 50%";
            pokemonDiv.style.backgroundRepeat = "no-repeat";
            pokemonDiv.style.backgroundPosition = "50% 100%";
            pokemonDiv.style.backgroundImage = `url("${await fight.teams[1].pokemons[0].getImage("front")}")`;
            div.appendChild(pokemonDiv);

            setTimeout(async () => {
                for (let index = 1; index < 151; index++) {
                    pokemonDiv.style.left = `${pokemonDiv.offsetLeft+10}px`;
                    await new Promise(r => setTimeout(r, 7));
                }
            }, 0)

            fight.teams[1].pokemons[0].playSound()
            userInterface.divInterface.appendChild(chat.createDiv(`Un ${fight.teams[1].pokemons[0].nickname} sauvage apparaît!`));
            await chat.response;
        }

        setTimeout(async () => {
            for (let index = 1; index < 60; index++) {
                characterDiv.style.left = `${characterDiv.offsetLeft-7}px`;
                await new Promise(r => setTimeout(r, 10));
            }
        }, 0)

        let pokemonDiv = document.createElement("div");
        pokemonDiv.style.position = "absolute";
        pokemonDiv.style.height = "400px";
        pokemonDiv.style.width = "400px";
        pokemonDiv.style.top = "475px";
        pokemonDiv.style.left = "400px";
        pokemonDiv.style.backgroundSize = "0% 0%";
        pokemonDiv.style.backgroundRepeat = "no-repeat";
        pokemonDiv.style.backgroundPosition = "50% 100%";
        pokemonDiv.style.backgroundImage = `url("${await fight.teams[0].pokemons[0].getImage("back")}")`;
        div.appendChild(pokemonDiv);

        setTimeout(async () => {
            for (let index = 0; index < 50; index++) {
                pokemonDiv.style.backgroundSize = `${index}% ${index}%`;
                await new Promise(r => setTimeout(r, 10));
            }
        }, 0)
        
        fight.teams[0].pokemons[0].playSound()
        userInterface.divInterface.appendChild(chat.createDiv(`Go! ${fight.teams[0].pokemons[0].nickname}!`));
        await chat.response;

        chat.destructor();
        div.remove();
    }
}