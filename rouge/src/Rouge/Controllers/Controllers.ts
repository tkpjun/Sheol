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

    export function isPassable(loc: ILocation, level: Dungeon.Level): boolean {
        var cell = level.map[loc.x + "," + loc.y];
        return cell !== " ";
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