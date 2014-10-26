///<reference path="Entity.ts"/>
module Common.Entities {

    export class Enemy extends Entity {

        equipment: any;
        effects: any;
        active: boolean;

        constructor(name: string, stats: Statset, skills?: Skillset, traits?: Trait[]) {
            super();
            this.name = name;
            if (skills)
                this.skills = skills;
            else
                this.skills = new Skillset();
            if (traits)
                this.traits = traits;
            else
                this.traits = new Array<Trait>();
            this.stats = stats;               
            this.inventory = new Array<IItem>();
            this.active = true;
            this.dir = Vec.West;
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