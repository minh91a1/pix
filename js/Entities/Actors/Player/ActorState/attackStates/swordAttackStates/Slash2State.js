import BaseSlashAttackState from "./BaseSlashAttackState.js"

export default class Slash2State extends BaseSlashAttackState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.ATTACK2;
    }

    enter() {
        super.enter();

        this._ownerSprite.sword.setEnable(true);
        // MEDIATOR.raiseEvent(EVENT_NAME.DAMAGE_OBJECT_CREATED, this._attackBox);
    
        this._ownerSprite.anims.play(this._ownerSprite.textureKey+'-attack2');
        this._ownerSprite.sword.doAttack('basic2');
        
        this._startTime = this._ownerSprite.scene.time.now;
    }

    update() {
        super.update();

        this._ownerSprite.sword.updateAttackPos('basic2');

        if (this._ownerSprite.sword.isAnimationComplete()) {
            this._ownerSprite.sword.setEnable(false);
            if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.jumpKey)) {
                return ACTOR_STATE_NAME.JUMP;
            }
            if (this._doNextAttack) {
                return ACTOR_STATE_NAME.ATTACK3;
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