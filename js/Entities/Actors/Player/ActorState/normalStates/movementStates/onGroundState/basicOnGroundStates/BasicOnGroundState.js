import OnGroundState from "../OnGroundState.js"
//import ACTOR_STATE_NAME from "../../../../ACTOR_STATE_NAME.js"

export default class BasicOnGroundState extends OnGroundState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.BASIC_ON_GROUND;
    }

    enter() {
        super.enter();
    }

    update() {
        var newState = super.update(this);
        if (newState != ACTOR_STATE_NAME.BASIC_ON_GROUND) {
            return newState;
        }
        return this.resolveBasicOnGroundState();
    }

    resolve() {
        return this.resolveBasicOnGroundState();
    }

    resolveBasicOnGroundState() {
        if (this._ownerSprite.VirtualCtrlPad) {
            if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey)) {
                return ACTOR_STATE_NAME.WALK_LEFT;
            }
            
            if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey)) {
                return ACTOR_STATE_NAME.WALK_RIGHT;
            }
        }
    
        return ACTOR_STATE_NAME.IDLE;
    }
}
