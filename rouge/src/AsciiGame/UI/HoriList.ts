module AsciiGame.UI {

    export class HoriList implements IElement {

        private elements: IElement[];
        private weights: number[];
        private offset = 1;
        private offEnds = 0;
        private bgColor;

        constructor(offsetEnds?: number, offset?: number, bgcolor?: string) {
            this.elements = new Array<IElement>();
            this.weights = new Array<number>();
            this.bgColor = bgcolor;
            if (offsetEnds)
                this.offEnds = offsetEnds;
            if (offset)
                this.offset = offset;
        }

        add(elem: IElement, weight?: number): HoriList {
            this.elements.push(elem);
            if (weight)
                this.weights.push(weight);
            else
                this.weights.push(1);
            return this;
        }

        getMatrix(dim: Rect): DrawMatrix {
            var matrix = new DrawMatrix(dim.x, dim.y, dim.w, dim.h, this.bgColor);
            var space = dim.w - this.offset * (this.elements.length - 1) - 2 * this.offEnds;
            var step = Math.floor(space / this.weights.reduce((x, y) => { return x + y }));
            var nextX = dim.x + this.offEnds;
            for (var i = 0; i < this.elements.length; i++) {
                matrix.addOverlay(this.elements[i].getMatrix(new Rect(nextX, dim.y, step, dim.h)));
                nextX += this.offset;
                nextX += this.weights[i] * step;
            }
            return matrix;
        }

        whatIsAt(x: number, y: number, dim: Rect): Common.Tuple2<IElement, Rect> {
            var space = dim.w - this.offset * (this.elements.length - 1);
            var step = Math.floor(space / this.weights.reduce((x, y) => { return x + y }));
            var nextX = dim.x;
            for (var i = 0; i < this.elements.length; i++) {
                var rect = new Rect(nextX, dim.y, step, dim.h);
                if (rect.isWithin(x, y)) {
                    return { fst: this.elements[i], snd: rect };
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