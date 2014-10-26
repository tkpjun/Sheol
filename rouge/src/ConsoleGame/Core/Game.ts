module ConsoleGame.Core {

    export class Game {

        display: ROT.Display;
        screen;
        gameScreen: GameScreen;
        menuScreen: MainMenuScreen;      

        constructor() {
            
            this.display = new ROT.Display({ width: Settings.DisplayWidth, height: Settings.DisplayHeight });
            this.gameScreen = new GameScreen();
            this.gameScreen.nextFrame.attach(() => {
                this.draw(this.gameScreen.nextFrame.unwrap);
            });
            this.screen = this.gameScreen;
            Control.init(this);

            var resize = () => {
                var size = this.display.computeFontSize(Number.MAX_VALUE, window.innerHeight);
                this.display.setOptions({ fontSize: size });

                while (this.display.computeFontSize(window.innerWidth, Number.MAX_VALUE) >= size) {
                    this.display.setOptions({ width: this.display.getOptions().width + 1 });
                }
                while (this.display.computeFontSize(window.innerWidth, Number.MAX_VALUE) < size) {
                    this.display.setOptions({ width: this.display.getOptions().width - 1 });
                }

                Settings.DisplayWidth = this.display.getOptions().width;
                this.gameScreen.camera.width = Settings.DisplayWidth - Settings.SidebarWidth * 2;
                this.gameScreen.manager.changed.notify();
                console.log((window.innerWidth / window.innerHeight).toFixed(2));
                console.log(this.display.getOptions().width);
            }
            window.onresize = resize;
            resize();
        }

        draw(matrix: DrawMatrix) {
            this.display.clear();
            matrix.draw(this.display);
            //Eventual goal: the game logic should be a web worker, 
            //with control sending string messages of DOM events to it
            //and it sending JSON:ed DrawMatrixes to this
        }
    }
}

window.onload = () => {
    document.getElementById("content").appendChild(new ConsoleGame.Core.Game().display.getContainer());
};