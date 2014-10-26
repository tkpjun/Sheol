module Common.Entities {

    export class Attack {

        user: Entity;
        damage: number;
        multiplier: number;
        hitSkill: Skill;

        constructor(user: Entity, damage: number, multiplier: number, hitSkill: Skill) {
            this.user = user;
            this.damage = damage;
            this.multiplier = multiplier;
            this.hitSkill = hitSkill;
        }
    }
}