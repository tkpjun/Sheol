module Common.Dungeon {

    export class Level {

        map: ROT.IMap;
        entities: IEntity[];
        objects: IObject[];
        scheduler: ROT.Scheduler.Action;

        constructor(type: MapTypes) {
            this.scheduler = new ROT.Scheduler.Action();
            this.map = createMap(type);
            this.entities = new Array<IEntity>();
            this.objects = new Array<IObject>();
        }

        kill(entity: IEntity) {
            this.entities.splice(this.entities.indexOf(entity));
            this.objects.push({
                name: entity.name + " corpse",
                isPassable: true,
                x: entity.x,
                y: entity.y,
                pick: (who: IEntity) => {
                    return who.name.substr(0, 1).toUpperCase() + who.name.substr(1) + " gives the " + entity.name + " corpse" + " a hearty stomp!";
                }
            });
        }
    }
} 