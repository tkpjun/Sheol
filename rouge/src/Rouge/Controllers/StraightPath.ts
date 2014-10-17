﻿///<reference path="Path.ts"/>
module Rouge.Controllers {

    export class StraightPath extends Path {
        constructor(passableFn: (x: number, y: number) => boolean, from: ILocation, to?: ILocation, lengthInAP?: number) {
            super();
            this._lengthInAP = lengthInAP;
            this.begin = from;

            if (to) {
                this.createPath(passableFn, from, to);
                this.updateCosts();
                this.pointer = to;
            }
            else {
                this._nodes.push(from);
                this._costs.push(0);
                this.pointer = from;
            }
        }

        private createPath(passableFn: (x: number, y: number) => boolean, from: ILocation, to: ILocation) {
            var last = from;
            this._nodes.push(last);
            var k = (to.y - from.y) / (to.x - from.x);
            //console.log(k);
            var addition = Math.min(1, Math.abs(1 / k));
            var fn = (x: number) => {
                return Math.round(k * (x - to.x) + to.y);
            }
            var addNext = () => {
                var next;
                if (k == Infinity)
                    next = { x: last.x, y: last.y + 1 };
                else if (k == -Infinity)
                    next = { x: last.x, y: last.y - 1 };
                else {
                if (to.x > from.x) {
                    next = { x: last.x + addition, y: fn(last.x + addition)}
                }
                else {
                    next = { x: last.x - addition, y: fn(last.x - addition) }
                }
                }

                if (Math.round(next.x) !== Math.round(last.x) || Math.round(next.y) !== Math.round(last.y))
                    this._nodes.push({x: Math.round(next.x), y: Math.round(next.y)});

                last = next;
            }
            var condition = () => {
                if (!passableFn(this._nodes[this._nodes.length - 1].x, this._nodes[this._nodes.length - 1].y))
                    return false;

                if (k == Infinity) {
                    if (Math.round(last.y) >= to.y) return false;
                }
                else if (k == -Infinity) {
                    if (Math.round(last.y) <= to.y) return false;
                }
                else if (to.x > from.x) {
                    if (Math.round(last.x) >= to.x) return false;
                }
                else {
                if (Math.round(last.x) <= to.x) return false;
                }
                return true;
            }
            while (condition()) {
                addNext();
            }
        }
    }
}