import BasicFloatingState from "./BasicFloatingState.js"

export default class JumpState extends BasicFloatingState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.JUMP;
    }

    enter(oldStateName) {
        super.enter(oldStateName);
        if (this._ownerSprite.isOnGround() || this._ownerSprite.body.onWall()) {
            this._ownerSprite.setVelocityY(this._ownerSprite.jumpSpeed);
            this._ownerSprite.anims.play(this._ownerSprite.textureKey+'-jump');
            if (this._ownerSprite.jumpSound) this._ownerSprite.jumpSound.play();

            if (oldStateName == ACTOR_STATE_NAME.FALL) {
                /* for when wall jump, player will push back a bit, make a better look */
                this._ownerSprite.setStartIgnoreMoveLeftRight(this._ownerSprite.scene.time.now);
            } else {
                this._ownerSprite.setStartIgnoreMoveLeftRight(-1);
            }
        }
    }

    update(time) {
        var newState = super.update(time);
        if (newState != ACTOR_STATE_NAME.JUMP) {
            return newState;
        }

        return this.resolveJumpState();
    }

    resolve() {
        return this.resolveJumpState();
    }

    resolveJumpState() {

        return ACTOR_STATE_NAME.JUMP;
    }
}