import { gameManager, mapManager } from "../exports.js";

export class PhysicManager {
    constructor() {
    }

    update(obj) {
        if (obj.move_x === 0 && obj.move_y === 0)
            return "stop"; // скорости движения нулевые
        var newX = obj.pos_x + Math.floor(obj.move_x * obj.speed);
        var newY = obj.pos_y + Math.floor(obj.move_y * obj.speed);
        if (newX < 0 || newX > mapManager.view.w - mapManager.tSize.x / 2 || newY < 0 || newY > mapManager.view.h - mapManager.tSize.y / 2) {
            return "break"
        }
        // анализ пространства на карте по направлению движения
        var ts = mapManager.getTilesetIdx(newX + obj.size_x / 2,
            newY + obj.size_y / 2);
        var e = this.entityAtXY(obj, newX, newY); // объект на пути
        if (e !== null && obj.onTouchEntity)// если есть конфликт
        {
              obj.onTouchEntity(e); // разбор конфликта внутри объекта
              console.log(obj, e)
        } 
          
        if (!this.isGround(ts) && obj.onTouchMap) // есть препятствие
            obj.onTouchMap(ts); // разбор конфликта с препятствием
        // внутри объекта
        if (this.isGround(ts) && e === null) { // перемещаем объект на свободное
            // место
            obj.pos_x = newX;
            obj.pos_y = newY;
        } else
            return "break"; // дальше двигаться нельзя
        return "move"; // двигаемся
    }
    entityAtXY(obj, x, y) { // поиск объекта по координатам
        for (var i = 0; i < gameManager.entities.length; i++) {
            var e = gameManager.entities[i]; // все объекты карты
            if (e.name !== obj.name) { // имя не совпадает (имена
                // уникальны)
                if (x + obj.size_x < e.pos_x || // не пересекаются
                    y + obj.size_y < e.pos_y ||
                    x > e.pos_x + e.size_x ||
                    y > e.pos_y + e.size_y)
                    continue;
                return e; // найден объект
            }
        } // конец цикла for
        return null; // объект не найден
    }
    isGround(ts) {
        let ground = [86, 90, 140, 135, 152, 136, 139, 151, 122, 124, 52, 101, 106, 107, 121, 1, 2, 3, 17, 19, 34, 35, 57, 58, 59, 65,
             66, 67, 73, 74, 75, 81, 83, 89, 91, 97, 98, 99, 105, 73, 74,
              75, 81, 83, 89, 91, 97, 98, 99, 105, 120, 123,155, 137, 138, 153, 154]
        return ground.includes(ts)
    
    }
}