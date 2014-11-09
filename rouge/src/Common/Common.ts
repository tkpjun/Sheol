﻿module Common {

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
        getAction(): () => void;
        hasAP(): boolean;
        newTurn();
    }

    export interface IObject {
        name: string;
        x: number;
        y: number;
        isPassable: boolean;
        pick(who: IEntity): string;
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

    export interface Tuple2<T, U> {
        fst: T;
        snd: U;
    }
}