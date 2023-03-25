class Pokemon{
    
    get name() {return listOfpokemons[this.id].name}
    get theme() {return listOfpokemons[this.id].theme}
    get evolution() {return listOfpokemons[this.id].evolution}

    constructor(pokemon, trainer) {
        this.trainer = trainer;
        this.data = pokemon;
        var {id, nickname, sexe, stats, lvl, attacks, life, xp, nature, talent} = structuredClone(pokemon);
        if (id != undefined) this.id = id;
        else this.id = Math.floor(Math.random()*listOfpokemons.length);

        var pokemonData = listOfpokemons[this.id];

        if (nickname) this.nickname = nickname;
        else this.nickname = pokemonData.name;
        
        this.types = pokemonData.types;
        
        if (sexe != undefined) this.sexe = sexe
        else if ((Math.random() * 101).toFixed(1) < pokemonData.sexe) {
            this.sexe = 0; //male
        } else this.sexe = 1; //femelle

        this.stats = {}
        if (!stats) stats = {};
        ["hp","attack","defense","spAttack","spDefense","speed"].forEach(stat => {
            if (stats[stat]) {
                this.stats[stat] = {
                    iv: stats[stat].iv ? stats[stat].iv : Math.floor(Math.random() * 32),
                    ev: stats[stat].ev ? stats[stat].ev : 0
                }
            } else {
                this.stats[stat] = {
                    iv: Math.floor(Math.random() * 32),
                    ev:0
                }
            }
        });

        if (xp != undefined) this.xp = xp;
        else this.xp = 0;

        if (lvl != undefined) this.lvl = lvl;
        else this.lvl = Math.floor(Math.random() * 100)+1;

        if (life === undefined) this.life = this.getLife;
        else this.life = life;

        this.item = new Item(this.data.item, this);

        if (nature != undefined) this.nature = listOfNatures[nature];
        else this.nature = nature;

        if (talent != undefined) this.talent = talent;
        else this.talent = talent;

        if (!attacks) {
            attacks = [];
            for (const nLvl in pokemonData.attacks) {
                if (Number(nLvl) === NaN) continue;
                if (Number(nLvl) > this.lvl) break;
                for (const attaque of pokemonData.attacks[nLvl]) {
                    if (!attacks.find(element => element[0] == attaque)) {
                        attacks.push([attaque, listOfAttacks[attaque].pp]);
                    }
                    if (attacks.length == 4) break;
                }
                if (attacks.length == 4) break;
            }
            this.attacks = [];
            for (const i in attacks) {
                this.attacks.push([attacks[i][0],attacks[i][1]]);
                if (i==3) break;
            }
        } else this.attacks = attacks;

        this.divPokemon;
    }

    get getLife() {
        return Math.floor(((this.stats.hp.iv+(2*listOfpokemons[this.id].stats.hp)+(this.stats.hp.ev/4))*this.lvl/100)+this.lvl+10)
    }

    get getStats() {
        var stats = {};
        var iv = this.getStatsIv;
        var ev = this.getStatsEv;
        var base = this.getStatsBase;
        ["attack","defense","spAttack","spDefense","speed"].forEach(stat => {
            stats[stat] = Math.floor(((iv[stat]+(2*base[stat])+(ev[stat]/4))*this.lvl/100)+5);
        });
        this.nature.bonus.forEach(bonus => {
            stats[bonus[0]] = Math.floor(stats[bonus[0]] * (1+bonus[1]/100));
        });
        this.nature.malus.forEach(malus => {
            stats[malus[0]] = Math.floor(stats[malus[0]] * (1-malus[1]/100));
        });
        stats.hp = this.getLife;
        return stats;
    }
    
    get getStatsIv() {
        var stats = {}
        for (const stat in this.stats) {
            stats[stat] = this.stats[stat].iv;
        }
        return stats;
    }

    get getStatsEv() {
        var stats = {}
        for (const stat in this.stats) {
            stats[stat] = this.stats[stat].ev;
        }
        return stats;
    }

    get getStatsBase() {
        return listOfpokemons[this.id].stats;
    }

    get getAttacks() {
        var attacks = [];
        for (let index = 0; index < this.attacks.length; index++) {
            var attack = new Attack(this.data.attacks[index], this);
            attacks.push(attack);
        }
        return attacks;
    }

    giveAttack(id, pp, position = this.attacks.length) {
        if (this.attacks.length == 4) return false;
        if (!listOfAttacks[id]) return false;
        if (pp === undefined) pp = listOfAttacks[id].pp;
        this.attacks.splice(position, 0, [id, pp]);
        this.save();
        return true;
    }

    removeAttack(i) {
        if (!this.attacks[i]) return false;
        var attack = this.attacks.splice(i, 1)[0];
        this.save();
        return attack;
    }

    get xpMax() {
        return Math.floor(0.8*(Math.pow(this.lvl, 3)));
    }

    editLife(points) {
        this.life += points;
        if (this.life < 0) this.life = 0;
        if (this.life > this.getLife) this.life = this.getLife;
        this.save();
        if (this.divPokemon && this.life === 0) {
            this.playSound();
            setTimeout(async () => {
                for (let index = 50; index > -1; index--) {
                    this.divPokemon.children[1].style.backgroundSize = `${index}% ${index}%`;
                    await new Promise(r => setTimeout(r, 10));
                }
            }, 0)
        }
    }

    // async attack(nAttack, pokemon) {
    //     var attack = new Attack(this.attacks[nAttack][0]);
    //     this.attacks[nAttack][1]--;
    //     await chat.read(`${this.nickname} utilise ${attack.name}!`);
    //     await attack.execute(this, pokemon);
    //     //Math.floor(Math.floor(this.lvl * 2) / 5)
    //     //https://www.pokebip.com/page/jeuxvideo/guide_tactique_strategie_pokemon/formules_mathematiques#attattsp%C3%A9

    //     //Puissance = HH × BP × IT × CHG × MS × WS × UA × FA
    //     //var Puissance = 1 * attack.powerful
    //     //var demage = (((((((this.lvl * 2 / 5) + 2) * puissance * Att[Spé] / 50) / Def[Spé]) * Mod1) + 2) * CC * Mod2 * R / 100) * STAB * Type1 * Type2 * Mod3

    //     //pokemon.editLife(-5);
    // }

    async earnXp(xp) {
        this.xp += xp;

        if (this.xpMax <= this.xp) {
            while (this.xpMax <= this.xp) {
                this.xp = this.xp - this.xpMax;
                this.lvl++;
            }
            if (this.trainer.player) {
                const audio = new Audio('sounds/jingles/LevelUp.mp3');
                audio.play();
                msgAlert(`${this.nickname} monte au niveau ${this.lvl}!`);
                if (this.evolution && this.evolution[0] <= this.lvl) {
                    setTimeout(async () => {
                        while (this.trainer.etat != "static") await new Promise(r => setTimeout(r, 100));
                        this.trainer.etat = "inMenu";
                        userInterface.open(UiChat);
                        userInterface.divInterface.appendChild(userInterface.ui.createDiv(`${this.nickname} veut évoluer!\nVeux-tu l'empêcher?`, null, {uiChat_responses:["non", "oui"]}));

                        if ((await userInterface.ui.response).uiChat_responses == "non") {
                            let oPokemon = new Pokemon(structuredClone(this.data), this.trainer);
                            this.id = this.evolution[1];
                            this.save();
                            
                            userInterface.open(UiEvolution);
                            userInterface.divInterface.appendChild(userInterface.ui.createDiv(oPokemon, this));
                            await userInterface.ui.response;

                            userInterface.close();
                        } else {
                            userInterface.close();
                        }
                    })
                }
            }
        }
        
        
        this.save();
    }

    save() {
        this.data.id = this.id;
        this.data.life = this.life;
        this.data.attacks = this.attacks;
        this.data.xp = this.xp;
        this.data.lvl = this.lvl;
        this.data.stats = this.stats;
    }

    reload() {
        this.id = this.data.id;
        this.life = this.data.life;
        this.attacks = this.data.attacks;
        this.xp = this.data.xp;
        this.lvl = this.data.lvl;
        this.stats = this.data.stats;
    }

    async getImage(direction) {
        let url = `textures/pokemons/${this.id}/fight/${direction}/0_sexe${+this.sexe}.gif`;
        try {
            await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve();
                img.onerror = () => {
                    url = `textures/pokemons/${this.id}/fight/${direction}/0.gif`;
                    const img2 = new Image();
                    img2.onload = () => resolve();
                    img2.onerror = async () => {
                        url = await this.getIcon();
                        resolve();
                    };
                    img2.src = url;
                }
                img.src = url;
            });
            return url;
        } catch (error) {
            console.error(error);
            return await this.getIcon();
        }
    }

    async getIcon() {
        let url = `textures/pokemons/${this.id}/0_sexe${+this.sexe}.png`;
        try {
            await new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(url);
                img.onerror = () => {
                    url = `textures/pokemons/${this.id}/0.png`;
                    const img2 = new Image();
                    img2.onload = () => resolve(url);
                    img2.onerror = () => {
                        url = "";
                    };
                    img2.src = url;
                }
                img.src = url;
            });
            return url;
        } catch (error) {
            console.error(error);
            return '';
        }
    }

    playSound() {
        const audio = new Audio(`sounds/pokemons/${this.id}/sound.mp3`);
        audio.play();
    }
}