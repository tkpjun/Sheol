module AsciiGame.UI {

    export class Box {

        dimensions: Rect
        element: IElement;

        constructor(dimensions: Rect, element: IElement) {
            this.dimensions = dimensions;
            this.element = element;
        }

        getMatrix(): DrawableMatrix {
            return this.element.getMatrix(this.dimensions);
        }

        whatIsAt(x: number, y: number): IElement {
            if (this.dimensions.isWithin(x, y)) {
                var next = { fst: this.element, snd: this.dimensions };
                var last = next.fst;
                while (next) {
                    last = next.fst;
                    next = next.fst.whatIsAt(x, y, next.snd);
                }
                return last;
            }
            else
                return null;
        }

        mouseOver(x: number, y: number): boolean {
            if (this.dimensions.isWithin(x, y)) {
                this.element.mouseOver();
                var next = this.element.whatIsAt(x, y, this.dimensions);
                while (next) {
                    next.fst.mouseOver();
                    next = next.fst.whatIsAt(x, y, next.snd);
                }
                return true;
            }
            else {
                return false;
            }
        }
        mouseDown(x: number, y: number): boolean {
            if (this.dimensions.isWithin(x, y)) {
                this.element.mouseDown();
                var next = this.element.whatIsAt(x, y, this.dimensions);
                while (next) {
                    next.fst.mouseDown();
                    next = next.fst.whatIsAt(x, y, next.snd);
                }
                return true;
            }
            else
                return false;
        }
        mouseUp(x: number, y: number): boolean {
            if (this.dimensions.isWithin(x, y)) {
                this.element.mouseUp();
                var next = this.element.whatIsAt(x, y, this.dimensions);
                while (next) {
                    next.fst.mouseUp();
                    next = next.fst.whatIsAt(x, y, next.snd);
                }
                return true;
            }
            else
                return false;
        }
    }
}  