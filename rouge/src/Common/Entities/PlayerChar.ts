﻿///<reference path="Entity.ts"/>
module Common.Entities {

    export class PlayerChar extends Entity {

        equipment: Equipment;
        effects: any;
        _hasTurn: boolean;

        constructor(name: string) {
            super();
            this.name = name;
            this.skills = new Skillset().setProwess(5).setEvasion(5);
            this.traits = new Array<Trait>();
            this.stats = new Statset(30, 10, 100, 30);
            this.inventory = new Array<IItem>();
            this._hasTurn = true;
            this.equipment = new Equipment();
            this.dir = Vec.East;
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

        getAttack(): Attack {
            return new Attack(this,
                this.currWeapon.damage,
                this.currWeapon.multiplier,
                this.skills.prowess);
        }
    }
} 