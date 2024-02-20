import { eventsManager, soundManager } from "../exports.js";

export class EventManager {
    constructor() {
        this.bind = [] // сопоставление клавиш действиям
        this.action = [] // действия
        this.setup = (canvas) => { // настройка сопоставления
            this.bind[87] = 'up'; // w – двигаться вверх
            this.bind[65] = 'left'; // a – двигаться влево
            this.bind[83] = 'down'; // s – двигаться вниз
            this.bind[68] = 'right'; // d – двигаться вправо
            this.bind[32] = 'fire'; // пробел – выстрелить
            // контроль событий «мыши»
            canvas.addEventListener("mousedown", this.onMouseDown);
            canvas.addEventListener("mouseup", this.onMouseUp);
            // контроль событий клавиатуры
            document.body.addEventListener("keydown", this.onKeyDown);
            document.body.addEventListener("keyup", this.onKeyUp)
        }

        

    }
    onMouseDown = (event) => {
        console.log("onMouseDown")

    }
    onMouseUp = (event) => {
        //console.log("onMouseUp")
        //eventsManager.action["fire"] = false;
    }

    onKeyDown = (event) => { // нажали на кнопку
        // на клавиатуре, проверили, есть ли сопоставление действию для события с кодом keyCode             

        var action = eventsManager.bind[event.keyCode];
        if (action) // проверка на action === true
            eventsManager.action[action] = true; // согласились
        // выполнять действие
    }

    onKeyUp = (event) => { // отпустили кнопку на клавиатуре
        // проверили, есть ли сопоставление действию для события
        // с кодом keyCode
        var action = eventsManager.bind[event.keyCode]; // проверили
        // наличие действия
        if (action) // проверка на action === true
            eventsManager.action[action] = false; // отменили действие
    }

}