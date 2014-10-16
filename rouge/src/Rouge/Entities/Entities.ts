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
                return new Enemy(name, new Statset(300, 6, 100, 10));
                break;
        }
    }
}