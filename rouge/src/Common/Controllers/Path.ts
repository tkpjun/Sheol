module Common.Controllers {

    export class Path {

        nodes: Array<IVector2>;
        protected costs: Array<number>;
        protected lengthInAP: number;
        pointer: IVector2;
        begin: IVector2;

        constructor() {
            this.nodes = new Array<IVector2>();
            this.costs = new Array<number>();
            this.costs.push(0);
        }

        cost(): number {
            return this.costs.reduce((x, y) => x+y);
        }

        connect(passableFn: (x: number, y: number) => boolean) {
            throw ("Abstract!");
        }

        disconnect() {
            this.nodes.length = 1;
            this.costs.length = 1;
        }

        isConnected(): boolean {
            return this.nodes.length > 1;
        }

        limitedNodes(ap?: number): Array<IVector2> {
            var newAP;
            if (ap) newAP = ap;
            else newAP = this.lengthInAP;

            if (newAP || newAP == 0) {
                var arr = new Array<IVector2>();
                var cost = 0;
                for (var i = 0; i < this.nodes.length; i++) {
                    if (cost + this.costs[i] > newAP) {
                        break;
                    }

                    arr.push(this.nodes[i]);
                    cost += this.costs[i];
                }
                return arr;
            }
            else return this.nodes;
        }

        trim(ap?: number): Path {
            this.nodes = this.limitedNodes(ap);
            this.costs.length = this.nodes.length;
            if (this.nodes.length > 0) {
                this.pointer.x = this.nodes[this.nodes.length - 1].x;
                this.pointer.y = this.nodes[this.nodes.length - 1].y;
            }
            else {
                this.nodes[0] = this.begin;
                this.costs[0] = 0;
                this.pointer = this.begin;
            }
            return this;
        }

        updateCosts() {
            var arr = this.nodes;
            this.costs = new Array<number>();
            this.costs.push(0);
            for (var i = 0; i < arr.length - 1; i++) {
                if (!arr[i + 1]) break;

                this.costs.push(this.calculateCost(arr[i], arr[i + 1]));
            }
        }

        private calculateCost(n1: IVector2, n2: IVector2): number {
            if (diagonalNbors(n1, n2)) {
                return Settings.MoveCost + 1;
            }
            else return Settings.MoveCost;
        }

    }
}