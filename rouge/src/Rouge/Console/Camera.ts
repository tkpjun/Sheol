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
            this.x = Math.floor(x - this.width / 2) - 1;
            if(y)
                this.y = Math.floor(y - this.height/2) - 1;
        }

        translate(x: number, y: number) {
            this.x += x;
            this.y += y;
        }

        getView(level: Dungeon.Level, players: Array<Entities.PlayerChar>): DrawMatrix {
            var map = this.getMapView(level.map);
            return this.addEntities(map, level.entities, players);
        }

        private getMapView(map: ROT.IMap): DrawMatrix {

            var matrix = new Array<Array<IDrawable>>();
            for (var i = 0; i < this.width; i++) {
                matrix[i] = new Array<IDrawable>();
            }

            for (var key in map) {
                var parts = key.split(",");
                var x = parseInt(parts[0]);
                var y = parseInt(parts[1]);

                if (isNaN(x)|| isNaN(y)) {                   
                    continue;
                }
                if (x < this.x || y < this.y || x > this.x + this.width - 1 || y > this.y + this.height - 1) {
                    continue;
                }

                switch (map[key]) {
                    case " ":
                        matrix[x - this.x][y - this.y] = { 
                            symbol: map[key], 
                            color: "white", 
                            bgColor: "gray"
                        };
                        break;
                    default:
                        matrix[x - this.x][y - this.y] = {
                            symbol: map[key],
                        };
                        break;
                }
            }
            return new DrawMatrix(this.xOffset, this.yOffset, matrix);
        }

        private addEntities(matrix: DrawMatrix, entities: Array<IEntity>, characters: Array<Entities.PlayerChar>): DrawMatrix {

            entities.forEach((e) => {
                if (e.x < this.x || e.y < this.y || e.x > this.x + this.width - 1 || e.y > this.y + this.height - 1) {

                }
                else {
                    matrix.matrix[e.x - this.x][e.y - this.y] = {
                        symbol: "e"
                    };
                }
            })
            characters.forEach((p) => {
                matrix.matrix[p.x - this.x][p.y - this.y] = {
                    symbol: "@"
                };
            })

            return matrix;
        }

    }
}