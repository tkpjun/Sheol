module Rouge.Console.GameUI {

    export function getLeftBar(characters: Array<Entities.PlayerChar>): DrawMatrix {
        var p1 = characters[0];
        var p2 = characters[1];
        var w = Constants.SidebarWidth; //Limit for text wrapping
        var matrix = new DrawMatrix(0, 0, null, w, 11);

        for (var i = 0; i < Constants.SidebarWidth; i++) {
            matrix.matrix[i][0] = { symbol: " ", bgColor: "midnightblue" }
        }
        matrix.addString(4, 0, "LEVEL:1");

        matrix.addString(1, 2, p1.name);
        matrix.addString(1, 4, "HP: " + p1.stats.hp + "/" + p1.stats.hpMax);
        matrix.addString(1, 5, "AP: " + p1.stats.ap + "/" + p1.stats.apMax);

        matrix.addString(1, 7, p2.name);
        matrix.addString(1, 9, "HP: " + p2.stats.hp + "/" + p2.stats.hpMax);
        matrix.addString(1, 10, "AP: " + p2.stats.ap + "/" + p2.stats.apMax);

        return matrix;
    }

    export function getRightBar(scheduler: ROT.Scheduler.Action, current: Entities.Entity, seen: Array<IEntity>, baseTime?: number): DrawMatrix {
        var w = Constants.SidebarWidth;
        var wDisp = Constants.DisplayWidth;
        var leftEdge = wDisp - w;
        var matrix = new DrawMatrix(leftEdge, 0, null, w, Constants.DisplayHeight - 2);
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

        for (var i = 0; i < Constants.SidebarWidth; i++) {
            matrix.matrix[i][0] = { symbol: " ", bgColor: "midnightblue" }
        }
        matrix.addString(5, 0, "QUEUE");
        for (var i = 0; i < both.length; i++) {
            var drawable = getDrawable(both[i].entity);
            matrix.addString(1, i * 3 + 3, both[i].entity.name, Constants.SidebarWidth - 6);
            matrix.addString(1, i * 3 + 4, "HP:" + both[i].entity.stats.hp + "/" + both[i].entity.stats.hpMax, Constants.SidebarWidth - 6);
            matrix.addString(Constants.SidebarWidth - 4, i * 3 + 2, "---");
            matrix.addString(Constants.SidebarWidth - 4, i * 3 + 3, "| |");
            matrix.addString(Constants.SidebarWidth - 3, i * 3 + 3, drawable.symbol, null, drawable.color);
            matrix.addString(Constants.SidebarWidth - 4, i * 3 + 4, "---");
            if (both[i].time === 0) {
                matrix.addString(1, i * 3 + 2, "-- ready --", null, "green");
            }
            else {
                matrix.addString(1, i * 3 + 2, "- +" + (<number>both[i].time).toFixed(2) + "tu -", null, "red");           
            }
        }

        return matrix;
    }

    export function getDPad(): DrawMatrix {
        var w = Constants.SidebarWidth;
        var hDisp = Constants.DisplayHeight;
        var hThis = 9;
        var matrix = new DrawMatrix(1, hDisp - hThis - Constants.BottomBarHeight - 1, null, w - 2, hThis);

        matrix.addString(0, 0, "q--- w--- e---");
        matrix.addString(0, 1, "|NW| | N| |NE|");
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
            Constants.DisplayHeight - Constants.BottomBarHeight,
            null,
            Constants.DisplayWidth,
            Constants.BottomBarHeight);

        for (var i = 0; i < matrix.matrix.length; i++) {
            for (var j = 0; j < matrix.matrix[0].length; j++) {
                matrix.matrix[i][j] = { symbol: " ", bgColor: "midnightblue" };
            }
        }
        matrix.addString(1, 0, " SWITCH ", null, null, "royalblue");
        matrix.addString(11, 0, " ATTACK ", null, null, "royalblue");
        matrix.addString(21, 0, " SPECIAL ", null, null, "royalblue");
        //matrix.addString(32, 0, " ?????? ", null, null, "royalblue");

        matrix.addString(Constants.DisplayWidth - 41, 0, "CON:");
        matrix.addString(Constants.DisplayWidth - 37, 0, " - ", null, null, "royalblue");
        matrix.addString(Constants.DisplayWidth - 33, 0, " + ", null, null, "royalblue");
        matrix.addString(Constants.DisplayWidth - 29, 0, " v ", null, null, "royalblue");
        matrix.addString(Constants.DisplayWidth - 25, 0, " ^ ", null, null, "royalblue");
        matrix.addString(Constants.DisplayWidth - 20, 0, "INVENTORY", null, null, "royalblue");
        matrix.addString(Constants.DisplayWidth - 9, 0, "  MENU  ", null, null, "royalblue");

        return matrix;
    }
}