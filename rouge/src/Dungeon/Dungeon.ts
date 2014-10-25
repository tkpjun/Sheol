module Rouge.Dungeon {

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
                map = new ROT.Map.Digger(200, Const.MAP_HEIGHT, {
                    dugPercentage: 0.55,
                    roomWidth: [4, 9],
                    roomHeight: [3, 7],
                    corridorLength: [1, 5],
                    timeLimit: 1000
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

} 