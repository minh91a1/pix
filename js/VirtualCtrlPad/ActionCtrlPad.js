import Tools from "../Helper/Tools.js";

export default class ActionCtrlPad {
    constructor(scene, x, y, width, height, color) {
        /* model field */
        this._dashKey = -1;
        this._jumpKey = -1;
        this._pointer = undefined;

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

        this._dashRect = this.tools.AddRectangle(scene, x, y, width, height/2, 0x00ffff, 0.25);
        this._jumpRect = this.tools.AddRectangle(scene, x, y + height/2, width, height/2, 0xff00ff, 0.25);
        this._dashRect.setScrollFactor(0);
        this._jumpRect.setScrollFactor(0);
    }

    setVisible(visible) {
        this.phSensorArea.visible = visible;
        this._dashRect.visible = visible;
        this._jumpRect.visible = visible;
    }

    update(time) {
        /* detect if pointer is no longer down */
        if (this._pointer == undefined || this._pointer.getDuration() == this._lastDuration) {
            this._jumpKey = -1;
            this._dashKey = -1;
            this._lastDuration = -1;
            this._pointer = undefined;
            return;
        }
        this._lastDuration = this._pointer.getDuration();

        /* update down time */
        var x = this._pointer.x;
        var y = this._pointer.y;

        if (this.tools.IsContain(this._dashRect,x,y) && this._dashKey == -1) {
            this._dashKey = time;
        }
        if (this.tools.IsContain(this._jumpRect,x,y) && this._jumpKey == -1) {
            this._jumpKey = time;
        }
    }
    
    isDown(key) {
        if (key == 'DASH' && this._dashKey != -1) {
            return true;
        }
        if (key == 'JUMP' && this._jumpKey != -1) {
            return true;
        }
        return false;
    }

    justPressed(key) {
        let curr = this.phScene.time.now;
        let time = 20;
        if (key == 'DASH' && curr - this._dashKey < time) {
            return true;
        }
        if (key == 'JUMP' && curr - this._jumpKey < time) {
            return true;
        }
        return false;
    }
}