import BaseState from "../../../../../StateMachine/BaseState.js"

export default class HurtState extends BaseState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.HURT;
    }

    enter() {
        this._ownerSprite.anims.play(this._ownerSprite.textureKey + "-attackJump", true);
    
        this._ownerSprite.setVelocityX(-1*(this._ownerSprite._hurtDir)*(this._ownerSprite.walkSpeed));
        this._ownerSprite.setVelocityY(this._ownerSprite.jumpSpeed/2);
        this._ownerSprite._speedUp = 1;
        
        (this._ownerSprite._hurtDir > 0) ? this._ownerSprite.setFlipX(false) : this._ownerSprite.setFlipX(true);
        // hurt state can happen before collision checking, so after collision checking
        // so if player is stand on solid object, velocity.y will be set to 0 
        // and set velocityY in here takes no effect
        // slightly move player above a bit to avoid collision checking
        this._ownerSprite.body.y -= 5;
        this._ownerSprite.sword.stopAttack();

        this._startTime = this._ownerSprite.scene.time.now;
    }

    exit() {

    }

    update() {
        let delta = this._ownerSprite.scene.time.now - this._startTime;
        if (delta > 300) {
            if (!this._ownerSprite.isOnGround()) {
                return ACTOR_STATE_NAME.FALL;
            }
            return ACTOR_STATE_NAME.NORMAL;
        }
    }
}