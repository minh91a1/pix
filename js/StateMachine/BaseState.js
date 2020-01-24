export default class BaseState {
    constructor(ownerSprite) {
        this._name = name;
        this._ownerSprite = ownerSprite;
    }

    enter(oldStateName) {
        // need implement
    }

    exit(newStateName) {
        // need implement
    }

    update() {
        // need implement
    }

    resolve() {
        // need implement
    }
}