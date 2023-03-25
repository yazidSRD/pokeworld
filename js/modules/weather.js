class Weather{

    allLights = [];
    weather = true;

    constructor() {
        this.divTime = document.getElementById("time");
        this.divLights = document.getElementById("lights");
        this.time = time;
        this.timer();
    }

    addLight(x, y, ray, power) {
        var divLight = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        divLight.setAttribute("class",`light`);
        divLight.setAttribute("cx", (x-(player.position.x-15))*64+32);
        divLight.setAttribute("cy", (y-(player.position.y-8))*64+32);
        divLight.setAttribute("r", 64*ray);
        divLight.setAttribute("fill",`black`);
        divLight.setAttribute("fill",`url(#degraded)`); //https://stackoverflow.com/questions/39193276/how-can-i-merge-two-shapes-in-svg
        this.divLights.appendChild(divLight);
        this.allLights.push({
            x:x,
            y:y,
            div:divLight
        })
    }

    getLight(x, y) {
        return this.allLights.find(instance => instance.x == x && instance.y == y)
    }

    destryLight(x, y) {
        var Light = this.getLight(x, y)
        if (!Light) return;
        Light.div.remove();
        var index = this.allLights.findIndex(instance => instance.x == x && instance.y == y)
        this.allLights.splice(index, 1)
    }

    async move(direction, sens) {
        for(var i = 8/64; i<=1; i+=8/64) {
            await new Promise(resolve => setTimeout(resolve, player.speed));
            this.allLights.forEach(light => {
                var x = (light.x-(player.position.x-15))
                var y = (light.y-(player.position.y-8))
                eval(`${direction} += ${sens}`);
                eval(`${direction} -= ${sens}*(${i})`);
                light.div.setAttribute("cx", x*64+32);
                light.div.setAttribute("cy", y*64+32);
            });
        }
    }

    async anim(direction, sens) {
        var initialPos = player.divPlayer[`offset${{"y":"Top","x":"Left"}[direction]}`]-(8*sens)
        var xx = 2;
        for (var newPos = initialPos; newPos != initialPos+(64*sens); newPos+= (8*sens)) {
            await new Promise(resolve => setTimeout(resolve, 20));
            player.divPlayer.getElementsByTagName('img')[0].setAttribute("src",`textures/characters/${player.skin}/${player.conveyance}/${player.etat}/${player.lookIn}/${Math.trunc(xx++/2)}.png`)
            player.divPlayer.style[{"y":"top","x":"left"}[direction]] = `${newPos}px`;
            document.getElementById("anim").setAttribute("fill",`rgba(0,0,0,${(xx-2)*0.125})`)
        }
        await new Promise(resolve => setTimeout(resolve, 20*5));
        player.divPlayer.style.top = `496px`;
        player.divPlayer.style.left = `960px`;

        setTimeout(async () => {
            for (let x = 8; x >= 0; x--) {
                await new Promise(resolve => setTimeout(resolve, 20/2));
                document.getElementById("anim").setAttribute("fill",`rgba(0,0,0,${x*0.125})`);
            }
        }, 1000);
    }

    timer() {
        setInterval(function(){
            if (fight.inProgress) return;
            weather.time++;
            // 1200 = 1j
            var dayTime = weather.time-Math.trunc(weather.time/1200)*1200
            if (weather.weather) {
                if (240 < dayTime && dayTime < 361) {
                    weather.divTime.setAttribute("fill",`rgba(0,4,38,${(0.8-((dayTime-240)*0.4/60)).toFixed(2)})`)        
                } else if (360 < dayTime && dayTime < 841) {
                    weather.divTime.setAttribute("fill",`rgba(0,4,38,0)`)
                } else if (840 < dayTime && dayTime < 961) {
                    weather.divTime.setAttribute("fill",`rgba(0,4,38,${(((dayTime-840)*0.4/60)).toFixed(2)})`)
                } else {
                    weather.divTime.setAttribute("fill",`rgba(0,4,38,0.8)`)
                }
            } else {
                weather.divTime.setAttribute("fill",`rgba(0,4,38,0)`)
            }
        }, 1000);
    }

}