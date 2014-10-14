var Rouge;
(function (Rouge) {
    (function (Console) {
        var Camera = (function () {
            function Camera(xOffset, width, yOffset, height, display) {
                this.width = width;
                this.height = height;
                this.xOffset = xOffset;
                this.yOffset = yOffset;
                this.x = 0;
                this.y = 0;
                this.display = display;
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

            Camera.prototype.updateView = function (level, players) {
                var map = this.getMapView(level.map);
                this._view = this.addEntities(map, level.entities, players);
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
                return new Console.DrawMatrix(this.xOffset, this.yOffset, matrix);
            };

            Camera.prototype.addEntities = function (matrix, entities, characters) {
                var _this = this;
                entities.forEach(function (e) {
                    if (e.x < _this.x || e.y < _this.y || e.x > _this.x + _this.width - 1 || e.y > _this.y + _this.height - 1) {
                    } else {
                        matrix.matrix[e.x - _this.x][e.y - _this.y] = Console.getDrawable(e);
                    }
                });
                characters.forEach(function (p) {
                    if (p.x < _this.x || p.y < _this.y || p.x > _this.x + _this.width - 1 || p.y > _this.y + _this.height - 1) {
                    } else {
                        matrix.matrix[p.x - _this.x][p.y - _this.y] = Console.getDrawable(p);
                    }
                });

                return matrix;
            };
            return Camera;
        })();
        Console.Camera = Camera;
    })(Rouge.Console || (Rouge.Console = {}));
    var Console = Rouge.Console;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Console) {
        var Constants = (function () {
            function Constants() {
            }
            Object.defineProperty(Constants, "SIDEBAR_WIDTH", {
                get: function () {
                    return 16;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "BOTTOM_BAR_HEIGHT", {
                get: function () {
                    return 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "displayWidth", {
                get: function () {
                    return Constants._displayWidth;
                },
                set: function (val) {
                    Constants._displayWidth = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "DISPLAY_HEIGHT", {
                get: function () {
                    return 34;
                },
                enumerable: true,
                configurable: true
            });
            Constants._displayWidth = 92;
            return Constants;
        })();
        Console.Constants = Constants;

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

        function getDrawable(entity) {
            if (entity instanceof Rouge.Entities.PlayerChar) {
                return { symbol: "@" };
            } else {
                return { symbol: "e" };
            }
        }
        Console.getDrawable = getDrawable;
    })(Rouge.Console || (Rouge.Console = {}));
    var Console = Rouge.Console;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Console) {
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
                var limit = this.matrix.length - 1;
                if (wrapAt) {
                    limit = wrapAt;
                }
                var bgc;

                for (var i = 0; i < str.length; i++) {
                    if (i + x < limit) {
                        if (!bgColor)
                            bgc = this.matrix[i + x][y].bgColor;
                        else
                            bgc = bgColor;
                        this.matrix[i + x][y] = { symbol: str[i], color: color, bgColor: bgc };
                    } else {
                        //Add wrapping
                    }
                }
                return this;
            };

            DrawMatrix.prototype.addPath = function (path, offsetX, offsetY, maxAP, excludeFirst, color) {
                var _this = this;
                var nodes = path.nodes(maxAP);
                if (!color)
                    color = "slateblue";
                if (excludeFirst) {
                    nodes.shift();
                }
                nodes.forEach(function (node) {
                    if (_this.matrix[node.x - offsetX] && _this.matrix[node.x - offsetX][node.y - offsetY]) {
                        _this.matrix[node.x - offsetX][node.y - offsetY].bgColor = color;
                    }
                });
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
        Console.DrawMatrix = DrawMatrix;
    })(Rouge.Console || (Rouge.Console = {}));
    var Console = Rouge.Console;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Console) {
        var Game = (function () {
            function Game() {
                var _this = this;
                this.display = new ROT.Display({ width: Console.Constants.displayWidth, height: Console.Constants.DISPLAY_HEIGHT });
                this.gameScreen = new Console.GameScreen(this.display);
                this.screen = this.gameScreen;

                var resize = function () {
                    var size = _this.display.computeFontSize(Number.MAX_VALUE, window.innerHeight);
                    _this.display.setOptions({ fontSize: size });

                    while (_this.display.computeFontSize(window.innerWidth, Number.MAX_VALUE) >= size) {
                        _this.display.setOptions({ width: _this.display.getOptions().width + 1 });
                    }
                    while (_this.display.computeFontSize(window.innerWidth, Number.MAX_VALUE) < size) {
                        _this.display.setOptions({ width: _this.display.getOptions().width - 1 });
                    }

                    Console.Constants.displayWidth = _this.display.getOptions().width;
                    _this.gameScreen.camera.width = Console.Constants.displayWidth - Console.Constants.SIDEBAR_WIDTH * 2;
                    _this.screen.draw();
                    console.log((window.innerWidth / window.innerHeight).toFixed(2));
                    console.log(_this.display.getOptions().width);
                };
                window.onresize = resize;
                resize();
            }
            return Game;
        })();
        Console.Game = Game;
    })(Rouge.Console || (Rouge.Console = {}));
    var Console = Rouge.Console;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Console) {
        var GameScreen = (function () {
            function GameScreen(display) {
                var _this = this;
                this.display = display;
                this.dungeon = new Array(new Rouge.Dungeon.Level(0 /* MINES */));
                this.currLevel = 0;
                this.manager = new Rouge.Controllers.EntityManager(this.dungeon[this.currLevel]);

                var update = function () {
                    function distance(x1, y1, x2, y2) {
                        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    }
                    var e = _this.manager.currEntity.property;
                    var short = _this.manager.characters[0];
                    _this.manager.characters.forEach(function (c) {
                        if (distance(c.x, c.y, e.x, e.y) < distance(short.x, short.y, e.x, e.y)) {
                            short = c;
                        }
                    });
                    _this.camera.centerOn(short.x);
                    _this.draw();
                };
                this.manager.currEntity.attach(update);
                this.manager.changed.attach(update);
                this.camera = new Console.Camera(Console.Constants.SIDEBAR_WIDTH, Console.Constants.displayWidth - Console.Constants.SIDEBAR_WIDTH * 2, 0, Console.Constants.DISPLAY_HEIGHT - Console.Constants.BOTTOM_BAR_HEIGHT, this.display);
                update();
            }
            GameScreen.prototype.draw = function () {
                this.manager.engine.lock();

                this.display.clear();
                this.camera.updateView(this.manager.level, this.manager.characters);
                this.debugPath(this.camera.view.addOverlay(this.debugBox())).draw(this.display);
                Console.GameUI.getLeftBar(this.manager.characters).draw(this.display);
                Console.GameUI.getDPad().draw(this.display);
                Console.GameUI.getRightBar(this.manager.level.scheduler, this.manager.currEntity.property, this.manager.characters.concat(this.manager.level.entities)).draw(this.display);
                Console.GameUI.getBottomBar().draw(this.display);

                this.manager.engine.unlock();
            };

            GameScreen.prototype.debugPath = function (matrix) {
                var _this = this;
                var room1 = this.manager.level.map.getRooms()[0];
                var room2 = this.manager.level.map.getRooms()[9];
                var path = new Rouge.Controllers.Path(function (x, y, from) {
                    return Rouge.Controllers.isPassable({ x: x, y: y }, _this.manager.level, from);
                }, { x: room1.getCenter()[0], y: room1.getCenter()[1] }, { x: room2.getCenter()[0], y: room2.getCenter()[1] });

                matrix.addPath(path, this.camera.x, this.camera.y, Number.MAX_VALUE);
                return matrix;
            };

            GameScreen.prototype.debugBox = function () {
                var box = new Console.TextBox(Console.Constants.SIDEBAR_WIDTH, 0, 6);
                box.addLine("Lorem ipsum dolor sit amet,");
                box.addLine("consectetur adipiscing elit,");
                box.addLine("sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
                box.addLine("Ut enim ad minim veniam,");
                box.addLine("quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
                box.addLine("Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.");
                box.addLine("Excepteur sint occaecat cupidatat non proident,");
                box.addLine("sunt in culpa qui officia deserunt mollit anim id est laborum.");
                var it = box.getMatrix(Console.Constants.displayWidth - 2 * Console.Constants.SIDEBAR_WIDTH);
                return it;
            };
            return GameScreen;
        })();
        Console.GameScreen = GameScreen;
    })(Rouge.Console || (Rouge.Console = {}));
    var Console = Rouge.Console;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Console) {
        (function (GameUI) {
            function getLeftBar(characters) {
                var p1 = characters[0];
                var p2 = characters[1];
                var w = Console.Constants.SIDEBAR_WIDTH;
                var matrix = new Console.DrawMatrix(0, 0, null, w, 11);

                for (var i = 0; i < Console.Constants.SIDEBAR_WIDTH; i++) {
                    matrix.matrix[i][0] = { symbol: " ", bgColor: "midnightblue" };
                }
                matrix.addString(4, 0, "LEVEL:1");

                matrix.addString(1, 2, p1.name);
                matrix.addString(1, 4, "HP: " + p1.stats.hp + "/" + p1.stats.hpMax);
                matrix.addString(1, 5, "AP: " + p1.stats.ap + "/" + p1.stats.apMax);

                matrix.addString(1, 7, p2.name);
                matrix.addString(1, 9, "HP: " + p2.stats.hp + "/" + p2.stats.hpMax);
                matrix.addString(1, 10, "AP: " + p2.stats.ap + "/" + p2.stats.apMax);

                return matrix;
            }
            GameUI.getLeftBar = getLeftBar;

            function getRightBar(scheduler, current, seen, baseTime) {
                var w = Console.Constants.SIDEBAR_WIDTH;
                var wDisp = Console.Constants.displayWidth;
                var leftEdge = wDisp - w;
                var matrix = new Console.DrawMatrix(leftEdge, 0, null, w, Console.Constants.DISPLAY_HEIGHT - 2);
                if (!baseTime)
                    baseTime = 0;

                var events = scheduler._queue._events;
                var times = scheduler._queue._eventTimes;
                var both = [];
                for (var i = 0; i < events.length; i++) {
                    both.push({ event: events[i], time: times[i] });
                }
                both = both.filter(function (obj) {
                    return obj.event instanceof Rouge.Controllers.ChangeProperty && seen.indexOf(obj.event.target) >= 0;
                }).map(function (obj) {
                    return { entity: obj.event.target, time: obj.time };
                }).sort(function (obj1, obj2) {
                    return obj1.time - obj2.time;
                });
                both.unshift({ entity: current, time: baseTime });

                for (var i = 0; i < Console.Constants.SIDEBAR_WIDTH; i++) {
                    matrix.matrix[i][0] = { symbol: " ", bgColor: "midnightblue" };
                }
                matrix.addString(5, 0, "QUEUE");
                for (var i = 0; i < both.length; i++) {
                    var drawable = Console.getDrawable(both[i].entity);
                    matrix.addString(1, i * 3 + 3, both[i].entity.name, Console.Constants.SIDEBAR_WIDTH - 6);
                    matrix.addString(1, i * 3 + 4, "HP:" + both[i].entity.stats.hp + "/" + both[i].entity.stats.hpMax, Console.Constants.SIDEBAR_WIDTH - 6);
                    matrix.addString(Console.Constants.SIDEBAR_WIDTH - 4, i * 3 + 2, "---");
                    matrix.addString(Console.Constants.SIDEBAR_WIDTH - 4, i * 3 + 3, "| |");
                    matrix.addString(Console.Constants.SIDEBAR_WIDTH - 3, i * 3 + 3, drawable.symbol, null, drawable.color);
                    matrix.addString(Console.Constants.SIDEBAR_WIDTH - 4, i * 3 + 4, "---");
                    if (both[i].time === 0) {
                        matrix.addString(1, i * 3 + 2, "-- ready --", null, "green");
                    } else {
                        matrix.addString(1, i * 3 + 2, "- +" + both[i].time.toFixed(2) + "tu -", null, "red");
                    }
                }

                return matrix;
            }
            GameUI.getRightBar = getRightBar;

            function getDPad() {
                var w = Console.Constants.SIDEBAR_WIDTH;
                var hDisp = Console.Constants.DISPLAY_HEIGHT;
                var hThis = 9;
                var matrix = new Console.DrawMatrix(1, hDisp - hThis - Console.Constants.BOTTOM_BAR_HEIGHT - 1, null, w - 2, hThis);

                matrix.addString(0, 0, "q--- w--- e---");
                matrix.addString(0, 1, "|NW| | N| |NE|");
                matrix.addString(0, 2, "---- ---- ----");
                matrix.addString(0, 3, "a--- f--- d---");
                matrix.addString(0, 4, "|W | PICK | E|");
                matrix.addString(0, 5, "---- ---- ----");
                matrix.addString(0, 6, "z--- x--- c---");
                matrix.addString(0, 7, "|SW| |S | |SE|");
                matrix.addString(0, 8, "---- ---- ----");

                return matrix;
            }
            GameUI.getDPad = getDPad;

            function getBottomBar() {
                var matrix = new Console.DrawMatrix(0, Console.Constants.DISPLAY_HEIGHT - Console.Constants.BOTTOM_BAR_HEIGHT, null, Console.Constants.displayWidth, Console.Constants.BOTTOM_BAR_HEIGHT);

                for (var i = 0; i < matrix.matrix.length; i++) {
                    for (var j = 0; j < matrix.matrix[0].length; j++) {
                        matrix.matrix[i][j] = { symbol: " ", bgColor: "midnightblue" };
                    }
                }
                matrix.addString(1, 0, " SWITCH ", null, null, "royalblue");
                matrix.addString(11, 0, " ATTACK ", null, null, "royalblue");
                matrix.addString(21, 0, " SPECIAL ", null, null, "royalblue");

                //matrix.addString(32, 0, " ?????? ", null, null, "royalblue");
                matrix.addString(Console.Constants.displayWidth - 41, 0, "CON:");
                matrix.addString(Console.Constants.displayWidth - 37, 0, " - ", null, null, "royalblue");
                matrix.addString(Console.Constants.displayWidth - 33, 0, " + ", null, null, "royalblue");
                matrix.addString(Console.Constants.displayWidth - 29, 0, " v ", null, null, "royalblue");
                matrix.addString(Console.Constants.displayWidth - 25, 0, " ^ ", null, null, "royalblue");
                matrix.addString(Console.Constants.displayWidth - 20, 0, "INVENTORY", null, null, "royalblue");
                matrix.addString(Console.Constants.displayWidth - 9, 0, "  MENU  ", null, null, "royalblue");

                return matrix;
            }
            GameUI.getBottomBar = getBottomBar;
        })(Console.GameUI || (Console.GameUI = {}));
        var GameUI = Console.GameUI;
    })(Rouge.Console || (Rouge.Console = {}));
    var Console = Rouge.Console;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Console) {
        var MainMenuScreen = (function () {
            function MainMenuScreen() {
            }
            return MainMenuScreen;
        })();
        Console.MainMenuScreen = MainMenuScreen;
    })(Rouge.Console || (Rouge.Console = {}));
    var Console = Rouge.Console;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Console) {
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
                var matrix = new Console.DrawMatrix(this.x, this.y, null, width, this.height);
                var used = 0;
                var index = this.lines.length - 1;

                while (used < this.height && index >= 0) {
                    var nextLine = this.lines[index];

                    if (nextLine.length > width - 2) {
                        var line1 = nextLine.slice(0, width - 2);
                        var line2 = nextLine.slice(width - 2).trim();
                        matrix.addString(1, this.height - used - 1, line2, width - 1);
                        used += 1;
                        if (used >= this.height)
                            break;
                        else {
                            matrix.addString(1, this.height - used - 1, line1, width - 1);
                            used += 1;
                        }
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
        Console.TextBox = TextBox;
    })(Rouge.Console || (Rouge.Console = {}));
    var Console = Rouge.Console;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    var Constants = (function () {
        function Constants() {
        }
        Object.defineProperty(Constants, "UPDATE_RATE", {
            get: function () {
                return 33;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Constants, "MAP_HEIGHT", {
            get: function () {
                return 33;
            },
            enumerable: true,
            configurable: true
        });
        return Constants;
    })();
    Rouge.Constants = Constants;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Controllers) {
        var ChangeProperty = (function () {
            function ChangeProperty(which, to) {
                this.target = to;
                this.func = function () {
                    which.property = to;
                };
            }
            ChangeProperty.prototype.act = function () {
                this.func();
            };
            return ChangeProperty;
        })();
        Controllers.ChangeProperty = ChangeProperty;
    })(Rouge.Controllers || (Rouge.Controllers = {}));
    var Controllers = Rouge.Controllers;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Controllers) {
        (function (Direction) {
            Direction[Direction["NORTH"] = 0] = "NORTH";
            Direction[Direction["SOUTH"] = 1] = "SOUTH";
            Direction[Direction["WEST"] = 2] = "WEST";
            Direction[Direction["EAST"] = 3] = "EAST";
            Direction[Direction["NORTHWEST"] = 4] = "NORTHWEST";
            Direction[Direction["NORTHEAST"] = 5] = "NORTHEAST";
            Direction[Direction["SOUTHWEST"] = 6] = "SOUTHWEST";
            Direction[Direction["SOUTHEAST"] = 7] = "SOUTHEAST";
        })(Controllers.Direction || (Controllers.Direction = {}));
        var Direction = Controllers.Direction;

        function isPassable(loc, level, from) {
            var cell = level.map[loc.x + "," + loc.y];
            if (from) {
                if (diagonal(from, loc)) {
                    var cell2 = level.map[loc.x + "," + from.y];
                    var cell3 = level.map[from.x + "," + loc.y];
                    return cell !== " " && cell2 !== " " && cell3 !== " ";
                }
            }
            return cell !== " ";
        }
        Controllers.isPassable = isPassable;

        function diagonal(loc, neighbor) {
            if (Math.abs(loc.x - neighbor.x) == 1 && Math.abs(loc.y - neighbor.y) == 1) {
                return true;
            } else
                return false;
        }
        Controllers.diagonal = diagonal;

        function planAction(entity, level) {
            if (entity instanceof Rouge.Entities.PlayerChar) {
                Controllers.Player.activate(entity, level);
            } else if (entity instanceof Rouge.Entities.Enemy) {
                var enemy = entity;
                enemy.nextAction = function () {
                    enemy.stats.ap = 2;
                    enemy.active = false;
                };
            }
        }
        Controllers.planAction = planAction;
    })(Rouge.Controllers || (Rouge.Controllers = {}));
    var Controllers = Rouge.Controllers;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Controllers) {
        var EntityManager = (function () {
            function EntityManager(level) {
                var _this = this;
                this.level = level;
                this.currEntity = new Controllers.ObservableProperty(null);
                this.currEntity.attach(function () {
                    return _this.update();
                });
                this.engine = new ROT.Engine(this.level.scheduler);
                this.changed = new Controllers.Observable();
                this.characters = new Array();

                this.start();
            }
            EntityManager.prototype.pause = function () {
                this.engine.lock();
            };

            EntityManager.prototype.start = function () {
                var room = this.level.map.getRooms()[0];
                var player1 = new Rouge.Entities.PlayerChar("char1");
                player1.x = room.getCenter()[0];
                player1.y = room.getCenter()[1];
                this.characters.push(player1);
                this.level.scheduler.add(new Controllers.ChangeProperty(this.currEntity, player1), true, 1);

                var player2 = new Rouge.Entities.PlayerChar("char2");
                player2.x = room.getCenter()[0] + 1;
                player2.y = room.getCenter()[1];
                this.characters.push(player2);
                this.level.scheduler.add(new Controllers.ChangeProperty(this.currEntity, player2), true, 1.5);

                var enemy = Rouge.Entities.getEnemy("debug");
                var room2 = this.level.map.getRooms()[1];
                enemy.x = room2.getCenter()[0];
                enemy.y = room2.getCenter()[1];
                this.level.entities.push(enemy);
                this.level.scheduler.add(new Controllers.ChangeProperty(this.currEntity, enemy), true, 2);

                this.engine.start();
            };

            EntityManager.prototype.update = function () {
                var _this = this;
                this.engine.lock();
                var entity = this.currEntity.property;

                var pollForAction = function () {
                    Controllers.planAction(entity, _this.level);
                    var action = entity.nextAction;
                    if (action) {
                        action();
                        entity.nextAction = undefined;
                        _this.changed.notify();
                    }

                    if (entity.hasAP() && entity.didntEnd()) {
                        setTimeout(pollForAction, Rouge.Constants.UPDATE_RATE);
                    } else {
                        _this.level.scheduler.setDuration(Math.max(0.5, 1 - (entity.stats.ap / entity.stats.apMax)));
                        entity.newTurn();
                        _this.changed.notify();

                        var unlock = function () {
                            _this.engine.unlock();
                        };
                        setTimeout(unlock, Rouge.Constants.UPDATE_RATE * 4);
                    }
                };
                pollForAction();
            };
            return EntityManager;
        })();
        Controllers.EntityManager = EntityManager;
    })(Rouge.Controllers || (Rouge.Controllers = {}));
    var Controllers = Rouge.Controllers;
})(Rouge || (Rouge = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Rouge;
(function (Rouge) {
    (function (Controllers) {
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
        Controllers.Observable = Observable;

        var ObservableProperty = (function (_super) {
            __extends(ObservableProperty, _super);
            function ObservableProperty(property) {
                _super.call(this);
                this._property = property;
            }
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
        })(Observable);
        Controllers.ObservableProperty = ObservableProperty;
    })(Rouge.Controllers || (Rouge.Controllers = {}));
    var Controllers = Rouge.Controllers;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Controllers) {
        var Path = (function () {
            function Path(passableFn, from, to) {
                var _this = this;
                this._nodes = new Array();
                this._costs = new Array();

                if (to) {
                    this._astar = new ROT.Path.AStar(to.x, to.y, passableFn, { topology: 8 });
                    this._astar.compute(from.x, from.y, function (x, y) {
                        _this._nodes.push({ x: x, y: y });
                    });
                    this.fixPath(passableFn);
                    this.calculateCosts();
                    this.pointer = to;
                } else {
                    this._nodes.push(from);
                    this._costs.push(0);
                    this.pointer = from;
                }
            }
            Path.prototype.nodes = function (maxCost) {
                var arr = new Array();
                var cost = 0;
                for (var i = 0; i < this._nodes.length - 1; i++) {
                    if (cost > maxCost)
                        break;

                    arr.push(this._nodes[i]);
                    cost += this._costs[i];
                }
                return arr;
            };

            Path.prototype.movePointer = function (dir) {
                switch (dir) {
                    case 4 /* NORTHWEST */:
                        this.pointer.y -= 1;
                        this.pointer.x -= 1;
                        break;
                    case 0 /* NORTH */:
                        this.pointer.y -= 1;
                        break;
                    case 5 /* NORTHEAST */:
                        this.pointer.y -= 1;
                        this.pointer.x += 1;
                        break;
                    case 2 /* WEST */:
                        this.pointer.x -= 1;
                        break;
                    case 3 /* EAST */:
                        this.pointer.x += 1;
                        break;
                    case 6 /* SOUTHWEST */:
                        this.pointer.y += 1;
                        this.pointer.x -= 1;
                        break;
                    case 1 /* SOUTH */:
                        this.pointer.y += 1;
                        break;
                    case 7 /* SOUTHEAST */:
                        this.pointer.y += 1;
                        this.pointer.x += 1;
                        break;
                }

                throw ("TODO");
            };

            Path.prototype.calculateCosts = function () {
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
                if (Math.abs(n1.x - n2.x) == 1 && Math.abs(n1.y - n2.y) == 1) {
                    return 3;
                } else
                    return 2;
            };

            Path.prototype.fixPath = function (passableFn) {
                var arr = this._nodes;
                for (var i = 0; i < arr.length - 2; i++) {
                    if (!arr[i + 1])
                        break;

                    if (!passableFn(arr[i + 1].x, arr[i + 1].y, arr[i])) {
                        if (passableFn(arr[i].x, arr[i + 1].y)) {
                            this._nodes.splice(i + 1, 0, { x: arr[i].x, y: arr[i + 1].y });
                        } else {
                            this._nodes.splice(i + 1, 0, { x: arr[i + 1].x, y: arr[i].y });
                        }
                    }
                }
            };
            return Path;
        })();
        Controllers.Path = Path;
    })(Rouge.Controllers || (Rouge.Controllers = {}));
    var Controllers = Rouge.Controllers;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Controllers) {
        (function (Player) {
            var _canvas;
            var _lastDownTarget;
            var _char;
            var _level;
            var _active = false;

            function init() {
                _canvas = document.getElementsByTagName("canvas")[0];

                document.addEventListener("mousedown", function (event) {
                    _lastDownTarget = event.target;
                }, false);

                document.addEventListener("keydown", function (event) {
                    if (_lastDownTarget != _canvas)
                        return;

                    var code = event.keyCode;
                    var vk;
                    for (var name in ROT) {
                        if (ROT[name] == code && name.indexOf("VK_") == 0) {
                            vk = name;
                            break;
                        }
                    }
                    update(vk);
                }, false);
                /*document.addEventListener("keypress", (event) => {
                if (lastDownTarget != canvas) return;
                
                var code = event.charCode;
                var ch = String.fromCharCode(code);
                
                //console.log("Keypress: char is " + ch);
                }, false);*/
            }
            Player.init = init;
            ;

            function activate(char, level) {
                if (!_active) {
                    _char = char;
                    _level = level;
                    _active = true;
                }
            }
            Player.activate = activate;

            function update(key) {
                if (!_active) {
                    return;
                }

                switch (key) {
                    case "VK_Q":
                        tryMove(4 /* NORTHWEST */);
                        break;
                    case "VK_W":
                        tryMove(0 /* NORTH */);
                        break;
                    case "VK_E":
                        tryMove(5 /* NORTHEAST */);
                        break;
                    case "VK_A":
                        tryMove(2 /* WEST */);
                        break;
                    case "VK_D":
                        tryMove(3 /* EAST */);
                        break;
                    case "VK_Z":
                        tryMove(6 /* SOUTHWEST */);
                        break;
                    case "VK_X":
                        tryMove(1 /* SOUTH */);
                        break;
                    case "VK_C":
                        tryMove(7 /* SOUTHEAST */);
                        break;
                    case "VK_SPACE":
                        endTurn();
                        break;
                    default:
                        break;
                }
            }

            function tryMove(dir) {
                var location;
                switch (dir) {
                    case 4 /* NORTHWEST */:
                        location = { x: _char.x - 1, y: _char.y - 1 };
                        break;
                    case 0 /* NORTH */:
                        location = { x: _char.x, y: _char.y - 1 };
                        break;
                    case 5 /* NORTHEAST */:
                        location = { x: _char.x + 1, y: _char.y - 1 };
                        break;
                    case 2 /* WEST */:
                        location = { x: _char.x - 1, y: _char.y };
                        break;
                    case 3 /* EAST */:
                        location = { x: _char.x + 1, y: _char.y };
                        break;
                    case 6 /* SOUTHWEST */:
                        location = { x: _char.x - 1, y: _char.y + 1 };
                        break;
                    case 1 /* SOUTH */:
                        location = { x: _char.x, y: _char.y + 1 };
                        break;
                    case 7 /* SOUTHEAST */:
                        location = { x: _char.x + 1, y: _char.y + 1 };
                        break;
                }

                function apCost() {
                    if (dir === 0 /* NORTH */ || dir === 1 /* SOUTH */ || dir === 2 /* WEST */ || dir === 3 /* EAST */) {
                        return 2;
                    } else {
                        return 3;
                    }
                }

                function canPass() {
                    switch (dir) {
                        case 4 /* NORTHWEST */:
                            return Controllers.isPassable(location, _level) && Controllers.isPassable({ x: location.x + 1, y: location.y }, _level) && Controllers.isPassable({ x: location.x, y: location.y + 1 }, _level);
                            break;
                        case 5 /* NORTHEAST */:
                            return Controllers.isPassable(location, _level) && Controllers.isPassable({ x: location.x - 1, y: location.y }, _level) && Controllers.isPassable({ x: location.x, y: location.y + 1 }, _level);
                            break;
                        case 6 /* SOUTHWEST */:
                            return Controllers.isPassable(location, _level) && Controllers.isPassable({ x: location.x + 1, y: location.y }, _level) && Controllers.isPassable({ x: location.x, y: location.y - 1 }, _level);
                            break;
                        case 7 /* SOUTHEAST */:
                            return Controllers.isPassable(location, _level) && Controllers.isPassable({ x: location.x - 1, y: location.y }, _level) && Controllers.isPassable({ x: location.x, y: location.y - 1 }, _level);
                            break;
                        default:
                            return Controllers.isPassable(location, _level);
                            break;
                    }
                }

                if (canPass() && _char.stats.ap >= apCost()) {
                    _char.nextAction = function () {
                        _char.x = location.x;
                        _char.y = location.y;
                        _char.stats.ap -= apCost();

                        if (!_char.hasAP()) {
                            _active = false;
                        }
                    };
                }
            }

            function endTurn() {
                _char.nextAction = function () {
                    _char.active = false;
                    _active = false;
                };
            }
        })(Controllers.Player || (Controllers.Player = {}));
        var Player = Controllers.Player;
    })(Rouge.Controllers || (Rouge.Controllers = {}));
    var Controllers = Rouge.Controllers;
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
                    map = new ROT.Map.Digger(200, Rouge.Constants.MAP_HEIGHT, {
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
    })(Rouge.Dungeon || (Rouge.Dungeon = {}));
    var Dungeon = Rouge.Dungeon;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Dungeon) {
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
        Dungeon.ItemObject = ItemObject;
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
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Entities) {
        var AttackResult = (function () {
            function AttackResult(attack, defender, evadeSkill, armorMin, armorMax) {
                this.attacker = attack.user;
                this.attackDmg = attack.damage;
                this.attackMul = attack.multiplier;
                this.hitRoll = Math.ceil(ROT.RNG.getUniform() * 20) + attack.hitSkill.value;
                this.defender = defender;
                this.evadeRoll = Math.ceil(ROT.RNG.getUniform() * 20) + evadeSkill.value;

                //evades and crits not implemented, only rolls
                this.armorRolls = new Array();
                for (var i = 0; i < this.attackMul; i++) {
                    var roll = Math.floor(ROT.RNG.getUniform() * (armorMax - armorMin)) + armorMin;
                    this.armorRolls.push(roll);
                }
                this.finalDmg = 0;
                for (var j = 0; j < this.attackMul; j++) {
                    this.finalDmg += Math.max(0, this.attackDmg - this.armorRolls[i]);
                }
            }
            return AttackResult;
        })();
        Entities.AttackResult = AttackResult;
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

            Entity.prototype.getStruck = function (attack) {
                var evadeSkill;
                switch (attack.hitSkill) {
                    default:
                        evadeSkill = this.skills.evasion;
                }
                return new Entities.AttackResult(attack, this, evadeSkill, 0, 0);
            };

            Object.defineProperty(Entity.prototype, "nextAction", {
                get: function () {
                    return this.action;
                    //this.action = null;
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

            Entity.prototype.didntEnd = function () {
                return false;
            };

            Entity.prototype.newTurn = function () {
                throw ("Abstract!");
            };
            return Entity;
        })();
        Entities.Entity = Entity;
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    ///<reference path="Entity.ts"/>
    (function (Entities) {
        var Enemy = (function (_super) {
            __extends(Enemy, _super);
            function Enemy(name, stats, skills, traits) {
                _super.call(this);
                this.name = name;
                if (skills)
                    this.skills = skills;
                else
                    this.skills = new Entities.Skillset();
                if (traits)
                    this.traits = traits;
                else
                    this.traits = new Array();
                this.stats = stats;
                this.inventory = new Array();
                this.active = true;
            }
            Enemy.prototype.hasAP = function () {
                return this.stats.ap > 0;
            };

            Enemy.prototype.didntEnd = function () {
                return this.active;
            };

            Enemy.prototype.newTurn = function () {
                this.stats.ap = this.stats.apMax;
                this.active = true;
            };
            return Enemy;
        })(Entities.Entity);
        Entities.Enemy = Enemy;
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
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

        function getEnemy(name) {
            switch (name) {
                default:
                    return new Entities.Enemy(name, new Entities.Stats(300, 6, 100, 10));
                    break;
            }
        }
        Entities.getEnemy = getEnemy;
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    ///<reference path="Entity.ts"/>
    (function (Entities) {
        var PlayerChar = (function (_super) {
            __extends(PlayerChar, _super);
            function PlayerChar(name) {
                _super.call(this);
                this.name = name;
                this.skills = new Entities.Skillset().setProwess(5).setEvasion(5);
                this.traits = new Array();
                this.stats = new Entities.Stats(30, 10, 100, 30);
                this.inventory = new Array();
                this.active = true;
            }
            PlayerChar.prototype.hasAP = function () {
                return this.stats.ap > 0;
            };

            PlayerChar.prototype.didntEnd = function () {
                return this.active;
            };

            PlayerChar.prototype.newTurn = function () {
                this.stats.ap = this.stats.apMax;
                this.active = true;
            };
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
            function Skill(which, value) {
                this.which = which;
                this.value = value;
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
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Entities) {
        var Stats = (function () {
            function Stats(maxHp, maxAP, maxEnd, eqWt) {
                this.hp = maxHp;
                this.hpMax = maxHp;
                this.ap = maxAP;
                this.apMax = maxAP;
                this.endurance = maxEnd;
                this.enduranceMax = maxEnd;
                this.equipWeight = eqWt;
                this.exp = 0;
            }
            Stats.prototype.setHP = function (val) {
                this.hp = val;
                return this;
            };

            Stats.prototype.setAP = function (val) {
                this.ap = val;
                return this;
            };

            Stats.prototype.setEndurance = function (val) {
                this.endurance = val;
                return this;
            };
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
        var Weapon = (function () {
            function Weapon() {
            }
            return Weapon;
        })();
        Objects.Weapon = Weapon;
    })(Rouge.Objects || (Rouge.Objects = {}));
    var Objects = Rouge.Objects;
})(Rouge || (Rouge = {}));
window.onload = function () {
    document.getElementById("content").appendChild(new Rouge.Console.Game().display.getContainer());
    Rouge.Controllers.Player.init();
};
//# sourceMappingURL=game.js.map
