import "babel-polyfill";
import { report } from './main';
import { speech } from './tts';
import panner from 'sono/effects/panner';
const EventEmitter = require('events');
import sono from 'sono';
import { KeyboardInput } from './input';
import { KeyEvent } from './keycodes';
import { utils } from './utilities';
panner.defaults = {
	panningModel: 'HRTF',
	maxDistance: 50,
};
sono.playInBackground = true;
var playOnceTimer;
class SoundObjectItem extends EventEmitter {
	constructor(file, callback = 0, tag = 0, stream = false) {
		super();
		this.duckingFirstTime = true;
		this.stream = stream;
		this.panner = null;
		this.fileName = file;
		if (typeof file == "string") {
			if (!stream) {
				this.sound = sono.create({
					src: file,
					onComplete: () => { this.doneLoading(); }
				});
				this.timeout = setTimeout(() => { this.checkProgress(); }, 2000);
				this.loaded = false;
				this.callback = callback;
				this.tag = tag;
			}
			if (stream) {
				this.loaded = true;
				this.callback = callback;
				this.tag = tag;
				this.sound = sono.create(new Audio(file));
				this.doneLoading();
			}
		}
		else if (typeof file == "object") {
			this.sound = sono.create("");
			this.sound.data = file;
			this.loaded = false;
			this.callback = callback;
			this.tag = tag;
			this.doneLoading();
		}


	}

	get playbackRate() {
		return this.sound.playbackRate
	}

	set playbackRate(v) {
		return this.sound.playbackRate = v;
	}
	get pitch() {
		return this.sound.playbackRate
	}

	set pitch(v) {
		return this.sound.playbackRate = v;
	}

	set loop(v) {
		this.sound.loop = v;
	}

	checkProgress() {
		if (this.stream) return;
		if (this.sound.progress == 0) {
			this.sound.destroy();
			this.sound = sono.create({ src: this.fileName, onComplete: () => { this.doneLoading(); } }, this.stream);
		}

		if (this.sound.progress == 1) {
			this.doneLoading();
		} else {
			this.timeout = setTimeout(() => { this.checkProgress(); }, 500);
		}

	}

	doneLoading() {
		if (!this.stream) clearTimeout(this.timeout);
		this.loaded = true;
		if (this.callback != 0) {
			this.callback();
		}
	}
	replay() {
		this.sound.stop()
		this.sound.play()
	}
	play() {
		//sometimes, html element sounds complain about having a different connection, so wrap it in a try catch block.
		try {
			this.sound.play();
		} catch (err) {
			//report(err);
			//recreate the sound and replay
			if (this.stream) this.sound = sono.create(new Audio(this.fileName));
			if (!this.stream) this.sound = sono.create({
				src: this.fileName,
				onComplete: () => { this.doneLoading(); }
			});
			this.sound.play();
		}
	}
	stop() {
		this.sound.stop();

	}
	pause() {
		this.sound.pause();
	}
	resume() {
		this.sound.resume();
	}
	destroy() {
		try {

			this.sound.destroy();
		} catch (err) {

		}
	}
	unload() { this.sound.destroy(); }
	duck(time) {
		if (this.duckingFirstTime) this.oldVolume = this.volume;
		this.duckingFirstTime = false;
		this.sound.fade(0.3, 0.15);
	}
	unduck(time) {
		this.sound.fade(this.oldVolume, 0.15);
	}
	async fade(time) {
		this.sound.fade(0, time / 1000);
		return new Promise(resolve => {
			setTimeout(() => {
				this.sound.stop();
				resolve('ok');
			}, time);// End
		});// Promise

	}

	pos(x, y, z) {

	}

