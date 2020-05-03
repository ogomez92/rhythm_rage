let settings;

if (window && window.process && window.process.type) {
	settings = require('electron').remote.require('electron-settings');
}
