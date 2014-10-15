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

            var update = () => {
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
            this.manager.currEntity.attach(update);
            this.manager.changed.attach(update);
            this.manager.currPath.attach(() => this.draw());
            this.camera = new Camera(Constants.SIDEBAR_WIDTH,
                Constants.displayWidth - Constants.SIDEBAR_WIDTH * 2,
                0,
                Constants.DISPLAY_HEIGHT - Constants.BOTTOM_BAR_HEIGHT,
                this.display);
            update();
        }

        draw() {
            this.manager.engine.lock();

            this.display.clear();
            this.camera.updateView(this.manager.level, this.manager.characters);
            this.camera.view.
                addPath(this.manager.currPath.property, this.camera.x, this.camera.y, this.manager.currEntity.property.stats.ap).
                addOverlay(this.debugBox()).
                draw(this.display);
            GameUI.getLeftBar(this.manager.characters).draw(this.display);
            GameUI.getDPad().draw(this.display);
            GameUI.getRightBar(this.manager.level.scheduler,
                this.manager.currEntity.property,
                (<Array<IEntity>>this.manager.characters).concat(this.manager.level.entities)
                ).draw(this.display);
            GameUI.getBottomBar().draw(this.display);

            this.manager.engine.unlock();
        }

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

        private debugBox(): DrawMatrix {
            var box = new TextBox(Constants.SIDEBAR_WIDTH, 0, 6);
            box.addLine("Lorem ipsum dolor sit amet,");
            box.addLine("consectetur adipiscing elit,");
            box.addLine("sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.");
            box.addLine("Ut enim ad minim veniam,");
            box.addLine("quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.");
            box.addLine("Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.");
            box.addLine("Excepteur sint occaecat cupidatat non proident,");
            box.addLine("sunt in culpa qui officia deserunt mollit anim id est laborum.");
            var it = box.getMatrix(Constants.displayWidth - 2 * Constants.SIDEBAR_WIDTH);
            return it;
        }
    }
}