import MovementState from "../MovementState.js"
//import ACTOR_STATE_NAME from "../../../ACTOR_STATE_NAME.js"

export default class OnGroundState extends MovementState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.ON_GROUND;
    }

    enter() {
        this._ownerSprite.setMaxVelocity(this._ownerSprite.maxWalkSpeed, this._ownerSprite.maxFallSpeed);
        this._ownerSprite._speedUp = 1;
        this._ownerSprite.setAirDashTime(0);
    }

    update() {
        var newState = super.update(this);
        if (newState != ACTOR_STATE_NAME.ON_GROUND) {
            return newState;
        }
    
        return this.resolveOnGroundState();
    }

    resolve() {
        return this.resolveOnGroundState();
    }

    resolveOnGroundState() {
        if (this._ownerSprite.VirtualCtrlPad) {
            if (this._ownerSprite.VirtualCtrlPad.justPressed(this._ownerSprite.dashKey)) {
                return ACTOR_STATE_NAME.DASH;
            }
            if (this._ownerSprite.VirtualCtrlPad.justPressed(this._ownerSprite.jumpKey) && !this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveDownKey)) {
                return ACTOR_STATE_NAME.JUMP;
            }
            if (this._ownerSprite.VirtualCtrlPad.justPressed(this._ownerSprite.attackKey)) {
                if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey) ||
                    this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey)) {
                    return ACTOR_STATE_NAME.DASHATTACK;
                } else if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveUpKey)) {
                    return ACTOR_STATE_NAME.ATTACK2;
                } else {
                    return ACTOR_STATE_NAME.ATTACK1;
                }
            }
        }
        
        return ACTOR_STATE_NAME.BASIC_ON_GROUND;
    }
}
