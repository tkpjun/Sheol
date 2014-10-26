module Common.Controllers {

    export class ChangeProperty<T> implements ROT.IActor {

        private func;
        target: T;

        constructor(which: ObservableProperty<T>, to: T) {
            this.target = to;
            this.func = () => { 
                which.unwrap = to;
            }
        }

        act() {
            this.func();
        }
    }
} 