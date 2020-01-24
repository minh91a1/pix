export default class TrapObject extends Phaser.GameObjects.Rectangle {
    constructor(scene, player, x, y , width, height, vx, vy, sensorX, sensorY, sensorW, sensorH, fillColor, fillAlpha) {
        super(scene, x, y , width, height , fillColor, fillAlpha);
        this.setOrigin(0,0);

        // model
        this.initX = x;
        this.initY = y;
        this.speedX = vx;
        this.speedY = vy;
        this.alive = true;

        // phaser
        this.scene = scene;
        this.player = player;
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.allowGravity = false;
        this.body.immovable = true;
        this.body.setMaxVelocity(300,500);
        
        // sensor activation
        this.sensorRect = new Phaser.Geom.Rectangle(sensorX, sensorY, sensorW, sensorH, 0x00ff00);
        if (0) { 
            // debug
            this.sensorObj = new Phaser.GameObjects.Rectangle(scene, sensorX, sensorY, sensorW, sensorH, 0x00ff00, 0.25);
            this.sensorObj.setOrigin(0,0)
            scene.add.existing(this.sensorObj);
        }

        //player step on ?
        //let topColMovingBlock = new TopCollisionMovingBlock(this, 11*16, 7*16, 16*3, 16*0.5, 20, 0, 0xfff000);
    }

    reset() {
        console.log('reset')
        if (this.rebornTimedEvent) this.rebornTimedEvent.destroy();
        this.alive = true;
        this.visible = true;
        this.x = this.initX;
        this.y = this.initY;
        this.body.allowGravity = false;
        this.body.setAccelerationX(0);
        this.body.setAccelerationY(0);
    }

    setActive() {
        console.log('active')
        this.body.allowGravity = true;
        this.body.setAccelerationX(this.speedX);
        this.body.setAccelerationY(this.speedY);
    }

    broken() {
        if (!this.alive) {
            return;
        }
        console.log('broken')
        this.alive = false;

        //this.visible = false;
        this.body.allowGravity = false;

        this.rebornTimedEvent = this.scene.time.addEvent({
            delay: 2000,
            callback: this.reset,
            callbackScope: this,
            loop: false,
          });
    }

    update(time) {
        if (!this.alive) {
            return;
        }
        if (!this.player) {
            return;
        }
        
        let playerX = this.player.body.x;
        let playerY = this.player.body.y;
        let playerW = this.player.body.width;
        let playerH = this.player.body.height;

        let playerRect = new Phaser.Geom.Rectangle(playerX, playerY, playerW, playerH);
        var intersect = Phaser.Geom.Rectangle.Intersection(playerRect, this.sensorRect);
        if (intersect.width > 0 || intersect.height > 0) {
            this.setActive();
        }
    }
}