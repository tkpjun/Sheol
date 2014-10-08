module Rouge.Entities {

    export class AttackResult {

        attacker: Entity;
        defender: Entity;
        attackDmg: number;
        attackMul: number;
        hitRoll: number;
        evadeRoll: number;
        armorRolls: Array<number>;
        finalDmg: number;

        constructor(attack: Attack, defender: Entity, evadeSkill: Skill, armorMin: number, armorMax: number) {
            this.attacker = attack.user;
            this.attackDmg = attack.damage;
            this.attackMul = attack.multiplier;
            this.hitRoll = Math.ceil(ROT.RNG.getUniform() * 20) + attack.hitSkill.value;
            this.defender = defender;
            this.evadeRoll = Math.ceil(ROT.RNG.getUniform() * 20) + evadeSkill.value;
            //evades and crits not implemented, only rolls
            this.armorRolls = new Array<number>();
            for (var i = 0; i < this.attackMul; i++) {
                var roll = Math.floor(ROT.RNG.getUniform() * (armorMax - armorMin)) + armorMin;
                this.armorRolls.push(roll);
            }
            this.finalDmg = 0;
            for (var j = 0; j < this.attackMul; j++) {
                this.finalDmg += Math.max(0, this.attackDmg - this.armorRolls[i]);
            }
        }
    }
}