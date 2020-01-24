export default class PhysicObject extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, width, height, centerOrigin) {
        super(scene, x, y, texture, frame, width, height);
        
        /* field model */
        this._id = Phaser.Math.RND.uuid();

        /* phaser */
        scene.add.existing(this);
        scene.physics.world.enable(this);
        
        if (centerOrigin) {
            this.originX = 0.5;
            this.originY = 0.5;
        } else {
            this.originX = 0;
            this.originY = 0;
        }
    }

    getId() {
        return this._id;
    }
}