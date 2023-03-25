class UiPokemons{

    #divUiPokemons;
    #nPokemon;

    #response;
    get response() {
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (!this.#divUiPokemons.parentNode) {
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

    constructor(request) {
        if (request) {
            this.waiting = true;
            this.request = request
        } else {
            this.request = {};
            //this.request.uiPokemon_close = "close";
            this.request.uiPokemon_inInfoBase = ["↑","↓"];
            this.request.uiPokemon_infoItem = ["donner","prendre"];
            this.request.uiPokemon_moreInfoMove = ["↑","↓"];
        }
    }

    destructor () {
        this.#divUiPokemons.remove()
    }

    createDiv() {
        
        this.#divUiPokemons = document.createElement("div");
        this.#divUiPokemons.setAttribute("id", "uiPokemons-MenuPokemons");

        var divLeft = document.createElement("div");
        this.#divUiPokemons.appendChild(divLeft);

        var divClose = document.createElement("div");
        divClose.style.backgroundImage = `url(textures/ui/uiPokemons/close.png)`;
        divClose.addEventListener("click", () => {
            if (!this.request.uiPokemons_close) userInterface.close();
            else {
                var rep = {};
                rep.uiPokemons_close = this.request.uiPokemons_close;
                this.#response = rep;
            }
        });
        divLeft.appendChild(divClose);

        var divPokemons = document.createElement("div");
        divLeft.appendChild(divPokemons);

        player.pokemons.pokemons.forEach((pokemon, i) => {
            pokemon = player.getPokemon(i);
            var divPokemon = document.createElement("div");
            divPokemon.addEventListener("click", () => {
                this.moreInfo(i);
            })
            let imgPokemon = document.createElement("div");
            pokemon.getIcon().then((url) => {
                imgPokemon.style.backgroundImage = `url(${url})`;
            });
            divPokemon.appendChild(imgPokemon);

            // var divName = document.createElement("div");
            // divName.innerHTML = pokemon.nickname
            // divPokemon.appendChild(divName);

            // var divHp = document.createElement("div");
            // divHp.innerHTML = "HP : " + pokemon.life + " / " + Math.floor(((pokemon.stats.hp.iv+(2*listOfpokemons[pokemon.id].stats.hp)+(pokemon.stats.hp.ev/4))*pokemon.lvl/100)+pokemon.lvl+10);
            // divPokemon.appendChild(divHp)

            divPokemons.appendChild(divPokemon);
        });
        
        var divPokemonInfo = document.createElement("div");
        this.#divUiPokemons.appendChild(divPokemonInfo);

        this.moreInfo(0);
        return this.#divUiPokemons;
    }

    refreshAll() {
        try {
            this.#divUiPokemons.children[0].children[1].remove();
            //document.querySelector("#uiPokemons-MenuPokemons > :nth-child(1) > :nth-child(2)").remove();
        } catch {}

        var divPokemons = document.createElement("div");

        player.pokemons.pokemons.forEach((pokemon, i) => {
            pokemon = player.getPokemon(i);
            var divPokemon = document.createElement("div");
            divPokemon.setAttribute("onClick", `userInterface.ui.moreInfo(${i});`);
            
            let imgPokemon = document.createElement("div");
            pokemon.getIcon().then((url) => {
                imgPokemon.style.backgroundImage = `url(${url})`;
            });
            divPokemon.appendChild(imgPokemon);

            // var divName = document.createElement("div");
            // divName.innerHTML = pokemon.nickname
            // divPokemon.appendChild(divName);

            // var divHp = document.createElement("div");
            // divHp.innerHTML = "HP : " + pokemon.life + " / " + Math.floor(((pokemon.stats.hp.iv+(2*listOfpokemons[pokemon.id].stats.hp)+(pokemon.stats.hp.ev/4))*pokemon.lvl/100)+pokemon.lvl+10);
            // divPokemon.appendChild(divHp)

            divPokemons.appendChild(divPokemon);
        });

        //document.querySelector("#uiPokemons-MenuPokemons > :nth-child(1)").appendChild(divPokemons);
        this.#divUiPokemons.children[0].appendChild(divPokemons);
        this.moreInfo(this.#nPokemon)
    }

    moreInfo(i) {
        //document.querySelectorAll("#uiPokemons-MenuPokemons > :nth-child(1) > :nth-child(2) > *")
        Array.prototype.slice.call(this.#divUiPokemons.children[0].children[1].children).forEach((element, index) => {
            if (index == i) {
                element.setAttribute("onClick", null);
                element.children[0].setAttribute("id", "uiPokemons-MenuPokemons-Selected");
            } else {
                element.setAttribute("onClick", `userInterface.ui.moreInfo(${index});`);
                element.children[0].setAttribute("id", null);
            }
        });

        if (!player.getPokemon(i)) return;
        this.#nPokemon = i;
        var pokemon = player.getPokemon(i);
        try {
            //document.querySelector("#uiPokemons-MenuPokemons > :nth-child(2) > :nth-child(1)").remove();
            this.#divUiPokemons.children[1].children[0].remove();
        } catch {}

        if (this.request.uiPokemons_test) {
            if (this.request.uiPokemons_test(pokemon)) this.uiPokemon = new UiPokemon(pokemon, this.request);
            else this.uiPokemon = new UiPokemon(pokemon);
        } else {
            this.uiPokemon = new UiPokemon(pokemon, this.request);
        }

        //document.querySelector("#uiPokemons-MenuPokemons > :nth-child(2)").appendChild(this.uiPokemon.createDiv())
        var div = this.uiPokemon.createDiv()
        div.style.position = "relative";
        this.#divUiPokemons.children[1].appendChild(div)

        this.#awaitReponse();
    }

    async #awaitReponse() {
        const response = await this.uiPokemon.response;
        if (!response) return;
        if (this.waiting) {
            switch (Object.keys(response)[0]) {
                case "uiPokemon_inInfoBase":
                    this.#response = {"uiPokemon_inInfoBase":[response.uiPokemon_inInfoBase, new Pokemon(player.pokemons.pokemons[this.#nPokemon], player)]};
                    return;
            }
            this.#response = response;
        } else {
            switch (Object.keys(response)[0]) {
                case "uiPokemon_inInfoBase":
                    if (response.uiPokemon_inInfoBase == "↓") this.movePokemon(1);
                    else this.movePokemon(-1);
                    break;
                case "uiPokemon_infoItem":
                    if (response.uiPokemon_infoItem == "donner") this.giveItem();
                    else this.takeItem();
                    break;
                case "uiPokemon_moreInfoMove":
                    if (response.uiPokemon_moreInfoMove[0] == "↓") this.movePokemonMove(response.uiPokemon_moreInfoMove[1], 1);
                    else this.movePokemonMove(response.uiPokemon_moreInfoMove[1], -1);
                    break;
                default:
                    break;
            }
            this.refreshAll();
        }
    }

    movePokemon(direction) {
        if (player.pokemons.max == this.#nPokemon + direction || 0 > this.#nPokemon + direction) {
            msgAlert("Imposible de faire ça.");
            return;
        };
        var copyPokemon = player.pokemons.pokemons[this.#nPokemon + direction];
        player.pokemons.pokemons[this.#nPokemon + direction] = player.pokemons.pokemons[this.#nPokemon]
        player.pokemons.pokemons[this.#nPokemon] = copyPokemon;
        this.#nPokemon += direction;
    }

    async giveItem() {
        if (player.pokemons.pokemons[this.#nPokemon].item) {
            msgAlert("Imposible de faire ça.");
            return;
        };

        this.#divUiPokemons.style.visibility = "hidden";
        this.#divUiPokemons.style.position = "absolute";

        var request = {};
        request.uiItem_inInfoBase = ["donner"];
        request.uiInventory_close = "close";
        var ui = new UiInventory(request);
        userInterface.divInterface.appendChild(ui.createDiv());

        var response = await ui.response;
        
        ui.destructor();
        this.#divUiPokemons.style.visibility = "visible";
        this.#divUiPokemons.style.position = "relative";

        switch (Object.keys(response)[0]) {
            case "uiItem_inInfoBase":
                var item = player.removeItem(response.uiItem_inInfoBase[1]);
                player.pokemons.pokemons[this.#nPokemon].item = item;
                msgAlert("L'objet a été donné.");
                this.moreInfo(this.#nPokemon);
                break;
            case "uiInventory_close":
                msgAlert("Aucun objet n'a été donné.");
                break;
        }
    }

    takeItem() {
        if (!player.getPokemon(this.#nPokemon).item.id) {
            msgAlert("Imposible de faire ça.");
            return;
        };
        if (player.giveItem(player.getPokemon(this.#nPokemon).item)) {
            player.pokemons.pokemons[this.#nPokemon].item = null;
            msgAlert("L'objet a été pris.");
        } else {
            msgAlert("Il y a plus de place dans le sac.");
        }
    }

    movePokemonMove(nMove, direction) {
        var pokemon = player.getPokemon(this.#nPokemon);

        if (4 == nMove + direction || 0 > nMove + direction || pokemon.attacks.length == nMove + direction) {
            msgAlert("Imposible de faire ça.");
            return;
        };
        
        var copyMove = pokemon.removeAttack(nMove);
        pokemon.giveAttack(copyMove[0], copyMove[1], nMove + direction);
    }
}