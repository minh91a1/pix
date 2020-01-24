import BasicOnGroundState from "./BasicOnGroundState.js"
//import ACTOR_STATE_NAME from "../../../../ACTOR_STATE_NAME.js"

export default class WalkState extends BasicOnGroundState {
    constructor(ownerSprite, direction) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.WALK;
        //this._ownerSprite = ownerSprite;
        this._direction = direction;
    }

    enter() {
        super.enter();
        if (this._direction == 'left') {
            this._ownerSprite.body.velocity.x = -this._ownerSprite.walkSpeed;
            this._ownerSprite.setAccelerationX(-this._ownerSprite.walkSpeed);
            this._ownerSprite.setFlipX(true);
        } else {
            this._ownerSprite.body.velocity.x = this._ownerSprite.walkSpeed;
            this._ownerSprite.setAccelerationX(this._ownerSprite.walkSpeed);
            this._ownerSprite.setFlipX(false);
        }
        this._ownerSprite.anims.play(this._ownerSprite.textureKey + "-walk", true);
    }

    update() {
        var newState = super.update(this);
        if ((this._direction == 'left' && newState != ACTOR_STATE_NAME.WALK_LEFT) ||
            (this._direction == 'right' && newState != ACTOR_STATE_NAME.WALK_RIGHT)) {
            return newState;
        }
    
        return this.resolveWalkState();
    }

    resolve() {
        return this.resolveWalkState();
    }

    resolveWalkState() {
        if (this._ownerSprite.VirtualCtrlPad) {
            if ((!this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey) && !this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey)) || 
                (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey) && this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey))) {
                return ACTOR_STATE_NAME.IDLE;
            }

            if (this._direction == 'left' && this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey)) {
                return ACTOR_STATE_NAME.WALK_RIGHT;
            }
            if (this._direction == 'right' && this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey)) {
                return ACTOR_STATE_NAME.WALK_LEFT;
            }

            if (this._direction == 'left') {
                return ACTOR_STATE_NAME.WALK_LEFT;
            }
        }
    
        return ACTOR_STATE_NAME.WALK_RIGHT;
    }
}
