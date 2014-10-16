///<reference path="Path.ts"/>
module Rouge.Controllers {

    export class StraightPath extends Path {
        constructor(passableFn: (x: number, y: number, from?: ILocation) => boolean, from: ILocation, to?: ILocation, lengthInAP?: number) {
            super();
            this._nodes = new Array<ILocation>();
            this._costs = new Array<number>();
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

        private createPath(passableFn: (x: number, y: number, from?: ILocation) => boolean, from: ILocation, to: ILocation) {
            //throw ("BROKEN IMPLEMENTATION");
            var last = from;
            this._nodes.push(last);
            var k = (to.y - from.y) / (to.x - from.x);
            var fn = (x: number) => {
                return Math.round(k * (x - to.x) + to.y);
            }
            var addNext = () => {
                var next;
                if (isNaN(k)) {
                    if (to.y > from.y)
                        next = { x: last.x, y: last.y + 1 };
                    else
                        next = { x: last.x, y: last.y - 1 };
                }
                else {
                if (to.x > from.x) {
                    next = { x: last.x + 0.1, y: fn(last.x + 0.1)}
                }
                else {
                    next = { x: last.x - 0.1, y: fn(last.x - 0.1) }
                }
                }

                if (Math.round(next.x) !== Math.round(last.x) || Math.round(next.y) !== Math.round(last.y))
                    this._nodes.push({x: Math.round(next.x), y: Math.round(next.y)});

                last = next;
            }
            var condition = () => {
                if (to.x > from.x) {
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
            /*
            for (var x = from.x; x <= to.x; x++) {
                var loc = { x: x, y: fn(x) }
                if (passableFn(loc.x, loc.y, last)) {
                    this._nodes.push(loc);
                }
                else {
                    break;
                }
                last = loc;
            }*/
            //console.log(this._nodes[0])
            //console.log(this._nodes[this._nodes.length - 1]);
        }
    }
}