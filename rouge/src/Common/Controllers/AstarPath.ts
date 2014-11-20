///<reference path="Path.ts"/>
module Common.Controllers {

    export class AstarPath extends Path {

        _astar: ROT.IPath;

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

            this._astar = new ROT.Path.AStar(this.pointer.x, this.pointer.y, passableFn, { topology: 4 });
            this._astar.compute(this.begin.x, this.begin.y, (x, y) => {
                this.nodes.push({ x: x, y: y });
            });
            //this.fixPath(passableFn);
            this.updateCosts();

            if (!passableFn(this.pointer.x, this.pointer.y)) {
                this.nodes.pop();
                this.costs.pop();
            }
        }
    }
} 