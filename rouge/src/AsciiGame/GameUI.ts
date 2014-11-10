/// <reference path="../Common/Common.ts" />
/// <reference path="../Common/Controllers/Controllers.ts" />
/// <reference path="../Common/Entities/Entities.ts" />
module AsciiGame {
    import Entitites = Common.Entities;
    import Controllers = Common.Controllers;
    import C = Common;

    export class GameUI {

        private color1 = "midnightblue";
        private color2 = "royalblue";
        private stack: UI.Box[][];
        private context: UI.Box[];
        private alwaysInContext: UI.Box[];
        private dpad: UI.Box;
        private leftBar: UI.Box;
        private rightBar: UI.Box;
        private bottomBar: UI.Box[];
        mouseLastOver: Common.ObservableProperty<UI.IElement>;

        constructor() {
            this.alwaysInContext = new Array<UI.Box>();
            this.stack = new Array<Array<UI.Box>>();
            this.context = new Array<UI.Box>();
            this.mouseLastOver = new Common.ObservableProperty<UI.IElement>();

            this.initDpad();
            this.initLeftBar();
            this.initRightBar();
            this.initBottomBar();
        }

        updateMouseDown(x, y): boolean {
            var t = this.findTarget(x, y);
            if (t) {
                t.mouseDown();
                this.mouseLastOver.unwrap = t;
                return true;
            }
            else
                return false;
        }

        updateMouseUp(x, y): boolean {
            var t = this.findTarget(x, y);
            console.log(this.mouseLastOver.unwrap)
            if (this.mouseLastOver.unwrap) {
                this.mouseLastOver.unwrap.mouseUp();
                if (!t) {
                    this.mouseLastOver.unwrap = null;
                }
            }
            if (t) {
                t.mouseOver();
                this.mouseLastOver.unwrap = t;
                return true;
            }
            else
                return false;
        }

        updateMousemove(x, y): boolean {
            var t = this.findTarget(x, y);
            if (t) {
                if (this.mouseLastOver.unwrap !== t) {
                    t.mouseOver();
                    if (this.mouseLastOver.unwrap)
                        this.mouseLastOver.unwrap.mouseNotOver();
                    this.mouseLastOver.unwrap = t;
                    return true;
                }
            }
            else if (this.mouseLastOver.unwrap) {
                this.mouseLastOver.unwrap.mouseNotOver();
                this.mouseLastOver.unwrap = null;
                return false;
            }
            else {
                return false;
            }
        }

        private findTarget(x, y): UI.IElement {
            var target;

            for (var i = 0; i < this.context.length; i++) {
                target = this.context[i].whatIsAt(x, y);
                if (target) {
                    break;
                }
            }
            if (!target) {
                for (i = 0; i < this.alwaysInContext.length; i++) {
                    target = this.alwaysInContext[i].whatIsAt(x, y);
                    if (target) {
                        break;
                    }
                }
            }

            return target;
        }

        private initLeftBar() {

        }

