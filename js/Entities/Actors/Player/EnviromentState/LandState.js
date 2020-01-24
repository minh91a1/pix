import BaseState from "../../../../StateMachine/BaseState.js";

export default class LandState extends BaseState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = 'LAND_STATE';
    }

    enter() {
        this._ownerSprite.setGravityY(0);
    }

    exit() {

    }

    update(time) {
        return this.resolve();
    }

    resolve() {
        if (this._ownerSprite.getEnviroment() == 3) {
            return 'WATER_STATE';
        }

        return 'LAND_STATE';
    }
}