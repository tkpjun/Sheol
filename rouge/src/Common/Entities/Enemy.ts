///<reference path="Entity.ts"/>
module Common.Entities {

    export class Enemy extends Entity {

        equipment: any;
        effects: any;
        _hasTurn: boolean;

        constructor(name: string, stats: Statset, skills?: Skillset, traits?: Trait[]) {
            super(name);
            if (skills)
                this.skills = skills;
            else
                this.skills = new Skillset();
            if (traits)
                this.traits = traits;
            else
                this.traits = new Array<Trait>();
            this.stats = stats;               
            this._hasTurn = true;
            this.dir = Vec.West;
        }

        hasAP(): boolean {
            return this.stats.ap > 0;
        }

        hasTurn(): boolean {
            return this._hasTurn;
        }

        newTurn() {
            this.stats.ap = this.stats.apMax;
            this._hasTurn = true;
        }
    }
}