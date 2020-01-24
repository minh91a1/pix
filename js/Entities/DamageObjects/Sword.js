import BaseDamageObject from "./BaseDamageObject.js"

export default class Sword extends BaseDamageObject
{
    constructor(scene, ownerSprite, x, y, textureKey, width, height) {
        super(scene, ownerSprite, x, y, textureKey, 0, width, height, true);
        this.textureKey = 'sword';
        this.createAnimation(scene);
        this._animationComplete = false;
    }

    isAnimationComplete() {
        return this._animationComplete;
    }

    doAttack(animationKey, config) {
        if (!config) {
            config = {
                ignoreIfStarted: false,
            }
        }

        this._animationComplete = false;

        this.resolveSwordBody(animationKey);
        this.resolveSwordPosition(animationKey);

        this.visible = true;
        this.anims.play('sword-' + animationKey, config.ignoreIfStarted);
    }

    stopAttack() {
        this.anims.stop();
        this.setEnable(false);
        this.visible = false;
    }

    updateAttackPos(animationKey) {
        this.resolveSwordBody(animationKey);
        this.resolveSwordPosition(animationKey);
    }

    resolveSwordBody(animationKey) {
        let offsetX = 0;
        let offsetY = 0;
        let width = 0;
        let height = 0;
        
        switch(animationKey) {
            case 'basic1':
                offsetX = this._ownerSprite.flipX ? 25 : 50;
                offsetY = 25;
                width = 20;
                height = 40;
            break;
            case 'basic2': 
                offsetX = this._ownerSprite.flipX ? 25 : 30;
                offsetY = 30;
                width = 40;
                height = 30;
            break;
            case 'basic3': 
                offsetX = this._ownerSprite.flipX ? 0 : 50;
                offsetY = 40;
                width = 50;
                height = 10;
            break;
            case 'dash':
                offsetX = this._ownerSprite.flipX ? 10 : 50;
                offsetY = 45;
                width = 35;
                height = 10;
            break;
            case 'jump':
                offsetX = this._ownerSprite.flipX ? 30 : 30;
                offsetY = 20;
                width = 35;
                height = 40;
            break;
        }
        this.setFlipX(this._ownerSprite.flipX);
        this.setSize(width, height)
            .setOffset(offsetX, offsetY);
    }

    resolveSwordPosition(animationKey) {
        let x_ = this._ownerSprite.x;
        let y_ = this._ownerSprite.y - 15;

        switch(animationKey) {
            case 'basic1':
            case 'basic2': 
            case 'basic3':
            case 'dash':
                // no need update position
            break;
            case 'jump':
                x_ = this._ownerSprite.x + (this._ownerSprite.flipX ? -1 : 1)* 3;
                y_ = this._ownerSprite.y - 15;
            break;
        }
               
        this.x = x_;
        this.y = y_;
    }
    

    createAnimation(scene) {
        const anims = scene.anims;
        const atkSpeed = 16;
        anims.create({
            key: this.textureKey + "-basic1",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 6, zeroPad: undefined, prefix: 'sword', suffix: '' }),
            frameRate: atkSpeed,
            repeat: 0
        });
        anims.create({
            key: this.textureKey + "-basic2",
            frames: anims.generateFrameNames(this.textureKey, { start: 7, end: 12, zeroPad: undefined, prefix: 'sword', suffix: '' }),
            frameRate: atkSpeed,
            repeat: 0
        });
        anims.create({
            key: this.textureKey + "-basic3",
            frames: anims.generateFrameNames(this.textureKey, { start: 13, end: 18, zeroPad: undefined, prefix: 'sword', suffix: '' }),
            frameRate: atkSpeed,
            repeat: 0
        });
        anims.create({
            key: this.textureKey + "-dash",
            frames: anims.generateFrameNames(this.textureKey, { start: 19, end: 25, zeroPad: undefined, prefix: 'sword', suffix: '' }),
            frameRate: atkSpeed,
            repeat: 0
        });
        anims.create({
            key: this.textureKey + "-jump",
            frames: anims.generateFrameNames(this.textureKey, { start: 32, end: 38, zeroPad: undefined, prefix: 'sword', suffix: '' }),
            frameRate: atkSpeed,
            repeat: 0
        });

        this.on('animationcomplete', function(anim, frame) {
            this.setSize(1,1)
            this._animationComplete = true;
        }, this);
    }
}