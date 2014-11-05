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

    }
} 