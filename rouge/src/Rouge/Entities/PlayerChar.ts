///<reference path="Entity.ts"/>
module Rouge.Entities {

    export class PlayerChar extends Entity {

        skills: Skillset;
        traits: Trait[];
        stats: Stats;
        inventory: IItem[];
        equipment: any;
        effects: any;

        constructor() {
            super();
            this.skills = new Skillset();
            this.traits = new Array<Trait>();
            this.stats = new Stats(30, 6, 100, 30);
            this.inventory = new Array<IItem>();
        }
    }
} 