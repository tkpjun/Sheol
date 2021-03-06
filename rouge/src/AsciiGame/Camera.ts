﻿/// <reference path="../Common/Common.ts" />
/// <reference path="../Common/Dungeon/Dungeon.ts" />
/// <reference path="../Common/Entities/Entities.ts" />
module AsciiGame {
    import Dungeon = Common.Dungeon;
    import Entities = Common.Entities;
    import C = Common;

    export class Camera {

        x: number;
        y: number;
        xOffset: number;
        yOffset: number;
        width: number;
        height: number;
        private _view: DrawableMatrix;

        constructor(xOffset: number, width: number, yOffset: number, height: number) {
            this.width = width;
            this.height = height;
            this.xOffset = xOffset;
            this.yOffset = yOffset;
            this.x = 0;
            this.y = -1;
        }

        get view() {
            return this._view;
        }

        centerOn(x: number);
        centerOn(x: number, y?: number);
        centerOn(x: number, y?: number, level?: Dungeon.Level, players?: Array<Entities.PlayerChar>) {
            this.x = Math.floor(x - this.width / 2) - 1;
            if(y)
                this.y = Math.floor(y - this.height / 2) - 1;
            if (level && players)
                this.updateView(level, players);
        }

        translate(x: number, y: number) {
            this.x += x;
            this.y += y;
        }

        updateView(level: Dungeon.Level, entities?: Array<C.IEntity>) {
            var map = this.getMapView(level.map);
            this._view = this.addObjects(map, level.objects);
            if (entities)
                this._view = this.addEntities(this._view, entities);
            else
                this._view = this.addEntities(this._view, level.entities);
        }

        sees(x: number, y: number): boolean {
            return x >= this.x && y >= this.y && x < this.x + this.width && y < this.y + this.height;
        }

        private getMapView(map: ROT.IMap): DrawableMatrix {

            var matrix = new DrawableMatrix(this.xOffset, this.yOffset, this.width, this.height);
            /*
            var matrix = new Array<Array<IDrawable>>();
            for (var i = 0; i < this.width; i++) {
                matrix[i] = new Array<IDrawable>();
                for (var j = 0; j < this.height; j++) {
                    matrix[i][j] = { symbol: " " };
                }
            }*/

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
                        matrix.matrix[x - this.x][y - this.y] = { 
                            symbol: map[key], 
                            color: "white", 
                            bgColor: "gray"
                        };
                        break;
                    default:
                        matrix.matrix[x - this.x][y - this.y] = {
                            symbol: map[key],
                            color: "white"
                        };
                        break;
                }
            }
            return matrix;
        }

        private addObjects(matrix: DrawableMatrix, objects: Array<C.IObject>): DrawableMatrix {
            objects.forEach((o) => {
                if (!this.isWithinBounds(o.x, o.y)) {

                }
                else {
                    var d: IDrawable = getDrawableO(o);
                    matrix.matrix[o.x - this.x][o.y - this.y].symbol = d.symbol;
                    matrix.matrix[o.x - this.x][o.y - this.y].color = d.color;
                }
            })
            return matrix;
        }

        private addEntities(matrix: DrawableMatrix, entities: Array<C.IEntity>): DrawableMatrix {

            entities.forEach((e) => {
                if (!this.isWithinBounds(e.x, e.y)) {

                }
                else {
                    var d = getDrawableE(e);
                    matrix.matrix[e.x - this.x][e.y - this.y].symbol = d.symbol;
                    matrix.matrix[e.x - this.x][e.y - this.y].color = d.color;
                if (matrix.matrix[e.x + e.dir.x - this.x]) {
                    if (!e.fov) {
                        matrix.matrix[e.x + e.dir.x - this.x][e.y + e.dir.y - this.y].bgColor = "tan";
                    }
                    else {
                        e.fov.forEach((cell) => {
                            if (this.isWithinBounds(cell.x, cell.y)) {
                                matrix.matrix[cell.x - this.x][cell.y - this.y].bgColor = mixColors(
                                    matrix.matrix[cell.x - this.x][cell.y - this.y].bgColor, "orange", 0.15);
                            }
                        });
                    }
                }
                }
            })
            return matrix;
        }

        private isWithinBounds(x, y) {
            return !(x < this.x || y < this.y || x > this.x + this.width - 1 || y > this.y + this.height - 1)
        }
    }
}