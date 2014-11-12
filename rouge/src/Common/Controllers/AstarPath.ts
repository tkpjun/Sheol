///<reference path="Path.ts"/>
module Common.Controllers {

    export class AstarPath extends Path {

        _astar: ROT.IPath;

        constructor(from: IVector2, to?: IVector2, lengthInAP?: number) {
            super();
            this._lengthInAP = lengthInAP;
            this.begin = from;
            this._nodes.push(from);
            this._costs.push(0);

            if (to) {               
                this.pointer = to;
            }
            else {
                this.pointer = from;
            }
        }

        connect(passableFn: (x: number, y: number) => boolean) {
            this._nodes.length = 0;
            this._costs.length = 0;

            this._astar = new ROT.Path.AStar(this.pointer.x, this.pointer.y, passableFn, { topology: 4 });
            this._astar.compute(this.begin.x, this.begin.y, (x, y) => {
                this._nodes.push({ x: x, y: y });
            });
            //this.fixPath(passableFn);
            this.updateCosts();

            if (!passableFn(this.pointer.x, this.pointer.y)) {
                this._nodes.pop();
                this._costs.pop();
            }
        }
    }
} 