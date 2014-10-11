module Rouge.Controllers {

    export class PathBuilder {

        private _nodes: Array<ILocation>;
        private _costs: Array<number>;
        private max: number;
        pointer: ILocation;

        constructor(from: ILocation, maxCost: number) {
            this.max = maxCost;
            this._nodes = new Array<ILocation>();
            this._costs = new Array<number>();
            this._nodes.push(from);
            this._costs.push(0);
            this.pointer = from;
        }

        private calculateCost(n1: ILocation, n2: ILocation): number {
            if (Math.abs(n1.x - n2.x) == 1 &&
                Math.abs(n1.y - n2.y) == 1) {
                return 3;
            }
            else return 2;
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

            throw("TODO");
        }
    }
}