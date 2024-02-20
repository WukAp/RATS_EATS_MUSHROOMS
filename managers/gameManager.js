import { Player } from "../models/player.js";
import { Enemy } from "../models/enemy.js";
import { Bonus } from "../models/bonus.js";
import { Rocket } from "../models/rocket.js";
import { startGame, mapManager, gameManager, eventsManager, spriteManager, ctx, canvas, soundManager } from "../exports.js";


export class GameManager {
    constructor() {
        this.factory = {}
        this.entities = [];
        this.fireNum = 0;
        this.player = null;
        this.laterKill = [];
        this.mushrooms = 0;
        this.MAX_MASHROOMS = 5;
        this.LEVEL = 1;
        this.startTime = 0;
        this.isEnd = false
    }

    initPlayer(obj) {
        this.player = obj;
    }

    kill(obj) {
        this.laterKill.push(obj)
    }

    draw(ctx) {
        for (let e = 0; e < this.entities.length; e++) {
            this.entities[e].draw(ctx)
        }

    }
    update() { // обновление информации
        if (this.isEnd) {
            return
        }
        if (this.player === null)
            return;
        // по умолчанию игрок никуда не двигается
        this.player.move_x = 0;
        this.player.move_y = 0;
        // поймали событие - обрабатываем
        if (eventsManager.action["up"]) this.player.move_y = -1;
        if (eventsManager.action["down"]) this.player.move_y = 1;
        if (eventsManager.action["left"]) this.player.move_x = -1;
        if (eventsManager.action["right"]) this.player.move_x = 1;
        // стреляем
        if (eventsManager.action["fire"]) this.player.fire();
        // обновление информации по всем объектам на карте
        this.entities.forEach((e) => {
            try { // защита от ошибок при выполнении update
                e.update();
            } catch (ex) { }
        });
        // удаление всех объектов, попавших в laterKill
        for (var i = 0; i < this.laterKill.length; i++) {
            var idx = this.entities.indexOf(this.laterKill[i]);
            if (idx > -1)
                this.entities.splice(idx, 1); // удаление из массива 1 объекта
        };
        if (this.laterKill.length > 0) // очистка массива laterKill
            this.laterKill.length = 0;

        mapManager.draw(ctx); // удалить ДЛЯ замечательного эффекта
        this.draw(ctx);

        document.getElementById("mushrooms").innerHTML = this.mushrooms;
        document.getElementById("time").innerHTML = Math.floor((new Date().getTime() - this.startTime) / 1000);
        if (this.mushrooms == this.MAX_MASHROOMS) {
            this.isEnd = true
            if (this.LEVEL == 1) {
                updateRecordMap(localStorage["mgame.username"], Math.floor((new Date().getTime() - this.startTime) / 1000), "mgame.recordTable1")

                document.getElementById("next").onclick = () => {
                    this.LEVEL++
                    this.mushrooms = 0
                    window.location.replace('lvl2.html');
                }

                document.getElementById("again").onclick = () => {
                    this.LEVEL++
                    this.mushrooms = 0
                    window.location.replace('lvl1.html');
                }
            }
            else {

                document.getElementById("prev").onclick = () => {
                    this.LEVEL--
                    this.mushrooms = 0
                    window.location.replace('lvl1.html');

                }
                document.getElementById("again").onclick = () => {
                    this.LEVEL--
                    this.mushrooms = 0
                    window.location.replace('lvl2.html');

                }
                updateRecordMap(localStorage["mgame.username"], Math.floor((new Date().getTime() - this.startTime) / 1000), "mgame.recordTable2")

            }
        }



    }
    loadAll() {
        localStorage["mgame.username"] = prompt("Enter your name", "Best Player")
        mapManager.loadMap("../views/lvl" + this.LEVEL + ".json");
        this.startTime = new Date().getTime();
        document.getElementById("name").innerHTML = localStorage["mgame.username"];
        spriteManager.loadAtlas("../views/sprites.json", "../img/spritesheet.png");
        // загрузка атласа
        this.factory['Player'] = Player; // инициализация фабрики
        this.factory['Enemy'] = Enemy;
        this.factory['Bonus'] = Bonus;

        this.factory['Rocket'] = Rocket;
        mapManager.parseEntities(); // разбор сущностей карты
        mapManager.draw(ctx); // отобразить карту
        eventsManager.setup(canvas); // настройка событий
        soundManager.init();
        soundManager.loadArray(["../sounds/crump.mp3", "../sounds/poedanie-robota.wav"]);

    }
    play() {
        setInterval(updateWorld, 100);
    }
}
function updateWorld() {
    gameManager.update()
}
function updateRecordMap(name, score, tableName) {
    console.log("updateRecordMap")
    let records
    if (!localStorage[tableName]) {
        records = [[name, (score)]]
    } else {
        records = JSON.parse(localStorage[tableName])
        records.push([name, (score)])

        for (let i = 0; i < records.length; i++) {
            if ((score) < +records[i][1]) {
                records.splice(i, 0, [name, (score)])
                records.pop()
                break
            }
        }
        console.log(records)
    }
    let text = ''
    records.forEach(function (element) {
        text += element[0] + ': ' + element[1] + '<br>'
    })
    text.trim()
    document.getElementById("record_table").innerHTML = text

    document.getElementById("recordTable").showModal()
    localStorage[tableName] = JSON.stringify(records)
}