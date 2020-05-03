const EventEmitter = require('events');
'use strict';
class KeyboardInput extends EventEmitter {
	constructor() {
		super();
		this.keyDown = [];
		this.justPressed = [];
		this.chars = [];
		this.justReleased = [];
		this.justPressedEventCallback = null;
		this.charEventCallback = null;
	}

	init() {
		const that = this;
		document.addEventListener('keydown', event => {
			that.handleKeyDown(event);
		});
		document.addEventListener('keyup', event => {
			that.handleKeyUp(event);
		});
		document.addEventListener('keypress', event => {
			that.handleChar(event);
		});
	}
	pause() {
		this.isPaused = true;
	}
	resume() {
		this.isPaused = false;
	}
	handleKeyDown(event) {
		if (this.keyDown[event.which] != true || typeof this.keyDown[event.which] === 'undefined') {
			this.keyDown[event.which] = true;
			this.justPressed[event.which] = true;
			this.emit(event.which);
			this.justReleased[event.which] = false;
			if (typeof this.justPressedEventCallback !== 'undefined' && this.justPressedEventCallback != null) {
				this.justPressedEventCallback(event.which);
			}
		}
	}

	handleChar(char) {
		if (char.which < 48 || char.which > 122) {
			return;
		}
		if (String.fromCharCode(char.which) != '') {
			this.chars += String.fromCharCode(char.which);
			this.emit("chr" + String.fromCharCode(char.which));
			if (typeof this.charEventCallback !== 'undefined' && this.charEventCallback != null) {
				this.charEventCallback(String.fromCharCode(char.which));
			}
		}
	}

	handleKeyUp(event) {
		if (this.keyDown[event.which] == true) {
			this.keyDown[event.which] = false;
			this.justPressed[event.which] = false;
			this.justReleased[event.which] = true;
			this.emit("!" + event.which);
		}
		this.chars = '';
	}
	destroy() {
		this.charEventCallback = null;
		this.justPressedEventCallback = null;
	}
	isDown(event) {
		if (this.isPaused) return false;
		return this.keyDown[event];
	}

	isJustPressed(event) {
		if (this.isPaused) return false;
		if (this.justPressed[event] == true) {
			this.justPressed[event] = false;
			return true;
		}
		return false;
	}

	isJustReleased(event) {
		if (this.justReleased[event]) {
			this.justReleased[event] = false;
			return true;
		}
		return false;
	}

	keysDown() {
		const kd = [];
		this.keyDown.forEach((v, i) => {
			if (v) {
				kd.push(i);
			}
		});
		return kd;
	}

	getChars() {
		const kd = this.chars;
		this.chars = '';
		return kd;
	}

	keysPressed() {
		const kd = [];
		this.justPressed.forEach((v, i) => {
			if (v) {
				kd.push(i);
			}
		});
		this.justPressed.splice();
		return kd;
	}

	releaseAllKeys() {

	}

	keysReleased() {
		const kd = [];
		this.justReleased.forEach((v, i) => {
			if (v) {
				kd.push(i);
			}
		});
		this.justReleased.splice();
		return kd;
	}
}

export { KeyboardInput };
