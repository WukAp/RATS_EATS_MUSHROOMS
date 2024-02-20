import { gameManager } from "../exports.js";

export class MapManager {
    constructor() {
        this.mapData = null;
        this.tLayer = null;
        this.xCount = 0;
        this.yCount = 0;
        this.tSize = { x: 16, y: 16 };
        this.mapSize = { x: 64, y: 64 };
        this.tilesets = new Array();
        this.imgLoadCount = 0;
        this.imgLoaded = false;
        this.jsonLoaded = false;


        this.view = { x: 0, y: 0, w: 960, h: 640 }
        this.view2 = { x: 0, y: 0, w: 1440, h: 960 };

    }
    loadMap(path) {
        if(gameManager.LEVEL==2){
            this.view = this.view2
        }
        var request = new XMLHttpRequest(); // создание ajax-запроса
        request.onreadystatechange = () => {
            if (request.readyState === 4 && request.status === 200) {
                // Получен корректный ответ, результат можно обрабатывать 
                this.parseMap(request.responseText);
            }
        };
        request.open("GET", path, true);
        // true - отправить асинхронный запрос на path
        // c использованием функции GET
        request.send(); // отправить запрос
    }
    parseMap(tilesJSON) {

        this.mapData = JSON.parse(tilesJSON); // разобрать JSON
        this.xCount = this.mapData.width; // сохранение ширины
        this.yCount = this.mapData.height; // сохранение высоты
        this.tSize.x = this.mapData.tilewidth; // сохранение размера блока
        this.tSize.y = this.mapData.tileheight; // сохранение размера блока
        this.mapSize.x = this.xCount * this.tSize.x; // вычисление размера карты
        this.mapSize.y = this.yCount * this.tSize.y; // вычисление размера карты
        for (var i = 0; i < this.mapData.tilesets.length; i++) {
            var img = new Image(); // создаем переменную для хранения
            // изображений
            img.onload = () => { // при загрузке изображения
                this.imgLoadCount++; // увеличиваем счетчик
                if (this.imgLoadCount === this.mapData.tilesets.length) {
                    this.imgLoaded = true; // загружены все
                    // изображения
                }
            }
            img.src = this.mapData.tilesets[i].image; // Задание пути к
            // изображению
            var t = this.mapData.tilesets[i]; // забираем tileset из карты
            var ts = { // создаем свой объект tileset
                firstgid: t.firstgid, // firstgid - с него начинается нумерация в
                // data
                image: img, // объект рисунка
                name: t.name, // имя элемента рисунка
                xCount: Math.floor(t.imagewidth / this.tSize.x),
                // горизонталь
                yCount: Math.floor(t.imageheight / this.tSize.y)

                // вертикаль
            }; // конец объявления объекта ts

            this.tilesets.push(ts); // сохраняем tileset в массив
        } // окончание цикла for
        this.jsonLoaded = true; // true, когда разобрали весь json
    }

