///<reference path="Entity.ts"/>
module Rouge.Entities {

    export class PlayerChar extends Entity {

        skills: Skillset;
        traits: Trait[];
        stats: Stats;
        inventory: IItem[];
        equipment: any;
        effects: any;
    }
} 