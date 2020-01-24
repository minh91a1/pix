import BaseNPC from "./BaseNPC.js"

export default class Villager extends BaseNPC {
    constructor(scene, x, y, texture, frame, width, height, centerOrigin) {
        super(scene, x, y, texture, frame, width, height, centerOrigin);
    }
}