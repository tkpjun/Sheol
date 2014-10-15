module Rouge.Console.Control {

    var lastDownTarget;

    export function init(screen: GameScreen) {

        var display = screen.display;
        var canvas = display.getContainer();
        var camera = screen.camera;

        document.addEventListener("mousedown", (event) => {
            lastDownTarget = event.target;
            if (lastDownTarget != canvas) return;

            var pos = display.eventToPosition(event);
            var x = pos[0];
            var y = pos[1];
            if (x >= 0 && y >= 0) {
                //console.log(x + "," + y);
                if (x >= camera.xOffset && x < camera.xOffset + camera.width &&
                    y >= camera.yOffset && y < camera.yOffset + camera.height) {
                    Controllers.Player.updateClick(x - camera.xOffset + camera.x, y - camera.yOffset + camera.y, screen.manager);
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