module Rouge.Console {

    export class Game {

        display: ROT.Display;
        screen;
        gameScreen: GameScreen;
        menuScreen: MainMenuScreen;      

        constructor() { 

            this.display = new ROT.Display({ width: Constants.displayWidth, height: Constants.DISPLAY_HEIGHT });
            this.gameScreen = new GameScreen(this.display);
            this.screen = this.gameScreen;

            var resize = () => {
                var size = this.display.computeFontSize(Number.MAX_VALUE, window.innerHeight);
                this.display.setOptions({ fontSize: size });
                //console.log(this.display.getOptions().width);
                while (this.display.computeFontSize(window.innerWidth, Number.MAX_VALUE) > size) {
                    this.display.setOptions({ width: this.display.getOptions().width + 1 });
                }
                while (this.display.computeFontSize(window.innerWidth, Number.MAX_VALUE) < size) {
                    this.display.setOptions({ width: this.display.getOptions().width - 1 });
                }
                //console.log(this.display.getOptions().width);
                Constants.displayWidth = this.display.getOptions().width;
                this.gameScreen.camera.width = Constants.displayWidth - Constants.LEFT_UI_WIDTH * 2;
                this.screen.draw();
            }
            window.onresize = resize;
            resize();
        }

    }
}