        getLeftBar(characters: Array<Entitites.PlayerChar>): DrawMatrix {
            var p1 = characters[0];
            var p2 = characters[1];
            var w = Settings.SidebarWidth; //Limit for text wrapping
            var matrix = new DrawMatrix(0, 0, w, 23);

            for (var i = 0; i < Settings.SidebarWidth; i++) {
                matrix.matrix[i][0] = { symbol: " ", bgColor: this.color1 }
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

        initRightBar() {

        }

        getRightBar(scheduler: ROT.Scheduler.Action,
            current: Entitites.Entity,
            seen: Array<C.IEntity>,
            baseTime?: number): DrawMatrix {
            var w = Settings.SidebarWidth;
            var wDisp = Settings.DisplayWidth;
            var leftEdge = wDisp - w;
            var matrix = new DrawMatrix(leftEdge, 0, w, Settings.DisplayHeight - 1);
            if (!baseTime) baseTime = 0;

            var events = scheduler._queue._events;
            var times = scheduler._queue._eventTimes;
            var both = [];
            for (var i = 0; i < events.length; i++) {
                both.push({ event: events[i], time: times[i] });
            }
            both = both.filter(obj => {
                return obj.event instanceof Controllers.ChangeProperty &&
                    seen.indexOf((<Controllers.ChangeProperty<Entitites.Entity>>obj.event).target) >= 0;
            }).map(obj => {
                    return { entity: (<Controllers.ChangeProperty<Entitites.Entity>>obj.event).target, time: obj.time };
                }).sort((obj1, obj2) => {
                    return obj1.time - obj2.time;
                });
            both.unshift({ entity: current, time: baseTime });

            for (var i = 0; i < Settings.SidebarWidth; i++) {
                matrix.matrix[i][0] = { symbol: " ", bgColor: this.color1 }
        }
            matrix.addString(5, 0, "QUEUE");
            matrix.addString(0, 1, "--- current ---", null, "green");
            for (var i = 0; i < both.length && i < 9; i++) {
                var drawable = getDrawable(both[i].entity);
                matrix.addString(1, i * 3 + 2, both[i].entity.name, Settings.SidebarWidth - 4);
                matrix.addString(1, i * 3 + 3, "HP:" + both[i].entity.stats.hp + "/" + both[i].entity.stats.hpMax, Settings.SidebarWidth - 4);
                //matrix.addString(Constants.SidebarWidth - 4, i * 3 + 2, "---");
                //matrix.addString(Constants.SidebarWidth - 4, i * 3 + 3, "| |");
                if (i % 2 == 0) {
                    matrix.addString(Settings.SidebarWidth - 4, i * 3 + 2, "^" + (i + 1) + " ", null, null, this.color2);
                    matrix.addString(Settings.SidebarWidth - 4, i * 3 + 3, " " + drawable.symbol + " ", null, drawable.color, this.color2);
                }
                else {
                    matrix.addString(Settings.SidebarWidth - 4, i * 3 + 2, "^" + (i + 1) + " ", null, null, this.color1);
                    matrix.addString(Settings.SidebarWidth - 4, i * 3 + 3, " " + drawable.symbol + " ", null, drawable.color, this.color1);
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
            matrix.addString(Settings.SidebarWidth - 7, 29, "space:");
            matrix.addString(Settings.SidebarWidth - 7, 30, " END  ", null, null, this.color2);
            matrix.addString(Settings.SidebarWidth - 7, 31, " TURN ", null, null, this.color2);

            return matrix;
        }

        private initDpad() {
            var w = Settings.SidebarWidth;
            var hDisp = Settings.DisplayHeight;
            var hThis = 10;
            var box = new UI.Box(new UI.Rect(0, hDisp - hThis - Settings.BottomBarHeight, w, hThis),
                new UI.VertList(1).add(
                    new UI.HoriList(1).add(
                        new UI.Button("q", "NW", () => { }, this.color1)).add(
                        new UI.Button("w", "N", () => { })).add(
                        new UI.Button("e", "NE", () => { }, this.color1))
                    ).add(
                    new UI.HoriList(1).add(
                        new UI.Button("a", "W ", () => { })).add(
                        new UI.Button("f", "PICK", () => { }, this.color1)).add(
                        new UI.Button("d", "E", () => { }))
                    ).add(
                    new UI.HoriList(1).add(
                        new UI.Button("z", "SW", () => { }, this.color1)).add(
                        new UI.Button("x", "S ", () => { })).add(
                        new UI.Button("c", "SE", () => { }, this.color1))
                    )
                );
            this.dpad = box;
            this.alwaysInContext.push(this.dpad);
        }

        getDPad(): DrawMatrix {
            return this.dpad.getMatrix();
            /*
            var w = Settings.SidebarWidth;
            var hDisp = Settings.DisplayHeight;
            var hThis = 10;
            var matrix = new DrawMatrix(0, hDisp - hThis - Settings.BottomBarHeight, null, w, hThis);

            matrix.addString(1, 1, "    |    |    ");
            matrix.addString(1, 2, "    |    |    ");
            matrix.addString(1, 3, "----+----+----");
            matrix.addString(1, 4, "    |    |    ");
            matrix.addString(1, 5, "    |    |    ");
            matrix.addString(1, 6, "----+----+----");
            matrix.addString(1, 7, "    |    |    ");
            matrix.addString(1, 8, "    |    |    ");
            matrix.addString(1, 1, "q   ", null, null, this.color1);
            matrix.addString(1, 2, " NW ", null, null, this.color1);
            matrix.addString(6, 1, "w   ", null, null, this.color2);
            matrix.addString(6, 2, "  N ", null, null, this.color2);
            matrix.addString(11, 1, "e   ", null, null, this.color1);
            matrix.addString(11, 2, " NE ", null, null, this.color1);
            matrix.addString(1, 4, "a   ", null, null, this.color2);
            matrix.addString(1, 5, " W  ", null, null, this.color2);
            matrix.addString(6, 4, "f   ", null, null, this.color1);
            matrix.addString(6, 5, "PICK", null, null, this.color1);
            matrix.addString(11, 4, "d   ", null, null, this.color2);
            matrix.addString(11, 5, "  E ", null, null, this.color2);
            matrix.addString(1, 7, "z   ", null, null, this.color1);
            matrix.addString(1, 8, " SW ", null, null, this.color1);
            matrix.addString(6, 7, "x   ", null, null, this.color2);
            matrix.addString(6, 8, " S  ", null, null, this.color2);
            matrix.addString(11, 7, "c   ", null, null, this.color1);
            matrix.addString(11, 8, " SE ", null, null, this.color1);

            return matrix;
            */
        }

        initBottomBar() {
            this.bottomBar = new Array<UI.Box>();
            var box = new UI.Box(
                new UI.Rect(
                    0,
                    Settings.DisplayHeight - Settings.BottomBarHeight,
                    45,
                    Settings.BottomBarHeight),
                new UI.HoriList(1, 1, this.color1).add(
                    new UI.Button("1", "MOVE", () => { })).add(
                    new UI.Button("2", "ATTACK", () => { })).add(
                    new UI.Button("3", "SPECIAL", () => { })).add(
                    new UI.Button("4", "SWITCH", () => { }))
                );
            this.bottomBar.push(box);

            box = new UI.Box(
                new UI.Rect(
                    50,
                    Settings.DisplayHeight - Settings.BottomBarHeight,
                    25,
                    Settings.BottomBarHeight),
                new UI.HoriList(1, 1, this.color1).add(
                    new UI.Button(null, "INVENTORY", () => { })).add(
                    new UI.Button(null, "MENU", () => { }))
                );
            this.bottomBar.push(box);
            this.context.push(this.bottomBar[0]);
            this.context.push(this.bottomBar[1]);
        }

        getBottomBar(): DrawMatrix {
            this.bottomBar[1].dimensions.x = Settings.DisplayWidth - this.bottomBar[1].dimensions.w;
            return new DrawMatrix(
                0,
                Settings.DisplayHeight - Settings.BottomBarHeight,
                Settings.DisplayWidth,
                Settings.BottomBarHeight,
                this.color1).
                addOverlay(this.bottomBar[0].getMatrix()).
                addOverlay(this.bottomBar[1].getMatrix());
            /*
            var matrix = new DrawMatrix(0,
                Settings.DisplayHeight - Settings.BottomBarHeight,
                null,
                Settings.DisplayWidth,
                Settings.BottomBarHeight);

            for (var i = 0; i < matrix.matrix.length; i++) {
                for (var j = 0; j < matrix.matrix[0].length; j++) {
                    matrix.matrix[i][j] = { symbol: " ", bgColor: this.color1 };
                }
            }
            matrix.addString(1, 0, "1");
            matrix.addString(2, 0, "  MOVE  ", null, null, this.color2);
            matrix.addString(11, 0, "2");
            matrix.addString(12, 0, " ATTACK ", null, null, this.color2);
            matrix.addString(21, 0, "3");
            matrix.addString(22, 0, " SPECIAL ", null, null, this.color2);
            matrix.addString(32, 0, "4");
            matrix.addString(33, 0, " SWITCH ", null, null, this.color2);

            matrix.addString(Settings.DisplayWidth - 32, 0, "CON");
            matrix.addString(Settings.DisplayWidth - 29, 0, " v ", null, null, this.color2);
            matrix.addString(Settings.DisplayWidth - 25, 0, " ^ ", null, null, this.color2);
            matrix.addString(Settings.DisplayWidth - 20, 0, "INVENTORY", null, null, this.color2);
            matrix.addString(Settings.DisplayWidth - 9, 0, "  MENU  ", null, null, this.color2);

            return matrix;
*/
        }
    }
}