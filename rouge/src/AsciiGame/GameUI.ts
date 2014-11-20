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
        private rightBar: UI.Box[];
        private bottomBar: UI.Box[];
        mouseLastOver: Common.ObservableProperty<UI.IElement>;

        constructor(screen: GameScreen) {
            this.alwaysInContext = new Array<UI.Box>();
            this.stack = new Array<Array<UI.Box>>();
            this.context = new Array<UI.Box>();
            this.mouseLastOver = new Common.ObservableProperty<UI.IElement>();

            this.alwaysInContext.push(new UI.Box(new UI.Rect(0, 0, 3, 2),
                new UI.Button(" ^", "v", () => {
                    if (screen.textBox.height != 2) {
                        screen.textBox.height = 2;
                    }
                    else {
                        screen.textBox.height = 8;
                    }
                })));
            this.alwaysInContext.push(new UI.Box(new UI.Rect(0, 0, 3, 2),
                new UI.Button(null, "LOG", () => {
                    if (screen.textBox.height == 8) {
                        screen.textBox.height = Settings.DisplayHeight - Settings.BottomBarHeight;
                    }
                    else {
                        screen.textBox.height = 8;
                    }
                })));
            this.initDpad(screen.manager.player);
            this.initLeftBar();
            this.initRightBar();
            this.initBottomBar(screen.manager.player);
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

        getTextBoxButton(box: UI.TextBox): DrawableMatrix{
            this.alwaysInContext[0].dimensions.x = Settings.DisplayWidth - Settings.SidebarWidth - 3;
            var matrix = new DrawableMatrix(this.alwaysInContext[0].dimensions.x, 0, 3, box.height);
            matrix.addOverlay(this.alwaysInContext[0].getMatrix());

            if (box.height > 6) {
                this.alwaysInContext[1].isVisible = true;
                this.alwaysInContext[1].dimensions.x = Settings.DisplayWidth - Settings.SidebarWidth - 3;
                this.alwaysInContext[1].dimensions.y = Math.min(box.height - 2, Settings.DisplayHeight - Settings.BottomBarHeight - 3);
                if (box.height < Settings.DisplayHeight / 2)
                    (<UI.Button>this.alwaysInContext[1].element).label = "LOG";
                else
                (<UI.Button>this.alwaysInContext[1].element).label = "RET";
                matrix.addOverlay(this.alwaysInContext[1].getMatrix());
            }
            else {
                this.alwaysInContext[1].isVisible = false;
            }

            return matrix;
        }

        private initLeftBar() {

        }

        getLeftBar(characters: Array<Entitites.PlayerChar>): DrawableMatrix {
            var p1 = characters[0];
            var p2 = characters[1];
            var w = Settings.SidebarWidth; //Limit for text wrapping
            var matrix = new DrawableMatrix(0, 0, w, 23);

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
            var w = Settings.SidebarWidth;
            this.rightBar = new Array<UI.Box>();
            var enemyButtons = new UI.Box(new UI.Rect(0, 2, 3, 9 * 3),
                new UI.VertList());
            for (var i = 0; i < 9; i++) {
                if (i % 2 == 0) {
                    (<UI.VertList<UI.Button>>enemyButtons.element).add(
                        new UI.Button("^" + (i + 1), "", () => { }));
                }
                else {
                    (<UI.VertList<UI.Button>>enemyButtons.element).add(
                        new UI.Button("^" + (i + 1), "", () => { }, this.color1));
                }
            }
            this.rightBar.push(enemyButtons);
            this.context.push(enemyButtons);

            var utilButtons = new UI.Box(new UI.Rect(0, Settings.DisplayHeight - 3, w, 2),
                new UI.HoriList(1, 2).add(
                    new UI.Button(null, "ITEMS", () => { })).add(
                    new UI.Button(null, "MENU", () => { })))
            this.rightBar.push(utilButtons);
            this.context.push(utilButtons);
        }

        getRightBar(scheduler: ROT.Scheduler.Action,
            current: Entitites.Entity,
            seen: Array<C.IEntity>,
            control: Common.Controllers.Player,
            baseTime?: number): DrawableMatrix {
            var w = Settings.SidebarWidth;
            var wDisp = Settings.DisplayWidth;
            var leftEdge = wDisp - w;
            var matrix = new DrawableMatrix(leftEdge, 0, w, Settings.DisplayHeight);
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

            this.rightBar[0].dimensions.x = leftEdge + w - 4;
            this.rightBar[1].dimensions.x = leftEdge;

            for (var i = 0; i < Settings.SidebarWidth; i++) {
                matrix.matrix[i][0] = { symbol: " ", bgColor: this.color1 }
            }
            matrix.addString(5, 0, "QUEUE");
            matrix.addString(0, 1, "--- current ---", null, "green");
            (<UI.VertList<UI.Button>>this.rightBar[0].element).setVisibleElements(both.length);

            function createClickAt(x: number, y: number): () => void {
                return () => { control.updateClick(x, y) };
            }
            for (var i = 0; i < both.length && i < 9; i++) {
                var drawable = getDrawableE(both[i].entity);
                var entity = both[i].entity;
                matrix.addString(1, i * 3 + 2, entity.name, Settings.SidebarWidth - 4);
                matrix.addString(1, i * 3 + 3, "HP:" + entity.stats.hp + "/" + entity.stats.hpMax, Settings.SidebarWidth - 4);
                var button = (<UI.VertList<UI.Button>>this.rightBar[0].element).getAtIndex(i);
                button.label = drawable.symbol;
                button.switchCallback(createClickAt(entity.x, entity.y));
            }
            matrix.addOverlay(this.rightBar[0].getMatrix());
            matrix.addOverlay(this.rightBar[1].getMatrix());

            return matrix;
        }

        private initDpad(control: Common.Controllers.Player) {
            var w = Settings.SidebarWidth;
            var hDisp = Settings.DisplayHeight;
            var hThis = 10;
            var box = new UI.Box(new UI.Rect(0, hDisp - hThis, w, hThis),
                new UI.VertList(1).add(
                    new UI.HoriList(1).add(
                        new UI.Button("q", "NW", () => { control.update("VK_Q"); }, this.color1)).add(
                        new UI.Button("w", "N", () => { control.update("VK_W"); })).add(
                        new UI.Button("e", "NE", () => { control.update("VK_E"); }, this.color1))
                    ).add(
                    new UI.HoriList(1).add(
                        new UI.Button("a", "W ", () => { control.update("VK_A"); })).add(
                        new UI.Button("f", "PICK", () => { control.update("VK_F"); }, this.color1)).add(
                        new UI.Button("d", "E", () => { control.update("VK_D"); }))
                    ).add(
                    new UI.HoriList(1).add(
                        new UI.Button("z", "SW", () => { control.update("VK_Z"); }, this.color1)).add(
                        new UI.Button("x", "S ", () => { control.update("VK_X"); })).add(
                        new UI.Button("c", "SE", () => { control.update("VK_C"); }, this.color1))
                    )
                );
            this.dpad = box;
            this.alwaysInContext.push(this.dpad);
        }

        getDPad(): DrawableMatrix {
            return this.dpad.getMatrix();
            /*

            matrix.addString(1, 1, "    |    |    ");
            matrix.addString(1, 2, "    |    |    ");
            matrix.addString(1, 3, "----+----+----");
            matrix.addString(1, 4, "    |    |    ");
            matrix.addString(1, 5, "    |    |    ");
            matrix.addString(1, 6, "----+----+----");
            matrix.addString(1, 7, "    |    |    ");
            matrix.addString(1, 8, "    |    |    ");
            */
        }

        initBottomBar(control: Common.Controllers.Player) {
            this.bottomBar = new Array<UI.Box>();
            
            var box = new UI.Box(
                new UI.Rect(
                    Settings.SidebarWidth,
                    Settings.DisplayHeight - Settings.BottomBarHeight,
                    30,
                    Settings.BottomBarHeight),
                new UI.HoriList<UI.Button>(0, 2, this.color1).add(
                    new UI.Button("1", "MOVE", () => { control.switchState(Common.Controllers.States.Move); })).add(
                    new UI.Button("2", "ATTACK", () => { control.switchState(Common.Controllers.States.Attack); })).add(
                    new UI.Button("3", "SKILL", () => { }))
                );
            this.bottomBar.push(box);

            box = new UI.Box(
                new UI.Rect(
                    Settings.SidebarWidth,
                    Settings.DisplayHeight - Settings.BottomBarHeight,
                    18,
                    Settings.BottomBarHeight),
                new UI.HoriList(0, 2, this.color1).add(
                    new UI.Button(null, "END TURN", () => { control.update("VK_SPACE") })).add(
                    new UI.Button(null, "QUICKBAR", () => { }))                 
                );
            this.bottomBar.push(box);
            this.context.push(this.bottomBar[0]);
            this.context.push(this.bottomBar[1]);
        }

        setBottomBarFocus(index: number) {
            (<UI.HoriList<UI.Button>>this.bottomBar[0].element).setFocus(index);
        }

        getBottomBar(control: Common.Controllers.Player): DrawableMatrix {
            switch (control.getState()) {
                case Common.Controllers.States.Move:
                    this.setBottomBarFocus(0);
                    break;
                case Common.Controllers.States.Attack:
                    this.setBottomBarFocus(1);
                    break;
                default:
                    this.setBottomBarFocus(null);
                    break;
            }

            this.bottomBar[1].dimensions.x = Settings.DisplayWidth - this.bottomBar[1].dimensions.w - Settings.SidebarWidth;
            return new DrawableMatrix(
                Settings.SidebarWidth,
                Settings.DisplayHeight - Settings.BottomBarHeight,
                Settings.DisplayWidth - 2 * Settings.SidebarWidth,
                Settings.BottomBarHeight,
                this.color1).
                addOverlay(this.bottomBar[0].getMatrix()).
                addOverlay(this.bottomBar[1].getMatrix());
        }
    }
}