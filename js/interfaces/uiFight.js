class UiFight{

    divUiFight;

    #response;
    get response() {
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (!this.divUiFight.parentNode) {
                    resolve()
                    return;
                }
                if (this.#response) {
                    resolve(this.#response);
                    return;
                }
            }, 100);
        })
    }

    constructor() {
        //this.teams = [[],[]]
    }

    destructor () {
        this.divUiFight.remove()
    }

    createDiv() {
        this.divUiFight = document.createElement("div");
        this.divUiFight.setAttribute("id", "uiFight");
        this.divUiFight.appendChild(document.createElement("div"));
        this.divUiFight.appendChild(document.createElement("div"));
        this.divUiFight.appendChild(document.createElement("div"));
        this.refresh = false;
        setTimeout(async () => {
            while(true) {
                await new Promise(resolve => setTimeout(resolve, 250));
                if (!this.divUiFight.parentNode) return;
                if (!this.refresh) continue;
                await this.#refresh();
            }
        }, 0) 
        return this.divUiFight;
    }

    async #refresh() {//theme, pokemons1, pokemons2
        this.divUiFight.style.backgroundColor = "#000000";
        this.divUiFight.style.backgroundImage = `url(textures/ui/uiFight/themes/${fight.theme}.jpg)`;

        for (const t in fight.teams) {
            var divPokemons = this.divUiFight.children[Number(t)+1]
            for (const p in fight.teams[t].pokemons) {
                if (fight.teams[t].pokemons[p] && fight.teams[t].pokemons[p].divPokemon) {
                    await this.refreshDivPokemon(fight.teams[t].pokemons[p], t)
                } else if (fight.teams[t].pokemons[p] && !fight.teams[t].pokemons[p].divPokemon) {
                    this.createDivPokemon(fight.teams[t].pokemons[p], t);
                    divPokemons.appendChild(fight.teams[t].pokemons[p].divPokemon);
                    setTimeout(async () => {
                        for (let index = 0; index < 51; index++) {
                            fight.teams[t].pokemons[p].divPokemon.children[1].style.backgroundSize = `${index}% ${index}%`;
                            await new Promise(r => setTimeout(r, 10));
                        }
                    }, 0)
                }
            }
        }
        
        return;
        // for (const t in this.teams) {
        //     var divPokemons = this.divUiFight.children[t]
        //     for (let i = 0; i < 3; i++) {
        //         if (this.teams[t][i] && fight.teams[t].pokemons[i]) {
        //             await this.refreshDivPokemon(this.teams[t][i], fight.teams[t].pokemons[i], t)
        //         } else if (!this.teams[t][i] && fight.teams[t].pokemons[i]) {
        //             this.teams[t][i] = this.createDivPokemon(fight.teams[t].pokemons[i], t);
        //             divPokemons.appendChild(this.teams[t][i]);
        //         } else if (this.teams[t][i] && !fight.teams[t].pokemons[i]) {
        //             this.teams[t][i].remove();
        //             this.teams[t][i] = null;
        //         }
        //     }   
        // }

        return;
        if (!theme) return;
        try {
            this.divUiFight.children[0].remove();
        } catch {}
        this.divUiFight.style.backgroundImage = `url(textures/ui/uiFight/themes/${theme}.jpg)`;

        var div = document.createElement("div");

        [pokemons1, pokemons2].forEach((pokemons, i) => {
            var divPokemons = document.createElement("div");

            var divPokemonsInfo = document.createElement("div");
            divPokemonsInfo.setAttribute("class", "uiFight-pokemonsInfo");
            var divPokemonsImage = document.createElement("div");
            divPokemonsImage.setAttribute("class", "uiFight-pokemonsImages");
            pokemons.forEach(pokemon => {
                var divPokemon = document.createElement("div");
                divPokemon.innerHTML = `<div>${pokemon.name}</div><div>LVL${pokemon.lvl}</div><div><div style="width: ${(pokemon.life/pokemon.getLife)*100}%;"></div></div>`

                divPokemonsInfo.appendChild(divPokemon);
                divPokemonsImage.innerHTML = divPokemonsImage.innerHTML + `<div style="background-image: url('textures/pokemons/${pokemon.id}/fight/${["back","front"][i]}/0.gif');"></div>`;
            
            });
            divPokemons.appendChild(divPokemonsInfo);
            divPokemons.appendChild(divPokemonsImage);
            
            div.appendChild(divPokemons);
        });

        this.divUiFight.appendChild(div);
    }

    createDivPokemon(pokemon, i) {
        var divPokemon = document.createElement("div");
        divPokemon.setAttribute("class", "uiFight-pokemonsInfo");
        divPokemon.innerHTML = `<div><div>${pokemon.name}</div><div>LVL${pokemon.lvl}</div><div><div style="width: ${(pokemon.life/pokemon.getLife)*100}%;"></div><div style="width: ${(pokemon.life/pokemon.getLife)*100}%;"></div></div></div>`
        divPokemon.innerHTML += `<div class="uiFight-${["back","front"][i]}"></div>`;
        pokemon.getImage(["back","front"][i]).then((url) => {
            divPokemon.children[1].style.backgroundImage = `url('${url}')`;
        });
        //divPokemon.innerHTML += `<div class="uiFight-${["back","front"][i]}" style="background-image: url('textures/pokemons/${pokemon.id}/fight/${["back","front"][i]}/0.gif');"></div>`;
        pokemon.divPokemon = divPokemon;
    }

    async refreshDivPokemon(pokemon, i) {
        pokemon.divPokemon.children[0].children[0].innerHTML = pokemon.name;
        pokemon.divPokemon.children[0].children[1].innerHTML = `LVL${pokemon.lvl}`;
        pokemon.getImage(["back","front"][i]).then((url) => {
            pokemon.divPokemon.children[1].style.backgroundImage = `url('${url}')`;
        });
        // pokemon.divPokemon.children[1].style.backgroundImage = `url('textures/pokemons/${pokemon.id}/fight/${["back","front"][i]}/0.gif')`;

        var hp = Math.floor((pokemon.life/pokemon.getLife)*100);
        var actuelHp = Math.floor(Number(pokemon.divPokemon.children[0].children[2].children[1].style.width.replace("%", "")));
        var direction = 0;

        if (actuelHp < hp) direction = 1;
        else if (actuelHp > hp) direction = -1;
        else return;
        
        for (let deltaHp = actuelHp; hp != deltaHp; deltaHp+=direction) {
            pokemon.divPokemon.children[0].children[2].children[1].style.width = `${deltaHp}%`;
            await new Promise(resolve => setTimeout(resolve, 5));
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        if (direction == -1) {
            for (let deltaHp = actuelHp; hp != deltaHp; deltaHp+=direction) {
                pokemon.divPokemon.children[0].children[2].children[0].style.width = `${deltaHp}%`;
                await new Promise(resolve => setTimeout(resolve, 1));
            }
        }

        pokemon.divPokemon.children[0].children[2].children[0].style.width = `${hp}%`;
        pokemon.divPokemon.children[0].children[2].children[1].style.width = `${hp}%`;
    }

    menu(requests) {
        this.#response = undefined;
        if (requests) this.requests = requests;
        else return;
        var divMenu = document.createElement("div");
        this.requests.forEach(request => {
            var divButton = document.createElement("div");
            divButton.innerHTML = `<div>${request}</div>`
            divButton.addEventListener("click", () => {
                this.#response = request;
            });
            
            divMenu.appendChild(divButton);
        });
        this.divUiFight.appendChild(divMenu);
    }

    closeMenu() {
        this.#response = undefined;
        try {
            this.divUiFight.children[3].remove();
        } catch {}
    }

    // open(div) {
    //     this.hideUiAll();
    //     var div2 = document.createElement("div");
    //     div2.appendChild(div);
    //     this.divUiFight.appendChild(div2);
    // }

    // close() {
    //     try {
    //         this.divUiFight.children[1].remove();
    //     } catch {}
    //     this.hideUiAll(false);
    // }

    hideUiAll(hide=true, all) {
        //this.hideUiMenu(hide);
        if (all) {
            this.divUiFight.children[1].style.visibility = "hidden";
            this.divUiFight.children[2].style.visibility = "hidden";
            return;
        } else {
            this.divUiFight.children[1].style.visibility = "visible";
            this.divUiFight.children[2].style.visibility = "visible";
        }
        if (hide) {hide = "hidden"; this.closeMenu()}
        else hide = "visible";
        fight.teams.forEach(team => {
            for (const pokemon of team.pokemons) {
                if (pokemon.divPokemon) pokemon.divPokemon.children[0].style.visibility = hide;
            }
        });
    }
}