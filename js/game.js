var world, player, structures, weather, fight, userInterface;

function startGame() {
    document.addEventListener('contextmenu', event => event.preventDefault());

    // world = new World(saveWorld);
    structures = new Structures();
    //chat = new Chat();
    weather = new Weather();
    fight = new Fight();
    loadWorld(saveWorld, "openWorld");
    player = new Character(structuredClone(savePlayer), true);
    player.teleport();
    userInterface = new UserInterface();
    document.addEventListener('keydown', keyDown);


    //juste pour test
    test();
    player.speed=0;
}

function inProgress() {
    alert("in progress");
}

function msgAlert(msg, lvl) {
    new UiAlert(msg, lvl)
}

function loadWorld(save, type, option1, option2) {
    if (world) world.unloadingAllChunks();
    if (structures) structures.unloadingAllStructure();
    world = new World(save, type, option1, option2);
}

function coordinateConverter(x, y) {
    var chunk = {};
    chunk.x = Math.trunc(x/16);
    chunk.y = Math.trunc(y/16);
    var block = {};
    block.x = x-(chunk.x*16);
    block.y = y-(chunk.y*16);
    return {chunk:chunk, block:block};
}

function getBlockInstance(x, y) {
    var coordinate = coordinateConverter(x, y);
    var chunk = world.getChunk(coordinate.chunk.x, coordinate.chunk.y);
    if (!chunk) return undefined;
    return chunk.getBlock(coordinate.block.x, coordinate.block.y)
}

function getBlock(x, y) {
    var coordinate = coordinateConverter(x, y);
    return world.world[coordinate.chunk.y][coordinate.chunk.x][coordinate.block.y][coordinate.block.x]
}

async function keyDown(key) {
    for(var i in controls)
    {
        if (controls[i] == key.key && !player.event) {
            switch (i) {
                case 'move forward':
                    player.move("y", -1);
                    break;
                case 'move back':
                    player.move("y", 1);
                    break;
                case 'left':
                    player.move("x", -1);
                    break;
                case 'right':
                    player.move("x", 1);
                    break;
                case 'interaction':
                    // console.log(player.position.x+", "+player.position.y);
                    player.interaction();
                    break;
                case 'pokemons':
                    menuPokemons.open(`menuPokemons.moreInfo(i)`);
                    break;
                case 'inventory':
                    //menuItems.open(`menuItems.moreInfo(i)`);
                    break;
            } 
            // getWordlBlock(player["position"].left, player["position"].top)[0][0]=1;
            // refresh();
            return
        }
    }
}

function openInventory(items) {
    console.clear();
    console.log("---------- Inventory ----------");
    var i = 1;
    items.some(function(item) {
        console.log(`n°${i} ${item.name} : ${item.id}`);
        i++;
    })
}

function itemGenerator(id) {
    if (!dataItems[id]) return false;
    var item = structuredClone(dataItems[id]);
    item.id = id;
    item.count = 1;
    delete item.description;
    delete item.name;
    return item;
}

function pokemonGenerator(id) {
    if (!listOfpokemons[id]) return false;
    var pokemonData = listOfpokemons[id];
    var pokemon = {};
    pokemon.id = id;
    pokemon.nickname = pokemonData.name;
    //pokemon.types = pokemonData.types;
    if ((Math.random() * 101).toFixed(1) < pokemonData.sexe) {
        pokemon.sexe = 0;
    } else pokemon.sexe = 1;

    pokemon.stats = {}
    pokemon.stats.hp = {
        iv:Math.floor(Math.random() * 32),
        ev:0
    }
    pokemon.stats.attack = {
        iv:Math.floor(Math.random() * 32),
        ev:0
    }
    pokemon.stats.defense = {
        iv:Math.floor(Math.random() * 32),
        ev:0
    }
    pokemon.stats.spAttack = {
        iv:Math.floor(Math.random() * 32),
        ev:0
    }
    pokemon.stats.spDefense = {
        iv:Math.floor(Math.random() * 32),
        ev:0
    }
    pokemon.stats.speed = {
        iv:Math.floor(Math.random() * 32),
        ev:0
    }
    pokemon.lvl = 5;
    pokemon.xp = 0;
    pokemon.item = itemGenerator(1+Math.floor(Math.random() * (dataItems.length-1)));
    pokemon.nature = Math.floor(Math.random() * listOfNatures.length);
    pokemon.talent = null;
    pokemon.life = Math.floor(((pokemon.stats.hp.iv+(2*pokemonData.stats.hp)+(pokemon.stats.hp.ev/4))*pokemon.lvl/100)+pokemon.lvl+10);
    var attacks = [];
    for (const lvl in pokemonData.attacks.byLvl) {
        if (Number(lvl) === NaN) continue;
        if (Number(lvl) > pokemon.lvl) return;
        for (const attaque of pokemonData.attacks.byLvl[lvl]) {
            attacks.push(attaque);
        }
    }
    
    pokemon.attacks = [];
    if (attacks.length < 5) {
        for (const i of attacks) {
            pokemon.attacks.push([i,listOfAttacks[i].pp])
        }
    }
    return pokemon;
}

