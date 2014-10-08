module Rouge.Console {

    export class Constants {

        static get LEFT_UI_WIDTH(): number {
            return 12
        }
        static get DISPLAY_WIDTH(): number {
            return 92
        }
        static get DISPLAY_HEIGHT(): number {
            return 34
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
}