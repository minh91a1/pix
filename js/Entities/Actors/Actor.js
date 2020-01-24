import PhysicObject from "../PhysicObject.js"

export default class Actor extends PhysicObject {
    constructor(scene, x, y, texture, frame, width, height, centerOrigin) {
        super(scene, x, y, texture, frame, width, height, centerOrigin);
    }
}