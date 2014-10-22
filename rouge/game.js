var Rouge;
(function (Rouge) {
    (function (Console) {
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

            Camera.prototype.updateView = function (level, players) {
                var map = this.getMapView(level.map);
                this._view = this.addEntities(map, level.entities, players);
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
                return new Console.DrawMatrix(this.xOffset, this.yOffset, matrix);
            };

            Camera.prototype.addEntities = function (matrix, entities, characters) {
                var _this = this;
                entities.forEach(function (e) {
                    //console.log(e);
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
        var Const = (function () {
            function Const() {
            }
            Object.defineProperty(Const, "SidebarWidth", {
                get: function () {
                    return 16;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Const, "BottomBarHeight", {
                get: function () {
                    return 1;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Const, "DisplayWidth", {
                get: function () {
                    return Const._displayWidth;
                },
                set: function (val) {
                    Const._displayWidth = val;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Const, "DisplayHeight", {
                get: function () {
                    return 34;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Const, "CamXOffset", {
                get: function () {
                    return Const.SidebarWidth;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Const, "CamYOffset", {
                get: function () {
                    return 0;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Const, "CamWidth", {
                get: function () {
                    return Const.DisplayWidth - Const.SidebarWidth * 2;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Const, "CamHeight", {
                get: function () {
                    return Const.DisplayHeight - Const.BottomBarHeight;
                },
                enumerable: true,
                configurable: true
            });
            Const._displayWidth = 92;
            return Const;
        })();
        Console.Const = Const;

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
                            //console.log(x + "," + y);
                            if (x >= Console.Const.CamXOffset && x < Console.Const.CamXOffset + Console.Const.CamWidth && y >= Console.Const.CamYOffset && y < Console.Const.CamYOffset + Console.Const.CamHeight) {
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
                        if (!mouseDown)
                            return;
                        if (Math.abs(event.x - lastMouseX) < 5 && Math.abs(event.y - lastMouseY) < 8)
                            return;

                        //console.log(event.x +","+ event.y)
                        lastMouseX = event.x;
                        lastMouseY = event.y;

                        var pos = display.eventToPosition(event);
                        var x = pos[0];
                        var y = pos[1];
                        if (x >= 0 && y >= 1) {
                            if (x >= Console.Const.CamXOffset && x < Console.Const.CamXOffset + Console.Const.CamWidth && y >= Console.Const.CamYOffset && y < Console.Const.CamYOffset + Console.Const.CamHeight) {
                                game.gameScreen.acceptMousemove(x, y);
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
                    
                    //console.log("Keypress: char is " + ch);
                    }, false);*/
                }
                Control.init = init;
                ;
            })(Core.Control || (Core.Control = {}));
            var Control = Core.Control;
        })(Console.Core || (Console.Core = {}));
        var Core = Console.Core;
    })(Rouge.Console || (Rouge.Console = {}));
    var Console = Rouge.Console;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Console) {
        (function (Core) {
            var Game = (function () {
                function Game() {
                    var _this = this;
                    this.display = new ROT.Display({ width: Console.Const.DisplayWidth, height: Console.Const.DisplayHeight });
                    this.gameScreen = new Console.GameScreen();
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

                        Console.Const.DisplayWidth = _this.display.getOptions().width;
                        _this.gameScreen.camera.width = Console.Const.DisplayWidth - Console.Const.SidebarWidth * 2;
                        _this.gameScreen.manager.changed.notify();
                        console.log((window.innerWidth / window.innerHeight).toFixed(2));
                        console.log(_this.display.getOptions().width);
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
        })(Console.Core || (Console.Core = {}));
        var Core = Console.Core;
    })(Rouge.Console || (Rouge.Console = {}));
    var Console = Rouge.Console;
})(Rouge || (Rouge = {}));

window.onload = function () {
    document.getElementById("content").appendChild(new Rouge.Console.Core.Game().display.getContainer());
};
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
                    if (this.matrix[i + x] && this.matrix[i + x][y]) {
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
        Console.DrawMatrix = DrawMatrix;
    })(Rouge.Console || (Rouge.Console = {}));
    var Console = Rouge.Console;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Console) {
        var GameScreen = (function () {
            function GameScreen() {
                var _this = this;
                this.dungeon = new Array(new Rouge.Dungeon.Level(0 /* Mines */));
                this.currLevel = 0;
                this.manager = new Rouge.Controllers.EntityManager(this.dungeon[this.currLevel]);
                this.nextFrame = new Rouge.ObservableProperty();
                this.camera = new Console.Camera(Console.Const.SidebarWidth, Console.Const.DisplayWidth - Console.Const.SidebarWidth * 2, 0, Console.Const.DisplayHeight - Console.Const.BottomBarHeight);
                this.console = new Console.TextBox(Console.Const.SidebarWidth, 0, 7);
                Rouge.Controllers.Player.initialize(this.console, this.manager);

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

                this.camera.updateView(this.manager.level, this.manager.characters);
                var matrix = new Console.DrawMatrix(0, 0, null, Console.Const.DisplayWidth, Console.Const.DisplayHeight).addOverlay(this.camera.view.addPath(this.manager.currPath.unwrap, this.camera.x, this.camera.y, this.manager.currEntity.unwrap.stats.ap)).addOverlay(this.console.getMatrix(this.camera.width)).addOverlay(Console.GameUI.getLeftBar(this.manager.characters)).addOverlay(Console.GameUI.getDPad()).addOverlay(Console.GameUI.getRightBar(this.manager.level.scheduler, this.manager.currEntity.unwrap, this.manager.characters.concat(this.manager.level.entities.filter(function (e) {
                    return _this.camera.sees(e.x, e.y);
                })))).addOverlay(Console.GameUI.getBottomBar());
                this.nextFrame.unwrap = matrix;

                this.manager.engine.unlock();
            };

            GameScreen.prototype.acceptMousedown = function (tileX, tileY) {
                Rouge.Controllers.Player.updateClick(tileX - this.camera.xOffset + this.camera.x, tileY - this.camera.yOffset + this.camera.y);
            };

            GameScreen.prototype.acceptMousemove = function (tileX, tileY) {
                Rouge.Controllers.Player.updateMousemove(tileX - this.camera.xOffset + this.camera.x, tileY - this.camera.yOffset + this.camera.y);
            };

            GameScreen.prototype.acceptKeydown = function (keyCode) {
                Rouge.Controllers.Player.update(keyCode);
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
            var color1 = "midnightblue";
            var color2 = "royalblue";

            function getLeftBar(characters) {
                var p1 = characters[0];
                var p2 = characters[1];
                var w = Console.Const.SidebarWidth;
                var matrix = new Console.DrawMatrix(0, 0, null, w, 11);

                for (var i = 0; i < Console.Const.SidebarWidth; i++) {
                    matrix.matrix[i][0] = { symbol: " ", bgColor: color1 };
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
                var w = Console.Const.SidebarWidth;
                var wDisp = Console.Const.DisplayWidth;
                var leftEdge = wDisp - w;
                var matrix = new Console.DrawMatrix(leftEdge, 0, null, w, Console.Const.DisplayHeight - 2);
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

                for (var i = 0; i < Console.Const.SidebarWidth; i++) {
                    matrix.matrix[i][0] = { symbol: " ", bgColor: color1 };
                }
                matrix.addString(5, 0, "QUEUE");
                for (var i = 0; i < both.length && i < 9; i++) {
                    var drawable = Console.getDrawable(both[i].entity);
                    matrix.addString(1, i * 3 + 2, both[i].entity.name, Console.Const.SidebarWidth - 4);
                    matrix.addString(1, i * 3 + 3, "HP:" + both[i].entity.stats.hp + "/" + both[i].entity.stats.hpMax, Console.Const.SidebarWidth - 4);

                    //matrix.addString(Constants.SidebarWidth - 4, i * 3 + 2, "---");
                    //matrix.addString(Constants.SidebarWidth - 4, i * 3 + 3, "| |");
                    if (i % 2 == 0) {
                        matrix.addString(Console.Const.SidebarWidth - 4, i * 3 + 2, "^" + (i + 1) + " ", null, null, color2);
                        matrix.addString(Console.Const.SidebarWidth - 4, i * 3 + 3, " " + drawable.symbol + " ", null, drawable.color, color2);
                    } else {
                        matrix.addString(Console.Const.SidebarWidth - 4, i * 3 + 2, "^" + (i + 1) + " ", null, null, color1);
                        matrix.addString(Console.Const.SidebarWidth - 4, i * 3 + 3, " " + drawable.symbol + " ", null, drawable.color, color1);
                    }

                    //matrix.addString(Constants.SidebarWidth - 4, i * 3 + 4, "---");
                    if (both[i].time === 0) {
                        matrix.addString(0, i * 3 + 1, "---  ready  ---", null, "green");
                    } else {
                        matrix.addString(0, i * 3 + 1, "--- +" + both[i].time.toFixed(2) + "tu ---", null, "red");
                    }
                }
                matrix.addString(Console.Const.SidebarWidth - 7, 29, "space:");
                matrix.addString(Console.Const.SidebarWidth - 7, 30, " END  ", null, null, color2);
                matrix.addString(Console.Const.SidebarWidth - 7, 31, " TURN ", null, null, color2);

                return matrix;
            }
            GameUI.getRightBar = getRightBar;

            function getDPad() {
                var w = Console.Const.SidebarWidth;
                var hDisp = Console.Const.DisplayHeight;
                var hThis = 10;
                var matrix = new Console.DrawMatrix(0, hDisp - hThis - Console.Const.BottomBarHeight, null, w, hThis);

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
                var matrix = new Console.DrawMatrix(0, Console.Const.DisplayHeight - Console.Const.BottomBarHeight, null, Console.Const.DisplayWidth, Console.Const.BottomBarHeight);

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

                matrix.addString(Console.Const.DisplayWidth - 32, 0, "CON");
                matrix.addString(Console.Const.DisplayWidth - 29, 0, " v ", null, null, color2);
                matrix.addString(Console.Const.DisplayWidth - 25, 0, " ^ ", null, null, color2);
                matrix.addString(Console.Const.DisplayWidth - 20, 0, "INVENTORY", null, null, color2);
                matrix.addString(Console.Const.DisplayWidth - 9, 0, "  MENU  ", null, null, color2);

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

            Path.prototype.limitedNodes = function () {
                if (this._lengthInAP) {
                    var arr = new Array();
                    var cost = 0;
                    for (var i = 0; i < this._nodes.length; i++) {
                        if (cost + this._costs[i] > this._lengthInAP)
                            break;

                        arr.push(this._nodes[i]);
                        cost += this._costs[i];
                    }
                    return arr;
                } else
                    return this._nodes;
            };

            Path.prototype.trim = function () {
                this._nodes = this.limitedNodes();
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
    ///<reference path="Path.ts"/>
    (function (Controllers) {
        var AstarPath = (function (_super) {
            __extends(AstarPath, _super);
            function AstarPath(passableFn, from, to, lengthInAP) {
                var _this = this;
                _super.call(this);
                this._lengthInAP = lengthInAP;
                this.begin = from;

                if (to) {
                    this._astar = new ROT.Path.AStar(to.x, to.y, passableFn, { topology: 4 });
                    this._astar.compute(from.x, from.y, function (x, y) {
                        _this._nodes.push({ x: x, y: y });
                    });

                    //this.fixPath(passableFn);
                    this.updateCosts();
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
            return AstarPath;
        })(Controllers.Path);
        Controllers.AstarPath = AstarPath;
    })(Rouge.Controllers || (Rouge.Controllers = {}));
    var Controllers = Rouge.Controllers;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
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
            if (loc.x < 1 || loc.y < 1 || loc.x > level.map._width - 2 || loc.y > level.map._height - 2)
                return false;

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
            if (entity instanceof Rouge.Entities.PlayerChar) {
                Controllers.Player.activate(entity);
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
                this.currEntity = new Rouge.ObservableProperty();
                this.currEntity.attach(function () {
                    return _this.update();
                });
                this.currPath = new Rouge.ObservableProperty();
                this.engine = new ROT.Engine(this.level.scheduler);
                this.changed = new Rouge.Observable();
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
                var rooms = this.level.map.getRooms();
                var room = rooms[0];
                var player1 = new Rouge.Entities.PlayerChar("char1");
                player1.equipment.equipWeapon(Rouge.Items.getWeapon(4 /* Mace */), 1 /* Right */);
                player1.x = room.getCenter()[0];
                player1.y = room.getCenter()[1];
                this.characters.push(player1);
                this.level.scheduler.add(new Controllers.ChangeProperty(this.currEntity, player1), true, 1);

                var player2 = new Rouge.Entities.PlayerChar("char2");
                player2.equipment.equipWeapon(Rouge.Items.getWeapon(7 /* Spear */), 1 /* Right */);
                player2.x = room.getCenter()[0] + 1;
                player2.y = room.getCenter()[1];
                this.characters.push(player2);
                this.level.scheduler.add(new Controllers.ChangeProperty(this.currEntity, player2), true, 1.5);

                for (var i = 0; i < rooms.length; i++) {
                    if (i % 6 != 0)
                        continue;

                    var enemy = Rouge.Entities.getEnemy("debug" + i / 6);
                    enemy.x = rooms[i].getLeft();
                    enemy.y = rooms[i].getBottom();

                    //console.log(enemy.x +", "+ enemy.y)
                    this.level.entities.push(enemy);
                    this.level.scheduler.add(new Controllers.ChangeProperty(this.currEntity, enemy), true, 2);
                }
            };

            EntityManager.prototype.update = function () {
                var _this = this;
                this.engine.lock();
                var entity = this.currEntity.unwrap;

                var pollForAction = function () {
                    Controllers.planAction(entity, _this);
                    var action = entity.nextAction;
                    if (action) {
                        action();
                        entity.nextAction = undefined;
                        _this.changed.notify();
                    }

                    if (entity.hasAP() && entity.hasTurn()) {
                        setTimeout(pollForAction, Rouge.Const.UPDATE_RATE);
                    } else {
                        _this.level.scheduler.setDuration(Math.max(0.5, 1 - (entity.stats.ap / entity.stats.apMax)));
                        entity.newTurn();
                        _this.changed.notify();

                        var unlock = function () {
                            _this.engine.unlock();
                        };
                        setTimeout(unlock, Rouge.Const.UPDATE_RATE * 4);
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
var Rouge;
(function (Rouge) {
    (function (Controllers) {
        (function (Player) {
            var States;
            (function (States) {
                States[States["Move"] = 0] = "Move";
                States[States["Attack"] = 1] = "Attack";
                States[States["Inactive"] = 2] = "Inactive";
            })(States || (States = {}));

            var char;
            var lvl;
            var state = 2 /* Inactive */;
            var manager;
            var con;
            var callback;

            function initialize(console, entityManager) {
                manager = entityManager;
                con = console;
                callback = function (x, y) {
                    return Controllers.isPassable({ x: x, y: y }, manager.level);
                };
            }
            Player.initialize = initialize;

            function activate(character) {
                if (state == 2 /* Inactive */) {
                    char = character;
                    lvl = manager.level;
                    state = 0 /* Move */;

                    /*
                    callback = (x, y, from: Controllers.ILocation) => {
                    return Controllers.isPassable({ x: x, y: y }, manager.level, from);
                    }*/
                    manager.currPath.unwrap = new Controllers.AstarPath(callback, { x: char.x, y: char.y });
                }
            }
            Player.activate = activate;

            function updateClick(x, y) {
                if (state == 2 /* Inactive */)
                    return;

                var path = manager.currPath.unwrap;
                if (path && x == path.pointer.x && y == path.pointer.y) {
                    confirm();
                } else if (state == 0 /* Move */) {
                    var oldPath = manager.currPath.unwrap;
                    var newPath = new Controllers.AstarPath(callback, { x: char.x, y: char.y }, { x: x, y: y }, char.stats.ap);
                    if (!oldPath || newPath.pointer.x != oldPath.pointer.x || newPath.pointer.y != oldPath.pointer.y) {
                        manager.currPath.unwrap = newPath;
                    }
                } else if (state == 1 /* Attack */) {
                    var oPath = manager.currPath.unwrap;
                    var nPath = new Controllers.StraightPath(callback, { x: char.x, y: char.y }, { x: x, y: y }, char.equipment.rightWeapon.maxRange);
                    if (!oPath || nPath.pointer.x != oPath.pointer.x || nPath.pointer.y != oPath.pointer.y) {
                        manager.currPath.unwrap = nPath;
                    }
                }
            }
            Player.updateClick = updateClick;

            function updateMousemove(x, y) {
                if (state == 0 /* Move */) {
                    var oldPath = manager.currPath.unwrap;
                    var newPath = new Controllers.AstarPath(callback, { x: char.x, y: char.y }, { x: x, y: y }, char.stats.ap);
                    if (!oldPath || newPath.pointer.x != oldPath.pointer.x || newPath.pointer.y != oldPath.pointer.y) {
                        manager.currPath.unwrap = newPath;
                    }
                } else if (state == 1 /* Attack */) {
                    var oPath = manager.currPath.unwrap;
                    var nPath = new Controllers.StraightPath(callback, { x: char.x, y: char.y }, { x: x, y: y }, char.equipment.rightWeapon.maxRange);
                    if (!oPath || nPath.pointer.x != oPath.pointer.x || nPath.pointer.y != oPath.pointer.y) {
                        manager.currPath.unwrap = nPath;
                    }
                }
            }
            Player.updateMousemove = updateMousemove;

            function update(key) {
                if (state == 2 /* Inactive */)
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
                    case "VK_1":
                        state = 0 /* Move */;
                        manager.currPath.unwrap = null;
                        console.log("char: " + state);
                        break;
                    case "VK_2":
                        state = 1 /* Attack */;
                        manager.currPath.unwrap = null;
                        console.log("char: " + state);
                        break;
                    default:
                        break;
                }
            }
            Player.update = update;

            function alterPath(dir) {
                var oldPath = manager.currPath.unwrap;
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
                if (location.x < 0)
                    location.x = 0;
                if (location.y < 0)
                    location.y = 0;
                if (location.x > lvl.map._width - 1)
                    location.x = lvl.map._width - 1;
                if (location.y > lvl.map._height - 1)
                    location.y = lvl.map._height - 1;

                if (state == 0 /* Move */)
                    manager.currPath.unwrap = new Controllers.AstarPath(callback, oldPath.begin, location, char.stats.ap);
                else if (state == 1 /* Attack */)
                    manager.currPath.unwrap = new Controllers.StraightPath(callback, oldPath.begin, location, char.equipment.rightWeapon.maxRange);
                else
                    throw ("Unimplemented state!");
            }

            function endTurn() {
                char.nextAction = function () {
                    char._hasTurn = false;
                    state = 2 /* Inactive */;
                    manager.currPath.unwrap = null;
                };
            }

            function confirm() {
                var path = manager.currPath.unwrap;
                switch (state) {
                    case 0 /* Move */:
                        char.nextAction = function () {
                            var limited = path.trim();
                            char.x = limited._nodes[path.limitedNodes().length - 1].x;
                            char.y = limited._nodes[path.limitedNodes().length - 1].y;
                            char.stats.ap -= limited.cost();
                            manager.currPath.unwrap = new Controllers.AstarPath(callback, { x: char.x, y: char.y });

                            if (!char.hasAP()) {
                                state = 2 /* Inactive */;
                            }
                        };
                        break;
                    case 1 /* Attack */:
                        char.nextAction = function () {
                            var limited = path.trim();
                            var result;

                            var targets = lvl.entities.filter(function (entity) {
                                return entity.x === limited.pointer.x && entity.y === limited.pointer.y;
                            });
                            if (targets[0] && char.stats.ap >= char.equipment.rightWeapon.apCost) {
                                char.stats.ap -= char.equipment.rightWeapon.apCost;
                                char.equipment.rightWeapon.setDurability(char.equipment.rightWeapon.durability - 1);
                                result = targets[0].getStruck(char.getAttack());
                                con.addLine(result.attacker.name + " hit " + result.defender.name + " for " + result.finalDmg + " damage! - Hit roll: " + (result.hitRoll - result.attacker.skills.prowess.value) + "+" + result.attacker.skills.prowess.value + " vs " + (result.evadeRoll - result.defender.skills.evasion.value) + "+" + result.defender.skills.evasion.value + " - Armor rolls: " + result.armorRolls.toString() + " -");
                            } else if (char.stats.ap < char.equipment.rightWeapon.apCost) {
                                con.addLine("You need " + char.equipment.rightWeapon.apCost + " AP to attack with a " + char.equipment.rightWeapon.name + "!");
                            }

                            manager.currPath.unwrap = new Controllers.StraightPath(callback, { x: char.x, y: char.y }, { x: path._nodes[path._nodes.length - 1].x, y: path._nodes[path._nodes.length - 1].y });
                            if (!char.hasAP()) {
                                state = 2 /* Inactive */;
                            }
                        };
                        break;
                    default:
                        throw ("Bad state: " + state);
                        break;
                }
            }
        })(Controllers.Player || (Controllers.Player = {}));
        var Player = Controllers.Player;
    })(Rouge.Controllers || (Rouge.Controllers = {}));
    var Controllers = Rouge.Controllers;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    ///<reference path="Path.ts"/>
    (function (Controllers) {
        var StraightPath = (function (_super) {
            __extends(StraightPath, _super);
            function StraightPath(passableFn, from, to, lengthInAP) {
                _super.call(this);
                this._lengthInAP = lengthInAP;
                this.begin = from;

                if (to) {
                    this.createPath(passableFn, from, to);
                    this.updateCosts();
                    this.pointer = to;
                } else {
                    this._nodes.push(from);
                    this._costs.push(0);
                    this.pointer = from;
                }
            }
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
                    map = new ROT.Map.Digger(200, Rouge.Const.MAP_HEIGHT, {
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
                var result = new Entities.AttackResult(attack, this, evadeSkill, 0, 0);
                this.stats.hp -= result.finalDmg;
                return result;
            };

            Entity.prototype.getAttack = function () {
                throw ("Abstract!");
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

            Entity.prototype.hasTurn = function () {
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
                    return new Entities.Enemy(name, new Entities.Statset(80, 6, 20, 10));
                    break;
            }
        }
        Entities.getEnemy = getEnemy;
    })(Rouge.Entities || (Rouge.Entities = {}));
    var Entities = Rouge.Entities;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Entities) {
        var Equipment = (function () {
            function Equipment() {
                this.noWeaponSlots = false;
                this.leftWeapon = Rouge.Items.Weapon.None;
                this.rightWeapon = Rouge.Items.Weapon.None;
            }
            Equipment.prototype.equipWeapon = function (weapon, slot) {
                if (this.noWeaponSlots)
                    throw ("Can't equip weapons!");
                switch (slot) {
                    case 0 /* Left */:
                        this.leftWeapon = weapon;
                        break;
                    case 1 /* Right */:
                        this.rightWeapon = weapon;
                        break;
                }
                return this;
            };

            Equipment.prototype.unequipWeapon = function (slot) {
                var removed = Rouge.Items.Weapon.None;
                switch (slot) {
                    case 0 /* Left */:
                        removed = this.leftWeapon;
                        this.leftWeapon = Rouge.Items.Weapon.None;
                        break;
                    case 1 /* Right */:
                        removed = this.leftWeapon;
                        this.rightWeapon = Rouge.Items.Weapon.None;
                        break;
                }
                return removed;
            };
            return Equipment;
        })();
        Entities.Equipment = Equipment;

        (function (WeaponSlots) {
            WeaponSlots[WeaponSlots["Left"] = 0] = "Left";
            WeaponSlots[WeaponSlots["Right"] = 1] = "Right";
            WeaponSlots[WeaponSlots["Ranged"] = 2] = "Ranged";
        })(Entities.WeaponSlots || (Entities.WeaponSlots = {}));
        var WeaponSlots = Entities.WeaponSlots;
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
                this.stats = new Entities.Statset(30, 10, 100, 30);
                this.inventory = new Array();
                this._hasTurn = true;
                this.equipment = new Entities.Equipment();
            }
            PlayerChar.prototype.hasAP = function () {
                return this.stats.ap > 0;
            };

            PlayerChar.prototype.hasTurn = function () {
                return this._hasTurn;
            };

            PlayerChar.prototype.newTurn = function () {
                this.stats.ap = this.stats.apMax;
                this._hasTurn = true;
            };

            PlayerChar.prototype.getAttack = function () {
                return new Entities.Attack(this, this.equipment.rightWeapon.damage, this.equipment.rightWeapon.multiplier, this.skills.prowess);
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
        var Statset = (function () {
            function Statset(maxHp, maxAP, maxEnd, eqWt) {
                this.hp = maxHp;
                this.hpMax = maxHp;
                this.ap = maxAP;
                this.apMax = maxAP;
                this.endurance = maxEnd;
                this.enduranceMax = maxEnd;
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

            Statset.prototype.setEndurance = function (val) {
                this.endurance = val;
                return this;
            };
            return Statset;
        })();
        Entities.Statset = Statset;
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
    (function (Items) {
        var ArmorPiece = (function () {
            function ArmorPiece() {
            }
            return ArmorPiece;
        })();
        Items.ArmorPiece = ArmorPiece;
    })(Rouge.Items || (Rouge.Items = {}));
    var Items = Rouge.Items;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Items) {
        var Consumable = (function () {
            function Consumable() {
            }
            return Consumable;
        })();
        Items.Consumable = Consumable;
    })(Rouge.Items || (Rouge.Items = {}));
    var Items = Rouge.Items;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Items) {
        (function (Weapons) {
            Weapons[Weapons["None"] = 0] = "None";
            Weapons[Weapons["Dagger"] = 1] = "Dagger";
            Weapons[Weapons["ShortSword"] = 2] = "ShortSword";
            Weapons[Weapons["Broadsword"] = 3] = "Broadsword";
            Weapons[Weapons["Mace"] = 4] = "Mace";
            Weapons[Weapons["HandAxe"] = 5] = "HandAxe";
            Weapons[Weapons["BattleAxe"] = 6] = "BattleAxe";
            Weapons[Weapons["Spear"] = 7] = "Spear";
            Weapons[Weapons["Pike"] = 8] = "Pike";
            Weapons[Weapons["Mattock"] = 9] = "Mattock";
            Weapons[Weapons["Maul"] = 10] = "Maul";
            Weapons[Weapons["Greataxe"] = 11] = "Greataxe";
            Weapons[Weapons["LongSword"] = 12] = "LongSword";
            Weapons[Weapons["Halberd"] = 13] = "Halberd";
            Weapons[Weapons["RoundShield"] = 14] = "RoundShield";
            Weapons[Weapons["TowerShield"] = 15] = "TowerShield";
        })(Items.Weapons || (Items.Weapons = {}));
        var Weapons = Items.Weapons;

        function getWeapon(type) {
            var weapon;
            switch (type) {
                case 1 /* Dagger */:
                    weapon = new Items.Weapon().setName("dagger").setDamage(4, 4).setRange(0, 2).setCost(2).setDurability(50).setBonuses(0, 1, 0, 0);
                    break;
                case 2 /* ShortSword */:
                    weapon = new Items.Weapon().setName("short sword").setDamage(4, 6).setRange(0, 2).setDurability(40).setCost(3);
                    break;
                case 3 /* Broadsword */:
                    weapon = new Items.Weapon().setName("broadsword").setDamage(3, 7).setRange(2, 3).setDurability(30).setCost(3);
                    break;
                case 4 /* Mace */:
                    weapon = new Items.Weapon().setName("mace").setDamage(1, 15).setRange(2, 3).setDurability(45).setCost(3);
                    break;
                case 5 /* HandAxe */:
                    weapon = new Items.Weapon().setName("hand axe").setDamage(3, 7).setRange(0, 2).setDurability(30).setCost(3);
                    break;
                case 6 /* BattleAxe */:
                    weapon = new Items.Weapon().setName("battle axe").setDamage(2, 8).setRange(2, 3).setDurability(30).setCost(3);
                    break;
                case 9 /* Mattock */:
                    weapon = new Items.Weapon().setName("mattock").setDamage(1, 14).setRange(2, 3).setCost(3).setDurability(30).setBonuses(-2, 0, 0, 0);
                    break;
                case 7 /* Spear */:
                    weapon = new Items.Weapon().setName("spear").setDamage(2, 7).setRange(3, 5).setDurability(45).setCost(3);
                    break;
                case 8 /* Pike */:
                    weapon = new Items.Weapon().setName("pike").setDamage(2, 10).setRange(4, 7).setCost(4).setDurability(30).setDurability(45).setTwohanded();
                    break;
                case 13 /* Halberd */:
                    weapon = new Items.Weapon().setName("halberd").setDamage(2, 11).setRange(3, 5).setCost(4).setDurability(30).setTwohanded();
                    break;
                case 10 /* Maul */:
                    weapon = new Items.Weapon().setName("maul").setDamage(1, 25).setRange(2, 3).setCost(5).setDurability(45).setTwohanded();
                    break;
                case 11 /* Greataxe */:
                    weapon = new Items.Weapon().setName("great axe").setDamage(2, 12).setRange(3, 4).setCost(4).setDurability(30).setTwohanded();
                    break;
                case 12 /* LongSword */:
                    weapon = new Items.Weapon().setName("long sword").setDamage(3, 9).setRange(2, 4).setCost(4).setDurability(30).setTwohanded();
                    break;
                case 14 /* RoundShield */:
                    weapon = new Items.Weapon().setName("round shield").setDamage(3, 5).setRange(2, 2).setCost(3).setDurability(60).setBonuses(0, 4, 1, 2);
                    break;
                case 15 /* TowerShield */:
                    weapon = new Items.Weapon().setName("tower shield").setDamage(3, 6).setRange(2, 2).setCost(4).setDurability(80).setBonuses(-2, 4, 2, 3);
                    break;
                default:
                    weapon = Items.Weapon.None;
                    break;
            }
            return weapon;
        }
        Items.getWeapon = getWeapon;
    })(Rouge.Items || (Rouge.Items = {}));
    var Items = Rouge.Items;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    (function (Items) {
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
            Object.defineProperty(Weapon.prototype, "durability", {
                get: function () {
                    return this._durability;
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

            Weapon.prototype.setDurability = function (amount) {
                this._durability = amount;
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

            Weapon.None = new Weapon().setName("none");
            return Weapon;
        })();
        Items.Weapon = Weapon;
    })(Rouge.Items || (Rouge.Items = {}));
    var Items = Rouge.Items;
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
                o();
            });
        };
        return Observable;
    })();
    Rouge.Observable = Observable;

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
    Rouge.ObservableProperty = ObservableProperty;
})(Rouge || (Rouge = {}));
var Rouge;
(function (Rouge) {
    var Const = (function () {
        function Const() {
        }
        Object.defineProperty(Const, "UPDATE_RATE", {
            get: function () {
                return 33;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Const, "MAP_HEIGHT", {
            get: function () {
                return 33;
            },
            enumerable: true,
            configurable: true
        });
        return Const;
    })();
    Rouge.Const = Const;
})(Rouge || (Rouge = {}));
//# sourceMappingURL=game.js.map
