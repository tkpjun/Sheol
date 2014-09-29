module Rouge.Controllers.Player {

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

    export interface ILocation {
        x: number
        y: number
    }

    export function isPassable(loc: ILocation, map: ROT.IMap): boolean {
        var cell = map[loc.x + "," + loc.y];
        //return cell === 0;
        return true;
    }

    export function planAction(entity: IEntity, level: Dungeon.Level) {

        if (entity instanceof Entities.PlayerChar) {
            Player.activate(<Entities.PlayerChar>entity, level.map);
        }
        else {

        }
    }
}