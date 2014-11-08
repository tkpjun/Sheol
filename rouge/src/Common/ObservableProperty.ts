module Common {

    export class Observable implements IObservable {
        private callbacks: Array<() => void>;

        constructor(callback?: () => void) {
            this.callbacks = new Array<() => void>();
            if (callback)
                this.callbacks.push(callback);
        }

        attach(observer: () => void) {
            this.callbacks.push(observer);
        }

        detach(observer: () => void) {
            var index = this.callbacks.indexOf(observer);
            this.callbacks.splice(index, 1);
        }

        notify() {
            this.callbacks.forEach((o) => {
                o();
            })
        }
    }

    export class ObservableProperty<T> extends Observable {

        private _property: T;

        constructor(callback?: () => void) {
            super(callback);
        }

        get unwrap(): T {
            return this._property;
        }
        set unwrap(property: T) {
            this._property = property;
            this.notify();
        }

    }
} 