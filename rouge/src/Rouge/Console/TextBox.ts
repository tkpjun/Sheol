module Rouge.Console {

    export class TextBox {

        private lines: string[];
        height: number;
        x: number;
        y: number;

        constructor(x: number, y:number, height: number) {
            this.x = x;
            this.y = y;
            this.height = height;
            this.lines = new Array<string>();
        }

        addLine(line: string): TextBox {
            this.lines.push(line);
            if (this.lines.length > 50) {
                this.lines.splice(0, 25);
            }
            return this;
        }

        getMatrix(width: number): DrawMatrix {
            var matrix = new DrawMatrix(this.x, this.y, null, width, this.height);
            var used = 0;
            var index = this.lines.length - 1;

            while (used < this.height && index >= 0) {
                var nextLine = this.lines[index];

                if (nextLine.length > width - 2) {
                    var line1 = nextLine.slice(0, width - 2);
                    var line2 = nextLine.slice(width - 2).trim();
                    matrix.addString(1, this.height - used - 1, line2, width - 1);
                    used += 1;
                    if (used >= this.height)
                        break;
                    else {
                        matrix.addString(1, this.height - used - 1, line1, width - 1);
                        used += 1;
                    }              
                }
                else {
                    matrix.addString(1, this.height - used - 1, nextLine, width - 1);
                    used += 1;
                }
                index -= 1;
            }
            return matrix;
        }
    }
}