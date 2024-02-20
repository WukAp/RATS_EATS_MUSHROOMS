import { Entity } from "./entity.js";
import { Rocket } from "./rocket.js";
import { gameManager, physicManager, spriteManager, soundManager} from "../exports.js";

export class Player extends Entity {
    constructor() {
        super();
        this.lifetime = 100;
        this.move_x = 0;
        this.move_y = 0;
        this.speed = 10;
        this.draw = (ctx) => {

            spriteManager.drawSprite(ctx, "player", this.pos_x, this.pos_y)
        }
        this.update = () => {
            physicManager.update(this)
        }
        this.onTouchEntity = (obj) => {

            if (obj.name.match(/star[\d]/)) {
                //let life = document.getElementById("lifetime")
                //console.log(obj.name)
                //this.lifetime += 50;
                //life.innerHTML = this.lifetime.toString()

                //const audio = new Audio("../sounds/crump.mp3")
               // audio.play();
        soundManager.play("../sounds/crump.mp3")
       //     soundManager.play("../sounds/poedanie-robota.wav")
                gameManager.mushrooms++;
                obj.kill();
            }
            if (obj.name.match(/enemy[\d*]/)) {
                //obj.pos_x = obj.start_x;
                //obj.pos_y = obj.start_y;
                obj.move_x = 0;
                obj.move_y = 0;
                obj.len = 0;
                this.kill()
                //obj.kill()
            }
        }
        this.kill = () => {
            this.pos_x = this.start_x;
            this.pos_y = this.start_y;
            
                gameManager.kill(this)
            
        }
        this.fire = () => {
            let r = new Rocket()
            r.size_x = 32; // необходимо задать размеры создаваемому
            // объекту
            r.size_y = 32;
            r.name = "rocket" + (++gameManager.fireNum); // используется
            // счетчик выстрелов
            r.move_x = this.move_x;
            r.move_y = this.move_y;
            switch (this.move_x + 2 * this.move_y) {
                case -1: // выстрел влево
                    r.pos_x = this.pos_x - r.size_x; // появиться слева от игрока
                    r.pos_y = this.pos_y;
                    break;
                case 1: // выстрел вправо
                    r.pos_x = this.pos_x + this.size_x; // появиться справа
                    // от игрока
                    r.pos_y = this.pos_y;
                    break;
                case -2: // выстрел вверх
                    r.pos_x = this.pos_x;
                    r.pos_y = this.pos_y - r.size_y; // появиться сверху от игрока
                    break;
                case 2: // выстрел вниз
                    r.pos_x = this.pos_x;
                    r.pos_y = this.pos_y + this.size_y; // появиться снизу от игрока
                    break;
                default: return;
            }

        }
    }
}


// let player = new Player()
// console.log(player)