import OnGroundState from "../OnGroundState.js"

export default class DashState extends OnGroundState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.DASH;
    }

    enter() {
        let direction = this._ownerSprite.flipX ? -1 : 1;
        this._ownerSprite.setMaxVelocity(this._ownerSprite.maxWalkSpeed*this._ownerSprite.dashSpeedUp, this._ownerSprite.maxFallSpeed);
        this._ownerSprite.body.velocity.x = direction * this._ownerSprite.walkSpeed*this._ownerSprite.dashSpeedUp;
        this._ownerSprite.setAccelerationX(direction * this._ownerSprite.walkSpeed*this._ownerSprite.dashSpeedUp);
        this._ownerSprite.anims.play(this._ownerSprite.textureKey+'-dash');
        this._startTime = this._ownerSprite.scene.time.now;
    
        //var temp = new RibbonBlash(game, this._ownerSprite.x, this._ownerSprite.y, this._ownerSprite.scale.x);
        //game.add.existing(temp);
    }

    exit(comingState) {
        this._ownerSprite.body.velocity.x = 0;
        if (comingState != ACTOR_STATE_NAME.JUMP) {
            this._ownerSprite.setMaxVelocity(this._ownerSprite.maxWalkSpeed, this._ownerSprite.maxFallSpeed);
        }
    }

    update() {
        var newState = super.update(this);
        if (newState != ACTOR_STATE_NAME.DASH && newState != ACTOR_STATE_NAME.BASIC_ON_GROUND) {
            return newState;
        }
    
        let delta = this._ownerSprite.scene.time.now - this._startTime;
        if (delta > 500) {
            if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey) &&
                !this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey)) {
                return ACTOR_STATE_NAME.WALK_LEFT;
            } else if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveRightKey) &&
                       !this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.moveLeftKey)) {
                return ACTOR_STATE_NAME.WALK_RIGHT;
            } else {
                return ACTOR_STATE_NAME.IDLE;
            }
        }
    
        return this.resolveDashState();
    }

    resolve() {
        return this.resolveDashState();
    }

    resolveDashState = function() {
        if (this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.jumpKey)) {
            return ACTOR_STATE_NAME.JUMP;
        }
        if (!this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.dashKey)) {
            return ACTOR_STATE_NAME.BASIC_ON_GROUND;
        }
        return ACTOR_STATE_NAME.DASH;
    }
}