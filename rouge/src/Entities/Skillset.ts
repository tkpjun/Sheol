module Rouge.Entities {

    export class Skillset {

        prowess: Skill;
        perception: Skill;
        wrestling: Skill;
        evasion: Skill;
        fortitude: Skill;
        will: Skill;
        stealth: Skill;

        constructor() {
            this.prowess = new Skill(Skills.prowess, 0);
            this.perception = new Skill(Skills.perception, 0);
            this.wrestling = new Skill(Skills.wrestling, 0);
            this.evasion = new Skill(Skills.evasion, 0);
            this.fortitude = new Skill(Skills.fortitude, 0);
            this.will = new Skill(Skills.will, 0);
            this.stealth = new Skill(Skills.stealth, 0);
        }

        setProwess(amount: number): Skillset {
            this.prowess.value = amount;
            return this;
        }

        setEvasion(amount: number): Skillset {
            this.evasion.value = amount;
            return this;
        }
    }
}