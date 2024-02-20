import { Entity } from "./entity.js";
import { gameManager, spriteManager } from "../exports.js";

export class Bonus extends Entity {
    constructor() {
        super();

    } draw = (ctx) => {
        spriteManager.drawSprite(ctx, "star", this.pos_x, this.pos_y)
    }
    kill = () => {
        gameManager.kill(this)
    }
}