module AsciiGame.UI {

    export class Box {

        dimensions: Rect
        element: IElement;
        isVisible: boolean = true;

        constructor(dimensions: Rect, element: IElement) {
            this.dimensions = dimensions;
            this.element = element;
        }

        getMatrix(): DrawableMatrix {
            if (this.isVisible)
                return this.element.getMatrix(this.dimensions);
            else
                return null;
        }

        whatIsAt(x: number, y: number): IElement {
            if (this.isVisible && this.dimensions.isWithin(x, y)) {
                var next: [IElement, Rect] = [this.element, this.dimensions];
                var last = next[0];
                while (next) {
                    last = next[0];
                    next = next[0].whatIsAt(x, y, next[1]);
                }
                return last;
            }
            else
                return null;
        }

        mouseOver(x: number, y: number): boolean {
            if (this.isVisible && this.dimensions.isWithin(x, y)) {
                this.element.mouseOver();
                var next = this.element.whatIsAt(x, y, this.dimensions);
                while (next) {
                    next[0].mouseOver();
                    next = next[0].whatIsAt(x, y, next[1]);
                }
                return true;
            }
            else {
                return false;
            }
        }
        mouseDown(x: number, y: number): boolean {
            if (this.isVisible && this.dimensions.isWithin(x, y)) {
                this.element.mouseDown();
                var next = this.element.whatIsAt(x, y, this.dimensions);
                while (next) {
                    next[0].mouseDown();
                    next = next[0].whatIsAt(x, y, next[1]);
                }
                return true;
            }
            else
                return false;
        }
        mouseUp(x: number, y: number): boolean {
            if (this.isVisible && this.dimensions.isWithin(x, y)) {
                this.element.mouseUp();
                var next = this.element.whatIsAt(x, y, this.dimensions);
                while (next) {
                    next[0].mouseUp();
                    next = next[0].whatIsAt(x, y, next[1]);
                }
                return true;
            }
            else
                return false;
        }
    }
}  