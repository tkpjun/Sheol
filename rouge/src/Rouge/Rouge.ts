module Rouge {

    export class Const {

        static get UPDATE_RATE(): number {
            return 33;
        }
        static get MAP_HEIGHT(): number {
            return 33;
        }
    }

    export interface ILocation {
        x: number
        y: number
    }

    export interface IEntity{
        name: string;
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
        isPassable(): boolean;
        use(): any;
    }

    export interface IItem {
        name: string;
    }

    export interface IObservable {
        attach(observer: () => void);
        detach(observer: () => void);
        notify();
    }
}