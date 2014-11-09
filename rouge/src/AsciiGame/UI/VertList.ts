﻿module AsciiGame.UI {

    export class VertList implements IElement {

        private elements: IElement[];
        private weights: number[];
        private offset = 1;

        constructor(offset?) {
            this.elements = new Array<IElement>();
            this.weights = new Array<number>();
            if (offset)
                this.offset = offset;
        }

        add(elem: IElement, weight?: number): VertList {
            this.elements.push(elem);
            if (weight)
                this.weights.push(weight);
            else
                this.weights.push(1);
            return this;
        }

        getMatrix(dim: Rect): DrawMatrix {
            var matrix = new DrawMatrix(dim.x, dim.y, dim.w, dim.h);
            var space = dim.h - this.offset * (this.elements.length - 1);
            var step = Math.floor(space / this.weights.reduce((x, y) => { return x + y }));
            var nextY = dim.y;
            for (var i = 0; i < this.elements.length; i++) {
                matrix.addOverlay(this.elements[i].getMatrix(new Rect(dim.x, nextY, dim.w, step)));
                nextY += this.offset;
                nextY += this.weights[i] * step;
            }
            return matrix;
        }

        whatIsAt(x: number, y: number, dim: Rect): Common.Tuple2<IElement, Rect> {
            var space = dim.h - this.offset * (this.elements.length - 1);
            var step = Math.floor(space / this.weights.reduce((x, y) => { return x + y }));
            var nextY = dim.y;
            for (var i = 0; i < this.elements.length; i++) {
                var rect = new Rect(dim.x, nextY, dim.h, step);
                if (rect.isWithin(x, y)) {
                    return { fst: this.elements[i], snd: rect };
                }
                nextY += this.offset;
                nextY += this.weights[i] * step;
            }
            return null;
        }

        mouseOver() {
        }
        mouseNotOver() {
        }
        mouseDown() {
        }
        mouseUp() {
        }
    }
} 