/// <reference path="../../Common/ObservableProperty.ts" />
module AsciiGame.UI {

    export class TextBox extends Common.Observable {

        private lines: string[];
        height: number;
        x: number;
        y: number;

        constructor(x: number, y: number, height: number, callback) {
            super(callback);
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
            this.notify();
            return this;
        }

        getMatrix(width: number): DrawableMatrix {
            var matrix = new DrawableMatrix(this.x, this.y, width, this.height);
            var used = 0;
            var index = this.lines.length - 1;
            var mod = 0;

            while (used < this.height && index >= 0) {
                if (used >= this.height - 2)
                    mod = 2;
                var nextLine = this.lines[index];
                if (nextLine.length > width - 2 - mod) {
                    var split = AsciiGame.wrapString(nextLine, width - 2 - mod);

                    while (split.length > 0 && used < this.height) {
                        var line = split.pop();
                        matrix.addString(1, this.height - used - 1, line, width - 1 - mod);
                        used += 1;
                    }        
                }
                else {
                    matrix.addString(1, this.height - used - 1, nextLine, width - 1 - mod);
                    used += 1;
                }
                index -= 1;
            }
            return matrix;
        }

    }
}