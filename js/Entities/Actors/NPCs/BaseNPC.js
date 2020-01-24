import Actor from "../Actor.js"
import DialogPanel from "../../BubbleTalk/DialogPanel.js";
import BubbleNotice from "../../BubbleTalk/BubbleNotice.js";

export default class BaseNPC extends Actor {
    constructor(scene, x, y, texture, dialogContent) {
        super(scene, x, y, texture, 0, 0, 0, true);

        /* model */
        this._dialogContent = dialogContent;

        /* dialog panel */
        this.dialogPanel = new DialogPanel(scene, 0, 0,16*20,16*4,0x00,0.9);
        this.dialogPanel.setup(this._dialogContent);

        /* bubble notice */
        this.bubbleNotice = new BubbleNotice(scene, this, 0, -15);

        /* phaser */
        this.player = undefined;
    }

    talk(player) {
        let distanceToPlayer = player.x - this.x;
        if (distanceToPlayer < 0) {
            this.setFlipX(true);
        } else {
            this.setFlipX(false);
        }

        this.bubbleNotice.hide();
        this.player = player;
        this.dialogPanel.runDialog(this._dialogContent);
    }

    update(time) {
        this.bubbleNotice.setPos(this.x, this.y);

        if (!this.player ) {
            return;
        }

        let distanceToPlayer = this.player.x - this.x;
        if (Math.abs(distanceToPlayer) > 25) {
            this.dialogPanel.close();
        }

        if (this.dialogPanel.isRunning()) {
            this.bubbleNotice.hide();
        } else {
            this.bubbleNotice.show();
        }
    }
}