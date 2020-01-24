import BaseSlashAttackState from "./BaseSlashAttackState.js"

export default class DashSlashState extends BaseSlashAttackState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.DASHATTACK;
    }

    enter() {
        super.enter();
        this._ownerSprite.sword.setEnable(true);
        //MEDIATOR.raiseEvent(EVENT_NAME.DAMAGE_OBJECT_CREATED, this._attackBox);
        this._ownerSprite.anims.play(this._ownerSprite.textureKey + '-attackDash');
        //this._ownerSprite.sword.anims.play('swordDash');
        this._ownerSprite.sword.doAttack('dash');

        this._startTime = this._ownerSprite.scene.time.now;
    }

    update() {
        super.update();

        if (this._ownerSprite.sword.isAnimationComplete()) {
            //this._attackBox.visible = false;
            if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.jumpKey)) {
                return ACTOR_STATE_NAME.JUMP;
            }
            //return ACTOR_STATE_NAME.IDLE;
            // smooth attack
            if (this._doNextAttack) {
                //return ACTOR_STATE_NAME.IDLE;
                return ACTOR_STATE_NAME.ATTACK3;
            } else {
                return ACTOR_STATE_NAME.IDLE;
            }
        } else {
            //this._ownerSprite.body.velocity.x *= this._dump;
            //this.setAttackBoxPos();
    
            let delta = this._ownerSprite.scene.time.now - this._startTime;
            if (delta > 0.2) {
                //this._ownerSprite.sword.setEnable(false);
            }
        }
    }
}