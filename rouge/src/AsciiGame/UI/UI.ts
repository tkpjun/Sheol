/// <reference path="../../Common/Common.ts" />
module AsciiGame.UI {

    export interface IElement {
        mouseOver();
        mouseNotOver();
        mouseDown();
        mouseUp();
        getMatrix(dim: Rect): DrawableMatrix;
        whatIsAt(x: number, y: number, dim?: Rect): [IElement, Rect];
    }

    export class Rect {
        x: number;
        y: number;
        w: number;
        h: number;

        constructor(x: number, y: number, width: number, height: number) {
            this.x = x;
            this.y = y;
            this.w = width;
            this.h = height;
        }

        isWithin(x: number, y: number): boolean {
            return x >= this.x && y >= this.y && x < this.x + this.w && y < this.y + this.h;
        }
    }
} 