/// <reference path="../../Common/ObservableProperty.ts" />
module AsciiGame.UI {

    export class Button extends Common.Observable implements IElement {

        color: string;
        corner: string;
        label: string;
        state: ButtonState;

        constructor(corner: string, label: string, callback, color?: string) {
            super(callback);
            this.corner = corner;
            this.label = label;
            this.state = ButtonState.Up;
            this.color = color;
        }

        getMatrix(dim: Rect): DrawMatrix {
            var color = this.getColor();
            var matrix = new DrawMatrix(dim.x, dim.y, null, dim.w, dim.h, this.getColor());
            if (this.corner) {
                matrix.addString(0, 0, this.corner, dim.w - 1);
            }
            var labelX, labelY;
            labelY = Math.floor(dim.h / 2);
            if (this.label.length >= dim.w) {
                labelX = 0;
            }
            else {
                labelX = Math.floor(dim.w / 2) - Math.floor(this.label.length / 2);
            }
            matrix.addString(labelX, labelY, this.label, dim.w - 1);
            return matrix;
        }

        whatIsAt(x: number, y: number): Common.Tuple2<IElement, Rect> {
            return null;
        }

        mouseOver() {
            this.state = ButtonState.Hover;
        }
        mouseNotOver() {
            this.state = ButtonState.Up;

        }
        mouseDown() {
            if (this.state !== ButtonState.Down) {
                this.notify();
            }
            this.state = ButtonState.Down;
        }
        mouseUp() {
            this.state = ButtonState.Up;
        }

        private getColor(): string {
            switch (this.state) {
                case ButtonState.Up:
                    if (this.color)
                        return this.color;
                    else
                        return "royalblue";
                    break;
                case ButtonState.Hover:
                    return "yellow";
                    break;
                default:
                    return "navy";
                    break;
            }
        }

    }
    
    export enum ButtonState {
        Up, Down, Hover
    }
}