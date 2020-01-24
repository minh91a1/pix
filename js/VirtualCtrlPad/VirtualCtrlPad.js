import MoveCtrlPad from "./MoveCtrlPad.js";
import ActionCtrlPad from "./ActionCtrlPad.js";
import VirtualKey from "./VirtualKey.js"

import KeyboardPad from "./Keyboard/KeyboardPad.js"

export default class VirtualCtrlPad {
    constructor(scene) {
        this._onScreenMap = {}
        this._keyboardMap = {}

        let keySize = 36;
        let offsetX = 0;
        let offsetY = 0;

        let gameWidth = scene.sys.game.config.width;
        let gameHeight = scene.sys.game.config.height;

        this.createMoveCtrlPad(scene, offsetX + 36, gameHeight - 36);
        this.createActionCtrlPad(scene, gameWidth - keySize, gameHeight - keySize*2);
        this.createAttackVirtualKey(scene, gameWidth - keySize*2, gameHeight - keySize);

        this.createKeyboardPad(scene);
    }

    createMoveCtrlPad(scene, x,y) {
        this.moveCtrlPad = new MoveCtrlPad(scene, x, y, 14, 0xff0000, 0.25);
        this.moveCtrlPad.setVisible(false);

        this._onScreenMap['LEFT'] = this.moveCtrlPad;
        this._onScreenMap['RIGHT'] = this.moveCtrlPad;
        this._onScreenMap['UP'] = this.moveCtrlPad;
        this._onScreenMap['DOWN'] = this.moveCtrlPad;
    }
    
    createActionCtrlPad(scene, x,y) {
        this.actionCtrlPad = new ActionCtrlPad(scene, x, y, 36, 72, 0x00ff00, 0.25);
        this.actionCtrlPad.setVisible(false);

        this._onScreenMap['DASH'] = this.actionCtrlPad;
        this._onScreenMap['JUMP'] = this.actionCtrlPad;
    }
    
    createAttackVirtualKey(scene, x, y, w, h, color) {
        this.attackKey = new VirtualKey(scene, 'ATTACK', x, y, 36, 36, 0xff00ff);
        this.attackKey.setVisible(false);

        this._onScreenMap['ATTACK'] = this.attackKey;
    }

    createKeyboardPad(scene) {
        this.keyboardPad = new KeyboardPad(scene);

        this._keyboardMap['LEFT'] = this.keyboardPad;
        this._keyboardMap['RIGHT'] = this.keyboardPad;
        this._keyboardMap['UP'] = this.keyboardPad;
        this._keyboardMap['DOWN'] = this.keyboardPad;

        this._keyboardMap['DASH'] = this.keyboardPad;
        this._keyboardMap['JUMP'] = this.keyboardPad;
        this._keyboardMap['ATTACK'] = this.keyboardPad;
    }

    update(time) {
        this.moveCtrlPad.update(time);
        this.actionCtrlPad.update(time);
        this.attackKey.update(time);
    }

    isDown(key) {
        if (key == undefined ||  this._onScreenMap == undefined || this._onScreenMap[key] == undefined) {
            return false;
        }
        if (key == undefined ||  this._keyboardMap == undefined || this._keyboardMap[key] == undefined) {
            return false;
        }
        return this._onScreenMap[key].isDown(key) || this._keyboardMap[key].isDown(key);
    }
    
    justPressed(key) {
        if (key == undefined ||  this._onScreenMap == undefined || this._onScreenMap[key] == undefined) {
            return false;
        }
        if (key == undefined ||  this._keyboardMap == undefined || this._keyboardMap[key] == undefined) {
            return false;
        }
        return this._onScreenMap[key].justPressed(key)|| this._keyboardMap[key].justPressed(key);
    }
}