	forcePlay() {
		this.sound.stop();
		this.sound.play();
	}
	async playSync(die = false) {
		const inp = new KeyboardInput();
		inp.init();
		this.sound.play();

		inp.justPressedEventCallback = (evt => {
			if (evt == KeyEvent.DOM_VK_Q || evt == KeyEvent.DOM_VK_X || evt == KeyEvent.DOM_VK_ESCAPE || evt == KeyEvent.DOM_VK_SPACE || evt == KeyEvent.DOM_VK_ENTER) {
				this.sound.stop();
				inp.justPressedEventCallback = null;
			}
		});
		return new Promise(resolve => {
			this.sound.once('ended', () => {
				this.sound.removeAllListeners();
				if (die) this.sound.destroy();
				resolve('ok');
				inp.justPressedEventCallback = null;
			});// End
			this.sound.once('stop', () => {
				this.sound.removeAllListeners();
				if (die) this.sound.destroy();
				resolve('ok');
				inp.justPressedEventCallback = null;
			});// Stop
		});// Promise
	}

	get active() {
		if (!this.sound.loaded) {
			return false;
		}
		if (this.sound.progress < 1) {
			return false;
		}

		if (this.sound.loaded) {
			return true;
		}

	}
	get playing() {
		return this.sound.playing;
	}

	get pan() {
		if (!this.panner) {
			this.panner = this.sound.effects.add(panner());
			this.currentPan = 0;
			return 0;
		}
		return this.currentPan;
	}

	set pan(v) {
		if (!this.panner) {
			this.panner = this.sound.effects.add(panner());
		}
		this.currentPan = v;
		return this.panner.set(v);
	}
	get volume() {
		return this.sound.volume;
	}
	set volume(v) {
		this.sound.volume = v;
	}

	seek(time) {
		return this.sound.seek(time);
	}

	get currentTime() {
		return this.sound.currentTime;
	}

	get duration() {
		return this.sound.duration * 1000;
	}

	get position() {
		return this.sound.currentTime;
	}

	set currentTime(v) {
		return this.sound.seek(v);
	}

}

class SoundObject {
	constructor() {
		this.sounds = new Array();
		this.loadingQueue = false;
		this.queueCallback = 0;
		this.loadedSounds = 0;
		this.loadingSounds = 0;
		this.loadedCallback = 0;
		this.queue = new Array();
		this.queueLength = 0;
		this.statusCallback = null;
		this.directory = "./sounds/";
		this.extension = ".ogg";
		this.oneShots = new Array();
		this.debug = false;


		this.oneShotSound = null;
	}
	setStatusCallback(callback) {
		this.statusCallback = callback;
	}
	findSound(file) {
		for (let i = 0; i < this.sounds.length; i++) {
			if (this.sounds[i].fileName == file && this.sounds[i].loaded) {
				return this.sounds[i];
			}
		}
		return -1;
	}
	findSoundIndex(file) {
		for (const i in this.sounds) {
			if (this.sounds[i].fileName == file) {
				return i;
			}
		}

		return -1;
	}


	resetQueuedInstance() {
		for (let i = 0; i < this.sounds.length; i++) {
			if (typeof this.sounds[i] != "undefined") {
				if (this.sounds[i].tag == 1) {
					this.sounds[i].sound.destroy();
					this.sounds.splice(i, 1);
				}
			}
		}

		this.loadingQueue = false;
		this.queueCallback = 0;
		this.loadedSounds = 0;
		this.loadingSounds = 0;
		this.loadedCallback = 0;
		this.queue = new Array();
		this.queueLength = 0;
		this.statusCallback = null;
	}



