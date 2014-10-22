module Rouge.Entities {

    export class Equipment {       

        leftWeapon: Items.Weapon;
        rightWeapon: Items.Weapon;
        noWeaponSlots: boolean = false;

        constructor() {
            this.leftWeapon = Items.Weapon.None;
            this.rightWeapon = Items.Weapon.None;
        }

        equipWeapon(weapon: Items.Weapon, slot: WeaponSlots): Equipment {
            if (this.noWeaponSlots) throw ("Can't equip weapons!");
            switch (slot) {
                case WeaponSlots.Left:
                    this.leftWeapon = weapon;
                    break;
                case WeaponSlots.Right:
                    this.rightWeapon = weapon;
                    break;
            }
            return this;
        }

        unequipWeapon(slot: WeaponSlots): Items.Weapon {
            var removed = Items.Weapon.None;
            switch (slot) {
                case WeaponSlots.Left:
                    removed = this.leftWeapon;
                    this.leftWeapon = Items.Weapon.None;
                    break;
                case WeaponSlots.Right:
                    removed = this.leftWeapon;
                    this.rightWeapon = Items.Weapon.None;
                    break;
            }
            return removed;
        }
    }

    export enum WeaponSlots {
        Left,
        Right,
        Ranged
    }
}