'use strict';
import { reportString, lang } from './main';
import { utils } from './utilities';
import { speech } from './tts';
import { ScrollingText } from './scrollingText';
class Strings {
	constructor() {
		this.strings = {};
		this.strings[1] = {
			lang: "English",
		};
		this.strings[2] = {
			lang: "Spanish",
			mainMenu: "Menú principal",
			deleteAchievements: "Borrar logros",
			achievements: "Logros",
			changeRate: "Cambiar velocidad de la voz",
			downloadPacks: "Descargar packs",
			changePack: "Cambiar pack",
			levelSelect: "Seleccionar nivel",
			fileNotFound: "Archivo no encontrado: %1",
			packError: "Error! No hay packs instalados. Instala packs desde la página web",

		};
	}

	get(what, rep = []) {
		let str;
		if (typeof this.strings[lang][what] !== 'undefined') {
			str = this.strings[lang][what];
		} else if (typeof this.strings[1][what] !== 'undefined') {
			str = this.strings[1][what];
		} else {
			reportString(what);
			return what;
		}
		rep.forEach((v, i) => {
			const i1 = Number(i) + 1;
			str = str.replace('%' + i1, v);
		});
		return str;
	}
	speak(what, rep = []) {
		let str;
		if (typeof this.strings[lang][what] !== 'undefined') {
			str = this.strings[lang][what];
		} else if (typeof this.strings[1][what] !== 'undefined') {
			str = this.strings[1][what];
		} else {
			speech.speak(what);
		}
		rep.forEach((v, i) => {
			const i1 = Number(i) + 1;
			str = str.replace('%' + i1, v);
		});
		speech.speak(str);
	}
	async check(lng) {
		let len = utils.objSize(this.strings) - 2;
		for (let i in this.strings[1]) {
			if (!this.strings[lng].hasOwnProperty(i)) {
				await new ScrollingText(i + ": " + this.strings[1][i]);
			}
		}
	}
}
export var strings = new Strings();
