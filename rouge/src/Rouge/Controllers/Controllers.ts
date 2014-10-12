module Rouge.Controllers {

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

    export function isPassable(loc: ILocation, level: Dungeon.Level, from?: ILocation): boolean {
        var cell = level.map[loc.x + "," + loc.y];
        if (from) {
            if (diagonal(from, loc)) {
                var cell2 = level.map[loc.x + "," + from.y];
                var cell3 = level.map[from.x + "," + loc.y];
                return cell !== " " && cell2 !== " " && cell3 !== " ";
            }
        }       
        return cell !== " ";
    }

    export function diagonal(loc: ILocation, neighbor: ILocation): boolean {
        if (Math.abs(loc.x - neighbor.x) == 1 &&
            Math.abs(loc.y - neighbor.y) == 1) {
            return true;
        }
        else
            return false;
    }

    export function planAction(entity: IEntity, level: Dungeon.Level) {

        if (entity instanceof Entities.PlayerChar) {
            Player.activate(<Entities.PlayerChar>entity, level);
        }
        else if (entity instanceof Entities.Enemy) {
            var enemy = <Entities.Enemy>entity;
            enemy.nextAction = () => { enemy.stats.ap = 2; enemy.active = false; }
        }
    }
}