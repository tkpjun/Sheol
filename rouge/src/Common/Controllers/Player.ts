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
        else if (path && x == path.begin.x && y == path.begin.y) {
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
        char.addAction(() => {
            char._hasTurn = false;
            state = States.Inactive;
            manager.currPath.unwrap = null;
        });
    }

    function confirm() {
        var path = manager.currPath.unwrap;
        var ptr = { x: path.pointer.x, y: path.pointer.y };
        var moves;
        if (path._nodes.length == 1) {
            var obj = lvl.objects.filter((obj) => { return obj.x == path.begin.x && obj.y == path.begin.y; })[0]
            if (obj) {
                con.addLine(obj.pick(char));
            }
            else {
                con.addLine("Nothing of interest here!");
            }
            return;
        }

        switch (state){
            case States.Move:
                moves = char.requestMoves(2, path.cost() / 2);
                if (moves > 0) {
                    path.trim(moves * 2);
                    function nextStep(i, last?) {
                        return () => {
                            char.dir = Vec.sub(path._nodes[i], {x:char.x, y:char.y});
                            char.x = path._nodes[i].x;
                            char.y = path._nodes[i].y;
                            manager.currPath.unwrap = path; //dumb way to redraw screen
                            //manager.currPath.unwrap = new AstarPath({ x: char.x, y: char.y }, null, char.stats.ap);
                            /*
                            if (i == path._nodes.length - 1) {
                                char.stats.ap -= path.cost();
                            }*/
                            if (last) {
                                manager.currPath.unwrap = new AstarPath({ x: char.x, y: char.y }, null, char.stats.ap);
                                //endTurn();
                            }
                        }
                    }
                    function bool(i) {
                        return i < path._nodes.length && i <= moves
                    }
                    for (var i = 1; bool(i); i++) {
                        if (!bool(i + 1)) {
                            char.addAction(nextStep(i, true))
                        }
                        else
                            char.addAction(nextStep(i));
                    }
                }
                break;
            case States.Attack:
                path.trim();
                var result: Entities.AttackResult;
                var targets = new Array<IEntity>();
                var index = 1;

                while (!targets[0]) {
                    if (index >= path._nodes.length)
                        break;

                    targets = lvl.entities.filter((entity) => {
                        return entity.x === path._nodes[index].x && entity.y === path._nodes[index].y;
                    });
                    index += 1;
                }
                if (targets[0]) {
                    moves = char.requestMoves(char.currWeapon.apCost, 1);
                    char.addAction(() => {                       
                        if (moves == 1) {
                            char.currWeapon.setDurability(char.currWeapon.durability - 1);
                            result = (<Entities.Entity>targets[0]).getStruck(char.getAttack());
                            var attacks = result.armorRolls.map((roll) => { return result.attackDmg + result.critDmg - roll })
                            var str = attacks.toString().replace(",", "+");
                            if (str === "") str = "0";
                            con.addLine(result.attacker.name + " hit " + result.defender.name + " for " + str +
                                "=" + result.finalDmg + " damage! Hit roll: " + (result.hitRoll - result.attacker.skills.prowess.value) +
                                "+" + result.attacker.skills.prowess.value + " vs " + (result.evadeRoll - result.defender.skills.evasion.value) +
                                "+" + result.defender.skills.evasion.value);
                            if (result.fatal) {
                                con.addLine(result.defender.name.substring(0, 1).toUpperCase() + result.defender.name.substring(1) + " was struck down!");
                                manager.kill(result.defender);
                            }
                        }
                        path.pointer = ptr;
                        path.connect(callback);
                        manager.currPath.unwrap = path;
                    }
                    )};
                break;
            default:
                throw ("Bad state: " + state);
                break;
        }
        if(moves === 0) {
            con.addLine("Out of usable stamina! Ending turn...");
            endTurn();
        }
    }
} 