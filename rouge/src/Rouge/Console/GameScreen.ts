module Rouge.Console {

    export class GameScreen {

        display: ROT.Display;
        dungeon: Dungeon.Level[];
        currLevel: number;
        manager: Controllers.EntityManager;
        camera: Camera;

        constructor(display: ROT.Display) {
            this.display = display;
            this.dungeon = new Array<Dungeon.Level>(new Dungeon.Level(Dungeon.MapType.MINES));
            this.currLevel = 0;
            this.manager = new Controllers.EntityManager(this.dungeon[this.currLevel]);
            this.manager.changed.attach({ update: () => { this.draw(); } });
            this.manager.currEntity.attach({
                update: () => {
                    function distance(x1, y1, x2, y2) {
                        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                    }
                    var e = this.manager.currEntity.property;
                    var short = this.manager.characters[0];
                    this.manager.characters.forEach((c) => {
                        if (distance(c.x, c.y, e.x, e.y) < distance(short.x, short.y, e.x, e.y)) {
                            short = c;
                        }
                    });
                    this.camera.centerOn(short.x);
                    this.draw();
                }
            });
            this.camera = new Camera(Constants.LEFT_UI_WIDTH,
                this.display.getOptions().width - Constants.LEFT_UI_WIDTH * 2,
                0,
                this.display.getOptions().height - 1,
                this.display);
            this.draw();
        }

        draw() {
            this.display.clear();
            this.camera.getView(this.manager.level, this.manager.characters).draw(this.display);
            this.drawUI();
        }

        private drawUI() {
            var p1 = this.manager.characters[0];
            var p2 = this.manager.characters[1];
            var w = Constants.LEFT_UI_WIDTH;

            this.display.drawText(1, 1, p1.name, w);
            this.display.drawText(1, 3, "HP: " + p1.stats.hp + "/" + p1.stats.hpMax, w);
            this.display.drawText(1, 4, "AP: " + p1.stats.ap + "/" + p1.stats.apMax, w);

            this.display.drawText(1, 8, p2.name, w);
            this.display.drawText(1, 10, "HP: " + p2.stats.hp + "/" + p2.stats.hpMax, w);
            this.display.drawText(1, 11, "AP: " + p2.stats.ap + "/" + p2.stats.apMax, w);
        }
    }
}