module Rouge {

    export interface IEntity{
        name: string;
        x: number;
        y: number;
        tryStrike(attack: any);
        nextAction;
        hasAP(): boolean;
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

    export interface IObserver {
        update();
    }

    export interface IObservable {
        attach(observer: IObserver);
        detach(observer: IObserver);
        notify();
    }

    export class Observable implements IObservable {
        private observers: IObserver[];

        constructor() {
            this.observers = new Array<IObserver>();
        }

        attach(observer: IObserver) {
            this.observers.push(observer);
        }

        detach(observer: IObserver) {
            var index = this.observers.indexOf(observer);
            this.observers.splice(index, 1);
        }

        notify() {
            this.observers.forEach((o) => {
                o.update();
            })
        }
    }
} 

window.onload = () => {
    document.getElementById("content").appendChild(new Rouge.Console.Game().display.getContainer());
};