import FloatingState from "../FloatingState.js"

export default class BasicFloatingState extends FloatingState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.BASIC_FLOATING;
    }

    enter(oldStateName) {
        if (oldStateName == ACTOR_STATE_NAME.DASH) {
            this._ownerSprite._speedUp = this._ownerSprite.dashSpeedUp;
        }
    }

    update(time) {
        var newState = super.update();
        if (newState != ACTOR_STATE_NAME.BASIC_FLOATING) {
            return newState;
        }
    
        if (!this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.jumpKey)) {
            if (this._ownerSprite.body.velocity.y < 0) {
                this._ownerSprite.body.velocity.y*=0.9;
            }
        }
        if ((!this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey) && !this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey)) ||
            (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey) && this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey)) ) {
            /* stop immediately when left right is not pressed */
            this._ownerSprite.setVelocityX(0);
        } else if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey)) {
            if (time - this._ownerSprite.getStartIgnoreMoveLeftRight() > 100) {
                this._ownerSprite.setVelocityX(-this._ownerSprite.walkSpeed*this._ownerSprite._speedUp);
            } else {
                /* wall jump so ignore */
            }
            this._ownerSprite.setFlipX(true);
        } else if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey)) {
            if (time - this._ownerSprite.getStartIgnoreMoveLeftRight() > 100) {
                this._ownerSprite.setVelocityX(this._ownerSprite.walkSpeed*this._ownerSprite._speedUp);
            } else {
                /* wall jump ba so ignore */
            }
            this._ownerSprite.setFlipX(false);
        }
    
        return this.resolveBasicFloatingState();
    }

    resolve() {
        return this.resolveBasicFloatingState();
    }

    resolveBasicFloatingState(){
        if (this._ownerSprite.VirtualCtrlPad.justPressed(this._ownerSprite.attackKey)) {
            // if (!this._ownerSprite.body.onWall()) {
            //     return ACTOR_STATE_NAME.JUMPATTACK;
            // }
            return ACTOR_STATE_NAME.JUMPATTACK;
        }
        if (this._ownerSprite.body.velocity.y > 0) {
            return ACTOR_STATE_NAME.FALL;
        }
        if (this._ownerSprite.body.velocity.y < 0) {
            return ACTOR_STATE_NAME.JUMP;
        }
        if (this._ownerSprite.isOnGround() && this._ownerSprite.body.velocity.y == 0) {
            return ACTOR_STATE_NAME.ON_GROUND;
        }

        return ACTOR_STATE_NAME.FALL;
    }
}