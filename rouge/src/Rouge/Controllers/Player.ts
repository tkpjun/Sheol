module Rouge.Controllers.Player {

    enum States {
        Move,
        Melee,
        Ranged,
        Inactive
    }

    var char: Entities.PlayerChar;
    var lvl: Dungeon.Level;
    var state = States.Inactive;
    var manager: EntityManager;
    var callback;

    export function activate(character: Entities.PlayerChar, entityManager: EntityManager) {
        if (state == States.Inactive) {
            char = character;
            lvl = entityManager.level;
            state = States.Move;
            manager = entityManager;
            callback = (x, y, from: Controllers.ILocation) => {
                return Controllers.isPassable({ x: x, y: y }, manager.level, from);
            }
            manager.currPath.property = new AstarPath(callback, { x: char.x, y: char.y });
        }
    }

    export function updateClick(x: number, y: number) {
        if (state == States.Inactive) return;

        var path = manager.currPath.property;
        if (path && x == path.pointer.x && y == path.pointer.y) {
            confirm();            
        }
        else if(state == States.Move) {
            manager.currPath.property = new AstarPath(callback, { x: char.x, y: char.y }, { x: x, y: y }, char.stats.ap);
        }       
    }

    export function updateHover(x: number, y: number) {
        if (state != States.Melee && state != States.Ranged) return;

        var oldPath = manager.currPath.property;
        var newPath = new StraightPath(callback, { x: char.x, y: char.y }, { x: x, y: y }, char.equipment.rightWeapon.maxRange);
        if (!oldPath || newPath.pointer.x != oldPath.pointer.x || newPath.pointer.y != oldPath.pointer.y) {
            manager.currPath.property = newPath;
        }
    }

    export function update(key) {
        if (state == States.Inactive) return;

        switch (key) {
            case "VK_Q":
                alterPath(Direction.Northwest);
                break;
            case "VK_W":
                alterPath(Direction.North);
                break;
            case "VK_E":
                alterPath(Direction.Northeast);
                break;
            case "VK_A":
                alterPath(Direction.West);
                break;
            case "VK_D":
                alterPath(Direction.East);
                break;
            case "VK_Z":
                alterPath(Direction.Southwest);
                break;
            case "VK_X":
                alterPath(Direction.South);
                break;
            case "VK_C":
                alterPath(Direction.Southeast);
                break;
            case "VK_SPACE":
                endTurn();
                break;
            case "VK_F":
                confirm();
                break;
            case "VK_1":
                state = States.Move;
                manager.currPath.property = null;
                console.log("char: " + state);
                break;
            case "VK_2":
                state = States.Melee;
                manager.currPath.property = null;
                console.log("char: " + state);
                break;
            default:
                break;
        }

    }

    function alterPath(dir: Direction) {
        var oldPath = manager.currPath.property;
        var location = oldPath.pointer;
        switch (dir) {
            case Direction.Northwest:
                location = { x: location.x - 1, y: location.y - 1 };
                break;
            case Direction.North:
                location = { x: location.x, y: location.y - 1 };
                break;
            case Direction.Northeast:
                location = { x: location.x + 1, y: location.y - 1 };
                break;
            case Direction.West:
                location = { x: location.x - 1, y: location.y };
                break;
            case Direction.East:
                location = { x: location.x + 1, y: location.y };
                break;
            case Direction.Southwest:
                location = { x: location.x - 1, y: location.y + 1 };
                break;
            case Direction.South:
                location = { x: location.x, y: location.y + 1 };
                break;
            case Direction.Southeast:
                location = { x: location.x + 1, y: location.y + 1 };
                break;
        }
        if (location.x < 0) location.x = 0;
        if (location.y < 0) location.y = 0;
        if (location.x > lvl.map._width - 1) location.x = lvl.map._width - 1;
        if (location.y > lvl.map._height - 1) location.y = lvl.map._height - 1;

        if (state == States.Move)
            manager.currPath.property = new AstarPath(callback, oldPath.begin, location, char.stats.ap);
        else if (state == States.Melee)
            manager.currPath.property = new StraightPath(callback, oldPath.begin, location, char.equipment.rightWeapon.maxRange);
        else
            throw ("Unimplemented state!");
    }

    function endTurn() {
        char.nextAction = () => {
            char._hasTurn = false;
            state = States.Inactive;
            manager.currPath.property = null;
        }
    }

    function confirm() {
        var path = manager.currPath.property;
        switch (state){
            case States.Move:
                char.nextAction = () => {
                    var limited = path.trim();
                    char.x = limited._nodes[path.limitedNodes().length - 1].x;
                    char.y = limited._nodes[path.limitedNodes().length - 1].y;
                    char.stats.ap -= limited.cost();
                    manager.currPath.property = new AstarPath(callback, { x: char.x, y: char.y });

                    if (!char.hasAP()) {
                        state = States.Inactive;
                    }
                }
                break;
            case States.Melee:
                char.nextAction = () => {
                    var limited = path.trim();

                    throw ("TODO: attack enemy");

                    char.stats.ap -= char.equipment.rightWeapon.apCost;
                    manager.currPath.property = new StraightPath(callback,
                        { x: char.x, y: char.y },
                        { x: path._nodes[path._nodes.length - 1].x, y: path._nodes[path._nodes.length - 1].y });

                    if (!char.hasAP()) {
                        state = States.Inactive;
                    }
                }
                break;
            default:
                throw ("Bad state: " + state);
                break;
        }
    }
} 