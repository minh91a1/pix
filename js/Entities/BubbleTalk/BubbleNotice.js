export default class BubbleNotice {
    constructor(scene, ownerSprite, offsetX, offsetY) {
        this._ownerSprite = ownerSprite;
        this._offsetX = offsetX;
        this._offsetY = offsetY;

        let x = this._ownerSprite.x;
        let y = this._ownerSprite.y;
        this.scene = scene;

        this.bubbleNoticeContainer = scene.add.container(x + offsetX, y + offsetY);
        let bubbleNotice = scene.add.image(0, 0, 'bubble-notice');
        this.bubbleNoticeContainer.add(bubbleNotice);
        scene.tweens.add({
            targets: bubbleNotice,
            y: bubbleNotice.y + 5 ,
            duration: 700,
            ease: 'Power0',
            yoyo: true,
            repeat: -1,
        });
    }

    setPos(x, y) {
        this.bubbleNoticeContainer.x = this._offsetX + x;
        this.bubbleNoticeContainer.y = this._offsetY + y;
    }

    show() {
        this.bubbleNoticeContainer.visible = true;
    }

    hide() {
        this.bubbleNoticeContainer.visible = false;
    }
}