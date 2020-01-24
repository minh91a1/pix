import BaseScene from "./BaseScene.js";
import Player from "../Entities/Actors/Player/Player.js";
import Tools from "../Helper/Tools.js";
import VirtualKeyPad from "../VirtualCtrlPad/VirtualCtrlPad.js"
import EaterTree from "../Entities/Actors/Enemies/EaterTree/EaterTree.js";
import TopCollisionMovingBlock from "../Entities/MovingObjects/TopCollisionMovingBlock.js"

import Villager from "../Entities/Actors/NPCs/Villager.js"
import TrapObject from "../Entities/DamageObjects/TrapObject.js";
import DeadPix from "../Entities/Actors/Enemies/Zombie/DeadPix.js";
import ChangeDirectionObject from "../Entities/StaticObjects/ChangeDirectionObj.js";

export default class World01Scene extends BaseScene {

    constructor() {
        super("world01");
    }

    preload() {
        super.preload();

        /* Damge Object */
        this.load.atlas('sword', '../../assets/atlas/sword.png', '../../assets/atlas/sword.json');
        
        /* Actor */
        this.load.atlas('lily', '../../assets/atlas/lily.png', '../../assets/atlas/lily.json');
        this.load.atlas('emily', '../../assets/atlas/emily.png', '../../assets/atlas/emily.json');
        this.load.atlas('pix', '../../assets/atlas/pix.png', '../../assets/atlas/pix.json');

        /* Enemies */
        this.load.atlas('atlas', '../../assets/atlas/atlas.png', '../../assets/atlas/atlas.json');
        this.load.atlas('pixatlast', '../../assets/atlas/pixatlast.png', '../../assets/atlas/pixatlast.json');

        /* Tiles */
        this.load.image("collision-tileset", "../../assets/enviroment/collisions.png");
        this.load.image("pix-tileset", "../../assets/enviroment/pixtileset.png");
        this.load.tilemapTiledJSON("map", "../../assets/maps/map.b.json");
        //this.load.tilemapTiledJSON("map", "../../assets/maps/libraryFired.json");

        /* bitmap text */
        this.load.bitmapFont('bitmaptext', '../../assets/fonts/bitmapFont.png', '../../assets/fonts/bitmapFont.xml');

        /* other */
        this.load.image("bubble-notice", "../../assets/sprites/bubblenotice.png");
        this.load.image("bg_1", "../../assets/sprites/background.png");
        this.load.image("bg_2", "../../assets/sprites/middleground.png");

        /* soundtrack */
        this.load.audio('jump', '../../assets/sound/jump.wav');
        this.load.audio('talk', '../../assets/sound/talk.ogg');
    }

    create() {
        super.create();

        /* drag move control & action key */
        this.input.addPointer(2);
        this.virtualKeyPad = new VirtualKeyPad(this);

        this.createContainers();

        const map = this.buildWorld();

        this.collisionLogic();

        this.createBackground();        

        /* camera */
        if (this.player) {
            this.cameras.main.startFollow(this.player);
            this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
            this.cameras.main.setDeadzone(50, 200);
            this.cameras.main.setLerp(0.15);
        }
        
        /* debug graphic */
        if (0) {
            const debugGraphics = this.add.graphics().setAlpha(0.75);
            this.collisionLayer.renderDebug(debugGraphics, {
                tileColor: null, // Color of non-colliding tiles
                collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
                faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
            });
        }
    }

    /* CREATION */
    createContainers() {
        this.enemiesContainer = this.add.group({ runChildUpdate: true });
        this.playerDamageObjectContainer = this.add.group({ runChildUpdate: true });
        this.enemiesDamageObjectContainer = this.add.group({ runChildUpdate: true });
        this.movingObjectContainer = this.add.group({ runChildUpdate: true });
        this.changeDirectionObjectContainer = this.add.group();
        this.trapObjectContainer = this.add.group({ runChildUpdate: true });
        this.npcContainer = this.add.group({ runChildUpdate: true });
    }

