module Rouge {

    export class Const {

        static get UPDATE_RATE(): number {
            return 33;
        }
        static get MAP_HEIGHT(): number {
            return 33;
        }
    }

    export enum Direction {
        North,
        South,
        West,
        East,
        Northwest,
        Northeast,
        Southwest,
        Southeast
    }

    export interface ILocation {
        x: number
        y: number
    }

    export interface IEntity{
        name: string;
        description: string;
        x: number;
        y: number;
        //getStruck(attack: Entities.Attack): Entities.AttackResult;
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