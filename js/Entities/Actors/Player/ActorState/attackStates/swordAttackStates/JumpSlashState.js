import BaseSlashAttackState from "./BaseSlashAttackState.js"

export default class JumpSlashState extends BaseSlashAttackState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.JUMPATTACK;
    }

    enter() {
        super.enter();
        this._ownerSprite.sword.setEnable(true);
        this._ownerSprite.anims.play(this._ownerSprite.textureKey+'-attackJump');
        this._ownerSprite.sword.doAttack('jump');

        //MEDIATOR.raiseEvent(EVENT_NAME.DAMAGE_OBJECT_CREATED, this._attackBox);

        this._ownerSprite._dashing = false;
        // this._ownerSprite.body.velocity.x = (this._ownerSprite.scale.x)*45;
        this._dump = 0.95;
    }

    update() {
        super.update();

        this._ownerSprite.sword.updateAttackPos('jump');
    
        if (this._stateCompleted) {
            return ACTOR_STATE_NAME.MOVEMENT;
        }
    
        if (this._ownerSprite.isOnGround())
        {
            if (this._ownerSprite.sword.isAnimationComplete()) {
                this._ownerSprite.sword.setEnable(false);
                return ACTOR_STATE_NAME.IDLE;
            } else {
                // if player attack when very close to the ground
                // this._ownerSprite.sword.doAttack('basic1');
                this._ownerSprite.sword.stopAttack();
                return ACTOR_STATE_NAME.IDLE;
                //return ACTOR_STATE_NAME.ATTACK1;
            }
        }
    
        if (!this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.jumpKey)) {
            if (this._ownerSprite.body.velocity.y < 0) {
                this._ownerSprite.body.velocity.y*=0.1;
            }
        }
    
        if (!this._ownerSprite.isOnGround()) {
            if (!this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey) && 
                !this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey)) {
                this._ownerSprite.body.velocity.x = 0;
            } else if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey) && 
                       this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey)) {
                this._ownerSprite.body.velocity.x = 0;
            } else if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey)) {
                this._ownerSprite.body.velocity.x = -this._ownerSprite.walkSpeed*this._ownerSprite._speedUp;
                this._ownerSprite.setFlipX(true);
            } else if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey)) {
                this._ownerSprite.body.velocity.x = this._ownerSprite.walkSpeed*this._ownerSprite._speedUp;
                this._ownerSprite.setFlipX(false);
            }
        } else {
            this._ownerSprite.body.velocity.x = 0;
        }
    }
}