export default class KeyboardPad {
    constructor(scene) {
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keys = scene.input.keyboard.addKeys('Z,X,C');
    }

    isDown(key) {
        if (key == 'LEFT' && this.cursors.left.isDown) {
            return true;
        }
        if (key == 'RIGHT' && this.cursors.right.isDown) {
            return true;
        }
        if (key == 'UP' && this.cursors.up.isDown) {
            return true;
        }
        if (key == 'DOWN' && this.cursors.down.isDown) {
            return true;
        }
        if (key == 'JUMP' && this.keys.X.isDown) {
            return true;
        }
        if (key == 'ATTACK' && this.keys.C.isDown) {
            return true;
        }
        if (key == 'DASH' && this.keys.Z.isDown) {
            return true;
        }
        return false;
    }

    justPressed(key) {
        let time = 20;
        if (key == 'LEFT' && this.cursors.left.isDown && this.cursors.left.getDuration() < time) {
            return true;
        }
        if (key == 'RIGHT' && this.cursors.right.isDown && this.cursors.right.getDuration() < time) {
            return true;
        }
        if (key == 'UP' && this.cursors.up.isDown && this.cursors.up.getDuration() < time) {
            return true;
        }
        if (key == 'DOWN' &&this.cursors.down.isDown && this.cursors.down.getDuration() < time) {
            return true;
        }
        if (key == 'JUMP' && this.keys.X.isDown && this.keys.X.getDuration() < time) {
            return true;
        }
        if (key == 'ATTACK' && this.keys.C.isDown && this.keys.C.getDuration() < time) {
            return true;
        }
        if (key == 'DASH' && this.keys.Z.isDown && this.keys.Z.getDuration() < time) {
            return true;
        }
        return false;
    }
}