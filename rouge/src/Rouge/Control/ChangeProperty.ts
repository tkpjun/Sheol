module Rouge.Control {

    export class ChangeProperty<T> implements ROT.IActor {

        private func;

        constructor(which: ObservableProperty<T>, to: T) {
            this.func = () => { 
                which.property = to;
            }
        }

        act() {
            this.func();
        }
    }
} 