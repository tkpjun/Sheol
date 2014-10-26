module Common.Items {

    export enum Weapons {
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

    export enum Armors {
        Coat,
        LeatherArmor,
        MailShirt,
        Hauberk,
        Lamellar,
        Gloves,
        Gauntlets,
        Hat,
        Helmet,
        FullHelm,
        Boots,
        Greaves
    }

    export enum WeaponTypes {
        Normal,
        Offhand,
        Twohanded,
        Ranged
    }

    export enum ArmorTypes {
        Head,
        Legs,
        Arms,
        Body
    }

    export function getWeapon(which: Weapons): Weapon {
        var weapon;
        switch (which) {
            case Weapons.Dagger:
                weapon = new Weapon().
                    setName("dagger").
                    setType(WeaponTypes.Normal).
                    setDamage(4, 4).
                    setRange(0, 2).
                    setCost(2).
                    setDurability(50).
                    setBonuses(0, 1, 0, 0);
                break;
            case Weapons.ShortSword:
                weapon = new Weapon().
                    setName("short sword").
                    setType(WeaponTypes.Normal).
                    setDamage(4, 6).
                    setRange(0, 2).
                    setDurability(40).
                    setCost(3)
                break;
            case Weapons.Broadsword:
                weapon = new Weapon().
                    setName("broadsword").
                    setType(WeaponTypes.Normal).
                    setDamage(3, 7).
                    setRange(2, 3).
                    setDurability(30).
                    setCost(3)
                break;
            case Weapons.Mace:
                weapon = new Weapon().
                    setName("mace").
                    setType(WeaponTypes.Normal).
                    setDamage(1, 15).
                    setRange(2, 3).
                    setDurability(45).
                    setCost(3);
                break;
            case Weapons.HandAxe:
                weapon = new Weapon().
                    setName("hand axe").
                    setType(WeaponTypes.Normal).
                    setDamage(3, 7).
                    setRange(0, 2).
                    setDurability(30).
                    setCost(3)
                break;
            case Weapons.BattleAxe:
                weapon = new Weapon().
                    setName("battle axe").
                    setType(WeaponTypes.Normal).
                    setDamage(2, 8).
                    setRange(2, 3).
                    setDurability(30).
                    setCost(3);
                break;
            case Weapons.Mattock:
                weapon = new Weapon().
                    setName("mattock").
                    setType(WeaponTypes.Normal).
                    setDamage(1, 14).
                    setRange(2, 3).
                    setCost(3).
                    setDurability(30).
                    setBonuses(-2, 0, 0, 0);
                break;
            case Weapons.Spear:
                weapon = new Weapon().
                    setName("spear").
                    setType(WeaponTypes.Normal).
                    setDamage(2, 7).
                    setRange(3, 5).
                    setDurability(45).
                    setCost(3);
                break;
            case Weapons.Pike:
                weapon = new Weapon().
                    setName("pike").
                    setType(WeaponTypes.Twohanded).
                    setDamage(2, 10).
                    setRange(4, 7).
                    setCost(4).
                    setDurability(45)
                break;
            case Weapons.Halberd:
                weapon = new Weapon().
                    setName("halberd").
                    setType(WeaponTypes.Twohanded).
                    setDamage(2, 11).
                    setRange(3, 5).
                    setCost(4).
                    setDurability(30)
                break;
            case Weapons.Maul:
                weapon = new Weapon().
                    setName("maul").
                    setType(WeaponTypes.Twohanded).
                    setDamage(1, 25).
                    setRange(2, 3).
                    setCost(5).
                    setDurability(45)
                break;
            case Weapons.Greataxe:
                weapon = new Weapon().
                    setName("great axe").
                    setType(WeaponTypes.Twohanded).
                    setDamage(2, 12).
                    setRange(3, 4).
                    setCost(4).
                    setDurability(30)
                break;
            case Weapons.LongSword:
                weapon = new Weapon().
                    setName("long sword").
                    setType(WeaponTypes.Twohanded).
                    setDamage(3, 9).
                    setRange(2, 4).
                    setCost(4).
                    setDurability(30)
                break;
            case Weapons.RoundShield:
                weapon = new Weapon().
                    setName("round shield").
                    setType(WeaponTypes.Offhand).
                    setDamage(3, 5).
                    setRange(2, 2).
                    setCost(3).
                    setDurability(60).
                    setBonuses(0, 4, 1, 2)
                break;
            case Weapons.TowerShield:
                weapon = new Weapon().
                    setName("tower shield").
                    setType(WeaponTypes.Offhand).
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

    export function getArmor(which: Armors): ArmorPiece {
        var piece;
        switch (which) {
            case Armors.Coat:
                piece = new ArmorPiece().
                    setName("wool coat").
                    setType(ArmorTypes.Body).
                    setArmor(0, 2).
                    setBonuses(0, 2).
                    setDurability(70);
                break;
            case Armors.LeatherArmor:
                piece = new ArmorPiece().
                    setName("leather armor").
                    setType(ArmorTypes.Body).
                    setArmor(0, 4).
                    setBonuses(0, 1).
                    setDurability(90);
                break;
            case Armors.MailShirt:
                piece = new ArmorPiece().
                    setName("mail shirt").
                    setType(ArmorTypes.Body).
                    setArmor(1, 4).
                    setBonuses(0, 0).
                    setDurability(100);
                break;
            case Armors.Hauberk:
                piece = new ArmorPiece().
                    setName("mail hauberk").
                    setType(ArmorTypes.Body).
                    setArmor(2, 5).
                    setBonuses(0, 0).
                    setDurability(120);
                break;
            case Armors.Lamellar:
                piece = new ArmorPiece().
                    setName("lamellar armour").
                    setType(ArmorTypes.Body).
                    setArmor(3, 6).
                    setBonuses(-1, -1).
                    setDurability(90);
                break;
            case Armors.Gloves:
                piece = new ArmorPiece().
                    setName("leather gloves").
                    setType(ArmorTypes.Arms).
                    setArmor(0, 1).
                    setBonuses(0, 1).
                    setDurability(70);
                break;
            case Armors.Gauntlets:
                piece = new ArmorPiece().
                    setName("mail gauntlets").
                    setType(ArmorTypes.Arms).
                    setArmor(1, 2).
                    setBonuses(-1, 0).
                    setDurability(90);
                break;
            case Armors.Boots:
                piece = new ArmorPiece().
                    setName("leather boots").
                    setType(ArmorTypes.Legs).
                    setArmor(0, 1).
                    setBonuses(0, 1).
                    setDurability(70);
                break;
            case Armors.Greaves:
                piece = new ArmorPiece().
                    setName("greaves").
                    setType(ArmorTypes.Legs).
                    setArmor(1, 2).
                    setBonuses(0, 0).
                    setDurability(90);
                break;
            case Armors.Hat:
                piece = new ArmorPiece().
                    setName("leather hat").
                    setType(ArmorTypes.Head).
                    setArmor(0, 1).
                    setBonuses(0, 0).
                    setDurability(70);
                break;
            case Armors.Helmet:
                piece = new ArmorPiece().
                    setName("helmet").
                    setType(ArmorTypes.Head).
                    setArmor(1, 1).
                    setBonuses(0, 0).
                    setDurability(100);
                break;
            case Armors.FullHelm:
                piece = new ArmorPiece().
                    setName("full helm").
                    setType(ArmorTypes.Head).
                    setArmor(2, 3).
                    setBonuses(-2, 0).
                    setDurability(120);
                break;
        }
        return piece;
    }
}