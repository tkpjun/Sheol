﻿module Common.Entities {

    export class Entity implements IEntity {

        name: string;
        description: string;
        stats: Statset;
        skills: Skillset;
        traits: Trait[];
        inventory: IItem[];
        private _x: number;
        private _y: number;
        private actionQueue: Array<() => void>;
        dir: IVector2;
        currWeapon: Items.Weapon;
        fov: Array<IVector2>;

        constructor(name: string) {
            this.name = name;
            this.skills = new Skillset();
            this.traits = new Array<Trait>();
            this.inventory = new Array<IItem>();
            this.actionQueue = new Array<() => void>();
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

        getAction() {
            return this.actionQueue.pop();
        }
        addAction(action: () => void) {
            this.actionQueue.unshift(action);
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