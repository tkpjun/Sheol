///<reference path="Entity.ts"/>
module Rouge.Entities {

    export class Foe extends Entity {

        stats: Stats;
        inventory: IItem[];
        traits: Trait[];
    }
}