    buildWorld() {
        const map = this.make.tilemap({ key: "map" });
        // world presentaion Layer //
        const tileset = map.addTilesetImage('pixtileset', 'pix-tileset');
        this.worldLayer = map.createStaticLayer("Main Layer", tileset, 0, 0);
        // collision layer //
        const collisions = map.addTilesetImage('collisions','collision-tileset-x');
        this.collisionLayer = map.createStaticLayer("Collision Layer", collisions, 0, 0);

        this.collisionLayer.setCollision([1]);
        let mapWidth = this.collisionLayer.width;
        let mapHeight = this.collisionLayer.height;
        for (let x = 0; x < mapWidth; x++) {
            for (let y = 0; y < mapHeight; y++) {
                let tile = this.collisionLayer.getTileAt(x,y);
                if (tile != null) {

                    switch (tile.index) {
                        case Constants.TileType.PLAYER:
                            this.player = this.createPlayer(x, y);
                            break;
                        case Constants.TileType.NPC:
                            this.createNPC(x, y);
                            break;
                        case Constants.TileType.TOP_COLLISION:
                            tile.setCollision(false, false, true, false, /* recalculateFaces */ false);

                            let tileleft = this.collisionLayer.getTileAt(x-1,y);
                            let tileright = this.collisionLayer.getTileAt(x+1,y);
                            if (tileleft)
                                tileleft.setCollision(false, false, true, false, /* recalculateFaces */ false);
                            if (tileright)
                                tileright.setCollision(false, false, true, false, /* recalculateFaces */ false);
                            break;
                        
                        case Constants.TileType.X_AXIS_MOVING_OBJ:
                        case Constants.TileType.Y_AXIS_MOVING_OBJ:
                            let leftTile = this.collisionLayer.getTileAt(x-1,y);
                            if (!leftTile || (leftTile && leftTile.index != tile.index)) {
                                let movObjWidth = 1;
                                let rightTile = this.collisionLayer.getTileAt(x + movObjWidth,y);
                                while (rightTile && rightTile.index == tile.index) {
                                    movObjWidth++;
                                    rightTile = this.collisionLayer.getTileAt(x + movObjWidth,y);
                                }
                                if (tile.index == Constants.TileType.X_AXIS_MOVING_OBJ) {
                                    this.createMovingObj(x,y,movObjWidth,0.5,20,0);
                                } else {
                                    this.createMovingObj(x,y,movObjWidth,0.5,0,20);
                                }
                            }
                            break;
                        case Constants.TileType.TRAP_OBJ:
                            break;
                        case Constants.TileType.SPIKE:
                            break;
                        case Constants.TileType.ENEMY:
                            this.createEnemy(x, y);
                            break;
                        case Constants.TileType.CHANGE_DIRECT:
                            this.createChangeDirectionObj(x, y);
                            break;
                        default:
                            break;
                    }
                }
            }
        }

        return map;
    }

    collisionLogic() {
        this.physics.add.collider(this.enemiesContainer, this.collisionLayer);
        this.physics.add.overlap(this.playerDamageObjectContainer, this.enemiesContainer, this.onDamagerObjectOverlappedEnemies);
        this.physics.add.overlap(this.enemiesDamageObjectContainer, this.player, this.onDamagerObjectOverlappedPlayer);
        this.physics.add.overlap(this.enemiesDamageObjectContainer, this.playerDamageObjectContainer, this.onEnemyDamagerObjectOverlappedPlayerDamgeObject);

        this.physics.add.collider(this.trapObjectContainer, this.collisionLayer, this.onTrapObjectCollideCollisionLayer);
        this.physics.add.collider(this.npcContainer, this.collisionLayer);
        this.physics.add.overlap(this.npcContainer, this.player, this.onNPCOverlappedPlayer);

        this.physics.add.overlap(this.enemiesContainer, this.changeDirectionObjectContainer, this.onObjOverlappedChangeDirectionObj);
        this.physics.add.overlap(this.movingObjectContainer, this.changeDirectionObjectContainer, this.onObjOverlappedChangeDirectionObj);
    }

    createBackground() {
        this.bg1 = this.add.tileSprite(0,0, this.sys.game.config.width, this.sys.game.config.height, 'bg_1');
        this.bg1.setOrigin(0,0);
        this.bg1.setScrollFactor(0);
        this.bg1.setDepth(-2);

        this.bg2 = this.add.tileSprite(0,0, this.sys.game.config.width, this.sys.game.config.height, 'bg_2');
        this.bg2.setOrigin(0,0);
        this.bg2.setScrollFactor(0);
        this.bg2.setDepth(-1);
    }

    createPlayer(tileX, tileY) {
        let player = new Player(this, tileX*16, tileY*16, 'pix');
        player.setDepth(10);
        player.setVirtualCtrlPad(this.virtualKeyPad);

        return player;
    }

    createNPC(tileX, tileY) {
        let villager = new Villager(this, tileX*16, tileY*16, 'emily', "You're so small._Are you sure you will be ok?");
        this.npcContainer.add(villager);
    }

