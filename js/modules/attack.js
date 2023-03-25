class Attack{

    #attack;
    get ppMax() {return listOfAttacks[this.id].pp}
    get description() {return listOfAttacks[this.id].description}
    get name() {return listOfAttacks[this.id].name}

    constructor(data, pokemon) {
        this.pokemon = pokemon;
        this.data = data;
        this.id = data[0];
        this.pp = data[1];
        var attack = structuredClone(listOfAttacks[this.id]);
        this.category = attack.category;
        this.powerful = attack.powerful;
        this.precision = attack.precision;
        this.priority = attack.priority;
        this.type = attack.type;
        this.features = attack.features;
        try {
            var Class = eval(this.name);
            this.#attack = new Class(this);
        } catch {}
    }

    async execute(targets) {
        try {
            this.addPp(-1);
            await this.#attack.execute(targets);
        } catch(r) {console.log(r);}
    }

    addPp(pp) {
        this.data[1] += pp;
        if (this.data[1] > this.ppMax) this.data[1] = this.ppMax;
        if (this.data[1] < 0) this.data[1] = 0;
        this.pp = this.data[1];
    }

    damageCalculator(target) {
        //https://www.pokebip.com/page/jeuxvideo/guide_tactique_strategie_pokemon/formules_mathematiques#attattsp%C3%A9
        //Puissance = HH × BP × IT × CHG × MS × WS × UA × FA
        var Puissance = 1 * Math.floor(this.powerful * this.pokemon.item.damageModifier1(this, target)) * 1 * 1 * 1 * 1 * 1
        //Mod1 = BRN × RL × TVT × SR × FF
        var Mod1 = 1 * 1 * 1 * 1 * 1
        //Le Coup Critique
        var CC = Math.floor(Math.random()*2)+1
        //je sais pas
        var Mod2 = this.pokemon.item.damageModifier2(this, target) * this.damageModifier1(target)
        var R = Math.floor(((Math.floor(Math.random()*39)+217) * 100) / 255)
        var STAB = this.STAB;
        var Type1 = this.Type1;
        var Type2 = this.Type2;
        //Mod3 = SRF × EB × TL × TRB
        var Mod3 = 1 * this.pokemon.item.damageModifier3(this, target) * 1 * this.pokemon.item.damageModifier4(this, target)
        var demage = (Math.floor((((Math.floor((Math.floor(((Math.floor(this.pokemon.lvl * 2 / 5)) + 2) * Puissance * this.pokemon.getStatsBase[this.category=="physique"?"attack":"spAttack"] / 50)) / target.getStatsBase[this.category=="physique"?"defense":"spDefense"])) * Mod1) + 2) * CC * Mod2 * R / 100)) * STAB * Type1 * Type2 * Mod3
        //console.log(demage);
        return demage;
    }

    damageModifier1(target) {
        try {
            return this.#attack.damageModifier1(target);
        } catch (error) {
            return 1;
        }
    }

    get STAB() {
        for (let i = 0; i < this.type.length; i++) {
            if (this.pokemon.types.includes(this.type[i])) {
              return 1.5;
            }
        }
        return 1;
    }

    get Type1() {
        if (listOfTypes[this.type[0]].efficient.includes(this.pokemon.types[0])) {
            return 2
        } else if (listOfTypes[this.type[0]].inefficient.includes(this.pokemon.types[0])) {
            return 0.5
        } else if (listOfTypes[this.type[0]].noEffect.includes(this.pokemon.types[0])) {
            return 0
        } else return 1;
    }

    get Type2() {
        if (listOfTypes[this.type[0]].efficient.includes(this.pokemon.types[1])) {
            return 2
        } else if (listOfTypes[this.type[0]].inefficient.includes(this.pokemon.types[1])) {
            return 0.5
        } else if (listOfTypes[this.type[0]].noEffect.includes(this.pokemon.types[1])) {
            return 0
        } else return 1;
    }
}