module Rouge.Controllers {

    export class Path {

        private _nodes: Array<ILocation>;
        private _costs: Array<number>;
        private _astar: ROT.IPath;
        pointer: ILocation;

        constructor(passableFn: (x: number, y: number, from?: ILocation) => boolean, from: ILocation, to?: ILocation) {
            this._nodes = new Array<ILocation>();
            this._costs = new Array<number>();

            if (to) {
                this._astar = new ROT.Path.AStar(to.x, to.y, passableFn, { topology: 8 });
                this._astar.compute(from.x, from.y, (x, y) => {
                    this._nodes.push({ x: x, y: y });
                });
                this.fixPath(passableFn);
                this.calculateCosts();
                this.pointer = to;
            }
            else {
                this._nodes.push(from);
                this._costs.push(0);
                this.pointer = from;
            }
        }

        nodes(maxCost: number): Array<ILocation> {
            var arr = new Array<ILocation>();
            var cost = 0;
            for (var i = 0; i < this._nodes.length - 1; i++) {
                if (cost > maxCost) break;

                arr.push(this._nodes[i]);
                cost += this._costs[i];
            }
            return arr;
        }

        movePointer(dir: Direction) {
            switch (dir) {
                case Direction.NORTHWEST:
                    this.pointer.y -= 1;
                    this.pointer.x -= 1;
                    break;
                case Direction.NORTH:
                    this.pointer.y -= 1;
                    break;
                case Direction.NORTHEAST:
                    this.pointer.y -= 1;
                    this.pointer.x += 1;
                    break;
                case Direction.WEST:
                    this.pointer.x -= 1;
                    break;
                case Direction.EAST:
                    this.pointer.x += 1;
                    break;
                case Direction.SOUTHWEST:
                    this.pointer.y += 1;
                    this.pointer.x -= 1;
                    break;
                case Direction.SOUTH:
                    this.pointer.y += 1;
                    break;
                case Direction.SOUTHEAST:
                    this.pointer.y += 1;
                    this.pointer.x += 1;
                    break;
            }

            throw ("TODO");
        }

        private calculateCosts() {
            var arr = this._nodes;
            this._costs = new Array<number>();
            this._costs.push(0);
            for (var i = 0; i < arr.length - 1; i++) {
                if (!arr[i + 1]) break;

                this._costs.push(this.calculateCost(arr[i], arr[i + 1]));
            }
        }

        private calculateCost(n1: ILocation, n2: ILocation): number {
            if (Math.abs(n1.x - n2.x) == 1 &&
                Math.abs(n1.y - n2.y) == 1) {
                return 3;
            }
            else return 2;
        }

        private fixPath(passableFn: (x: number, y: number, from?: ILocation) => {}) {
            var arr = this._nodes;
            for (var i = 0; i < arr.length - 2; i++) {          
                if (!arr[i + 1]) break;

                if (!passableFn(arr[i + 1].x, arr[i + 1].y, arr[i])) {
                    if (passableFn(arr[i].x, arr[i + 1].y)) {
                        this._nodes.splice(i + 1, 0, { x: arr[i].x, y: arr[i + 1].y });
                    }
                    else {
                        this._nodes.splice(i + 1, 0, { x: arr[i+1].x, y: arr[i].y });
                    }
                }
            }
        }

    }
}