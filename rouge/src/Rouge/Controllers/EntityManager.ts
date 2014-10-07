module Rouge.Controllers {

    export class EntityManager {

        level: Dungeon.Level;
        currEntity: ObservableProperty<Entities.Entity>;
        characters: Entities.PlayerChar[];
        engine: ROT.Engine;
        changed: IObservable;

        constructor(level: Dungeon.Level) {
            this.level = level;
            this.currEntity = new ObservableProperty(null);
            this.currEntity.attach({ update: () => this.update() });
            this.engine = new ROT.Engine(this.level.scheduler);
            this.changed = new Observable();
            this.characters = new Array<Entities.PlayerChar>();

            this.start();
        }

        pause() {
            this.engine.lock();
        }

        private start() {
            var room = (<ROT.Map.Dungeon>this.level.map).getRooms()[0];
            var player1 = new Entities.PlayerChar("char1");
            player1.x = room.getCenter()[0];
            player1.y = room.getCenter()[1];
            this.characters.push(player1);
            this.level.scheduler.add(
                new Controllers.ChangeProperty(this.currEntity, player1), true);

            var player2 = new Entities.PlayerChar("char2");
            player2.x = room.getCenter()[0] + 1;
            player2.y = room.getCenter()[1];
            this.characters.push(player2);
            this.level.scheduler.add(
                new Controllers.ChangeProperty(this.currEntity, player2), true);

            var enemy = new Entities.Enemy("enemy");
            var room2 = (<ROT.Map.Dungeon>this.level.map).getRooms()[1];
            enemy.x = room2.getCenter()[0];
            enemy.y = room2.getCenter()[1];
            this.level.entities.push(enemy);
            this.level.scheduler.add(new Controllers.ChangeProperty(this.currEntity, enemy), true);

            this.engine.start();
        }

        update() {
            this.engine.lock();
            var entity = this.currEntity.property;

            var pollForAction = () => {
                planAction(entity, this.level);
                var action = entity.nextAction;
                if (action) {
                    action();
                    entity.nextAction = undefined;
                    this.changed.notify();
                }

                if (entity.hasAP() && entity.didntEnd()) {
                    setTimeout(pollForAction, Constants.UPDATE_RATE);
                }
                else {
                    this.level.scheduler.setDuration(1 - (entity.stats.ap / entity.stats.apMax));
                    console.log("Time until next turn: " + (1 - (entity.stats.ap / entity.stats.apMax)).toFixed(2));
                    entity.newTurn();
                    this.changed.notify();
                    this.engine.unlock();
                }
            }
            //entity.newTurn();
            pollForAction();           
        }
    }
} 