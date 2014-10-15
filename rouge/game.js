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
            Object.defineProperty(Constants, "SidebarWidth", {
                get: function () {
                    return 16;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "BottomBarHeight", {
                get: function () {
                    return 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "DisplayWidth", {
                get: function () {
                    return Constants._displayWidth;
                },
                set: function (val) {
                    Constants._displayWidth = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Constants, "DisplayHeight", {
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
        (function (Control) {
            var lastDownTarget;

            function init(screen) {
                var display = screen.display;
                var canvas = display.getContainer();
                var camera = screen.camera;

                document.addEventListener("mousedown", function (event) {
                    lastDownTarget = event.target;
                    if (lastDownTarget != canvas)
                        return;

                    var pos = display.eventToPosition(event);
                    var x = pos[0];
                    var y = pos[1];
                    if (x >= 0 && y >= 0) {
                        //console.log(x + "," + y);
                        if (x >= camera.xOffset && x < camera.xOffset + camera.width && y >= camera.yOffset && y < camera.yOffset + camera.height) {
                            Rouge.Controllers.Player.updateClick(x - camera.xOffset + camera.x, y - camera.yOffset + camera.y);
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
                    Rouge.Controllers.Player.update(vk);
                }, false);
                /*document.addEventListener("keypress", (event) => {
                if (lastDownTarget != canvas) return;
                
                var code = event.charCode;
                var ch = String.fromCharCode(code);
                
                //console.log("Keypress: char is " + ch);
                }, false);*/
            }
            Control.init = init;
            ;
        })(Console.Control || (Console.Control = {}));
        var Control = Console.Control;
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
                if (!str)
                    return this;

                var limit = this.matrix.length;
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
                if (!path)
                    return this;

                var nodes = path.nodes();
                var limited = path.nodes(maxAP);
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
                    this.matrix[p.x - offsetX][p.y - offsetY].bgColor = ROT.Color.toRGB((ROT.Color.interpolate(ROT.Color.fromString(bg), ROT.Color.fromString("green"), 0.75)));
                    ;
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
                this.display = new ROT.Display({ width: Console.Constants.DisplayWidth, height: Console.Constants.DisplayHeight });
                this.gameScreen = new Console.GameScreen(this.display);
                this.screen = this.gameScreen;
                Rouge.Console.Control.init(this.gameScreen);

                var resize = function () {
                    var size = _this.display.computeFontSize(Number.MAX_VALUE, window.innerHeight);
                    _this.display.setOptions({ fontSize: size });

                    while (_this.display.computeFontSize(window.innerWidth, Number.MAX_VALUE) >= size) {
                        _this.display.setOptions({ width: _this.display.getOptions().width + 1 });
                    }
                    while (_this.display.computeFontSize(window.innerWidth, Number.MAX_VALUE) < size) {
                        _this.display.setOptions({ width: _this.display.getOptions().width - 1 });
                    }

                    Console.Constants.DisplayWidth = _this.display.getOptions().width;
                    _this.gameScreen.camera.width = Console.Constants.DisplayWidth - Console.Constants.SidebarWidth * 2;
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
                this.dungeon = new Array(new Rouge.Dungeon.Level(0 /* Mines */));
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
                this.manager.currPath.attach(function () {
                    return _this.draw();
                });
                this.camera = new Console.Camera(Console.Constants.SidebarWidth, Console.Constants.DisplayWidth - Console.Constants.SidebarWidth * 2, 0, Console.Constants.DisplayHeight - Console.Constants.BottomBarHeight, this.display);
                update();
            }
            GameScreen.prototype.draw = function () {
                this.manager.engine.lock();

                this.display.clear();
                this.camera.updateView(this.manager.level, this.manager.characters);
                this.camera.view.addPath(this.manager.currPath.property, this.camera.x, this.camera.y, this.manager.currEntity.property.stats.ap).addOverlay(this.debugBox()).draw(this.display);
                Console.GameUI.getLeftBar(this.manager.characters).draw(this.display);
                Console.GameUI.getDPad().draw(this.display);
                Console.GameUI.getRightBar(this.manager.level.scheduler, this.manager.currEntity.property, this.manager.characters.concat(this.manager.level.entities)).draw(this.display);
                Console.GameUI.getBottomBar().draw(this.display);

                this.manager.engine.unlock();
            };

            /*private debugPath(matrix: DrawMatrix): DrawMatrix {
            
            var room1 = (<ROT.Map.Dungeon>this.manager.level.map).getRooms()[0];
            var room2 = (<ROT.Map.Dungeon>this.manager.level.map).getRooms()[9];
            var path = new Controllers.Path((x, y, from: Controllers.ILocation) => {
            return Controllers.isPassable({ x: x, y: y }, this.manager.level, from);
            },
            { x: room1.getCenter()[0], y: room1.getCenter()[1] },
            { x: room2.getCenter()[0], y: room2.getCenter()[1] });
            
            matrix.addPath(path, this.camera.x, this.camera.y, Number.MAX_VALUE);
            return matrix;
            }*/
            GameScreen.prototype.debugBox = function () {
                var box = new Console.TextBox(Console.Constants.SidebarWidth, 0, 6);
                box.addLine("Lorem ipsum dolor sit amet,");
                box.addLine("consectetur adipiscing elit,");
                box.addLine("sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
                box.addLine("Ut enim ad minim veniam,");
                box.addLine("quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
                box.addLine("Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.");
                box.addLine("Excepteur sint occaecat cupidatat non proident,");
                box.addLine("sunt in culpa qui officia deserunt mollit anim id est laborum.");
                var it = box.getMatrix(Console.Constants.DisplayWidth - 2 * Console.Constants.SidebarWidth);
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
                var w = Console.Constants.SidebarWidth;
                var matrix = new Console.DrawMatrix(0, 0, null, w, 11);

                for (var i = 0; i < Console.Constants.SidebarWidth; i++) {
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
                var w = Console.Constants.SidebarWidth;
                var wDisp = Console.Constants.DisplayWidth;
                var leftEdge = wDisp - w;
                var matrix = new Console.DrawMatrix(leftEdge, 0, null, w, Console.Constants.DisplayHeight - 2);
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

                for (var i = 0; i < Console.Constants.SidebarWidth; i++) {
                    matrix.matrix[i][0] = { symbol: " ", bgColor: "midnightblue" };
                }
                matrix.addString(5, 0, "QUEUE");
                for (var i = 0; i < both.length; i++) {
                    var drawable = Console.getDrawable(both[i].entity);
                    matrix.addString(1, i * 3 + 3, both[i].entity.name, Console.Constants.SidebarWidth - 6);
                    matrix.addString(1, i * 3 + 4, "HP:" + both[i].entity.stats.hp + "/" + both[i].entity.stats.hpMax, Console.Constants.SidebarWidth - 6);
                    matrix.addString(Console.Constants.SidebarWidth - 4, i * 3 + 2, "---");
                    matrix.addString(Console.Constants.SidebarWidth - 4, i * 3 + 3, "| |");
                    matrix.addString(Console.Constants.SidebarWidth - 3, i * 3 + 3, drawable.symbol, null, drawable.color);
                    matrix.addString(Console.Constants.SidebarWidth - 4, i * 3 + 4, "---");
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
                var w = Console.Constants.SidebarWidth;
                var hDisp = Console.Constants.DisplayHeight;
                var hThis = 9;
                var matrix = new Console.DrawMatrix(1, hDisp - hThis - Console.Constants.BottomBarHeight - 1, null, w - 2, hThis);

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
                var matrix = new Console.DrawMatrix(0, Console.Constants.DisplayHeight - Console.Constants.BottomBarHeight, null, Console.Constants.DisplayWidth, Console.Constants.BottomBarHeight);

                for (var i = 0; i < matrix.matrix.length; i++) {
                    for (var j = 0; j < matrix.matrix[0].length; j++) {
                        matrix.matrix[i][j] = { symbol: " ", bgColor: "midnightblue" };
                    }
                }
                matrix.addString(1, 0, " SWITCH ", null, null, "royalblue");
                matrix.addString(11, 0, " ATTACK ", null, null, "royalblue");
                matrix.addString(21, 0, " SPECIAL ", null, null, "royalblue");

                //matrix.addString(32, 0, " ?????? ", null, null, "royalblue");
                matrix.addString(Console.Constants.DisplayWidth - 41, 0, "CON:");
                matrix.addString(Console.Constants.DisplayWidth - 37, 0, " - ", null, null, "royalblue");
                matrix.addString(Console.Constants.DisplayWidth - 33, 0, " + ", null, null, "royalblue");
                matrix.addString(Console.Constants.DisplayWidth - 29, 0, " v ", null, null, "royalblue");
                matrix.addString(Console.Constants.DisplayWidth - 25, 0, " ^ ", null, null, "royalblue");
                matrix.addString(Console.Constants.DisplayWidth - 20, 0, "INVENTORY", null, null, "royalblue");
                matrix.addString(Console.Constants.DisplayWidth - 9, 0, "  MENU  ", null, null, "royalblue");

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
                        var split = this.breakIntoLines(nextLine, width - 2);

                        matrix.addString(1, this.height - used - 1, split[1], width - 1);
                        used += 1;
                        if (used >= this.height)
                            break;
                        else {
                            matrix.addString(1, this.height - used - 1, split[0], width - 1);
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

            TextBox.prototype.breakIntoLines = function (str, limit) {
                var arr = new Array();

                var words = str.split(" ");
                var i = 1;
                var next = words[i];
                var lt = words[0].length;
                arr[0] = words[0];
                while (next && lt + next.length + 1 < limit) {
                    lt += next.length + 1;
                    arr[0] += " " + next;
                    i += 1;
                    next = words[i];
                }
                arr[1] = words[i];
                i += 1;
                while (i < words.length) {
                    arr[1] += " " + words[i];
                    i += 1;
                }

                return arr;
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
            Direction[Direction["North"] = 0] = "North";
            Direction[Direction["South"] = 1] = "South";
            Direction[Direction["West"] = 2] = "West";
            Direction[Direction["East"] = 3] = "East";
            Direction[Direction["Northwest"] = 4] = "Northwest";
            Direction[Direction["Northeast"] = 5] = "Northeast";
            Direction[Direction["Southwest"] = 6] = "Southwest";
            Direction[Direction["Southeast"] = 7] = "Southeast";
        })(Controllers.Direction || (Controllers.Direction = {}));
        var Direction = Controllers.Direction;

        function isPassable(loc, level, from) {
            var cell = level.map[loc.x + "," + loc.y];
            if (from) {
                if (diagonalNbors(from, loc)) {
                    var cell2 = level.map[loc.x + "," + from.y];
                    var cell3 = level.map[from.x + "," + loc.y];

                    //console.log(loc.x + "," + loc.y + ": " + cell + " ; " +loc.x + "," + from.y + ": " + cell2 + " ; " + from.x + "," + loc.y + ": " + cell2);
                    //console.log(cell != " " && cell2 != " " && cell3 != " ");
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
            if (entity instanceof Rouge.Entities.PlayerChar) {
                Controllers.Player.activate(entity, manager);
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
                this.currPath = new Controllers.ObservableProperty(null);
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
                    Controllers.planAction(entity, _this);
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
                this.begin = from;

                if (to) {
                    this._astar = new ROT.Path.AStar(to.x, to.y, passableFn, { topology: 4 });
                    this._astar.compute(from.x, from.y, function (x, y) {
                        _this._nodes.push({ x: x, y: y });
                    });

                    //this.fixPath(passableFn);
                    this.calculateCosts();
                    this.pointer = to;
                } else {
                    this._nodes.push(from);
                    this._costs.push(0);
                    this.pointer = from;
                }

                if (!passableFn(this.pointer.x, this.pointer.y)) {
                    this._nodes.pop();
                    this._costs.pop();
                }
            }
            Path.prototype.cost = function () {
                return this._costs.reduce(function (x, y) {
                    return x + y;
                });
            };

            Path.prototype.nodes = function (maxCost) {
                if (maxCost) {
                    var arr = new Array();
                    var cost = 0;
                    for (var i = 0; i < this._nodes.length; i++) {
                        if (cost + this._costs[i] > maxCost)
                            break;

                        arr.push(this._nodes[i]);
                        cost += this._costs[i];
                    }
                    return arr;
                } else
                    return this._nodes;
            };

            Path.prototype.trim = function (maxCost) {
                this._nodes = this.nodes(maxCost);
                this._costs.length = this._nodes.length;
                this.pointer.x = this._nodes[this._nodes.length - 1].x;
                this.pointer.y = this._nodes[this._nodes.length - 1].y;
                return this;
            };

            /*
            movePointer(dir: Direction) {
            switch (dir) {
            case Direction.NORTHWEST:
            this.pointer.y -= 1;
            this.pointer.x -= 1;
            break;
            case Direction.NORTH:
            this.pointer.y -= 1;
            break;
            case Direction.NORTHEAST:
            this.pointer.y -= 1;
            this.pointer.x += 1;
            break;
            case Direction.WEST:
            this.pointer.x -= 1;
            break;
            case Direction.EAST:
            this.pointer.x += 1;
            break;
            case Direction.SOUTHWEST:
            this.pointer.y += 1;
            this.pointer.x -= 1;
            break;
            case Direction.SOUTH:
            this.pointer.y += 1;
            break;
            case Direction.SOUTHEAST:
            this.pointer.y += 1;
            this.pointer.x += 1;
            break;
            }
            
            throw ("TODO");
            }*/
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
                if (Controllers.diagonalNbors(n1, n2)) {
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
                /*
                for (var i = 0; i < arr.length - 3; i++) {
                if (!arr[i + 2]) break;
                
                if (diagonalNbors(arr[i], arr[i+2])) {
                var x, y;
                if (arr[i + 1].x == arr[i].x)
                x = arr[i + 2].x;
                else
                x = arr[i].x;
                if (arr[i + 1].y == arr[i].y)
                y = arr[i + 2].y;
                else
                y = arr[i].y;
                if (passableFn(x, y)) {
                this._nodes.splice(i + 1);
                i -= 1;
                }
                }
                }
                //assumes the preceding for loop has run
                for (var i = 0; i < arr.length - 4; i++) {
                if (!arr[i + 3]) break;
                if (diagonal(arr[i], arr[i + 3]) && Math.abs(arr[i].x - arr[i+3].x) == 2) {
                var x, y;
                x = (arr[i + 3].x + arr[i].x) / 2;
                y = (arr[i + 3].y + arr[i].y) / 2;
                if (passableFn(x, y, { x: arr[i].x, y: arr[i].y }) && passableFn(arr[i + 3].x, arr[i + 3].y, { x: x, y: y })) {
                this._nodes.splice(i + 1, 2, { x: x, y: y });
                }
                }
                
                if (!arr[i + 4]) break;
                if (diagonal(arr[i], arr[i + 4]) && Math.abs(arr[i].x - arr[i + 4].x) == 3) {
                var x1, y1, x2, y2;
                if (arr[i + 4].x > arr[i].x)
                x1 = arr[i].x + 1;
                else
                x1 = arr[i].x - 1;
                if (arr[i + 4].y > arr[i].y)
                y1 = arr[i].y + 1;
                else
                y1 = arr[i].y - 1;
                x2 = (arr[i + 4].x + x1) / 2;
                y2 = (arr[i + 4].y + y1) / 2;
                if (passableFn(x1, y1, { x: arr[i].x, y: arr[i].y }) &&
                passableFn(y1, y2, { x: x1, y: y1 }) &&
                passableFn(arr[i + 4].x, arr[i + 4].y, { x: x2, y: y2 })) {
                this._nodes.splice(i + 1, 3, { x: x1, y: y1 }, { x: x2, y: y2 });
                }
                }
                }*/
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
            var char;
            var lvl;
            var playerTurn = false;
            var manager;
            var callback;

            function activate(character, entityManager) {
                if (!playerTurn) {
                    char = character;
                    lvl = entityManager.level;
                    playerTurn = true;
                    manager = entityManager;
                    callback = function (x, y, from) {
                        return Controllers.isPassable({ x: x, y: y }, manager.level, from);
                    };
                    manager.currPath.property = new Controllers.Path(callback, { x: char.x, y: char.y });
                }
            }
            Player.activate = activate;

            function updateClick(x, y) {
                if (!playerTurn)
                    return;
                if (x < 0 || y < 0)
                    throw (char.x + "," + char.y + " to " + x + "," + y);

                var path = manager.currPath.property;
                if (path && x == path.pointer.x && y == path.pointer.y) {
                    confirm();
                } else {
                    manager.currPath.property = new Controllers.Path(function (x, y, from) {
                        return Controllers.isPassable({ x: x, y: y }, manager.level, from);
                    }, { x: char.x, y: char.y }, { x: x, y: y });
                }
            }
            Player.updateClick = updateClick;

            function update(key) {
                if (!playerTurn)
                    return;

                switch (key) {
                    case "VK_Q":
                        alterPath(4 /* Northwest */);
                        break;
                    case "VK_W":
                        alterPath(0 /* North */);
                        break;
                    case "VK_E":
                        alterPath(5 /* Northeast */);
                        break;
                    case "VK_A":
                        alterPath(2 /* West */);
                        break;
                    case "VK_D":
                        alterPath(3 /* East */);
                        break;
                    case "VK_Z":
                        alterPath(6 /* Southwest */);
                        break;
                    case "VK_X":
                        alterPath(1 /* South */);
                        break;
                    case "VK_C":
                        alterPath(7 /* Southeast */);
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
            Player.update = update;

            function alterPath(dir) {
                var oldPath = manager.currPath.property;
                var location = oldPath.pointer;
                switch (dir) {
                    case 4 /* Northwest */:
                        location = { x: location.x - 1, y: location.y - 1 };
                        break;
                    case 0 /* North */:
                        location = { x: location.x, y: location.y - 1 };
                        break;
                    case 5 /* Northeast */:
                        location = { x: location.x + 1, y: location.y - 1 };
                        break;
                    case 2 /* West */:
                        location = { x: location.x - 1, y: location.y };
                        break;
                    case 3 /* East */:
                        location = { x: location.x + 1, y: location.y };
                        break;
                    case 6 /* Southwest */:
                        location = { x: location.x - 1, y: location.y + 1 };
                        break;
                    case 1 /* South */:
                        location = { x: location.x, y: location.y + 1 };
                        break;
                    case 7 /* Southeast */:
                        location = { x: location.x + 1, y: location.y + 1 };
                        break;
                }
                manager.currPath.property = new Controllers.Path(callback, oldPath.begin, location);
            }

            function endTurn() {
                char.nextAction = function () {
                    char.active = false;
                    playerTurn = false;
                    manager.currPath.property = null;
                };
            }

            function confirm() {
                var path = manager.currPath.property;
                char.nextAction = function () {
                    var limited = path.trim(char.stats.ap);
                    char.x = limited.nodes()[path.nodes().length - 1].x;
                    char.y = limited.nodes()[path.nodes().length - 1].y;
                    char.stats.ap -= limited.cost();
                    manager.currPath.property = new Controllers.Path(callback, { x: char.x, y: char.y });

                    if (!char.hasAP()) {
                        playerTurn = false;
                    }
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
        (function (MapTypes) {
            MapTypes[MapTypes["Mines"] = 0] = "Mines";
            MapTypes[MapTypes["Cave"] = 1] = "Cave";
            MapTypes[MapTypes["Heart"] = 2] = "Heart";
            MapTypes[MapTypes["Tutorial"] = 3] = "Tutorial";
        })(Dungeon.MapTypes || (Dungeon.MapTypes = {}));
        var MapTypes = Dungeon.MapTypes;

        (function (ItemTypes) {
            ItemTypes[ItemTypes["Weapon"] = 0] = "Weapon";
        })(Dungeon.ItemTypes || (Dungeon.ItemTypes = {}));
        var ItemTypes = Dungeon.ItemTypes;

        function createMap(type) {
            var map;

            switch (type) {
                case 0 /* Mines */:
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
        (function (Weapons) {
            Weapons[Weapons["Dagger"] = 0] = "Dagger";
            Weapons[Weapons["ShortSword"] = 1] = "ShortSword";
            Weapons[Weapons["Mace"] = 2] = "Mace";
            Weapons[Weapons["Battleaxe"] = 3] = "Battleaxe";
            Weapons[Weapons["Spear"] = 4] = "Spear";
            Weapons[Weapons["Pike"] = 5] = "Pike";
            Weapons[Weapons["Mattock"] = 6] = "Mattock";
            Weapons[Weapons["Maul"] = 7] = "Maul";
            Weapons[Weapons["Greataxe"] = 8] = "Greataxe";
            Weapons[Weapons["LongSword"] = 9] = "LongSword";
            Weapons[Weapons["Halberd"] = 10] = "Halberd";
            Weapons[Weapons["RoundShield"] = 11] = "RoundShield";
            Weapons[Weapons["TowerShield"] = 12] = "TowerShield";
        })(Objects.Weapons || (Objects.Weapons = {}));
        var Weapons = Objects.Weapons;

        function getWeapon(type) {
            var weapon;
            switch (type) {
                case 0 /* Dagger */:
                    weapon = new Objects.Weapon().setName("Dagger").setDamage(4, 4).setRange(0, 2).setCost(2).setBonuses(0, 1, 0, 0);
                    break;
                case 1 /* ShortSword */:
                    weapon = new Objects.Weapon().setName("Short sword").setDamage(4, 6).setRange(0, 2).setCost(3);
                    break;
                case 2 /* Mace */:
                    weapon = new Objects.Weapon().setName("Mace").setDamage(2, 8).setRange(2, 3).setCost(3);
                    break;
                case 3 /* Battleaxe */:
                    weapon = new Objects.Weapon().setName("Battle axe").setDamage(3, 7).setRange(2, 3).setCost(3);
                    break;
                case 6 /* Mattock */:
                    weapon = new Objects.Weapon().setName("Mattock").setDamage(1, 14).setRange(2, 3).setCost(3).setBonuses(-2, 0, 0, 0);
                    break;
                case 4 /* Spear */:
                    weapon = new Objects.Weapon().setName("Spear").setDamage(2, 7).setRange(3, 5).setCost(3);
                    break;
                case 5 /* Pike */:
                    weapon = new Objects.Weapon().setName("Pike").setDamage(2, 10).setRange(4, 7).setCost(4).setTwohanded();
                    break;
                case 10 /* Halberd */:
                    weapon = new Objects.Weapon().setName("Halberd").setDamage(2, 11).setRange(3, 5).setCost(4).setTwohanded();
                    break;
                case 7 /* Maul */:
                    weapon = new Objects.Weapon().setName("Maul").setDamage(1, 20).setRange(2, 3).setCost(5).setTwohanded();
                    break;
                case 8 /* Greataxe */:
                    weapon = new Objects.Weapon().setName("Great axe").setDamage(2, 12).setRange(3, 4).setCost(4).setTwohanded();
                    break;
                case 9 /* LongSword */:
                    weapon = new Objects.Weapon().setName("Long sword").setDamage(3, 9).setRange(2, 4).setCost(4).setTwohanded();
                    break;
                case 11 /* RoundShield */:
                    weapon = new Objects.Weapon().setName("Round shield").setDamage(3, 5).setRange(2, 2).setCost(3).setBonuses(0, 4, 1, 2);
                    break;
                case 12 /* TowerShield */:
                    weapon = new Objects.Weapon().setName("Tower shield").setDamage(3, 6).setRange(2, 2).setCost(4).setBonuses(-2, 4, 2, 3);
                    break;
            }
            return weapon;
        }
        Objects.getWeapon = getWeapon;
    })(Rouge.Objects || (Rouge.Objects = {}));
    var Objects = Rouge.Objects;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Objects) {
        var Weapon = (function () {
            function Weapon() {
                this._twoHand = false;
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
            Object.defineProperty(Weapon.prototype, "twoHanded", {
                get: function () {
                    return this._twoHand;
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

            Weapon.prototype.setRange = function (min, max) {
                this._minRange = min;
                this._maxRange = max;
                return this;
            };

            Weapon.prototype.setCost = function (cost) {
                this._apCost = cost;
                return this;
            };

            Weapon.prototype.setTwohanded = function () {
                this._twoHand = true;
                return this;
            };

            Weapon.prototype.setBonuses = function (hit, evasion, armorMin, armorMax) {
                this._toHit = hit;
                this._toEvasion = evasion;
                this._toMinArmor = armorMin;
                this.toMaxArmor = armorMax;
                return this;
            };
            return Weapon;
        })();
        Objects.Weapon = Weapon;
    })(Rouge.Objects || (Rouge.Objects = {}));
    var Objects = Rouge.Objects;
})(Rouge || (Rouge = {}));
window.onload = function () {
    document.getElementById("content").appendChild(new Rouge.Console.Game().display.getContainer());
};
//# sourceMappingURL=game.js.map
