module Rouge.Console {

    export interface IPrintable {
        symbol: string;
        color: ROT.Color;
        x: number;
        y: number;
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