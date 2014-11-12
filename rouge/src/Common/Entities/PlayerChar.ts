///<reference path="Entity.ts"/>
module Common.Entities {

    export class PlayerChar extends Entity {

        equipment: Equipment;
        spirit: number;
        effects: any;
        _hasTurn: boolean;

        constructor(name: string) {
            super(name);
            this.skills.setProwess(5).setEvasion(5);
            this.stats = new Statset(30, 15, 8, 30);
            this.spirit = 1000;
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

        requestMoves(cost: number, times: number): number {
            var moves = 0;
            if (this.stats.ap < cost && moves < times) {
                moves += this.movesFromStamina(cost, times - moves);
            }
            for (var i = 0; i < times; i++) {
                if (this.stats.ap - cost >= 0) {
                    moves += 1;
                    this.stats.ap -= cost;
                }
                else
                    break;
            }
            return moves;
        }

        private movesFromStamina(cost: number, times: number): number {
            var moves = 0;
            for (var i = 0; i < times; i++) {
                var nextCost = 0;
                for (var j = 0; j < cost; j++) {
                    nextCost += Math.ceil((-this.stats.ap + j) / 2) + 1;
                }
                if (this.stats.stamina >= nextCost) {
                    moves += 1;
                    this.stats.stamina -= nextCost;
                    this.stats.ap -= cost;
                }
                else break;
            }
            return moves;
        }

        newTurn() {
            if (this.stats.ap > 0)
                this.stats.setStamina(Math.min(this.stats.stamina + this.stats.ap, this.stats.staminaMax));
            this.stats.ap = this.stats.apMax;
            this.stats.setStamina(Math.min(this.stats.stamina + 3, this.stats.staminaMax));
            this._hasTurn = true;
        }

        getAttack(): Attack {
            return new Attack(this,
                this.currWeapon.damage,
                this.currWeapon.multiplier,
                this.skills.prowess);
        }

        getHitBonus(): number {
            return this.skills.prowess.value + this.currWeapon.toHit;
        }
        getDamage(): number[] {
            return [this.currWeapon.multiplier, this.currWeapon.damage];
        }
    }
} 