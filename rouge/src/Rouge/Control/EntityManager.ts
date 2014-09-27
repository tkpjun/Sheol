module Rouge.Control {

    export class EntityManager {

        level: Dungeon.Level;
        currEntity: ObservableProperty<IEntity>;
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

        start() {
            var room = (<ROT.Map.Dungeon>this.level.map).getRooms()[0];
            var player1 = new Entities.PlayerChar();
            player1.x = room.getCenter()[0];
            player1.y = room.getCenter()[1];
            this.characters.push(player1);
            this.level.scheduler.add(
                new Control.ChangeProperty(this.currEntity, player1), true);


            this.engine.start();
        }

        private update() {
            this.engine.lock();

            /*
            var entity = this.currEntity.property;
            while (entity.hasAP) {
                planAction(entity, this.level);
                var action = entity.nextAction;
                if (action != null) {
                    action();
                    this.changed.notify();
                }
            }
*/

            this.changed.notify();
            this.level.scheduler.setDuration(1);
            //setTimeout(this.engine.unlock(), 100);
        }
    }
} 