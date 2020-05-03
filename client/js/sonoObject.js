import sono from 'sono';
var isElectron = true;
var playOnceTimer;
class SoundObjectItem {
	constructor(file, callback=0, tag=0) {
			this.fileName = file;
		
if (typeof file=="string") {

		this.sound = sono.create({src:file,onComplete:() => { this.doneLoading(); } });
		this.timeout = setTimeout(() => { this.checkProgress();}, 2000);
		}
if (typeof file=="object") {
this.sound = sono.create("");
this.sound.data=file;
}
		
		this.data = this.sound.data;
		this.loaded = false;
		this.callback = callback;
		this.timeToLoad = performance.now();
		this.tag = tag;
	}
	set loop(v) {
	this.sound.loop=v;
	}
	checkProgress() {
		
		if (this.sound.progress == 0) {
			this.sound.destroy();
			this.sound = sono.create({src:this.fileName,onComplete:() => { this.doneLoading(); } });
		}
		
		if (this.sound.progress == 1) {
			this.doneLoading();
		} else {
			this.timeout = setTimeout(() => { this.checkProgress();}, 500);
		}
		
	}
	
	doneLoading() {
		clearTimeout(this.timeout);
		this.data = this.sound.data;
		this.loaded = true;
		
		if (this.callback!=0) {
			
			this.callback();
		}
	}
	play() {
		this.sound.play();
	}
	destroy() {
		this.sound.destroy();
		
	}
	pos(x,y,z) {
		
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



			
		
		
		this.oneShotSound = null;
	}
	setStatusCallback(callback) {
		this.statusCallback = callback;
	}
	findSound(file) {
		for (let i=0;i<this.sounds.length;i++) {
			if (this.sounds[i].fileName == file) {
				return this.sounds[i];
			}
		}
		return -1;
	}
	resetQueuedInstance() {
		for (let i=0;i<this.sounds.length;i++) {
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
	
	
	
	create(file) {
		file = this.directory + file + this.extension;
		let found = this.findSound(file);
		let returnObject = null;
		if (found == -1 || found.data == null) {
					returnObject = new SoundObjectItem(file, () => { this.doneLoading(); });
			
			this.sounds.push(returnObject);
			
		} else {
			//returnObject = new SoundObjectItem(sono.utils.cloneBuffer(found.sound.data), () => { this.doneLoading(); });
			returnObject = new SoundObjectItem(found.sound.data, () => { this.doneLoading(); });
					}
		return returnObject.sound;
	}
	
	enqueue(file) {
		
		file = this.directory + file + this.extension;
		console.log("queuing "+file);
		this.queue.push(file);
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
		this.queue = new Array();
		this.loadingQueue = false;
	}
	handleQueue() {
		
		
		if (this.queue.length > 0) {
			
			
			if (typeof this.statusCallback != "undefined" && this.statusCallback!=null) {
				this.statusCallback(1-this.queue.length/this.queueLength);
			}
			if (this.findSound(this.queue[0])!=-1) {
				
				
				this.queue.splice(0, 1);
				
				this.handleQueue();
				return;
			}
			this.sounds.push(new SoundObjectItem(this.queue[0], () => { this.handleQueue(); }, 1));
			this.queue.splice(0, 1);
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
				console.log(this.loadedCallback);
				this.loadedCallback();
			}
		}
	}
	
	isLoading() {
		let loading = 0;
		this.loadedSounds = 0;
		this.loadingSounds= 0;
		let stillLoading = new Array();
		for (let i=0;i<this.sounds.length;i++) {
			if (typeof this.sounds[i] != "undefined") {
				if (this.sounds[i].loaded == false) {
					this.loadingSounds++;
					
				} else {
					this.loadedSounds++;
				}
			}
		}
		
		return this.loadedSounds/this.sounds.length;
	}
	
	playOnce(file) {
		this.oneShotSound = this.create(file).sound;
		this.oneShotSound.stop();
		this.oneShotSound.play();
		this.oneShotSound.on("ended", () => {
		if (this.oneShotSound.playing==false) this.oneShotSound.destroy();
		 });
		
	}
	
}
export let son = new SoundObject();