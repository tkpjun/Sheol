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
            this.manager.lastAttack.attach(() => {
                var res = this.manager.lastAttack.unwrap;
                this.console.addLine(res.attacker.name + " hit " + res.defender.name + " for " +
                    res.finalDmg + "! Hit: " + (res.hitRoll - res.attacker.skills.prowess.value) +
                    "+" + res.attacker.skills.prowess.value + " vs " + (res.evadeRoll - res.defender.skills.evasion.value) +
                    "+" + res.defender.skills.evasion.value + ". Armor: " + res.armorRolls.toString() + ".");
            });
            update();
        }

        advanceFrame() {
            this.manager.engine.lock();

            this.camera.updateView(this.manager.level, this.manager.characters);
            var matrix = new DrawMatrix(0, 0, null, Const.DisplayWidth, Const.DisplayHeight).
                addOverlay(this.camera.view.
                    addPath(this.manager.currPath.unwrap, this.camera.x, this.camera.y, this.manager.currEntity.unwrap.stats.ap)).
                addOverlay(this.console.getMatrix(this.camera.width)).
                addOverlay(GameUI.getLeftBar(this.manager.characters)).
                addOverlay(GameUI.getDPad()).addOverlay(GameUI.getRightBar(this.manager.level.scheduler,
                    this.manager.currEntity.unwrap,
                    (<Array<IEntity>>this.manager.characters).concat(this.manager.level.entities)
                    )).
                addOverlay(GameUI.getBottomBar())
            this.nextFrame.unwrap = matrix;        

            this.manager.engine.unlock();
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