module Rouge.Items {

    export enum Weapons {
        None,
        Dagger,
        ShortSword,
        Broadsword,
        Mace,
        HandAxe,
        BattleAxe,
        Spear,
        Pike,
        Mattock,
        Maul,
        Greataxe,
        LongSword,
        Halberd,
        RoundShield,
        TowerShield,
    }

    export function getWeapon(type: Weapons): Weapon {
        var weapon;
        switch (type) {
            case Weapons.Dagger:
                weapon = new Weapon().
                    setName("dagger").
                    setDamage(4, 4).
                    setRange(0, 2).
                    setCost(2).
                    setDurability(50).
                    setBonuses(0, 1, 0, 0);
                break;
            case Weapons.ShortSword:
                weapon = new Weapon().
                    setName("short sword").
                    setDamage(4, 6).
                    setRange(0, 2).
                    setDurability(40).
                    setCost(3)
                break;
            case Weapons.Broadsword:
                weapon = new Weapon().
                    setName("broadsword").
                    setDamage(3, 7).
                    setRange(2, 3).
                    setDurability(30).
                    setCost(3)
                break;
            case Weapons.Mace:
                weapon = new Weapon().
                    setName("mace").
                    setDamage(1, 15).
                    setRange(2, 3).
                    setDurability(45).
                    setCost(3);
                break;
            case Weapons.HandAxe:
                weapon = new Weapon().
                    setName("hand axe").
                    setDamage(3, 7).
                    setRange(0, 2).
                    setDurability(30).
                    setCost(3)
                break;
            case Weapons.BattleAxe:
                weapon = new Weapon().
                    setName("battle axe").
                    setDamage(2, 8).
                    setRange(2, 3).
                    setDurability(30).
                    setCost(3);
                break;
            case Weapons.Mattock:
                weapon = new Weapon().
                    setName("mattock").
                    setDamage(1, 14).
                    setRange(2, 3).
                    setCost(3).
                    setDurability(30).
                    setBonuses(-2, 0, 0, 0);
                break;
            case Weapons.Spear:
                weapon = new Weapon().
                    setName("spear").
                    setDamage(2, 7).
                    setRange(3, 5).
                    setDurability(45).
                    setCost(3);
                break;
            case Weapons.Pike:
                weapon = new Weapon().
                    setName("pike").
                    setDamage(2, 10).
                    setRange(4, 7).
                    setCost(4).
                    setDurability(30).
                    setDurability(45).
                    setTwohanded();
                break;
            case Weapons.Halberd:
                weapon = new Weapon().
                    setName("halberd").
                    setDamage(2, 11).
                    setRange(3, 5).
                    setCost(4).
                    setDurability(30).
                    setTwohanded();
                break;
            case Weapons.Maul:
                weapon = new Weapon().
                    setName("maul").
                    setDamage(1, 25).
                    setRange(2, 3).
                    setCost(5).
                    setDurability(45).
                    setTwohanded();
                break;
            case Weapons.Greataxe:
                weapon = new Weapon().
                    setName("great axe").
                    setDamage(2, 12).
                    setRange(3, 4).
                    setCost(4).
                    setDurability(30).
                    setTwohanded();
                break;
            case Weapons.LongSword:
                weapon = new Weapon().
                    setName("long sword").
                    setDamage(3, 9).
                    setRange(2, 4).
                    setCost(4).
                    setDurability(30).
                    setTwohanded();
                break;
            case Weapons.RoundShield:
                weapon = new Weapon().
                    setName("round shield").
                    setDamage(3, 5).
                    setRange(2, 2).
                    setCost(3).
                    setDurability(60).
                    setBonuses(0, 4, 1, 2)
                break;
            case Weapons.TowerShield:
                weapon = new Weapon().
                    setName("tower shield").
                    setDamage(3, 6).
                    setRange(2, 2).
                    setCost(4).
                    setDurability(80).
                    setBonuses(-2, 4, 2, 3)
                break;
            default:
                weapon = Weapon.None;
                break;
        }
        return weapon;
    }
}