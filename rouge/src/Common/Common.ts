module Common {

    export interface IVector2 {
        x: number
        y: number
    }

    export interface IEntity{
        name: string;
        description: string;
        x: number;
        y: number;
        dir: IVector2;
        nextAction;
        hasAP(): boolean;
        newTurn();
    }

    export interface IObject {
        x: number;
        y: number;
        isPassable: boolean;
        pick(): any;
    }

    export interface IItem {
        name: string;
        description: string;
    }

    export interface IConsole {
        addLine(line: string): IConsole
    }

    export interface IObservable {
        attach(observer: () => void);
        detach(observer: () => void);
        notify();
    }
}