import Tools from "../../Helper/Tools.js";

export default class DialogPanel extends Phaser.GameObjects.Rectangle {
  constructor(scene, x, y , width, height, fillColor, fillAlpha) {
      super(scene, x, y , width, height , fillColor, fillAlpha);

      /* model */
      this._paragraphs = [];
      this._isTalking = false;
      this.listParagraph = undefined;
      this._dialogState = 0; // 1: running animation - 2: animation done - 0: not running
      this._lastCall = 0;
      this.visible = false;

      /* tools */
      this.tools = new Tools();
      
      /* phaser */
      this.scene = scene;
      scene.add.existing(this);
      this.displayOriginX = 0;
      this.displayOriginY = 0;
      this.setScrollFactor(0);

      var loopMarker = {
        name: 'loop',
        start: 0,
        duration: 0.1,
        config: {
            loop: true
        }
    };
      this.talkSound = scene.sound.add('talk');
      this.talkSound.addMarker(loopMarker);
  }

  setup(text) {
    this.listParagraph = [];
    let allSentences = text.split('_');
    allSentences.forEach(sentence => {
      let tempParagraphs = this.tools.WrapBitmapText(this.scene, 'bitmaptext', sentence, ' ', 16*20, 3);
      tempParagraphs.forEach(paragraph => {
        this.listParagraph.push(paragraph);
      })
    });
    
  }

  isRunning() {
    return this.visible == true;
  }

  close() {
    this.talkSound.stop();
    this.visible = false;
    this.idx = 0;
    this._dialogState = 0;
    if (this.timedEvent) this.timedEvent.remove();
    if (this.currentTextOnScreen) this.currentTextOnScreen.destroy();
  }

  runDialog() {
    let time = this.scene.time.now;
    if (time - this._lastCall < 300) {
      return;
    }
    this._lastCall = time;

    switch (this._dialogState) {
      case 0: // not running
        if (!this.listParagraph || this.listParagraph.length == 0) {
          return;
        }
        this.visible = true;
        this.idx = 0;
        this.currentParagraph = this.listParagraph[this.idx];
        this.runTextAnimation(this.currentParagraph); 
        this._dialogState = 1;
        break;
      case 1: // running animation
        this.runTextAnimation(this.currentParagraph);
        if (this._dialogState != 2) {
          if (this.currentTextOnScreen) this.currentTextOnScreen.destroy();
          if (this.timedEvent) this.timedEvent.remove();
          this.talkSound.stop();
          this.currentParagraph = this.listParagraph[this.idx];
          this.currentTextOnScreen = this.scene.add.bitmapText(0, 0, 'bitmaptext', this.currentParagraph).setScrollFactor(0);
          this._dialogState = 2;
          return;
        }
        break;
      case 2: // animation done
        this.idx++;
        if (this.idx >= this.listParagraph.length) {
          this._dialogState = 0;
          this.close();
          return;
        }
        this.currentParagraph = this.listParagraph[this.idx];
        this.runTextAnimation(this.currentParagraph);
        this._dialogState = 1;
        break;
      default:
        break;
    }
  }

  runTextAnimation(text) {
    this.talkSound.play('loop');
    this.eventCounter = 0;
    this.fullText = text;
    this.text = '';
    if (this.timedEvent) this.timedEvent.remove();
    this.timedEvent = this.scene.time.addEvent({
        delay: 50,
        callback: this.animateText,
        callbackScope: this,
        loop: true
      });
  }

  animateText() {
      this.eventCounter++;
      this.addTextToScene(this.text += this.fullText[this.eventCounter - 1]);
      if (this.eventCounter === this.fullText.length) {
        this.timedEvent.remove();
        this.talkSound.stop();
        this._dialogState = 2;
      }
    }

  addTextToScene(text) {
    if (this.currentTextOnScreen) this.currentTextOnScreen.destroy();
    this.currentTextOnScreen = this.scene.add.bitmapText(0, 0, 'bitmaptext', text).setScrollFactor(0);
  }
}