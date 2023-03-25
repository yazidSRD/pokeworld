class UiPokemon{

    #divUiPokemon;
    
    #response;
    get response() {
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (!this.#divUiPokemon.parentNode) {
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

    constructor(pokemon, request) {
        this.pokemon = pokemon;
        if (request) {
            this.request = request; //close, inInfoBase, infoItem, moreInfoMove
        } else this.request = {};
    }

    destructor () {
        this.#divUiPokemon.remove()
    }

    createDiv() {
        this.#divUiPokemon = document.createElement("div");
        this.#divUiPokemon.setAttribute("id", "uiPokemon-pokemonInfos");

        var divInfoPlusButton = document.createElement("div");
        divInfoPlusButton.innerHTML = `<div>N°${this.pokemon.id}&nbsp&nbsp${this.pokemon.name}</div><div style="background-image: url('textures/ui/uiPokemon/${["male","female"][this.pokemon.sexe]}.png');"></div>`
        
        
        var divMenuInfo = document.createElement("div");

        var divBoutonInfo = document.createElement("div");
        divBoutonInfo.style.backgroundImage = `url(textures/ui/uiPokemon/info.png)`;
        divBoutonInfo.addEventListener("click", () => {
            this.infoBase();
        });
        divMenuInfo.appendChild(divBoutonInfo);
        
        divBoutonInfo = document.createElement("div");
        divBoutonInfo.style.backgroundImage = `url(textures/ui/uiPokemon/stats.png)`;
        divBoutonInfo.addEventListener("click", () => {
            this.infoStats();
        });
        divMenuInfo.appendChild(divBoutonInfo);

        divBoutonInfo = document.createElement("div");
        divBoutonInfo.style.backgroundImage = `url(textures/ui/uiPokemon/ev.png)`;
        divBoutonInfo.addEventListener("click", () => {
            this.infoEv();
        });
        divMenuInfo.appendChild(divBoutonInfo);

        divBoutonInfo = document.createElement("div");
        divBoutonInfo.style.backgroundImage = `url(textures/ui/uiPokemon/iv.png)`;
        divBoutonInfo.addEventListener("click", () => {
            this.infoIv();
        });
        divMenuInfo.appendChild(divBoutonInfo);

        divBoutonInfo = document.createElement("div");
        divBoutonInfo.style.backgroundImage = `url(textures/ui/uiPokemon/moves.png)`;
        divBoutonInfo.addEventListener("click", () => {
            this.infoMoves();
        });
        divMenuInfo.appendChild(divBoutonInfo);
        divInfoPlusButton.appendChild(divMenuInfo);
        
        if (this.request.uiPokemon_close) {
            divBoutonInfo = document.createElement("div");
            divBoutonInfo.style.backgroundImage = `url(textures/ui/uiPokemon/close.png)`;
            divBoutonInfo.addEventListener("click", () => {
                var rep = {};
                rep["uiPokemon_close"] = this.request.uiPokemon_close;
                this.#response = rep;
            });
            divInfoPlusButton.appendChild(divBoutonInfo);
        }
        
        this.#divUiPokemon.appendChild(divInfoPlusButton);


        var divImage = document.createElement("div");
        divImage.style.backgroundImage = `url(textures/ui/uiPokemon/themes/${this.pokemon.theme}.png)`;
        this.pokemon.getImage("front").then((url) => {
            divImage.innerHTML = `<div style="background-image: url(${url});"></div>`;
        });
        divImage.addEventListener("click", () => {
            this.pokemon.playSound();
        });
        this.#divUiPokemon.appendChild(divImage);
        
        this.infoBase();
        return this.#divUiPokemon;
    }

    divStat(stat, value, action) {
        var divStat = document.createElement("div");
        divStat.setAttribute("class", `uiPokemon-stats`);

        var divNameStat = document.createElement("div");
        divNameStat.innerHTML = "- "+stat;
        divStat.appendChild(divNameStat);
        
        var divRectangle = document.createElement("div");
        if (action) {
            divRectangle.addEventListener("click", action);
            divRectangle.style.cursor = `pointer`;
        }

        var divStatValue = document.createElement("div");
        divStatValue.innerHTML = value;
        divRectangle.appendChild(divStatValue);

        divStat.appendChild(divRectangle);

        return divStat;
    }

    divStatWithBar(stat, value, percent) {
        var divStat = document.createElement("div");
        divStat.setAttribute("class", `uiPokemon-statsWithBar`);

        var divNameStat = document.createElement("div");
        divNameStat.innerHTML = "- "+stat;
        divStat.appendChild(divNameStat);
        
        var divRectangle = document.createElement("div");
        
        var divStatValue = document.createElement("div");
        divStatValue.innerHTML = value;
        divRectangle.appendChild(divStatValue);

        divStat.appendChild(divRectangle);

        var divStatBar = document.createElement("div");
        divStatBar.innerHTML = `<div style="width: ${percent*330}px;"></div>`;
        divStat.appendChild(divStatBar);

        return divStat;
    }

    divInfoMove(i) {
        var attack = this.pokemon.getAttacks[i];

        var divMove = document.createElement("div");
        divMove.style.cursor = `pointer`;
        divMove.addEventListener("click", () => {
            this.moreInfoMove(i);
        });
        divMove.setAttribute("class", `uiPokemon-infoMoves`);

        var divName = document.createElement("div");
        divName.innerHTML = attack.name;
        divMove.appendChild(divName);

        var divPP = document.createElement("div");
        divPP.innerHTML = `PP: ${attack.pp}/${attack.ppMax}`;
        divMove.appendChild(divPP);

        return divMove;
    }

    divReponseButtons(reponse, reponses, args) {
        var divButtons = document.createElement("div");
        divButtons.setAttribute("class", `uiPokemon-reponseButtons`);

        reponses.forEach(element => {
            var divButton = document.createElement("div");
            divButton.innerHTML = `<div>${element}</div>`;
            divButton.addEventListener("click", () => {
                var rep = {};
                if (!args) rep[reponse] = element;
                else {
                    args.unshift(element);
                    rep[reponse] = args;
                }
                this.#response = rep;
            });
            divButtons.appendChild(divButton);
        });

        return divButtons;
    }

    infoBase() {
        try {
            this.#divUiPokemon.children[2].remove();
        } catch {}
        
        var divPokemonInfo = document.createElement("div");
        
        divPokemonInfo.appendChild(this.divStat("Surnom", this.pokemon.nickname));
        divPokemonInfo.appendChild(this.divStat("LVL", this.pokemon.lvl));
        divPokemonInfo.appendChild(this.divStatWithBar("Xp to next lvl", this.pokemon.xpMax-this.pokemon.xp, this.pokemon.xp/this.pokemon.xpMax));
        divPokemonInfo.appendChild(this.divStat("Types", this.pokemon.types.join("/")));
        divPokemonInfo.appendChild(this.divStat("Nature", this.pokemon.nature.name, () => {
            this.infoNature();
        }));
        divPokemonInfo.appendChild(this.divStat("Talent", this.pokemon.talent, () => {
            this.infoTalent();
        }));
        if (this.pokemon.item) {
            divPokemonInfo.appendChild(this.divStat("Objet tenu", this.pokemon.item.name, () => {
                this.infoItem();
            }));
        } else {
            divPokemonInfo.appendChild(this.divStat("Objet tenu", "", () => {
                this.infoItem();
            }));
        }

        if (this.request.uiPokemon_inInfoBase) {
            divPokemonInfo.appendChild(this.divReponseButtons("uiPokemon_inInfoBase", this.request.uiPokemon_inInfoBase));
        }

        this.#divUiPokemon.appendChild(divPokemonInfo);
    }
    
    infoStats() {
        try {
            this.#divUiPokemon.children[2].remove();
        } catch {}

        var divPokemonInfo = document.createElement("div");
        var stats = this.pokemon.getStats;
        
        divPokemonInfo.appendChild(this.divStatWithBar("PV", this.pokemon.life+"/"+stats.hp, this.pokemon.life/stats.hp));
        divPokemonInfo.appendChild(this.divStat("Attaque", stats.attack));
        divPokemonInfo.appendChild(this.divStat("Défense", stats.defense));
        divPokemonInfo.appendChild(this.divStat("Att. spé", stats.spAttack));
        divPokemonInfo.appendChild(this.divStat("Déf. spé", stats.spDefense));
        divPokemonInfo.appendChild(this.divStat("Vitesse", stats.speed));

        document.getElementById("uiPokemon-pokemonInfos").appendChild(divPokemonInfo);

    }

    infoEv() {
        try {
            this.#divUiPokemon.children[2].remove();
        } catch {}

        var divPokemonInfo = document.createElement("div");
        var stats = this.pokemon.getStatsEv;
        
        divPokemonInfo.appendChild(this.divStat("EV PV", stats.hp));
        divPokemonInfo.appendChild(this.divStat("EV Attaque", stats.attack));
        divPokemonInfo.appendChild(this.divStat("EV Défense", stats.defense));
        divPokemonInfo.appendChild(this.divStat("EV Att. spé", stats.spAttack));
        divPokemonInfo.appendChild(this.divStat("EV Déf. spé", stats.spDefense));
        divPokemonInfo.appendChild(this.divStat("EV Vitesse", stats.speed));
        divPokemonInfo.appendChild(this.divStat("Total", `${stats.hp+stats.attack+stats.defense+stats.spAttack+stats.spDefense+stats.speed}/510`));

        document.getElementById("uiPokemon-pokemonInfos").appendChild(divPokemonInfo);

    }

    infoIv() {
        try {
            this.#divUiPokemon.children[2].remove();
        } catch {}

        var divPokemonInfo = document.createElement("div");
        var stats = this.pokemon.getStatsIv;
        
        divPokemonInfo.appendChild(this.divStat("IV PV", stats.hp));
        divPokemonInfo.appendChild(this.divStat("IV Attaque", stats.attack));
        divPokemonInfo.appendChild(this.divStat("IV Défense", stats.defense));
        divPokemonInfo.appendChild(this.divStat("IV Att. spé", stats.spAttack));
        divPokemonInfo.appendChild(this.divStat("IV Déf. spé", stats.spDefense));
        divPokemonInfo.appendChild(this.divStat("IV Vitesse", stats.speed));
        divPokemonInfo.appendChild(this.divStat("Total", `${stats.hp+stats.attack+stats.defense+stats.spAttack+stats.spDefense+stats.speed}/186`));

        document.getElementById("uiPokemon-pokemonInfos").appendChild(divPokemonInfo);

    }

    infoMoves() {
        try {
            this.#divUiPokemon.children[2].remove();
        } catch {}

        var divPokemonInfo = document.createElement("div");
        
        for (let index = 0; index < this.pokemon.attacks.length; index++) {
            divPokemonInfo.appendChild(this.divInfoMove(index));
        }

        document.getElementById("uiPokemon-pokemonInfos").appendChild(divPokemonInfo);
    }

    moreInfoMove(i) {
        try {
            this.#divUiPokemon.children[2].remove();
        } catch {}
        var divMoveInfo = document.createElement("div");
        var move = this.pokemon.getAttacks[i];
        
        divMoveInfo.appendChild(this.divStat("Nom", move.name));
        divMoveInfo.appendChild(this.divStat("PP", `${move.pp}/${move.ppMax}`));
        divMoveInfo.appendChild(this.divStat("Type", move.type));
        divMoveInfo.appendChild(this.divStat("Catégorie", move.category));
        divMoveInfo.appendChild(this.divStat("Puissance", move.powerful));
        divMoveInfo.appendChild(this.divStat("Précision", move.precision));
        divMoveInfo.appendChild(this.divStat("Priorité", move.priority));
        
        if (this.request.uiPokemon_moreInfoMove) {
            divMoveInfo.appendChild(this.divReponseButtons("uiPokemon_moreInfoMove", this.request.uiPokemon_moreInfoMove, [i]));
        }

        document.getElementById("uiPokemon-pokemonInfos").appendChild(divMoveInfo);
    }

    infoNature() {
        try {
            this.#divUiPokemon.children[2].remove();
        } catch {}
        var divNatureInfo = document.createElement("div");
        var nature = this.pokemon.nature;

        divNatureInfo.appendChild(this.divStat("Nature", nature.name));
        nature.bonus.forEach(bonus => {
            divNatureInfo.appendChild(this.divStat(bonus[0], `+${bonus[1]}%`));
        });
        nature.malus.forEach(malus => {
            divNatureInfo.appendChild(this.divStat(malus[0], `-${malus[1]}%`));
        });
        
        document.getElementById("uiPokemon-pokemonInfos").appendChild(divNatureInfo);
    }

    infoTalent() {
        try {
            this.#divUiPokemon.children[2].remove();
        } catch {}
        var divTalentInfo = document.createElement("div");
        
        document.getElementById("uiPokemon-pokemonInfos").appendChild(divTalentInfo);
    }

    infoItem() {
        try {
            this.#divUiPokemon.children[2].remove();
        } catch {}
        var divItemInfo = document.createElement("div");
        var item = this.pokemon.item;

        
        divItemInfo.appendChild(this.divStat("Nom", item.name));
        divItemInfo.appendChild(this.divStat("Description", item.description));

        if (this.request.uiPokemon_infoItem) {
            divItemInfo.appendChild(this.divReponseButtons("uiPokemon_infoItem", this.request.uiPokemon_infoItem));
        }

        document.getElementById("uiPokemon-pokemonInfos").appendChild(divItemInfo);
    }
}