'use strict';
import { report } from './main';
import { speech } from './tts';
import { so } from './soundObject';
const MenuTypes = {
	NORMAL: 0,
	SELECTOR: 1,
	SLIDER: 2,
	EDIT: 3,
	AUDIO: 4,
};
class MenuItem {
	constructor(id, name, shortcut = "") {
		this.name = name;
		this.shortcut = shortcut;
		this.id = id;
		this.type = MenuTypes.NORMAL;
	}

	speak() {
		if (this.shortcut == "") speech.speak(this.name);
		if (this.shortcut != "") speech.speak(this.name + " (" + this.shortcut + ")");
	}

	select() {
		return this.id;
	}
}
class AudioItem extends MenuItem {
	constructor(id, name) {
		super();
		this.name = name;
		this.type = MenuTypes.AUDIO;
		this.id = id;
		this.snd = so.create(this.name);
	}

	speak() {
		this.snd.stop();
		this.snd.play();
	}

	select() {
		return this.id;
	}
}


class SelectorItem extends MenuItem {
	constructor(id, name, options, defaultOption = 0, selectCallback) {
		super();
		this.id = id;
		this.name = name;
		this.options = options;
		this.type = MenuTypes.SELECTOR;
		this.currentOption = defaultOption;
		this.selectCallback = selectCallback;
	}

	speak() {
		speech.speak(this.name + '. Selector. ' + this.options[this.currentOption]);
	}

	increase() {
		if (this.currentOption < this.options.length - 1) {
			this.currentOption++;
		}
		speech.speak(this.options[this.currentOption]);
		if (typeof this.selectCallback !== 'undefined') {
			this.selectCallback(this.currentOption);
		}
	}

	decrease() {
		if (this.currentOption > 0) {
			this.currentOption--;
		}
		speech.speak(this.options[this.currentOption]);
		if (typeof this.selectCallback !== 'undefined') {
			this.selectCallback(this.currentOption, this.options[this.currentOption]);
		}
	}

	select() {
		return this.id;
	}
}

class SliderItem extends MenuItem {
	constructor(id, name, from, to, currentValue = 0, increaseBy = 1) {
		super();
		this.id = id;
		this.name = name;
		this.minValue = from;
		this.maxValue = to;
		this.currentValue = currentValue;
		this.increaseBy = increaseBy;
		this.type = MenuTypes.SLIDER;
	}

	speak() {
		speech.speak(this.name + '. Slider. Set to ' + this.currentValue);
	}

	increase() {
		if (this.currentValue < this.maxValue) {
			this.currentValue += this.increaseBy;
		}
		if (this.currentValue > this.maxValue) this.currentValue = this.maxValue;
		speech.speak(this.currentValue + ".");
	}

	decrease() {
		if (this.currentValue > this.minValue) {
			this.currentValue -= this.increaseBy;
		}
		if (this.currentValue < this.minValue) this.currentValue = this.minValue;
		speech.speak(this.currentValue + ".");
	}

	select() {
		return this.id;
	}
}

class EditItem extends MenuItem {
	constructor(id, name, defaultText = '') {
		super();
		this.id = id;
		this.name = name;
		this.text = defaultText;
		this.type = MenuTypes.EDIT;
	}

	speak() {
		speech.speak(this.name + '. Editable. ' + (this.text == '' ? 'Nothing entered.' : 'Set to ' + this.text));
	}

	addChar(char) {
		this.text += char;
		speech.speak(char);
	}

	removeChar() {
		this.text = this.text.substring(0, this.text.length - 1);
		speech.speak(this.text);
	}

	select() {
		return this.text;
	}
}
export { MenuItem, AudioItem, SliderItem, SelectorItem, MenuTypes };
