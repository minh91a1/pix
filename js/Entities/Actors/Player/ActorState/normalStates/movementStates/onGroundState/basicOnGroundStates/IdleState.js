import BasicOnGroundState from "./BasicOnGroundState.js"
//import ACTOR_STATE_NAME from "../../../../ACTOR_STATE_NAME.js"

export default class IdleState extends BasicOnGroundState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.IDLE;
        //this._ownerSprite = ownerSprite;
    }

    enter() {
        super.enter();
        this._ownerSprite.setVelocityX(0);
        this._ownerSprite.setAccelerationX(0);
        this._ownerSprite.anims.play(this._ownerSprite.textureKey + "-idle", true);
    }

    update() {
        var newState = super.update(this);
        if (newState != ACTOR_STATE_NAME.IDLE) {
            return newState;
        }
    
        return this.resolveIdleState();
    }

    resolve() {
        return this.resolveIdleState();
    }

    resolveIdleState() {
        if (this._ownerSprite.VirtualCtrlPad) {
            if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveDownKey) &&
                this._ownerSprite.isAboveLadder()) {
                this._ownerSprite.setIsTouchLadder(true);
                return ACTOR_STATE_NAME.TO_LADDER;
            }
        
            if (this._ownerSprite.VirtualCtrlPad.justPressed(this._ownerSprite.jumpKey) &&
                this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveDownKey)) {
                if (this._ownerSprite.isOnTopCollisionOnly() ||
                    this._ownerSprite.isTouchMovingPlatform()) {
                    this._ownerSprite.setIgnoreCollision(true);
                    this._ownerSprite.scene.time.delayedCall(200, this.timeOut, [], this);
                    return ACTOR_STATE_NAME.FALL;
                }
            }
        }

        return ACTOR_STATE_NAME.IDLE;
    }

    timeOut() {
        this._ownerSprite.setIgnoreCollision(false);
    }
}
