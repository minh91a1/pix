import Actor from "../../Actor.js"
import Bullet from "../../../DamageObjects/Bullet.js"

export default class EaterTree extends Actor {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey, 0, 0, 0, true);

        /* field model */
        this._name = 'EaterTree';
        this._getHurt = -1;
        this._hp = 3;
        this._attackCooldown = 0;

        /* phaser */
        this.textureKey = textureKey;
        this.createAnimation(scene);
        this.depth = -1;
        this.setSize(12, 30)
            .setOffset(25, 14)
    }

    createAnimation(scene) {
        const anims = scene.anims;
        anims.create({
            key: this.textureKey + this._name + "-idle",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 5, zeroPad: undefined, prefix: 'piranha-plant/piranha-plant-', suffix: '' }),
            frameRate: 6,
            repeat: -1
        });
        anims.create({
            key: this.textureKey + this._name + "-attack",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 4, zeroPad: undefined, prefix: 'piranha-plant-attack/piranha-plant-attack-', suffix: '' }),
            frameRate: 6,
            repeat: -1
        });
        anims.create({
            key: this.textureKey + this._name + "-hurt",
            frames: anims.generateFrameNames(this.textureKey, { start: 3, end: 3, zeroPad: undefined, prefix: 'piranha-plant/piranha-plant-', suffix: '' }),
            frameRate: 6,
            repeat: -1
        });
        this.on('animationrepeat', function(anim, frame) {
            if (anim.key == this.textureKey + this._name + '-attack') {
                let bullet = new Bullet(this.scene, this, this.x + (this.flipX ? 25:-25), this.y + 5, 'atlas', 0, 0);
                let speed = 50 * (this.flipX ? 1:-1);
                bullet.setSpeed(speed);
                this.scene.enemiesDamageObjectContainer.add(bullet);
                this._attackCooldown = this.scene.time.now;
            }
        }, this);
    }

    onGetHit(damageObject) {
        if (this._getHurt == -1) {
            this._getHurt = this.scene.time.now;
            this._hp -= damageObject.getDamage();
        }
    }

    update(time) {
        if (this._getHurt != -1) {
            this.anims.play(this.textureKey + this._name + '-hurt', true);
            if (time - this._getHurt > 300) {
                this._getHurt = -1;
                console.log(this._hp);
            }
            return;
        }

        if (this.scene.player) {
            let distanceToPlayer = this.scene.player.x - this.x;
            if (distanceToPlayer > 0) {
                this.setFlipX(true);
            } else {
                this.setFlipX(false);
            }

            if (Math.abs(distanceToPlayer) < 200) {
                this.anims.play(this.textureKey + this._name + '-attack', true);
                return;
            }
        }

        this.anims.play(this.textureKey + this._name + '-idle', true);
    }
}