    createEnemy(tileX, tileY) {
        let deadPix = new DeadPix(this, tileX*16, tileY*16, 'pixatlast');
        this.enemiesContainer.add(deadPix);
        //let eaterTree = new EaterTree(this, 26*16, 4*16, 'atlas');
        //this.enemiesContainer.add(eaterTree);
    }

    createMovingObj(tileX, tileY, tileWidth, tileHeight, speedX, speedY) {
        let topColMovingBlock = new TopCollisionMovingBlock(this, tileX*16, tileY*16, tileWidth*16, tileHeight*16, speedX, speedY, 0xfff000);
        this.movingObjectContainer.add(topColMovingBlock);
    }

    createTrapObj(tileX, tileY, tileWidth, tileHeight) {
        let trapObject = new TrapObject(this, this.player, tileX*16, tileY*16, tileWidth*16, tileHeight*16, 0, 120, 11*16, 1*16, 16*3, 16*10, 0xff0000);
        this.trapObjectContainer.add(trapObject);
    }

    createChangeDirectionObj(tileX, tileY) {
        let changeDirect = new ChangeDirectionObject(this, tileX, tileY);
        this.changeDirectionObjectContainer.add(changeDirect);
    }

    /* UPDATE */
    update(time) {
        /* background */
        this.bg1.tilePositionX = this.cameras.main.scrollX * 0.3;
        this.bg2.tilePositionX = this.cameras.main.scrollX * 0.2;

        if (this.player) {
            /* update step 01 */
            this.player.resetStatus();

            /* checking overlap */
            this.physics.world.overlap(this.player, this.collisionLayer, this.onPlayerOverlappedWorld);
            this.physics.world.overlap(this.player, this.trapObjectContainer,  this.onPlayerOverlappedTrapObject);

            if (!this.player.IsIgnoreCollision()) {
                this.physics.world.collide(this.player, this.collisionLayer, this.onPlayerCollidedWorld);

                /* checking collide moving objects */
                this.physics.world.overlap(this.player, this.movingObjectContainer, this.onPlayerCollideTopCollisionMovingObjects);
            }

            /* entities update */
            this.player.update(time);

            /* debug */
            this.player.body.debugBodyColor = this.player.body.touching.none ? 0x0099ff : 0xff9900;
        }
        
        this.virtualKeyPad.update(time);

        /* enemies */
        
    }

    /* COLLISION LOGIC */
    onObjOverlappedChangeDirectionObj(obj, changeDirectObj) {
        obj.body.velocity.x *= -1;
        obj.body.velocity.y *= -1;
    }

    onDamagerObjectOverlappedEnemies(damageObject, enemy) {
        if (damageObject.addToCollidedObjects(enemy.getId(), enemy)) {
            enemy.onGetHit(damageObject);
            //console.log('hit');
            damageObject.destroy();
        }
    }

    onDamagerObjectOverlappedPlayer(damageObject, player) {
        if (damageObject.addToCollidedObjects(player.getId(), player)) {
            player.getHurt(damageObject);
        }
    }

    onEnemyDamagerObjectOverlappedPlayerDamgeObject(damageObjectEnemy, damageObjectPlayer) {
        damageObjectEnemy.destroy();
    }

    onPlayerCollideTopCollisionMovingObjects(player, movingObject) {
        if (player.body.velocity.y < 0) {
            return;
        }

        let x1 = player.body.x;
        let y1 = player.body.y;
        let w1 = player.body.width;
        let h1 = player.body.height;

        let x2 = movingObject.body.x;
        let y2 = movingObject.body.y;
        let w2 = movingObject.body.width;
        let h2 = movingObject.body.height;
        
        let rectPlayer = new Phaser.Geom.Rectangle(x1,y1,w1,h1);
        let rectMovObj = new Phaser.Geom.Rectangle(x2,y2,w2,h2);

        if (rectPlayer.centerY > rectMovObj.centerY) {
            return;
        }

        var intersect = Phaser.Geom.Intersects.GetRectangleIntersection(rectPlayer, rectMovObj);
        var dy = intersect.height;

        if (dy > 5) {
            return;
        }

        if (player.body.y < movingObject.body.y) {
            player.body.y = movingObject.body.y + 2 - player.body.height;
            player.body.x += (movingObject.body.position.x - movingObject.body.prev.x);
            player.setIsTouchMovingPlatform(true);
        } else {
            // do nothing
        }

        return;
    }

