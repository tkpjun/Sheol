module AsciiGame.UI {

    export class HoriList<T extends IElement> implements IElement {

        private elements: T[];
        private weights: number[];
        private offset = 1;
        private offEnds = 0;
        private bgColor;
        private focus;

        constructor(offsetEnds?: number, offset?: number, bgcolor?: string) {
            this.elements = new Array<T>();
            this.weights = new Array<number>();
            this.bgColor = bgcolor;
            if (offsetEnds)
                this.offEnds = offsetEnds;
            if (offset)
                this.offset = offset;
        }

        add(elem: T, weight?: number): HoriList<T> {
            this.elements.push(elem);
            if (weight)
                this.weights.push(weight);
            else
                this.weights.push(1);
            return this;
        }

        setFocus(index: number) {
            this.focus = index;
        }

        getMatrix(dim: Rect): DrawableMatrix {
            var matrix = new DrawableMatrix(dim.x, dim.y, dim.w, dim.h, this.bgColor);
            var space = dim.w - this.offset * (this.elements.length - 1) - 2 * this.offEnds;
            var step = Math.floor(space / this.weights.reduce((x, y) => { return x + y }));
            var nextX = dim.x + this.offEnds;
            for (var i = 0; i < this.elements.length; i++) {
                var next = this.elements[i].getMatrix(new Rect(nextX, dim.y, step, dim.h));
                if (this.focus === i) {
                    next.matrix.forEach(row => row.forEach(cell => cell.bgColor = "yellow"));
                }
                matrix.addOverlay(next);
                nextX += this.offset;
                nextX += this.weights[i] * step;
            }
            return matrix;
        }

        whatIsAt(x: number, y: number, dim: Rect): [IElement, Rect] {
            var space = dim.w - this.offset * (this.elements.length - 1) - 2 * this.offEnds;
            var step = Math.floor(space / this.weights.reduce((x, y) => { return x + y }));
            var nextX = dim.x + this.offEnds;
            for (var i = 0; i < this.elements.length; i++) {
                var rect = new Rect(nextX, dim.y, step, dim.h);
                if (rect.isWithin(x, y)) {
                    return [this.elements[i], rect];
                }
                nextX += this.offset;
                nextX += this.weights[i] * step;
            }
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