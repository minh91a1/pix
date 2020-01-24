import BaseState from "../../../../../StateMachine/BaseState.js"

export default class NormalState extends BaseState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.NORMAL;
    }

    update() {
        var newState = super.update(this);
        if (newState != undefined && newState != ACTOR_STATE_NAME.NORMAL) {
            return newState;
        }
        return this.resolveNormalState();
    }

    resolve() {
        return this.resolveNormalState();
    }

    resolveNormalState(){
        if (this._ownerSprite.getTouchedEnemy() != undefined) {
            return ACTOR_STATE_NAME.HURT;
        }
    
        return ACTOR_STATE_NAME.MOVEMENT;
    }
}