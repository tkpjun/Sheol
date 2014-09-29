module Rouge.Controllers.Player {

    var _canvas;
    var _lastDownTarget;
    var _char: Entities.PlayerChar;
    var _map: ROT.IMap;
    var _active = false;

    export function init() {

        _canvas = document.getElementsByTagName("canvas")[0];

        document.addEventListener("mousedown", (event) => {
            _lastDownTarget = event.target;
        }, false);

        document.addEventListener("keydown", (event) => {
            if (_lastDownTarget != _canvas) return;

            var code = event.keyCode;
            var vk;
            for (var name in ROT) {
                if (ROT[name] == code && name.indexOf("VK_") == 0) {
                    vk = name;
                    break;
                }
            }
            update(vk);
        }, false);

        /*document.addEventListener("keypress", (event) => {
            if (lastDownTarget != canvas) return;

            var code = event.charCode;
            var ch = String.fromCharCode(code);

            //console.log("Keypress: char is " + ch);
        }, false);*/
    };

    export function activate(char: Entities.PlayerChar, map: ROT.IMap) {
        if (!_active) {
            _char = char;
            _map = map;
            _active = true;
        }
    }

    function update(key) {
        if (!_active) {
            return;
        }

        switch (key) {
            case "VK_Q":
                tryMove(Direction.NORTHWEST);
                break;
            case "VK_W":
                tryMove(Direction.NORTH);
                break;
            case "VK_E":
                tryMove(Direction.NORTHEAST);
                break;
            case "VK_A":
                tryMove(Direction.WEST);
                break;
            case "VK_D":
                tryMove(Direction.EAST);
                break;
            case "VK_Z":
                tryMove(Direction.SOUTHWEST);
                break;
            case "VK_X":
                tryMove(Direction.SOUTH);
                break;
            case "VK_C":
                tryMove(Direction.SOUTHEAST);
                break;
            default:
                break;
        }

        _active = false;
    }

    function tryMove(dir: Direction) {
        var location: ILocation;
        switch (dir) {
            case Direction.NORTHWEST:
                location = { x: _char.x - 1, y: _char.y - 1 };
                break;
            case Direction.NORTH:
                location = { x: _char.x, y: _char.y - 1 };
                break;
            case Direction.NORTHEAST:
                location = { x: _char.x + 1, y: _char.y - 1 };
                break;
            case Direction.WEST:
                location = { x: _char.x - 1, y: _char.y };
                break;
            case Direction.EAST:
                location = { x: _char.x + 1, y: _char.y };
                break;
            case Direction.SOUTHWEST:
                location = { x: _char.x - 1, y: _char.y + 1 };
                break;
            case Direction.SOUTH:
                location = { x: _char.x, y: _char.y + 1 };
                break;
            case Direction.SOUTHEAST:
                location = { x: _char.x + 1, y: _char.y + 1 };
                break;
        }

        if (isPassable(location, _map)) {
            _char.nextAction = () => {
                _char.x = location.x;
                _char.y = location.y;
                if (dir == Direction.NORTH || Direction.SOUTH || Direction.WEST || Direction.EAST) {
                    _char.stats.ap -= 2;
                }
                else {
                    _char.stats.ap -= 3;
                }
            }
        }
        else {
            console.log("not passable");
            return;
        }
    }
} 