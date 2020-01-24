import PhysicObject from "../PhysicObject.js"
import Tools from "../../Helper/Tools.js"

export default class BaseDamageObject extends PhysicObject {
    constructor(scene, ownerSprite, x, y, texture, frame, width, height, centerOrigin) {
        super(scene, x, y, texture, frame, width, height, centerOrigin)
        this.body.allowGravity = false;

        /* field model */
        this._id = -1;
        this._damage = 1;
        this._ownerSprite = ownerSprite;
        this._collidedObjects = [];

        /* phaser */
        this.scene = scene;
    }

    addToCollidedObjects(key, object) {
        if (this._collidedObjects.hasOwnProperty(key)) {
            return false;
        }
        this._collidedObjects[key] = object;
        return true;
    }
    
    clearCollidedObjects() {
        this._collidedObjects = [];
    }


    changeId() {
        this._id++;
    }

    getId() {
        return this._id;
    }

    setDamage(damage) {
        this._damage = damage;
    }

    getDamage() {
        return this._damage;
    }

    getOwner() {
        return this._ownerSprite;
    }

    setEnable(isEnable) {
        if (isEnable) {
            this.body.enable = true;
        } else {
            this.body.enable = false;
        }
    }
}