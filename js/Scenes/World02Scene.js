import BaseScene from "./BaseScene.js";

export default class World02Scene extends BaseScene {

    constructor() {
        super("world02");
    }

    preload() {
        super.preload();
    }

    create() {
        super.create();
        
        this.add.text(20,20,"World 02");
    }

    update() {
        super.update();
    }
}