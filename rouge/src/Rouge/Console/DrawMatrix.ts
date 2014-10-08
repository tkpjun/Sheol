module Rouge.Console {

    export class DrawMatrix {

        xOffset: number;
        yOffset: number;
        matrix: Array<Array<IDrawable>>;

        constructor(xOffset, yOffset, matrix) {
            this.xOffset = xOffset;
            this.yOffset = yOffset;
            this.matrix = matrix;
        }

        combine(other: DrawMatrix): DrawMatrix {
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
                    this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].symbol = other.matrix[i][j].symbol;
                    this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].color = other.matrix[i][j].color;
                    this.matrix[i + other.xOffset - this.xOffset][j + other.yOffset - this.yOffset].bgColor = other.matrix[i][j].bgColor;
                }
            }

            return this;
        }

        draw(display: ROT.Display) {
            for (var i = 0; i < this.matrix.length; i++) {
                for (var j = 0; j < this.matrix[0].length; j++) {
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