	create(file, stream = false) {
		file = this.directory + file + this.extension;
		let found = -1;
		found = this.findSound(file);
		let returnObject = null;
		if (found == -1 || found.sound.data == null) {
			returnObject = new SoundObjectItem(file, () => { if (!stream) this.doneLoading(); }, 0, stream);
			this.sounds.push(returnObject);
		} else {
			returnObject = new SoundObjectItem(found.sound.data, () => { if (!stream) this.doneLoading(); }, 0, stream);
			returnObject.fileName = found.fileName;
		}
		returnObject.fileName = file; //otherwise html element fileNames get fucked up.
		return returnObject;
	}
	async loadQueueSync() {
		return new Promise(resolve => {
			so.setQueueCallback(() => {
				resolve(true);
			});
			so.loadQueue();
		});
	}
	async createSync(file, stream = false) {
		return new Promise(resolve => {
			file = this.directory + file + this.extension;
			let found = -1;
			found = this.findSound(file);
			let returnObject = null;
			if (found == -1 || found.sound.data == null) {
				returnObject = new SoundObjectItem(file, () => { if (!stream) this.doneLoading(); }, 0, stream);
				this.sounds.push(returnObject);
				if (stream) resolve(returnObject);
			} else {
				returnObject = new SoundObjectItem(found.sound.data, () => { if (!stream) this.doneLoading(); }, 0, stream);
				resolve(returnObject);
			}
			returnObject.fileName = file; //otherwise html element fileNames get fucked up.
			if (stream) resolve(returnObject);
			if (!stream) {
				returnObject.sound.once('loaded', () => {
					resolve(returnObject);
					this.doneLoading();
				});// End
			}//stream
		});// Promise
	}
	async playSync(file) {
		let snd = await so.createSync(file);
		await snd.playSync();
		snd.destroy();
	}

	enqueue(file, stream = false) {
		file = this.directory + file + this.extension;
		this.queue.push({ file, stream });
		this.queueLength = this.queue.length;
	}

	loadQueue() {

		this.handleQueue();
		this.loadingQueue = true;

	}
	setQueueCallback(callback) {
		this.queueCallback = callback;
	}
	resetQueue() {
		this.queue = [];
		this.loadingQueue = false;
	}
	handleQueue() {
		if (this.queue.length > 0) {
			if (typeof this.statusCallback != "undefined" && this.statusCallback != null) {
				this.statusCallback(1 - this.queue.length / this.queueLength);
			}
			if (this.findSound(this.queue[0].file) != -1) {
				this.queue.splice(0, 1);
				this.handleQueue();
				return;
			}
			let file = this.queue[0].file;
			let stream = this.queue[0].stream;
			this.queue.splice(0, 1);
			this.sounds.push(new SoundObjectItem(file, () => { this.handleQueue(); }, 1, stream));

		} else {
			this.loadingQueue = false;
			if (typeof this.queueCallback != "undefined" && this.queueCallback != 0) {
				this.queueCallback();
			}
		}

	}
	setCallback(callback) {
		this.loadedCallback = callback;
	}
	doneLoading() {
		let result = this.isLoading();

		if (result == 1) {

			if (typeof this.loadedCallback != "undefined" && this.loadedCallback != 0 && this.loadedCallback != null) {
				this.loadedCallback();
			}
		}
	}

	isLoading() {
		let loading = 0;
		this.loadedSounds = 0;
		this.loadingSounds = 0;
		let stillLoading = new Array();
		for (let i = 0; i < this.sounds.length; i++) {
			if (typeof this.sounds[i] != "undefined") {
				if (this.sounds[i].loaded == false) {
					this.loadingSounds++;

				} else {
					this.loadedSounds++;
				}
			}
		}

		return this.loadedSounds / this.sounds.length;
	}

	playOnce(file) {
		this.oneShotSound = this.create(file).sound;
		this.oneShotSound.stop();
		this.oneShotSound.play();
		this.oneShotSound.on("ended", () => {
			if (this.oneShotSound.playing == false) this.oneShotSound.destroy();
		});

	}
	destroy(file, callback = 0) {
		let noMore = false;
		const filename = this.directory + file + this.extension;
		while (!noMore) {
			const found = this.findSoundIndex(filename);
			if (found == -1) {
				noMore = true;
			} else {
				this.sounds[found].sound.unload();
				this.sounds.splice(found, 1);
			}
		}

		if (callback != 0) {
			callback();
		}
	}

	kill(callback = 0) {
		while (this.sounds.length > 0) {
			this.sounds.splice(0, 1);
		}

		sono.destroyAll();
		if (callback != 0) {
			callback();
		}
	}

}
export let so = new SoundObject();