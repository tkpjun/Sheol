module Rouge.Items {

    export class ArmorPiece implements IItem {

        private _name: string;
        private _description: string;
        private _type: ArmorTypes;
        private _durability: number;
        private _weight: number;
        private _toHit = 0;
        private _toEvasion = 0;
        private _toMinArmor = 0;
        private _toMaxArmor = 0;

        get name(): string { return this._name }
        get description(): string { return this._description }
        get type(): ArmorTypes { return this._type }
        get durability(): number { return this._durability }
        get weight(): number { return this._weight }
        get toHit(): number { return this._toHit }
        get toEvasion(): number { return this._toEvasion }
        get toMinArmor(): number { return this._toMinArmor }
        get toMaxArmor(): number { return this._toMaxArmor }

        setName(name: string): ArmorPiece {
            this._name = name;
            return this;
        }
        setDescription(description: string): ArmorPiece {
            this._description = description;
            return this;
        }

        setType(type: ArmorTypes): ArmorPiece {
            this._type = type;
            return this;
        }

        setDurability(amount: number): ArmorPiece {
            this._durability = amount;
            return this;
        }

        setWeight(amount: number): ArmorPiece {
            this._weight = amount;
            return this;
        }

        setArmor(min: number, max: number): ArmorPiece {
            this._toMinArmor = min;
            this._toMaxArmor = max;
            return this;
        }

        setBonuses(hit: number, evasion: number): ArmorPiece {
            this._toHit = hit;
            this._toEvasion = evasion;
            return this;
        }

        static None = new ArmorPiece().setName("none");
    }
} 