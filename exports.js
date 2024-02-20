import { MapManager } from "./managers/mapManager.js";
import { SpriteManager } from "./managers/spriteManager.js";
import { EventManager } from "./managers/eventManager.js";
import { GameManager } from "./managers/gameManager.js";
import { PhysicManager } from "./managers/physicManager.js";
import { SoundManager } from "./managers/soundManager.js";


export let mapManager = new MapManager();
export let spriteManager = new SpriteManager();
export let gameManager = new GameManager();
export let eventsManager = new EventManager();
export let physicManager = new PhysicManager();
export let soundManager = new SoundManager();

export var canvas = document.getElementById("canvasId");
export var ctx = canvas.getContext("2d");
export var startGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameManager.loadAll();
    gameManager.draw(ctx);
    gameManager.play();
}