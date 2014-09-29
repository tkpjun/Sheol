module Rouge.Entities {

    export class Stats {

        hp: number;
        hpMax: number;
        ap: number;
        apMax: number;
        endurance: number;
        enduranceMax: number;
        equipWeight: number;
        exp: number;

        constructor(maxHp: number, maxAP: number, maxEnd: number, eqWt: number) {
            this.hp = maxHp;
            this.hpMax = maxHp;
            this.ap = maxAP;
            this.apMax = maxAP;
            this.endurance = maxEnd;
            this.enduranceMax = maxEnd;
            this.equipWeight = eqWt;
            this.exp = 0;
        }

        setHP(val: number): Stats {
            this.hp = val;
            return this;
        }

        setAP(val: number): Stats {
            this.ap = val;
            return this;
        }

        setEndurance(val: number): Stats {
            this.endurance = val;
            return this;
        }
    }
} 