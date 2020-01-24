import BaseState from "../../../../StateMachine/BaseState.js";

export default class WaterState extends BaseState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = 'WATER_STATE';
    }

    enter() {
        this._ownerSprite.setVelocityY(100);
        this._ownerSprite.setGravityY(-500);
    }

    exit() {

    }

    update(time) {
        return this.resolve();
    }

    resolve() {
        if (this._ownerSprite.getEnviroment() == 1) {
            return 'LAND_STATE';
        }

        return 'WATER_STATE';
    }
}