    draw(ctx) { // нарисовать карту в контексте


        // если карта не загружена, то повторить прорисовку через 100
        // мсек


        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => { this.draw(ctx); }, 100);
        } else {
            if (this.tLayer === null) // проверить, что tLayer настроен
                for (var id = 0; id < this.mapData.layers.length; id++) {
                    // проходим по всем layer карты
                    var layer = this.mapData.layers[id];
                    if (layer.type === "tilelayer") { // если не tilelayer -
                        // пропускаем
                        this.tLayer = layer;
                        break;
                    }
                } // Окончание цикла for
            for (var i = 0; i < this.tLayer.data.length; i++) { // пройти по всей
                // карте
                if (this.tLayer.data[i] !== 0) { // если нет данных - пропускаем
                    var tile = this.getTile(this.tLayer.data[i]); // получение блока
                    // по индексу
                    // i проходит линейно по массиву, xCount - длина по х
                    var pX = (i % this.xCount) * this.tSize.x; // вычисляем х в
                    // пикселах
                    var pY = Math.floor(i / this.xCount) * this.tSize.y;
                    // не рисуем за пределами видимой зоны
                    if (!this.isVisible(pX, pY, this.tSize.x, this.tSize.y))
                        continue;
                    // сдвигаем видимую зону
                    pX -= this.view.x;
                    pY -= this.view.y;
                    // вычисляем у
                    // рисуем в контекст
                    ctx.drawImage(tile.img, tile.px, tile.py, this.tSize.x,
                        this.tSize.y, pX, pY, this.tSize.x, this.tSize.y);
                }
            } // Окончание цикла for
        } // Окончание if-else
    }

    getTile(tileIndex) { // индекс блока
        var tile = { // один блок
            img: null, // изображение tileset
            px: 0, py: 0 // координаты блока в tileset
        };
        var tileset = this.getTileset(tileIndex);
        tile.img = tileset.image; // изображение искомого tileset
        var id = tileIndex - tileset.firstgid; // индекс блока в tileset
        // блок прямоугольный, остаток от деления на xCount дает x
        // в tileset
        var x = id % tileset.xCount;
        // округление от деления на xCount дает y в tileset
        var y = Math.floor(id / tileset.xCount);
        // с учетом размера можно посчитать координаты блока
        // в пикселах
        tile.px = x * this.tSize.x;
        tile.py = y * this.tSize.y;

        return tile; // возвращаем блок для отображения
    }

    getTileset(tileIndex) { // получение блока по индексу
        for (var i = this.tilesets.length - 1; i >= 0; i--)
            // в каждом tilesets[i].firstgid записано число,
            // с которого начинается нумерация блоков
            if (this.tilesets[i].firstgid <= tileIndex) {
                // если индекс первого блока меньше либо равен искомому,
                // значит этот tileset и нужен
                return this.tilesets[i];
            }
        return null; // Возвращается найденный tileset
    }
    isVisible(x, y, width, height) { // не рисуем за пределами видимой
        // зоны
        if (x + width < this.view.x || y + height < this.view.y ||
            x > this.view.x + this.view.w || y > this.view.y + this.view.h)
            return false;
        return true;
    }

    parseEntities() { // разбор слоя типа objectgroup
        if (!this.imgLoaded || !this.jsonLoaded) {
            setTimeout(() => { this.parseEntities(); }, 100);
        } else {
            for (var j = 0; j < this.mapData.layers.length; j++)
                // просмотр всех слоев
                if (this.mapData.layers[j].type === 'objectgroup') {
                    var entities = this.mapData.layers[j];
                    // слой с объектами следует "разобрать"
                    for (var i = 0; i < entities.objects.length; i++) {
                        var e = entities.objects[i];
                        try {
                            var obj = new gameManager.factory[e.type];
                            // в соответствии с типом создаем экземпляр объекта
                            obj.name = e.name;
                            obj.pos_x = e.x;
                            obj.pos_y = e.y;
                            obj.size_x = e.width;
                            obj.size_y = e.height;
                            // помещаем в массив объектов
                            gameManager.entities.push(obj);
                            if (obj.name === "player")

                                // инициализируем параметры игрока
                                gameManager.initPlayer(obj);
                        } catch (ex) {
                            console.log("Error while creating: [" + e.gid + "] " + e.type +
                                ", " + ex); // сообщение об ошибке
                        }
                    } // Конец for для объектов слоя objectgroup
                } // Конец if проверки типа слоя на равенство objectgroup
        }
    }

    getTilesetIdx(x, y) {
        // получить блок по координатам на карте
        var wX = x;
        var wY = y;
        var idx = Math.floor(wY / this.tSize.y) * this.xCount + Math.floor
            (wX / this.tSize.x);
        return this.tLayer.data[idx];
    }

    centerAt(x, y) {
        if (x < this.view.w / 2) // Центрирование по горизонтали
            this.view.x = 0;
        else
            if (x > this.mapSize.x - this.view.w / 2)
                this.view.x = this.mapSize.x - this.view.w;
            else
                this.view.x = x - (this.view.w / 2);
        if (y < this.view.h / 2) // Центрирование по вертикали
            this.view.y = 0;
        else
            if (y > this.mapSize.y - this.view.h / 2)
                this.view.y = this.mapSize.y - this.view.h;
            else
                this.view.y = y - (this.view.h / 2);
    }
}