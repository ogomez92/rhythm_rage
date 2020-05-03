function Timer(callbacks, step) {
	let last = 0;
	let active = false;
	let acc = 0;
	let tick = 0;
	let inc = step || 1 / 120;
	let frameId;

	function onFrame(time) {
		if (last !== null) {
			acc += (time - last) / 1000;
			while (acc > inc) {
				callbacks.update(inc, tick);
				tick += 1;
				acc -= inc;
			}
		}
		last = time;
		callbacks.render();
		if (active) {
			frameId = requestAnimationFrame(onFrame);
		}
	}

	function start() {
		last = null;
		active = true;
		frameId = requestAnimationFrame(onFrame);
	}

	function stop() {
		active = false;
		cancelAnimationFrame(frameId);
	}
	function change(value) {
		inc = value || 1 / 60;
		acc = inc;
		tick = 0;
		stop();
		start();
	}
	return {
		start,
		stop,
		change
	};
}

module.exports = Timer;
