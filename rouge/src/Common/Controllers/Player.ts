module Common.Controllers.Player { 

    var char: Entities.PlayerChar;
    var lvl: Dungeon.Level;
    var state = States.Inactive;
    var manager: EntityManager;
    var con: IConsole;
    var callback;

    export function initialize(console: IConsole, entityManager: EntityManager) {
        manager = entityManager;
        con = console;
    }

    export function activate(character: Entities.PlayerChar) {
        if (state == States.Inactive) {
            char = character;
            callback = (x, y) => {
                return Controllers.isPassable(char, { x: x, y: y }, manager.level);
            }
            lvl = manager.level;
            state = States.Move;
            manager.currPath.unwrap = new AstarPath({ x: char.x, y: char.y }, null, char.stats.ap);
        }
    }

    export function updateClick(x: number, y: number) {
        if (state == States.Inactive) return;

        var path = manager.currPath.unwrap;
        if (path && path.isConnected() && x == path.pointer.x && y == path.pointer.y) {
            confirm();
        }  
        else if (state == States.Move || state == States.Attack) {
            var newLoc = { x: x, y: y };
            //if (newLoc.x != path.pointer.x || newLoc.y != path.pointer.y) {
            path.pointer = newLoc;
            path.connect(callback);
            manager.currPath.unwrap = path;
            //}
        }
    }

    export function updateMousedrag(x: number, y: number) {
        if (state == States.Inactive) return;
        var path = manager.currPath.unwrap;

        var newLoc = { x: x, y: y };
        if (newLoc.x != path.pointer.x || newLoc.y != path.pointer.y) {
            path.pointer = newLoc;
            path.connect(callback);
            manager.currPath.unwrap = path;
        }        
    }

    export function updateMousemove(x: number, y: number) {
        if (state == States.Inactive) return;
        var path = manager.currPath.unwrap;

        if (x != path.pointer.x || y != path.pointer.y) {
            path.disconnect();

            path.pointer = { x: x, y: y };
            manager.currPath.unwrap = path;
        }
    }

    export function update(key) {
        if (state == States.Inactive) return;

        switch (key) {
            case "VK_Q":
                alterPath(Vec.Northwest);
                break;
            case "VK_W":
                alterPath(Vec.North);
                break;
            case "VK_E":
                alterPath(Vec.Northeast);
                break;
            case "VK_A":
                alterPath(Vec.West);
                break;
            case "VK_D":
                alterPath(Vec.East);
                break;
            case "VK_Z":
                alterPath(Vec.Southwest);
                break;
            case "VK_X":
                alterPath(Vec.South);
                break;
            case "VK_C":
                alterPath(Vec.Southeast);
                break;
            case "VK_SPACE":
                endTurn();
                break;
            case "VK_F":
                confirm();
                break;
            case "VK_1":
                state = States.Move;
                var old = manager.currPath.unwrap;
                manager.currPath.unwrap = new AstarPath(old.begin, null, char.stats.ap);
                break;
            case "VK_2":
                state = States.Attack;
                var old = manager.currPath.unwrap;
                manager.currPath.unwrap = new StraightPath(old.begin, null, char.currWeapon.maxRange);
                break;
            default:
                break;
        }

    }

    function alterPath(dir: IVector2) {
        var oldPath = manager.currPath.unwrap;
        var location = Vec.add(oldPath.pointer, dir);
        if (location.x < 0) location.x = 0;
        if (location.y < 0) location.y = 0;
        if (location.x > lvl.map._width - 1) location.x = lvl.map._width - 1;
        if (location.y > lvl.map._height - 1) location.y = lvl.map._height - 1;

        var path = manager.currPath.unwrap;
        if (state == States.Move || state == States.Attack) {
            path.pointer = location;
            path.connect(callback);
            manager.currPath.unwrap = path;
        }
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
        var ptr = { x: path.pointer.x, y: path.pointer.y };

        switch (state){
            case States.Move:
                if (char.stats.ap > 1) {
                    char.nextAction = () => {
                        var limited = path.trim();
                        char.x = limited._nodes[path.limitedNodes().length - 1].x;
                        char.y = limited._nodes[path.limitedNodes().length - 1].y;
                        char.stats.ap -= limited.cost();
                        manager.currPath.unwrap = new AstarPath({ x: char.x, y: char.y }, null, char.stats.ap);

                        if (!char.hasAP()) {
                            state = States.Inactive;
                        }
                    }
                }
                else {
                    con.addLine("You need at least 2 AP to move! Ending turn...");
                    endTurn();
                }
                break;
            case States.Attack:
                char.nextAction = () => {
                    var limited = path.trim();
                    var result;

                    var targets = lvl.entities.filter((entity) => {
                        return entity.x === limited.pointer.x && entity.y === limited.pointer.y;
                    });
                    if (targets[0] && char.stats.ap >= char.currWeapon.apCost) {
                        char.stats.ap -= char.currWeapon.apCost;
                        char.currWeapon.setDurability(char.currWeapon.durability - 1);
                        result = (<Entities.Entity>targets[0]).getStruck(char.getAttack());
                        con.addLine(result.attacker.name + " hit " + result.defender.name + " for " +
                            result.finalDmg + " damage! - Hit roll: " + (result.hitRoll - result.attacker.skills.prowess.value) +
                            "+" + result.attacker.skills.prowess.value + " vs " + (result.evadeRoll - result.defender.skills.evasion.value) +
                            "+" + result.defender.skills.evasion.value + " - Armor rolls: " + result.armorRolls.toString() + " -");
                    }
                    else if (char.stats.ap < char.currWeapon.apCost) {
                        con.addLine("You need " + char.currWeapon.apCost + " AP to attack with a " + char.currWeapon.name + "!")
                    }

                    path.pointer = ptr;
                    path.connect(callback);
                    manager.currPath.unwrap = path;
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