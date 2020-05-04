let debugl = "";
const os = require('os');
let name;
const fs = require('fs');
import { OldTimer } from './oldtimer';
let debug = false;
let first_iter;
let tut_count;
let gotoline = 0;
export function report(err) {
	const prom = new Promise(resolve => {
		fetch(
			"http://oriolgomez.com/report.php?error=" +
			encodeURIComponent(err.name + ": " + err.message + "\n" + err.stack)
		)
			.then(event => event.text())
			.then(data => {
				speech.speak("Error! " + err.message + ": " + err.stack);
				resolve(data);
			});
	});
}
export function reportString(what) {
	const prom = new Promise(resolve => {
		fetch(
			"http://oriolgomez.com/report.php?error=" +
			encodeURIComponent("unlocalized rhythm rage string: " + what)
		)
			.then(event => event.text())
			.then(data => {
				speech.speak("Error! " + err.message + ": " + err.stack);
				resolve(data);
			});
	});
}

let tut_beep, tut_ap, tut_early, tut_late, tut_great;
let enhancing;
let tut_mus;
let intersounds = [];
let enhanced = true;
let tut_right = 0, tut_wrong = 0, tut_start = 0, tut_finish = 0, tut_max = 0;
let musiconly;
let keycal = 0;
let timewindow;
let actiontimes = [];
let okval;
let last;
let totalactions;
let strict;
let cooltime;
export let cooldown = false;
export let cooler = new OldTimer();
export let debugmode;
let ok_n, super_n;
let com = "";
let newlevel, oklevel, faillevel, superlevel, perfectlevel;
let alreadyplayed;
let lname;
let ln;
let lockerror;
let mp;
let ok;
let curlev;
export let perfect = true;
let question;
let olv;
let tuts;
let tute, tutes, tuten, tutem;
let unlockeda;
let totala;
let tutorial;
let keys = [];
let achievements;
let jng, failjng, perfectjng;
let superv, okjng;
let wait;
let seek = 0;
export let aliases = {};
let presets = {};
let macrod = {};
let lasts, lasta, lastsn, lastan, lastak;
let curline;
let sounds = [];
let actions = [];
let f;
let mpos;
let loadp;
let packing;
let packnames;
let packfiles;
let creatingpack = true;
let mode;
let playing;
let music;
let lastscore = 0, lastdiff = 0, lastlevel = 0;
let vos;
export let pool = new SoundHandler();
export var lang = 1;
export let perfectrun, bad, good, held;
import { Snd, Action, Intersound, preload, lsd, lad, snd, preload_add } from './classes';
export var ttsVoice;
export var ttsRate = 1;
let achs = [
	"fw", "fl", "idle", "dl", "dw", "w1", "w5", "w10", "w25", "w50", "usepinky", "lactions", "fingr", "bulk", "intro", "slotwin", "frust", "catslots", "robber",
];
export var editing = false;

let boot = false;
import { Player } from './player';
import { SliderItem, MenuItem } from './menuItem';
import { Menu } from './menu';
import walk from 'fs-walk';
import { ScrollingText } from './scrollingText';
import { strings } from './strings';
import { SoundHandler } from './soundHandler';
import { speech } from './tts';
import { utils } from './utilities';
import { so } from './soundObject';
import { KeyEvent } from './keycodes';
export var mangle = require("base-64");
import { KeyboardInput } from './input.js';
export var langs = ['', 'english', 'spanish'];
export let pack = 'default';
export var data = '';
export var path = os.homedir() + '/rpacks/' + pack + '/';
document.addEventListener('DOMContentLoaded', setup);
async function fade2(sound) {
	await new Promise(async (resolve, reject) => {
		await sound.fade(300)
	});
}
function nopack() {
	so.directory = "./sounds/";
}
function yespack() {
	so.directory = path;
}
async function setup() {
	document.getElementById("app").focus();
	let snd = so.create("logo" + lang);
	await snd.playSync();
	if (!fs.existsSync(os.homedir() + '/rpacks')) {
		fs.mkdirSync(os.homedir() + '/rpacks');
	}
	checkPack();
}
export function save() {
	if (!fs.existsSync(os.homedir() + '/rpacks')) {
		fs.mkdirSync(os.homedir() + '/rpacks');
	}
	let write = JSON.stringify(data);
	fs.writeFileSync(os.homedir() + '/rpacks/save.dat', write);
}
export async function checkPack(changeBoot = true, debug = false) {
	perfectjng = "perfect_jingle";
	superv = "super_jingle";
	failjng = "fail_jingle";
	okjng = "ok_jingle";
	try {
		//data = JSON.parse(mangle.decode(fs.readFileSync(os.homedir() + '/rpacks/save.dat')));
		data = JSON.parse(fs.readFileSync(os.homedir() + '/rpacks/save.dat'));
		if (typeof data.rate !== 'undefined') {
			speech.rate = data.rate;
		}
	} catch (err) {
		data = new Player();
		let introing = true;
		let str = "";
		for (let i in strings.strings) {
			str += strings.strings[i].langs + ". ";
		}//for

		let items = [];
		let counter = 1;
		for (let i in strings.strings) {
			items.push(new MenuItem(counter, strings.strings[i].lang));
			counter++;
		}//for
		let lm = new Menu(str, items);
		lm.run((s) => {
			lang = s.selected;
			data.lang = lang;
			save();
			lm.destroy();
		});//lang
	}//catch
	pack = data.pack;
	lang = data.lang;
	if (typeof data.rate !== "undefined") speech.rate = data.rate;
	path = os.homedir() + '/rpacks/' + pack + '/';
	save();
	if (!fs.existsSync(path)) {
		pack = 'default';
		path = os.homedir() + '/rpacks/' + pack + '/';
	}//exists
	if (!fs.existsSync(path)) {
		await new ScrollingText(strings.get("packError"));
		return;
	}//exists

	if (fs.existsSync(path + "tut_next.ogg")) {
		yespack();
		tuten = so.create("tut_next");
	}
	else {
		nopack();
		tuten = so.create("tut_next");
		yespack();
	}
	if (fs.existsSync(path + "tut_start.ogg")) {
		yespack();
		tutes = so.create("tut_start");
	}
	else {
		nopack();
		tutes = so.create("tut_start");
		yespack();
	}
	if (fs.existsSync(path + "tut_end.ogg")) {
		yespack();
		tute = so.create("tut_end");
	}
	else {
		nopack();
		tute = so.create("tut_end");
		yespack();
	}
	nopack();
	tut_ap = so.create("tut_good");
	tut_early = so.create("tut_early");
	tut_late = so.create("tut_late");
	tut_great = so.create("tut_bell");
	tut_beep = so.create("tut_beep");
	yespack();
	let stre = " " + strings.get("fileNotFound");
	if (!fs.existsSync(path + perfectjng + ".ogg")) {
		await new ScrollingText(perfectjng + stre);
	}
	if (!fs.existsSync(path + superv + ".ogg")) {
		await new ScrollingText(superv + stre);
	}
	if (!fs.existsSync(path + okjng + ".ogg")) {
		await new ScrollingText(okjng + stre);
	}
	if (!fs.existsSync(path + failjng + ".ogg")) {
		await new ScrollingText(failjng + stre);
	}
	if (!fs.existsSync(path + "win_pack.ogg") && creatingpack) {
		await new ScrollingText("win_pack " + stre);
	}

	if (fs.existsSync(path + "logo.ogg") && !alreadyplayed) {
		alreadyplayed = true;
		yespack();
		let logo = so.create("logo");
		await logo.playSync();
	}
	if (!fs.existsSync(path + "newach.ogg") && creatingpack) {
		await new ScrollingText("newach" + stre);
	}
	else {
		achs = so.create("newach");
	}
	mainMenu();
}//function
var download = function (url, dest, cb) {
	const http = require('http');
	var file = fs.createWriteStream(dest);
	var request = http.get(url, function (response) {
		response.pipe(file);
		file.on('finish', function () {
			file.close();
			cb();
		});
	});
}
function mainMenu() {
	nopack();
	lockerror = so.create("lock_error");
	oklevel = so.create("oklevel");
	faillevel = so.create("faillevel");
	newlevel = so.create("newlevel");
	newlevel.bgtVolume = -2;
	superlevel = so.create("superlevel");
	perfectlevel = so.create("perfectlevel");
	yespack();
	if (com != "") {
		startlev(com);
	}
	yespack();
	mp = -1;
	so.directory = path;
	let items = [];
	items.push(new MenuItem("select", strings.get("levelSelect")));
	items.push(new MenuItem("change", strings.get("changePack")));
	items.push(new MenuItem("getpacks", strings.get("downloadPacks")));
	items.push(new MenuItem("rate", strings.get("changeRate")));

	items.push(new MenuItem("ach", strings.get("achievements")));
	items.push(new MenuItem("achclear", strings.get("deleteAchievements")));
	let menu = new Menu(strings.get("mainMenu"), items);
	let music = so.create("menu_music", true)
	music.play();
	music.loop = true;
	yespack();


	menu.run(async (s) => {
		await music.fade(300)
		menu.destroy();
		music.destroy();
		if (s.selected == "select") {
			startgame(1);
		}
		if (s.selected == "rate") {
			changeRate();
			return;
		}
	});
}
function set_level(level, value) {
	if (typeof data["unlocks"] === "undefined") data.unlocks = {}
	if (typeof data["unlocks"][pack] === "undefined") data.unlocks[pack] = {}
	if (typeof data["unlocks"][pack]["levels"] === "undefined") data.unlocks[pack]["levels"] = {}
	data.unlocks[pack]["levels"][level] = value;
	save();
}
function get_level(level) {
	if (typeof data["unlocks"] === "undefined") data.unlocks = {}
	if (typeof data["unlocks"][pack] === "undefined") data.unlocks[pack] = {}
	if (typeof data["unlocks"][pack]["levels"] === "undefined") data.unlocks[pack]["levels"] = {}
	save()
	if (typeof data.unlocks[pack]["levels"][level] === "undefined") return false;
	return data.unlocks[pack]["levels"][level];
}

