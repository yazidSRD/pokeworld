class Item{

    get description() {return dataItems[this.id].description}
    get name() {return dataItems[this.id].name}
    get max() {return dataItems[this.id].max}

    constructor(item, owner) {
        if (!item) item = itemGenerator(0);

        this.data = item;
        this.owner = owner;
        var {id, action, features, count} = structuredClone(item);
        this.id = id;
        this.count = count;
        this.features = features;

        this.action;

        try {
            this.action = eval(action);
            this.action = new this.action(this);
        } catch {
            this.action = new Void(this);
        }
    }

    async execute() {
        return await this.action.execute();
    }

    async use() {
        return await this.action.use();
    }

    iCanUse() {
        return this.action.iCan();
    }

    async settings() {
        return await this.action.settings();
    }
    
    damageModifier1(attack, target) {
        try {
            return this.action.damageModifier1(attack, target);
        } catch (error) {
            return 1;
        }
    }

    damageModifier2(attack, target) {
        try {
            return this.action.damageModifier2(attack, target);
        } catch (error) {
            return 1;
        }
    }

    damageModifier3(attack, target) {
        try {
            return this.action.damageModifier3(attack, target);
        } catch (error) {
            return 1;
        }
    }

    damageModifier4(attack, target) {
        try {
            return this.action.damageModifier4(attack, target);
        } catch (error) {
            return 1;
        }
    }
}