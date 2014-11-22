module Common.Dungeon {

    export enum MapTypes {
        Mines,
        Cave,
        Heart,
        Tutorial
    }

    export function createMap(type: MapTypes): ROT.IMap {
        var map;

        switch(type) {
            case MapTypes.Mines:
                map = new ROT.Map.Digger(100, Settings.MapHeight, {
                    dugPercentage: 0.55,
                    roomWidth: [4, 9],
                    roomHeight: [3, 7],
                    corridorLength: [1, 5],
                    timeLimit: 3000
                });
                break;
        }

        var digCallback = (x, y, value) => {

            var key = x + "," + y;

            if (value)
                map[key] = " ";
            else {
                map[key] = ".";
            }
        }
        map.create(digCallback);
        return map;
    }

    export function addItems(level: Level) {
        var viableCells = new Array<IVector2>();
        for (var x = 0; x < level.map._width; x++) {
            for (var y = 0; y < level.map._height; y++) {
                if (level.map[x + "," + y] !== " ") {
                    viableCells.push({ x: x, y: y });
                }
            }
        }
        for (var times = 0; times < 15; times++) {
            var cell = viableCells[Math.floor(ROT.RNG.getUniform() * viableCells.length)];
            var weaponType = Math.floor(ROT.RNG.getUniform() * Object.keys(Items.Weapons).length / 2);
            var weapon = Items.getWeapon(weaponType);
            level.objects.push(new ItemObject(cell.x, cell.y, weapon));

            cell = viableCells[Math.floor(ROT.RNG.getUniform() * viableCells.length)];
            var armorType = Math.floor(ROT.RNG.getUniform() * Object.keys(Items.Armors).length / 2);
            var armor = Items.getArmor(armorType);
            level.objects.push(new ItemObject(cell.x, cell.y, armor));
        }
    }

    export function addEnemies(level: Level) {
        var viableCells = new Array<IVector2>();
        for (var x = 0; x < level.map._width; x++) {
            for (var y = 0; y < level.map._height; y++) {
                if (level.map[x + "," + y] !== " ") {
                    viableCells.push({ x: x, y: y });
                }
            }
        }
        for (var times = 0; times < 25; times++) {
            var cell = viableCells[Math.floor(ROT.RNG.getUniform() * viableCells.length)];
            var enemy = Entities.getEnemy("debug" + times);
            enemy.x = cell.x;
            enemy.y = cell.y;
            level.entities.push(enemy);
        }
    }
} 