///<reference path="Entity.ts"/>
module Rouge.Entities {

    export class PlayerChar extends Entity {

        equipment: any;
        effects: any;
        active: boolean;

        constructor(name: string) {
            super();
            this.name = name;
            this.skills = new Skillset().setProwess(5).setEvasion(5);
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