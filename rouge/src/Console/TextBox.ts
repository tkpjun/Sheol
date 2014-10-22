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
                    var split = this.breakIntoLines(nextLine, width - 2);

                    matrix.addString(1, this.height - used - 1, split[1], width - 1);
                    used += 1;
                    if (used >= this.height)
                        break;
                    else {
                        matrix.addString(1, this.height - used - 1, split[0], width - 1);
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

        private breakIntoLines(str: string, limit: number): string[] {
            var arr = new Array<string>();

            var words = str.split(" ");
            var i = 1;
            var next = words[i];
            var lt = words[0].length;
            arr[0] = words[0];
            while (next && lt + next.length + 1 < limit) {
                lt += next.length + 1;
                arr[0] += " " + next;
                i += 1;
                next = words[i];
            }
            arr[1] = words[i];
            i += 1;
            while (i < words.length) {
                arr[1] += " " + words[i];
                i += 1;
            }

            return arr;
        }

    }
}