﻿module Rouge.Controllers.Player {

    var char: Entities.PlayerChar;
    var lvl: Dungeon.Level;
    var playerTurn = false;
    var manager: EntityManager;
    var callback;

    export function activate(character: Entities.PlayerChar, entityManager: EntityManager) {
        if (!playerTurn) {
            char = character;
            lvl = entityManager.level;
            playerTurn = true;
            manager = entityManager;
            callback = (x, y, from: Controllers.ILocation) => {
                return Controllers.isPassable({ x: x, y: y }, manager.level, from);
            }
            manager.currPath.property = new Path(callback, { x: char.x, y: char.y });
        }
    }

    export function updateClick(x: number, y: number) {
        if (!playerTurn) return;
        if (x < 0 || y < 0) throw (char.x + "," + char.y + " to " + x + "," + y);

        var path = manager.currPath.property;
        if (path && x == path.pointer.x && y == path.pointer.y) {
            confirm();            
        }
        else {
            manager.currPath.property = new Path((x, y, from: Controllers.ILocation) => {
                    return Controllers.isPassable({ x: x, y: y }, manager.level, from);
                },
                { x: char.x, y: char.y },
                { x: x, y: y });
        }       
    }


    export function update(key) {
        if (!playerTurn) return;

        switch (key) {
            case "VK_Q":
                alterPath(Direction.NORTHWEST);
                break;
            case "VK_W":
                alterPath(Direction.NORTH);
                break;
            case "VK_E":
                alterPath(Direction.NORTHEAST);
                break;
            case "VK_A":
                alterPath(Direction.WEST);
                break;
            case "VK_D":
                alterPath(Direction.EAST);
                break;
            case "VK_Z":
                alterPath(Direction.SOUTHWEST);
                break;
            case "VK_X":
                alterPath(Direction.SOUTH);
                break;
            case "VK_C":
                alterPath(Direction.SOUTHEAST);
                break;
            case "VK_SPACE":
                endTurn();
                break;
            case "VK_F":
                confirm();
                break;
            default:
                break;
        }

    }

    function alterPath(dir: Direction) {
        var oldPath = manager.currPath.property;
        var location = oldPath.pointer;
        switch (dir) {
            case Direction.NORTHWEST:
                location = { x: location.x - 1, y: location.y - 1 };
                break;
            case Direction.NORTH:
                location = { x: location.x, y: location.y - 1 };
                break;
            case Direction.NORTHEAST:
                location = { x: location.x + 1, y: location.y - 1 };
                break;
            case Direction.WEST:
                location = { x: location.x - 1, y: location.y };
                break;
            case Direction.EAST:
                location = { x: location.x + 1, y: location.y };
                break;
            case Direction.SOUTHWEST:
                location = { x: location.x - 1, y: location.y + 1 };
                break;
            case Direction.SOUTH:
                location = { x: location.x, y: location.y + 1 };
                break;
            case Direction.SOUTHEAST:
                location = { x: location.x + 1, y: location.y + 1 };
                break;
        }
        manager.currPath.property = new Path(callback, oldPath.begin, location);
    }

    function endTurn() {
        char.nextAction = () => {
            char.active = false;
            playerTurn = false;
            manager.currPath.property = null;
        }
    }

    function confirm() {
        var path = manager.currPath.property;
        char.nextAction = () => {
            var limited = path.trim(char.stats.ap);
            char.x = limited.nodes()[path.nodes().length - 1].x;
            char.y = limited.nodes()[path.nodes().length - 1].y;
            char.stats.ap -= limited.cost();
            manager.currPath.property = new Path(callback, { x: char.x, y: char.y });

            if (!char.hasAP()) {
                playerTurn = false;
            }
        }
    }
} 