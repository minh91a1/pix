import BaseSlashAttackState from "./BaseSlashAttackState.js"

export default class Slash3State extends BaseSlashAttackState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.ATTACK3;
    }

    enter() {
        super.enter();

        this._ownerSprite.sword.setEnable(true);
        // MEDIATOR.raiseEvent(EVENT_NAME.DAMAGE_OBJECT_CREATED, this._attackBox);
    
        this._ownerSprite.anims.play(this._ownerSprite.textureKey+'-attack3');
        this._ownerSprite.sword.doAttack('basic3');
        
        this._startTime = this._ownerSprite.scene.time.now;
    }

    update() {
        super.update();

        this._ownerSprite.sword.updateAttackPos('basic3');

        if (this._ownerSprite.sword.isAnimationComplete()) {
            // end of combo
            this._ownerSprite.sword.setEnable(false);
            if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.jumpKey)) {
                return ACTOR_STATE_NAME.JUMP;
            }
            //return ACTOR_STATE_NAME.IDLE;
            // infinity attack unlock ?
            if (this._doNextAttack) {
                return ACTOR_STATE_NAME.DASHATTACK;
            } else {
                return ACTOR_STATE_NAME.IDLE;
            }
        } else {
            let delta = this._ownerSprite.scene.time.now - this._startTime;
            if (delta > 0.2) {
                //this._ownerSprite.sword.setEnable(false);
            }
        }
    }
}