async function startgame(md) {
	perfectrun = false;
	musiconly = false;
	const lineByLine = require('./readlines.js');
	question = 2;
	let levfiles = await utils.findFiles(path, "lvl");
	last = false;
	okval = 0;
	let levels = 0, locked = 0;
	let levname;
	var readline = require('readline');
	var stream = require('stream');
	let lock = strings.get("locked");
	let items = [];
	for (let i = 0; i < levfiles.length; i++) {
		levname = levfiles[i].substr(0, levfiles[i].length - 4);
		if (get_level(levname) > 1 || i == 0 || creatingpack) {
			levels++;
			let line = await fs.readFileSync(path + levfiles[i])
			line=line.split("\n")[0]
			console.log(line)
			items.push(new MenuItem(levname, line.toString('utf8')));
		}
		else {
			if (get_level(levname)) {
				levels++;
				const liner = new lineByLine(path + levfiles[i]);
				let line;
				let lineNumber = 0;
				while (lineNumber < 1) {
					line = liner.next();
					items.push(new MenuItem(levname, line.toString('utf8')));
					lineNumber++;
				}
				continue;
			}
			items.push(new MenuItem("locked123", lock));
			locked++;
		}
	}
	items.push(new MenuItem("esc", strings.get("goBack")));
	//strings.get should use %1 && %2
	let lmenu = new Menu(strings.get("levelMenu", [levels, locked]), items, so.create("select_level_music"));
	lmenu.run(async (s) => {
		await lmenu.music.fade(400);
		lmenu.destroy();
		if (s.selected == "locked123") {
			new ScrollingText(strings.get("thisLevelLocked"), "\n", () => {
				startgame(1);
			});
		}
		else if (s.selected == "esc") {
			mainMenu();
		}
		else {
			if (levfiles[levfiles.length - 1] == s.selected) last = true;
			startlev(s.selected);
		}
	});//menu run
}//function

