module Rouge.Console {

    export class Game {

        display: ROT.Display;
        screen;
        gameScreen: GameScreen;
        menuScreen: MainMenuScreen;      

        constructor() {
            this.display = new ROT.Display({ fontSize: 23, width: Constants.DISPLAY_WIDTH, height: Constants.DISPLAY_HEIGHT });
            this.gameScreen = new GameScreen(this.display);
            this.screen = this.gameScreen;
        }

    }
}