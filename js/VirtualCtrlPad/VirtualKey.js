import Tools from "../Helper/Tools.js";

export default class VirtualKey {
    constructor(scene, key, x, y, width, height, color) {
        /* model field */
        this._downTime = -1;
        this._key = key;

        /* create  */
        this.phScene = scene;
        this.tools = new Tools();
        this.phSensorArea = this.tools.AddRectangle(scene, x, y, width, height, color, 0.5);
        this.phSensorArea.setScrollFactor(0);
        this.phSensorArea.setInteractive();
        this.phSensorArea.parentElement = this;
        this.phSensorArea.on('pointerdown', function(pointer, x, y) {
            this.parentElement._pointer = pointer;
        });
    }

    setVisible(visible) {
        this.phSensorArea.visible = visible;
    }

    update(time) {
        /* detect if pointer is no longer down */
        if (this._pointer == undefined || this._pointer.getDuration() == this._lastDuration) {
            this._downTime = -1;
            this._lastDuration = -1;
            this._pointer = undefined;
            return;
        }
        this._lastDuration = this._pointer.getDuration();

        if (this._downTime == -1) {
            this._downTime = time;    
        }
    }
    
    isDown(key) {
        if (key == this._key && this._downTime != -1) {
            return true;
        }
        return false;
    }

    justPressed(key) {
        let curr = this.phScene.time.now;
        let time = 20;
        if (key == this._key && curr - this._downTime < time) {
            return true;
        }
        return false;
    }
}
