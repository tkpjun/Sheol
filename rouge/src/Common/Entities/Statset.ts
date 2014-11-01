module Common.Entities {

    export class Statset {

        hp: number;
        hpMax: number;
        ap: number;
        apMax: number;
        stamina: number;
        staminaMax: number;
        equipWeight: number;
        exp: number;

        constructor(maxHp: number, maxStamina: number, maxAP: number, eqWt: number) {
            this.hp = maxHp;
            this.hpMax = maxHp;
            this.ap = maxAP;
            this.apMax = maxAP;
            this.stamina = maxStamina;
            this.staminaMax = maxStamina;
            this.equipWeight = eqWt;
            this.exp = 0;
        }

        setHP(val: number): Statset {
            this.hp = val;
            return this;
        }

        setAP(val: number): Statset {
            this.ap = val;
            return this;
        }

        setStamina(val: number): Statset {
            this.stamina = val;
            return this;
        }
    }
} 