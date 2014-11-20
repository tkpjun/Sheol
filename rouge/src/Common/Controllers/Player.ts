module Common.Controllers {
    
    export class Player{

        private char: Entities.PlayerChar;
        private lvl: Dungeon.Level;
        private state = States.Inactive;
        private manager: EntityManager;
        private con: IConsole;
        private callback;

        constructor(console: IConsole, entityManager: EntityManager) {
            this.manager = entityManager;
            this.con = console;
        }

        activate(character: Entities.PlayerChar) {
            if (this.state == States.Inactive) {
                this.char = character;
                this.callback = (x, y) => {
                    return Controllers.isPassable(this.char, { x: x, y: y }, this.manager.level);
                }
                this.lvl = this.manager.level;
                this.state = States.Move;
                this.manager.currPath.unwrap = new AstarPath({ x: this.char.x, y: this.char.y }, null, this.char.stats.ap);
            }
        }

        updateClick(x: number, y: number) {
            if (this.state == States.Inactive) return;

            var path = this.manager.currPath.unwrap;
            if (path && path.isConnected() && x == path.pointer.x && y == path.pointer.y) {
                this.confirm();
            }
            else if (path && x == path.begin.x && y == path.begin.y) {
                this.confirm();
            }
            else if (this.state == States.Move || this.state == States.Attack) {
                var newLoc = { x: x, y: y };
                //if (newLoc.x != path.pointer.x || newLoc.y != path.pointer.y) {
                path.pointer = newLoc;
                path.connect(this.callback);
                this.manager.currPath.unwrap = path;
                //}
            }
        }

        updateMousedrag(x: number, y: number) {
            if (this.state == States.Inactive) return;
            var path = this.manager.currPath.unwrap;

            var newLoc = { x: x, y: y };
            if (newLoc.x != path.pointer.x || newLoc.y != path.pointer.y) {
                path.pointer = newLoc;
                path.connect(this.callback);
                this.manager.currPath.unwrap = path;
            }
        }

        updateMousemove(x: number, y: number) {
            if (this.state == States.Inactive) return;
            var path = this.manager.currPath.unwrap;

            if (x != path.pointer.x || y != path.pointer.y) {
                path.disconnect();

                path.pointer = { x: x, y: y };
                this.manager.currPath.unwrap = path;
            }
        }

        update(key) {
            if (this.state == States.Inactive) return;

            switch (key) {
                case "VK_Q":
                    this.alterPath(Vec.Northwest);
                    break;
                case "VK_W":
                    this.alterPath(Vec.North);
                    break;
                case "VK_E":
                    this.alterPath(Vec.Northeast);
                    break;
                case "VK_A":
                    this.alterPath(Vec.West);
                    break;
                case "VK_D":
                    this.alterPath(Vec.East);
                    break;
                case "VK_Z":
                    this.alterPath(Vec.Southwest);
                    break;
                case "VK_X":
                    this.alterPath(Vec.South);
                    break;
                case "VK_C":
                    this.alterPath(Vec.Southeast);
                    break;
                case "VK_SPACE":
                    this.endTurn();
                    break;
                case "VK_F":
                    this.confirm();
                    break;
                case "VK_1":
                    this.switchState(States.Move);
                    //this.state = States.Move;
                    //var old = this.manager.currPath.unwrap;
                    //this.manager.currPath.unwrap = new AstarPath(old.begin, null, this.char.stats.ap);
                    break;
                case "VK_2":
                    this.switchState(States.Attack);
                    //this.state = States.Attack;
                    //var old = this.manager.currPath.unwrap;
                    //this.manager.currPath.unwrap = new StraightPath(old.begin, null, this.char.currWeapon.maxRange);
                    break;
                default:
                    break;
            }

        }

        switchState(state: States) {
            this.state = state;
            var old = this.manager.currPath.unwrap;
            switch (state) {
                case States.Move:
                    this.manager.currPath.unwrap = new AstarPath(old.begin, null, this.char.stats.ap);
                    break;
                case States.Attack:
                    this.manager.currPath.unwrap = new StraightPath(old.begin, null, this.char.currWeapon.maxRange);
                    break;
                default:
                    this.manager.currPath.unwrap = null;
                    break;
            }
        }
        getState(): States {
            return this.state;
        }

        private alterPath(dir: IVector2) {
            var oldPath = this.manager.currPath.unwrap;
            var location = Vec.add(oldPath.pointer, dir);
            if (location.x < 0) location.x = 0;
            if (location.y < 0) location.y = 0;
            if (location.x > this.lvl.map._width - 1) location.x = this.lvl.map._width - 1;
            if (location.y > this.lvl.map._height - 1) location.y = this.lvl.map._height - 1;

            var path = this.manager.currPath.unwrap;
            if (this.state == States.Move || this.state == States.Attack) {
                path.pointer = location;
                path.connect(this.callback);
                this.manager.currPath.unwrap = path;
            }
            else
                throw ("Unimplemented state!");
        }

        private endTurn() {
            this.char.addAction(() => {
                this.char._hasTurn = false;
                this.state = States.Inactive;
                this.manager.currPath.unwrap = null;
            });
        }

        private confirm() {
            var path = this.manager.currPath.unwrap;
            var ptr = { x: path.pointer.x, y: path.pointer.y };
            var moves;
            if (path.nodes.length == 1) {
                var obj = this.lvl.objects.filter((obj) => { return obj.x == path.begin.x && obj.y == path.begin.y; })[0]
                if (obj) {
                    //this.con.addLine(obj.pick(this.char));
                    this.lvl.pickObject(obj, this.char, this.con);
                }
                else {
                    this.con.addLine("Nothing of interest here!");
                }
                return;
            }

            switch (this.state) {
                case States.Move:
                    var target = { x: path.pointer.x, y: path.pointer.y };
                    moves = this.char.requestMoves(2, path.cost() / 2);
                    var c = this.char;
                    var m = this.manager;
                    if (moves > 0) {
                        //path.trim(moves * 2);
                        function nextStep(i, last?, callback?) {
                            return () => {
                                c.dir = Vec.sub(path.nodes[i], { x: c.x, y: c.y });
                                c.x = path.nodes[i].x;
                                c.y = path.nodes[i].y;
                                m.currPath.unwrap = path; //dumb way to redraw screen
                                if (last) {
                                    var p = new AstarPath({ x: c.x, y: c.y }, target, c.stats.ap);
                                    p.connect(callback);
                                    m.currPath.unwrap = p;
                                }
                            }
                        }
                        function bool(i) {
                            return i < path.nodes.length && i <= moves
                        }
                        for (var i = 1; bool(i); i++) {
                            if (!bool(i + 1)) {
                                this.char.addAction(nextStep(i, true, this.callback))
                        }
                            else
                                this.char.addAction(nextStep(i));
                        }
                    }
                    break;
                case States.Attack:
                    path.trim();
                    var result: Entities.AttackResult;
                    var targets = new Array<IEntity>();
                    var index = 1;

                    while (!targets[0]) {
                        if (index >= path.nodes.length)
                            break;

                        targets = this.lvl.entities.filter((entity) => {
                            return entity.x === path.nodes[index].x && entity.y === path.nodes[index].y;
                        });
                        index += 1;
                    }
                    if (targets[0]) {
                        moves = this.char.requestMoves(this.char.currWeapon.apCost, 1);
                        this.char.addAction(() => {
                            if (moves == 1) {
                                this.char.currWeapon.setDurability(this.char.currWeapon.durability - 1);
                                result = (<Entities.Entity>targets[0]).getStruck(this.char.getAttack());
                                var attacks = result.armorRolls.map((roll) => { return result.attackDmg + result.critDmg - roll })
                            var str = attacks.toString().replace(",", "+");
                                if (str === "") str = "0";
                                this.con.addLine(result.attacker.name + " hit " + result.defender.name + " for " + str +
                                    "=" + result.finalDmg + " damage! Hit roll: " + (result.hitRoll - result.attacker.skills.prowess.value) +
                                    "+" + result.attacker.skills.prowess.value + " vs " + (result.evadeRoll - result.defender.skills.evasion.value) +
                                    "+" + result.defender.skills.evasion.value);
                                if (result.fatal) {
                                    this.con.addLine(result.defender.name.substring(0, 1).toUpperCase() + result.defender.name.substring(1) + " was struck down!");
                                    this.manager.kill(result.defender);
                                }
                            }
                            path.pointer = ptr;
                            path.connect(this.callback);
                            this.manager.currPath.unwrap = path;
                        }
                            )
                };
                    break;
                default:
                    throw ("Bad state: " + this.state);
                    break;
            }
            if (moves === 0) {
                this.con.addLine("Out of usable stamina! Ending turn...");
                this.endTurn();
            }
        }
    }
} 