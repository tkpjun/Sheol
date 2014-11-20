module Common.Controllers {

    export enum States {
        Move,
        Attack,
        Inactive
    }

    export function isPassable(user: IEntity, loc: IVector2, level: Dungeon.Level, from?: IVector2): boolean {
        if (loc.x < 1 || loc.y < 1 || loc.x > level.map._width - 2 || loc.y > level.map._height - 2)
            return false;
        if (loc.x == user.x && loc.y == user.y)
            return true;

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

    export function lightPasses(loc: IVector2, level: Dungeon.Level): boolean {
        var cell = level.map[loc.x + "," + loc.y];
        return cell !== " ";
    }

    export function diagonalNbors(loc: IVector2, neighbor: IVector2): boolean {
        if (Math.abs(loc.x - neighbor.x) == 1 &&
            Math.abs(loc.y - neighbor.y) == 1) {
            return true;
        }
        else
            return false;
    }

    export function diagonal(loc: IVector2, other: IVector2): boolean {
        if (Math.abs(loc.x - other.x) == Math.abs(loc.y - other.y)) {
            return true;
        }
        else
            return false;
    }
}