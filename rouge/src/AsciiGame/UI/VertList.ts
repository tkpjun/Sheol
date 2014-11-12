module AsciiGame.UI {

    export class VertList<T extends IElement> implements IElement {

        private elements: T[];
        private weights: number[];
        private offset = 1;
        private offEnds = 0;
        private bgColor;
        private focus;
        private visibleElements: number = null;

        constructor(offsetEnds?: number, offset?, bgcolor?: string) {
            this.elements = new Array<T>();
            this.weights = new Array<number>();
            this.bgColor = bgcolor;
            if (offsetEnds)
                this.offEnds = offsetEnds;
            if (offset)
                this.offset = offset;
        }

        add(elem: T, weight?: number): VertList<T> {
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

        setVisibleElements(amount: number) {
            this.visibleElements = amount;
        }

        getAtIndex(index: number) {
            return this.elements[index];
        }

        private indexIsVisible(i: number): boolean {
            if (this.visibleElements)
                return i < this.visibleElements;
            else
                return i < this.elements.length;
        }

        getMatrix(dim: Rect): DrawMatrix {
            var matrix = new DrawMatrix(dim.x, dim.y, dim.w, dim.h, this.bgColor);
            var space = dim.h - this.offset * (this.elements.length - 1) - 2 * this.offEnds;;
            var step = Math.floor(space / this.weights.reduce((x, y) => { return x + y }));
            var nextY = dim.y + this.offEnds;;
            for (var i = 0; this.indexIsVisible(i); i++) {
                var next = this.elements[i].getMatrix(new Rect(dim.x, nextY, dim.w, step));
                if (this.focus === i) {
                    next.matrix.forEach(row => row.forEach(cell => cell.bgColor == "yellow"));
                }
                matrix.addOverlay(next);
                nextY += this.offset;
                nextY += this.weights[i] * step;
            }
            return matrix;
        }

        whatIsAt(x: number, y: number, dim: Rect): Common.Tuple2<IElement, Rect> {
            var space = dim.h - this.offset * (this.elements.length - 1) - 2 * this.offEnds;;
            var step = Math.floor(space / this.weights.reduce((x, y) => { return x + y }));
            var nextY = dim.y + this.offEnds;;
            for (var i = 0; this.indexIsVisible(i); i++) {
                var rect = new Rect(dim.x, nextY, dim.w, step);
                if (rect.isWithin(x, y)) {
                    return { fst: this.elements[i], snd: rect };
                }
                nextY += this.offset;
                nextY += this.weights[i] * step;
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