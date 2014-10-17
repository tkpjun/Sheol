module Rouge.Controllers {

    export enum Direction {
        North, 
        South,
        West,
        East,
        Northwest,
        Northeast,
        Southwest,
        Southeast
    }

    export interface ILocation {
        x: number
        y: number
    }

    export function isPassable(loc: ILocation, level: Dungeon.Level, from?: ILocation): boolean {
        if (loc.x < 1 || loc.y < 1 || loc.x > level.map._width - 2 || loc.y > level.map._height - 2)
            return false;

        var cell = level.map[loc.x + "," + loc.y];
        
        if (from) {
            if (diagonalNbors(from, loc)) {
                var cell2 = level.map[loc.x + "," + from.y];
                var cell3 = level.map[from.x + "," + loc.y];
                return cell !== " " && cell2 !== " " && cell3 !== " ";
            }
        }

        var entitiesOK = true;
        level.entities.forEach((e) => {
            if (loc.x == e.x && loc.y == e.y)
                entitiesOK = false;
        });
        return cell !== " " && entitiesOK;
    }

    export function diagonalNbors(loc: ILocation, neighbor: ILocation): boolean {
        if (Math.abs(loc.x - neighbor.x) == 1 &&
            Math.abs(loc.y - neighbor.y) == 1) {
            return true;
        }
        else
            return false;
    }

    export function diagonal(loc: ILocation, other: ILocation): boolean {
        if (Math.abs(loc.x - other.x) == Math.abs(loc.y - other.y)) {
            return true;
        }
        else
            return false;
    }

    export function planAction(entity: IEntity, manager: EntityManager) {

        if (entity instanceof Entities.PlayerChar) {
            Player.activate(<Entities.PlayerChar>entity, manager);
        }
        else if (entity instanceof Entities.Enemy) {
            var enemy = <Entities.Enemy>entity;
            enemy.nextAction = () => { enemy.stats.ap = 2; enemy.active = false; }
        }
    }
}