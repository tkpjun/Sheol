module Common.Controllers {

    export class Path {

        _nodes: Array<IVector2>;
        _costs: Array<number>;
        _lengthInAP: number;
        pointer: IVector2;
        begin: IVector2;

        constructor() {
            this._nodes = new Array<IVector2>();
            this._costs = new Array<number>();
            this._costs.push(0);
        }

        cost(): number {
            return this._costs.reduce((x, y) => x+y);
        }

        connect(passableFn: (x: number, y: number) => boolean) {
            throw ("Abstract!");
        }

        disconnect() {
            this._nodes.length = 1;
            this._costs.length = 1;
        }

        isConnected(): boolean {
            return this._nodes.length > 1;
        }

        limitedNodes(): Array<IVector2> {
            if (this._lengthInAP) {
                var arr = new Array<IVector2>();
                var cost = 0;
                for (var i = 0; i < this._nodes.length; i++) {
                    if (cost + this._costs[i] > this._lengthInAP) {
                        break;
                    }

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
            if (this._nodes.length > 0) {
                this.pointer.x = this._nodes[this._nodes.length - 1].x;
                this.pointer.y = this._nodes[this._nodes.length - 1].y;
            }
            else {
                this._nodes[0] = this.begin;
                this._costs[0] = 0;
                this.pointer.x = this.begin.x;
                this.pointer.y = this.begin.y;
            }
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

        private calculateCost(n1: IVector2, n2: IVector2): number {
            if (diagonalNbors(n1, n2)) {
                return 3;
            }
            else return 2;
        }

    }
}