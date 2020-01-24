export default class TopCollisionMovingBlock extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y , width, height, vx, vy, fillColor, fillAlpha, x1, y1, x2, y2, speed) {
        super(scene, x, y , width, height , fillColor, fillAlpha);
        this.setOrigin(0,0);
        // model
        this.speedX = vx;
        this.speedY = vy;

        // phaser
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.immovable = true;
        
        this.body.velocity.x = this.speedX;
        this.body.velocity.y = this.speedY;

    }

    update(time) {
    }
}