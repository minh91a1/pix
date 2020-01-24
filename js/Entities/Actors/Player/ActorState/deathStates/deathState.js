DeathState = function(ownerSprite) {
    BaseState.call(this,ACTOR_STATE_NAME.DEATH,ownerSprite);
    this._startTime = -1;
}

DeathState.prototype = Object.create(BaseState.prototype);
DeathState.prototype.constructor = DeathState;

DeathState.prototype.enter = function() {
    this._ownerSprite.animations.play('attackJump');
    this._ownerSprite.scale.x = this._ownerSprite._hurtDir;

    this._ownerSprite._speedUp = 1;
    this._ownerSprite.body.gravity.x = 0;
    this._ownerSprite.body.gravity.y = 0;
    this._ownerSprite.body.velocity.x = -(this._ownerSprite._hurtDir)*30;
    this._ownerSprite.body.velocity.y = -120;

    this._startTime = game.time.totalElapsedSeconds();
    game.camera.unfollow();
    game.camera.shake(0.02, 500, true);
}

DeathState.prototype.update = function() {
    if (this._startTime != -1) {
        let delta = game.time.totalElapsedSeconds() - this._startTime;
        if (delta > 2) {
            this._startTime = -1;
            MEDIATOR.raiseEvent(EVENT_NAME.PLAYER_DIED, this._ownerSprite);
        }

        if (this._ownerSprite.body.velocity.y < 300) {
            this._ownerSprite.body.velocity.y += 5;
        }
    }

    return ACTOR_STATE_NAME.DEATH;
}