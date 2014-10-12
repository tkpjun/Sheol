
module Rouge.Controllers {

    export class Observable implements IObservable {
        private observers: Array<() => void>;

        constructor() {
            this.observers = new Array<() => void>();
        }

        attach(observer: () => void) {
            this.observers.push(observer);
        }

        detach(observer: () => void) {
            var index = this.observers.indexOf(observer);
            this.observers.splice(index, 1);
        }

        notify() {
            this.observers.forEach((o) => {
                o();
            })
        }
    }

    export class ObservableProperty<T> extends Observable {

        private _property: T;

        constructor(property: T) {
            super();
            this._property = property;
        }

        get property(): T {
            return this._property;
        }
        set property(property: T) {
            this._property = property;
            this.notify();
        }

    }
} 