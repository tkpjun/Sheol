module Rouge.Console {

    export class Const {

        private static _displayWidth = 92;

        static get SidebarWidth(): number {
            return 16;
        }
        static get BottomBarHeight(): number {
            return 1;
        }
        static set DisplayWidth(val: number) {
            Const._displayWidth = val;
        }
        static get DisplayWidth(): number {
            return Const._displayWidth;
        }
        static get DisplayHeight(): number {
            return 34;
        }
        static get CamXOffset(): number {
            return Const.SidebarWidth;
        }
        static get CamYOffset(): number {
            return 0;
        }
        static get CamWidth(): number {
            return Const.DisplayWidth - Const.SidebarWidth * 2;
        }
        static get CamHeight(): number {
            return Const.DisplayHeight - Const.BottomBarHeight;
        }
    }

    export interface IDrawable {
        symbol: string;
        color?: string;
        bgColor?: string;
    }

    export function symbolO(item: IObject): string {
        throw("TODO");
    }

    export function colorO(item): ROT.Color {
        throw ("TODO");
    }

    export function symbolE(entity: IEntity): string {
        throw ("TODO");
    }

    export function colorE(entity): ROT.Color {
        throw ("TODO");
    }

    export function getDrawable(entity: IEntity): IDrawable {
        if (entity instanceof Entities.PlayerChar) {
            return { symbol: "@" };
        }
        else {
            return { symbol: "e" };
        }
    }
}