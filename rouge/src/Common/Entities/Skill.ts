module Common.Entities {

    export class Skill {

        which: Skills;
        value: number;

        constructor(which: Skills, value: number) {
            this.which = which;
            this.value = value;
        }
    }

} 