async function startlev(lv) {
	let type = 0;
	actiontimes = [];
	strict = false;
	debugmode = false;
	super_n = 91;
	ok_n = 70;
	timewindow = 150 + keycal;
	cooltime = 0;
	unlockeda = 0;
	totala = 0;
	tutorial = false;
	let macrostuff = "";
	perfectjng = "perfect_jingle";
	superv = "super_jingle";
	failjng = "fail_jingle";
	okjng = "ok_jingle";
	aliases = {};
	presets = {};
	//tutorial
	lname = lv;
	olv = lv;
	let olv2 = lv;
	let items = [];
	if (fs.existsSync(path + lname + ".tut") && question != 1) {
		items.push(new MenuItem("tut", strings.get("tutorial")));
	}
	items.push(new MenuItem("play", strings.get("play")));
	//here
	if (get_level(lname) >= 3) {
		items.push(new MenuItem("perfectrun", strings.get("perfectRun")));
	}
	else {
		items.push(new MenuItem("esc", strings.get("perfectRunNotAvailable")));
	}
	if (get_level(lname) >= 4) {
		items.push(new MenuItem("str", strings.get("listenSoundtrack")));
	}
	items.push(new MenuItem("esc", strings.get("cancel")));
	let r;
	if (com != "") { question = 0; }
	if (com == "") {
		let choice = new Menu(strings.get("chooseLevelOption"), items);
		r = await choice.runSync();
		if (r == "tut") question = 1;
		if (r == "play") question = 2;
		if (r == "perfect") {
			question = 2;
			perfectrun = true;
		}
		if (r == "str") {
			question = 2;
			musiconly = true;
		}
		if (r == "esc") {
			startgame(1);;
			return;
		}
		if (r == "tut") question = 1;
		if (r == "play") question = 2;
	}
	if (question == 1) {
		lv = lname + ".tut";
		tutorial = true;
	}
	if (question == 2) {
		lv = lname + ".lvl";
		tutorial = false;
	}
	if (tutorial) {
	}
	jng = olv2 + "j";
	actions = [];
	sounds = [];
	wait = 0;
	seek = 0;
	let lev_vol = 0;
	let f = fs.readFileSync(path + lv, "utf8");
	let the_string = f;
	let input = new KeyboardInput();
	input.init();
	wait = 0;
	for (let i = 1; i < 3; i++) {
		if (tutorial) {
			let lines = the_string.split("\r\n");
			await tutes.playSync();
			gotoline = 0;
			for (let i = gotoline; i < lines.length; i++) {
				if (lines[i] == "jump") {
					gotoline = i;
				}
			}
			for (let i = gotoline; i < lines.length; i++) {
				let w = lines[i].split(" ");
				for (let i = 0; i < w.length; i++) {
					if (w[0] == "play") await preload(w[1]);
				}
			}
		}
		if (the_string == "") {
			break;
		}
		let lines = the_string.split("\r\n");
		for (let i = gotoline; i < lines.length; i++) {
			let ach = "";
			if (tutorial) {
				if (input.isJustPressed(KeyEvent.DOM_VK_Q)) break;
			}
			let achie = "";
			let words = lines[i].split(" ");
			curline = i + 1;
			let result = lines[i].search("ach=");
			if (result != -1) {
				ach = lines[i].substr(result + 4);
			}
			//newcoms
			if (words[0] == "play" && tutorial) {
				if (words.length == 2) {
					pool.playStatic(words[1], 0);
				}
				else if (words.length == 3) {
					if (!tutem.playing) {
						await new ScrollingText("You have a bad play command on line " + curline + ". The music isn't playing || sound could not be found.");
					}
					if (tutem.position >= Number(words[2])) {
						pool.playStatic(words[1], false);
					}
					else {
						i--;
						continue;
					}
				}
			}
			else if (words[0] == "stopsounds") {
				pool.destroy();
			}
			else if (words[0] == "wait" && tutorial) {
				await utils.sleep(Number(words[1]));
			}
			else if (words[0] == "interactive" && tutorial) {
				let params = words;
				if (params.length > 2) {
					tut_right = 0;
					tut_count = 0;
					tut_wrong = 0;
					enhanced = true;
					tut_mus = so.create(params[1]);
					tut_mus.bgtVolume = Number(params[2]);
					tut_start = Number(params[3]);
					tut_finish = Number(params[4]);
					intersounds = [];
					tut_max = Number(params[5]);
					continue;
				}
				else {
					enhanced = false;
					//icode
					first_iter = true;
					tut_mus.play();
					tut_mus.seek(tut_start);
					let go = true;
					let first_iter_count = -1;
					while (go) {
						await utils.sleep(5);
						if (input.isJustPressed(KeyEvent.DOM_VK_Q)) {
							tut_mus.stop();
							startgame(1);
							return go = false;
						}
						if (input.isJustPressed(KeyEvent.DOM_VK_Z)) {
							speech.speak(tut_count);
						}
						if (tut_count < intersounds.length) {
							if (tut_mus.position >= intersounds[tut_count].time && (intersounds[tut_count].key == 0 || first_iter == true)) {
								if (intersounds[tut_count].key == 0) {
									intersounds[tut_count].snd.stop();
									intersounds[tut_count].snd.play();
									tut_count++;
								}//key 0
								else {
									if (first_iter_count < tut_count) tut_beep.play();
									first_iter_count = tut_count;
								}//key 1 while first iter
							}//music position
						}//first iter shitt
						if (tut_count < intersounds.length) {
							if (input.isJustReleased(intersounds[tut_count].key) && intersounds[tut_count].held && !first_iter) {
								if (tut_mus.position < intersounds[tut_count].end - 75) {
									tut_right -= 2;
									intersounds[tut_count].snd.stop();
									//change
									tut_early.stop();
									tut_early.play();
									tut_count++;
									continue;
								}//the position
								else {//early
									intersounds[tut_count].snd.stop();
									//change
									tut_great.stop();
									tut_great.play();
									tut_count++;
									continue;
								}//great
							}//the length
							//held isolated
							//ok keyboard stuff
							if (intersounds[tut_count].key > 0) {
								if (input.isJustPressed(intersounds[tut_count].key) && !first_iter) {
									if (tut_mus.position >= intersounds[tut_count].time + 75) {
										//change
										tut_late.stop();
										tut_late.play();
										tut_right--;
										tut_count++;
										continue;
									}//too late
									else if (tut_mus.position <= intersounds[tut_count].time - 75) {
										//change
										tut_early.stop();
										tut_early.play();
										tut_right--;
										tut_count++;
										continue;
									}//early
									else if (tut_mus.position <= intersounds[tut_count].time - 151) {
									}
									else {
										//change
										intersounds[tut_count].snd.play();
										intersounds[tut_count].held = true;
										if (intersounds[tut_count].end == 0) {
											tut_count++;
											tut_great.stop();
											tut_great.play();
										}//not held
										tut_right++;
										continue;
									}//held
								}
							}
							//keyboard isolated
							if (tut_count == intersounds.length) tut_count = 0;
							if (intersounds[tut_count].key > 0) {
								if (intersounds[tut_count].end > 0) {
									if (input.isDown(intersounds[tut_count].key) && tut_mus.position >= intersounds[tut_count].end + 100 + keycal && !first_iter) {
										//change
										tut_late.stop();
										tut_late.play();
										intersounds[tut_count].snd.stop();
										tut_right--;
										tut_right--;
										tut_count++;
										continue;
									}
								}
								if (tut_mus.position >= intersounds[tut_count].time + 150 + keycal) {
									if (intersounds[tut_count].end == 0 || (intersounds[tut_count].end > 0 && intersounds[tut_count].held == false)) {
										//change
										if (!first_iter) {
											tut_late.stop();
											tut_late.play();
											tut_right--;
											tut_count++;
										}
										else if (first_iter) {
											tut_count++;
										}
									}
								}
							}
						}
						if (tut_mus.position >= tut_finish) {
							for (let i = 0; i < intersounds.length; i++) {
								intersounds[i].held = false;
								intersounds[i].snd.stop();
							}
							if (tut_right < tut_max) {
								tut_mus.seek(tut_start);
								first_iter = false;
								tut_count = 0;
								if (tut_right < 0) tut_right = 0;
							}//position
							else {
								//change
								tut_ap.play();
								await fade2(tut_mus);
								go = false;
								break;
							}
						}
					}
				}
			}
			else if (words[0] == "intersound" && enhanced == true) {
				let params = words;
				await preload(params[1]);
				let temp = new Intersound();
				temp.snd = so.create(params[1]);
				temp.snd.pitch = Number(params[2]);
				temp.snd.pan = Number(params[3]);
				temp.time = Number(params[4]);
				temp.key = 0;
				if (params.length >= 6) {
					//keys
					let what = params[5].split("_");
					if (what[0] == "key") {
						if (what[1] == "enter") {
							temp.key = KeyEvent.DOM_VK_RETURN;
						}
						else if (what[1] == "space") {
							temp.key = KeyEvent.DOM_VK_SPACE;
						}
						else if (what[1] == "up") {
							temp.key = KeyEvent.DOM_VK_UP;
						}
						else if (what[1] == "down") {
							temp.key = KeyEvent.DOM_VK_DOWN;
						}
						else if (what[1] == "right") {
							temp.key = KeyEvent.DOM_VK_RIGHT;
						}
						else if (what[1] == "left") {
							temp.key = KeyEvent.DOM_VK_LEFT;
						}
						else if (what[1] == "a") {
							temp.key = KeyEvent.DOM_VK_A;
						}
						else if (what[1] == "b") {
							temp.key = KeyEvent.DOM_VK_B;
						}
						else if (what[1] == "c") {
							temp.key = KeyEvent.DOM_VK_C;
						}
						else if (what[1] == "d") temp.key = KeyEvent.DOM_VK_D;
						else if (what[1] == "e") temp.key = KeyEvent.DOM_VK_E;
						else if (what[1] == "f") temp.key = KeyEvent.DOM_VK_F;
						else if (what[1] == "g") temp.key = KeyEvent.DOM_VK_G;
						else if (what[1] == "h") temp.key = KeyEvent.DOM_VK_H;
						else if (what[1] == "i") temp.key = KeyEvent.DOM_VK_I;

						else if (what[1] == "j") temp.key = KeyEvent.DOM_VK_J;

						else if (what[1] == "k") temp.key = KeyEvent.DOM_VK_K;

						else if (what[1] == "l") temp.key = KeyEvent.DOM_VK_L;

						else if (what[1] == "m") temp.key = KeyEvent.DOM_VK_M;

						else if (what[1] == "n") temp.key = KeyEvent.DOM_VK_N;

						else if (what[1] == "o") temp.key = KeyEvent.DOM_VK_O;

						else if (what[1] == "p") temp.key = KeyEvent.DOM_VK_P;
						else if (what[1] == "q") temp.key = KeyEvent.DOM_VK_Q;
						else if (what[1] == "r") temp.key = KeyEvent.DOM_VK_R;
						else if (what[1] == "s") temp.key = KeyEvent.DOM_VK_S;
						else if (what[1] == "t") temp.key = KeyEvent.DOM_VK_T;
						else if (what[1] == "u") temp.key = KeyEvent.DOM_VK_U;
						else if (what[1] == "v") temp.key = KeyEvent.DOM_VK_V;
						else if (what[1] == "w") temp.key = KeyEvent.DOM_VK_W;
						else if (what[1] == "x") temp.key = KeyEvent.DOM_VK_X;
						else if (what[1] == "y") temp.key = KeyEvent.DOM_VK_Y;
						else if (what[1] == "z") temp.key = KeyEvent.DOM_VK_Z;
						else if (what[1] == "1") temp.key = KeyEvent.DOM_VK_1;
						else if (what[1] == "2") temp.key = KeyEvent.DOM_VK_2;
						else if (what[1] == "3") temp.key = KeyEvent.DOM_VK_3;
						else if (what[1] == "4") temp.key = KeyEvent.DOM_VK_4;
						else if (what[1] == "5") temp.key = KeyEvent.DOM_VK_5;
						else if (what[1] == "6") temp.key = KeyEvent.DOM_VK_6;
						else if (what[1] == "7") temp.key = KeyEvent.DOM_VK_7;
						else if (what[1] == "8") temp.key = KeyEvent.DOM_VK_8;
						else if (what[1] == "9") temp.key = KeyEvent.DOM_VK_9;
						else if (what[1] == "0") temp.key = KeyEvent.DOM_VK_0;
						else {
							await new ScrollingText("key not recognized" + what[1] + ", for action on line " + curline + ". For more info read parser commands.txt.");
						}
					}
					//end keys
				}
				if (params.length >= 7) {
					temp.end = Number(params[6]);
				}
				intersounds.push(temp);
				continue;
			}
			else if (words[0] == "playwait" && tutorial) {
				let snd = so.create(words[1]);
				await snd.playSync();
			}
			if (words[0] == "text" && tutorial) {
				let text = "";
				for (let i = 1; i < words.length; i++) {
					text += words[i] + " ";
				}
				await new ScrollingText(text);
				tuten.stop();
				tuten.play();
			}
			else if (words[0] == "misc" && !tutorial) {
				for (let i = 1; i < words.length; i++) {
					let what = words[i].split("=");
					if (what[0] == "super") {
						super_n = Number(what[1]);
					}
					else if (what[0] == "cooldown") {
						cooltime = Number(what[1]);
					}
					else if (what[0] == "reaction") {
						timewindow = Number(what[1]) + keycal;
					}
					else if (what[0] == "ok") {
						ok_n = Number(what[1]);
					}
				}
			}
			else if (words[0] == "action" && !tutorial) {
				let pan = 0;
				type = 1;
				let endsnd;
				let pitch = 100;
				let alias;
				let time = 0;
				let volume = 0;
				let failsound = "fail_generic";
				let etime = 0;
				let bksound = "fail_generic";
				let key = 0;
				let earlysound = "fail_generic";
				let efailsound = "fail_generic";
				let kp = false;
				let latesound = "fail_generic";
				for (let i = 1; i < words.length; i++) {
					let what = words[i].split("=");
					if (what[0] == "time") {
						time = Number(what[1]);
						if (time == 0) {
							await new scrollingText("time cannot be 0. Line " + curline + ": " + lines[curline]);
						}
					}
					else if (what[0] == "end" && !tutorial) {
						type = 2;
						etime = Number(what[1]);
						if (etime == 0) {
							await new ScrollingText("end time cannot be 0. Line " + curline);
						}
					}
					else if (what[0] == "ends" && !tutorial) {
						type = 2;
						endsnd = what[1];
					}
					else if (what[0] == "volume" && !tutorial) {
						volume = Number(what[1]);
					}//volume
					else if (what[0] == "pan" && !tutorial) {
						pan = Number(what[1]);
					}//volume
					else if (what[0] == "pitch" && !tutorial) {
						pitch = Number(what[1]);
					}
					else if (what[0] == "name") {
						name = what[1];
					}
					else if (what[0] == "alias") {
						alias = what[1];
					}
					else if (what[0] == "key") {
						if (what[1] == "enter") {
							key = KeyEvent.DOM_VK_RETURN;
						}
						else if (what[1] == "space") {
							key = KeyEvent.DOM_VK_SPACE;
						}
						else if (what[1] == "up") {
							key = KeyEvent.DOM_VK_UP;
						}
						else if (what[1] == "down") {
							key = KeyEvent.DOM_VK_DOWN;
						}
						else if (what[1] == "right") {
							key = KeyEvent.DOM_VK_RIGHT;
						}
						else if (what[1] == "left") {
							key = KeyEvent.DOM_VK_LEFT;
						}
						else if (what[1] == "a") {
							key = KeyEvent.DOM_VK_A;
						}
						else if (what[1] == "b") {
							key = KeyEvent.DOM_VK_B;
						}
						else if (what[1] == "c") {
							key = KeyEvent.DOM_VK_C;
						}
						else if (what[1] == "d") key = KeyEvent.DOM_VK_D;
						else if (what[1] == "e") key = KeyEvent.DOM_VK_E;
						else if (what[1] == "f") key = KeyEvent.DOM_VK_F;
						else if (what[1] == "g") key = KeyEvent.DOM_VK_G;
						else if (what[1] == "h") key = KeyEvent.DOM_VK_H;
						else if (what[1] == "i") key = KeyEvent.DOM_VK_I;

						else if (what[1] == "j") key = KeyEvent.DOM_VK_J;

						else if (what[1] == "k") key = KeyEvent.DOM_VK_K;

						else if (what[1] == "l") key = KeyEvent.DOM_VK_L;

						else if (what[1] == "m") key = KeyEvent.DOM_VK_M;

						else if (what[1] == "n") key = KeyEvent.DOM_VK_N;

						else if (what[1] == "o") key = KeyEvent.DOM_VK_O;

						else if (what[1] == "p") key = KeyEvent.DOM_VK_P;

						else if (what[1] == "q") key = KeyEvent.DOM_VK_Q;

						else if (what[1] == "r") key = KeyEvent.DOM_VK_R;

						else if (what[1] == "s") key = KeyEvent.DOM_VK_S;

						else if (what[1] == "t") key = KeyEvent.DOM_VK_T;

						else if (what[1] == "u") key = KeyEvent.DOM_VK_U;

						else if (what[1] == "v") key = KeyEvent.DOM_VK_V;
						else if (what[1] == "w") key = KeyEvent.DOM_VK_W;
						else if (what[1] == "x") key = KeyEvent.DOM_VK_X;

						else if (what[1] == "y") key = KeyEvent.DOM_VK_Y;

						else if (what[1] == "z") key = KeyEvent.DOM_VK_Z;

						else if (what[1] == "1") key = KeyEvent.DOM_VK_1;

						else if (what[1] == "2") key = KeyEvent.DOM_VK_2;

						else if (what[1] == "3") key = KeyEvent.DOM_VK_3;

						else if (what[1] == "4") key = KeyEvent.DOM_VK_4;

						else if (what[1] == "5") key = KeyEvent.DOM_VK_5;

						else if (what[1] == "6") key = KeyEvent.DOM_VK_6;

						else if (what[1] == "7") key = KeyEvent.DOM_VK_7;

						else if (what[1] == "8") key = KeyEvent.DOM_VK_8;

						else if (what[1] == "9") key = KeyEvent.DOM_VK_9;

						else if (what[1] == "0") key = KeyEvent.DOM_VK_0;

						else {
							await new ScrollingText("key not recognized" + what[1] + ", for action on line " + curline + ". You can use space, enter, right, left, up || down, for now. For more info read parser commands.txt.");
						}
					}
					else if (what[0] == "kp") {
						kp = true;
					}
					else if (what[0] == "fail") {
						failsound = what[1];
						if (!fs.existsSync(path + failsound + ".ogg")) {
							await new ScrollingText("fail sound doesn't exist. " + failsound + ", on line " + curline);
						}
					}
					else if (what[0] == "efail") {
						efailsound = what[1];
						type = 2;
						if (!fs.existsSync(path + efailsound + ".ogg")) {
							await new ScrollingText("end fail sound for tap && hold action doesn't exist. " + efailsound + ", on line " + curline);
						}
					}
					else if (what[0] == "miss") {
						bksound = what[1];
						if (!fs.existsSync(path + bksound + ".ogg")) {
							await new ScrollingText("miss sound doesn't exist. " + bksound + ", on line " + curline);
						}
					}
					else if (what[0] == "early") {
						earlysound = what[1];
						if (!fs.existsSync(path + earlysound + ".ogg")) {
							await new ScrollingText("early sound doesn't exist. " + earlysound + ", on line " + curline);
						}
					}
					else if (what[0] == "late") {
						latesound = what[1];
						if (!fs.existsSync(path + latesound + ".ogg")) {
							await new ScrollingText("late sound doesn't exist. " + latesound + ", on line " + curline);
						}
					}
					else if (what[0] == "ach") {
						totala++;
						if (data.achievements.hasOwnProperty(ach)) {
							unlockeda++;
						}
						break;
					}
					else {
						//await new ScrollingText("You have an unknown parameter on line "+curline+": "+what[0]);
					}
				}//play for
				//fail sounds
				if (efailsound == "fail_generic" && failsound != "fail_generic")
					efailsound = failsound;
				if (earlysound == "fail_generic" && failsound != "fail_generic")
					earlysound = failsound;
				if (bksound == "fail_generic" && failsound != "fail_generic")
					bksound = failsound;
				if (latesound == "fail_generic" && failsound != "fail_generic")
					latesound = failsound;
				if (alias != "") {
					if (!presets.hasOwnProperty(alias))
						presets[alias] = lines[curline - 1];
				}
				if (type == 2 && (endsnd == "" || etime == 0)) {
					await new ScrollingText("Your tap && hold action on line " + curline + " isn't correct.");
				}
				if (time == 0) {
					await new ScrollingText("Error in command: play (sound has no time position) on line " + curline);
				}
				if (name == "") {
					await new ScrollingText("Error in command: play (sound has no defined name) on line " + curline);
				}
				if (key == 0) {
					await new ScrollingText("The action on line " + curline + " has no key.");
				}
				let temp = new Action(name, pan, pitch, volume, time, failsound, earlysound, latesound, key, alias, bksound, ach, type, etime, endsnd, efailsound, kp);
				let overlap = false;
				for (let i = 0; i < actiontimes.length; i++) {
					if (actiontimes[i] == temp.duration || actiontimes[i] == temp.end) {
						overlap = true;
						break;
					}
				}
				if (overlap) {
					await new ScrollingText("warning! You have 2 overlapping actions, last one is on line " + curline + ". This means that one of them is bound to fail. Please fix this.");
				}
				if (temp.duration != 0) actiontimes.push(temp.duration);
				if (temp.end != 0) actiontimes.push(temp.end);
				actions.push(temp);
			}//action word
			else if (words[0] == "seek" && tutorial) {
				if (words.length != 2 || Number(words[2]) > tutem.length) {
					await new ScrollingText("bad seek at line " + curline + ".");
				}
				else {
					tutem.seek(Number(words[1]));
				}
			}
			else if (words[0] == "debug" && !tutorial) {
				for (let i = 1; i < words.length; i++) {
					let what = words[i].split("=");
					if (what[0] == "seek") {
						seek = Number(what[1]);
					}
					else if (what[0] == "mode") {
						debugmode = true;
					}
				}
			}
			else if (words[0] == "play" && !tutorial) {
				let pan = 0;
				let pitch = 100;
				let time = 0;
				let volume = 0;
				let alias;
				let freq;
				let preset;
				for (let i = 1; i < words.length; i++) {
					let what = words[i].split("=");
					if (what[0] == "time") {
						time = Number(what[1]);
						if (time == 0) {
							await new ScrollingText("time cannot be 0. Line " + curline + ": " + lines[curline]);
						}
					}//time
					else if (what[0] == "ach") {
						totala++;
						if (data.achievements.hasOwnProperty(ach)) {
							unlockeda++;
						}
						break;
					}
					else if (what[0] == "volume") {
						volume = Number(what[1]);
					}//volume
					else if (what[0] == "pan") {
						pan = Number(what[1]);
					}//volume
					else if (what[0] == "pitch") {
						pitch = Number(what[1]);
					}//volume
					else if (what[0] == "name") {
						name = what[1];
					}//volume
					else if (what[0] == "fail") {
						freq = what[1];
					}//volume
					else if (what[0] == "alias") {
						preset = what[1];
					}//volume
					else if (what[0] == "require") {
						alias = what[1];
					}
					else if (what[0] == "ach") {
						break;
					}
				}//play for
				if (preset != "") {
					if (!presets.hasOwnProperty(preset))
						presets[preset] = lines[curline - 1];
				}
				if (time == 0) {
					await new ScrollingText("Error in: play (sound has no time position) on line " + curline);
				}
				if (name == "") {
					await new ScrollingText("Error in command: play (sound has no defined name) on line " + curline);
				}
				if (alias != "") {
				}
				let temp = new Snd(name, pan, pitch, volume, time, alias, ach);
				temp.failreq = freq;
				sounds.push(temp);
			}//play word
			else if (words[0] == "music" && tutorial) {
				tutem = so.create(words[1]);
				if (words.length >= 3) tutem.bgtVolume = Number(words[2]);
				if (words.length >= 4) tutem.seek(Number(words[3]));
				tutem.play();
			}
			else if (words[0] == "say" && tutorial) {
				let text = "";
				if (words.length == 1) {
					await new ScrollingText("no say text", "line " + curline + " has no tutorial say text.");
				}
				for (let i = 1; i < words.length; i++) {
					text += words[i] + " ";
				}
				speech.speak(text);
			}
			else if (words[0] == "fade" && tutorial) {
				if (tutem.playing) await fade2(tutem);
			}
			else if (words[0] == "exit" && tutorial && creatingpack) {
				mainMenu();
				return;
			}
			else if (words[0] == "stop" && tutorial) {
				tutem.stop();
			}

			else if (words[0] == "music" && !tutorial) {
				for (let i = 1; i < words.length; i++) {
					let what = words[i].split("=");
					if (what[0] == "volume") {
						lev_vol = Number(what[1]);
					}//volume
					else if (what[0] == "wait") {
						wait = Number(what[1]);
					}//volume
					else if (what[0] == "jingle") {
						jng = what[1];
						if (!fs.existsSync(path + jng + ".ogg")) {
							await new ScrollingText("music jingle not found.");
						}//volume
					}
					else if (what[0] == "perfect") {
						perfectjng = what[1];
						if (!fs.existsSync(path + perfectjng + ".ogg")) {
							await new ScrollingText("perfect sound not found.");
						}
					}//volume
					else if (what[0] == "fail") {
						failjng = what[1];
						if (!fs.existsSync(path + failjng + ".ogg")) {
							await new ScrollingText("fail music not found.");
						}
					}//volume
					else if (what[0] == "name") {
						ln = what[1];
					}
				}//music for
			}//music word
			else if (words[0] == "!" || words[0] == "@" && !tutorial) {
				let macros = words[1];
				let macrot = words[2];
				let macre = "";
				let typecheck = words[2].split(",");
				if (words[0] == "@") {
					if (words.length != 3) {
						await new ScrollingText("bad reference sintax: Line " + curline + ": A macro reference command must have 3 elements: @ macroname time");
					}
					if (!macrod.hasOwnProperty(words[1])) {
						await new ScrollingText("Bad reference: Line " + curline + ": You are referring to macro " + words[1] + ", which is unknown.");
					}
					else {
						macros = macrod[words[1]];
					}
				}
				else {
					if (words.length <= 2) {
						await new ScrollingText("bad macro, You have malformed macro sintax on line " + curline);
					}
					if (words.length > 3) {
						let built = words[1];
						macrod[words[3]] = built;
					}
				}
				let macro = macros.split(",");
				let mrte;
				let mrt = Number(macrot);
				if (mrt == 0) {
					await new ScrollingText("Macro time on line " + curline + " was either not specified || not a proper number.");
				}
				let prs;
				let timen, etimen;
				for (let i = 0; i < macro.length; i++) {
					if (presets.hasOwnProperty(macro[i])) {
						prs = presets[macro[i]];
						var diff, added, ftime, fend, eadded, ediff;
						fend = 0;
						if (i == 0) {
							timen = 0, etimen = 0;
							//get ftime
							let w = prs.split(" ");
							for (let i = 0; i < w.length; i++) {
								if (w[i].search("time=") != -1) {
									timen = i;
								}
								if (w[i].search("end=") != -1) {
									etimen = i;
								}
							}
							let p = w[timen].split("=");
							ftime = Number(p[1]);
							if (etimen != 0) {
								let p = w[etimen].split("=");
								fend = Number(p[1]);
							}
							let result = prs.search("ach=");
							if (result != -1) {
								achie = prs.substr(result + 4);
								ach = achie;
							}
							else {
								ach = ""; achie = "";
							}
							if (ach != "") {
								prs = prs.substr(1, result);
							}
							prs = prs + " time=" + mrt;
							if (fend != 0) {
								prs = prs + " time=" + mrt + " end=" + fend;
							}
							if (ach != "") {
								prs = prs + "ach=" + ach;
								totala++;
								if (data.achievements.hasOwnProperty(ach)) {
									unlockeda++;
								}
							}
							macrostuff += prs + "\r\n";
						}
						else {
							let time = 0, timen, etime = 0, etimen;
							let w = prs.split(" ");
							for (let i = 0; i < w.length; i++) {
								if (w[i].search("time=") != -1) {
									timen = i;
								}
								if (w[i].search("end=") != -1) {
									etimen = i;
									let k = w[i].split("=");
									fend = Number(k[1]);
								}
							}
							let p = w[timen].split("=");
							if (etimen == 0) fend = 0;
							time = Number(p[1]);
							if (fend != 0) {
								let p = w[etimen].split("=");
								etime = Number(p[1]);
								if (etime == 0) {
									await new ScrollingText("There is a bug with the tap hold macro programming code, let me know the contents of line " + curline + " && I will try to fix.");
								}
							}
							if (time == 0) {
								await new ScrollingText("There is a bug with the macro programming code, let me know the contents of line " + curline + " && I will try to fix.");
							}
							added = Number(time - ftime);
							diff = mrt - added;

							if (fend != 0) {
								eadded = etime - ftime;
								ediff = fend - eadded;
							}
							let result = prs.search("ach=");
							if (result != -1) {
								achie = prs.substr(result + 4);
								ach = achie;
							}
							else {
								ach = ""; achie = "";
							}
							if (ach != "") {
								prs = prs.substr(1, result);
							}
							prs = prs + " time=" + (mrt + added);
							if (fend != 0) {
								prs = prs + " end=" + (mrt + eadded);
							}
							if (ach != "") {
								prs = prs + "ach=" + ach;
								totala++;
								if (data.achievements.hasOwnProperty(ach)) {
									unlockeda++;
								}
							}
							macrostuff += prs + "\r\n";
						}
					}
					else {
						await new ScrollingText("macro error: Non existing macro preset found " + macro[i] + " on line " + curline);
					}
				}
			}
			else {
				if (lines[i][0] != "/" && i != 0) {
				}
			}
		}//each line loop
		if (tutorial) {
			tutorial = false;
			tute.play();
			if (typeof tutem !== "undefined") tutem.stop();
			startlev(olv);
			return;
		}
		the_string = macrostuff;
		//await new ScrollingText(the_string);
	}//loop twice
	so.setQueueCallback(() => {
		loadlev(lname, lev_vol);
	});
	so.loadQueue();
}//function
function get_ach(str) {
	if (!data.achievements.hasOwnProperty(str)) {
		data.achievements[str] = str;
		achs = so.create("newach");
		achs.stop();
		achs.play();
		save();
	}
}
async function loadlev(name, volume) {
	let input = new KeyboardInput();
	input.init();
	perfect = true;
	good = 0; bad = 0;
	if (musiconly) {
		unlockeda = 0;
		totala = 0;
		actions = [];
		sounds = [];
	}
	totalactions = actions.length;
	if (unlockeda < totala && com == "") {
		await new ScrollingText(strings.get("thisLevelAchievements", [unlockeda, totala]));
	}
	lasts = 100000000;
	lasta = 100000000;
	nopack();
	let finished = false;
	yespack();
	speech.speak(ln);
	music = so.create(ln);
	music.sound.once("load", async () => {
		let jing = fs.existsSync(path + jng + ".ogg");
		if (!jing && creatingpack) {
			await new ScrollingText("jingle error: level start jingle not found. If it shouldn't be named " + jng + ".ogg, make sure you define it correctly in the script by using the music jingle=... command.");
		}
		if (com == "") {
			let snd = so.create(jng);
			await snd.playSync();
		}
		music.bgtVolume = volume;
		if (musiconly) music.bgtVolume = 1;
		if (seek != 0) music.seek(seek);
		music.play();
		if (perfectrun) debugmode = true;
		let looping = true;
		await new Promise(async (resolve, reject) => {
			while (looping) {
				await utils.sleep(3);
				if (!music.playing) {
					resolve();
					break;
				}
				//do stuff
				if (lasta == 100000000 && actions.length != 0) {
					for (let i = 0; i < actions.length; i++) {
						if (actions[i].duration <= lasta) {
							if (actions[i].duration < seek) {
								continue;
							}
							lasta = actions[i].duration;
							lastan = i;
							lastak = actions[i].key;
						}
					}
				}
				//actions method
				if (cooler.elapsed >= cooltime) {
					cooldown = false;
					cooler.pause();
				}
				keys = input.keysPressed();
				if (keys.length == 1) {
					if (keys[0] == KeyEvent.DOM_VK_END && creatingpack) {
						speech.speak(music.position);
					}
					else if (keys[0] == KeyEvent.DOM_VK_Q) {
						startgame(1);
					}
					if (lasta != 100000000 && input.keysDown().length == 1) {
						if (!cooldown) {
							if (keys[0] == lastak && lasta != 100000000) {
								let distance = music.position - lasta;
								if (distance <= -timewindow * 2.5) {
									actions[lastan].badkey();
								}
								else if (distance >= -timewindow * 2.5 + 1 && distance <= -timewindow / 2 - 10) {
									actions[lastan].early();
									actions.splice(lastan, 1);
									lasta = 100000000;
									lastan = -1;
								}
								else if (distance >= timewindow / 2 && distance < timewindow / 2 + 10) {
									actions[lastan].late();
									actions.splice(lastan, 1);
									lasta = 100000000;
								}
								else {
									actions[lastan].play();
									if (actions[lastan].type == 1) {
										actions.splice(lastan, 1);
										lasta = 100000000;
									}
								}
							}
							else {
								if (actions.length > 0 && lasta != 100000000) {
									let distance = music.position - lasta;
									actions[lastan].badkey();
									if (distance > -timewindow * 3 && distance <= timewindow * 3) {
										//do nothing
									}
								}
							}
							lasta = 100000000;
						}
					}
				}
				if (lasta != 100000000 && input.isJustReleased(actions[lastan].key) && actions[lastan].type == 2 && actions[lastan].held) {
					if (!debugmode) {
						actions[lastan].stop();
						let distance = music.position - actions[lastan].end;
						if (distance <= -timewindow) {
							actions[lastan].efail();
							actions.splice(lastan, 1);
							lasta = 100000000;
						}
						else if (distance >= -timewindow + 1 && distance <= -timewindow / 2) {
							actions[lastan].efail();
							actions.splice(lastan, 1);
							lasta = 100000000;
						}
						else if (distance >= timewindow && distance < timewindow / 2 + 10) {
							actions[lastan].efail();
							actions.splice(lastan, 1);
							lasta = 100000000;
						}
						else {
							actions[lastan].release();
							actions.splice(lastan, 1);
							lasta = 100000000;
						}
					}
				}
				if (lasta != 100000000 && music.position >= actions[lastan].end && debugmode && actions[lastan].type == 2) {
					actions[lastan].release();
					actions.splice(lastan, 1);
					lasta = 100000000;
					continue;
				}
				if (lasta != 100000000) {
					if (music.position >= lasta && debugmode) {
						if (!actions[lastan].played) actions[lastan].play();
						if (actions[lastan].type == 1) {
							actions.splice(lastan, 1);
							lasta = 100000000;
						}
						continue;
					}
					if ((music.position > lasta + timewindow / 2 + 10 && actions[lastan].type == 1) || (music.position > actions[lastan].end + timewindow / 2 + 10 && (actions[lastan].type == 2 && actions[lastan].held) || (actions[lastan].type == 2 && !actions[lastan].held && music.position >= lasta + timewindow / 2 + 10))) {
						if (!debugmode) {
							if (actions[lastan].type == 1) {
								actions[lastan].fail();
							}
							if (actions[lastan].type == 2) {
								if (!actions[lastan].released) {
									if (input.isDown(actions[lastan].key)) actions[lastan].efail();
									if (!input.isDown(actions[lastan].key)) actions[lastan].fail();
								}
							}
							if (actions[lastan].type == 2) actions[lastan].stop();
							actions.splice(lastan, 1);
							lasta = 100000000;
						}
					}
				}
				//sounds player
				if (lasts == 100000000 && sounds.length != 0) {
					for (let i = 0; i < sounds.length; i++) {
						if (sounds[i].duration <= lasts) {
							if (sounds[i].duration < seek) {
								continue;
							}
							lasts = sounds[i].duration;
							lastsn = i;
						}
					}
				}
				if (music.position >= lasts && lasts != -1) {
					sounds[lastsn].play();
					sounds.splice(lastsn, 1);
					lasts = 100000000;
				}
			}//loop
		});
		await utils.sleep(wait);
		//calculate here
		if (!perfectrun && !debugmode) {
			let oldwell = 0;
			let total = good + bad;
			if (total != 0 || good != 0) {
				let wellc = 100 / total * good;
				let well = Math.ceil(wellc);
				if (well >= super_n && !perfect) {
					oldwell = well;
					well = super_n - 1;
				}
				nopack();
				strings.speak("calculating");
				pool.playStatic("calc1", false);
				com = "";
				await utils.sleep(utils.randomInt(150, 300));
				pool.playStatic("calc1", false);
				await utils.sleep(utils.randomInt(350, 600));
				pool.playStatic("calc1", false);
				await utils.sleep(utils.randomInt(650, 800));
				pool.playStatic("calc1", false);
				await utils.sleep(utils.randomInt(450, 600));
				if (good > bad) {
					pool.playStatic("calc3", false);
					await utils.sleep(utils.randomInt(1500, 3000));
				}
				else {
					pool.playStatic("calc2", false);
					await utils.sleep(utils.randomInt(1000, 2400));
				}
				yespack();
				let levjing;
				let message;
				let val;
				if (well == 100) {
					val = 4;
					levjing = so.create(perfectjng);
					if (lang == 1) message = "That was perfect! Nice!";
					if (lang == 2) message = "Genial! Lo has hecho perfecto!";
				}
				else if (well <= 99 && well >= super_n) {
					val = 3;
					levjing = so.create(superv);
					if (lang == 1) message = "Pretty good!" + well + " percent!";
					if (lang == 2) message = "Muy bien!" + well + " por ciento!";
				}
				else if (well <= super_n - 1 && well >= ok_n) {
					val = 2;
					levjing = so.create(okjng);
					if (lang == 1) message = "Well... ok. " + well + " percent.";
					if (lang == 2) message = "Bueno... Bien. " + well + " por ciento.";
				}
				else if (well < ok_n) {
					val = 1;
					levjing = so.create(failjng);
					if (lang == 1) message = "That was terrible! " + well + " percent.";
					if (lang == 2) message = "Pat�tico! Has jugado muy mal! " + well + " por ciento.";
				}
				if (oldwell != 0) {
					if (lang == 2) {
						message += ". Vaya, hiciste mal alguna parte importante... Eso no te ha ayudado. es una l�stima, porque ten�as " + well + " por ciento.";
					}
					if (lang == 1) {
						message += ". Pitty, you failed something important in this level... This will not help you. A pitty because you had " + oldwell + " percent.";
					}
				}
				await new ScrollingText(message);
				levjing.play();
				okval = val;
				if (get_level(lname) < val) {
					if (!creatingpack) set_level(lname, val);
				}
				else {
					if (get_level(lname) != 0) {
					}
				}
			}
			else {
				speech.speak("I cannot calculate your result ...");
				await utils.sleep(1000);
			}
			if (okval > 1 && last && !creatingpack) {
				let win = so.create("win_pack", true);
				await win.playSync();
				if (lang == 1) await get_ach("You beat the " + pack + " pack!");
				if (lang == 2) await get_ach("has completado el pack " + pack + "!");
			}
		}
		startgame(1);
	});
	return;
}
export async function changeRate() {
	let rate = speech.rate;
	let inp = new KeyboardInput();
	inp.init();
	strings.speak("rating");
	while (!inp.isJustPressed(KeyEvent.DOM_VK_RETURN)) {
		await utils.sleep(5);
		if (inp.isJustPressed(KeyEvent.DOM_VK_RIGHT)) {
			rate = rate + 0.25;
			speech.rate = rate;
			strings.speak("newRate");
		}
		if (inp.isJustPressed(KeyEvent.DOM_VK_LEFT)) {
			rate = rate - 0.25;
			speech.rate = rate;
			strings.speak("newRate");
		}
	}
	data.rate = speech.rate;
	save();
	st.setState(2);
}
module.exports.cooldown = cooldown;
module.exports.cooler = cooler;
module.exports.perfect = perfect;
module.exports.aliases = aliases;