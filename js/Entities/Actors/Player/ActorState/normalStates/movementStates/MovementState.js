import NormalState from "../NormalState.js"
//import ACTOR_STATE_NAME from "../../ACTOR_STATE_NAME.js"

export default class MovementState extends NormalState {
    constructor(ownerSprite) {
        super(ownerSprite)
        this._name = ACTOR_STATE_NAME.MOVEMENT;
    }

    update() {
        var newState = super.update(this);
        if (newState != undefined && newState != ACTOR_STATE_NAME.MOVEMENT) {
            return newState;
        }
        return this.resolveMovementState();
    }

    resolve() {
        return this.resolveMovementState();
    }

    resolveMovementState() {
        if (this._ownerSprite.VirtualCtrlPad) {

            let up = this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveUpKey);
            let isTouchLadder = this._ownerSprite.isTouchLadder();

            if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveUpKey) && this._ownerSprite.isTouchLadder()) {
                this._ownerSprite.y -= 2; // fix can't not climb ladder when on moving platform :<
                return ACTOR_STATE_NAME.ON_LADDER;
            }
        
            if (!this._ownerSprite.isOnGround()) {
                return ACTOR_STATE_NAME.FLOATING;
            }
        }
        
        return ACTOR_STATE_NAME.ON_GROUND;
    }
}