    onPlayerCollidedWorld(player, block) {
        if (block.index == 1) {
            // there mind be a chance that player is on block 1
            // and the right side is block 2, but arcade push player on top
            // already so block 2 on the right side is never touch --> can not check if above ladder
            // we need to check manually
            let scene = player.scene;
            let blockRight = scene.collisionLayer.getTileAt(block.x + 1,block.y);
            if (blockRight && blockRight.index == 2) { // this is block 2
                
                let playerX = player.body.position.x;
                let playerW = player.body.width;

                let blockX = block.x * block.width;
                let blockW = block.width;

                let delta = (blockX + blockW - playerX) / playerW;
                if (delta < 0.4) { // player is mostly on block 2 then ok too !
                    player.setIsOnTopCollisionOnly(true);
                }
            }

            // check above ladder //
            if (player.isOnTopCollisionOnly()) {
                let scene = player.scene;
                var blockDown = scene.collisionLayer.getTileAt(block.x + 1, block.y + 1); // notice that we take the below block on the right !
                if (blockDown != null && blockDown.index == 4) {
                    player.setIsAboveLadder(true);
                    player.setLadderBlock(blockDown);
                }
            }
        }

        // check player above only OnTopCollision block //
        if (block.index == 2) {
            let scene = player.scene;
            
            let playerX = player.body.position.x;
            let playerW = player.body.width;

            let blockX = block.x * block.width;
            let blockW = block.width;

            if (playerX > blockX) { // player is on the right side of block 2
                if (playerX + playerW < blockX + blockW) {
                    // player is completely above block 2
                    player.setIsOnTopCollisionOnly(true);
                }

                if (playerX + playerW >= blockX + blockW) {
                    // player is touch both blocks (block 2 and other block <-- need to check)
                    let blockRight = scene.collisionLayer.getTileAt(block.x + 1,block.y);
                    if (blockRight == null || // nothing here !
                        blockRight.index == 2) { // or another block 2 !
                        player.setIsOnTopCollisionOnly(true);
                    } else { // block is not 2
                        let delta = (blockX + blockW - playerX) / playerW;
                        if (delta > 0.6) { // player is mostly on block 2 then ok too !
                            player.setIsOnTopCollisionOnly(true);
                        }
                    }

                }
            } else { // player is on the left side of block 2
                // since the right side block is already block 2 we only need to check if the left side is nothing
                // (because if the left side is block 1, arcade already push player to top, so the block on the right is never touch)
                let blockLeft = scene.collisionLayer.getTileAt(block.x - 1, block.y);
                if (blockLeft == null) { // nothing here !
                    player.setIsOnTopCollisionOnly(true);
                }
            }

            // check above ladder //
            if (player.isOnTopCollisionOnly()) {
                let scene = player.scene;
                var blockDown = scene.collisionLayer.getTileAt(block.x, block.y + 1);
                if (blockDown != null && blockDown.index == 4) {
                    player.setIsAboveLadder(true);
                    player.setLadderBlock(blockDown);
                }
            }
        }
    }

    onPlayerOverlappedWorld(player, block) {
        if (block.index == 1) {

            ///
            var x1 = player.body.x;
            var y1 = player.body.y;
            var w1 = player.body.width;
            var h1 = player.body.height;

            var x2 = block.worldX;
            var y2 = block.worldY;
            var w2 = block.width;
            var h2 = block.height;

            var rect1 = new Phaser.Geom.Rectangle(x1,y1,w1,h1);
            var rect2 = new Phaser.Geom.Rectangle(x2,y2,w2,h2);

            var intersect = Phaser.Geom.Rectangle.Intersection(rect1,rect2);

            var dx = intersect.width;
            var dy = intersect.height;
            ///

            // player.setIsOverlapTile(true);
            // player.setOverlapTileInfo(dx,dy);
        }
        
        
        if (block.index == 4) {
            player.setIsTouchLadder(true);
            player.setLadderBlock(block);
        } else {
            /* NOTE: player can touch many other block same time, which may not the ladder, so do NOT set isTouchLadder to false */
            //player.setIsTouchLadder(false);
        }

        if (block.index == 3) {
            player.setEnviroment(3);
        }
    }

    onNPCOverlappedPlayer(npc, player) {
        if (player.VirtualCtrlPad.justPressed(player.talkKey)) {
            npc.talk(player);
        }
    }

    onTrapObjectCollideCollisionLayer(trapObject, block) {
        if (trapObject.alive) {
            trapObject.broken();
            trapObject.scene.cameras.main.shake(100, 0.01);
        }
    }

    onPlayerOverlappedTrapObject(player, trapObject) {
        if (trapObject.body.velocity.x != 0 || trapObject.body.velocity.y != 0) {
            player.getHurt(trapObject);
        }
    }
}