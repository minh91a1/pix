import BaseState from "../../../../../../StateMachine/BaseState.js"
import Bullet from "../../../../../DamageObjects/Bullet.js"

export default class ShootState extends BaseState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.SHOOT;
        
        /* model */
        this._delayShoot = 0;
    }

    enter() {
        let scene = this._ownerSprite.scene;

        var delayTime = scene.time.now - this._delayShoot;
        if (delayTime > 300) {
            // shoot star !
            let shootDirection = 1;
            if (this._ownerSprite.flipX) {
                shootDirection *= -1;
            }
            if (this._ownerSprite.body.onWall()) {
                shootDirection *= -1;
            } 
            let bullet = new Bullet(scene, this, this._ownerSprite.x + shootDirection*5, this._ownerSprite.y, 'pixatlast', 0, 0);
            let speed = 150 * shootDirection;
            
            
            bullet.setSpeed(speed);
            scene.playerDamageObjectContainer.add(bullet);
            console.log(scene.playerDamageObjectContainer)
            this._ownerSprite.jumpSound.play();

            // start delay timer
            this._delayShoot = scene.time.now;
        }
    }

    update() {
        return ACTOR_STATE_NAME.NORMAL;
    }
}