module Rouge.Console {

    export class GameScreen {

        dungeon: Dungeon.Level[];
        currLevel: number;
        manager: Controllers.EntityManager;
        camera: Camera;
        nextFrame: ObservableProperty<DrawMatrix>;
        console: TextBox;

        constructor() {
            this.dungeon = new Array<Dungeon.Level>(new Dungeon.Level(Dungeon.MapTypes.Mines));
            this.currLevel = 0;
            this.manager = new Controllers.EntityManager(this.dungeon[this.currLevel]);
            this.nextFrame = new ObservableProperty<DrawMatrix>();
            this.camera = new Camera(Const.SidebarWidth,
                Const.DisplayWidth - Const.SidebarWidth * 2,
                0,
                Const.DisplayHeight - Const.BottomBarHeight);
            this.console = new TextBox(Const.SidebarWidth, 0, 7);
            Controllers.Player.initialize(this.console, this.manager);

            var update = () => {
                var middle = this.manager.characters.map((c) => { 
                    return c.x
                }).reduce((x1, x2) => {
                    return x1 + x2
                }) / this.manager.characters.length;
                this.camera.centerOn(middle);
                this.advanceFrame();
            }
            this.manager.currEntity.attach(update);
            this.manager.changed.attach(update);
            this.manager.currPath.attach(() => this.advanceFrame());
            this.manager.start();
            update();
        }

        advanceFrame() {
            this.manager.engine.lock();

            this.camera.updateView(this.manager.level);
            var matrix = new DrawMatrix(0, 0, null, Const.DisplayWidth, Const.DisplayHeight)
                .addOverlay(this.camera.view.addPath(this.manager.currPath.unwrap, this.camera.x, this.camera.y, this.manager.currEntity.unwrap.stats.ap))
                .addOverlay(this.console.getMatrix(this.camera.width))
                .addOverlay(GameUI.getLeftBar(this.manager.characters))
                .addOverlay(GameUI.getDPad())
                .addOverlay(GameUI.getRightBar(
                    this.manager.level.scheduler,
                    this.manager.currEntity.unwrap,
                    this.manager.level.entities.filter((e) => {
                            return this.camera.sees(e.x, e.y);
                        }))
                    )
                .addOverlay(GameUI.getBottomBar())
            this.nextFrame.unwrap = matrix;        

            this.manager.engine.unlock();
        }

        acceptMousedown(tileX: number, tileY: number) {
            Controllers.Player.updateClick(tileX - this.camera.xOffset + this.camera.x,
                tileY - this.camera.yOffset + this.camera.y);
        }

        acceptMousedrag(tileX: number, tileY: number) {
            Controllers.Player.updateMousedrag(tileX - this.camera.xOffset + this.camera.x,
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