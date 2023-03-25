class UserInterface{

    divInterface;
    ui;

    constructor() {
        this.divInterface = document.getElementById("userInterface");
        this.divInterface.innerHTML = "";
        //this.autoRefresh();
        setTimeout(function(){
            userInterface.ui = new UiGame();
        }, 0);
    }
    
    async autoRefresh() {
        var timeRefresh = 5000;
        while (true) {
            if (this.ui && this.ui.timeRefresh && this.ui.refresh) {
                timeRefresh = this.ui.timeRefresh;
                await this.ui.refresh();
            } else timeRefresh = 5000;
            await new Promise(r => setTimeout(r, timeRefresh));
        }
    }

    async refresh() {
        if (this.ui && this.ui.refresh) {
            this.ui.refresh();
        }
    }

    requestUi(ui) {
        if (player.etat != "static" ||  this.event) return;
        player.etat = "inMenu";
        this.open(ui);
    }

    close() {
        for (let index = this.divInterface.children.length; index > -1; index--) {
            if (!this.divInterface.children[index]) continue;
            if ((""+this.divInterface.children[index].getAttribute("class")).includes("notDelete")) continue;
            this.divInterface.children[index].remove();
        }
        player.etat = "static";
        this.ui = new UiGame();
    }

    open(ui) {
        for (let index = this.divInterface.children.length; index > -1; index--) {
            if (!this.divInterface.children[index]) continue;
            if ((""+this.divInterface.children[index].getAttribute("class")).includes("notDelete")) continue;
            this.divInterface.children[index].remove();
        }
        this.ui = new ui();
        try {
            this.divInterface.appendChild(this.ui.createDiv());
        } catch {}
    }
}