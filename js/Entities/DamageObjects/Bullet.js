import BaseDamageObject from "./BaseDamageObject.js"

export default class Bullet extends BaseDamageObject {
    constructor(scene, ownerSprite, x, y, textureKey, width, height) {
        super(scene, ownerSprite, x, y, textureKey, 0, width, height, true);
        
        /* phaser */
        this.textureKey = textureKey;
        this.createAnimation(scene);
        this.body.allowGravity = false;
        this._initPos = {x:x,y:y};
        this._lifeTime = scene.time.now;

        this.setSize(5,5).setOffset(0,0)
    }

    setSpeed(speed) {
        this.body.velocity.x = speed;
        this.setAccelerationX(speed);
    }

    createAnimation(scene) {
        const anims = scene.anims;
        anims.create({
            key: this.textureKey + "-bullet",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 2, zeroPad: undefined, prefix: 'pixbullet', suffix: '' }),
            frameRate: 16,
            repeat: -1,
            yoyo: true,
        });
    }

    update(time) {
        this.anims.play(this.textureKey + '-bullet', true);
        if (time - this._lifeTime > 3000) {
            this.destroy();
        }
        if (Math.abs(this.x - this._initPos.x) > 200 ) {
            this.destroy();
        }
    }
}