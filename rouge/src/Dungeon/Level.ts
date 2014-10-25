module Rouge.Dungeon {

    export class Level {

        map: ROT.IMap;
        entities: IEntity[];
        items: ItemObject[];
        scheduler: ROT.Scheduler.Action;

        constructor(type: MapTypes) {
            this.scheduler = new ROT.Scheduler.Action();
            this.map = createMap(type);
            this.entities = new Array<IEntity>();
            this.items = new Array<ItemObject>();
        }

    }
} 