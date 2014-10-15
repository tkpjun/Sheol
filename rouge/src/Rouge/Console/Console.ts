module Rouge.Console {

    export class Constants {

        private static _displayWidth = 92;

        static get SidebarWidth(): number {
            return 16;
        }
        static get BottomBarHeight(): number {
            return 1;
        }
        static set DisplayWidth(val: number) {
            Constants._displayWidth = val;
        }
        static get DisplayWidth(): number {
            return Constants._displayWidth;
        }
        static get DisplayHeight(): number {
            return 34;
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