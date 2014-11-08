module AsciiGame.UI {

    export class Container implements IElement {

        x: number;
        y: number;
        height: number;
        width: number;
        element: IElement;

        constructor(x: number, y: number, width: number, height: number, element: IElement) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.element = element;
        }

        getMatrix(): DrawMatrix {
            return this.element.getMatrix(this.x, this.y, this.width, this.height);
        }

        mouseOver() {
            this.element.mouseOver();
        }
        mouseNotOver() {
            this.element.mouseNotOver();
        }
        mouseDown() {
            this.element.mouseDown();
        }
        mouseUp() {
            this.element.mouseUp();
        }
    }
}  