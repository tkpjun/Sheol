var Common;
(function (Common) {
    (function (Controllers) {
        var Path = (function () {
            function Path() {
                this._nodes = new Array();
                this._costs = new Array();
                this._costs.push(0);
            }
            Path.prototype.cost = function () {
                return this._costs.reduce(function (x, y) {
                    return x + y;
                });
            };

            Path.prototype.connect = function (passableFn) {
                throw ("Abstract!");
            };

            Path.prototype.disconnect = function () {
                this._nodes.length = 1;
                this._costs.length = 1;
            };

            Path.prototype.isConnected = function () {
                return this._nodes.length > 1;
            };

            Path.prototype.limitedNodes = function (ap) {
                var newAP;
                if (ap)
                    newAP = ap;
                else
                    newAP = this._lengthInAP;

                if (newAP) {
                    var arr = new Array();
                    var cost = 0;
                    for (var i = 0; i < this._nodes.length; i++) {
                        if (cost + this._costs[i] > newAP) {
                            break;
                        }

                        arr.push(this._nodes[i]);
                        cost += this._costs[i];
                    }
                    return arr;
                } else
                    return this._nodes;
            };

            Path.prototype.trim = function (ap) {
                this._nodes = this.limitedNodes(ap);
                this._costs.length = this._nodes.length;
                if (this._nodes.length > 0) {
                    this.pointer.x = this._nodes[this._nodes.length - 1].x;
                    this.pointer.y = this._nodes[this._nodes.length - 1].y;
                } else {
                    this._nodes[0] = this.begin;
                    this._costs[0] = 0;
                    this.pointer.x = this.begin.x;
                    this.pointer.y = this.begin.y;
                }
                return this;
            };

            Path.prototype.updateCosts = function () {
                var arr = this._nodes;
                this._costs = new Array();
                this._costs.push(0);
                for (var i = 0; i < arr.length - 1; i++) {
                    if (!arr[i + 1])
                        break;

                    this._costs.push(this.calculateCost(arr[i], arr[i + 1]));
                }
            };

            Path.prototype.calculateCost = function (n1, n2) {
                if (Controllers.diagonalNbors(n1, n2)) {
                    return 3;
                } else
                    return 2;
            };
            return Path;
        })();
        Controllers.Path = Path;
    })(Common.Controllers || (Common.Controllers = {}));
    var Controllers = Common.Controllers;
})(Common || (Common = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Common;
(function (Common) {
    ///<reference path="Path.ts"/>
    (function (Controllers) {
        var AstarPath = (function (_super) {
            __extends(AstarPath, _super);
            function AstarPath(from, to, lengthInAP) {
                _super.call(this);
                this._lengthInAP = lengthInAP;
                this.begin = from;
                this._nodes.push(from);
                this._costs.push(0);

                if (to) {
                    this.pointer = to;
                } else {
                    this.pointer = from;
                }
            }
            AstarPath.prototype.connect = function (passableFn) {
                var _this = this;
                this._nodes.length = 0;
                this._costs.length = 0;

                this._astar = new ROT.Path.AStar(this.pointer.x, this.pointer.y, passableFn, { topology: 4 });
                this._astar.compute(this.begin.x, this.begin.y, function (x, y) {
                    _this._nodes.push({ x: x, y: y });
                });

                //this.fixPath(passableFn);
                this.updateCosts();

                if (!passableFn(this.pointer.x, this.pointer.y)) {
                    this._nodes.pop();
                    this._costs.pop();
                }
            };
            return AstarPath;
        })(Controllers.Path);
        Controllers.AstarPath = AstarPath;
    })(Common.Controllers || (Common.Controllers = {}));
    var Controllers = Common.Controllers;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Controllers) {
        (function (BasicAI) {
            var char;
            var lvl;
            var state = 2 /* Inactive */;
            var manager;
            var con;
            var callback;
        })(Controllers.BasicAI || (Controllers.BasicAI = {}));
        var BasicAI = Controllers.BasicAI;
    })(Common.Controllers || (Common.Controllers = {}));
    var Controllers = Common.Controllers;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Controllers) {
        var ChangeProperty = (function () {
            function ChangeProperty(which, to) {
                this.target = to;
                this.func = function () {
                    which.unwrap = to;
                };
            }
            ChangeProperty.prototype.act = function () {
                this.func();
            };
            return ChangeProperty;
        })();
        Controllers.ChangeProperty = ChangeProperty;
    })(Common.Controllers || (Common.Controllers = {}));
    var Controllers = Common.Controllers;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Controllers) {
        (function (States) {
            States[States["Move"] = 0] = "Move";
            States[States["Attack"] = 1] = "Attack";
            States[States["Inactive"] = 2] = "Inactive";
        })(Controllers.States || (Controllers.States = {}));
        var States = Controllers.States;

        function isPassable(user, loc, level, from) {
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
            level.entities.forEach(function (e) {
                if (loc.x == e.x && loc.y == e.y)
                    entitiesOK = false;
            });
            return cell !== " " && entitiesOK;
        }
        Controllers.isPassable = isPassable;

        function diagonalNbors(loc, neighbor) {
            if (Math.abs(loc.x - neighbor.x) == 1 && Math.abs(loc.y - neighbor.y) == 1) {
                return true;
            } else
                return false;
        }
        Controllers.diagonalNbors = diagonalNbors;

        function diagonal(loc, other) {
            if (Math.abs(loc.x - other.x) == Math.abs(loc.y - other.y)) {
                return true;
            } else
                return false;
        }
        Controllers.diagonal = diagonal;

        function planAction(entity, manager) {
            if (entity instanceof Common.Entities.PlayerChar) {
                Controllers.Player.activate(entity);
            } else if (entity instanceof Common.Entities.Enemy) {
                var enemy = entity;
                enemy.addAction(function () {
                    enemy._hasTurn = false;
                });
            }
        }
        Controllers.planAction = planAction;
    })(Common.Controllers || (Common.Controllers = {}));
    var Controllers = Common.Controllers;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Controllers) {
        var EntityManager = (function () {
            function EntityManager(level) {
                var _this = this;
                this.level = level;
                this.currEntity = new Common.ObservableProperty();
                this.currEntity.attach(function () {
                    return _this.update();
                });
                this.currPath = new Common.ObservableProperty();
                this.engine = new ROT.Engine(this.level.scheduler);
                this.changed = new Common.Observable();
                this.characters = new Array();

                this.init();
            }
            EntityManager.prototype.pause = function () {
                this.engine.lock();
            };

            EntityManager.prototype.start = function () {
                this.engine.start();
            };

            EntityManager.prototype.init = function () {
                var _this = this;
                var rooms = this.level.map.getRooms();
                var room = rooms[0];
                var player1 = new Common.Entities.PlayerChar("char1");
                player1.equipment.equipWeapon(Common.Items.getWeapon(3 /* Mace */));
                player1.currWeapon = player1.equipment.mainHand;
                player1.x = room.getCenter()[0];
                player1.y = room.getCenter()[1];
                this.characters.push(player1);
                this.level.scheduler.add(new Controllers.ChangeProperty(this.currEntity, player1), true, 1);

                var player2 = new Common.Entities.PlayerChar("char2");
                player2.equipment.equipWeapon(Common.Items.getWeapon(6 /* Spear */));
                player2.currWeapon = player2.equipment.mainHand;
                player2.x = room.getCenter()[0] + 1;
                player2.y = room.getCenter()[1];
                this.characters.push(player2);
                this.level.scheduler.add(new Controllers.ChangeProperty(this.currEntity, player2), true, 1);

                this.characters.forEach(function (c) {
                    _this.level.entities.push(c);
                });

                for (var i = 0; i < rooms.length; i++) {
                    if (i % 6 != 0)
                        continue;

                    var enemy = Common.Entities.getEnemy("debug" + i / 6);
                    enemy.x = rooms[i].getLeft();
                    enemy.y = rooms[i].getBottom();

                    //console.log(enemy.x +", "+ enemy.y)
                    this.level.entities.push(enemy);
                    this.level.scheduler.add(new Controllers.ChangeProperty(this.currEntity, enemy), true, 1);
                }
            };

            EntityManager.prototype.update = function () {
                var _this = this;
                this.engine.lock();
                var entity = this.currEntity.unwrap;

                var pollForAction = function () {
                    Controllers.planAction(entity, _this);
                    var action = entity.getAction();
                    if (action) {
                        action();

                        //console.log(entity.x + "," + entity.y);
                        _this.changed.notify();
                    }

                    if (entity.hasTurn()) {
                        setTimeout(pollForAction, Common.Settings.UpdateRate);
                    } else {
                        entity.newTurn();

                        //this.changed.notify();
                        var unlock = function () {
                            _this.engine.unlock();
                        };
                        setTimeout(unlock, Common.Settings.UpdateRate * 4);
                    }
                };
                pollForAction();
            };
            return EntityManager;
        })();
        Controllers.EntityManager = EntityManager;
    })(Common.Controllers || (Common.Controllers = {}));
    var Controllers = Common.Controllers;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Controllers) {
        (function (Player) {
            var char;
            var lvl;
            var state = 2 /* Inactive */;
            var manager;
            var con;
            var callback;

            function initialize(console, entityManager) {
                manager = entityManager;
                con = console;
            }
            Player.initialize = initialize;

            function activate(character) {
                if (state == 2 /* Inactive */) {
                    char = character;
                    callback = function (x, y) {
                        return Controllers.isPassable(char, { x: x, y: y }, manager.level);
                    };
                    lvl = manager.level;
                    state = 0 /* Move */;
                    manager.currPath.unwrap = new Controllers.AstarPath({ x: char.x, y: char.y }, null, char.stats.ap);
                }
            }
            Player.activate = activate;

            function updateClick(x, y) {
                if (state == 2 /* Inactive */)
                    return;

                var path = manager.currPath.unwrap;
                if (path && path.isConnected() && x == path.pointer.x && y == path.pointer.y) {
                    confirm();
                } else if (state == 0 /* Move */ || state == 1 /* Attack */) {
                    var newLoc = { x: x, y: y };

                    //if (newLoc.x != path.pointer.x || newLoc.y != path.pointer.y) {
                    path.pointer = newLoc;
                    path.connect(callback);
                    manager.currPath.unwrap = path;
                    //}
                }
            }
            Player.updateClick = updateClick;

            function updateMousedrag(x, y) {
                if (state == 2 /* Inactive */)
                    return;
                var path = manager.currPath.unwrap;

                var newLoc = { x: x, y: y };
                if (newLoc.x != path.pointer.x || newLoc.y != path.pointer.y) {
                    path.pointer = newLoc;
                    path.connect(callback);
                    manager.currPath.unwrap = path;
                }
            }
            Player.updateMousedrag = updateMousedrag;

            function updateMousemove(x, y) {
                if (state == 2 /* Inactive */)
                    return;
                var path = manager.currPath.unwrap;

                if (x != path.pointer.x || y != path.pointer.y) {
                    path.disconnect();

                    path.pointer = { x: x, y: y };
                    manager.currPath.unwrap = path;
                }
            }
            Player.updateMousemove = updateMousemove;

            function update(key) {
                if (state == 2 /* Inactive */)
                    return;

                switch (key) {
                    case "VK_Q":
                        alterPath(Common.Vec.Northwest);
                        break;
                    case "VK_W":
                        alterPath(Common.Vec.North);
                        break;
                    case "VK_E":
                        alterPath(Common.Vec.Northeast);
                        break;
                    case "VK_A":
                        alterPath(Common.Vec.West);
                        break;
                    case "VK_D":
                        alterPath(Common.Vec.East);
                        break;
                    case "VK_Z":
                        alterPath(Common.Vec.Southwest);
                        break;
                    case "VK_X":
                        alterPath(Common.Vec.South);
                        break;
                    case "VK_C":
                        alterPath(Common.Vec.Southeast);
                        break;
                    case "VK_SPACE":
                        endTurn();
                        break;
                    case "VK_F":
                        confirm();
                        break;
                    case "VK_1":
                        state = 0 /* Move */;
                        var old = manager.currPath.unwrap;
                        manager.currPath.unwrap = new Controllers.AstarPath(old.begin, null, char.stats.ap);
                        break;
                    case "VK_2":
                        state = 1 /* Attack */;
                        var old = manager.currPath.unwrap;
                        manager.currPath.unwrap = new Controllers.StraightPath(old.begin, null, char.currWeapon.maxRange);
                        break;
                    default:
                        break;
                }
            }
            Player.update = update;

            function alterPath(dir) {
                var oldPath = manager.currPath.unwrap;
                var location = Common.Vec.add(oldPath.pointer, dir);
                if (location.x < 0)
                    location.x = 0;
                if (location.y < 0)
                    location.y = 0;
                if (location.x > lvl.map._width - 1)
                    location.x = lvl.map._width - 1;
                if (location.y > lvl.map._height - 1)
                    location.y = lvl.map._height - 1;

                var path = manager.currPath.unwrap;
                if (state == 0 /* Move */ || state == 1 /* Attack */) {
                    path.pointer = location;
                    path.connect(callback);
                    manager.currPath.unwrap = path;
                } else
                    throw ("Unimplemented state!");
            }

            function endTurn() {
                char.addAction(function () {
                    char._hasTurn = false;
                    state = 2 /* Inactive */;
                    manager.currPath.unwrap = null;
                });
            }

            function confirm() {
                var path = manager.currPath.unwrap;
                var ptr = { x: path.pointer.x, y: path.pointer.y };

                switch (state) {
                    case 0 /* Move */:
                        var moves = char.requestMoves(2, path.cost() / 2);
                        if (moves > 0) {
                            path.trim(moves * 2);
                            function nextStep(i, last) {
                                return function () {
                                    char.dir = Common.Vec.sub(path._nodes[i], { x: char.x, y: char.y });
                                    char.x = path._nodes[i].x;
                                    char.y = path._nodes[i].y;

                                    //manager.currPath.unwrap = new AstarPath({ x: char.x, y: char.y }, null, char.stats.ap);
                                    /*
                                    if (i == path._nodes.length - 1) {
                                    char.stats.ap -= path.cost();
                                    }*/
                                    if (last) {
                                        manager.currPath.unwrap = new Controllers.AstarPath({ x: char.x, y: char.y }, null, char.stats.ap);
                                        //endTurn();
                                    }
                                };
                            }
                            function bool(i) {
                                return i < path._nodes.length && i <= moves;
                            }
                            for (var i = 1; bool(i); i++) {
                                if (!bool(i + 1)) {
                                    char.addAction(nextStep(i, true));
                                } else
                                    char.addAction(nextStep(i));
                            }
                        } else {
                            con.addLine("Out of usable stamina! Ending turn...");
                            endTurn();
                        }
                        break;
                    case 1 /* Attack */:
                        path.trim();
                        var result;
                        var targets = [];
                        var index = 1;

                        while (!targets[0]) {
                            if (index >= path._nodes.length)
                                break;

                            targets = lvl.entities.filter(function (entity) {
                                return entity.x === path._nodes[index].x && entity.y === path._nodes[index].y;
                            });
                            index += 1;
                        }
                        char.addAction(function () {
                            if (targets[0]) {
                                var moves = char.requestMoves(char.currWeapon.apCost, 1);
                                if (moves == 1) {
                                    char.currWeapon.setDurability(char.currWeapon.durability - 1);
                                    result = targets[0].getStruck(char.getAttack());
                                    con.addLine(result.attacker.name + " hit " + result.defender.name + " with a " + result.attacker.currWeapon.name + " for " + result.finalDmg + " damage! - Hit roll: " + (result.hitRoll - result.attacker.skills.prowess.value) + "+" + result.attacker.skills.prowess.value + " vs " + (result.evadeRoll - result.defender.skills.evasion.value) + "+" + result.defender.skills.evasion.value + " - Armor rolls: " + result.armorRolls.toString() + " -");
                                } else {
                                    con.addLine("Out of usable stamina! Ending turn...");
                                    endTurn();
                                }
                            }

                            path.pointer = ptr;
                            path.connect(callback);
                            manager.currPath.unwrap = path;
                            /*
                            if (!char.hasAP()) {
                            state = States.Inactive;
                            }*/
                        });
                        break;
                    default:
                        throw ("Bad state: " + state);
                        break;
                }
            }
        })(Controllers.Player || (Controllers.Player = {}));
        var Player = Controllers.Player;
    })(Common.Controllers || (Common.Controllers = {}));
    var Controllers = Common.Controllers;
})(Common || (Common = {}));
var Common;
(function (Common) {
    ///<reference path="Path.ts"/>
    (function (Controllers) {
        var StraightPath = (function (_super) {
            __extends(StraightPath, _super);
            function StraightPath(from, to, lengthInAP) {
                _super.call(this);
                this._lengthInAP = lengthInAP;
                this.begin = from;
                this._nodes.push(from);
                this._costs.push(0);

                if (to) {
                    this.pointer = to;
                } else {
                    this.pointer = from;
                }
            }
            StraightPath.prototype.connect = function (passableFn) {
                this._nodes.length = 0;
                this._costs.length = 0;

                this.createPath(passableFn, this.begin, this.pointer);
                this.updateCosts();
            };

            StraightPath.prototype.createPath = function (passableFn, from, to) {
                var _this = this;
                var last = from;
                this._nodes.push(last);
                var k = (to.y - from.y) / (to.x - from.x);

                //console.log(k);
                var addition = Math.min(1, Math.abs(1 / k));
                var fn = function (x) {
                    return Math.round(k * (x - to.x) + to.y);
                };
                var addNext = function () {
                    var next;
                    if (k == Infinity)
                        next = { x: last.x, y: last.y + 1 };
                    else if (k == -Infinity)
                        next = { x: last.x, y: last.y - 1 };
                    else {
                        if (to.x > from.x) {
                            next = { x: last.x + addition, y: fn(last.x + addition) };
                        } else {
                            next = { x: last.x - addition, y: fn(last.x - addition) };
                        }
                    }

                    if (Math.round(next.x) !== Math.round(last.x) || Math.round(next.y) !== Math.round(last.y))
                        _this._nodes.push({ x: Math.round(next.x), y: Math.round(next.y) });

                    last = next;
                };
                var condition = function () {
                    if (!passableFn(_this._nodes[_this._nodes.length - 1].x, _this._nodes[_this._nodes.length - 1].y))
                        return false;

                    if (k == Infinity) {
                        if (Math.round(last.y) >= to.y)
                            return false;
                    } else if (k == -Infinity) {
                        if (Math.round(last.y) <= to.y)
                            return false;
                    } else if (to.x > from.x) {
                        if (Math.round(last.x) >= to.x)
                            return false;
                    } else {
                        if (Math.round(last.x) <= to.x)
                            return false;
                    }
                    return true;
                };
                while (condition()) {
                    addNext();
                }
            };
            return StraightPath;
        })(Controllers.Path);
        Controllers.StraightPath = StraightPath;
    })(Common.Controllers || (Common.Controllers = {}));
    var Controllers = Common.Controllers;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Dungeon) {
        (function (MapTypes) {
            MapTypes[MapTypes["Mines"] = 0] = "Mines";
            MapTypes[MapTypes["Cave"] = 1] = "Cave";
            MapTypes[MapTypes["Heart"] = 2] = "Heart";
            MapTypes[MapTypes["Tutorial"] = 3] = "Tutorial";
        })(Dungeon.MapTypes || (Dungeon.MapTypes = {}));
        var MapTypes = Dungeon.MapTypes;

        function createMap(type) {
            var map;

            switch (type) {
                case 0 /* Mines */:
                    map = new ROT.Map.Digger(200, Common.Settings.MapHeight, {
                        dugPercentage: 0.55,
                        roomWidth: [4, 9],
                        roomHeight: [3, 7],
                        corridorLength: [1, 5],
                        timeLimit: 1000
                    });
                    break;
            }

            var digCallback = function (x, y, value) {
                var key = x + "," + y;

                if (value)
                    map[key] = " ";
                else {
                    map[key] = ".";
                }
            };
            map.create(digCallback);
            return map;
        }
        Dungeon.createMap = createMap;
    })(Common.Dungeon || (Common.Dungeon = {}));
    var Dungeon = Common.Dungeon;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Dungeon) {
        var ItemObject = (function () {
            function ItemObject(item, x, y) {
                this._x = x;
                this._y = y;
                this.item = item;
            }
            Object.defineProperty(ItemObject.prototype, "x", {
                get: function () {
                    return this._x;
                },
                set: function (value) {
                    this._x = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ItemObject.prototype, "y", {
                get: function () {
                    return this._y;
                },
                set: function (value) {
                    this._y = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ItemObject.prototype, "isPassable", {
                get: function () {
                    return true;
                },
                enumerable: true,
                configurable: true
            });

            ItemObject.prototype.pick = function () {
                return this.item;
            };
            return ItemObject;
        })();
        Dungeon.ItemObject = ItemObject;
    })(Common.Dungeon || (Common.Dungeon = {}));
    var Dungeon = Common.Dungeon;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Dungeon) {
        var Level = (function () {
            function Level(type) {
                this.scheduler = new ROT.Scheduler.Action();
                this.map = Dungeon.createMap(type);
                this.entities = new Array();
                this.items = new Array();
            }
            return Level;
        })();
        Dungeon.Level = Level;
    })(Common.Dungeon || (Common.Dungeon = {}));
    var Dungeon = Common.Dungeon;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Entities) {
        var Attack = (function () {
            function Attack(user, damage, multiplier, hitSkill) {
                this.user = user;
                this.damage = damage;
                this.multiplier = multiplier;
                this.hitSkill = hitSkill;
            }
            return Attack;
        })();
        Entities.Attack = Attack;
    })(Common.Entities || (Common.Entities = {}));
    var Entities = Common.Entities;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Entities) {
        var AttackResult = (function () {
            function AttackResult(attack, defender, evadeSkill, armorMin, armorMax) {
                this.attacker = attack.user;
                this.attackDmg = attack.damage;
                this.attackMul = attack.multiplier;
                this.hitRoll = Math.ceil(ROT.RNG.getUniform() * 20) + attack.hitSkill.value;
                this.defender = defender;
                this.evadeRoll = Math.ceil(ROT.RNG.getUniform() * 20) + evadeSkill.value;
                var modMul = this.attackMul;
                var modEvd = this.evadeRoll;
                var modHit = this.hitRoll;
                var modDmg = this.attackDmg;
                while (modEvd >= this.hitRoll) {
                    modMul -= 1;
                    modEvd -= 7;
                }
                while (modHit >= modEvd + 7) {
                    modDmg += 2;
                    modHit -= 7;
                }

                this.armorRolls = new Array();
                for (var i = 0; i < modMul; i++) {
                    var roll = Math.floor(ROT.RNG.getUniform() * (armorMax - armorMin)) + armorMin;
                    this.armorRolls.push(roll);
                }
                this.finalDmg = 0;
                for (var j = 0; j < modMul; j++) {
                    this.finalDmg += Math.max(0, modDmg - this.armorRolls[j]);
                }
            }
            return AttackResult;
        })();
        Entities.AttackResult = AttackResult;
    })(Common.Entities || (Common.Entities = {}));
    var Entities = Common.Entities;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Entities) {
        var Entity = (function () {
            function Entity(name) {
                this.name = name;
                this.skills = new Entities.Skillset();
                this.traits = new Array();
                this.inventory = new Array();
                this.actionQueue = new Array();
            }
            Object.defineProperty(Entity.prototype, "x", {
                get: function () {
                    return this._x;
                },
                set: function (value) {
                    this._x = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Entity.prototype, "y", {
                get: function () {
                    return this._y;
                },
                set: function (value) {
                    this._y = value;
                },
                enumerable: true,
                configurable: true
            });

            Entity.prototype.getStruck = function (attack) {
                var evadeSkill;
                switch (attack.hitSkill) {
                    default:
                        evadeSkill = this.skills.evasion;
                }
                var result = new Entities.AttackResult(attack, this, evadeSkill, 0, 0);
                this.stats.hp -= result.finalDmg;
                return result;
            };

            Entity.prototype.getAttack = function () {
                throw ("Abstract!");
            };

            Entity.prototype.getAction = function () {
                return this.actionQueue.pop();
            };
            Entity.prototype.addAction = function (action) {
                this.actionQueue.unshift(action);
            };

            Entity.prototype.hasAP = function () {
                return false;
            };

            Entity.prototype.hasTurn = function () {
                return false;
            };

            Entity.prototype.newTurn = function () {
                throw ("Abstract!");
            };
            return Entity;
        })();
        Entities.Entity = Entity;
    })(Common.Entities || (Common.Entities = {}));
    var Entities = Common.Entities;
})(Common || (Common = {}));
var Common;
(function (Common) {
    ///<reference path="Entity.ts"/>
    (function (Entities) {
        var Enemy = (function (_super) {
            __extends(Enemy, _super);
            function Enemy(name, stats, skills, traits) {
                _super.call(this, name);
                if (skills)
                    this.skills = skills;
                else
                    this.skills = new Entities.Skillset();
                if (traits)
                    this.traits = traits;
                else
                    this.traits = new Array();
                this.stats = stats;
                this._hasTurn = true;
                this.dir = Common.Vec.West;
            }
            Enemy.prototype.hasAP = function () {
                return this.stats.ap > 0;
            };

            Enemy.prototype.hasTurn = function () {
                return this._hasTurn;
            };

            Enemy.prototype.newTurn = function () {
                this.stats.ap = this.stats.apMax;
                this._hasTurn = true;
            };
            return Enemy;
        })(Entities.Entity);
        Entities.Enemy = Enemy;
    })(Common.Entities || (Common.Entities = {}));
    var Entities = Common.Entities;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Entities) {
        (function (Skills) {
            Skills[Skills["prowess"] = 0] = "prowess";
            Skills[Skills["perception"] = 1] = "perception";
            Skills[Skills["wrestling"] = 2] = "wrestling";
            Skills[Skills["evasion"] = 3] = "evasion";
            Skills[Skills["fortitude"] = 4] = "fortitude";
            Skills[Skills["will"] = 5] = "will";
            Skills[Skills["stealth"] = 6] = "stealth";
        })(Entities.Skills || (Entities.Skills = {}));
        var Skills = Entities.Skills;

        function getEnemy(name) {
            switch (name) {
                default:
                    return new Entities.Enemy(name, new Entities.Statset(80, 30, 10, 10));
                    break;
            }
        }
        Entities.getEnemy = getEnemy;
    })(Common.Entities || (Common.Entities = {}));
    var Entities = Common.Entities;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Entities) {
        var Equipment = (function () {
            function Equipment() {
                this.mainHand = Common.Items.Weapon.None;
                this.offHand = Common.Items.Weapon.None;
            }
            Equipment.prototype.equipWeapon = function (weapon, offHand) {
                var removed = new Array();
                switch (weapon.type) {
                    case 1 /* Offhand */:
                        if (this.mainHand.type != 2 /* Twohanded */)
                            removed.push(this.offHand);
                        this.offHand = weapon;
                        break;
                    case 3 /* Ranged */:
                        removed.push(this.ranged);
                        this.ranged = weapon;
                        break;
                    case 2 /* Twohanded */:
                        removed.push(this.mainHand);
                        if (this.offHand != Common.Items.Weapon.None)
                            removed.push(this.offHand);
                        this.mainHand = weapon;
                        break;
                    case 0 /* Normal */:
                        if (!offHand) {
                            removed.push(this.mainHand);
                            this.mainHand = weapon;
                        } else {
                            removed.push(this.offHand);
                            this.offHand = weapon;
                        }
                        break;
                }
                return removed;
            };

            Equipment.prototype.unequipWeapon = function (slot) {
                var removed = Common.Items.Weapon.None;
                switch (slot) {
                    case "mainhand":
                        removed = this.mainHand;
                        this.mainHand = Common.Items.Weapon.None;
                        break;
                    case "offhand":
                        removed = this.mainHand;
                        this.offHand = Common.Items.Weapon.None;
                        break;
                    case "ranged":
                        removed = this.ranged;
                        this.ranged = Common.Items.Weapon.None;
                        break;
                }
                return removed;
            };

            Equipment.prototype.equipArmor = function (piece) {
                var removed = Common.Items.ArmorPiece.None;
                switch (piece.type) {
                    case 0 /* Head */:
                        if (this.head !== Common.Items.ArmorPiece.None)
                            removed = this.head;
                        this.head = piece;
                        break;
                    case 2 /* Arms */:
                        if (this.arms !== Common.Items.ArmorPiece.None)
                            removed = this.arms;
                        this.arms = piece;
                        break;
                    case 3 /* Body */:
                        if (this.body !== Common.Items.ArmorPiece.None)
                            removed = this.body;
                        this.body = piece;
                        break;
                    case 1 /* Legs */:
                        if (this.legs !== Common.Items.ArmorPiece.None)
                            removed = this.legs;
                        this.legs = piece;
                        break;
                }
                return removed;
            };

            Equipment.prototype.unequipArmor = function (slot) {
                var removed = Common.Items.ArmorPiece.None;
                switch (slot) {
                    case "head":
                        removed = this.head;
                        this.mainHand = Common.Items.Weapon.None;
                        break;
                    case "arms":
                        removed = this.arms;
                        this.offHand = Common.Items.Weapon.None;
                        break;
                    case "body":
                        removed = this.body;
                        this.ranged = Common.Items.Weapon.None;
                        break;
                    case "legs":
                        removed = this.legs;
                        this.ranged = Common.Items.Weapon.None;
                        break;
                }
                return removed;
            };
            return Equipment;
        })();
        Entities.Equipment = Equipment;
    })(Common.Entities || (Common.Entities = {}));
    var Entities = Common.Entities;
})(Common || (Common = {}));
var Common;
(function (Common) {
    ///<reference path="Entity.ts"/>
    (function (Entities) {
        var PlayerChar = (function (_super) {
            __extends(PlayerChar, _super);
            function PlayerChar(name) {
                _super.call(this, name);
                this.skills.setProwess(5).setEvasion(5);
                this.stats = new Entities.Statset(30, 15, 8, 30);
                this.spirit = 1000;
                this._hasTurn = true;
                this.equipment = new Entities.Equipment();
                this.dir = Common.Vec.East;
            }
            PlayerChar.prototype.hasAP = function () {
                return this.stats.ap > 0;
            };

            PlayerChar.prototype.hasTurn = function () {
                return this._hasTurn;
            };

            PlayerChar.prototype.requestMoves = function (cost, times) {
                var moves = 0;
                for (var i = 0; i < times; i++) {
                    if (this.stats.ap - cost >= 0) {
                        moves += 1;
                        this.stats.ap -= cost;
                    } else
                        break;
                }
                if (moves < times) {
                    moves += this.movesFromStamina(cost, times - moves);
                }
                return moves;
            };

            PlayerChar.prototype.movesFromStamina = function (cost, times) {
                var moves = 0;
                for (var i = 0; i < times; i++) {
                    var nextCost = 0;
                    for (var j = 0; j < cost; j++) {
                        nextCost += Math.ceil((-this.stats.ap + j) / 2) + 1;
                    }
                    if (this.stats.stamina >= nextCost) {
                        moves += 1;
                        this.stats.stamina -= nextCost;
                        this.stats.ap -= cost;
                    } else
                        break;
                }
                return moves;
            };

            PlayerChar.prototype.newTurn = function () {
                if (this.stats.ap > 0)
                    this.stats.setStamina(Math.min(this.stats.stamina + this.stats.ap, this.stats.staminaMax));
                this.stats.ap = this.stats.apMax;
                this.stats.setStamina(Math.min(this.stats.stamina + 3, this.stats.staminaMax));
                this._hasTurn = true;
            };

            PlayerChar.prototype.getAttack = function () {
                return new Entities.Attack(this, this.currWeapon.damage, this.currWeapon.multiplier, this.skills.prowess);
            };

            PlayerChar.prototype.getHitBonus = function () {
                return this.skills.prowess.value + this.currWeapon.toHit;
            };
            PlayerChar.prototype.getDamage = function () {
                return [this.currWeapon.multiplier, this.currWeapon.damage];
            };
            return PlayerChar;
        })(Entities.Entity);
        Entities.PlayerChar = PlayerChar;
    })(Common.Entities || (Common.Entities = {}));
    var Entities = Common.Entities;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Entities) {
        var Skill = (function () {
            function Skill(which, value) {
                this.which = which;
                this.value = value;
            }
            return Skill;
        })();
        Entities.Skill = Skill;
    })(Common.Entities || (Common.Entities = {}));
    var Entities = Common.Entities;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Entities) {
        var Skillset = (function () {
            function Skillset() {
                this.prowess = new Entities.Skill(0 /* prowess */, 0);
                this.perception = new Entities.Skill(1 /* perception */, 0);
                this.wrestling = new Entities.Skill(2 /* wrestling */, 0);
                this.evasion = new Entities.Skill(3 /* evasion */, 0);
                this.fortitude = new Entities.Skill(4 /* fortitude */, 0);
                this.will = new Entities.Skill(5 /* will */, 0);
                this.stealth = new Entities.Skill(6 /* stealth */, 0);
            }
            Skillset.prototype.setProwess = function (amount) {
                this.prowess.value = amount;
                return this;
            };

            Skillset.prototype.setEvasion = function (amount) {
                this.evasion.value = amount;
                return this;
            };
            return Skillset;
        })();
        Entities.Skillset = Skillset;
    })(Common.Entities || (Common.Entities = {}));
    var Entities = Common.Entities;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Entities) {
        var Statset = (function () {
            function Statset(maxHp, maxStamina, maxAP, eqWt) {
                this.hp = maxHp;
                this.hpMax = maxHp;
                this.ap = maxAP;
                this.apMax = maxAP;
                this.stamina = maxStamina;
                this.staminaMax = maxStamina;
                this.equipWeight = eqWt;
                this.exp = 0;
            }
            Statset.prototype.setHP = function (val) {
                this.hp = val;
                return this;
            };

            Statset.prototype.setAP = function (val) {
                this.ap = val;
                return this;
            };

            Statset.prototype.setStamina = function (val) {
                this.stamina = val;
                return this;
            };
            return Statset;
        })();
        Entities.Statset = Statset;
    })(Common.Entities || (Common.Entities = {}));
    var Entities = Common.Entities;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Entities) {
        var Trait = (function () {
            function Trait() {
            }
            return Trait;
        })();
        Entities.Trait = Trait;
    })(Common.Entities || (Common.Entities = {}));
    var Entities = Common.Entities;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Items) {
        var ArmorPiece = (function () {
            function ArmorPiece() {
                this._toHit = 0;
                this._toEvasion = 0;
                this._toMinArmor = 0;
                this._toMaxArmor = 0;
            }
            Object.defineProperty(ArmorPiece.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArmorPiece.prototype, "description", {
                get: function () {
                    return this._description;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArmorPiece.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArmorPiece.prototype, "durability", {
                get: function () {
                    return this._durability;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArmorPiece.prototype, "weight", {
                get: function () {
                    return this._weight;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArmorPiece.prototype, "toHit", {
                get: function () {
                    return this._toHit;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArmorPiece.prototype, "toEvasion", {
                get: function () {
                    return this._toEvasion;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArmorPiece.prototype, "toMinArmor", {
                get: function () {
                    return this._toMinArmor;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ArmorPiece.prototype, "toMaxArmor", {
                get: function () {
                    return this._toMaxArmor;
                },
                enumerable: true,
                configurable: true
            });

            ArmorPiece.prototype.setName = function (name) {
                this._name = name;
                return this;
            };
            ArmorPiece.prototype.setDescription = function (description) {
                this._description = description;
                return this;
            };

            ArmorPiece.prototype.setType = function (type) {
                this._type = type;
                return this;
            };

            ArmorPiece.prototype.setDurability = function (amount) {
                this._durability = amount;
                return this;
            };

            ArmorPiece.prototype.setWeight = function (amount) {
                this._weight = amount;
                return this;
            };

            ArmorPiece.prototype.setArmor = function (min, max) {
                this._toMinArmor = min;
                this._toMaxArmor = max;
                return this;
            };

            ArmorPiece.prototype.setBonuses = function (hit, evasion) {
                this._toHit = hit;
                this._toEvasion = evasion;
                return this;
            };

            ArmorPiece.None = new ArmorPiece().setName("none");
            return ArmorPiece;
        })();
        Items.ArmorPiece = ArmorPiece;
    })(Common.Items || (Common.Items = {}));
    var Items = Common.Items;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Items) {
        var Consumable = (function () {
            function Consumable() {
            }
            return Consumable;
        })();
        Items.Consumable = Consumable;
    })(Common.Items || (Common.Items = {}));
    var Items = Common.Items;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Items) {
        (function (Weapons) {
            Weapons[Weapons["Dagger"] = 0] = "Dagger";
            Weapons[Weapons["ShortSword"] = 1] = "ShortSword";
            Weapons[Weapons["Broadsword"] = 2] = "Broadsword";
            Weapons[Weapons["Mace"] = 3] = "Mace";
            Weapons[Weapons["HandAxe"] = 4] = "HandAxe";
            Weapons[Weapons["BattleAxe"] = 5] = "BattleAxe";
            Weapons[Weapons["Spear"] = 6] = "Spear";
            Weapons[Weapons["Pike"] = 7] = "Pike";
            Weapons[Weapons["Mattock"] = 8] = "Mattock";
            Weapons[Weapons["Maul"] = 9] = "Maul";
            Weapons[Weapons["Greataxe"] = 10] = "Greataxe";
            Weapons[Weapons["LongSword"] = 11] = "LongSword";
            Weapons[Weapons["Halberd"] = 12] = "Halberd";
            Weapons[Weapons["RoundShield"] = 13] = "RoundShield";
            Weapons[Weapons["TowerShield"] = 14] = "TowerShield";
        })(Items.Weapons || (Items.Weapons = {}));
        var Weapons = Items.Weapons;

        (function (Armors) {
            Armors[Armors["Coat"] = 0] = "Coat";
            Armors[Armors["LeatherArmor"] = 1] = "LeatherArmor";
            Armors[Armors["MailShirt"] = 2] = "MailShirt";
            Armors[Armors["Hauberk"] = 3] = "Hauberk";
            Armors[Armors["Lamellar"] = 4] = "Lamellar";
            Armors[Armors["Gloves"] = 5] = "Gloves";
            Armors[Armors["Gauntlets"] = 6] = "Gauntlets";
            Armors[Armors["Hat"] = 7] = "Hat";
            Armors[Armors["Helmet"] = 8] = "Helmet";
            Armors[Armors["FullHelm"] = 9] = "FullHelm";
            Armors[Armors["Boots"] = 10] = "Boots";
            Armors[Armors["Greaves"] = 11] = "Greaves";
        })(Items.Armors || (Items.Armors = {}));
        var Armors = Items.Armors;

        (function (WeaponTypes) {
            WeaponTypes[WeaponTypes["Normal"] = 0] = "Normal";
            WeaponTypes[WeaponTypes["Offhand"] = 1] = "Offhand";
            WeaponTypes[WeaponTypes["Twohanded"] = 2] = "Twohanded";
            WeaponTypes[WeaponTypes["Ranged"] = 3] = "Ranged";
        })(Items.WeaponTypes || (Items.WeaponTypes = {}));
        var WeaponTypes = Items.WeaponTypes;

        (function (ArmorTypes) {
            ArmorTypes[ArmorTypes["Head"] = 0] = "Head";
            ArmorTypes[ArmorTypes["Legs"] = 1] = "Legs";
            ArmorTypes[ArmorTypes["Arms"] = 2] = "Arms";
            ArmorTypes[ArmorTypes["Body"] = 3] = "Body";
        })(Items.ArmorTypes || (Items.ArmorTypes = {}));
        var ArmorTypes = Items.ArmorTypes;

        function getWeapon(which) {
            var weapon;
            switch (which) {
                case 0 /* Dagger */:
                    weapon = new Items.Weapon().setName("dagger").setType(0 /* Normal */).setDamage(4, 4).setRange(0, 2).setCost(2).setDurability(50).setBonuses(0, 1, 0, 0);
                    break;
                case 1 /* ShortSword */:
                    weapon = new Items.Weapon().setName("short sword").setType(0 /* Normal */).setDamage(4, 6).setRange(0, 2).setDurability(40).setCost(3);
                    break;
                case 2 /* Broadsword */:
                    weapon = new Items.Weapon().setName("broadsword").setType(0 /* Normal */).setDamage(3, 7).setRange(2, 3).setDurability(30).setCost(3);
                    break;
                case 3 /* Mace */:
                    weapon = new Items.Weapon().setName("mace").setType(0 /* Normal */).setDamage(1, 15).setRange(2, 3).setDurability(45).setCost(3);
                    break;
                case 4 /* HandAxe */:
                    weapon = new Items.Weapon().setName("hand axe").setType(0 /* Normal */).setDamage(3, 7).setRange(0, 2).setDurability(30).setCost(3);
                    break;
                case 5 /* BattleAxe */:
                    weapon = new Items.Weapon().setName("battle axe").setType(0 /* Normal */).setDamage(2, 8).setRange(2, 3).setDurability(30).setCost(3);
                    break;
                case 8 /* Mattock */:
                    weapon = new Items.Weapon().setName("mattock").setType(0 /* Normal */).setDamage(1, 14).setRange(2, 3).setCost(3).setDurability(30).setBonuses(-2, 0, 0, 0);
                    break;
                case 6 /* Spear */:
                    weapon = new Items.Weapon().setName("spear").setType(0 /* Normal */).setDamage(2, 7).setRange(3, 5).setDurability(45).setCost(3);
                    break;
                case 7 /* Pike */:
                    weapon = new Items.Weapon().setName("pike").setType(2 /* Twohanded */).setDamage(2, 10).setRange(4, 7).setCost(4).setDurability(45);
                    break;
                case 12 /* Halberd */:
                    weapon = new Items.Weapon().setName("halberd").setType(2 /* Twohanded */).setDamage(2, 11).setRange(3, 5).setCost(4).setDurability(30);
                    break;
                case 9 /* Maul */:
                    weapon = new Items.Weapon().setName("maul").setType(2 /* Twohanded */).setDamage(1, 25).setRange(2, 3).setCost(5).setDurability(45);
                    break;
                case 10 /* Greataxe */:
                    weapon = new Items.Weapon().setName("great axe").setType(2 /* Twohanded */).setDamage(2, 12).setRange(3, 4).setCost(4).setDurability(30);
                    break;
                case 11 /* LongSword */:
                    weapon = new Items.Weapon().setName("long sword").setType(2 /* Twohanded */).setDamage(3, 9).setRange(2, 4).setCost(4).setDurability(30);
                    break;
                case 13 /* RoundShield */:
                    weapon = new Items.Weapon().setName("round shield").setType(1 /* Offhand */).setDamage(3, 5).setRange(2, 2).setCost(3).setDurability(60).setBonuses(0, 4, 1, 2);
                    break;
                case 14 /* TowerShield */:
                    weapon = new Items.Weapon().setName("tower shield").setType(1 /* Offhand */).setDamage(3, 6).setRange(2, 2).setCost(4).setDurability(80).setBonuses(-2, 4, 2, 3);
                    break;
                default:
                    weapon = Items.Weapon.None;
                    break;
            }
            return weapon;
        }
        Items.getWeapon = getWeapon;

        function getArmor(which) {
            var piece;
            switch (which) {
                case 0 /* Coat */:
                    piece = new Items.ArmorPiece().setName("wool coat").setType(3 /* Body */).setArmor(0, 2).setBonuses(0, 2).setDurability(70);
                    break;
                case 1 /* LeatherArmor */:
                    piece = new Items.ArmorPiece().setName("leather armor").setType(3 /* Body */).setArmor(0, 4).setBonuses(0, 1).setDurability(90);
                    break;
                case 2 /* MailShirt */:
                    piece = new Items.ArmorPiece().setName("mail shirt").setType(3 /* Body */).setArmor(1, 4).setBonuses(0, 0).setDurability(100);
                    break;
                case 3 /* Hauberk */:
                    piece = new Items.ArmorPiece().setName("mail hauberk").setType(3 /* Body */).setArmor(2, 5).setBonuses(0, 0).setDurability(120);
                    break;
                case 4 /* Lamellar */:
                    piece = new Items.ArmorPiece().setName("lamellar armour").setType(3 /* Body */).setArmor(3, 6).setBonuses(-1, -1).setDurability(90);
                    break;
                case 5 /* Gloves */:
                    piece = new Items.ArmorPiece().setName("leather gloves").setType(2 /* Arms */).setArmor(0, 1).setBonuses(0, 1).setDurability(70);
                    break;
                case 6 /* Gauntlets */:
                    piece = new Items.ArmorPiece().setName("mail gauntlets").setType(2 /* Arms */).setArmor(1, 2).setBonuses(-1, 0).setDurability(90);
                    break;
                case 10 /* Boots */:
                    piece = new Items.ArmorPiece().setName("leather boots").setType(1 /* Legs */).setArmor(0, 1).setBonuses(0, 1).setDurability(70);
                    break;
                case 11 /* Greaves */:
                    piece = new Items.ArmorPiece().setName("greaves").setType(1 /* Legs */).setArmor(1, 2).setBonuses(0, 0).setDurability(90);
                    break;
                case 7 /* Hat */:
                    piece = new Items.ArmorPiece().setName("leather hat").setType(0 /* Head */).setArmor(0, 1).setBonuses(0, 0).setDurability(70);
                    break;
                case 8 /* Helmet */:
                    piece = new Items.ArmorPiece().setName("helmet").setType(0 /* Head */).setArmor(1, 1).setBonuses(0, 0).setDurability(100);
                    break;
                case 9 /* FullHelm */:
                    piece = new Items.ArmorPiece().setName("full helm").setType(0 /* Head */).setArmor(2, 3).setBonuses(-2, 0).setDurability(120);
                    break;
            }
            return piece;
        }
        Items.getArmor = getArmor;
    })(Common.Items || (Common.Items = {}));
    var Items = Common.Items;
})(Common || (Common = {}));
var Common;
(function (Common) {
    (function (Items) {
        var Weapon = (function () {
            function Weapon() {
                this._toHit = 0;
                this._toEvasion = 0;
                this._toMinArmor = 0;
                this._toMaxArmor = 0;
            }
            Object.defineProperty(Weapon.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Weapon.prototype, "description", {
                get: function () {
                    return this._description;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Weapon.prototype, "type", {
                get: function () {
                    return this._type;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Weapon.prototype, "damage", {
                get: function () {
                    return this._dmg;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Weapon.prototype, "multiplier", {
                get: function () {
                    return this._mul;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Weapon.prototype, "minRange", {
                get: function () {
                    return this._minRange;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Weapon.prototype, "maxRange", {
                get: function () {
                    return this._maxRange;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Weapon.prototype, "apCost", {
                get: function () {
                    return this._apCost;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Weapon.prototype, "durability", {
                get: function () {
                    return this._durability;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Weapon.prototype, "weight", {
                get: function () {
                    return this._weight;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Weapon.prototype, "toHit", {
                get: function () {
                    return this._toHit;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Weapon.prototype, "toEvasion", {
                get: function () {
                    return this._toEvasion;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Weapon.prototype, "toMinArmor", {
                get: function () {
                    return this._toMinArmor;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Weapon.prototype, "toMaxArmor", {
                get: function () {
                    return this._toMaxArmor;
                },
                enumerable: true,
                configurable: true
            });

            Weapon.prototype.setDamage = function (multiplier, damage) {
                this._mul = multiplier;
                this._dmg = damage;
                return this;
            };

            Weapon.prototype.setName = function (name) {
                this._name = name;
                return this;
            };
            Weapon.prototype.setDescription = function (description) {
                this._description = description;
                return this;
            };

            Weapon.prototype.setType = function (type) {
                this._type = type;
                return this;
            };

            Weapon.prototype.setRange = function (min, max) {
                this._minRange = min;
                this._maxRange = max;
                return this;
            };

            Weapon.prototype.setCost = function (cost) {
                this._apCost = cost;
                return this;
            };

            Weapon.prototype.setDurability = function (amount) {
                this._durability = amount;
                return this;
            };

            Weapon.prototype.setWeight = function (amount) {
                this._weight = amount;
                return this;
            };

            Weapon.prototype.setBonuses = function (hit, evasion, armorMin, armorMax) {
                this._toHit = hit;
                this._toEvasion = evasion;
                this._toMinArmor = armorMin;
                this.toMaxArmor = armorMax;
                return this;
            };

            Weapon.None = new Weapon().setName("none");
            return Weapon;
        })();
        Items.Weapon = Weapon;
    })(Common.Items || (Common.Items = {}));
    var Items = Common.Items;
})(Common || (Common = {}));
var Common;
(function (Common) {
    var Observable = (function () {
        function Observable() {
            this.observers = new Array();
        }
        Observable.prototype.attach = function (observer) {
            this.observers.push(observer);
        };

        Observable.prototype.detach = function (observer) {
            var index = this.observers.indexOf(observer);
            this.observers.splice(index, 1);
        };

        Observable.prototype.notify = function () {
            this.observers.forEach(function (o) {
                o();
            });
        };
        return Observable;
    })();
    Common.Observable = Observable;

    var ObservableProperty = (function (_super) {
        __extends(ObservableProperty, _super);
        function ObservableProperty() {
            _super.call(this);
        }
        Object.defineProperty(ObservableProperty.prototype, "unwrap", {
            get: function () {
                return this._property;
            },
            set: function (property) {
                this._property = property;
                this.notify();
            },
            enumerable: true,
            configurable: true
        });
        return ObservableProperty;
    })(Observable);
    Common.ObservableProperty = ObservableProperty;
})(Common || (Common = {}));
var Common;
(function (Common) {
    var Settings = (function () {
        function Settings() {
        }
        Object.defineProperty(Settings, "UpdateRate", {
            get: function () {
                return 33;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings, "MapHeight", {
            get: function () {
                return 33;
            },
            enumerable: true,
            configurable: true
        });
        return Settings;
    })();
    Common.Settings = Settings;
})(Common || (Common = {}));
var Common;
(function (Common) {
    var Vec = (function () {
        function Vec() {
        }
        Object.defineProperty(Vec, "East", {
            get: function () {
                return { x: 1, y: 0 };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec, "West", {
            get: function () {
                return { x: -1, y: 0 };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec, "North", {
            get: function () {
                return { x: 0, y: -1 };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec, "South", {
            get: function () {
                return { x: 0, y: 1 };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec, "Southeast", {
            get: function () {
                return { x: 1, y: 1 };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec, "Northwest", {
            get: function () {
                return { x: -1, y: -1 };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec, "Northeast", {
            get: function () {
                return { x: 1, y: -1 };
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vec, "Southwest", {
            get: function () {
                return { x: -1, y: 1 };
            },
            enumerable: true,
            configurable: true
        });

        Vec.add = function (a, b) {
            return { x: a.x + b.x, y: a.y + b.y };
        };
        Vec.sub = function (a, b) {
            return { x: a.x - b.x, y: a.y - b.y };
        };
        return Vec;
    })();
    Common.Vec = Vec;
})(Common || (Common = {}));
/// <reference path="../Common/Common.ts" />
/// <reference path="../Common/Dungeon/Dungeon.ts" />
/// <reference path="../Common/Entities/Entities.ts" />
var ConsoleGame;
(function (ConsoleGame) {
    var Camera = (function () {
        function Camera(xOffset, width, yOffset, height) {
            this.width = width;
            this.height = height;
            this.xOffset = xOffset;
            this.yOffset = yOffset;
            this.x = 0;
            this.y = 0;
        }
        Object.defineProperty(Camera.prototype, "view", {
            get: function () {
                return this._view;
            },
            enumerable: true,
            configurable: true
        });

        Camera.prototype.centerOn = function (x, y, level, players) {
            this.x = Math.floor(x - this.width / 2) - 1;
            if (y)
                this.y = Math.floor(y - this.height / 2) - 1;
            if (level && players)
                this.updateView(level, players);
        };

        Camera.prototype.translate = function (x, y) {
            this.x += x;
            this.y += y;
        };

        Camera.prototype.updateView = function (level, entities) {
            var map = this.getMapView(level.map);
            if (entities)
                this._view = this.addEntities(map, entities);
            else
                this._view = this.addEntities(map, level.entities);
        };

        Camera.prototype.sees = function (x, y) {
            return x >= this.x && y >= this.y && x < this.x + this.width && y < this.y + this.height;
        };

        Camera.prototype.getMapView = function (map) {
            var matrix = new Array();
            for (var i = 0; i < this.width; i++) {
                matrix[i] = new Array();
                for (var j = 0; j < this.height; j++) {
                    matrix[i][j] = { symbol: " " };
                }
            }

            for (var key in map) {
                var parts = key.split(",");
                var x = parseInt(parts[0]);
                var y = parseInt(parts[1]);

                if (isNaN(x) || isNaN(y)) {
                    continue;
                }
                if (x < this.x || y < this.y || x > this.x + this.width - 1 || y > this.y + this.height - 1) {
                    continue;
                }

                switch (map[key]) {
                    case " ":
                        matrix[x - this.x][y - this.y] = {
                            symbol: map[key],
                            color: "white",
                            bgColor: "gray"
                        };
                        break;
                    default:
                        matrix[x - this.x][y - this.y] = {
                            symbol: map[key],
                            color: "white"
                        };
                        break;
                }
            }
            return new ConsoleGame.DrawMatrix(this.xOffset, this.yOffset, matrix);
        };

        Camera.prototype.addEntities = function (matrix, entities) {
            var _this = this;
            entities.forEach(function (e) {
                //ConsoleGame.log(e);
                if (e.x < _this.x || e.y < _this.y || e.x > _this.x + _this.width - 1 || e.y > _this.y + _this.height - 1) {
                } else {
                    var d = ConsoleGame.getDrawable(e);
                    matrix.matrix[e.x - _this.x][e.y - _this.y].symbol = d.symbol;
                    matrix.matrix[e.x - _this.x][e.y - _this.y].color = d.color;
                    if (matrix.matrix[e.x + e.dir.x - _this.x])
                        matrix.matrix[e.x + e.dir.x - _this.x][e.y + e.dir.y - _this.y].bgColor = "tan";
                }
            });
            return matrix;
        };
        return Camera;
    })();
    ConsoleGame.Camera = Camera;
})(ConsoleGame || (ConsoleGame = {}));
/// <reference path="../Common/Common.ts" />
/// <reference path="../Common/Entities/Entities.ts" />
var ConsoleGame;
(function (ConsoleGame) {
    var Entities = Common.Entities;

    function symbolO(item) {
        throw ("TODO");
    }
    ConsoleGame.symbolO = symbolO;

    function colorO(item) {
        throw ("TODO");
    }
    ConsoleGame.colorO = colorO;

    function symbolE(entity) {
        throw ("TODO");
    }
    ConsoleGame.symbolE = symbolE;

    function colorE(entity) {
        throw ("TODO");
    }
    ConsoleGame.colorE = colorE;

    function getDrawable(entity) {
        if (entity instanceof Entities.PlayerChar) {
            return { symbol: "@" };
        } else {
            return { symbol: "e" };
        }
    }
    ConsoleGame.getDrawable = getDrawable;

    function wrapString(str, limit) {
        var arr = new Array();
        var split = str.split(" ");
        function nextLine(words, startIndex) {
            var line = words[startIndex];
            var lt = words[startIndex].length;
            var i = startIndex + 1;
            var next = words[i];
            while (next && lt + next.length + 1 < limit) {
                lt += next.length + 1;
                line += " " + next;
                i += 1;
                next = words[i];
            }

            return [line, i];
        }

        var wordsUsed = 0;
        while (wordsUsed < split.length) {
            var line = nextLine(split, wordsUsed);
            arr.push(line[0]);
            wordsUsed = line[1];
        }

        return arr;
    }
    ConsoleGame.wrapString = wrapString;
})(ConsoleGame || (ConsoleGame = {}));
var ConsoleGame;
(function (ConsoleGame) {
    (function (Core) {
        (function (Control) {
            var lastDownTarget;
            var lastMouseX = 0;
            var lastMouseY = 0;
            var mouseDown = false;

            function init(game) {
                var display = game.display;
                var canvas = display.getContainer();

                document.addEventListener("mousedown", function (event) {
                    mouseDown = true;
                    lastDownTarget = event.target;
                    if (lastDownTarget != canvas)
                        return;

                    var pos = display.eventToPosition(event);
                    var x = pos[0];
                    var y = pos[1];
                    if (x >= 0 && y >= 1) {
                        //ConsoleGame.log(x + "," + y);
                        if (x >= ConsoleGame.Settings.CamXOffset && x < ConsoleGame.Settings.CamXOffset + ConsoleGame.Settings.CamWidth && y >= ConsoleGame.Settings.CamYOffset && y < ConsoleGame.Settings.CamYOffset + ConsoleGame.Settings.CamHeight) {
                            game.gameScreen.acceptMousedown(x, y);
                        }
                    }
                }, false);

                document.addEventListener("mouseup", function (event) {
                    mouseDown = false;
                }, false);

                document.addEventListener("mousemove", function (event) {
                    if (lastDownTarget != canvas)
                        return;
                    if (Math.abs(event.x - lastMouseX) < 5 && Math.abs(event.y - lastMouseY) < 8)
                        return;

                    //ConsoleGame.log(event.x +","+ event.y)
                    lastMouseX = event.x;
                    lastMouseY = event.y;

                    var pos = display.eventToPosition(event);
                    var x = pos[0];
                    var y = pos[1];
                    if (x >= 0 && y >= 1) {
                        if (x >= ConsoleGame.Settings.CamXOffset && x < ConsoleGame.Settings.CamXOffset + ConsoleGame.Settings.CamWidth && y >= ConsoleGame.Settings.CamYOffset && y < ConsoleGame.Settings.CamYOffset + ConsoleGame.Settings.CamHeight) {
                            if (mouseDown) {
                                game.gameScreen.acceptMousedrag(x, y);
                            } else {
                                game.gameScreen.acceptMousemove(x, y);
                            }
                        }
                    }
                }, false);

                document.addEventListener("keydown", function (event) {
                    if (lastDownTarget != canvas)
                        return;

                    var code = event.keyCode;
                    var vk;
                    for (var name in ROT) {
                        if (ROT[name] == code && name.indexOf("VK_") == 0) {
                            vk = name;
                            break;
                        }
                    }
                    game.gameScreen.acceptKeydown(vk);
                }, false);
                /*document.addEventListener("keypress", (event) => {
                if (lastDownTarget != canvas) return;
                
                var code = event.charCode;
                var ch = String.fromCharCode(code);
                
                //ConsoleGame.log("Keypress: char is " + ch);
                }, false);*/
            }
            Control.init = init;
            ;
        })(Core.Control || (Core.Control = {}));
        var Control = Core.Control;
    })(ConsoleGame.Core || (ConsoleGame.Core = {}));
    var Core = ConsoleGame.Core;
})(ConsoleGame || (ConsoleGame = {}));
var ConsoleGame;
(function (ConsoleGame) {
    (function (Core) {
        var Game = (function () {
            function Game() {
                var _this = this;
                this.display = new ROT.Display({ width: ConsoleGame.Settings.DisplayWidth, height: ConsoleGame.Settings.DisplayHeight });
                this.gameScreen = new ConsoleGame.GameScreen();
                this.gameScreen.nextFrame.attach(function () {
                    _this.draw(_this.gameScreen.nextFrame.unwrap);
                });
                this.screen = this.gameScreen;
                Core.Control.init(this);

                var resize = function () {
                    var size = _this.display.computeFontSize(Number.MAX_VALUE, window.innerHeight);
                    _this.display.setOptions({ fontSize: size });

                    while (_this.display.computeFontSize(window.innerWidth, Number.MAX_VALUE) >= size) {
                        _this.display.setOptions({ width: _this.display.getOptions().width + 1 });
                    }
                    while (_this.display.computeFontSize(window.innerWidth, Number.MAX_VALUE) < size) {
                        _this.display.setOptions({ width: _this.display.getOptions().width - 1 });
                    }

                    ConsoleGame.Settings.DisplayWidth = _this.display.getOptions().width;
                    _this.gameScreen.camera.width = ConsoleGame.Settings.DisplayWidth - ConsoleGame.Settings.SidebarWidth * 2;
                    _this.gameScreen.manager.changed.notify();
                    //console.log((window.innerWidth / window.innerHeight).toFixed(2));
                    //console.log(this.display.getOptions().width);
                };
                window.onresize = resize;
                resize();
            }
            Game.prototype.draw = function (matrix) {
                this.display.clear();
                matrix.draw(this.display);
                //Eventual goal: the game logic should be a web worker,
                //with control sending string messages of DOM events to it
                //and it sending JSON:ed DrawMatrixes to this
            };
            return Game;
        })();
        Core.Game = Game;
    })(ConsoleGame.Core || (ConsoleGame.Core = {}));
    var Core = ConsoleGame.Core;
})(ConsoleGame || (ConsoleGame = {}));

window.onload = function () {
    document.getElementById("content").appendChild(new ConsoleGame.Core.Game().display.getContainer());
};
/// <reference path="../Common/Controllers/Controllers.ts" />
var ConsoleGame;
(function (ConsoleGame) {
    var DrawMatrix = (function () {
        function DrawMatrix(xOffset, yOffset, matrix, width, height, bgColor) {
            this.xOffset = xOffset;
            this.yOffset = yOffset;

            if (matrix) {
                this.matrix = matrix;
            } else {
                this.matrix = new Array();
                for (var i = 0; i < width; i++) {
                    this.matrix[i] = new Array();
                    for (var j = 0; j < height; j++) {
                        this.matrix[i][j] = { symbol: " ", bgColor: bgColor };
                    }
                }
            }
        }
        DrawMatrix.prototype.addString = function (x, y, str, wrapAt, color, bgColor) {
            if (!str)
                return this;
            var lines = new Array();
            var bgc;

            var limit = this.matrix.length;
            if (wrapAt) {
                limit = wrapAt;
            }

            if (x + str.length > limit) {
                lines = ConsoleGame.wrapString(str, limit - x);
            } else {
                lines.push(str);
            }

            for (var h = 0; h < lines.length; h++) {
                var line = lines[h];
                for (var i = 0; i < line.length; i++) {
                    if (this.matrix[i + x] && this.matrix[i + x][h + y]) {
                        if (!bgColor)
                            bgc = this.matrix[i + x][h + y].bgColor;
                        else
                            bgc = bgColor;
                        this.matrix[i + x][h + y] = { symbol: line[i], color: color, bgColor: bgc };
                    }
                }
            }
            return this;
        };

        DrawMatrix.prototype.addPath = function (path, offsetX, offsetY, maxAP, excludeFirst, color) {
            var _this = this;
            if (!path)
                return this;

            var nodes = path._nodes;
            var limited = path.limitedNodes();
            if (!color)
                color = "slateblue";
            if (excludeFirst) {
                nodes.shift();
            }
            nodes.forEach(function (node) {
                if (_this.matrix[node.x - offsetX] && _this.matrix[node.x - offsetX][node.y - offsetY]) {
                    var bg = _this.matrix[node.x - offsetX][node.y - offsetY].bgColor;
                    if (!bg)
                        bg = "black";
                    _this.matrix[node.x - offsetX][node.y - offsetY].bgColor = ROT.Color.toRGB((ROT.Color.interpolate(ROT.Color.fromString(bg), ROT.Color.fromString("purple"), 0.33)));
                }
            });
            limited.forEach(function (node) {
                if (_this.matrix[node.x - offsetX] && _this.matrix[node.x - offsetX][node.y - offsetY]) {
                    var bg = _this.matrix[node.x - offsetX][node.y - offsetY].bgColor;
                    if (!bg)
                        bg = "black";
                    _this.matrix[node.x - offsetX][node.y - offsetY].bgColor = ROT.Color.toRGB((ROT.Color.interpolate(ROT.Color.fromString(bg), ROT.Color.fromString(color), 0.5)));
                }
            });
            var p = path.pointer;
            if (this.matrix[p.x - offsetX] && this.matrix[p.x - offsetX][p.y - offsetY]) {
                var bg = this.matrix[p.x - offsetX][p.y - offsetY].bgColor;
                if (!bg)
                    bg = "black";
                if (limited[limited.length - 1] && p.x == limited[limited.length - 1].x && p.y == limited[limited.length - 1].y)
                    this.matrix[p.x - offsetX][p.y - offsetY].bgColor = color;
                else
                    this.matrix[p.x - offsetX][p.y - offsetY].bgColor = "purple";
            }
            return this;
        };

        DrawMatrix.prototype.addOverlay = function (other) {
            var newXOff = Math.min(this.xOffset, other.xOffset);
            var newYOff = Math.min(this.yOffset, other.yOffset);

            if (newXOff < this.xOffset) {
                var ext = new Array();
                for (var i = 0; i < newXOff - this.xOffset; i++) {
                    ext[i] = new Array();
                    for (var j = 0; j < this.matrix[0].length; j++) {
                        ext[i][j] = { symbol: " " };
                    }
                }
                this.matrix = ext.concat(this.matrix);
                this.xOffset = newXOff;
            }
            if (newYOff < this.yOffset) {
                for (var i = 0; i < this.matrix.length; i++) {
                    var ext2 = new Array();
                    for (var j = 0; j < newYOff - this.yOffset; j++) {
                        ext2[j] = { symbol: " " };
                    }
                    this.matrix[i] = ext2.concat(this.matrix[i]);
                }
                this.yOffset = newYOff;
            }

            for (var i = 0; i < other.matrix.length; i++) {
                for (var j = 0; j < other.matrix[0].length; j++) {
                    if (other.matrix[i][j].symbol && other.matrix[i][j].symbol !== " ") {
                        this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].symbol = other.matrix[i][j].symbol;
                        this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].color = other.matrix[i][j].color;
                    } else {
                        var c1 = this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].color;
                        var c2 = other.matrix[i][j].bgColor;
                        if (!c1)
                            c1 = "black";
                        if (!c2)
                            c2 = "black";
                        this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].color = ROT.Color.toRGB((ROT.Color.interpolate(ROT.Color.fromString(c1), ROT.Color.fromString(c2), 0.75)));
                    }
                    var bg1 = this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].bgColor;
                    var bg2 = other.matrix[i][j].bgColor;
                    if (!bg1)
                        bg1 = "black";
                    if (!bg2)
                        bg2 = "black";

                    this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].bgColor = ROT.Color.toRGB((ROT.Color.interpolate(ROT.Color.fromString(bg1), ROT.Color.fromString(bg2), 0.75)));
                }
            }

            return this;
        };

        DrawMatrix.prototype.draw = function (display) {
            for (var i = 0; i < this.matrix.length; i++) {
                for (var j = 0; j < this.matrix[0].length; j++) {
                    if (!this.matrix[i][j])
                        continue;

                    display.draw(i + this.xOffset, j + this.yOffset, this.matrix[i][j].symbol, this.matrix[i][j].color, this.matrix[i][j].bgColor);
                }
            }
        };
        return DrawMatrix;
    })();
    ConsoleGame.DrawMatrix = DrawMatrix;
})(ConsoleGame || (ConsoleGame = {}));
/// <reference path="../Common/Common.ts" />
var ConsoleGame;
(function (ConsoleGame) {
    var Dungeon = Common.Dungeon;

    var Controllers = Common.Controllers;
    var C = Common;

    var GameScreen = (function () {
        function GameScreen() {
            var _this = this;
            this.dungeon = new Array(new Dungeon.Level(0 /* Mines */));
            this.currLevel = 0;
            this.manager = new Controllers.EntityManager(this.dungeon[this.currLevel]);
            this.nextFrame = new C.ObservableProperty();
            this.camera = new ConsoleGame.Camera(ConsoleGame.Settings.SidebarWidth, ConsoleGame.Settings.DisplayWidth - ConsoleGame.Settings.SidebarWidth * 2, 0, ConsoleGame.Settings.DisplayHeight - ConsoleGame.Settings.BottomBarHeight);
            this.textBox = new ConsoleGame.UI.TextBox(ConsoleGame.Settings.SidebarWidth, 0, 7);
            Controllers.Player.initialize(this.textBox, this.manager);

            var update = function () {
                var middle = _this.manager.characters.map(function (c) {
                    return c.x;
                }).reduce(function (x1, x2) {
                    return x1 + x2;
                }) / _this.manager.characters.length;
                _this.camera.centerOn(middle);
                _this.advanceFrame();
            };
            this.manager.currEntity.attach(update);
            this.manager.changed.attach(update);
            this.manager.currPath.attach(function () {
                return _this.advanceFrame();
            });
            this.manager.start();
            update();
        }
        GameScreen.prototype.advanceFrame = function () {
            var _this = this;
            this.manager.engine.lock();

            this.camera.updateView(this.manager.level);
            var matrix = new ConsoleGame.DrawMatrix(0, 0, null, ConsoleGame.Settings.DisplayWidth, ConsoleGame.Settings.DisplayHeight).addOverlay(this.camera.view.addPath(this.manager.currPath.unwrap, this.camera.x, this.camera.y, this.manager.currEntity.unwrap.stats.ap)).addOverlay(this.textBox.getMatrix(this.camera.width)).addOverlay(ConsoleGame.GameUI.getLeftBar(this.manager.characters)).addOverlay(ConsoleGame.GameUI.getDPad()).addOverlay(ConsoleGame.GameUI.getRightBar(this.manager.level.scheduler, this.manager.currEntity.unwrap, this.manager.level.entities.filter(function (e) {
                return _this.camera.sees(e.x, e.y);
            }))).addOverlay(ConsoleGame.GameUI.getBottomBar());
            this.nextFrame.unwrap = matrix;

            this.manager.engine.unlock();
        };

        GameScreen.prototype.acceptMousedown = function (tileX, tileY) {
            Controllers.Player.updateClick(tileX - this.camera.xOffset + this.camera.x, tileY - this.camera.yOffset + this.camera.y);
        };

        GameScreen.prototype.acceptMousedrag = function (tileX, tileY) {
            Controllers.Player.updateMousedrag(tileX - this.camera.xOffset + this.camera.x, tileY - this.camera.yOffset + this.camera.y);
        };

        GameScreen.prototype.acceptMousemove = function (tileX, tileY) {
            Controllers.Player.updateMousemove(tileX - this.camera.xOffset + this.camera.x, tileY - this.camera.yOffset + this.camera.y);
        };

        GameScreen.prototype.acceptKeydown = function (keyCode) {
            Controllers.Player.update(keyCode);
        };
        return GameScreen;
    })();
    ConsoleGame.GameScreen = GameScreen;
})(ConsoleGame || (ConsoleGame = {}));
var ConsoleGame;
(function (ConsoleGame) {
    /// <reference path="../Common/Common.ts" />
    /// <reference path="../Common/Controllers/Controllers.ts" />
    /// <reference path="../Common/Entities/Entities.ts" />
    (function (GameUI) {
        var Controllers = Common.Controllers;

        var color1 = "midnightblue";
        var color2 = "royalblue";

        function getLeftBar(characters) {
            var p1 = characters[0];
            var p2 = characters[1];
            var w = ConsoleGame.Settings.SidebarWidth;
            var matrix = new ConsoleGame.DrawMatrix(0, 0, null, w, 23);

            for (var i = 0; i < ConsoleGame.Settings.SidebarWidth; i++) {
                matrix.matrix[i][0] = { symbol: " ", bgColor: color1 };
            }
            matrix.addString(4, 0, "LEVEL:1");

            matrix.addString(1, 1, "EXP:");
            matrix.addString(1, 3, p1.name);
            matrix.addString(1, 4, "Health:");
            matrix.addString(10, 4, p1.stats.hp + "/" + p1.stats.hpMax);
            matrix.addString(1, 6, "ActPts:");
            matrix.addString(10, 6, p1.stats.ap + "/" + p1.stats.apMax);
            matrix.addString(1, 5, "Stamina:");
            matrix.addString(10, 5, p1.stats.stamina + "/" + p1.stats.staminaMax);
            matrix.addString(5, 7, "(+" + p1.getHitBonus() + ", " + p1.getDamage()[0] + "x" + p1.getDamage()[1] + ")");
            matrix.addString(5, 8, "[+5, 0-0]");

            matrix.addString(1, 10, p2.name);
            matrix.addString(1, 11, "Health:");
            matrix.addString(10, 11, p2.stats.hp + "/" + p2.stats.hpMax);
            matrix.addString(1, 13, "ActPts:");
            matrix.addString(10, 13, p2.stats.ap + "/" + p2.stats.apMax);
            matrix.addString(1, 12, "Stamina:");
            matrix.addString(10, 12, p2.stats.stamina + "/" + p2.stats.staminaMax);
            matrix.addString(5, 14, "(+" + p2.getHitBonus() + ", " + p2.getDamage()[0] + "x" + p2.getDamage()[1] + ")");
            matrix.addString(5, 15, "[+5, 0-0]");

            /*
            matrix.addString(1, 17, p2.name);
            matrix.addString(1, 18, "Health:");
            matrix.addString(10, 18, p2.stats.hp + "/" + p2.stats.hpMax);
            matrix.addString(1, 19, "Actions:");
            matrix.addString(10, 19, p2.stats.ap + "/" + p2.stats.apMax);
            matrix.addString(1, 20, "Enur:");
            matrix.addString(5, 21, "(+5, 3x7)");
            matrix.addString(5, 22, "[+5, 0-0]");
            */
            return matrix;
        }
        GameUI.getLeftBar = getLeftBar;

        function getRightBar(scheduler, current, seen, baseTime) {
            var w = ConsoleGame.Settings.SidebarWidth;
            var wDisp = ConsoleGame.Settings.DisplayWidth;
            var leftEdge = wDisp - w;
            var matrix = new ConsoleGame.DrawMatrix(leftEdge, 0, null, w, ConsoleGame.Settings.DisplayHeight - 2);
            if (!baseTime)
                baseTime = 0;

            var events = scheduler._queue._events;
            var times = scheduler._queue._eventTimes;
            var both = [];
            for (var i = 0; i < events.length; i++) {
                both.push({ event: events[i], time: times[i] });
            }
            both = both.filter(function (obj) {
                return obj.event instanceof Controllers.ChangeProperty && seen.indexOf(obj.event.target) >= 0;
            }).map(function (obj) {
                return { entity: obj.event.target, time: obj.time };
            }).sort(function (obj1, obj2) {
                return obj1.time - obj2.time;
            });
            both.unshift({ entity: current, time: baseTime });

            for (var i = 0; i < ConsoleGame.Settings.SidebarWidth; i++) {
                matrix.matrix[i][0] = { symbol: " ", bgColor: color1 };
            }
            matrix.addString(5, 0, "QUEUE");
            matrix.addString(0, 1, "--- current ---", null, "green");
            for (var i = 0; i < both.length && i < 9; i++) {
                var drawable = ConsoleGame.getDrawable(both[i].entity);
                matrix.addString(1, i * 3 + 2, both[i].entity.name, ConsoleGame.Settings.SidebarWidth - 4);
                matrix.addString(1, i * 3 + 3, "HP:" + both[i].entity.stats.hp + "/" + both[i].entity.stats.hpMax, ConsoleGame.Settings.SidebarWidth - 4);

                //matrix.addString(Constants.SidebarWidth - 4, i * 3 + 2, "---");
                //matrix.addString(Constants.SidebarWidth - 4, i * 3 + 3, "| |");
                if (i % 2 == 0) {
                    matrix.addString(ConsoleGame.Settings.SidebarWidth - 4, i * 3 + 2, "^" + (i + 1) + " ", null, null, color2);
                    matrix.addString(ConsoleGame.Settings.SidebarWidth - 4, i * 3 + 3, " " + drawable.symbol + " ", null, drawable.color, color2);
                } else {
                    matrix.addString(ConsoleGame.Settings.SidebarWidth - 4, i * 3 + 2, "^" + (i + 1) + " ", null, null, color1);
                    matrix.addString(ConsoleGame.Settings.SidebarWidth - 4, i * 3 + 3, " " + drawable.symbol + " ", null, drawable.color, color1);
                }
                //matrix.addString(Constants.SidebarWidth - 4, i * 3 + 4, "---");
                /*
                if (both[i].time === 0) {
                matrix.addString(0, i * 3 + 1, "---  ready  ---", null, "green");
                }
                else {
                matrix.addString(0, i * 3 + 1, "--- +" + (<number>both[i].time).toFixed(2) + "tu ---", null, "red");
                }*/
            }
            matrix.addString(ConsoleGame.Settings.SidebarWidth - 7, 29, "space:");
            matrix.addString(ConsoleGame.Settings.SidebarWidth - 7, 30, " END  ", null, null, color2);
            matrix.addString(ConsoleGame.Settings.SidebarWidth - 7, 31, " TURN ", null, null, color2);

            return matrix;
        }
        GameUI.getRightBar = getRightBar;

        function getDPad() {
            var w = ConsoleGame.Settings.SidebarWidth;
            var hDisp = ConsoleGame.Settings.DisplayHeight;
            var hThis = 10;
            var matrix = new ConsoleGame.DrawMatrix(0, hDisp - hThis - ConsoleGame.Settings.BottomBarHeight, null, w, hThis);

            /*
            matrix.addString(0, 0, "q--- w--- e---");
            matrix.addString(0, 1, "|NW| | N| |NE|");
            matrix.addString(0, 2, "---- ---- ----");
            matrix.addString(0, 3, "a--- f--- d---");
            matrix.addString(0, 4, "|W | PICK | E|");
            matrix.addString(0, 5, "---- ---- ----");
            matrix.addString(0, 6, "z--- x--- c---");
            matrix.addString(0, 7, "|SW| |S | |SE|");
            matrix.addString(0, 8, "---- ---- ----");*/
            matrix.addString(1, 1, "    |    |    ");
            matrix.addString(1, 2, "    |    |    ");
            matrix.addString(1, 3, "----+----+----");
            matrix.addString(1, 4, "    |    |    ");
            matrix.addString(1, 5, "    |    |    ");
            matrix.addString(1, 6, "----+----+----");
            matrix.addString(1, 7, "    |    |    ");
            matrix.addString(1, 8, "    |    |    ");
            matrix.addString(1, 1, "q   ", null, null, color1);
            matrix.addString(1, 2, " NW ", null, null, color1);
            matrix.addString(6, 1, "w   ", null, null, color2);
            matrix.addString(6, 2, "  N ", null, null, color2);
            matrix.addString(11, 1, "e   ", null, null, color1);
            matrix.addString(11, 2, " NE ", null, null, color1);
            matrix.addString(1, 4, "a   ", null, null, color2);
            matrix.addString(1, 5, " W  ", null, null, color2);
            matrix.addString(6, 4, "f   ", null, null, color1);
            matrix.addString(6, 5, "PICK", null, null, color1);
            matrix.addString(11, 4, "d   ", null, null, color2);
            matrix.addString(11, 5, "  E ", null, null, color2);
            matrix.addString(1, 7, "z   ", null, null, color1);
            matrix.addString(1, 8, " SW ", null, null, color1);
            matrix.addString(6, 7, "x   ", null, null, color2);
            matrix.addString(6, 8, " S  ", null, null, color2);
            matrix.addString(11, 7, "c   ", null, null, color1);
            matrix.addString(11, 8, " SE ", null, null, color1);

            return matrix;
        }
        GameUI.getDPad = getDPad;

        function getBottomBar() {
            var matrix = new ConsoleGame.DrawMatrix(0, ConsoleGame.Settings.DisplayHeight - ConsoleGame.Settings.BottomBarHeight, null, ConsoleGame.Settings.DisplayWidth, ConsoleGame.Settings.BottomBarHeight);

            for (var i = 0; i < matrix.matrix.length; i++) {
                for (var j = 0; j < matrix.matrix[0].length; j++) {
                    matrix.matrix[i][j] = { symbol: " ", bgColor: color1 };
                }
            }
            matrix.addString(1, 0, "1");
            matrix.addString(2, 0, "  MOVE  ", null, null, color2);
            matrix.addString(11, 0, "2");
            matrix.addString(12, 0, " ATTACK ", null, null, color2);
            matrix.addString(21, 0, "3");
            matrix.addString(22, 0, " SPECIAL ", null, null, color2);
            matrix.addString(32, 0, "4");
            matrix.addString(33, 0, " SWITCH ", null, null, color2);

            matrix.addString(ConsoleGame.Settings.DisplayWidth - 32, 0, "CON");
            matrix.addString(ConsoleGame.Settings.DisplayWidth - 29, 0, " v ", null, null, color2);
            matrix.addString(ConsoleGame.Settings.DisplayWidth - 25, 0, " ^ ", null, null, color2);
            matrix.addString(ConsoleGame.Settings.DisplayWidth - 20, 0, "INVENTORY", null, null, color2);
            matrix.addString(ConsoleGame.Settings.DisplayWidth - 9, 0, "  MENU  ", null, null, color2);

            return matrix;
        }
        GameUI.getBottomBar = getBottomBar;
    })(ConsoleGame.GameUI || (ConsoleGame.GameUI = {}));
    var GameUI = ConsoleGame.GameUI;
})(ConsoleGame || (ConsoleGame = {}));
var ConsoleGame;
(function (ConsoleGame) {
    var MainMenuScreen = (function () {
        function MainMenuScreen() {
        }
        return MainMenuScreen;
    })();
    ConsoleGame.MainMenuScreen = MainMenuScreen;
})(ConsoleGame || (ConsoleGame = {}));
var ConsoleGame;
(function (ConsoleGame) {
    var Settings = (function () {
        function Settings() {
        }
        Object.defineProperty(Settings, "SidebarWidth", {
            get: function () {
                return 16;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings, "BottomBarHeight", {
            get: function () {
                return 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings, "DisplayWidth", {
            get: function () {
                return Settings._displayWidth;
            },
            set: function (val) {
                Settings._displayWidth = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings, "DisplayHeight", {
            get: function () {
                return 34;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings, "CamXOffset", {
            get: function () {
                return Settings.SidebarWidth;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings, "CamYOffset", {
            get: function () {
                return 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings, "CamWidth", {
            get: function () {
                return Settings.DisplayWidth - Settings.SidebarWidth * 2;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Settings, "CamHeight", {
            get: function () {
                return Settings.DisplayHeight - Settings.BottomBarHeight;
            },
            enumerable: true,
            configurable: true
        });
        Settings._displayWidth = 92;
        return Settings;
    })();
    ConsoleGame.Settings = Settings;
})(ConsoleGame || (ConsoleGame = {}));
var ConsoleGame;
(function (ConsoleGame) {
    (function (UI) {
        var TextBox = (function () {
            function TextBox(x, y, height) {
                this.x = x;
                this.y = y;
                this.height = height;
                this.lines = new Array();
            }
            TextBox.prototype.addLine = function (line) {
                this.lines.push(line);
                if (this.lines.length > 50) {
                    this.lines.splice(0, 25);
                }
                return this;
            };

            TextBox.prototype.getMatrix = function (width) {
                var matrix = new ConsoleGame.DrawMatrix(this.x, this.y, null, width, this.height);
                var used = 0;
                var index = this.lines.length - 1;

                while (used < this.height && index >= 0) {
                    var nextLine = this.lines[index];

                    if (nextLine.length > width - 2) {
                        var split = ConsoleGame.wrapString(nextLine, width - 2);

                        while (split.length > 0 && used < this.height) {
                            var line = split.pop();
                            matrix.addString(1, this.height - used - 1, line, width - 1);
                            used += 1;
                        }
                        /*
                        matrix.addString(1, this.height - used - 1, split[1], width - 1);
                        used += 1;
                        if (used >= this.height)
                        break;
                        else {
                        matrix.addString(1, this.height - used - 1, split[0], width - 1);
                        used += 1;
                        }    */
                    } else {
                        matrix.addString(1, this.height - used - 1, nextLine, width - 1);
                        used += 1;
                    }
                    index -= 1;
                }
                return matrix;
            };
            return TextBox;
        })();
        UI.TextBox = TextBox;
    })(ConsoleGame.UI || (ConsoleGame.UI = {}));
    var UI = ConsoleGame.UI;
})(ConsoleGame || (ConsoleGame = {}));
//# sourceMappingURL=game.js.map
