import {Entity} from "./entity.js";
import {gameManager, physicManager, spriteManager} from "../exports.js";

export class Rocket extends Entity {
    constructor() {
        super();
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 4;
        this.draw = (ctx)=>{
            spriteManager.drawSprite(ctx, "arrow", this.pos_x, this.pos_y)
        }
        this.update = ()=>{
            //console.log("rocket update", this.move_x, this.move_y)
            physicManager.update(this)
        }
        this.onTouchEntity=(obj)=>{
            if(obj.name.match(/enemy[\d*]/) || obj.name.match(/player/) || obj.name.match(/rocket[\d*]/)){
                obj.kill();
            }
            this.kill()
        }
        this.onTouchMap = (idx)=>{
            this.kill();
        }
        this.kill = ()=>{
            gameManager.kill(this)
        }

    }
}