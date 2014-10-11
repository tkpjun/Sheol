module Rouge.Controllers {

    export class AutoPath {

        private _nodes: Array<ILocation>;
        private _costs: Array<number>;
        private _astar: ROT.IPath;

        constructor(from: ILocation, to: ILocation, level: Dungeon.Level) {
            this._nodes = new Array<ILocation>();
            this._astar = new ROT.Path.AStar(to.x, to.y, (x, y) => {
                isPassable({ x: x, y: y }, level);
            }, { topology: 4 });
            this._astar.compute(from.x, from.y, (x, y) => {
                this._nodes.push({ x: x, y: y });
            });
            this.straightenPath(level);
            this.calculateCosts();
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

        private calculateCosts() {
            var arr = this._nodes;
            this._costs = new Array<number>();
            this._costs.push(0);
            for (var i = 0; i < arr.length - 1; i++) {
                if (!arr[i + 1]) break;

                this._costs.push(this.calculateCost(arr[i], arr[i + 1]));
                /*
                if (Math.abs(arr[i].x - arr[i + 1].x) == 1 &&
                    Math.abs(arr[i].y - arr[i + 1].y) == 1) {
                    this.costs.push(3);
                }
                else this.costs.push(2);
*/
            }
        }

        private calculateCost(n1: ILocation, n2: ILocation): number {
            if (Math.abs(n1.x - n2.x) == 1 &&
                Math.abs(n1.y - n2.y) == 1) {
                return 3;
            }
            else return 2;
        }

        private straightenPath(level: Dungeon.Level) {
            var arr = this._nodes;
            for (var i = 0; i < arr.length - 2; i++) {
                if (!arr[i + 2]) break;

                if (Math.abs(arr[i].x - arr[i + 2].x) == 1 &&
                    Math.abs(arr[i].y - arr[i + 2].y) == 1) {
                    if (isPassable(this.getFourth(arr[i], arr[i+1], arr[i+2]) , level)) {
                        arr.splice(i + 1);
                    }
                }
            }
        }

        private getFourth(n1: ILocation, n2: ILocation, n3: ILocation): ILocation {
            var x, y;
            if (n2.x == n1.x) {
                x = n3.x;
            }
            else x = n1.x;

            if (n2.y == n1.y) {
                y = n3.y;
            }
            else y = n1.y;
            return { x: x, y: y };
        }
    }
}