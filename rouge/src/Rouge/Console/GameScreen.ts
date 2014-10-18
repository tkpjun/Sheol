module Rouge.Console {

    export class GameScreen {

        dungeon: Dungeon.Level[];
        currLevel: number;
        manager: Controllers.EntityManager;
        camera: Camera;
        nextFrame: ObservableProperty<DrawMatrix>;

        constructor() {
            this.dungeon = new Array<Dungeon.Level>(new Dungeon.Level(Dungeon.MapTypes.Mines));
            this.currLevel = 0;
            this.manager = new Controllers.EntityManager(this.dungeon[this.currLevel]);
            this.nextFrame = new ObservableProperty<DrawMatrix>();

            var update = () => {
                function distance(x1, y1, x2, y2) {
                    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                }
                var e = this.manager.currEntity.unwrap;
                var short = this.manager.characters[0];
                this.manager.characters.forEach((c) => {
                    if (distance(c.x, c.y, e.x, e.y) < distance(short.x, short.y, e.x, e.y)) {
                        short = c;
                    }
                });
                this.camera.centerOn(short.x);
                this.advanceFrame();
            }
            this.manager.currEntity.attach(update);
            this.manager.changed.attach(update);
            this.manager.currPath.attach(() => this.advanceFrame());
            this.camera = new Camera(Const.SidebarWidth,
                Const.DisplayWidth - Const.SidebarWidth * 2,
                0,
                Const.DisplayHeight - Const.BottomBarHeight);
            update();
        }

        advanceFrame() {
            this.manager.engine.lock();

            this.camera.updateView(this.manager.level, this.manager.characters);
            var matrix = new DrawMatrix(0, 0, null, Const.DisplayWidth, Const.DisplayHeight).
                addOverlay(this.camera.view.
                    addPath(this.manager.currPath.unwrap, this.camera.x, this.camera.y, this.manager.currEntity.unwrap.stats.ap)).
                addOverlay(this.debugBox()).
                addOverlay(GameUI.getLeftBar(this.manager.characters)).
                addOverlay(GameUI.getDPad()).addOverlay(GameUI.getRightBar(this.manager.level.scheduler,
                    this.manager.currEntity.unwrap,
                    (<Array<IEntity>>this.manager.characters).concat(this.manager.level.entities)
                    )).
                addOverlay(GameUI.getBottomBar())
            this.nextFrame.unwrap = matrix;        

            this.manager.engine.unlock();
        }

        private debugBox(): DrawMatrix {
            var box = new TextBox(Const.SidebarWidth, 0, 6);
            box.addLine("Lorem ipsum dolor sit amet,");
            box.addLine("consectetur adipiscing elit,");
            box.addLine("sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
            box.addLine("Ut enim ad minim veniam,");
            box.addLine("quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
            box.addLine("Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.");
            box.addLine("Excepteur sint occaecat cupidatat non proident,");
            box.addLine("sunt in culpa qui officia deserunt mollit anim id est laborum.");
            var it = box.getMatrix(Const.DisplayWidth - 2 * Const.SidebarWidth);
            return it;
        }

        acceptMousedown(tileX: number, tileY: number) {
            Controllers.Player.updateClick(tileX - this.camera.xOffset + this.camera.x,
                tileY - this.camera.yOffset + this.camera.y);
        }

        acceptMousemove(tileX: number, tileY: number) {
            Controllers.Player.updateMousemove(tileX - this.camera.xOffset + this.camera.x,
                tileY - this.camera.yOffset + this.camera.y);
        }

        acceptKeydown(keyCode: string) {
            Controllers.Player.update(keyCode);
        }
    }
}