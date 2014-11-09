module AsciiGame.UI {

    export class Box {

        dimensions: Rect
        element: IElement;

        constructor(dimensions: Rect, element: IElement) {
            this.dimensions = dimensions;
            this.element = element;
        }

        getMatrix(): DrawMatrix {
            return this.element.getMatrix(this.dimensions);
        }

        mouseOver(x: number, y: number) {
            this.element.mouseOver();
            var next = this.element.whatIsAt(x, y, this.dimensions);
            while (next) {
                next.fst.mouseOver();
                next = next.fst.whatIsAt(x, y, next.snd);
            }
        }
        mouseNotOver(x: number, y: number) {
            this.element.mouseNotOver();
            var next = this.element.whatIsAt(x, y, this.dimensions);
            while (next) {
                next.fst.mouseNotOver();
                next = next.fst.whatIsAt(x, y, next.snd);
            }
        }
        mouseDown(x: number, y: number) {
            this.element.mouseDown();
            var next = this.element.whatIsAt(x, y, this.dimensions);
            while (next) {
                next.fst.mouseDown();
                next = next.fst.whatIsAt(x, y, next.snd);
            }
        }
        mouseUp(x: number, y: number) {
            this.element.mouseUp();
            var next = this.element.whatIsAt(x, y, this.dimensions);
            while (next) {
                next.fst.mouseUp();
                next = next.fst.whatIsAt(x, y, next.snd);
            }
        }
    }
}  