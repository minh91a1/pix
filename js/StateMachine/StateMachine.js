export default class StateMachine {
    constructor() {
        this._states = {}
        this._curr_stateName;
    }

    addState(stateName,stateInstance) {
        this._states[stateName] = stateInstance;
    }

    removeState(stateName) {
        if (this._states.hasOwnProperty(stateName)) {
            delete this._states[stateName];
        }
    }

    setInitialState(stateName) {
        this._curr_stateName = stateName;
        this.changeState(stateName);
    }

    update(time) {
        var new_stateName = this._states[this._curr_stateName].update(time);
        if (this._states.hasOwnProperty(new_stateName) && new_stateName != this._curr_stateName) {
            this.changeState(new_stateName);
            console.log(new_stateName)
        }
    }

    changeState(newStateName) {
        newStateName = this.resolve(newStateName);
        
        this._states[this._curr_stateName].exit(newStateName);
        var oldStateName = this._curr_stateName;
        this._curr_stateName = newStateName;
        this._states[this._curr_stateName].enter(oldStateName);
    }

    resolve(newStateName) {
        var parentNode = newStateName;
        var childNode;
        do {
            var parentIns = this._states[parentNode];
            childNode = parentIns.resolve();
            if (childNode == parentNode || childNode == undefined) {
                break;
            }
            parentNode = childNode;
        } while (1);
        return parentNode;
    }

    getCurrentStateName() {
        return this._curr_stateName;
    }
}
