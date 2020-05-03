import {speech} from './tts';
import {strings} from './strings';
import {KeyboardInput} from './input.js';
import {KeyEvent} from './keycodes.js';

export class Buffer {
	constructor() {
		this.items=[];
		this.cursor=0;
		this.input=new KeyboardInput();
		this.input.init();
		this.input.justPressedEventCallback=((key)=> {
			this.process(key);
		});
	}
	add(localizedString,items=[]) {
		let txt=strings.get(localizedString,items);
		this.items.unshift(txt);
		if (this.items.length>10) this.items.length=10;
		speech.speak(txt);
	}
	process(key) {
		//are control and numbers held?
		if (key>47 && key<=57 && this.input.isDown(17)) {
			//get the message number we need from the pressed key.
			let number=key-49;
			//0 is the first number in the iso keycodes but it's the last message we need with it.
			if (key==48) number=9;
			if (number>=this.items.length) {
				strings.speak("notInBuffer",[number+1]);
				return;
			}
			
			speech.speak(this.items[number]);
		}
		switch(key) {
			case KeyEvent.DOM_VK_PAGE_UP:
			this.cursor++;
			if (this.cursor>=this.items.length) this.cursor=this.items.length-1;
			speech.speak(this.items[this.cursor]);
			break;
			case KeyEvent.DOM_VK_PAGE_DOWN:
			this.cursor--;
			if (this.cursor<0) this.cursor=0;;
			speech.speak(this.items[this.cursor]);
			break;
			case KeyEvent.DOM_VK_HOME:
			this.cursor=0;
			speech.speak(this.items[this.cursor]);
			break;
			case KeyEvent.DOM_VK_END:
			this.cursor=this.items.length-1;
			speech.speak(this.items[this.cursor]);
			break;
			default:
			break;
		}
}
}