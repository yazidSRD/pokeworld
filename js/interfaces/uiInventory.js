class UiInventory{

    #divUiInventroty;
    #nItem;

    #response;
    get response() {
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (!this.#divUiInventroty.parentNode) {
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
        }
    }

    destructor () {
        this.#divUiInventroty.remove()
    }

    createDiv() {
        this.#divUiInventroty = document.createElement("div");
        this.#divUiInventroty.setAttribute("id", "uiInventory-divMenu");
        
        this.#nItem = 0;
        this.refreshAll();
        return this.#divUiInventroty;
    }

    refreshAll() {
        try {
            this.#divUiInventroty.children[1].remove();
            this.#divUiInventroty.children[0].remove();
        } catch {}

        var divLeft = document.createElement("div");
        
        var divInfoPlusButton = document.createElement("div");

        var div = document.createElement("div");
        div.style.backgroundImage = `url(textures/ui/uiInventory/close.png)`;
        div.addEventListener("click", () => {
            if (!this.request.uiInventory_close) userInterface.close();
            else {
                var rep = {};
                rep.uiInventory_close = this.request.uiInventory_close;
                this.#response = rep;
            }
        });
        divInfoPlusButton.appendChild(div);
        
        div = document.createElement("div");
        div.innerHTML = `Inventory&nbsp&nbsp${player.inventory.count}/${player.inventory.max}`;
        divInfoPlusButton.appendChild(div);

        divLeft.appendChild(divInfoPlusButton);
        
        var divItems = document.createElement("div");

        for (let i = 0; i < player.inventory.items.length; i++) {
            var divItem = document.createElement("div");
            divItem.setAttribute("class", "uiInventory-item");
            divItem.addEventListener("click", () => {
                this.moreInfo(i);
            });
            divItem.style.backgroundImage = `url(textures/items/${player.inventory.items[i].id}/0.png)`;

            var divNItem = document.createElement("div");
            divNItem.innerHTML = player.inventory.items[i].count;

            divItem.appendChild(divNItem);
            divItems.appendChild(divItem);
        }

        divLeft.appendChild(divItems);

        this.#divUiInventroty.appendChild(divLeft);

        this.moreInfo(this.#nItem);
    }

    moreInfo(i) {
        try {
            this.#divUiInventroty.children[1].remove();
        } catch {}

        this.#nItem = i;
        if (!player.getItem(this.#nItem)) {
            if (player.inventory.items.length == 0) return;
            this.#nItem = 0;
        };

        var item = player.getItem(this.#nItem);

        var request = {};
        if ((this.request.uiInventory_use || !this.waiting) && !this.request.uiItem_inInfoBase) {
            if (item.action) {
                request.uiItem_inInfoBase = ["use"];
            }
        } else request = this.request;

        this.uiItem = new UiItem(item, request);

        var div = this.uiItem.createDiv()
        div.style.position = "relative";
        this.#divUiInventroty.appendChild(div)
        this.#awaitReponse();
    }

    async #awaitReponse() {
        const response = await this.uiItem.response;
        if (!response) return;
        if (this.waiting) {
            switch (Object.keys(response)[0]) {
                case "uiItem_inInfoBase":
                    var rep = {};
                    if (this.request.uiInventory_use) {
                        rep["uiItem_inInfoBase"] = [this.request.uiInventory_use, this.#nItem];
                    } else rep["uiItem_inInfoBase"] = [response.uiItem_inInfoBase, this.#nItem];
                    this.#response = rep;
                    return;
            }
            this.#response = response;
        } else {
            switch (Object.keys(response)[0]) {
                case "uiItem_inInfoBase":
                    this.useItem();
                    break;
            }
            this.refreshAll();
        }
    }

    async useItem() {
        if (!player.getItem(this.#nItem)) return;
        var item = player.getItem(this.#nItem);

        this.#divUiInventroty.style.visibility = "hidden";
        this.#divUiInventroty.style.position = "absolute";
        
        if (!item.iCanUse()) {
            msgAlert("Impossible d'utiliser l'objet.");
            this.#divUiInventroty.style.visibility = "visible";
            this.#divUiInventroty.style.position = "relative";
            return;
        }

        if (await item.execute()) {
            msgAlert("L'objet a été utilisé.");
            player.removeItem(this.#nItem);
        } else {
            msgAlert("L'objet n'a pas été utilisé.");
        }
        
        this.#divUiInventroty.style.visibility = "visible";
        this.#divUiInventroty.style.position = "relative";
        this.refreshAll();
    }
}