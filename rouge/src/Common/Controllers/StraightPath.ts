///<reference path="Path.ts"/>
module Common.Controllers {

    export class StraightPath extends Path {
        constructor(from: IVector2, to?: IVector2, lengthInAP?: number) {
            super();
            this.lengthInAP = lengthInAP;
            this.begin = from;
            this.nodes.push(from);
            this.costs.push(0);

            if (to) {               
                this.pointer = to;
            }
            else {
                this.pointer = from;
            }
        }

        connect(passableFn: (x: number, y: number) => boolean) {
            this.nodes.length = 0;
            this.costs.length = 0;

            this.createPath(passableFn, this.begin, this.pointer);
            this.updateCosts();
        }

        private createPath(passableFn: (x: number, y: number) => boolean, from: IVector2, to: IVector2) {
            var last = from;
            this.nodes.push(last);
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
                    this.nodes.push({x: Math.round(next.x), y: Math.round(next.y)});

                last = next;
            }
            var condition = () => {
                if (!passableFn(this.nodes[this.nodes.length - 1].x, this.nodes[this.nodes.length - 1].y))
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