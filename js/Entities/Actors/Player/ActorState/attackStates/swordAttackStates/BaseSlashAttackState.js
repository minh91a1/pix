import BaseState from "../../../../../../StateMachine/BaseState.js"

export default class BaseSlashAttackState extends BaseState {
    constructor(ownerSprite) {
        super(ownerSprite);

        this._doNextAttack = false;
        this._stillPressAttack = true;
    }

    enter() {
        this._ownerSprite.body.velocity.x = 0;
        this._ownerSprite.setAccelerationX(0);
        this._doNextAttack = false;
        this._stillPressAttack = true;
        this._ownerSprite.sword.clearCollidedObjects();
    }

    exit() {
        // this._attackBox.visible = false; //
    }

    update() {
        // detect if player does not hold down the ATTACK button
        if (!this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.attackKey)) {
            this._stillPressAttack = false;
        }

        // if player press ATTACK button one more time then do combo attack
        if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.attackKey)) {
            if (this._stillPressAttack == false) {
                this._doNextAttack = true;
            }
        }
    }
}