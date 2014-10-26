module ConsoleGame {
    import Entities = Common.Entities;
    import C = Common;

    export interface IDrawable {
        symbol: string;
        color?: string;
        bgColor?: string;
    }

    export function symbolO(item: C.IObject): string {
        throw("TODO");
    }

    export function colorO(item): ROT.Color {
        throw ("TODO");
    }

    export function symbolE(entity: C.IEntity): string {
        throw ("TODO");
    }

    export function colorE(entity): ROT.Color {
        throw ("TODO");
    }

    export function getDrawable(entity: C.IEntity): IDrawable {
        if (entity instanceof Entities.PlayerChar) {
            return { symbol: "@" };
        }
        else {
            return { symbol: "e" };
        }
    }
}