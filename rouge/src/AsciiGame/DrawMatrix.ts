/// <reference path="../Common/Controllers/Controllers.ts" />
module AsciiGame {
    import Controllers = Common.Controllers;

    export class DrawMatrix {

        xOffset: number;
        yOffset: number;
        matrix: Array<Array<IDrawable>>;

        constructor(xOffset: number, yOffset: number, matrix?: Array<Array<IDrawable>>, width?: number, height?: number, bgColor?: string) {
            this.xOffset = xOffset;
            this.yOffset = yOffset;

            if (matrix) {
                this.matrix = matrix;
            }
            else {
                this.matrix = new Array<Array<IDrawable>>();
                for (var i = 0; i < width; i++) {
                    this.matrix[i] = new Array<IDrawable>();
                    for (var j = 0; j < height; j++) {
                        this.matrix[i][j] = { symbol: " ", bgColor: bgColor };
                    }
                }
            }
        }

        addString(x: number, y: number, str: string, wrapAt?: number, color?: string, bgColor?: string): DrawMatrix {
            if (!str) return this;
            var lines = new Array<string>();
            var bgc;

            var limit = this.matrix.length;
            if (wrapAt) {
                limit = wrapAt;
            }

            if (x + str.length > limit) {
                lines = wrapString(str, limit - x)
            }
            else {
                lines.push(str);
            }

            for (var h = 0; h < lines.length; h++) {
                var line = lines[h];
                for (var i = 0; i < line.length; i++) {
                    if (this.matrix[i + x] && this.matrix[i + x][h + y]) {
                        if (!bgColor) bgc = this.matrix[i + x][h + y].bgColor;
                        else bgc = bgColor;
                        this.matrix[i + x][h + y] = { symbol: line[i], color: color, bgColor: bgc };
                    }
                }
            }
            return this;
        }

        addPath(path: Controllers.Path, offsetX: number, offsetY: number, maxAP?: number, excludeFirst?: boolean, color?: string): DrawMatrix {
            if (!path) return this;

            var nodes = path._nodes;
            var limited = path.limitedNodes();
            if (!color) color = "slateblue";
            if (excludeFirst) {
                nodes.shift();
            }
            nodes.forEach((node) => {
                if (this.matrix[node.x - offsetX] && this.matrix[node.x - offsetX][node.y - offsetY]) {
                    var bg = this.matrix[node.x - offsetX][node.y - offsetY].bgColor;
                    if (!bg) bg = "black"
                    this.matrix[node.x - offsetX][node.y - offsetY].bgColor =
                    ROT.Color.toRGB((ROT.Color.interpolate(ROT.Color.fromString(bg), ROT.Color.fromString("tan"), 0.5)));
                }
            });
            limited.forEach((node) => {
                if (this.matrix[node.x - offsetX] && this.matrix[node.x - offsetX][node.y - offsetY]) {
                    var bg = this.matrix[node.x - offsetX][node.y - offsetY].bgColor;
                    if (!bg) bg = "black"
                    this.matrix[node.x - offsetX][node.y - offsetY].bgColor =
                        ROT.Color.toRGB((ROT.Color.interpolate(ROT.Color.fromString(bg), ROT.Color.fromString(color), 0.75)));
                }
            });
            var p = path.pointer;
            if (this.matrix[p.x - offsetX] && this.matrix[p.x - offsetX][p.y - offsetY]) {
                var bg = this.matrix[p.x - offsetX][p.y - offsetY].bgColor;
                if (!bg) bg = "black"
                if (limited[limited.length - 1] && p.x == limited[limited.length - 1].x && p.y == limited[limited.length - 1].y)
                    this.matrix[p.x - offsetX][p.y - offsetY].bgColor = color;
                else
                    this.matrix[p.x - offsetX][p.y - offsetY].bgColor = "sandybrown";
            }
            return this;
        }

        addOverlay(other: DrawMatrix, alpha?: number): DrawMatrix {
            var newXOff = Math.min(this.xOffset, other.xOffset);
            var newYOff = Math.min(this.yOffset, other.yOffset);

            if (newXOff < this.xOffset) {
                var ext = new Array<Array<IDrawable>>();
                for (var i = 0; i < newXOff - this.xOffset; i++) {
                    ext[i] = new Array<IDrawable>();
                    for (var j = 0; j < this.matrix[0].length; j++) {
                        ext[i][j] = { symbol: " " };
                    }
                }
                this.matrix = ext.concat(this.matrix);
                this.xOffset = newXOff;
            }
            if (newYOff < this.yOffset) {
                for (var i = 0; i < this.matrix.length; i++) {
                    var ext2 = new Array<IDrawable>();
                    for (var j = 0; j < newYOff - this.yOffset; j++) {
                        ext2[j] = { symbol: " " };
                    }
                    this.matrix[i] = ext2.concat(this.matrix[i]);
                }
                this.yOffset = newYOff;
            }

            for (var i = 0; i < other.matrix.length; i++) {
                for (var j = 0; j < other.matrix[0].length; j++) {
                    if (other.matrix[i][j].symbol && other.matrix[i][j].symbol !== " ") {
                        this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].symbol = other.matrix[i][j].symbol;
                        this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].color = other.matrix[i][j].color;
                    }
                    else {
                        var c1 = this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].color;
                        var c2 = other.matrix[i][j].bgColor;
                        if (!c1) c1 = "black";
                        if (!c2) c2 = "black";
                        if (alpha) {
                            this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].color =
                            ROT.Color.toRGB((ROT.Color.interpolate(ROT.Color.fromString(c1), ROT.Color.fromString(c2), alpha)));
                        }
                        else {
                            this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].color = c2;
                        }
                    }

                    var bg1 = this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].bgColor
                    var bg2 = other.matrix[i][j].bgColor;
                    if (!bg1) bg1 = "black";
                    if (!bg2) bg2 = "black";
                    if (alpha) {
                        this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].bgColor =
                        ROT.Color.toRGB((ROT.Color.interpolate(ROT.Color.fromString(bg1), ROT.Color.fromString(bg2), alpha)));
                    }
                    else {
                        this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].bgColor = bg2;
                    }
                }
            }

            return this;
        }

        draw(display: ROT.Display) {
            for (var i = 0; i < this.matrix.length; i++) {
                for (var j = 0; j < this.matrix[0].length; j++) {
                    if (!this.matrix[i][j]) continue;

                    display.draw(i + this.xOffset,
                        j + this.yOffset,
                        this.matrix[i][j].symbol,
                        this.matrix[i][j].color,
                        this.matrix[i][j].bgColor);
                }
            }
        }
    }
}