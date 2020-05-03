'use strict';
import fs from 'fs';
import os from 'os';
import { KeyEvent } from './keycodes';
import { pack, packdir } from './main';
import { ScrollingText } from './scrollingText';

class Player {
	constructor() {
		this.beatcoins = 0,
			this.pack = 'default',
			this.allowSave = false;
		this.save = {};
		this.actionKeys = [0, 0, KeyEvent.DOM_VK_SPACE, KeyEvent.DOM_VK_TAB, KeyEvent.DOM_VK_RETURN, KeyEvent.DOM_VK_BACK_SPACE, KeyEvent.DOM_VK_UP, KeyEvent.DOM_VK_DOWN, KeyEvent.DOM_VK_RIGHT, KeyEvent.DOM_VK_LEFT];
		this.unlocks = {};
		this.unlocks.default = {
			level: 0,
			fails: 0,
			win: false,
			average: 0
		};
	}
}
export { Player };
