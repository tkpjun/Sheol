﻿module Common.Controllers {

    export class EntityManager {

        level: Dungeon.Level;
        currEntity: ObservableProperty<Entities.Entity>;
        currPath: ObservableProperty<Path>;
        characters: Entities.PlayerChar[];
        engine: ROT.Engine;
        player: Player;
        ai: BasicAI;

        constructor(level: Dungeon.Level) {
            this.level = level;
            this.currEntity = new ObservableProperty<Entities.Entity>(() => this.update());
            this.currPath = new ObservableProperty<Path>();
            this.engine = new ROT.Engine(this.level.scheduler);
            this.characters = new Array<Entities.PlayerChar>();
        }

        pause() {
            this.engine.lock();
        }

        start() {
            this.engine.start();
        }

        init(player: Player, ai: BasicAI) {
            this.ai = ai;
            this.player = player;
            var rooms = (<ROT.Map.Dungeon>this.level.map).getRooms()
            var room = rooms[0];
            var player1 = new Entities.PlayerChar("char1");
            player1.equipment.equipWeapon(Items.getWeapon(Items.Weapons.Mace));
            player1.currWeapon = player1.equipment.mainHand;
            player1.x = room.getCenter()[0];
            player1.y = room.getCenter()[1];
            this.characters.push(player1);
            this.level.scheduler.add(
                new ChangeProperty(this.currEntity, player1), true, 1);

            var player2 = new Entities.PlayerChar("char2");
            player2.equipment.equipWeapon(Items.getWeapon(Items.Weapons.Spear));
            player2.currWeapon = player2.equipment.mainHand;
            player2.x = room.getCenter()[0] + 1;
            player2.y = room.getCenter()[1];
            this.characters.push(player2);
            this.level.scheduler.add(
                new ChangeProperty(this.currEntity, player2), true, 1);

            this.level.entities.forEach(e => this.level.scheduler.add(
                new ChangeProperty(this.currEntity, e), true, 1.1));
            this.characters.forEach((c) => { this.level.entities.push(c) });
        }

        update() {
            this.engine.lock();
            var entity = this.currEntity.unwrap;

            var pollForAction = () => {
                this.planAction(entity);
                var action = entity.getAction();
                if (action) {
                    action();
                    //console.log(entity.x + "," + entity.y);
                }

                if (entity.hasTurn()) {
                    setTimeout(pollForAction, Settings.UpdateRate);
                }
                else {
                    entity.newTurn();

                    var unlock = () => { this.engine.unlock() };
                    setTimeout(unlock, Settings.UpdateRate * 4);
                }
            }
            pollForAction();           
        }

        kill(entity: IEntity) {
            this.level.entities.splice(this.level.entities.indexOf(entity), 1);
            var actor = this.level.scheduler._queue._events.filter(x => { 
                return x instanceof ChangeProperty
            }).filter(x => { 
                return x.target == entity
            })[0]
            this.level.scheduler.remove(actor);
            this.level.objects.push({
                name: entity.name + " corpse",
                isPassable: true,
                x: entity.x,
                y: entity.y,
                pick: (who: IEntity) => {
                    return who.name.substr(0, 1).toUpperCase() + who.name.substr(1) + " gives the " + entity.name + " corpse" + " a hearty stomp!";
                }
            });
        }

        planAction(entity: IEntity) {

            if (entity instanceof Entities.PlayerChar) {
                this.player.activate(<Entities.PlayerChar>entity);
            }
            else if (entity instanceof Entities.Enemy) {
                var enemy = <Entities.Enemy>entity;
                //enemy.addAction(() => { enemy._hasTurn = false; });
                this.ai.activate(enemy);
            }
        }
    }
} 