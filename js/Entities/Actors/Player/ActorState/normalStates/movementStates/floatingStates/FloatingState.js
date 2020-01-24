import MovementState from "../MovementState.js"

export default class FloatingState extends MovementState {
    constructor(ownerSprite) {
        super(ownerSprite)
        this._name = ACTOR_STATE_NAME.FLOATING;
    }

    update() {
        var newState = super.update();
        if (newState != ACTOR_STATE_NAME.FLOATING) {
            return newState;
        }
        return this.resolveFloatingState();
    }

    resolve() {
        return this.resolveFloatingState();
    }

    resolveFloatingState(){
        if (this._ownerSprite.VirtualCtrlPad.justPressed(this._ownerSprite.dashKey) && this._ownerSprite.getAirDashTime() < this._ownerSprite._maxAirDashTime) {
            if (!this._ownerSprite.VirtualCtrlPad.justPressed(this._ownerSprite.jumpKey)) {
                if (!this._ownerSprite.body.onWall()) {
                    return ACTOR_STATE_NAME.AIR_DASH;
                }
            }
        }
        if (this._ownerSprite.isOnGround()) {
            return ACTOR_STATE_NAME.ON_GROUND;
        }
        // infinity jump
        // if (VirtualCtrlPad.justPressed(this._ownerSprite.jumpKey) && !VirtualCtrlPad.isDown(this._ownerSprite.moveDownKey)) {
        //     return ACTOR_STATE_NAME.JUMP;
        // }
        return ACTOR_STATE_NAME.BASIC_FLOATING;
    }
}