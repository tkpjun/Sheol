module Rouge.Console.GameUI {

    export function getLeftBar(characters: Array<Entities.PlayerChar>): DrawMatrix {
        var p1 = characters[0];
        var p2 = characters[1];
        var w = Constants.SIDEBAR_WIDTH; //Limit for text wrapping
        var matrix = new DrawMatrix(0, 0, null, w, 11);

        for (var i = 0; i < Constants.SIDEBAR_WIDTH; i++) {
            matrix.matrix[i][0] = { symbol: " ", bgColor: "midnightblue" }
        }
        matrix.addString(4, 0, "LEVEL:1", null, null, "midnightblue");

        matrix.addString(1, 2, p1.name);
        matrix.addString(1, 4, "HP: " + p1.stats.hp + "/" + p1.stats.hpMax);
        matrix.addString(1, 5, "AP: " + p1.stats.ap + "/" + p1.stats.apMax);

        matrix.addString(1, 7, p2.name);
        matrix.addString(1, 9, "HP: " + p2.stats.hp + "/" + p2.stats.hpMax);
        matrix.addString(1, 10, "AP: " + p2.stats.ap + "/" + p2.stats.apMax);

        return matrix;
    }

    export function getRightBar(scheduler: ROT.Scheduler.Action, current: Entities.Entity, seen: Array<IEntity>, baseTime?: number): DrawMatrix {
        var w = Constants.SIDEBAR_WIDTH;
        var wDisp = Constants.displayWidth;
        var leftEdge = wDisp - w;
        var matrix = new DrawMatrix(leftEdge, 0, null, w, Constants.DISPLAY_HEIGHT - 2);
        if (!baseTime) baseTime = 0;

        var events = scheduler._queue._events;
        var times = scheduler._queue._eventTimes;
        var both = [];
        for (var i = 0; i < events.length; i++) {
            both.push({ event: events[i], time: times[i] });
        }
        both = both.filter(obj => {
            return obj.event instanceof Controllers.ChangeProperty &&
                seen.indexOf((<Controllers.ChangeProperty<Entities.Entity>>obj.event).target) >= 0;
        }).map(obj => {
            return { entity: (<Controllers.ChangeProperty<Entities.Entity>>obj.event).target, time: obj.time };
        }).sort((obj1, obj2) => {
            return obj1.time - obj2.time;
        });
        both.unshift({ entity: current, time: baseTime });

        for (var i = 0; i < Constants.SIDEBAR_WIDTH; i++) {
            matrix.matrix[i][0] = { symbol: " ", bgColor: "midnightblue" }
        }
        matrix.addString(5, 0, "QUEUE", null, null, "midnightblue");
        for (var i = 0; i < both.length; i++) {
            matrix.addString(1, i * 3 + 2, both[i].entity.name, Constants.SIDEBAR_WIDTH - 6);
            matrix.addString(1, i * 3 + 3, "HP:" + both[i].entity.stats.hp + "/" + both[i].entity.stats.hpMax, Constants.SIDEBAR_WIDTH - 6);
            matrix.addString(Constants.SIDEBAR_WIDTH - 4, i * 3 + 1, "---");
            matrix.addString(Constants.SIDEBAR_WIDTH - 4, i * 3 + 2, "|e|");
            matrix.addString(Constants.SIDEBAR_WIDTH - 4, i * 3 + 3, "---");
            if (both[i].time === 0) {
                matrix.addString(3, i * 3 + 1, "ready", null, "green");
            }
            else {
                matrix.addString(2, i * 3 + 1, "+     tu");
                matrix.addString(3, i * 3 + 1, (<number>both[i].time).toFixed(2), null, "red");               
            }
        }

        return matrix;
    }

    export function getDPad(): DrawMatrix {
        var w = Constants.SIDEBAR_WIDTH;
        var hDisp = Constants.DISPLAY_HEIGHT;
        var hThis = 9;
        var matrix = new DrawMatrix(1, hDisp - hThis - Constants.BOTTOM_BAR_HEIGHT, null, w - 2, hThis);

        matrix.addString(0, 0, "q--- w--- e---");
        matrix.addString(0, 1, "|NW| | N| |NE |");
        matrix.addString(0, 2, "---- ---- ----");
        matrix.addString(0, 3, "a--- f--- d---");
        matrix.addString(0, 4, "|W | PICK | E|");
        matrix.addString(0, 5, "---- ---- ----");
        matrix.addString(0, 6, "z--- x--- c---");
        matrix.addString(0, 7, "|SW| |S | |SE|");
        matrix.addString(0, 8, "---- ---- ----");

        return matrix;
    }

    export function getBottomBar(): DrawMatrix {
        var matrix = new DrawMatrix(0,
            Constants.DISPLAY_HEIGHT - Constants.BOTTOM_BAR_HEIGHT,
            null,
            Constants.displayWidth,
            Constants.BOTTOM_BAR_HEIGHT);

        for (var i = 0; i < matrix.matrix.length; i++) {
            for (var j = 0; j < matrix.matrix[0].length; j++) {
                matrix.matrix[i][j] = { symbol: " ", bgColor: "midnightblue" };
            }
        }
        return matrix;
    }
}