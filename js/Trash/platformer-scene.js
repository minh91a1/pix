import Player from "./Actors/player.js";
import Marker from "./MouseTileMarker.js";

export default class PlatformerScene extends Phaser.Scene {
    preload() {
        // Runs once, loads up assets like images and audio
        this.load.image("mario-tiles", "../assets/tilesets/super-mario-tiles.png");
        this.load.tilemapTiledJSON("map", "../assets/tilemaps/map.json");
        this.load.atlas('emily',  '../assets/atlast/emily.png', '../assets/atlast/emily.json');
    }

    create() {
        // When loading from an array, make sure to specify the tileWidth and tileHeight
        const map = this.make.tilemap({ key: "map" });
        // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
        // Phaser's cache (i.e. the name you used in preload)
        const tileset = map.addTilesetImage("world01", "mario-tiles");

        // Parameters: layer name (or index) from Tiled, tileset, x, y
        const belowLayer = map.createDynamicLayer("Below Player", tileset, 0, 0);
        this.worldLayer = map.createDynamicLayer("World", tileset, 0, 0);
        const aboveLayer = map.createDynamicLayer("Above Player", tileset, 0, 0);

        this.worldLayer.setCollisionByProperty({ collides: true });

        this.player = new Player(this, 16, 16);

        this.physics.add.collider(this.player.sprite, this.worldLayer);

        this.cameras.main.startFollow(this.player.sprite);
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        this.marker = new Marker(this, map);
    }

    update() {
        // Allow the player to respond to key presses and move itself
        this.player.update();
        this.marker.update();

        if (this.player.sprite.y > this.worldLayer.height) {
            this.player.destroy();
            this.scene.restart();
        }

        const pointer = this.input.activePointer;
        const worldPoint = pointer.positionToCamera(this.cameras.main);
        if (pointer.isDown) {
        const tile = this.worldLayer.putTileAtWorldXY(40, worldPoint.x, worldPoint.y);
        tile.setCollision(true);
        }
    }
}

/*
//player update
const keys = this.keys;
const sprite = this;
const onGround = sprite.body.blocked.down;
const acceleration = onGround ? 600 : 200;

if (keys.left.isDown || keys.a.isDown) {
    sprite.setAccelerationX(-acceleration);
    // No need to have a separate set of graphics for running to the left & to the right. Instead
    // we can just mirror the sprite.
    sprite.setFlipX(true);
} else if (keys.right.isDown || keys.d.isDown) {
    sprite.setAccelerationX(acceleration);
    sprite.setFlipX(false);
} else {
    sprite.setAccelerationX(0);
}

if (onGround && (keys.up.isDown || keys.w.isDown)) {
    sprite.setVelocityY(-500);
}

// Update the animation/textureKey based on the state of the player
if (onGround) {
    if (sprite.body.velocity.x !== 0) {
        sprite.anims.play(this.textureKey + "-walk", true);
    }
    else {
        sprite.anims.play(this.textureKey + "-idle", true);
    }
} else {
    if (sprite.body.velocity.y < 0) {
        sprite.anims.play(this.textureKey + "-jump", true);
    } else {
        sprite.anims.play(this.textureKey + "-fall", true);
    }
}
*/



/* slow down */
////this.tweens.timeScale = 0.5; // tweens
//scene.physics.world.timeScale = 5.5; // physics
////this.time.timeScale = 10.5; // time events
//scene.player.sword.anims.setTimeScale(0.5);