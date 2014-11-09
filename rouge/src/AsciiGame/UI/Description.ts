module AsciiGame.UI {

    export class Description implements IElement {

        header: string;
        text: string;

        getMatrix(dim: Rect): DrawMatrix {
            var matrix = new DrawMatrix(dim.x, dim.y, null, dim.w, dim.h);
            var y = 1;
            if (this.header) {
                var headerX;
                if (this.header.length >= dim.w) {
                    headerX = 1;
                }
                else {
                    headerX = Math.floor(dim.w / 2) - Math.floor(this.header.length / 2);
                }
                matrix.addString(headerX, 1, this.header, dim.w - 1);
                y += 2;
            }
            var textX
            if (this.text.length >= dim.w) {
                textX = 1;
            }
            else {
                textX = Math.floor(dim.w / 2) - Math.floor(this.text.length / 2);
            }
            matrix.addString(textX, y, this.text, dim.w - 1);
            return matrix;
        }

        whatIsAt(x: number, y: number): Common.Tuple2<IElement, Rect> {
            return null;
        }

        mouseOver() {
        }
        mouseNotOver() {

        }
        mouseDown() {
        }
        mouseUp() {
        }
    }
} 