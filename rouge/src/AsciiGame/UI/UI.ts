/// <reference path="../../Common/Common.ts" />
module AsciiGame.UI {

    export interface IElement {
        mouseOver();
        mouseNotOver();
        mouseDown();
        mouseUp();
        getMatrix(x: number, y: number, width: number, height: number): DrawMatrix;
    }
} 