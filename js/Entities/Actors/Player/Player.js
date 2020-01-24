import Actor from "../Actor.js"
import StateMachine from "../../../StateMachine/StateMachine.js"

import NormalState from "./ActorState/normalStates/NormalState.js"
import MovementState from "./ActorState/normalStates/movementStates/MovementState.js"

import OnGroundState from "./ActorState/normalStates/movementStates/onGroundState/OnGroundState.js";
import BasicOnGroundState from "./ActorState/normalStates/movementStates/onGroundState/basicOnGroundStates/BasicOnGroundState.js";
import IdleState from "./ActorState/normalStates/movementStates/onGroundState/basicOnGroundStates/IdleState.js";
import WalkState from "./ActorState/normalStates/movementStates/onGroundState/basicOnGroundStates/WalkState.js";
import DashState from "./ActorState/normalStates/movementStates/onGroundState/dashStates/DashState.js";

import FloatingState from "./ActorState/normalStates/movementStates/floatingStates/FloatingState.js"
import BasicFloatingState from "./ActorState/normalStates/movementStates/floatingStates/basicFloatingStates/BasicFloatingState.js"
import FallState from "./ActorState/normalStates/movementStates/floatingStates/basicFloatingStates/FallState.js"
import JumpState from "./ActorState/normalStates/movementStates/floatingStates/basicFloatingStates/JumpState.js"
import AirDashState from "./ActorState/normalStates/movementStates/floatingStates/airDashState/AirDashState.js"

import ToLadderState from "./ActorState/normalStates/movementStates/onLadderStates/ToLadderState.js";
import FromLadderState from "./ActorState/normalStates/movementStates/onLadderStates/FromLadderState.js";
import OnLadderState from "./ActorState/normalStates/movementStates/onLadderStates/OnLadderState.js";

import Sword from "../../DamageObjects/Sword.js"

import ShootState from "./ActorState/attackStates/bulletAttackStates/ShootState.js";
import Slash1State from "./ActorState/attackStates/swordAttackStates/Slash1State.js";
import Slash2State from "./ActorState/attackStates/swordAttackStates/Slash2State.js";
import Slash3State from "./ActorState/attackStates/swordAttackStates/Slash3State.js";
import DashSlashState from "./ActorState/attackStates/swordAttackStates/DashSlashState.js";
import JumpSlashState from "./ActorState/attackStates/swordAttackStates/JumpSlashState.js";

import HurtState from "./ActorState/hurtStates/HurtState.js";
import LandState from "./EnviromentState/LandState.js";
import WaterState from "./EnviromentState/WaterState.js";

export default class Player extends Actor {
    constructor(scene, x, y, textureKey) {
        super(scene, x, y, textureKey, 0, 0, 0, true);

        this.textureKey = textureKey;

        this.createAnimation(scene);

        // Specification Properties
        this.initX = x;
        this.initY = y;

        this.kind = "player";
        this.alive = true;
        this.queueInputAttack = [];
        
        this.walkSpeed = 50;
        this.maxWalkSpeed = this.walkSpeed + 20;
        this.maxFallSpeed = 200;
        this.dashSpeedUp = 2;
        this.slowSpeedDown = 0.25;
        this.jumpSpeed = -200;
        this.slideWallRate = 0.15;
        
        this._isBlinking = false;
        //this._blinktween = game.add.tween(this).to( { alpha: 1 }, /*period(ms)*/150, "Linear", false, /*delay*/0, /*repeat*/15);
        //this._blinktween.onComplete.add(this.onBlinkComplete, this);

        this._isOnTopCollisionOnly = false;
        this._ignoreCollision = false;

        this._isTouchLadder = false;
        this._isAboveLadder = false;
        this._ladderBlock = undefined;

        this._isTouchMovingPlatform = false;

        this._startIgnoreMoveLeftRight = -1; // for wall jump

        this._touchedEnemy;

        this._isOverlapTile = false;
        this._overlapTileInfo = {dx:-1,dy:-1};

        this._airDashTime = 0;
        this._maxAirDashTime = 1;

        this.createState();
        this.createEnviromentState();
        this.createSound(scene);
        this.setControl();

        this.setDrag(0, 0)
            .setMaxVelocity(this.maxWalkSpeed, this.maxFallSpeed)
            .setSize(5, 9)
            .setOffset(0, 0);

        this.sword = new Sword(scene, this, 2*16, 2*16, 'sword', 1, 1);
        scene.playerDamageObjectContainer.add(this.sword);
    }

