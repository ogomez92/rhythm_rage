import { utils } from './utilities';
import "babel-polyfill";
import { speech } from './tts';
var fs = require('fs');
import { so } from './soundObject';
class NumberSpeaker {
	constructor() {
		this.ntw = require('number-words');
		this.word_list = [];
		this.has_number = false;
		this.current_index = 0;
		this.prepend = "";
		this.append = "";
		this.include_and = false;
		this.sound = null;
	}

	speak(the_number) {
		the_number = Math.floor(the_number);
		// Reset our internal data.

		this.word_list = [];
		this.has_number = false;
		this.current_index = 0;
		if (this.sound != null) this.sound.destroy();
		// Check for invalid range.
		if (this.the_number < -999999999 || this.the_number > 999999999) {
			return -1;
		}
		// Convert our number to English words, and then split it up by space.
		let english_words = this.ntw.convert(Math.abs(the_number));
		if (the_number == 0) english_words = "zero";
		console.log(english_words);

		if (english_words == "") {
			return -1;
		}
		this.word_list = english_words.split(" ");
		if (the_number < 0) this.word_list.unshift("minus");
		this.has_number = true;
		if (!this.and) {

			for (let i = 0; i < this.word_list.length; i++) {
				if (this.word_list[i] == "and") {
					this.word_list.splice(i, 1);
					i--;
				}
			}
		}
		// We call "speak_next" so that the first number is spoken immediately.
		if (this.speak_next() == -1) {
			return -1;
		}
		return 0;
	}

	speak_next() {
		// First we do some checks to see if the number is still being spoken.
		if (this.has_number == false) {
			if (this.sound != null) {
				if (this.sound.playing == false && this.sound.sound.state() != "loading") {
					this.sound.destroy();
					return 0;
				}
				else {
					return 1;
				}
			}
			return -1;
		}
		if (this.sound != null) {
			if (this.sound.playing == true || this.sound.sound.state() == "loading") {
				return 1;
			}
		}
		// Now we go through the remaining words, looking for the best matching filename.
		let look_until = this.word_list.length;
		let assembled_filename = this.prepend;
		let count = 0;
		while (true) {
			for (let i = this.current_index; i < look_until; i++) {
				if (i == look_until - 1) {
					assembled_filename += this.word_list[i] + this.append;
				}
				else {
					assembled_filename += this.word_list[i] + "_";
				}
			}
			// Now we have a filename to test, let's see if it loads.
			console.log(assembled_filename);
			if (!fs.existsSync(__dirname + "/sounds/" + assembled_filename + so.extension)) {
				// It didn't, so we remove the last entry from our current search.
				look_until -= 1;
				if (look_until == this.current_index) {
					// No file matched the smallest possible search, so we get out.
					this.word_list = [];
					this.has_number = false;
					this.current_index = 0;
					if (this.sound != null) this.sound.destroy();
					return -1;
				}
				// There are still some possible alternatives left, keep searching.
				assembled_filename = this.prepend;
				continue;
			}
			else {
				// We found a file, so we tell the next search to begin at the point where we stopped.
				console.log(assembled_filename);
				this.sound = so.create(assembled_filename);
				this.current_index = look_until;
				this.sound.play();
				this.sound.sound.once("end", () => {
					this.speak_next();
				});

				if (this.current_index == this.word_list.length) {

					// We've reached the end of our word list, so we don't search anymore.
					this.word_list = [];
					this.has_number = false;
					this.current_index = 0;
				}
			}
			return 1;
		}
		return -1;
	}

	stop() {
		// Reset our internal data.
		this.word_list = [];
		this.has_number = false;
		this.current_index = 0;
		if (this.sound != null) {
			this.sound.destroy();
		}
	}

	async speakWait(the_number) {
		// This is just a simple wrapper around "speak" and "speak_next".
		if (this.speak(the_number) == -1)
			return -1;
		let result = 0;
		while (true) {
			await utils.sleep(5);
			result = this.speak_next();
			if (result == -1) {
				return -1;
			}
			if (result == 0)
				return 0;
		}
		return -1;
	}
}
export { NumberSpeaker }