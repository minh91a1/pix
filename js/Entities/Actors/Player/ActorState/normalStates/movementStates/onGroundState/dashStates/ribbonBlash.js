RibbonBlash = function (game, x, y, direction) {
    Phaser.Sprite.call(this, game, x, y, "lily", "dashRibbon1");
    this.anchor.setTo(0.5);
    
    var anim = this.animations.add("dashRibbon", Phaser.Animation.generateFrameNames("dashRibbon", 1, 6, '', 0), 18, false);
    this.scale.x = direction;
    this.animations.play("dashRibbon");
    anim.onComplete.add(function () {
            this.kill();
        }, this
    );
}

RibbonBlash.prototype = Object.create(Phaser.Sprite.prototype);
RibbonBlash.prototype.constructor = RibbonBlash;