class uiPokeRegeneration {
    #divUiPokeRegeneration;
    
    #response;
    get response() {
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (!this.#divUiPokeRegeneration.parentNode) {
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

    constructor() {}

    destructor() {
        try {
            this.#divUiPokeRegeneration.remove()
        } catch {}
    }

    createDiv(pokemons, pokemonsInMachine) {
        if (!pokemons || !pokemonsInMachine) return;
        this.#response = null;
        this.#divUiPokeRegeneration = document.createElement("div");
        this.#divUiPokeRegeneration.setAttribute("id", "uiPokeRegeneration");

        var divMenu = document.createElement("div");
        
        var divClose = document.createElement("div");
        divClose.style.backgroundImage = `url(textures/ui/uiPokemons/close.png)`;
        divClose.addEventListener("click", () => {
            var rep = {};
            rep.uiPokeRegeneration_close = true;
            this.#response = rep;
        });
        divMenu.appendChild(divClose);

        this.#divUiPokeRegeneration.appendChild(divMenu);
        
        var divPokemons = document.createElement("div");
        divPokemons.setAttribute("class", "uiPokeRegeneration-pokemons");

        for (const i in pokemons) {
            var pokemon = new Pokemon(pokemons[i]);
            var divPokemon = document.createElement("div");
            let imgPokemon = document.createElement("div");
            
            pokemon.getIcon().then((url) => {
                imgPokemon.style.backgroundImage = `url(${url})`;
            });
            divPokemon.appendChild(imgPokemon);

            var divName = document.createElement("div");
            divName.innerHTML = pokemon.nickname
            divPokemon.appendChild(divName);

            var divHp = document.createElement("div");
            divHp.innerHTML = `HP : ${pokemon.life*100/pokemon.getLife}%`; 
            divPokemon.appendChild(divHp)

            var pp = 0;
            var ppMax = 0;

            pokemon.getAttacks.forEach(attack => {
                pp += attack.pp;
                ppMax += attack.ppMax;
            });

            var divPp = document.createElement("div");
            divPp.innerHTML = `PP : ${pp}/${ppMax}`; 
            divPokemon.appendChild(divPp)

            var divMoreInfo = document.createElement("div");
            divMoreInfo.innerHTML = "<div>plus d'info</div>"; 
            divMoreInfo.addEventListener("click", () => {
                var rep = {};
                rep.uiPokeRegeneration_pokemons = ["moreInfo",i];
                this.#response = rep;
            });
            divPokemon.appendChild(divMoreInfo)

            var divDeplacer = document.createElement("div");
            divDeplacer.innerHTML = "<div>déposer</div>";
            divDeplacer.addEventListener("click", () => {
                var rep = {};
                rep.uiPokeRegeneration_pokemons = ["depose",i];
                this.#response = rep;
            });
            divPokemon.appendChild(divDeplacer)

            divPokemons.appendChild(divPokemon);
        }

        this.#divUiPokeRegeneration.appendChild(divPokemons);

        var divPokemonsInMachine = document.createElement("div");
        divPokemonsInMachine.setAttribute("class", "uiPokeRegeneration-pokemons");

        for (let i = 0; i < pokemonsInMachine.max; i++) {
            var divPokemon = document.createElement("div");
            if (pokemonsInMachine.pokemons[i]) {
                var pokemon = new Pokemon(pokemonsInMachine.pokemons[i][0]);
                
                let imgPokemon = document.createElement("div");
                pokemon.getIcon().then((url) => {
                    imgPokemon.style.backgroundImage = `url(${url})`;
                });
                divPokemon.appendChild(imgPokemon);

                var divName = document.createElement("div");
                divName.innerHTML = pokemon.nickname
                divPokemon.appendChild(divName);

                var divHp = document.createElement("div");
                divHp.innerHTML = `HP : ${Math.floor(pokemon.life*100/pokemon.getLife)}%`; 
                divPokemon.appendChild(divHp)

                var pp = 0;
                var ppMax = 0;

                pokemon.getAttacks.forEach(attack => {
                    pp += attack.pp;
                    ppMax += attack.ppMax;
                });

                var divPp = document.createElement("div");
                divPp.innerHTML = `PP : ${pp}/${ppMax}`; 
                divPokemon.appendChild(divPp)

                var divMoreInfo = document.createElement("div");
                divMoreInfo.innerHTML = "<div>plus d'info</div>"; 
                divMoreInfo.addEventListener("click", () => {
                    var rep = {};
                    rep.uiPokeRegeneration_pokemonsInMachine = ["moreInfo",i];
                    this.#response = rep;
                });
                divPokemon.appendChild(divMoreInfo)

                var divDeplacer = document.createElement("div");
                divDeplacer.innerHTML = "<div>prendre</div>";
                divDeplacer.addEventListener("click", () => {
                    var rep = {};
                    rep.uiPokeRegeneration_pokemonsInMachine = ["depose",i];
                    this.#response = rep;
                });
                divPokemon.appendChild(divDeplacer)
            }
            divPokemonsInMachine.appendChild(divPokemon);
        }

        this.#divUiPokeRegeneration.appendChild(divPokemonsInMachine);

        return this.#divUiPokeRegeneration;
    }
}