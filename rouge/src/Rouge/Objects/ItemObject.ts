module Rouge.Objects {

    export class ItemObject implements IObject {

        private _x: number;
        private _y: number;
        item: IItem;

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

        isPassable(): boolean { return true }

        use(): IItem {
            return this.item;
        }
    }
}  