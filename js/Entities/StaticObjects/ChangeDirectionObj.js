export default class ChangeDirectionObject extends Phaser.GameObjects.Rectangle {
    constructor(scene, x, y) {
        super(scene, x*16, y*16, 16, 16, 0xFFFF00, 0.25);
        this.setOrigin(0,0);

        // model
        this.initX = x;
        this.initY = y;

        // phaser
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.immovable = true;
    }
}