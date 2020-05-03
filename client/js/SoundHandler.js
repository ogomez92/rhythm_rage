import { SoundSource } from './soundSource.js';
import { so } from './soundObject.js';

class SoundHandler {
	constructor(directional = false) {
		this.staticSounds = [];
		this.dynamicSounds = [];
		this.currentDynamicSound = 0;
		this.maxDynamicSounds = 512;
		this.currentStaticSound = 0;
		this.maxStaticSounds = 512;
		this.reuseSounds = true;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.directional = directional;
	}

	playStatic(file, loop = 1, slot = -1, stream = false) {
		if (slot = -1) {
			slot = this.findFreeStaticSlot();
		}
		this.staticSounds[slot] = new SoundItem(file, this.directional, stream);
		if (loop == 1) {
			this.staticSounds[slot].sound.loop = true;
		}
		this.staticSounds[slot].sound.play();
		return slot;
	}

	findFreeStaticSlot() {
		for (let i = 0; i < this.maxStaticSounds; i++) {
			if (this.staticSounds[i] == -1 || typeof this.staticSounds[i] === 'undefined') {
				return i;
			}
		}
		if (this.currentStaticSound < this.maxStaticSounds) {
			this.currentStaticSound++;
			return this.currentStaticSound;
		}
		this.currentStaticSound = 0;
		return this.currentStaticSound;
	}

	findFreeDynamicSlot() {
		for (let i = 0; i < this.maxDynamicSounds; i++) {
			if (this.dynamicSounds[i] == -1 || typeof this.dynamicSounds[i] === 'undefined') {
				return i;
			}
		}
		if (this.currentDynamicSound < this.maxDynamicSounds) {
			this.currentDynamicSound++;
			return this.currentDynamicSound;
		}
		this.currentDynamicSound = 0;
		return this.currentDynamicSound;
	}

	findDynamicSound(file) {
		for (let i = 0; i < this.dynamicSounds.length; i++) {
			if (this.dynamicSounds[i].file == file) {
				return i;
			}
		}
		return -1;
	}

	play(file) {
		let slot = 0;

		let reuse = 0;
		if (this.reuseSounds) {
			slot = this.findDynamicSound(file);
			reuse = true;
		}
		if (slot == -1 || this.reuseSounds == false) {
			slot = this.findFreeDynamicSlot();
			reuse = false;
		}
		if (typeof this.dynamicSounds[slot] === 'undefined') {
			if (reuse == false) {
				this.dynamicSounds[slot] = new SoundItem(file, this.directional);
			}
		} else if (reuse == false) {
			this.dynamicSounds[slot].sound.destroy();
			this.dynamicSounds[slot] = new SoundItem(file, directional);
		}
		this.dynamicSounds[slot].sound.play();
	}

	update(position) {
		if (this.directional == true) {
			for (let i = 0; i < this.dynamicSounds.length; i++) {
				this.dynamicSounds[i].sound.pos(position.x, position.y, position.z);
			}
		}
	}

	destroy() {
		for (var i = 0; i < this.dynamicSounds.length; i++) {
			this.dynamicSounds[i].destroy();
			this.dynamicSounds.splice(i, 1);
		}

		for (var i = 0; i < this.staticSounds.length; i++) {
			this.staticSounds[i].destroy();
			this.staticSounds.splice(i, 1);
		}
	}
}
class SoundItem {
	constructor(file, threeD = false, stream = false) {
		this.file = file;
		this.threeD = threeD;
		if (this.threeD == true) {
			this.sound = new SoundSource(file, 0, 0, 0);
		} else {
			this.sound = so.create(file, stream);
		}
	}

	destroy() {
		this.sound.destroy();
	}
}

export { SoundHandler };
