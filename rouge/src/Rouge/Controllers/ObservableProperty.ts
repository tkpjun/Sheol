module Rouge.Controllers {

    export class ObservableProperty<T> implements IObservable {

        private observers: IObserver[];
        private _property: T;

        constructor(property: T) {
            this.observers = new Array<IObserver>();
            this._property = property;
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

        get property(): T {
            return this._property;
        }
        set property(property: T) {
            this._property = property;
            this.notify();
        }

    }
} 