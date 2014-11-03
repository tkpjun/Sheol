/// <reference path="../../Common/Common.ts" />
module ConsoleGame.UI {

    export interface IElement extends Common.IObservable {
        mouseOver();
        mouseNotOver();
        mouseDown();
        mouseUp();
        getMatrix(width: number, height: number): DrawMatrix;
    }
} 