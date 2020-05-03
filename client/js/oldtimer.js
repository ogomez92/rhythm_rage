'use strict';
class OldTimer {
	constructor() {
		this.elapsed;
		this.paused = false;
		this.lastTime = 0;
		this.pauseWhen = 0;
		this.started = true;
	}

	isActive() {
		return !paused & started;
	}

	get elapsed() {
		if (this.paused) {
			return this.pauseWhen - this.lastTime;
		}
		return performance.now() - this.lastTime;
	}

	pause() {
		this.paused = true;
		this.pauseWhen = performance.now();
	}

	reset() {
		this.lastTime = performance.now();
		this.pauseWhen = 0;
		this.paused = false;
		this.started = true;
	}

	restart() {
		this.lastTime = performance.now();
		this.pauseWhen = 0;
		this.paused = false;
		this.started = true;
	}

	resume() {
		this.paused = false;
		this.started = true;
		this.lastTime += performance.now() - this.pauseWhen;
	}
}
export { OldTimer };
