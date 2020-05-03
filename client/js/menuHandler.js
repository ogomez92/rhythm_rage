'use strict';
import {utils} from './utilities';
import {ScrollingText} from './scrollingText';
import {speech} from './tts';
import {so} from './soundObject';
import {langs, lang} from './main';
import {strings} from './strings';
import {MenuItem} from './menuItem';
import {KeyboardInput} from './input.js';
import {KeyEvent} from './keycodes';
import {Menu} from './menu';

export async function changeRate() {
	let rate=speech.rate;
	let inp=new KeyboardInput();
	inp.init();
	strings.speak("rating");
	while (!inp.isJustPressed(KeyEvent.DOM_VK_RETURN)) {
	await utils.sleep(5);	
	if (inp.isJustPressed(KeyEvent.DOM_VK_RIGHT)) {
rate=rate+0.25;
speech.rate=rate;
		strings.speak("newRate");
	}
	if (inp.isJustPressed(KeyEvent.DOM_VK_LEFT)) {
rate=rate-0.25;
speech.rate=rate;
		strings.speak("newRate");
	}
}
data.rate=speech.rate;
save();
st.setState(2);
}