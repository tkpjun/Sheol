///<reference path="Entity.ts"/>
module Rouge.Entities {

    export class Enemy extends Entity {

        skills: Skillset;
        traits: Trait[];
        inventory: IItem[];
        equipment: any;
        effects: any;
        active: boolean;

        constructor(name: string) {
            super();
            this.name = name;
            this.skills = new Skillset();
            this.traits = new Array<Trait>();
            this.stats = new Stats(30, 6, 100, 30);
            this.inventory = new Array<IItem>();
            this.active = true;
        }

        hasAP(): boolean {
            return this.stats.ap > 0;
        }

        didntEnd(): boolean {
            return this.active;
        }

        newTurn() {
            this.stats.ap = this.stats.apMax;
            this.active = true;
        }
    }
}