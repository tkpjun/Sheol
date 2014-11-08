/// <reference path="../../Common/ObservableProperty.ts" />
module AsciiGame.UI {

    export class Button extends Common.Observable implements IElement {

        upColor: string;
        hoverColor: string;
        downColor: string;
        corner: string;
        label: string;
        state: ButtonState;

        constructor(corner: string, label: string, callback) {
            super(callback);
            this.corner = corner;
            this.label = label;
            this.state = ButtonState.Up;
        }

        getMatrix(x: number, y: number, width: number, height: number): DrawMatrix {
            var color = this.getColor();
            var matrix = new DrawMatrix(x, y, null, width, height, this.getColor());
            if (this.corner) {
                matrix.addString(0, 0, this.corner, width - 1);
            }
            var labelX, labelY;
            labelY = Math.floor(height / 2);
            if (this.label.length >= width) {
                labelX = 0;
            }
            else {
                labelX = Math.floor(width / 2) - Math.floor(this.label.length / 2);
            }
            return matrix;
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