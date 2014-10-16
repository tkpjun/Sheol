module Rouge.Items {

    export class Weapon implements IItem {

        private _name: string;
        private _dmg: number;
        private _mul: number;
        private _minRange: number;
        private _maxRange: number;
        private _apCost: number;
        private _twoHand = false;
        private _toHit = 0;
        private _toEvasion = 0;
        private _toMinArmor = 0;
        private _toMaxArmor = 0;

        get name(): string { return this._name }
        get damage(): number { return this._dmg }
        get multiplier(): number { return this._mul }
        get minRange(): number { return this._minRange }
        get maxRange(): number { return this._maxRange }
        get apCost(): number { return this._apCost }
        get twoHanded(): boolean { return this._twoHand }
        get toHit(): number { return this._toHit }
        get toEvasion(): number { return this._toEvasion }
        get toMinArmor(): number { return this._toMinArmor }
        get toMaxArmor(): number { return this._toMaxArmor }

        setDamage(multiplier: number, damage: number): Weapon {
            this._mul = multiplier;
            this._dmg = damage;
            return this;
        }

        setName(name: string): Weapon {
            this._name = name;
            return this;
        }

        setRange(min: number, max: number): Weapon {
            this._minRange = min;
            this._maxRange = max;
            return this;
        }

        setCost(cost: number): Weapon {
            this._apCost = cost;
            return this;
        }

        setTwohanded(): Weapon {
            this._twoHand = true;
            return this;
        }

        setBonuses(hit: number, evasion: number, armorMin: number, armorMax: number): Weapon {
            this._toHit = hit;
            this._toEvasion = evasion;
            this._toMinArmor = armorMin;
            this.toMaxArmor = armorMax;
            return this;
        }

        static None = new Weapon();
    }
}