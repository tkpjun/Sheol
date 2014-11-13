/// <reference path="../Common/Common.ts" />
module AsciiGame {
    import Dungeon = Common.Dungeon;
    import Entities = Common.Entities;
    import Controllers = Common.Controllers;
    import C = Common;

    export class GameScreen {

        dungeon: Dungeon.Level[];
        currLevel: number;
        manager: Controllers.EntityManager;
        camera: Camera;
        //nextToDraw: C.ObservableProperty<DrawMatrix>;
        ui: GameUI;
        textBox: UI.TextBox;
        update: () => void
        draw: (DrawMatrix) => void;

        constructor(drawCallback: (DrawMatrix) => void) {
            this.dungeon = new Array<Dungeon.Level>(new Dungeon.Level(Dungeon.MapTypes.Mines));
            this.currLevel = 0;
            this.textBox = new UI.TextBox(Settings.SidebarWidth, 0, 2, () => this.advanceFrame());
            this.manager = new Controllers.EntityManager(this.dungeon[this.currLevel]);
            this.manager.init(new Controllers.Player(this.textBox, this.manager));
            //this.nextToDraw = new C.ObservableProperty<DrawMatrix>();
            this.camera = new Camera(Settings.SidebarWidth,
                Settings.DisplayWidth - Settings.SidebarWidth * 2,
                0,
                Settings.DisplayHeight - Settings.BottomBarHeight);
            this.ui = new GameUI(this);

            this.draw = drawCallback;
            this.update = () => {
                var middle = this.manager.characters.map((c) => { 
                    return c.x
                }).reduce((x1, x2) => {
                    return x1 + x2
                }) / this.manager.characters.length;
                this.camera.centerOn(middle);
                this.advanceFrame();
            }
            this.ui.mouseLastOver.attach(() => this.advanceFrame());
            this.manager.currEntity.attach(this.update);
            this.manager.currPath.attach(() => this.advanceFrame());
            this.manager.start();
            this.update();
        }

        advanceFrame() {
            this.manager.engine.lock();
            this.camera.updateView(this.manager.level);
            this.draw(this.camera.view.addPath(
                this.manager.currPath.unwrap,
                this.camera.x,
                this.camera.y,
                this.manager.currEntity.unwrap.stats.ap)
                .addOverlay(this.textBox.getMatrix(this.camera.width), 0.75)
                .addOverlay(this.ui.getTextBoxButton(this.textBox)));
            this.draw(this.ui.getLeftBar(this.manager.characters));
            this.draw(this.ui.getDPad());
            this.draw(this.ui.getRightBar(
                this.manager.level.scheduler,
                this.manager.currEntity.unwrap,
                this.manager.level.entities.filter((e) => {
                    return this.camera.sees(e.x, e.y);
                }),
                this.manager.player));
            this.draw(this.ui.getBottomBar(this.manager.player));     

            this.manager.engine.unlock();
        }

        acceptMousedown(tileX: number, tileY: number) {
            var hitUiContext = this.ui.updateMouseDown(tileX, tileY);
            if (!hitUiContext &&
                tileX >= Settings.CamXOffset && tileX < Settings.CamXOffset + Settings.CamWidth &&
                tileY >= Settings.CamYOffset && tileY < Settings.CamYOffset + Settings.CamHeight) {
                this.manager.player.updateClick(tileX - this.camera.xOffset + this.camera.x,
                    tileY - this.camera.yOffset + this.camera.y);
            }
        }

        acceptMouseup(tileX: number, tileY: number) {
            this.ui.updateMouseUp(tileX, tileY);
        }

        acceptMousedrag(tileX: number, tileY: number) {
            if (tileX >= Settings.CamXOffset && tileX < Settings.CamXOffset + Settings.CamWidth &&
                tileY >= Settings.CamYOffset && tileY < Settings.CamYOffset + Settings.CamHeight) {
                this.manager.player.updateMousedrag(tileX - this.camera.xOffset + this.camera.x,
                    tileY - this.camera.yOffset + this.camera.y);
            }
        }

        acceptMousemove(tileX: number, tileY: number) {
            var hitUiContext = this.ui.updateMousemove(tileX, tileY);
            if (!hitUiContext &&
                tileX >= Settings.CamXOffset && tileX < Settings.CamXOffset + Settings.CamWidth &&
                tileY >= Settings.CamYOffset && tileY < Settings.CamYOffset + Settings.CamHeight) {
                this.manager.player.updateMousemove(tileX - this.camera.xOffset + this.camera.x,
                    tileY - this.camera.yOffset + this.camera.y);
            }
        }

        acceptKeydown(keyCode: string) {
            this.manager.player.update(keyCode);
        }
    }
}