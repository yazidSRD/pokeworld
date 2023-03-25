class UiItem{

    #divUiItem;
    
    #response;
    get response() {
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (!this.#divUiItem.parentNode) {
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

    constructor(item, request) {
        this.item = item;
        if (request) {
            this.request = request; //close, inInfoBase, infoItem, moreInfoMove
        } else this.request = {};
    }

    destructor () {
        this.#divUiItem.remove()
    }

    createDiv() {
        this.#divUiItem = document.createElement("div");
        this.#divUiItem.setAttribute("id", "uiItem-itemInfos");

        var divInfoPlusButton = document.createElement("div");
        divInfoPlusButton.innerHTML = `<div>N°${this.item.id}&nbsp&nbsp${this.item.name}</div>`

        if (this.request.uiItem_close) {
            var divBoutonClose = document.createElement("div");
            divBoutonClose.style.backgroundImage = `url(textures/ui/UiItem/close.png)`;
            divBoutonClose.addEventListener("click", () => {
                var rep = {};
                rep["uiPokemon_close"] = this.request.uiPokemon_close;
                this.#response = rep;
            });
            divInfoPlusButton.appendChild(divBoutonClose);
        }

        this.#divUiItem.appendChild(divInfoPlusButton);

        var divImage = document.createElement("div");
        divImage.innerHTML = `<div style="background-image: url('textures/items/${this.item.id}/0.png');"></div><div>x${this.item.count}</div>`;
        this.#divUiItem.appendChild(divImage);

        var divdescription = document.createElement("div");
        divdescription.innerHTML = this.item.description;
        this.#divUiItem.appendChild(divdescription);

        if (this.request.uiItem_inInfoBase) {
            var divButtons = document.createElement("div");
            divButtons.setAttribute("class", `uiItems-reponseButtons`);

            this.request.uiItem_inInfoBase.forEach(element => {
                var divButton = document.createElement("div");
                divButton.innerHTML = `<div>${element}</div>`;
                divButton.addEventListener("click", () => {
                    var rep = {};
                    rep["uiItem_inInfoBase"] = element;
                    this.#response = rep;
                });
                divButtons.appendChild(divButton);
            });

            this.#divUiItem.appendChild(divButtons);
        }

        return this.#divUiItem;
    }
}