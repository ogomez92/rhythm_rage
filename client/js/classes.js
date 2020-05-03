import {ScrollingText} from './scrollingText';
var main=require('./main');
import {speech} from './tts';
import {SoundHandler} from './soundHandler';
import {getAch,debugmode,perfectrun,held,good,bad,pool,path} from './main';
import {so} from './soundObject';
export let lsd;

export let lad;
export async function preload_add(filename) {
console.log(filename);
return;
let files=filename.split(",");
const fs=require('fs');
for (let i=0;i<files.length;i++) {
filename=files[i];
if(!fs.existsSync(path+filename+".ogg")){
await new ScrollingText("preload error "+filename);
return false;
}
so.enqueue(filename);
}
return true;
}
export async function preload(filename) {
const fs=require('fs');
if(!fs.existsSync(path+filename+".ogg")){
await new ScrollingText("preload sync error "+filename);
return false;
}
return new Promise((resolve,reject)=> {
so.enqueue(filename);
so.setQueueCallback(()=> {
resolve();
});
so.loadQueue();
});
}
class Snd {
constructor(n,p,i,v,t,a,achi) {
lsd=this.duration;
this.ach=achi;
this.name=n;
this.pan=p;
this.pitch=i;
this.alias=a;
this.bgtVolume=v;
this.duration=t;
preload_add(this.name);
}
async play() {
if (typeof this.alias!=="undefined") {
let aliasa=this.alias.split(",");
for (let i=0;i<aliasa.length;i++) {
if (!main.aliases.hasOwnProperty(aliasa[i])) {
if (this.failreq!="") {
let files=this.failreq.split(",");
let suc;
if (files.length==1) {
suc=pool.playStatic(files[0],false);
suc.pan=this.pan;
suc.pitch=this.pitch;
suc.bgtVolume=this.volume;
}
else {
for (let i=0;i<files.length;i++) {
suc=pool.playStatic(files[i],false);
suc.pan=this.pan;
suc.pitch=this.pitch;
suc.bgtVolume=this.volume;
}
}
}
return;
}
else {
main.aliases[aliasa[i]]=null;
}
}
}
if (this.ach!="" && !debugmode) {
await getAch(ach);
}
let files=this.name.split(",");
let suc;
if (files.length==1) {
suc=pool.playStatic(files[0],false);
suc.pan=this.pan;
suc.pitch=this.pitch;
suc.bgtVolume=this.volume;
}
else {
for (let i=0;i<files.length;i++) {
suc=pool.playStatic(files[i],false);
suc.pan=this.pan;
suc.pitch=this.pitch;
suc.bgtVolume=this.volume;
}
}

}
}
class Action {
constructor(n,p,i,v,t,f,e,l,k,a,bks,achi,ty,eti,ends,efa,kp) {
this.played=false;
this.released=false;
this.held=false;
this.killperfect=false;
this.name="";
this.apool=new SoundHandler();
this.alias="";
this.bk="";
this.pitch=100;
this.bgtVolume=0;
this.ach="";
this.failsound="";this.earlysound="";this.latesound="";this.efailsound="";
this.pan=100;
this.key="";
this.type=0;
this.end=0;
this.duration=0;
this.endsound="";
lsd=this.duration;
if (kp==true) this.killperfect=true;
this.endsound=ends;
this.name=n;
this.efailsound=efa;
this.type=ty;
this.end=eti;
this.ach=achi;
this.bk=bks;
this.alias=a;
if (typeof this.alias!=="undefined") {
//alert("action alias",alias);
}
this.pan=p;
this.pitch=i;
this.failsound=f;
this.earlysound=e;
this.latesound=l;
this.bgtVolume=v;
this.key=k;
this.duration=t;
preload_add(this.name);
preload_add(this.failsound);
preload_add(this.earlysound);
preload_add(this.latesound);
if (this.type==2) preload_add(this.efailsound);
if (this.type==2) preload_add(this.endsound);
preload_add(this.bk);
}
async play() {
this.played=true;
main.cooldown=false;
main.cooler.restart();main.cooler.pause();
good++;
this.held=true;
if (typeof this.alias!=="undefined") {
main.aliases[this.alias]="ok";
//if (debugmode and !perfectrun) rd.say("alias "+alias);
}
if (this.ach!="" && !debugmode) {
if (this.type==1) get_ach(this.ach);
}
let files=this.name.split(",");
let suc;
if (files.length==1) {
if (this.type==2) {
suc=this.apool.playStatic(files[0],false);
suc.pan=this.pan;
suc.pitch=this.pitch;
suc.bgtVolume=this.volume;
}
if (this.type==1) {
suc=pool.playStatic(files[0],false);
suc.pan=this.pan;
suc.pitch=this.pitch;
suc.bgtVolume=this.volume;
}
}
else {
for (let i=0;i<files.length;i++) {
if (this.type==2) {
suc=this.apool.playStatic(files[i],false);
suc.pan=this.pan;
suc.pitch=this.pitch;
suc.bgtVolume=this.volume;
}
if (this.type==1) {
suc=pool.playStatic(files[i],false);
suc.pan=this.pan;
suc.pitch=this.pitch;
suc.bgtVolume=this.volume;
}
}
}
}
stop() {
if (debugmode) return;
this.apool.destroy();
}
async release() {
good++;
this.held=false;
this.released=true;
if (this.type!=2) return;
this.stop();
if (typeof this.alias!=="undefined") {
main.aliases[this.alias]="ok";
}
if (typeof ach!=="undefined" && !debugmode) {
get_ach(ach);
}
let files=this.endsound.split(",");
this.apool.destroy();
let suc;
if (files.length==1) {
suc=pool.playStatic(files[0],false);
suc.pan=this.pan;
suc.pitch=this.pitch;
suc.bgtVolume=this.volume;
}
else {
for (let i=0;i<files.length;i++) {
suc=pool.playStatic(files[i],false);
suc.pan=this.pan;
suc.pitch=this.pitch;
suc.bgtVolume=this.volume;
}
}
}
async early() {
main.aliases[this.alias]=null;
main.cooldown=true;
main.cooler.restart();
bad++;
if (this.killperfect) main.perfect=false;
let suc=pool.playStatic(this.earlysound,false);
}
async badkey() {
main.cooldown=true;
main.cooler.restart();
let suc=pool.playStatic(this.bk,false);
}
async late() {
main.cooldown=true;
main.cooler.restart();
main.aliases[this.alias]=null;
bad++;
if (this.killperfect) main.perfect=false;
let suc=pool.playStatic(this.latesound,false);
}
async fail() {
main.cooldown=true;
main.cooler.restart();
bad++;
if (this.killperfect) main.perfect=false;
this.stop();
main.aliases[this.alias]=null;
let suc=pool.playStatic(this.failsound,false);
}
async efail() {
bad++;
if (this.killperfect) main.perfect=false;
main.aliases[this.alias]=null;
this.stop();
let suc=pool.playStatic(this.efailsound,false);
}
}
class Intersound {
constructor() {
this.time=0;
this.held=false;
this.key=1;
this.end=0;
this.snd="";
}
}
export {Intersound,Snd,Action}