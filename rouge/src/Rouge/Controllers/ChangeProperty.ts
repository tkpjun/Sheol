module Rouge.Controllers {

    export class ChangeProperty<T> implements ROT.IActor {

        private func;
        target: T;

        constructor(which: ObservableProperty<T>, to: T) {
            this.target = to;
            this.func = () => { 
                which.property = to;
            }
        }

        act() {
            this.func();
        }
    }
} 