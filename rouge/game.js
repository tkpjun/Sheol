var Rouge;
(function (Rouge) {
    (function (Console) {
        function symbolO(item) {
            throw ("TODO");
        }
        Console.symbolO = symbolO;

        function colorO(item) {
            throw ("TODO");
        }
        Console.colorO = colorO;

        function symbolE(entity) {
            throw ("TODO");
        }
        Console.symbolE = symbolE;

        function colorE(entity) {
            throw ("TODO");
        }
        Console.colorE = colorE;
    })(Rouge.Console || (Rouge.Console = {}));
    var Console = Rouge.Console;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Console) {
        var Game = (function () {
            function Game() {
                var _this = this;
                this.display = new ROT.Display({ fontSize: 23 });
                this.dungeon = new Array(new Rouge.Dungeon.Level(0 /* MINES */));
                this.currLevel = 0;
                this.manager = new Rouge.Control.EntityManager(this.dungeon[this.currLevel]);
                this.manager.changed.attach({ update: function () {
                        _this.drawMap();
                        _this.drawEntities();
                    } });
                this.drawMap();
                this.drawEntities();
            }
            Game.prototype.drawMap = function () {
                var map = this.manager.level.map;
                for (var key in map) {
                    var parts = key.split(",");
                    var x = parseInt(parts[0]);
                    var y = parseInt(parts[1]);
                    this.display.draw(x, y, map[key]);
                }
            };

            Game.prototype.drawEntities = function () {
                var _this = this;
                this.manager.level.entities.forEach(function (e) {
                    _this.display.draw(e.x, e.y, "@");
                });
                this.manager.characters.forEach(function (p) {
                    _this.display.draw(p.x, p.y, "@");
                });
            };
            return Game;
        })();
        Console.Game = Game;
    })(Rouge.Console || (Rouge.Console = {}));
    var Console = Rouge.Console;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Control) {
        var ChangeProperty = (function () {
            function ChangeProperty(which, to) {
                this.func = function () {
                    which.property = to;
                };
            }
            ChangeProperty.prototype.act = function () {
                this.func();
            };
            return ChangeProperty;
        })();
        Control.ChangeProperty = ChangeProperty;
    })(Rouge.Control || (Rouge.Control = {}));
    var Control = Rouge.Control;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Control) {
        (function (Direction) {
            Direction[Direction["NORTH"] = 0] = "NORTH";
            Direction[Direction["SOUTH"] = 1] = "SOUTH";
            Direction[Direction["WEST"] = 2] = "WEST";
            Direction[Direction["EAST"] = 3] = "EAST";
            Direction[Direction["NORTHWEST"] = 4] = "NORTHWEST";
            Direction[Direction["NORTHEAST"] = 5] = "NORTHEAST";
            Direction[Direction["SOUTHWEST"] = 6] = "SOUTHWEST";
            Direction[Direction["SOUTHEAST"] = 7] = "SOUTHEAST";
        })(Control.Direction || (Control.Direction = {}));
        var Direction = Control.Direction;

        function isPassable(x, y, map) {
            var cell = map[x + "," + y];

            //return cell === 0;
            return true;
        }
        Control.isPassable = isPassable;

        function planAction(entity, level) {
            if (entity instanceof Rouge.Entities.PlayerChar) {
            } else {
            }
        }
        Control.planAction = planAction;
    })(Rouge.Control || (Rouge.Control = {}));
    var Control = Rouge.Control;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Control) {
        var EntityManager = (function () {
            function EntityManager(level) {
                var _this = this;
                this.level = level;
                this.currEntity = new Control.ObservableProperty(null);
                this.currEntity.attach({ update: function () {
                        return _this.update();
                    } });
                this.engine = new ROT.Engine(this.level.scheduler);
                this.changed = new Rouge.Observable();
                this.characters = new Array();

                this.start();
            }
            EntityManager.prototype.start = function () {
                var room = this.level.map.getRooms()[0];
                var player1 = new Rouge.Entities.PlayerChar();
                player1.x = room.getCenter()[0];
                player1.y = room.getCenter()[1];
                this.characters.push(player1);
                this.level.scheduler.add(new Control.ChangeProperty(this.currEntity, player1), true);

                this.engine.start();
            };

            EntityManager.prototype.update = function () {
                this.engine.lock();

                /*
                var entity = this.currEntity.property;
                while (entity.hasAP) {
                planAction(entity, this.level);
                var action = entity.nextAction;
                if (action != null) {
                action();
                this.changed.notify();
                }
                }
                */
                this.changed.notify();
                this.level.scheduler.setDuration(1);
                //setTimeout(this.engine.unlock(), 100);
            };
            return EntityManager;
        })();
        Control.EntityManager = EntityManager;
    })(Rouge.Control || (Rouge.Control = {}));
    var Control = Rouge.Control;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Control) {
        var ObservableProperty = (function () {
            function ObservableProperty(property) {
                this.observers = new Array();
                this._property = property;
            }
            ObservableProperty.prototype.attach = function (observer) {
                this.observers.push(observer);
            };

            ObservableProperty.prototype.detach = function (observer) {
                var index = this.observers.indexOf(observer);
                this.observers.splice(index, 1);
            };

            ObservableProperty.prototype.notify = function () {
                this.observers.forEach(function (o) {
                    o.update();
                });
            };

            Object.defineProperty(ObservableProperty.prototype, "property", {
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
        })();
        Control.ObservableProperty = ObservableProperty;
    })(Rouge.Control || (Rouge.Control = {}));
    var Control = Rouge.Control;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Dungeon) {
        (function (MapType) {
            MapType[MapType["MINES"] = 0] = "MINES";
            MapType[MapType["CAVE"] = 1] = "CAVE";
            MapType[MapType["HEART"] = 2] = "HEART";
            MapType[MapType["TUTORIAL"] = 3] = "TUTORIAL";
        })(Dungeon.MapType || (Dungeon.MapType = {}));
        var MapType = Dungeon.MapType;

        function createMap(type) {
            var map;

            switch (type) {
                case 0 /* MINES */:
                    map = new ROT.Map.Digger(80, 25, {
                        dugPercentage: 0.45,
                        roomWidth: [4, 10],
                        roomHeight: [3, 8],
                        corridorLength: [1, 5]
                    });
                    break;
            }

            var digCallback = function (x, y, value) {
                var key = x + "," + y;

                if (value)
                    map[key] = "#";
                else {
                    map[key] = " ";
                }
            };
            map.create(digCallback);
            return map;
        }
        Dungeon.createMap = createMap;
    })(Rouge.Dungeon || (Rouge.Dungeon = {}));
    var Dungeon = Rouge.Dungeon;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Dungeon) {
        var Level = (function () {
            function Level(type) {
                this.scheduler = new ROT.Scheduler.Action();
                this.map = Dungeon.createMap(type);
                this.entities = new Array();
            }
            return Level;
        })();
        Dungeon.Level = Level;
    })(Rouge.Dungeon || (Rouge.Dungeon = {}));
    var Dungeon = Rouge.Dungeon;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
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
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Entities) {
        var Entity = (function () {
            function Entity() {
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

            Entity.prototype.tryStrike = function (attack) {
                throw ("Abstract!");
            };

            Object.defineProperty(Entity.prototype, "nextAction", {
                get: function () {
                    return this.action;
                    this.action = null;
                },
                set: function (action) {
                    this.action = action;
                },
                enumerable: true,
                configurable: true
            });

            Entity.prototype.hasAP = function () {
                return false;
            };
            return Entity;
        })();
        Entities.Entity = Entity;
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
})(Rouge || (Rouge = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Rouge;
(function (Rouge) {
    ///<reference path="Entity.ts"/>
    (function (Entities) {
        var Foe = (function (_super) {
            __extends(Foe, _super);
            function Foe() {
                _super.apply(this, arguments);
            }
            return Foe;
        })(Entities.Entity);
        Entities.Foe = Foe;
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    ///<reference path="Entity.ts"/>
    (function (Entities) {
        var PlayerChar = (function (_super) {
            __extends(PlayerChar, _super);
            function PlayerChar() {
                _super.apply(this, arguments);
            }
            return PlayerChar;
        })(Entities.Entity);
        Entities.PlayerChar = PlayerChar;
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Entities) {
        var Skill = (function () {
            function Skill() {
            }
            return Skill;
        })();
        Entities.Skill = Skill;
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Entities) {
        var Skillset = (function () {
            function Skillset() {
            }
            return Skillset;
        })();
        Entities.Skillset = Skillset;
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Entities) {
        var Stats = (function () {
            function Stats() {
            }
            return Stats;
        })();
        Entities.Stats = Stats;
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Entities) {
        var Trait = (function () {
            function Trait() {
            }
            return Trait;
        })();
        Entities.Trait = Trait;
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Objects) {
        var ArmorPiece = (function () {
            function ArmorPiece() {
            }
            return ArmorPiece;
        })();
        Objects.ArmorPiece = ArmorPiece;
    })(Rouge.Objects || (Rouge.Objects = {}));
    var Objects = Rouge.Objects;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Objects) {
        var Consumable = (function () {
            function Consumable() {
            }
            return Consumable;
        })();
        Objects.Consumable = Consumable;
    })(Rouge.Objects || (Rouge.Objects = {}));
    var Objects = Rouge.Objects;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Objects) {
        var ItemObject = (function () {
            function ItemObject() {
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

            ItemObject.prototype.isPassable = function () {
                return true;
            };

            ItemObject.prototype.use = function () {
                return this.item;
            };
            return ItemObject;
        })();
        Objects.ItemObject = ItemObject;
    })(Rouge.Objects || (Rouge.Objects = {}));
    var Objects = Rouge.Objects;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Objects) {
        var Weapon = (function () {
            function Weapon() {
            }
            return Weapon;
        })();
        Objects.Weapon = Weapon;
    })(Rouge.Objects || (Rouge.Objects = {}));
    var Objects = Rouge.Objects;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
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
                o.update();
            });
        };
        return Observable;
    })();
    Rouge.Observable = Observable;
})(Rouge || (Rouge = {}));

window.onload = function () {
    document.getElementById("content").appendChild(new Rouge.Console.Game().display.getContainer());
};
//# sourceMappingURL=game.js.map
