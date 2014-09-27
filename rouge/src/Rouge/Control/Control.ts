module Rouge.Control {

    export enum Direction {
        NORTH, 
        SOUTH,
        WEST,
        EAST,
        NORTHWEST,
        NORTHEAST,
        SOUTHWEST,
        SOUTHEAST
    }

    export interface Location {
        x: number
        y: number
    }

    export function isPassable(x: number, y: number, map: ROT.IMap): boolean {
        var cell = map[x + "," + y];
        //return cell === 0;
        return true;
    }

    export function planAction(entity: IEntity, level: Dungeon.Level) {

        if (entity instanceof Entities.PlayerChar) {

        }
        else {

        }
    }
}