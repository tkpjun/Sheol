module Common.Entities {

    export enum Skills {
        prowess,
        perception,
        wrestling,
        evasion,
        fortitude,
        will,
        stealth
    }

    export function getEnemy(name: string) {
        switch (name) {
            default:
                return new Enemy(name, new Statset(30, 15, 8, 10));
                break;
        }
    }
}