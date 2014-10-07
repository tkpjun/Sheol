module Rouge.Entities {

    export class Entity implements IEntity {

        name: string;
        stats: Stats;
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

        getStruck(attack): AttackResult {
            throw ("Abstract!");
        }

        get nextAction() {
            return this.action;
            this.action = null;
        }
        set nextAction(action: () => void) {
            this.action = action;
        }

        hasAP(): boolean {
            return false;
        }

        didntEnd(): boolean {
            return false;
        }

        newTurn() {
            throw ("Abstract!");
        }
    }
}