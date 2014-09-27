module Rouge.Dungeon {

    export enum MapType {
        MINES,
        CAVE,
        HEART,
        TUTORIAL
    }

    export function createMap(type: MapType): ROT.IMap {
        var map;

        switch(type) {
            case MapType.MINES:
                map = new ROT.Map.Digger(80, 25, {
                    dugPercentage: 0.45,
                    roomWidth: [4, 10],
                    roomHeight: [3, 8],
                    corridorLength: [1, 5]
                });
                break;
        }

        var digCallback = (x, y, value) => {

            var key = x + "," + y;

            if (value)
                map[key] = "#";
            else {
                map[key] = " ";
            }
        }
        map.create(digCallback);
        return map;
    }

} 