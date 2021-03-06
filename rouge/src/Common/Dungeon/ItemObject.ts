﻿module Common.Dungeon {

    export class ItemObject implements IObject {

        private _x: number;
        private _y: number;
        item: IItem;

        constructor(x: number, y: number, item: IItem) {
            this._x = x;
            this._y = y;
            this.item = item;
        }

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

        get name(): string { return this.item.name; }

        get isPassable(): boolean { return true }

        pick(who: Entities.Entity): string {
            who.inventory.push(this.item);
            return "You picked up a " + this.item.name + ".";
        }
    }
}  