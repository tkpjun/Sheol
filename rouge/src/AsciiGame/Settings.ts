module AsciiGame {

    export class Settings {

        private static _displayWidth = 92;

        static get SidebarWidth(): number {
            return 16;
        }
        static get BottomBarHeight(): number {
            return 1;
        }
        static set DisplayWidth(val: number) {
            Settings._displayWidth = val;
        }
        static get DisplayWidth(): number {
            return Settings._displayWidth;
        }
        static get DisplayHeight(): number {
            return 34;
        }
        static get CamXOffset(): number {
            return Settings.SidebarWidth;
        }
        static get CamYOffset(): number {
            return 0;
        }
        static get CamWidth(): number {
            return Settings.DisplayWidth - Settings.SidebarWidth * 2;
        }
        static get CamHeight(): number {
            return Settings.DisplayHeight - Settings.BottomBarHeight;
        }
    }
} 