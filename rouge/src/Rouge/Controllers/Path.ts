module Rouge.Controllers {

    export class Path {

        _nodes: Array<ILocation>;
        _costs: Array<number>;
        _lengthInAP: number;
        owner: IEntity;
        pointer: ILocation;
        begin: ILocation;


        cost(): number {
            return this._costs.reduce((x, y) => x+y);
        }

        limitedNodes(): Array<ILocation> {
            if (this._lengthInAP) {
                var arr = new Array<ILocation>();
                var cost = 0;
                for (var i = 0; i < this._nodes.length; i++) {
                    if (cost + this._costs[i] > this._lengthInAP) break;

                    arr.push(this._nodes[i]);
                    cost += this._costs[i];
                }
                return arr;
            }
            else return this._nodes;
        }

        trim(): Path {
            this._nodes = this.limitedNodes();
            this._costs.length = this._nodes.length;
            this.pointer.x = this._nodes[this._nodes.length - 1].x;
            this.pointer.y = this._nodes[this._nodes.length - 1].y;
            return this;
        }

        updateCosts() {
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

    }
}