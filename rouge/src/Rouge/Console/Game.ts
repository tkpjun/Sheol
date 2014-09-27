module Rouge.Console {

    export class Game {
        display: ROT.Display;
        dungeon: Dungeon.Level[];
        currLevel: number;
        manager: Control.EntityManager;
        

        constructor() {
            this.display = new ROT.Display({ fontSize: 23 });
            this.dungeon = new Array<Dungeon.Level>(new Dungeon.Level(Dungeon.MapType.MINES));
            this.currLevel = 0;
            this.manager = new Control.EntityManager(this.dungeon[this.currLevel]);
            this.manager.changed.attach({ update: () => { this.drawMap(); this.drawEntities(); } });
            this.drawMap();
            this.drawEntities();
        }

        drawMap() {
            var map = this.manager.level.map;
            for (var key in map) {
                var parts = key.split(",");
                var x = parseInt(parts[0]);
                var y = parseInt(parts[1]);
                this.display.draw(x, y, map[key]);
            }
        }

        drawEntities() {
            this.manager.level.entities.forEach((e) => {
                this.display.draw(e.x, e.y, "@");
            })
            this.manager.characters.forEach((p) => {
                this.display.draw(p.x, p.y, "@");
            })
        }

        /*
        generateMap() {
            var freeCells = [];

            var digCallback = (x, y, value) => {

                var key = x + "," + y;

                if (value)
                    this.map[key] = "#";
                else {
                    freeCells.push(key);
                    this.map[key] = " ";
                }
            }

            this.map.create(digCallback.bind(this));
            //this.map.create(this.display.DEBUG);
            this.generateBoxes(freeCells);
            this.drawMap();
            //this.display.draw(5, 4, "@", "#0f0");
        }
        */
        /*
        generateBoxes(freeCells) {
            for (var i = 0; i < 10; i++) {
                var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
                var key = freeCells.splice(index, 1)[0];
                this.map[key] = "*";
            }
        }
*/
    }
}