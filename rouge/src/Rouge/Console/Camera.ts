module Rouge.Console {

    export class Camera {

        x: number;
        y: number;
        xOffset: number;
        yOffset: number;
        width: number;
        height: number;
        display: ROT.Display;

        constructor(xOffset: number, width: number, yOffset: number, height: number, display: ROT.Display) {
            this.width = width;
            this.height = height;
            this.xOffset = xOffset;
            this.yOffset = yOffset;
            this.x = 0;
            this.y = 0;
            this.display = display;
        }

        centerOn(x: number);
        centerOn(x: number, y?: number) {
            this.x = Math.floor(x - this.width / 2);
            if(y)
                this.y = Math.floor(y - this.height/2);
        }

        translate(x: number, y: number) {
            this.x += x;
            this.y += y;
        }

        draw(level: Dungeon.Level, players: Array<Entities.PlayerChar>) {
            this.drawMap(level.map);
            this.drawEntities(level.entities, players);
        }

        private drawMap(map: ROT.IMap) {
            for (var key in map) {
                var parts = key.split(",");
                var x = parseInt(parts[0]);
                var y = parseInt(parts[1]);
                if (x < this.x || y < this.y || x > this.x + this.width - 1 || y > this.y + this.height - 1) {
                    continue;
                }

                switch (map[key]) {
                    case " ":
                        this.display.draw(x - this.x + this.xOffset, y - this.y + this.yOffset, map[key], "white", "gray");
                        break;
                    default:
                        this.display.draw(x - this.x + this.xOffset, y - this.y + this.yOffset, map[key]);
                        break;
                }
            }
        }

        private drawEntities(entities: Array<IEntity>, characters: Array<Entities.PlayerChar>) {
            entities.forEach((e) => {
                this.display.draw(e.x - this.x + this.xOffset, e.y - this.y + this.yOffset, "e");
            })
            characters.forEach((p) => {
                this.display.draw(p.x - this.x + this.xOffset, p.y - this.y + this.yOffset, "@");
            })
        }

    }
}