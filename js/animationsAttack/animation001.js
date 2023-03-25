class Animation001 {
    async start(pokemon, targets) {
        var div = pokemon.divPokemon.children[1];
        let origibalLeft = div.offsetLeft;
        let origibalTop = div.offsetTop;
        if (div.getAttribute("class") == "uiFight-front") {
            for (let index = 0; index < 11; index++) {
                div.style.left = `${div.offsetLeft-2}px`;
                div.style.top = `${div.offsetTop+2}px`;
                await new Promise(r => setTimeout(r, 1));
            }
            for (let index = 0; index < 11; index++) {
                div.style.left = `${div.offsetLeft+2}px`;
                div.style.top = `${div.offsetTop-2}px`;
                await new Promise(r => setTimeout(r, 1));
            }
        } else {
            for (let index = 0; index < 11; index++) {
                div.style.left = `${div.offsetLeft+2}px`;
                div.style.top = `${div.offsetTop-2}px`;
                await new Promise(r => setTimeout(r, 1));
            }
            for (let index = 0; index < 11; index++) {
                div.style.left = `${div.offsetLeft-2}px`;
                div.style.top = `${div.offsetTop+2}px`;
                await new Promise(r => setTimeout(r, 1));
            }
        }
        div.style.left = `${origibalLeft}px`;
        div.style.top = `${origibalTop}px`;

        setTimeout(async () => {
            var div = targets[0].divPokemon.children[1];
            let origibalLeft = div.offsetLeft;

            setTimeout(async () => {
                for (let index = 0; index < 5; index++) {
                    div.style.visibility = ["visible","hidden"][index%2];
                    await new Promise(r => setTimeout(r, 125));
                }
            }, 0)

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
        },0);
    }
}