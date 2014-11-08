module AsciiGame.Core.Control {

    var lastDownTarget;
    var lastMouseX = 0;
    var lastMouseY = 0;
    var mouseDown = false;

    export function init(game: Game) {

        var display = game.display;
        var canvas = display.getContainer();

        document.addEventListener("mousedown", (event) => {
            mouseDown = true;
            lastDownTarget = event.target;
            if (lastDownTarget != canvas) return;

            var pos = display.eventToPosition(event);
            game.gameScreen.acceptMousedown(pos[0], pos[1]);
            
        }, false);

        document.addEventListener("mouseup", (event) => {
            mouseDown = false;
            var pos = display.eventToPosition(event);
            game.gameScreen.acceptMouseup(pos[0], pos[1]);
        }, false);

        document.addEventListener("mousemove", (event) => {
            if (lastDownTarget != canvas) return;
            if (Math.abs(event.x - lastMouseX) < 5 &&
                Math.abs(event.y - lastMouseY) < 8) return;

            //ConsoleGame.log(event.x +","+ event.y)
            lastMouseX = event.x;
            lastMouseY = event.y;

            var pos = display.eventToPosition(event);            
            if (mouseDown) {
                game.gameScreen.acceptMousedrag(pos[0], pos[1]);
            }
            else {
                game.gameScreen.acceptMousemove(pos[0], pos[1]);
            }           
        }, false);

        document.addEventListener("keydown", (event) => {
            if (lastDownTarget != canvas) return;

            var code = event.keyCode;
            var vk;
            for (var name in ROT) {
                if (ROT[name] == code && name.indexOf("VK_") == 0) {
                    vk = name;
                    break;
                }
            }
            game.gameScreen.acceptKeydown(vk);
        }, false);

        /*document.addEventListener("keypress", (event) => {
            if (lastDownTarget != canvas) return;

            var code = event.charCode;
            var ch = String.fromCharCode(code);

            //ConsoleGame.log("Keypress: char is " + ch);
        }, false);*/
    };
} 