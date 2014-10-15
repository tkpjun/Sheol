module Rouge.Controllers {

    export class Path {

        private _nodes: Array<ILocation>;
        private _costs: Array<number>;
        private _astar: ROT.IPath;
        owner: IEntity;
        pointer: ILocation;
        begin: ILocation;

        constructor(passableFn: (x: number, y: number, from?: ILocation) => boolean, from: ILocation, to?: ILocation) {
            this._nodes = new Array<ILocation>();
            this._costs = new Array<number>();
            this.begin = from;

            if (to) {
                this._astar = new ROT.Path.AStar(to.x, to.y, passableFn, { topology: 4 });
                this._astar.compute(from.x, from.y, (x, y) => {
                    this._nodes.push({ x: x, y: y });
                });
                //this.fixPath(passableFn);
                this.calculateCosts();
                this.pointer = to;
            }
            else {
                this._nodes.push(from);
                this._costs.push(0);
                this.pointer = from;
            }

            if (!passableFn(this.pointer.x, this.pointer.y)) {
                this._nodes.pop();
                this._costs.pop();
            }
        }

        cost(): number {
            return this._costs.reduce((x, y) => x+y);
        }

        nodes(maxCost?: number): Array<ILocation> {
            if (maxCost) {
                var arr = new Array<ILocation>();
                var cost = 0;
                for (var i = 0; i < this._nodes.length; i++) {
                    if (cost + this._costs[i] > maxCost) break;

                    arr.push(this._nodes[i]);
                    cost += this._costs[i];
                }
                return arr;
            }
            else return this._nodes;
        }

        trim(maxCost: number): Path {
            this._nodes = this.nodes(maxCost);
            this._costs.length = this._nodes.length;
            this.pointer.x = this._nodes[this._nodes.length - 1].x;
            this.pointer.y = this._nodes[this._nodes.length - 1].y;
            return this;
        }

        /*
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
        }*/

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
            if (diagonalNbors(n1, n2)) {
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
            /*
            for (var i = 0; i < arr.length - 3; i++) {
                if (!arr[i + 2]) break;

                if (diagonalNbors(arr[i], arr[i+2])) {
                    var x, y;
                    if (arr[i + 1].x == arr[i].x)
                        x = arr[i + 2].x;
                    else
                        x = arr[i].x;
                    if (arr[i + 1].y == arr[i].y)
                        y = arr[i + 2].y;
                    else
                        y = arr[i].y;
                    if (passableFn(x, y)) {
                        this._nodes.splice(i + 1);
                        i -= 1;
                    }
                }
            }
            //assumes the preceding for loop has run
            for (var i = 0; i < arr.length - 4; i++) {
                if (!arr[i + 3]) break;
                if (diagonal(arr[i], arr[i + 3]) && Math.abs(arr[i].x - arr[i+3].x) == 2) {
                    var x, y;
                    x = (arr[i + 3].x + arr[i].x) / 2;
                    y = (arr[i + 3].y + arr[i].y) / 2;
                    if (passableFn(x, y, { x: arr[i].x, y: arr[i].y }) && passableFn(arr[i + 3].x, arr[i + 3].y, { x: x, y: y })) {
                        this._nodes.splice(i + 1, 2, { x: x, y: y });
                    }
                }

                if (!arr[i + 4]) break;
                if (diagonal(arr[i], arr[i + 4]) && Math.abs(arr[i].x - arr[i + 4].x) == 3) {
                    var x1, y1, x2, y2;
                    if (arr[i + 4].x > arr[i].x)
                        x1 = arr[i].x + 1;
                    else
                        x1 = arr[i].x - 1;
                    if (arr[i + 4].y > arr[i].y)
                        y1 = arr[i].y + 1;
                    else
                        y1 = arr[i].y - 1;
                    x2 = (arr[i + 4].x + x1) / 2;
                    y2 = (arr[i + 4].y + y1) / 2;
                    if (passableFn(x1, y1, { x: arr[i].x, y: arr[i].y }) &&
                        passableFn(y1, y2, { x: x1, y: y1 }) &&
                        passableFn(arr[i + 4].x, arr[i + 4].y, { x: x2, y: y2 })) {
                        this._nodes.splice(i + 1, 3, { x: x1, y: y1 }, { x: x2, y: y2 });
                    }
                }
            }*/
        }

    }
}