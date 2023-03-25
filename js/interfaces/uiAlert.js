class UiAlert{

    #divUiAlert;

    constructor(msg, lvl) {
        this.#divUiAlert = document.createElement("div");
        this.#divUiAlert.setAttribute("class", "uiAlert notDelete");
        
        this.#divUiAlert.innerHTML = `<div><div></div></div>`;
        
        userInterface.divInterface.appendChild(this.#divUiAlert);
        
        setTimeout(async () => {
            for (var c of msg) {
                this.#divUiAlert.children[0].children[0].innerHTML += c;
                await new Promise(resolve => setTimeout(resolve, 10));
            }
            
            this.destructor();
        }, 0);
    }

    async destructor() {
        await new Promise(r => setTimeout(r, 2000));
        for (let y = 0; y < 60; y++) {
            this.#divUiAlert.style.top = -y+"px";
            await new Promise(resolve => setTimeout(resolve, 10));
        }
        this.#divUiAlert.remove()
    }

}