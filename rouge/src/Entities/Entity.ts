module Rouge.Entities {

    export class Entity implements IEntity {

        name: string;
        stats: Statset;
        skills: Skillset;
        traits: Trait[];
        inventory: IItem[];
        private _x: number;
        private _y: number;
        private action: () => void;

        get x(): number {
            return this._x;
        }
        set x(value: number) {
            this._x = value;
        }

        get y(): number {
            return this._y;
        }
        set y(value: number) {
            this._y = value;
        }

        getStruck(attack: Attack): AttackResult {
            var evadeSkill;
            switch (attack.hitSkill) {
                default: evadeSkill = this.skills.evasion;
            }
            var result = new AttackResult(attack, this, evadeSkill, 0, 0);
            this.stats.hp -= result.finalDmg;
            return result;
        }

        getAttack(): Attack {
            throw ("Abstract!");
        }

        get nextAction() {
            return this.action;
            //this.action = null;
        }
        set nextAction(action: () => void) {
            this.action = action;
        }

        hasAP(): boolean {
            return false;
        }

        hasTurn(): boolean {
            return false;
        }

        newTurn() {
            throw ("Abstract!");
        }
    }
}