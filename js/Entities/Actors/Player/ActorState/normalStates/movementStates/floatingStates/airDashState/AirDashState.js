import OnGroundState from "../../onGroundState/OnGroundState.js"

export default class AirDashState extends OnGroundState {
    constructor(ownerSprite) {
        super(ownerSprite);
        this._name = ACTOR_STATE_NAME.AIR_DASH;
    }

    enter() {
        this._ownerSprite.setAirDashTime(this._ownerSprite.getAirDashTime() + 1);

        this._ownerSprite.body.allowGravity = false
        this._ownerSprite.body.velocity.y = 0;

        let direction = this._ownerSprite.flipX ? -1 : 1;
        this._ownerSprite.setMaxVelocity(this._ownerSprite.maxWalkSpeed*this._ownerSprite.dashSpeedUp, this._ownerSprite.maxFallSpeed);
        this._ownerSprite.body.velocity.x = direction * this._ownerSprite.walkSpeed*this._ownerSprite.dashSpeedUp;
        this._ownerSprite.body.setAccelerationX(direction * this._ownerSprite.walkSpeed*this._ownerSprite.dashSpeedUp);
    
        this._ownerSprite.anims.play(this._ownerSprite.textureKey + '-dash');
        this._startTime = this._ownerSprite.scene.time.now;
    
        //var temp = new RibbonBlash(game, this._ownerSprite.x, this._ownerSprite.y, this._ownerSprite.scale.x);
        //game.add.existing(temp);
    }

    exit() {
        this._ownerSprite.body.velocity.x = 0;
        this._ownerSprite.body.allowGravity = true;
        this._ownerSprite.setMaxVelocity(this._ownerSprite.maxWalkSpeed, this._ownerSprite.maxFallSpeed);
    }

    update() {
        // var newState = OnGroundState.prototype.update.call(this);
        // if (newState != ACTOR_STATE_NAME.AIR_DASH && newState != ACTOR_STATE_NAME.BASIC_ON_GROUND) {
        //     return newState;
        // }
    
        let delta = this._ownerSprite.scene.time.now - this._startTime;
        if (delta > 500) {
            return ACTOR_STATE_NAME.FALL;
        }
    
        return this.resolveDashState();
    }
    
    resolve() {
        return this.resolveDashState();
    }
    
    resolveDashState() {
        if (!this._ownerSprite.VirtualCtrlPad.isDown(this._ownerSprite.dashKey)) {
            return ACTOR_STATE_NAME.FALL;
        }
        return ACTOR_STATE_NAME.AIR_DASH;
    }
}