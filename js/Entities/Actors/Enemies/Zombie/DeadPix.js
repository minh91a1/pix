import Actor from "../../Actor.js"

export default class DeadPix extends Actor {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey, 0, 0, 0, true);

        /* field model */
        this._name = 'DeadPix';
        this._getHurt = -1;
        this._hp = 3;
        this._originX = x;
        this.body.velocity.x = 5;
        this.state = 0;

        /* phaser */
        this.textureKey = textureKey;
        this.createAnimation(scene);
        this.depth = -1;
        this.setSize(7, 13)
            .setOffset(0, 0)
    }

    createAnimation(scene) {
        const anims = scene.anims;
        anims.create({
            key: this.textureKey + this._name + "-idle",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 2, zeroPad: undefined, prefix: 'deadpix', suffix: '' }),
            frameRate: 3,
            repeat: -1
        });
    }

    
    onGetHit(damageObject) {
        this._getHurt = this.scene.time.now;
        this.state = 1;
        if (this.x < damageObject.x) {
            this.x -= 3;
        } else {
            this.x += 3;
        }

        this._hp -= damageObject.getDamage();
    }

    update(time) {

        switch (this.state) {
            case 0:
                this.anims.play(this.textureKey + this._name + "-idle", true);
                if (this.body.velocity.x == 0) {
                    if (this.flipX) {
                        this.body.velocity.x = 5;
                    } else {
                        this.body.velocity.x = -5;
                    }
                }
                
                
                // animation flipX //
                if (this.body.velocity.x > 0) {
                    this.setFlipX(true);
                } else {
                    this.setFlipX(false);
                }        
                break;
            case 1:
                this.body.velocity.x = 0;
                if (this.scene.time.now - this._getHurt > 1000) {
                    this._getHurt = -1;
                    this.state = 0;
                }
            default:
                break;
        }
    }
}
