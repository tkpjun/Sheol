module Rouge.Controllers.Player {

    enum States {
        Move,
        Attack,
        Inactive
    }

    var char: Entities.PlayerChar;
    var lvl: Dungeon.Level;
    var state = States.Inactive;
    var manager: EntityManager;
    var con: IConsole;
    var callback;

    export function initialize(console: IConsole, entityManager: EntityManager) {
        manager = entityManager;
        con = console;
        callback = (x, y) => {
            return Controllers.isPassable({ x: x, y: y }, manager.level);
        }
    }

    export function activate(character: Entities.PlayerChar) {
        if (state == States.Inactive) {
            char = character;
            lvl = manager.level;
            state = States.Move;
            /*
            callback = (x, y, from: Controllers.ILocation) => {
                return Controllers.isPassable({ x: x, y: y }, manager.level, from);
            }*/
            manager.currPath.unwrap = new AstarPath(callback, { x: char.x, y: char.y });
        }
    }

    export function updateClick(x: number, y: number) {
        if (state == States.Inactive) return;

        var path = manager.currPath.unwrap;
        if (path && x == path.pointer.x && y == path.pointer.y) {
            confirm();
        }  
        else if (state == States.Move) {
            var oldPath = manager.currPath.unwrap;
            var newPath = new AstarPath(callback, { x: char.x, y: char.y }, { x: x, y: y }, char.stats.ap);
            if (!oldPath || newPath.pointer.x != oldPath.pointer.x || newPath.pointer.y != oldPath.pointer.y) {
                manager.currPath.unwrap = newPath;
            }
        }
        else if (state == States.Attack) {
            var oPath = manager.currPath.unwrap;
            var nPath = new StraightPath(callback, { x: char.x, y: char.y }, { x: x, y: y }, char.equipment.rightWeapon.maxRange);
            if (!oPath || nPath.pointer.x != oPath.pointer.x || nPath.pointer.y != oPath.pointer.y) {
                manager.currPath.unwrap = nPath;
            }
        }
    }

    export function updateMousemove(x: number, y: number) {
        if (state == States.Move) {
            var oldPath = manager.currPath.unwrap;
            var newPath = new AstarPath(callback, { x: char.x, y: char.y }, { x: x, y: y }, char.stats.ap);
            if (!oldPath || newPath.pointer.x != oldPath.pointer.x || newPath.pointer.y != oldPath.pointer.y) {
                manager.currPath.unwrap = newPath;
            }
        }
        else if (state == States.Attack) {
            var oPath = manager.currPath.unwrap;
            var nPath = new StraightPath(callback, { x: char.x, y: char.y }, { x: x, y: y }, char.equipment.rightWeapon.maxRange);
            if (!oPath || nPath.pointer.x != oPath.pointer.x || nPath.pointer.y != oPath.pointer.y) {
                manager.currPath.unwrap = nPath;
            }
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
                manager.currPath.unwrap = null;
                console.log("char: " + state);
                break;
            case "VK_2":
                state = States.Attack;
                manager.currPath.unwrap = null;
                console.log("char: " + state);
                break;
            default:
                break;
        }

    }

    function alterPath(dir: Direction) {
        var oldPath = manager.currPath.unwrap;
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
            manager.currPath.unwrap = new AstarPath(callback, oldPath.begin, location, char.stats.ap);
        else if (state == States.Attack)
            manager.currPath.unwrap = new StraightPath(callback, oldPath.begin, location, char.equipment.rightWeapon.maxRange);
        else
            throw ("Unimplemented state!");
    }

    function endTurn() {
        char.nextAction = () => {
            char._hasTurn = false;
            state = States.Inactive;
            manager.currPath.unwrap = null;
        }
    }

    function confirm() {
        var path = manager.currPath.unwrap;
        switch (state){
            case States.Move:
                char.nextAction = () => {
                    var limited = path.trim();
                    char.x = limited._nodes[path.limitedNodes().length - 1].x;
                    char.y = limited._nodes[path.limitedNodes().length - 1].y;
                    char.stats.ap -= limited.cost();
                    manager.currPath.unwrap = new AstarPath(callback, { x: char.x, y: char.y });

                    if (!char.hasAP()) {
                        state = States.Inactive;
                    }
                }
                break;
            case States.Attack:
                char.nextAction = () => {
                    var limited = path.trim();
                    var result;

                    var targets = lvl.entities.filter((entity) => {
                        return entity.x === limited.pointer.x && entity.y === limited.pointer.y;
                    });
                    if (targets[0] && char.stats.ap >= char.equipment.rightWeapon.apCost) {
                        char.stats.ap -= char.equipment.rightWeapon.apCost;
                        char.equipment.rightWeapon.setDurability(char.equipment.rightWeapon.durability - 1);
                        result = (<Entities.Entity>targets[0]).getStruck(char.getAttack());
                        con.addLine(result.attacker.name + " hit " + result.defender.name + " for " +
                            result.finalDmg + " damage! - Hit roll: " + (result.hitRoll - result.attacker.skills.prowess.value) +
                            "+" + result.attacker.skills.prowess.value + " vs " + (result.evadeRoll - result.defender.skills.evasion.value) +
                            "+" + result.defender.skills.evasion.value + " - Armor rolls: " + result.armorRolls.toString() + " -");
                    }
                    else if (char.stats.ap < char.equipment.rightWeapon.apCost) {
                        con.addLine("You need " + char.equipment.rightWeapon.apCost + " AP to attack with a " + char.equipment.rightWeapon.name + "!")
                    }

                    manager.currPath.unwrap = new StraightPath(callback,
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