function characterGenerator(position, stage, name, lookIn, speed, inventory, pokemons, skin, interactions) {
    var character = {};
    character.etat = "static";
    character.conveyance = 0;

    if (name) character.name = name;
    else character.name = null;

    if (position === null) return;
    character.position = position;
    character.chunk = coordinateConverter(position.x,position.y).chunk;

    if (!isNaN(stage)) character.stage = stage;
    else return;

    if (lookIn) character.lookIn = lookIn;
    else character.lookIn = "sud";

    if (!isNaN(speed)) character.speed = speed;
    else character.speed = 40;

    if (inventory) character.inventory = inventory;
    else character.inventory = {max:10,count:0,items:[]};

    if (pokemons) character.pokemons = pokemons;
    else character.pokemons = {max:6,pokemons:[]};

    if (skin) character.skin = skin;
    else character.skin = "player1";

    if (interactions) character.interactions = interactions;
    else character.interactions = {interactionFight:null,interactionDiscussions:null,interactionEvents:null,interactionPersonalized:null};

    return character;
}

function test() {
    player.givePokemon(pokemonGenerator(0));
    // player.givePokemon(pokemonGenerator(1));
    // player.givePokemon(pokemonGenerator(2));
    // player.givePokemon(pokemonGenerator(1));
    // player.givePokemon(pokemonGenerator(0));
    // player.givePokemon(pokemonGenerator(1));
    // structures.creationStructure(30, 16, 29, 0);
    
    player.giveItem(itemGenerator(1));
    player.giveItem(itemGenerator(1));
    player.giveItem(itemGenerator(1));
    player.giveItem(itemGenerator(2));
    player.giveItem(itemGenerator(2));

    structures.creationStructure(2, 33, 24, 0);
    structures.creationStructure(2, 40, 21, 0);
    structures.creationStructure(2, 40, 29, 0);
    structures.creationStructure(2, 40, 13, 0);
    structures.creationStructure(2, 33, 16, 0);
    structures.creationStructure(2, 28, 36, 0);
    structures.creationStructure(2, 34, 20, 1);
    structures.creationStructure(2, 44, 15, 1);
    structures.creationStructure(2, 47, 19, 2);
    structures.creationStructure(2, 45, 22, 1);
    structures.creationStructure(2, 65, 27, 0);
    structures.creationStructure(2, 70, 24, 0);
    structures.creationStructure(3, 15, 29, 0);
    structures.getStructure(15,29,0).composition[0][0].Read.msg="Bienvenue à Île de l'Aube!"
    structures.creationStructure(4, 32, 37, 0);
    structures.creationStructure(4, 24, 36, 0);
    structures.creationStructure(4, 67, 24, 0);
    structures.creationStructure(4, 22, 28, 0);
    structures.creationStructure(4, 29, 29, 0);
    structures.creationStructure(5, 48, 17, 2);
    structures.creationStructure(6, 26, 31, 0);
    structures.creationStructure(7, 36, 18, 1);
    structures.creationStructure(7, 37, 18, 1);
    structures.creationStructure(7, 38, 18, 1);
    structures.creationStructure(7, 39, 18, 1);
    structures.creationStructure(7, 40, 18, 1);
    structures.creationStructure(7, 41, 18, 1);
    structures.creationStructure(9, 13, 29, 0);
    structures.creationStructure(9, 10, 29, 0);
    structures.creationStructure(9, 7, 29, 0);
    structures.creationStructure(9, 56, 25, 0);
    structures.creationStructure(9, 59, 25, 0);
    structures.creationStructure(10, 20, 36, 0);

    structures.creationStructure(11, 6, 24, 0);
    structures.creationStructure(12, 6, 18, 0);
    structures.creationStructure(13, 18, 22, 0);
    structures.creationStructure(13, 27, 17, 0);
    structures.creationStructure(13, 34, 11, 0);
    structures.creationStructure(13, 43, 8, 0);
    structures.creationStructure(13, 50, 13, 0);
    structures.creationStructure(13, 54, 22, 0);
    structures.creationStructure(13, 59, 16, 0);
    structures.creationStructure(13, 74, 19, 0);
    structures.creationStructure(13, 72, 25, 0);
    structures.creationStructure(13, 66, 30, 0);
    structures.creationStructure(13, 61, 28, 0);
    structures.creationStructure(13, 48, 29, 0);
    structures.creationStructure(13, 42, 32, 0);
    structures.creationStructure(13, 35, 37, 0);
    structures.creationStructure(13, 23, 40, 0);
    structures.creationStructure(13, 14, 34, 0);
    structures.creationStructure(14, 16, 24, 0);
    structures.creationStructure(14, 24, 20, 0);
    structures.creationStructure(14, 30, 12, 0);
    structures.creationStructure(14, 37, 9, 0);
    structures.creationStructure(14, 46, 12, 0);
    structures.creationStructure(14, 55, 17, 0);
    structures.creationStructure(14, 59, 20, 0);
    structures.creationStructure(14, 61, 14, 0);
    structures.creationStructure(14, 71, 16, 0);
    structures.creationStructure(14, 74, 23, 0);
    structures.creationStructure(14, 68, 28, 0);
    structures.creationStructure(14, 52, 28, 0);
    structures.creationStructure(14, 40, 35, 0);
    structures.creationStructure(14, 31, 40, 0);
    structures.creationStructure(14, 20, 39, 0);
    structures.creationStructure(14, 17, 35, 0);

    structures.creationStructure(15, 18, 29, 0);
    structures.creationStructure(15, 19, 29, 0);
    structures.creationStructure(15, 18, 30, 0);
    structures.creationStructure(15, 19, 30, 0);
    structures.creationStructure(15, 20, 29, 0);
    structures.creationStructure(15, 20, 30, 0);
    structures.creationStructure(15, 21, 29, 0);
    structures.creationStructure(15, 21, 30, 0);
    structures.creationStructure(15, 22, 29, 0);
    structures.creationStructure(15, 22, 30, 0);
    structures.creationStructure(15, 23, 29, 0);
    structures.creationStructure(15, 23, 30, 0);
    structures.creationStructure(15, 19, 28, 0);
    structures.creationStructure(15, 19, 27, 0);
    structures.creationStructure(15, 20, 28, 0);
    structures.creationStructure(15, 20, 27, 0);

    structures.creationStructure(15, 24, 32, 0);
    structures.creationStructure(15, 25, 32, 0);
    structures.creationStructure(15, 24, 33, 0);
    structures.creationStructure(15, 25, 33, 0);
    structures.creationStructure(15, 24, 34, 0);
    structures.creationStructure(15, 25, 34, 0);
    structures.creationStructure(15, 24, 35, 0);
    structures.creationStructure(15, 25, 35, 0);
    structures.creationStructure(15, 26, 34, 0);
    structures.creationStructure(15, 26, 35, 0);
    structures.creationStructure(15, 27, 34, 0);
    structures.creationStructure(15, 27, 35, 0);
    structures.creationStructure(15, 28, 34, 0);
    structures.creationStructure(15, 28, 35, 0);
    structures.creationStructure(15, 29, 34, 0);
    structures.creationStructure(15, 29, 35, 0);
    structures.creationStructure(15, 30, 34, 0);
    structures.creationStructure(15, 30, 35, 0);
    structures.creationStructure(15, 31, 34, 0);
    structures.creationStructure(15, 31, 35, 0);
    structures.creationStructure(15, 32, 34, 0);
    structures.creationStructure(15, 32, 35, 0);
    structures.creationStructure(15, 25, 36, 0);
    structures.creationStructure(15, 26, 36, 0);
    structures.creationStructure(15, 25, 37, 0);
    structures.creationStructure(15, 26, 37, 0);
    structures.creationStructure(15, 30, 33, 0);
    structures.creationStructure(15, 30, 32, 0);
    structures.creationStructure(15, 31, 33, 0);
    structures.creationStructure(15, 31, 32, 0);

    structures.creationStructure(15, 26, 25, 0);
    structures.creationStructure(15, 27, 25, 0);
    structures.creationStructure(15, 23, 27, 0);
    structures.creationStructure(15, 23, 26, 0);
    structures.creationStructure(15, 24, 27, 0);
    structures.creationStructure(15, 24, 26, 0);
    structures.creationStructure(15, 25, 27, 0);
    structures.creationStructure(15, 25, 26, 0);
    structures.creationStructure(15, 26, 27, 0);
    structures.creationStructure(15, 26, 26, 0);
    structures.creationStructure(15, 27, 27, 0);
    structures.creationStructure(15, 27, 26, 0);
    structures.creationStructure(15, 28, 27, 0);
    structures.creationStructure(15, 28, 26, 0);
    structures.creationStructure(15, 29, 27, 0);
    structures.creationStructure(15, 29, 26, 0);
    structures.creationStructure(15, 30, 27, 0);
    structures.creationStructure(15, 30, 26, 0);
    structures.creationStructure(15, 31, 27, 0);
    structures.creationStructure(15, 31, 26, 0);
    structures.creationStructure(15, 30, 28, 0);
    structures.creationStructure(15, 31, 28, 0);
    structures.creationStructure(15, 32, 28, 0);
    structures.creationStructure(15, 32, 27, 0);
    structures.creationStructure(15, 33, 28, 0);
    structures.creationStructure(15, 33, 27, 0);
    structures.creationStructure(15, 34, 28, 0);
    structures.creationStructure(15, 34, 27, 0);

    structures.creationStructure(34, 34, 34, 0);
    structures.creationStructure(16, 27, 24, 0);
    // structures.creationStructure(17, 35, 34, 0);
    // structures.creationStructure(18, 20, 26, 0);
    structures.creationStructure(33, 19, 26, 0);
    structures.creationStructure(19, 66, 22, 0);
    structures.creationStructure(20, 65, 23, 0);
    structures.creationStructure(21, 43, 23, 1);
    structures.creationStructure(22, 49, 24, 1);
    structures.creationStructure(21, 44, 18, 2);
    structures.creationStructure(23, 46, 21, 2);
    structures.creationStructure(24, 18, 32, 0);
    structures.creationStructure(24, 42, 26, 1);
    
    //structures.creationStructure(30, 37, 22, 0);

    structures.creationStructure(1, 39, 23, 0);
    structures.creationStructure(1, 40, 23, 0);
    structures.creationStructure(1, 41, 23, 0);
    structures.creationStructure(1, 38, 24, 0);
    structures.creationStructure(1, 39, 24, 0);
    structures.creationStructure(1, 40, 24, 0);
    structures.creationStructure(1, 41, 24, 0);
    structures.creationStructure(1, 36, 25, 0);
    structures.creationStructure(1, 37, 25, 0);
    structures.creationStructure(1, 38, 25, 0);
    structures.creationStructure(1, 39, 25, 0);
    structures.creationStructure(1, 40, 25, 0);
    structures.creationStructure(1, 36, 26, 0);
    structures.creationStructure(1, 37, 26, 0);
    structures.creationStructure(1, 38, 26, 0);
    structures.creationStructure(1, 39, 26, 0);
    structures.creationStructure(1, 40, 26, 0);
    structures.creationStructure(1, 36, 27, 0);
    structures.creationStructure(1, 37, 27, 0);
    structures.creationStructure(1, 38, 27, 0);
    structures.creationStructure(1, 39, 27, 0);
    structures.creationStructure(1, 40, 27, 0);
    structures.creationStructure(1, 37, 28, 0);
    structures.creationStructure(1, 38, 28, 0);
    structures.creationStructure(1, 39, 28, 0);

    structures.creationStructure(1, 36, 15, 0);
    structures.creationStructure(1, 37, 15, 0);
    structures.creationStructure(1, 38, 15, 0);
    structures.creationStructure(1, 39, 15, 0);
    structures.creationStructure(1, 36, 16, 0);
    structures.creationStructure(1, 37, 16, 0);
    structures.creationStructure(1, 38, 16, 0);
    structures.creationStructure(1, 39, 16, 0);
    structures.creationStructure(1, 40, 16, 0);
    structures.creationStructure(1, 37, 17, 0);
    structures.creationStructure(1, 38, 17, 0);
    structures.creationStructure(1, 39, 17, 0);
    structures.creationStructure(1, 40, 17, 0);
    structures.creationStructure(1, 37, 18, 0);
    structures.creationStructure(1, 38, 18, 0);
    structures.creationStructure(1, 39, 18, 0);
    structures.creationStructure(1, 37, 19, 0);
    structures.creationStructure(1, 38, 19, 0);
    structures.creationStructure(1, 37, 20, 0);
    structures.creationStructure(1, 38, 20, 0);
    structures.creationStructure(31, 8, 25, 0);
    structures.creationStructure(32, 8, 28, 0);
    structures.creationStructure(35, 35, 23, 0);
    
    getBlockInstance(31, 17).setStage(1).save();
    getBlockInstance(32, 17).setStage(1).save();
    getBlockInstance(33, 17).setStage(1).save();
    getBlockInstance(34, 17).setStage(1).save();
    getBlockInstance(35, 17).setStage(1).save();
    getBlockInstance(36, 17).setStage(1).save();

    getBlockInstance(31, 18).setStage(1).save();
    getBlockInstance(32, 18).setStage(1).save();
    getBlockInstance(33, 18).setStage(1).save();
    getBlockInstance(34, 18).setStage(1).save();
    getBlockInstance(35, 18).setStage(1).save();
    getBlockInstance(36, 18).setStage(1).save();
    
    getBlockInstance(31, 19).setStage(1).save();
    getBlockInstance(32, 19).setStage(1).save();
    getBlockInstance(33, 19).setStage(1).save();
    getBlockInstance(34, 19).setStage(1).save();
    getBlockInstance(35, 19).setStage(1).save();
    getBlockInstance(36, 19).setStage(1).save();

    getBlockInstance(33, 20).setStage(1).save();
    getBlockInstance(34, 20).setStage(1).save();
    getBlockInstance(35, 20).setStage(1).save();
    getBlockInstance(36, 20).setStage(1).save();

    getBlockInstance(33, 21).setStage(1).save();
    getBlockInstance(34, 21).setStage(1).save();
    getBlockInstance(35, 21).setStage(1).save();
    getBlockInstance(36, 21).setStage(1).save();
    
    getBlockInstance(33, 22).setStage(1).save();
    getBlockInstance(34, 22).setStage(1).save();
    getBlockInstance(35, 22).setStage(1).save();
    getBlockInstance(36, 22).setStage(1).save();
    
    getBlockInstance(33, 23).setStage(1).save();
    getBlockInstance(34, 23).setStage(1).save();
    getBlockInstance(35, 23).setStage(1).save();
    getBlockInstance(36, 23).setStage(1).save();

    getBlockInstance(41, 14).setStage(1).save();
    getBlockInstance(42, 14).setStage(1).save();
    getBlockInstance(43, 14).setStage(1).save();
    getBlockInstance(44, 14).setStage(1).save();
    getBlockInstance(45, 14).setStage(1).save();

    getBlockInstance(41, 15).setStage(1).save();
    getBlockInstance(42, 15).setStage(1).save();
    getBlockInstance(43, 15).setStage(1).save();
    getBlockInstance(44, 15).setStage(1).save();
    getBlockInstance(45, 15).setStage(1).save();
    getBlockInstance(46, 15).setStage(1).save();
    getBlockInstance(47, 15).setStage(1).save();
    getBlockInstance(48, 15).setStage(1).save();
    getBlockInstance(49, 15).setStage(1).save();
    getBlockInstance(50, 15).setStage(1).save();
    
    getBlockInstance(41, 16).setStage(1).save();
    getBlockInstance(42, 16).setStage(1).save();
    getBlockInstance(43, 16).setStage(1).save();
    getBlockInstance(44, 16).setStage(2).save();
    getBlockInstance(45, 16).setStage(2).save();
    getBlockInstance(46, 16).setStage(2).save();
    getBlockInstance(47, 16).setStage(2).save();
    getBlockInstance(48, 16).setStage(2).save();
    getBlockInstance(49, 16).setStage(2).save();
    getBlockInstance(50, 16).setStage(1).save();

    getBlockInstance(41, 17).setStage(1).save();
    getBlockInstance(42, 17).setStage(1).save();
    getBlockInstance(43, 17).setStage(1).save();
    getBlockInstance(44, 17).setStage(2).save();
    getBlockInstance(45, 17).setStage(2).save();
    getBlockInstance(46, 17).setStage(2).save();
    getBlockInstance(47, 17).setStage(2).save();
    getBlockInstance(48, 17).setStage(2).save();
    getBlockInstance(49, 17).setStage(2).save();
    getBlockInstance(50, 17).setStage(1).save();

    getBlockInstance(41, 18).setStage(1).save();
    getBlockInstance(42, 18).setStage(1).save();
    getBlockInstance(43, 18).setStage(1).save();
    getBlockInstance(44, 18).setStage(2).save();
    getBlockInstance(45, 18).setStage(2).save();
    getBlockInstance(46, 18).setStage(2).save();
    getBlockInstance(47, 18).setStage(2).save();
    getBlockInstance(48, 18).setStage(2).save();
    getBlockInstance(49, 18).setStage(2).save();
    getBlockInstance(50, 18).setStage(1).save();

    getBlockInstance(41, 19).setStage(1).save();
    getBlockInstance(42, 19).setStage(1).save();
    getBlockInstance(43, 19).setStage(1).save();
    getBlockInstance(44, 19).setStage(2).save();
    getBlockInstance(45, 19).setStage(2).save();
    getBlockInstance(46, 19).setStage(2).save();
    getBlockInstance(47, 19).setStage(2).save();
    getBlockInstance(48, 19).setStage(2).save();
    getBlockInstance(49, 19).setStage(1).save();
    getBlockInstance(50, 19).setStage(1).save();

    getBlockInstance(42, 20).setStage(1).save();
    getBlockInstance(43, 20).setStage(1).save();
    getBlockInstance(44, 20).setStage(2).save();
    getBlockInstance(45, 20).setStage(2).save();
    getBlockInstance(46, 20).setStage(2).save();
    getBlockInstance(47, 20).setStage(2).save();
    getBlockInstance(48, 20).setStage(2).save();
    getBlockInstance(49, 20).setStage(1).save();
    
    getBlockInstance(42, 21).setStage(1).save();
    getBlockInstance(43, 21).setStage(1).save();
    getBlockInstance(44, 21).setStage(2).save();
    getBlockInstance(45, 21).setStage(2).save();
    getBlockInstance(46, 21).setStage(2).save();
    getBlockInstance(47, 21).setStage(2).save();
    getBlockInstance(48, 21).setStage(2).save();
    getBlockInstance(49, 21).setStage(1).save();

    getBlockInstance(43, 22).setStage(1).save();
    getBlockInstance(44, 22).setStage(1).save();
    getBlockInstance(45, 22).setStage(1).save();
    getBlockInstance(46, 22).setStage(1).save();
    getBlockInstance(47, 22).setStage(1).save();
    getBlockInstance(48, 22).setStage(1).save();
    getBlockInstance(49, 22).setStage(1).save();

    getBlockInstance(43, 23).setStage(1).save();
    getBlockInstance(44, 23).setStage(1).save();
    getBlockInstance(45, 23).setStage(1).save();
    getBlockInstance(46, 23).setStage(1).save();
    getBlockInstance(47, 23).setStage(1).save();
    getBlockInstance(48, 23).setStage(1).save();
    getBlockInstance(49, 23).setStage(1).save();

    getBlockInstance(43, 24).setStage(1).save();
    getBlockInstance(44, 24).setStage(1).save();
    getBlockInstance(45, 24).setStage(1).save();
    getBlockInstance(46, 24).setStage(1).save();
    getBlockInstance(47, 24).setStage(1).save();
    getBlockInstance(48, 24).setStage(1).save();
    getBlockInstance(49, 24).setStage(1).save();

    getBlockInstance(41, 25).setStage(1).save();
    getBlockInstance(42, 25).setStage(1).save();
    getBlockInstance(43, 25).setStage(1).save();
    getBlockInstance(44, 25).setStage(1).save();
    getBlockInstance(45, 25).setStage(1).save();
    getBlockInstance(46, 25).setStage(1).save();
    getBlockInstance(47, 25).setStage(1).save();
    getBlockInstance(48, 25).setStage(1).save();
    getBlockInstance(49, 25).setStage(1).save();

    getBlockInstance(41, 26).setStage(1).save();
    getBlockInstance(42, 26).setStage(1).save();
    getBlockInstance(43, 26).setStage(1).save();
    getBlockInstance(44, 26).setStage(1).save();
    getBlockInstance(45, 26).setStage(1).save();
    getBlockInstance(46, 26).setStage(1).save();
    getBlockInstance(47, 26).setStage(1).save();
    getBlockInstance(48, 26).setStage(1).save();
    getBlockInstance(49, 26).setStage(1).save();

    getBlockInstance(41, 27).setStage(1).save();
    getBlockInstance(42, 27).setStage(1).save();
    getBlockInstance(43, 27).setStage(1).save();
    getBlockInstance(44, 27).setStage(1).save();
    getBlockInstance(45, 27).setStage(1).save();
    
    //player.teleport(6, 30, 0);
    player.teleport(8, 27, 0);
    new Character(characterGenerator({x:6, y:30}, 0, "???", null, 0, null, {max:6,pokemons:[pokemonGenerator(0),pokemonGenerator(0)]}, null, {interactionFight:{lastFight:-1200,messages:[["Prépare toi."],["Bien joué à toi."],["Revient après t'être entraîné."]],type:"1"}}));
    new Character(characterGenerator({x:7, y:29}, 0, "Marin", "est", 40, null, null, "marin1", {interactionEvents:{code:"async () => {while(player.position.x!=8||player.position.y!=29){if(!this.character.divPlayer)return;await new Promise(r=>setTimeout(r,100));}player.event=true;await this.character.expression(`exclamation`);userInterface.open(UiChat);userInterface.divInterface.appendChild(userInterface.ui.createDiv(`Bonjour, jeune homme! J'espère que votre voyage s'est bien passé.\nJe vous souhaite la bienvenue sur Île de l'Aube!`,this.character.name));await userInterface.ui.response;userInterface.close();player.event=false;this.character.interactions.interactionEvents=null;}"}}));
    // new Character(characterGenerator({x:15, y:30}, 0, "luca", "est", 25, null, null, null, {interactionPersonalized:{code:'async () => {console.log(this);console.log("ok");}'}}));
    // new Character(characterGenerator({x:16, y:29}, 0, "tro", "est", 25, null, null, null, {interactionDiscussions:["Salut!","Au revoir."]}));
    //world.allCharacterInstances[1].givePokemon(pokemonGenerator(0));
    //world.allCharacterInstances[1].givePokemon(pokemonGenerator(1));
    // ia(world.allCharacterInstances[0]);
}
// while (player.etat != "static") await new Promise(r => setTimeout(r, 100));
        
async function ia(character) {
    character.teleport(6, 30, 0);
    for (x=0;x<7;x++) {
        await character.move("x",1);
    }
    await character.move("y",-1);
    character.lookIn = "sud";
}