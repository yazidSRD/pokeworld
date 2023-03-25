class UiEvolution{

    #divUiEvolution;
    
    #response;
    get response() {
        return new Promise((resolve, reject) => {
            setInterval(() => {
                if (!this.#divUiEvolution.parentNode) {
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
        this.#divUiEvolution.remove()
    }

    createDiv(from, to) {
        try {
            this.#divUiEvolution.remove()
        } catch {}
        if (from === undefined || to === undefined) return;

        this.#divUiEvolution = document.createElement("div");
        this.#divUiEvolution.setAttribute("id", "uiEvolution");

        this.#divUiEvolution.style.backgroundImage = `url(textures/ui/uiEvolution/themes/${from.id}.png)`;
        this.#divUiEvolution.innerHTML = "";
        
        from.getImage("front").then((url) => {
            this.#divUiEvolution.innerHTML += `<div style="background-image: url(${url});"></div>`;
            to.getImage("front").then((url) => {
                this.#divUiEvolution.innerHTML += `<div style="background-image: url(${url});"></div>`;
            });
        });

        setTimeout(() => {
            this.animation(from, to);
        }, 500)

        return this.#divUiEvolution;
    }

    async animation(from, to) {
        this.#divUiEvolution.innerHTML += `<div></div>`
        var divFrom = this.#divUiEvolution.children[0]
        var divTo = this.#divUiEvolution.children[1]
        
        await this.animationAndSound(from, divFrom);

        const audio = new Audio('sounds/jingles/Evolution.mp3');
        
        await audio.readyState;

        audio.play();

        await new Promise(r => setTimeout(r, 500));


        for (let index = 0; index < 601; index+=4) {
            this.#divUiEvolution.children[2].style.height = `${index}px`;
            this.#divUiEvolution.children[2].style.width = `${index}px`;
            await new Promise(r => setTimeout(r, 5));
        }
        
        for (let time = 20; time > -90; time-=5) {
            for (let index = 0; index < 81; index+=2) {
                [divTo, divFrom][Math.abs(time)%2].style.backgroundSize = `${index}% ${index}%`;
                [divFrom, divTo][Math.abs(time)%2].style.backgroundSize = `${80-index}% ${80-index}%`;
                await new Promise(r => setTimeout(r, time<0?0:time));
            }
            // await new Promise(r => setTimeout(r, time*80));
        }

        for (let index = 0; index < 81; index+=2) {
            divTo.style.backgroundSize = `${index}% ${index}%`;
            divFrom.style.backgroundSize = `${80-index}% ${80-index}%`;
            await new Promise(r => setTimeout(r, 0));
        }
        
        for (let index = 601; index > 0; index-=4) {
            this.#divUiEvolution.children[2].style.height = `${index}px`;
            this.#divUiEvolution.children[2].style.width = `${index}px`;
            await new Promise(r => setTimeout(r, 5));
        }

        await this.animationAndSound(to, divTo);

        var chat = new UiChat();
        userInterface.divInterface.appendChild(chat.createDiv(`Félicitation! votre ${from.name} a évolué en ${to.name}!`));
        await chat.response;
        chat.destructor();

        this.#response = true;
        audio.pause();
    }
    
    async animationAndSound(pokemon, div) {
        await new Promise(r => setTimeout(r, 500));
        pokemon.playSound();
        let origibalLeft = div.offsetLeft;

        for (let left = 0; left < 16; left++) {
            div.style.left = `${div.offsetLeft+1}px`;
            await new Promise(r => setTimeout(r, 1));
        }

        for (let index = 0; index < 2; index++) {
            for (let left = 0; left < 32; left++) {
                div.style.left = `${div.offsetLeft-1}px`;
                await new Promise(r => setTimeout(r, 1));
            }
            for (let left = 0; left < 32; left++) {
                div.style.left = `${div.offsetLeft+1}px`;
                await new Promise(r => setTimeout(r, 1));
            }
        }
        
        for (let left = 0; left < 16; left++) {
            div.style.left = `${div.offsetLeft-1}px`;
            await new Promise(r => setTimeout(r, 1));
        }

        div.style.left = `${origibalLeft}px`;
        await new Promise(r => setTimeout(r, 500));
    }
}