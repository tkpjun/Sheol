module Rouge.Entities {

    export class Equipment {       

        mainHand: Items.Weapon;
        offHand: Items.Weapon;
        ranged: Items.Weapon;
        head: Items.ArmorPiece;
        arms: Items.ArmorPiece;
        body: Items.ArmorPiece;
        legs: Items.ArmorPiece;

        constructor() {
            this.mainHand = Items.Weapon.None;
            this.offHand = Items.Weapon.None;
        }

        equipWeapon(weapon: Items.Weapon, offHand?: boolean): Items.Weapon[] {
            var removed = new Array<Items.Weapon>();
            switch (weapon.type) {
                case Items.WeaponTypes.Offhand:
                    if(this.mainHand.type != Items.WeaponTypes.Twohanded)
                    removed.push(this.offHand);
                    this.offHand = weapon;
                    break;
                case Items.WeaponTypes.Ranged:
                    removed.push(this.ranged);
                    this.ranged = weapon;
                    break;
                case Items.WeaponTypes.Twohanded:
                    removed.push(this.mainHand);
                    if (this.offHand != Items.Weapon.None)
                        removed.push(this.offHand);
                    this.mainHand = weapon;
                    break;
                case Items.WeaponTypes.Normal:
                    if (!offHand) {
                        removed.push(this.mainHand);
                        this.mainHand = weapon;
                    }
                    else {
                        removed.push(this.offHand);
                        this.offHand = weapon;
                    }
                    break;
            }
            return removed;
        }

        unequipWeapon(slot: string): Items.Weapon {
            var removed = Items.Weapon.None;
            switch (slot) {
                case "mainhand":
                    removed = this.mainHand;
                    this.mainHand = Items.Weapon.None;
                    break;
                case "offhand":
                    removed = this.mainHand;
                    this.offHand = Items.Weapon.None;
                    break;
                case "ranged":
                    removed = this.ranged;
                    this.ranged = Items.Weapon.None;
                    break;
            }
            return removed;
        }

        equipArmor(piece: Items.ArmorPiece): Items.ArmorPiece {
            var removed = Items.ArmorPiece.None;
            switch (piece.type) {
                case Items.ArmorTypes.Head:
                    if (this.head !== Items.ArmorPiece.None)
                        removed = this.head;
                    this.head = piece;
                    break;
                case Items.ArmorTypes.Arms:
                    if (this.arms !== Items.ArmorPiece.None)
                        removed = this.arms;
                    this.arms = piece;
                    break;
                case Items.ArmorTypes.Body:
                    if (this.body !== Items.ArmorPiece.None)
                        removed = this.body;
                    this.body = piece;
                    break;
                case Items.ArmorTypes.Legs:
                    if (this.legs !== Items.ArmorPiece.None)
                        removed = this.legs;
                    this.legs = piece;
                    break;
            }
            return removed;
        }

        unequipArmor(slot: string): Items.ArmorPiece {
            var removed = Items.ArmorPiece.None;
            switch (slot) {
                case "head":
                    removed = this.head;
                    this.mainHand = Items.Weapon.None;
                    break;
                case "arms":
                    removed = this.arms;
                    this.offHand = Items.Weapon.None;
                    break;
                case "body":
                    removed = this.body;
                    this.ranged = Items.Weapon.None;
                    break;
                case "legs":
                    removed = this.legs;
                    this.ranged = Items.Weapon.None;
                    break;
            }
            return removed;
        }
    }

}