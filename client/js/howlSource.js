'use strict';

import { Howl, Howler } from './howler';
import { so } from './soundObject.js';

// Meow.panner.defaults= {
//     panningModel:'HRTF',
// 	maxDistance:2000
//
//
// };

class SoundSource {
	constructor(file, x = 0, y = 0, z = 0, loop = true) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.loop = loop;
		this.sound = so.create(file);

		this.sound.loop = loop;
		this.sound.pos(this.x, this.y, this.z);
		this.rate = 1;
		this.speed = 0;
		this.minRate = 0.8;
		this.maxRate = 1.2;
		this.toDestroy = false;
		this.rateShiftSpeed = 0.015;
		// This.sound.currentPosition = getRandomArbitrary(0, this.sound.duration);
		this.sound.currentPosition = 0;
	}

	play() {
		// This.sound.seek(0);
		this.sound.play();
	}

	pos(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
		this.sound.pos(this.x, this.y, this.z);
	}

	update() {

	}

	setDoppler(z1, speed, direction) {
		if (speed >= 0) {
			if (direction == -1) {
				speed += this.speed;
				// This.rate = 1+Math.sin(((speed/10000)*(this.z-z1)));
				var freq = 44100 * (1 - (speed / 240));
				this.rate = freq / 44100;
			} else {
				speed += this.speed;
				// This.rate = 1-Math.sin(((speed/10000)*(z1-this.z)));
				var freq = 44100 / (1 - (speed / 240));
				this.rate = freq / 44100;
			}
		} else {
			this.rate = 1;
		}

		// If (this.rate > this.maxRate) this.rate = this.maxRate;
		// if (this.rate < this.minRate) this.rate = this.minRate;
		// this.sound.playbackRate = this.rate;
		if (this.rate > this.sound.playbackRate + this.rateShiftSpeed) {
			this.sound.playbackRate += this.rateShiftSpeed;
		} else if (this.rate < this.sound.playbackRate - this.rateShiftSpeed) {
			this.sound.playbackRate -= this.rateShiftSpeed;
		}
	}

	setSpeed(speed) {
		this.speed = speed;
	}

	destroy() {
		this.sound.unload();
		this.toDestroy = true;
	}
}

export { SoundSource };
