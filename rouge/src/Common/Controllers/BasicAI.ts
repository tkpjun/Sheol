module Common.Controllers {

    export class BasicAI {
        char: Entities.Enemy;
        lvl: Dungeon.Level;
        state = States.Inactive;
        manager: EntityManager;
        con: IConsole;
        callback;

        constructor(console: IConsole, entityManager: EntityManager) {
            this.manager = entityManager;
            this.con = console;
        }

        activate(entity: Entities.Enemy) {
            if (this.state == States.Inactive) {
                this.char = entity;
                this.callback = (x, y) => {
                    return Controllers.isPassable(this.char, { x: x, y: y }, this.manager.level);
                }
                this.lvl = this.manager.level;
                this.state = States.Move;
                this.manager.currPath.unwrap = new AstarPath({ x: this.char.x, y: this.char.y }, null, this.char.stats.ap);

                if (!this.char.fov || this.char.state != Entities.EnemyState.Inattentive) {
                    this.updateFov();
                }
                var target = this.chooseTarget(this.findSeenEntities());
                if (target) {
                    //TODO
                    console.log(this.char.name + " is hunting " + target.name);
                    this.char.state = Entities.EnemyState.Hunting;
                }
                else if (this.char.state == Entities.EnemyState.Hunting) {
                    console.log(this.char.name + " is searching for something");
                    this.char.state = Entities.EnemyState.Awake
                }

                if (this.char.state == Entities.EnemyState.Hunting) {
                    this.moveTo(this.closestTileNextTo(target.x, target.y));
                }
                if (this.char.state == Entities.EnemyState.Awake) {
                    this.moveTo(this.randomMovableTile());
                }
                this.endTurn();
            }
        }

        private randomMovableTile(): IVector2 {
            var fov = new ROT.FOV.RecursiveShadowcasting((x, y) => { return lightPasses({ x: x, y: y }, this.lvl) }, { topology: 4 });
            var moves = Math.floor(this.char.stats.ap / 2);
            var possible = new Array<IVector2>();
            fov.compute180(this.char.x, this.char.y, moves, this.dirIntoNumber(this.char.dir), (x, y, r, visibility) => {
                possible.push({x:x, y:y});
            });
            possible.filter((cell) => { return this.callback(cell.x, cell.y) });
            return possible[ROT.RNG.getUniformInt(0, possible.length - 1)];
        }

        private closestTileNextTo(x: number, y: number): IVector2 {
            var cx = this.char.x;
            var cy = this.char.y;
            var tx = x;
            var ty = y;
            if (cx < x) tx = x - 1;
            if (cx > x) tx = x + 1;
            if (cy < y) ty = y - 1;
            if (cy > y) ty = y + 1;
            return {x:tx, y:ty};
        }

        private updateFov(char?) {
            if (!char) char = this.char;
            var level = this.lvl;
            var fov = new ROT.FOV.RecursiveShadowcasting((x, y) => { return lightPasses({ x: x, y: y }, level) }, {topology: 4});
            var seen = new Array<IVector2>();
            var res = {}; //Without this step the seen array has duplicates in it

            switch (this.char.state) {
                case Entities.EnemyState.Hunting:
                    fov.compute(char.x, char.y, 5, (x, y, r, visibility) => {
                        //seen.push({x:x, y:y});
                        res[x + "," + y] = x + "," + y;
                    });
                    break;
                default:
                    fov.compute90(char.x, char.y, 5, this.dirIntoNumber(this.char.dir), (x, y, r, visibility) => {
                        //seen.push({x:x, y:y});
                        res[x + "," + y] = x + "," + y;
                    });
                    break;
            }
            delete res[char.x + "," + char.y];
            for (var key in res) {
                var xy = key.split(",");
                seen.push({ x: xy[0], y: xy[1] });
            }
            this.char.fov = seen;
        }

        private findSeenEntities(): IEntity[] {          
            return this.lvl.entities.filter((e) => {
                return this.char.fov.some((value, index, array) => {
                    return value.x == e.x && value.y == e.y
                })
            });
        }

        private chooseTarget(seen: IEntity[]): IEntity {
            var players = seen.filter((e) => { return e instanceof Entities.PlayerChar });
            if (players.length > 0)
                return players[0];
            else
                return null;
        }

        private moveTo(target: IVector2) {
            var t = this;
            var m = this.manager;
            var path = m.currPath.unwrap;
            path.pointer = target;
            path.connect(this.callback);
            var e = this.char;

            function nextStep(i, last?, callback?) {
                return () => {
                    e.dir = Vec.sub(path.nodes[i], { x: e.x, y: e.y });
                    e.x = path.nodes[i].x;
                    e.y = path.nodes[i].y;
                    t.updateFov(e);
                    m.currPath.unwrap = path; //dumb way to redraw screen
                    if (last) {
                        var p = new AstarPath({ x: e.x, y: e.y }, target, e.stats.ap);
                        p.connect(callback);
                        m.currPath.unwrap = p;
                    }
                }
            }
            for (var i = 1; i < path.nodes.length; i++) {
                if (!(i + 1 < path.nodes.length)) {
                    this.char.addAction(nextStep(i, true, this.callback))
                }
                else
                    this.char.addAction(nextStep(i));
            }
        }

        private attackTo(x: number, y: number) {

        }

        private endTurn() {
            this.char.addAction(() => {
                this.char._hasTurn = false;
                this.state = States.Inactive;
                this.manager.currPath.unwrap = null;
            });
        }

        private dirIntoNumber(dir: IVector2): number {
            if (Vec.isEqual(dir, Vec.North)) return 0;
            else if (Vec.isEqual(dir, Vec.East)) return 2;
            else if (Vec.isEqual(dir, Vec.South)) return 4;
            else if (Vec.isEqual(dir, Vec.West)) return 6;
            else throw ("Unimplemented direction!");
        }
    }
} 