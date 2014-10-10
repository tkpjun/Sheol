module Rouge.Console.GameUI {

    export function getLeftBar(characters: Array<Entities.PlayerChar>): DrawMatrix {
        var p1 = characters[0];
        var p2 = characters[1];
        var w = Constants.LEFT_UI_WIDTH; //Limit for text wrapping
        var matrix = new DrawMatrix(1, 1, null, w - 2, 9);

        matrix.addString(0, 0, p1.name);
        matrix.addString(0, 2, "HP: " + p1.stats.hp + "/" + p1.stats.hpMax);
        matrix.addString(0, 3, "AP: " + p1.stats.ap + "/" + p1.stats.apMax);

        matrix.addString(0, 5, p2.name);
        matrix.addString(0, 7, "HP: " + p2.stats.hp + "/" + p2.stats.hpMax);
        matrix.addString(0, 8, "AP: " + p2.stats.ap + "/" + p2.stats.apMax);

        return matrix;
    }

    export function getRightBar(scheduler: ROT.Scheduler.Action, current: IEntity, seen: Array<IEntity>, baseTime?: number): DrawMatrix {
        var w = Constants.LEFT_UI_WIDTH;
        var wDisp = Constants.DISPLAY_WIDTH;
        var leftEdge = wDisp - w + 1;
        var matrix = new DrawMatrix(leftEdge, 1, null, w - 2, Constants.DISPLAY_HEIGHT - 2);
        if (!baseTime) baseTime = 0;

        var events = scheduler._queue._events;
        var times = scheduler._queue._eventTimes;
        var both = [];
        for (var i = 0; i < events.length; i++) {
            both.push({ event: events[i], time: times[i] });
        }
        both = both.filter(obj => {
            return obj.event instanceof Controllers.ChangeProperty &&
                seen.indexOf((<Controllers.ChangeProperty<IEntity>>obj.event).target) >= 0;
        }).map(obj => {
            return { entity: (<Controllers.ChangeProperty<IEntity>>obj.event).target, time: obj.time };
        }).sort((obj1, obj2) => {
            return obj1.time - obj2.time;
        });
        both.unshift({ entity: current, time: baseTime });

        for (var i = 0; i < both.length; i++) {
            matrix.addString(0, i * 3 + 1, both[i].entity.name, Constants.LEFT_UI_WIDTH - 6);
            matrix.addString(Constants.LEFT_UI_WIDTH - 5, i * 3, "---");
            matrix.addString(Constants.LEFT_UI_WIDTH - 5, i * 3 + 1, "|e|");
            matrix.addString(Constants.LEFT_UI_WIDTH - 5, i * 3 + 2, "---");
            if (both[i].time === 0) {
                matrix.addString(2, i * 3 + 2, "ready", null, "green");
            }
            else {
                matrix.addString(2, i * 3 + 2, (<number>both[i].time).toFixed(1) + "aut");
            }
        }

        return matrix;
    }

    export function getDPad(): DrawMatrix {
        var w = Constants.LEFT_UI_WIDTH;
        var hDisp = Constants.DISPLAY_HEIGHT;
        var hThis = 9;
        var matrix = new DrawMatrix(1, hDisp - hThis - 2, null, w - 2, hThis);

        matrix.addString(0, 0, "q--- w--- e---");
        matrix.addString(0, 1, "|  | |  | |  |");
        matrix.addString(0, 2, "---- ---- ----");
        matrix.addString(0, 3, "a--- s--- d---");
        matrix.addString(0, 4, "|  | |  | |  |");
        matrix.addString(0, 5, "---- ---- ----");
        matrix.addString(0, 6, "z--- x--- c---");
        matrix.addString(0, 7, "|  | |  | |  |");
        matrix.addString(0, 8, "---- ---- ----");

        return matrix;
    }
}