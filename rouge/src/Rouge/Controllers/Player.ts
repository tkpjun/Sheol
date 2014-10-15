module Rouge.Controllers.Player {

    var char: Entities.PlayerChar;
    var lvl: Dungeon.Level;
    var playerTurn = false;

    export function activate(character: Entities.PlayerChar, level: Dungeon.Level) {
        if (!playerTurn) {
            char = character;
            lvl = level;
            playerTurn = true;
        }
    }

    export function updateClick(x: number, y: number, manager: EntityManager) {
        if (!playerTurn) return;
        if (x < 0 || y < 0) throw (char.x + "," + char.y + " to " + x + "," + y);

        var path = manager.currPath.property;
        if (path && x == path.pointer.x && y == path.pointer.y) {
            char.nextAction = () => {
                char.x = path.nodes()[path.nodes().length - 1].x;
                char.y = path.nodes()[path.nodes().length - 1].y;
                char.stats.ap -= path.cost();

                if (!char.hasAP()) {
                    playerTurn = false;
                }
            }
            manager.currPath.property = null;
        }
        else {
            manager.currPath.property = new Path(char, (x, y, from: Controllers.ILocation) => {
                    return Controllers.isPassable({ x: x, y: y }, manager.level, from);
                },
                { x: char.x, y: char.y },
                { x: x, y: y }).trim(char.stats.ap);
        }       
    }

    export function update(key) {
        if (!playerTurn) return;

        switch (key) {
            case "VK_Q":
                tryMove(Direction.NORTHWEST);
                break;
            case "VK_W":
                tryMove(Direction.NORTH);
                break;
            case "VK_E":
                tryMove(Direction.NORTHEAST);
                break;
            case "VK_A":
                tryMove(Direction.WEST);
                break;
            case "VK_D":
                tryMove(Direction.EAST);
                break;
            case "VK_Z":
                tryMove(Direction.SOUTHWEST);
                break;
            case "VK_X":
                tryMove(Direction.SOUTH);
                break;
            case "VK_C":
                tryMove(Direction.SOUTHEAST);
                break;
            case "VK_SPACE":
                endTurn();
                break;
            default:
                break;
        }

    }

    function tryMove(dir: Direction) {
        var location: ILocation;
        switch (dir) {
            case Direction.NORTHWEST:
                location = { x: char.x - 1, y: char.y - 1 };
                break;
            case Direction.NORTH:
                location = { x: char.x, y: char.y - 1 };
                break;
            case Direction.NORTHEAST:
                location = { x: char.x + 1, y: char.y - 1 };
                break;
            case Direction.WEST:
                location = { x: char.x - 1, y: char.y };
                break;
            case Direction.EAST:
                location = { x: char.x + 1, y: char.y };
                break;
            case Direction.SOUTHWEST:
                location = { x: char.x - 1, y: char.y + 1 };
                break;
            case Direction.SOUTH:
                location = { x: char.x, y: char.y + 1 };
                break;
            case Direction.SOUTHEAST:
                location = { x: char.x + 1, y: char.y + 1 };
                break;
        }

        function apCost() {
            if (dir === Direction.NORTH || dir === Direction.SOUTH || dir === Direction.WEST || dir === Direction.EAST) {
                return 2;
            }
            else {
                return 3;
            }
        }

        function canPass() {
            switch (dir) {
                case Direction.NORTHWEST:
                    return isPassable(location, lvl) &&
                           isPassable({ x: location.x + 1, y: location.y }, lvl) &&
                           isPassable({ x: location.x, y: location.y + 1 }, lvl);
                    break;
                case Direction.NORTHEAST:
                    return isPassable(location, lvl) &&
                        isPassable({ x: location.x - 1, y: location.y }, lvl) &&
                        isPassable({ x: location.x, y: location.y + 1 }, lvl);
                    break;
                case Direction.SOUTHWEST:
                    return isPassable(location, lvl) &&
                        isPassable({ x: location.x + 1, y: location.y }, lvl) &&
                        isPassable({ x: location.x, y: location.y - 1 }, lvl);
                    break;
                case Direction.SOUTHEAST:
                    return isPassable(location, lvl) &&
                        isPassable({ x: location.x - 1, y: location.y }, lvl) &&
                        isPassable({ x: location.x, y: location.y - 1 }, lvl);
                    break;
                default:
                    return isPassable(location, lvl);
                    break;
            }
        }

        if (canPass() && char.stats.ap >= apCost()) {
            char.nextAction = () => {
                char.x = location.x;
                char.y = location.y;
                char.stats.ap -= apCost();

                if (!char.hasAP()) {
                    playerTurn = false;
                }
            }
        }
    }

    function endTurn() {
        char.nextAction = () => {
            char.active = false;
            playerTurn = false;
        }
    }
} 