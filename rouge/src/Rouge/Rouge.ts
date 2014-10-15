module Rouge {

    export interface IEntity{
        name: string;
        x: number;
        y: number;
        //getStruck(attack: any): Entities.AttackResult;
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

window.onload = () => {
    document.getElementById("content").appendChild(new Rouge.Console.Game().display.getContainer());
};