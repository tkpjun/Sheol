module Rouge.Console {

    export class Constants {

        private static _displayWidth = 92;

        static get SIDEBAR_WIDTH(): number {
            return 16;
        }
        static get BOTTOM_BAR_HEIGHT(): number {
            return 1;
        }
        static set displayWidth(val: number) {
            Constants._displayWidth = val;
        }
        static get displayWidth(): number {
            return Constants._displayWidth;
        }
        static get DISPLAY_HEIGHT(): number {
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