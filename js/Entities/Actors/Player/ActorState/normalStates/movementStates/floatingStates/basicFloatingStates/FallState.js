import BasicFloatingState from "./BasicFloatingState.js"

export default class FallState extends BasicFloatingState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.FALL;
    }

    enter(oldStateName) {
        super.enter(oldStateName);
        this._ownerSprite.anims.play(this._ownerSprite.textureKey + '-fall');
    }

    exit() {

    }

    update(time) {
        var newState = super.update(time);
        if (this._ownerSprite.body.onWall() && 
            ((this._ownerSprite.flipX && this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey)) ||
            (!this._ownerSprite.flipX && this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey)))) {
                /* change fall speed if on wall and try to move into wall */
                this._ownerSprite.anims.play(this._ownerSprite.textureKey + '-slide');
                this._ownerSprite.setAirDashTime(0);
                this._ownerSprite.setMaxVelocity(this._ownerSprite.maxWalkSpeed, this._ownerSprite.maxFallSpeed*this._ownerSprite.slideWallRate);
        } else {
            /* normal falling */
            this._ownerSprite.anims.play(this._ownerSprite.textureKey + '-fall');
            this._ownerSprite.setMaxVelocity(this._ownerSprite.maxWalkSpeed, this._ownerSprite.maxFallSpeed);
        }

        if (this._ownerSprite.body.onWall()) {
            /* wall jump !!! */
            if (this._ownerSprite.VirtualCtrlPad.justPressed(this._ownerSprite.jumpKey)) {
                this._ownerSprite.setVelocityX(this._ownerSprite.walkSpeed* (this._ownerSprite.flipX ? 1 : -1));
                this._ownerSprite.setMaxVelocity(this._ownerSprite.maxWalkSpeed, this._ownerSprite.maxFallSpeed);
                return ACTOR_STATE_NAME.JUMP;
            }
        }
        if (newState != ACTOR_STATE_NAME.FALL) {
            return newState;
        }
        return this.resolveFallState();
    }

    resolve() {
        return this.resolveFallState();
    }

    resolveFallState() {
        return ACTOR_STATE_NAME.FALL;
    }
}