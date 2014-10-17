module Rouge.Console.Control {

    var lastDownTarget;
    var lastMouseX = 0;
    var lastMouseY = 0;
    var mouseDown = false;

    export function init(screen: GameScreen) {

        var display = screen.display;
        var canvas = display.getContainer();
        var camera = screen.camera;

        document.addEventListener("mousedown", (event) => {
            mouseDown = true;
            lastDownTarget = event.target;
            if (lastDownTarget != canvas) return;

            var pos = display.eventToPosition(event);
            var x = pos[0];
            var y = pos[1];
            if (x >= 0 && y >= 1) {
                //console.log(x + "," + y);
                if (x >= camera.xOffset && x < camera.xOffset + camera.width &&
                    y >= camera.yOffset && y < camera.yOffset + camera.height) {
                    Controllers.Player.updateClick(x - camera.xOffset + camera.x, y - camera.yOffset + camera.y);
                }
            }
        }, false);

        document.addEventListener("mouseup", (event) => {
            mouseDown = false;
        }, false);

        document.addEventListener("mousemove", (event) => {
            if (lastDownTarget != canvas) return;
            if (!mouseDown) return;
            if (Math.abs(event.x - lastMouseX) < 5 &&
                Math.abs(event.y - lastMouseY) < 8) return;

            //console.log(event.x +","+ event.y)
            lastMouseX = event.x;
            lastMouseY = event.y;

            var pos = display.eventToPosition(event);
            var x = pos[0];
            var y = pos[1];
            if (x >= 0 && y >= 1) {
                if (x >= camera.xOffset && x < camera.xOffset + camera.width &&
                    y >= camera.yOffset && y < camera.yOffset + camera.height) {
                    Controllers.Player.updateMousemove(x - camera.xOffset + camera.x, y - camera.yOffset + camera.y);
                }
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
            Controllers.Player.update(vk);
        }, false);

        /*document.addEventListener("keypress", (event) => {
            if (lastDownTarget != canvas) return;

            var code = event.charCode;
            var ch = String.fromCharCode(code);

            //console.log("Keypress: char is " + ch);
        }, false);*/
    };
} 