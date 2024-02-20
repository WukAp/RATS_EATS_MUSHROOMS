import { soundManager } from "../exports.js";

export class SoundManager {
    constructor() {
        this.clips = {}
        this.context = null;
        this.gainNode = null;
        this.loaded = false;
    }

    init() { // инициализация менеджера звука
        this.context = new AudioContext();
        this.gainNode = this.context.createGain ?
            this.context.createGain() : this.context.createGainNode();
        this.gainNode.connect(this.context.destination); // подключение
        // к динамикам
    }

    load(path, callback) {
        if (this.clips[path]) { // проверяем, что уже загружены
            callback(this.clips[path]); // вызываем загруженный
            return; // выход
        }
        var clip = { path: path, buffer: null, loaded: false }; // клип, буфер,
        // загружен
        clip.play = (volume, loop) => {
            soundManager.play(this.path, {
                looping: loop ? loop : false,
                volume: volume ? volume : 1
            });
        };
        this.clips[path] = clip; // помещаем в "массив" (литерал)
        var request = new XMLHttpRequest();
        request.open('GET', path, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            soundManager.context.decodeAudioData(request.response,
                (buffer) => {
                    clip.buffer = buffer;
                    clip.loaded = true;
                    callback(clip);
                });
        };
        request.send();
    }
    loadArray(array) { // загрузить массив звуков
        for (var i = 0; i < array.length; i++) {
            soundManager.load(array[i], () => {
                if (array.length ===
                    Object.keys(soundManager.clips).length) {
                    // если подготовили для загрузки все звуки
                    for (let sd in soundManager.clips)
                        if (!soundManager.clips[sd].loaded) return;
                    soundManager.loaded = true; // все звуки загружены
                }
            }); // конец soundManager.load
        } // конец for
    }
    play(path, settings) {
        if (!soundManager.loaded) { // если еще все не загрузили
            setTimeout(() => { soundManager.play(path, settings); },
                1000);
            return;
        }
        var looping = false; // значения по умолчанию
        var volume = 1;
        if (settings) { // если переопределены, то перенастраиваем
            значения
            if (settings.looping)
                looping = settings.looping;
            if (settings.volume)
                volume = settings.volume;
        }
        let sd = this.clips[path]; // получаем звуковой эффект
        if (sd === null)
            return false;
        // создаем новый экземпляр проигрывателя BufferSource
        var sound = soundManager.context.createBufferSource();
        sound.buffer = sd.buffer;
        sound.connect(soundManager.gainNode);
        sound.loop = looping;
        soundManager.gainNode.gain.value = volume;
        sound.start(0);
        return true;
    }
}