    createAnimation(scene) {
        const anims = scene.anims;
        anims.create({
            key: this.textureKey + "-idle",
            frames: anims.generateFrameNames(this.textureKey, { start: '', end: '', zeroPad: undefined, prefix: 'idle', suffix: '' }),
            frameRate: 6,
            repeat: -1
        });
        anims.create({
            key: this.textureKey + "-walk",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 2, zeroPad: undefined, prefix: 'walk', suffix: '' }),
            frameRate: 12,
            repeat: -1
        });
        anims.create({
            key: this.textureKey + "-jump",
            frames: anims.generateFrameNames(this.textureKey, { start: '', end: '', zeroPad: undefined, prefix: 'jump', suffix: '' }),
            frameRate: 12,
            repeat: -1
        });
        anims.create({
            key: this.textureKey + "-fall",
            frames: anims.generateFrameNames(this.textureKey, { start: '', end: '', zeroPad: undefined, prefix: 'fall', suffix: '' }),
            frameRate: 12,
            repeat: -1
        });
        anims.create({
            key: this.textureKey + "-ladder",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 2, zeroPad: undefined, prefix: 'ladder', suffix: '' }),
            frameRate: 12,
            repeat: -1
        });
        anims.create({
            key: this.textureKey + "-slide",
            frames: anims.generateFrameNames(this.textureKey, { start: '', end: '', zeroPad: undefined, prefix: 'slide', suffix: '' }),
            frameRate: 12,
            repeat: 0
        });
    }

    createAnimation2(scene) {
        const anims = scene.anims;
        anims.create({
            key: this.textureKey + "-idle",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 4, zeroPad: undefined, prefix: 'idle', suffix: '' }),
            frameRate: 6,
            repeat: -1
        });
        anims.create({
            key: this.textureKey + "-walk",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 4, zeroPad: undefined, prefix: 'walk', suffix: '' }),
            frameRate: 12,
            repeat: -1
        });
        anims.create({
            key: this.textureKey + "-jump",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 3, zeroPad: undefined, prefix: 'jump', suffix: '' }),
            frameRate: 12,
            repeat: -1
        });
        anims.create({
            key: this.textureKey + "-fall",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 3, zeroPad: undefined, prefix: 'fall', suffix: '' }),
            frameRate: 12,
            repeat: -1
        });
        anims.create({
            key: this.textureKey + "-dash",
            frames: anims.generateFrameNames(this.textureKey, { start: '', end: '', zeroPad: undefined, prefix: 'dash', suffix: '' }),
            frameRate: 12,
            repeat: -1
        });
        anims.create({
            key: this.textureKey + "-ladder",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 5, zeroPad: undefined, prefix: 'ladder', suffix: '' }),
            frameRate: 12,
            repeat: -1
        });
        anims.create({
            key: this.textureKey + "-attack1",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 6, zeroPad: undefined, prefix: 'attack', suffix: '' }),
            frameRate: 12,
            repeat: 0
        });
        anims.create({
            key: this.textureKey + "-attack2",
            frames: anims.generateFrameNames(this.textureKey, { start: 7, end: 12, zeroPad: undefined, prefix: 'attack', suffix: '' }),
            frameRate: 12,
            repeat: 0
        });
        anims.create({
            key: this.textureKey + "-attack3",
            frames: anims.generateFrameNames(this.textureKey, { start: 13, end: 18, zeroPad: undefined, prefix: 'attack', suffix: '' }),
            frameRate: 12,
            repeat: 0
        });
        anims.create({
            key: this.textureKey + "-attackDash",
            frames: anims.generateFrameNames(this.textureKey, { start: 19, end: 25, zeroPad: undefined, prefix: 'attack', suffix: '' }),
            frameRate: 12,
            repeat: 0
        });
        anims.create({
            key: this.textureKey + "-attackJump",
            frames: anims.generateFrameNames(this.textureKey, { start: 32, end: 38, zeroPad: undefined, prefix: 'attack', suffix: '' }),
            frameRate: 12,
            repeat: 0
        });
        anims.create({
            key: this.textureKey + "-slide",
            frames: anims.generateFrameNames(this.textureKey, { start: 1, end: 1, zeroPad: undefined, prefix: 'slide', suffix: '' }),
            frameRate: 12,
            repeat: 0
        });
    }

    createState() {
        this._stateMachine = new StateMachine();
        this._stateMachine.addState(ACTOR_STATE_NAME.NORMAL, new NormalState(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.MOVEMENT, new MovementState(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.ON_GROUND, new OnGroundState(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.BASIC_ON_GROUND, new BasicOnGroundState(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.IDLE, new IdleState(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.WALK_LEFT, new WalkState(this,'left'));
        this._stateMachine.addState(ACTOR_STATE_NAME.WALK_RIGHT, new WalkState(this,'right'));
        this._stateMachine.addState(ACTOR_STATE_NAME.DASH, new DashState(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.AIR_DASH, new AirDashState(this));
    
        this._stateMachine.addState(ACTOR_STATE_NAME.FLOATING, new FloatingState(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.BASIC_FLOATING, new BasicFloatingState(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.JUMP, new JumpState(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.FALL, new FallState(this));
        
        this._stateMachine.addState(ACTOR_STATE_NAME.ON_LADDER, new OnLadderState(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.TO_LADDER, new ToLadderState(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.FROM_LADDER, new FromLadderState(this));
    
        this._stateMachine.addState(ACTOR_STATE_NAME.HURT, new HurtState(this));
        // this._stateMachine.addState(ACTOR_STATE_NAME.DEATH, new DeathState(this));
        
        this._stateMachine.addState(ACTOR_STATE_NAME.ATTACK1, new ShootState(this));
        //this._stateMachine.addState(ACTOR_STATE_NAME.ATTACK1, new Slash1State(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.ATTACK2, new Slash2State(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.ATTACK3, new Slash3State(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.DASHATTACK, new ShootState(this));
        this._stateMachine.addState(ACTOR_STATE_NAME.JUMPATTACK, new ShootState(this));
        //this._stateMachine.addState(ACTOR_STATE_NAME.DASHATTACK, new DashSlashState(this));
        //this._stateMachine.addState(ACTOR_STATE_NAME.JUMPATTACK, new JumpSlashState(this));
        
        this._stateMachine.setInitialState(ACTOR_STATE_NAME.IDLE);
    }

    createSound(scene) {
        this.jumpSound = scene.sound.add('jump');
    }

    createEnviromentState() {
        this._enviromentStateMachine = new StateMachine();
        this._enviromentStateMachine.addState('LAND_STATE', new LandState(this));
        this._enviromentStateMachine.addState('WATER_STATE', new WaterState(this));
        this._enviromentStateMachine.setInitialState('LAND_STATE');
    }

    setControl() {
        this.moveLeftKey = 'LEFT';
        this.moveRightKey = 'RIGHT';
        this.moveDownKey = 'DOWN';
        this.moveUpKey = 'UP';
    
        this.attackKey = 'ATTACK';
        this.jumpKey = 'JUMP';
        this.dashKey = 'DASH';

        this.talkKey = 'DOWN';
    }

    setVirtualCtrlPad(virtualKeyPad) {
        this.VirtualCtrlPad = virtualKeyPad;
    }

    resetStatus() {
        this.setIsTouchLadder(false);
        this.setIsOnTopCollisionOnly(false);
        this.setIsAboveLadder(false);
        this.setIsTouchMovingPlatform(false);
        this.setEnviroment(1);
    }

    update(time) {
        this._stateMachine.update(time);
        this._enviromentStateMachine.update(time);
    }

    destroy() {
        this.destroy();
    }

    getHurt(byObject) {
        if ((this.body.x + this.body.width / 2) < (byObject.body.x + byObject.body.width / 2)) {
            this._hurtDir = 1;
        } else {
            this._hurtDir = -1;
        }
        this._stateMachine.changeState(ACTOR_STATE_NAME.HURT);
    }

    //*================*//
    //* Player GET-SET *//
    //*================*//
    getTouchedEnemy() {
        return this._touchedEnemy;
    }

    getStartIgnoreMoveLeftRight() {
        return this._startIgnoreMoveLeftRight;
    }

    setStartIgnoreMoveLeftRight(ignoreTime) {
        this._startIgnoreMoveLeftRight = ignoreTime;
    }

    // Air Dash Time - you can only dash 1 or 2 time while still on air //
    setAirDashTime(num) {
        this._airDashTime = num;
    }
    
    getAirDashTime() {
        return this._airDashTime;
    }

    isOnGround() {
        var onGround = false;
        if (this.body.onFloor()) {
            onGround = true;
        }
        if (this.isTouchMovingPlatform()) {
            onGround = true;
        }
        return onGround;
    }

    // moving platform //
    isTouchMovingPlatform() {
        return this._isTouchMovingPlatform;
    }
    
    setIsTouchMovingPlatform(isTouching) {
        this._isTouchMovingPlatform = isTouching;
        if (isTouching) {
            this.body.velocity.y = 0;
        }
    }

    // ladder //
    isTouchLadder() {
        return this._isTouchLadder;
    }

    setIsTouchLadder(isTouchLadder) {
        this._isTouchLadder = isTouchLadder;
    }
    
    isAboveLadder() {
        return this._isAboveLadder;
    }
    
    setIsAboveLadder(isAboveLadder) {
        this._isAboveLadder = isAboveLadder;
    }

    getLadderBlock() {
        return this._ladderBlock;
    }

    setLadderBlock(block) {
        this._ladderBlock = block;
    }

    // ignore collision //
    setIgnoreCollision(ignore) {
        this._ignoreCollision = ignore;
    }

    IsIgnoreCollision() {
        return this._ignoreCollision;
    }

    // top collision tile block
    setIsOnTopCollisionOnly(isOnTop) {
        this._isOnTopCollisionOnly = isOnTop;
    }

    isOnTopCollisionOnly() {
        return this._isOnTopCollisionOnly;
    }

    getEnviroment() {
        return this._enviroment;
    }

    setEnviroment(env) {
        this._enviroment = env;
    }
}