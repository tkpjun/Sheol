/// <reference path="../../Common/ObservableProperty.ts" />
module AsciiGame.UI {

    export class Button extends Common.Observable implements IElement {

        color: string;
        corner: string;
        label: string;
        state: ButtonState;
        private cb: () => void;

        constructor(corner: string, label: string, callback, color?: string) {
            super(callback);
            this.cb = callback;
            this.corner = corner;
            if (!corner) this.corner = "";
            this.label = label;
            this.state = ButtonState.Up;
            this.color = color;
        }

        switchCallback(callback: () => void) {
            this.detach(this.cb);
            this.attach(callback);
        }

        getMatrix(dim: Rect): DrawMatrix {
            var color = this.getColor();
            var matrix = new DrawMatrix(dim.x, dim.y, dim.w, dim.h, this.getColor());
            if (this.corner) {
                matrix.addString(0, 0, this.corner, dim.w - 1);
            }
            var labelX, labelY;
            labelY = Math.floor(dim.h / 2);
            if (this.label.length >= dim.w) {
                if (labelY == 0 && this.corner.length > 0)
                    labelX = this.corner.length + 1;
                else
                    labelX = 0;
            }
            else {
                labelX = Math.floor(dim.w / 2) - Math.floor(this.label.length / 2);
            }
            if (dim.h <= 1 && this.corner.length > 0) {
                labelX = Math.max(labelX, this.corner.length + 1);
            }
            matrix.addString(labelX, labelY, this.label, dim.w);
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
                    return "gray";
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