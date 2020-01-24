import Tools from "../Helper/Tools.js";

export default class MoveCtrlPad {
    constructor(scene, x, y, size, color) {
        
        /* model field */
        this._initX = x;
        this._initY = y;
        this._moveLeft = -1;
        this._moveRight = -1;
        this._moveUp = -1;
        this._moveDown = -1;
        this.phScene = scene;

        this.tools = new Tools();
        /* create static pad */
        this.phStaticPad = this.tools.AddCircle(scene, x, y, size*2.5, 0xffffff, 0.25);
        this.phStaticPad.setScrollFactor(0);

        /* create thumb */
        this.phThumb = this.tools.AddCircle(scene, x, y, size, color, 0.5);
        this.phThumb.setScrollFactor(0);
        this.phThumb.setInteractive();
        this.phThumb.initX = x;
        this.phThumb.initY = y;
        this.phThumb.dragging = false;
        scene.input.setDraggable(this.phThumb);
        scene.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
            gameObject.dragging = true;
        });
        scene.input.on('dragend', function (pointer, gameObject) {
            gameObject.x = gameObject.initX;
            gameObject.y = gameObject.initY;
            gameObject.dragging = false;
        });
    }

    setVisible(visible) {
        this.phThumb.visible = visible;
        this.phStaticPad.visible = visible;
    }

    update(time) {
        if (!this.phThumb.dragging) {
            this._moveLeft = -1;
            this._moveRight = -1;
            this._moveUp = -1;
            this._moveDown = -1;
            return;
        }

        var dx = this.phThumb.x - this._initX;
        var dy = this.phThumb.y - this._initY;

        if (Math.abs(dx) > 5 && Math.abs(dy) < 15) {
            if (dx < 0) {
                if (this._moveLeft == -1) {
                    this._moveLeft = time;
                }
                this._moveRight = -1;
            } else {
                this._moveLeft = -1;
                if (this._moveRight == -1) {
                    this._moveRight = time;
                }
            }
        } else {
            this._moveLeft = -1;
            this._moveRight = -1;
        }
    
        if (Math.abs(dy) > 5 && Math.abs(dx) < 15) {
            if (dy < 0) {
                if (this._moveUp == -1) {
                    this._moveUp = time;
                }
                this._moveDown = -1;
            } else {
                this._moveUp = -1;
                if (this._moveDown == -1) {
                    this._moveDown = time;
                }
            }
        } else {
            this._moveUp = -1;
            this._moveDown = -1;
        }
    }

    isDown(key) {
        if (key == 'LEFT' && this._moveLeft != -1) {
            return true;
        }
        if (key == 'RIGHT' && this._moveRight != -1) {
            return true;
        }
        if (key == 'UP' && this._moveUp != -1) {
            return true;
        }
        if (key == 'DOWN' && this._moveDown != -1) {
            return true;
        }
        return false;
    }
    
    justPressed(key) {
        let curr = this.phScene.time.now;
        let time = 20;
        if (key == 'LEFT' && curr - this._moveLeft < time) {
            return true;
        }
        if (key == 'RIGHT' && curr - this._moveRight < time) {
            return true;
        }
        if (key == 'UP' && curr - this._moveUp < time) {
            return true;
        }
        if (key == 'DOWN' && curr - this._moveDown < time) {
            return true;
        }
        return false;
    }
}