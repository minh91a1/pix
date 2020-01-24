import MovementState from "../MovementState.js"

export default class OnLadderState extends MovementState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.ON_LADDER;
        this._startClimbPoint;
        this._currFrame;
        this._totalClimbFrame;
    }

    enter() {
        this._ownerSprite.setMaxVelocity(this._ownerSprite.maxWalkSpeed*this._ownerSprite.slowSpeedDown, this._ownerSprite.maxFallSpeed*this._ownerSprite.slowSpeedDown);

        this._startClimbPoint = new Phaser.Geom.Point();
        this._startClimbPoint.x = this._ownerSprite.x;
        this._startClimbPoint.y = this._ownerSprite.y;
        this._currFrame = 1;
        this._totalClimbFrame = 2;
    
        //this._ownerSprite.anims.stop();
        //this._ownerSprite.anims.frameName = this._ownerSprite.textureKey + '-ladder1';
        this._ownerSprite.anims.play(this._ownerSprite.textureKey + '-ladder', true);
        this._ownerSprite.body.allowGravity = false;
        this._ownerSprite._speedUp = 1;

        this._ownerSprite.setAirDashTime(0); // player can dash again !

        // set player to inside ladder
        let ladderBlock = this._ownerSprite.getLadderBlock();
        if (ladderBlock) {
            this._ownerSprite.x = ladderBlock.x*16 + this._ownerSprite.originX*16;
        }
    }

    exit() {
        this._ownerSprite.body.allowGravity = true;
        this._ownerSprite.setMaxVelocity(this._ownerSprite.maxWalkSpeed, this._ownerSprite.maxFallSpeed);
    }

    update() {
        // var newState = MovementState.prototype.update.call(this);
        // if (newState != ACTOR_STATE_NAME.ON_LADDER) {
        //     return newState;
        // }

        this._ownerSprite.body.velocity.x = 0;
        this._ownerSprite.body.velocity.y = 0;
        this._ownerSprite.setAccelerationX(0);
        this._ownerSprite.setAccelerationY(0);
        var d = this.calDist(this._startClimbPoint.x, this._startClimbPoint.y, this._ownerSprite.x, this._ownerSprite.y);

        this._currFrame = Math.floor(Math.abs(d/7)) % this._totalClimbFrame;
        this._currFrame++;

        if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveUpKey)) {
            this._ownerSprite.body.velocity.y = -1*this._ownerSprite.walkSpeed;
        }
        if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveDownKey)) {
            this._ownerSprite.body.velocity.y = this._ownerSprite.walkSpeed;
        }

        if (!this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveDownKey) &&
            !this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveUpKey)) {
                this._ownerSprite.anims.pause();
            } else {
                this._ownerSprite.anims.resume();
            }

        return this.resolveOnLadderState();
    }

    resolve() {
        return this.resolveOnLadderState();
    }
    
    resolveOnLadderState() {
        if (!this._ownerSprite.isTouchLadder()) {
            if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveUpKey)) {
                return ACTOR_STATE_NAME.FROM_LADDER;
            } else {
                return ACTOR_STATE_NAME.MOVEMENT;
            }
        }
    
        if (this._ownerSprite.VirtualCtrlPad.justPressed(this._ownerSprite.jumpKey)) {
            return ACTOR_STATE_NAME.FALL;
        }
    
        if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveDownKey)) {
            if (this._ownerSprite.isOnGround()) {
                return ACTOR_STATE_NAME.IDLE;
            }
        }
        
        return ACTOR_STATE_NAME.ON_LADDER;
    }
    
    calDist(x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        return dx + dy;
    }
}