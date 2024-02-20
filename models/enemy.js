import { Entity } from "./entity.js";
import { gameManager, mapManager, physicManager, spriteManager } from "../exports.js";

export class Enemy extends Entity {
    constructor() {
        super();
        this.lifetime = 100;
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 5;
        this.move = true;
        this.RADIUS = 200;
        this.prep_x = 0;
        this.prep_y = 0;

        this.draw = (ctx) => {
            spriteManager.drawSprite(ctx, "enemy", this.pos_x, this.pos_y)
        }
        this.update = () => {
            if (getDist(gameManager.player.pos_x, gameManager.player.pos_y, this.pos_x, this.pos_y) < this.RADIUS) {
                this.A_star(gameManager.player.pos_x, gameManager.player.pos_y)
                if (physicManager.update(this) == "move") {
                    return
                }
            }
            if (getRandomInt(3) == 0) {
                this.move_x = getRandomInt(3) - 1;
                this.move_y = getRandomInt(3) - 1;
            }
            //this.checkForPlayer();
            if (physicManager.update(this) != "move") {
                this.update
            }
        }
        this.onTouchEntity = (obj) => {
            if (obj.name.match(/player/)) {

                //this.pos_x = this.start_x;
                //this.pos_y = this.start_y;
                this.move_x = 0;
                this.move_y = 0;
                this.len = 0;
                obj.kill();
                location.reload()
            } else {
                if (obj.name.match(/enemy[\d*]/)) {

                    //this.pos_x = this.start_x;
                    //this.pos_y = this.start_y;
                    this.move_x = 0;
                    this.move_y = 0;
                    this.len = 0;

                    //obj.kill();
                    //this.kill();
                }
                this.len = 0;
                this.move_x = 0;
                this.move = !this.move;
            }


        }
        this.onTouchMap = (idx) => {

            if (!this.playerFollow) {
                this.len = 0;
                this.move_x = 0;
                this.move_y = 0;
                this.move = !this.move;

            } else {
                this.prep_x = this.move_x;
                this.prep_y = this.move_y;
                this.A_star(gameManager.player.pos_x, gameManager.player.pos_y)
            }

        }
        this.kill = () => {
            gameManager.kill(this)
        }
        this.fire = () => {

        }

        this.A_star = (x, y) => {
            if (this.move_x !== 0) {
                this.move_x = 0;
                if (this.pos_y >= y)
                    this.move_y = -1;
                if (this.pos_y < y)
                    this.move_y = 1;
                physicManager.update(this);
            }
           else if (this.move_y !== 0) {

                this.move_y = 0;
                if (this.pos_x >= x)
                    this.move_x = -1;
                if (this.pos_x < x)
                    this.move_x = 1;
                physicManager.update(this);

            }
        }

    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getDist(x1, y1,x2,  y2) {
    return Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2));
}