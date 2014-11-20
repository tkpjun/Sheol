module Common.Controllers {

    export class BasicAI {
        entity: Entities.Enemy;
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
                this.entity = entity;
                this.callback = (x, y) => {
                    return Controllers.isPassable(this.entity, { x: x, y: y }, this.manager.level);
                }
                this.lvl = this.manager.level;
                this.state = States.Move;
                this.manager.currPath.unwrap = new AstarPath({ x: this.entity.x, y: this.entity.y }, null, this.entity.stats.ap);

                var target = this.chooseTarget(this.findSeenEntities());
                if (target) {
                    //TODO
                    console.log("Found target: " + target.name);
                    this.endTurn();
                }
                else {
                    var loc = Vec.add({ x: this.entity.x, y: this.entity.y }, Vec.mul(this.entity.dir, 5));
                    this.moveTo(loc);
                    this.endTurn();
                }
            }
        }

        findSeenEntities(): IEntity[] {
            var level = this.lvl;
            var fov = new ROT.FOV.RecursiveShadowcasting((x, y) => { return lightPasses({ x: x, y: y }, level) });
            var seen = new Array<IVector2>();
            fov.compute90(this.entity.x, this.entity.y, 8, 6, (x, y, r, visibility) => {
                seen.push({x:x, y:y});
            });
            return this.lvl.entities.filter((e) => {
                return seen.some((value, index, array) => {
                    return value.x == e.x && value.y == e.y
                })
            });
        }

        chooseTarget(seen: IEntity[]): IEntity {
            var players = seen.filter((e) => { return e instanceof Entities.PlayerChar });
            if (players.length > 0)
                return players[0];
            else
                return null;
        }

        moveTo(target: IVector2) {
            var m = this.manager;
            var path = m.currPath.unwrap;
            path.pointer = target;
            path.connect(this.callback);
            var e = this.entity;

            function nextStep(i, last?, callback?) {
                return () => {
                    e.dir = Vec.sub(path.nodes[i], { x: e.x, y: e.y });
                    e.x = path.nodes[i].x;
                    e.y = path.nodes[i].y;
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
                    this.entity.addAction(nextStep(i, true, this.callback))
                }
                else
                    this.entity.addAction(nextStep(i));
            }
        }

        attackTo(x: number, y: number) {

        }

        private endTurn() {
            this.entity.addAction(() => {
                this.entity._hasTurn = false;
                this.state = States.Inactive;
                this.manager.currPath.unwrap = null;
            });
        }
    }
} 