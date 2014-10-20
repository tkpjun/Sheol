module Rouge.Entities {

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
                return new Enemy(name, new Statset(80, 6, 20, 10));
                break;
        }
    }
}