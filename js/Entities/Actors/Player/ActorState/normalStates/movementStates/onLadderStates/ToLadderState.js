import MovementState from "../MovementState.js"

export default class ToLadderState extends MovementState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.TO_LADDER;
        this._stateEnd = false;
    }

    enter() {
        this._ownerSprite.anims.stop();
        //this._ownerSprite.frameName = 'ladder5';/*3-4-5*/
        this._ownerSprite.anims.play(this._ownerSprite.textureKey + '-ladder', true);
        
        // temporarely ignore gravity & collistion checking
        this._ownerSprite.body.allowGravity = false;
        this._ownerSprite.setIgnoreCollision(true);
    
        this._stateEnd = false;
    
        let scene = this._ownerSprite.scene;
        let tween = scene.tweens.add({
            targets: this._ownerSprite, 
            y: {from: this._ownerSprite.y, to: this._ownerSprite.y + 20 },
            ease: 'Power1',
            duration: 100,
            repeat: 0,
            yoyo: false,
            onStart: function() { console.log('start') },
        });
        tween.on('complete', function(tween, targets) {
            console.log(this); this._stateEnd = true;
        }, this);

        // set player to inside ladder
        let ladderBlock = this._ownerSprite.getLadderBlock();
        if (ladderBlock) {
            this._ownerSprite.x = ladderBlock.x*16 + this._ownerSprite.originX*16;
        }
    }

    exit() {
        // active back gravity & collision checking
        this._ownerSprite.body.allowGravity = true;
        this._ownerSprite.setIgnoreCollision(false);

        // reset
        this._stateEnd = false;
    }

    update() {
        return this.resolveToLadderState();
    }

    resolve() {
        return this.resolveToLadderState();
    }

    resolveToLadderState() {
        if (this._stateEnd == true) {
            return ACTOR_STATE_NAME.ON_LADDER;
        }
        return ACTOR_STATE_NAME.TO_LADDER;
    }
    
    tweenEnd() {
        this._stateEnd = true;
    }
}