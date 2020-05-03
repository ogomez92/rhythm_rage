'use strict';
import { so } from './soundObject';

import { KeyboardInput } from './input';
import { KeyEvent } from './keycodes';
import { speech } from './tts';
class LanguageSelector {
	constructor(element, callback) {
		this.langs = [];
		this.input = new KeyboardInput();
		this.input.init();
		this.langs.push("select a language. Selecciona un idioma.");
		this.langs.push("I want to play in English");
		this.langs.push("Quiero jugar en español.");
		this.id = document.getElementById(element);
		this.callback = callback;
		this.container = document.createElement('div');
		this.buttons = [];
		this.buttons[0] = document.createElement('div');
		this.buttons[0].innerHTML = this.langs[0];
		this.container.appendChild(this.buttons[0]);
		for (let i = 1; i < this.langs.length; i++) {
			this.buttons[i] = document.createElement('input');
			this.buttons[i].type = 'button';
			this.buttons[i].value = this.langs[i];
			this.buttons[i].addEventListener('click', () => {
				this.sound.stop()
				this.callback(i);
				this.container.innerHTML = '';
				this.input.removeAllListeners();
				document.getElementById("app").focus();
			});
			this.buttons[i].addEventListener('focus', () => {
				this.sound.stop();
				speech.setLanguage(i);
				speech.speak(this.langs[i]);
			});
			this.container.appendChild(this.buttons[i]);
			this.input.once("chr" + i, () => {
				this.sound.stop()
				this.callback(i);
				this.container.innerHTML = '';
				this.input.removeAllListeners();
				document.getElementById("app").focus();
			});
		}
		this.id.appendChild(this.container);
		this.sound = so.create("ui/langSelect");
		this.sound.play();

	}
}
module.exports.LanguageSelector = LanguageSelector;
