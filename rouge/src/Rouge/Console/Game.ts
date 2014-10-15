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
            Rouge.Console.Control.init(this.gameScreen);

            var resize = () => {
                var size = this.display.computeFontSize(Number.MAX_VALUE, window.innerHeight);
                this.display.setOptions({ fontSize: size });

                while (this.display.computeFontSize(window.innerWidth, Number.MAX_VALUE) >= size) {
                    this.display.setOptions({ width: this.display.getOptions().width + 1 });
                }
                while (this.display.computeFontSize(window.innerWidth, Number.MAX_VALUE) < size) {
                    this.display.setOptions({ width: this.display.getOptions().width - 1 });
                }

                Constants.displayWidth = this.display.getOptions().width;
                this.gameScreen.camera.width = Constants.displayWidth - Constants.SIDEBAR_WIDTH * 2;
                this.screen.draw();
                console.log((window.innerWidth / window.innerHeight).toFixed(2));
                console.log(this.display.getOptions().width);
            }
            window.onresize = resize;
            resize();
        }

    }
}