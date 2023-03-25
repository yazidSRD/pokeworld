class UiChat{

    #divUiChat;
    
    #response;
    get response() {
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (!this.#divUiChat.parentNode) {
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
        
    }

    destructor () {
        this.#divUiChat.remove()
    }

    createDiv(text, author, request) {
        this.#response = null;
        if(!text) return;
        this.text = text;
        if (request) {
            this.request = request;
        } else this.request = {};

        try {
            this.#divUiChat.remove()
        } catch {}

        this.#divUiChat = document.createElement("div");
        this.#divUiChat.setAttribute("id", "uiChat");

        var divMessage = document.createElement("div");
        if (author) divMessage.innerHTML = `<div id="uiChat-author"><div>${author}</div></div>`

        var divText = document.createElement("div");
        divText.setAttribute("id", "uiChat-text");
        if (author) {
            divMessage.innerHTML = `<div id="uiChat-author"><div>${author}</div></div>`
            divText.style.marginTop = "30px";
        }
        divText.innerHTML = `<div></div>`;
        divMessage.appendChild(divText);
        
        this.#divUiChat.appendChild(divMessage);
        setTimeout(() => {
            this.#readText();
        }, 0);
        return this.#divUiChat;
    }

    async #readText() {
        var divText = document.getElementById('uiChat-text').children[0];
        var lines = 0;
        for (var c of this.text) {
            if (c == "\n") {
                if (lines == 4) {
                    await this.#awaitNext();
                    lines--;
                    for (var x=0;x<31;x++) {
                        divText.style.top = `-${x}px`
                        await new Promise(resolve => setTimeout(resolve, 10));
                    }
                    divText.innerHTML = divText.innerHTML.substring(divText.innerHTML.indexOf("<br>")+4)
                    divText.style.top = `0px`
                }
                c = "<br>";
                lines++;
            } else await new Promise(resolve => setTimeout(resolve, 25));
            if (c == " ") {
                divText.innerHTML += "&nbsp;"
            } else divText.innerHTML += c;
        }
        
        if (this.request.uiChat_responses) {
            var divButtons = document.createElement("div");

            this.request.uiChat_responses.forEach(response => {
                var divButton = document.createElement("div");
                divButton.innerHTML = `<div>${response}</div>`;
                divButton.addEventListener("click", () => {
                    this.#response = {"uiChat_responses":response};
                });
                divButtons.appendChild(divButton);
            });

            this.#divUiChat.appendChild(divButtons);
        } else {
            await this.#awaitNext();
            this.#response = true;
        }
    }

    async #awaitNext() {
        return new Promise((resolve, reject) => {
            document.addEventListener('mousedown', () => {
              resolve(true);
            });
        });
    }
}